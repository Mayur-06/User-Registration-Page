

import uuid

from app.rag.pipeline import RAGPipeline
from app.rag.embedder import Embedder
from app.rag.textchunker import TextChunker
from app.rag.generator import Generator
from app.rag.supabase_document_store import SupabaseDocumentStore
from app.memory.graph import fetch_memories, get_vector_store
from google.genai import types
TEST_USER_ID = str(uuid.uuid4()) 


def section(title: str):
    print(f"\n{'=' * 60}\n{title}\n{'=' * 60}")


def build_pipeline(user_id: str) -> RAGPipeline:
    embedder = Embedder()
    chunker = TextChunker()
    generator = Generator()
    faiss_manager = SupabaseDocumentStore(embedder, user_id=user_id)

    return RAGPipeline(
        embedder=embedder,
        faiss_manager=faiss_manager,
        generator=generator,
        chunker=chunker,
        user_id=user_id,
        fetch_memories_fn=fetch_memories,
    )
def _make_test_image_bytes() -> bytes:
    """Generate a tiny in-memory PNG for testing, no external file needed."""
    from PIL import Image
    import io

    img = Image.new("RGB", (200, 100), color=(70, 130, 180))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def main():
    section("Setup")
    print(f"Test user_id: {TEST_USER_ID}")
    rag = build_pipeline(TEST_USER_ID)
    print("✅ Pipeline built")

    section("1. Direct question — should need no tools")
    answer = rag.ask("What is the capital of France?")
    print(f"Answer: {answer.answer}")
    print(f"Sources: {answer.sources_used}")

    section("2. Seed a memory directly (bypassing extraction, for a clean test)")
    get_vector_store().add_texts(
        ["Favorite programming language is Python. Works as a backend developer."],
        metadatas=[{"user_id": TEST_USER_ID}],
    )
    print("✅ Seeded one memory fact")

    section("3. Memory-dependent question — should call search_memories")
    answer = rag.ask("What do you know about my programming background?")
    print(f"Answer: {answer.answer}")
    print(f"Sources: {answer.sources_used}")

    section("4. Seed a document directly (bypassing upload endpoint, for a clean test)")
    rag.faiss_manager.add_document(
        "test_notes.txt",
        ["The project deadline is March 15th. The budget is $50,000."],
    )
    print("✅ Seeded one document chunk")

    section("5. Document-dependent question — should call search_documents")
    answer = rag.ask("What's the project deadline according to my uploaded notes?")
    print(f"Answer: {answer.answer}")
    print(f"Sources: {answer.sources_used}")

    section("6. Web-search-dependent question — should trigger google_search")
    answer = rag.ask("What's a major news headline from today?")
    print(f"Answer: {answer.answer}")
    print(f"Sources: {answer.sources_used}")

    section("7. Combined question — may call multiple tools")
    answer = rag.ask(
        "Given my programming background, does anything in my uploaded notes seem relevant to my skills?"
    )
    print(f"Answer: {answer.answer}")
    print(f"Sources: {answer.sources_used}")

    section("8. Image input — should describe the image")
    image_bytes = _make_test_image_bytes()
    result = rag.ask(
        "What color is this image?",
        image_bytes=image_bytes,
        image_mime_type="image/png",
    )
    print(f"Answer: {result.answer}")
    print(f"Sources: {result.sources_used}")

    section("9. Follow-up referencing prior turn — tests conversation memory")
    result_1 = rag.ask("My favorite color is teal. Remember that for this conversation.")
    print(f"Answer 1: {result_1.answer}")

    # Simulate what chat.py does: build history from the prior exchange
    history = [
        types.Content(role="user", parts=[types.Part(text="My favorite color is teal. Remember that for this conversation.")]),
        types.Content(role="model", parts=[types.Part(text=result_1.answer)]),
    ]

    result_2 = rag.ask("What color did I just mention?", history=history)
    print(f"Answer 2: {result_2.answer}")

    section("Cleanup reminder")
    print(f"Test user_id used: {TEST_USER_ID}")
    print("Run these to remove test data:")
    print(f"   DELETE FROM user_memories WHERE metadata->>'user_id' = '{TEST_USER_ID}';")
    print(f"   DELETE FROM document_chunks WHERE user_id = '{TEST_USER_ID}';")


if __name__ == "__main__":
    main()