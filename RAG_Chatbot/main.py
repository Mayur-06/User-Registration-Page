from dotenv import load_dotenv
load_dotenv()


from contextlib import asynccontextmanager
from fastapi import HTTPException, FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil

from Backend.app.rag.pipeline import RAGPipeline
from Backend.app.rag.textchunker import TextChunker
from Backend.app.rag.faiss_manager import FAISSManager
from Backend.app.rag.embedder import Embedder
from Backend.app.rag.document_loader import DocumentLoader
from Backend.app.rag.generator import Generator
from Backend.app.rag.rag_models import ChatRequest, ChatResponse, HealthResponse
from auth import get_current_user_id

rag = None
shared = {}


# UPLOAD_DIR = Path("documents")
# UPLOAD_DIR.mkdir(exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading shared components...")
    shared["chunker"] = TextChunker()
    shared["embedder"] = Embedder()
    shared["generator"] = Generator()
    print("Ready!")
    yield
    print("Shutting down...")

app = FastAPI(
    title="RAG Chatbot API",
    version="1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_rag_for_user(user_id: str) -> RAGPipeline:
    """Build a per-user RAG pipeline pointed at that user's own FAISS index."""
    faiss_manager = FAISSManager(shared["embedder"], user_id=user_id)
    return RAGPipeline(
        chunker=shared["chunker"],
        embedder=shared["embedder"],
        generator=shared["generator"],
        faiss_manager=faiss_manager,
    )

@app.get("/health", response_model=HealthResponse)
def health():

    return HealthResponse(
        status="healthy"
    )

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    answer = rag.ask(question=request.question)
    return ChatResponse(answer=answer)

@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
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

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "chunks": len(chunks),
    }


@app.get("/documents")
def list_documents(user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    documents = rag.faiss_manager.list_documents()
    return {"documents": documents, "count": len(documents)}


@app.delete("/documents/{filename}")
def delete_document(filename: str, user_id: str = Depends(get_current_user_id)):
    rag = get_rag_for_user(user_id)
    removed_chunks = rag.faiss_manager.delete_document(filename)
    if removed_chunks == 0:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"message": "Document deleted successfully.", "filename": filename, "chunks_removed": removed_chunks}