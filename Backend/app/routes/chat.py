from pathlib import Path
import uuid 
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from app.rag.pipeline import RAGPipeline
from app.rag.textchunker import TextChunker
from app.rag.faiss_manager import FAISSManager
from app.rag.embedder import Embedder
from app.rag.generator import Generator
from app.rag.document_loader import DocumentLoader
from app.rag.rag_models import ChatRequest, ChatResponse
from app.routes.user import get_current_user_id  # wherever you settled this after the earlier cleanup
from app.crud import add_message, get_conversation
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# Shared, stateless components — lazy loaded on first RAG request
_shared = {}

def get_shared_components():
    if "chunker" not in _shared:
        _shared["chunker"] = TextChunker()
    if "embedder" not in _shared:
        _shared["embedder"] = Embedder()
    if "generator" not in _shared:
        _shared["generator"] = Generator()
    return _shared


def get_rag_for_user(user_id: str) -> RAGPipeline:
    shared = get_shared_components()
    faiss_manager = FAISSManager(shared["embedder"], user_id=user_id)
    return RAGPipeline(
        chunker=shared["chunker"],
        embedder=shared["embedder"],
        generator=shared["generator"],
        faiss_manager=faiss_manager,
    )


# @router.post("/chat", response_model=ChatResponse)
# def chat(request: ChatRequest, user_id: str = Depends(get_current_user_id)):
#     rag = get_rag_for_user(user_id)
#     answer = rag.ask(question=request.question)
#     return ChatResponse(answer=answer)

class ChatRequestWithConvo(BaseModel):
    question: str
    conversation_id: uuid.UUID


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequestWithConvo,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    convo = await get_conversation(db, request.conversation_id, uuid.UUID(user_id))
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    await add_message(db, request.conversation_id, "user", request.question)

    rag = get_rag_for_user(user_id)
    answer = rag.ask(question=request.question)

    await add_message(db, request.conversation_id, "bot", answer)

    return ChatResponse(answer=answer)

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
    chunks = rag.chunker.chunk_text(document)
    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Could not extract any text from this document. It may be a scanned image or empty file.",
        )
    rag.faiss_manager.add_document(file.filename, chunks)

    return {"message": "Document uploaded successfully", "filename": file.filename, "chunks": len(chunks)}


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