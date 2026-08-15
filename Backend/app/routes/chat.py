from pathlib import Path
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends

from app.rag.pipeline import RAGPipeline
from app.rag.textchunker import TextChunker
from app.rag.faiss_manager import FAISSManager
from app.rag.embedder import Embedder
from app.rag.generator import Generator
from app.rag.document_loader import DocumentLoader
from app.rag.rag_models import ChatRequest, ChatResponse
from app.routes.user import get_current_user_id  # wherever you settled this after the earlier cleanup

router = APIRouter()

# Shared, stateless components — built once
_shared = {
    "chunker": TextChunker(),
    "embedder": Embedder(),
    "generator": Generator(),
}


def get_rag_for_user(user_id: str) -> RAGPipeline:
    faiss_manager = FAISSManager(_shared["embedder"], user_id=user_id)
    return RAGPipeline(
        chunker=_shared["chunker"],
        embedder=_shared["embedder"],
        generator=_shared["generator"],
        faiss_manager=faiss_manager,
    )


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    answer = rag.ask(question=request.question)
    return ChatResponse(answer=answer)


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    user_dir = Path("documents") / user_id
    user_dir.mkdir(parents=True, exist_ok=True)
    file_path = user_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    loader = DocumentLoader(str(file_path))
    document = loader.load()

    rag = get_rag_for_user(user_id)
    chunks = rag.chunker.chunk_text(document)
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