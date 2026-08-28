from pathlib import Path
import uuid 
import shutil
import json
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, BackgroundTasks
from pydantic import BaseModel
from app.rag.pipeline import RAGPipeline
from app.rag.textchunker import TextChunker
from fastapi import Form
from google.genai import types

from app.rag.embedder import Embedder
from app.rag.generator import Generator
from app.rag.document_loader import DocumentLoader
from app.rag.rag_models import ChatResponse
from app.routes.user import get_current_user_id  # wherever you settled this after the earlier cleanup
from app.crud import add_message, get_conversation
from app.db import get_db
from app.memory.graph import fetch_memories, evaluate_and_save_memory
from sqlalchemy.ext.asyncio import AsyncSession
from app.rag.supabase_document_store import SupabaseDocumentStore
from app.memory.graph import fetch_memories
from app.crud import get_messages
from app.cloudinary_client import cloudinary
import cloudinary.uploader

router = APIRouter()

# Shared, stateless components — lazy loaded on first RAG request
_shared = {}

def get_shared_components():
    if "embedder" not in _shared:
        _shared["embedder"] = Embedder()
    if "generator" not in _shared:
        _shared["generator"] = Generator()
    return _shared


def get_rag_for_user(user_id: str) -> RAGPipeline:
    shared = get_shared_components()
    faiss_manager = SupabaseDocumentStore(shared["embedder"], user_id=user_id)
    return RAGPipeline(
        embedder=shared["embedder"],
        generator=shared["generator"],
        faiss_manager=faiss_manager,
        user_id=user_id,
        fetch_memories_fn=fetch_memories,
    )

async def _build_history_contents(db: AsyncSession, conversation_id: uuid.UUID) -> list[types.Content]:
    messages = await get_messages(db, conversation_id)
    history = []
    for msg in messages:
        role = "user" if msg.role == "user" else "model"
        history.append(types.Content(role=role, parts=[types.Part(text=msg.text)]))
    return history

class ChatRequestWithConvo(BaseModel):
    question: str
    conversation_id: uuid.UUID


@router.post("/chat", response_model=ChatResponse)
async def chat(
    background_tasks: BackgroundTasks,
    question: str = Form(...),
    conversation_id: uuid.UUID = Form(...),
    image: UploadFile | None = File(None),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    convo = await get_conversation(db, conversation_id, uuid.UUID(user_id))
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    image_bytes = None
    image_url = None
    image_mime_type = "image/jpeg"
    if image is not None:
        allowed_image_types = {"image/jpeg", "image/png", "image/webp"}
        if image.content_type not in allowed_image_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image type: {image.content_type}. Only JPG, PNG, and WEBP are supported.",
            )
        image_bytes = await image.read()
        if len(image_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image must be under 5MB.")
        image_mime_type = image.content_type

        upload_result = cloudinary.uploader.upload(
            image_bytes, folder=f"chat_images/{user_id}", resource_type="image",
        )
        image_url = upload_result["secure_url"]

    history = await _build_history_contents(db, conversation_id)

    await add_message(db, conversation_id, "user", question, image_url=image_url)

    rag = get_rag_for_user(user_id)

    result = rag.ask(
        question=question,
        image_bytes=image_bytes,
        image_mime_type=image_mime_type,
        history=history,
        conversation_id=str(conversation_id),
    )
    
    await add_message(
        db,
        conversation_id,
        "bot",
        result.answer,
        sources_used=json.dumps(result.sources_used) if result.sources_used else None,
        sources_called=json.dumps(result.sources_called) if result.sources_called else None,
        sources_available=json.dumps(result.sources_available) if result.sources_available else None,
    )

    memory_input = (f"{question}\n\n[Assistant's response, which may describe an uploaded image]: {result.answer}"
    if image_bytes
        else question)
    
    background_tasks.add_task(evaluate_and_save_memory, user_id, memory_input)

    return ChatResponse(answer=result.answer, sources_used=result.sources_used, sources_called=result.sources_called, sources_available=result.sources_available)


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    filename = file.filename.lower()
    allowed_extensions = (".pdf", ".txt", ".csv", ".docx", ".doc")
    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.filename}. Only PDF, TXT, CSV, DOCX, and DOC files are supported.",
        )

    user_dir = Path("documents") / user_id
    user_dir.mkdir(parents=True, exist_ok=True)
    file_path = user_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        loader = DocumentLoader(str(file_path))
        document = loader.load()
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read {file.filename}: {str(exc)}",
        )

    rag = get_rag_for_user(user_id)
    if not document:
        raise HTTPException(
            status_code=400,
            detail="Could not extract any text from this document. It may be a scanned image or empty file.",
        )
    chunks_added = rag.faiss_manager.add_document(file.filename, document)

    return {"message": "Document uploaded successfully", "filename": file.filename, "chunks": chunks_added}


@router.get("/documents")
def list_documents(user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    documents = rag.faiss_manager.list_documents()
    return {"documents": documents, "count": len(documents)}


@router.delete("/documents/{filename}")
def delete_document(filename: str, user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    removed_chunks = rag.faiss_manager.delete_document(filename)
    if removed_chunks == 0:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"message": "Document deleted successfully.", "filename": filename, "chunks_removed": removed_chunks}