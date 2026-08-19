import json
import logging
import os
from typing import TypedDict

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore

from app.supabase_client import get_client

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GEMINI_API_KEY,
)

eval_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GEMINI_API_KEY,
)

_vector_store: SupabaseVectorStore | None = None


def get_vector_store() -> SupabaseVectorStore:
    global _vector_store
    if _vector_store is None:
        _vector_store = SupabaseVectorStore(
            client=get_client(),
            embedding=embeddings,
            table_name="user_memories",
            query_name="match_user_memories",
        )
    return _vector_store


class MemoryState(TypedDict):
    user_id: str
    question: str
    memories: list[str]
    should_save: bool
    fact_to_save: str


def fetch_memories(user_id: str, question: str) -> list[str]:
    try:
        results = get_vector_store().similarity_search(
            question, k=3, filter={"user_id": user_id},
        )
        return [r.page_content for r in results]
    except Exception:
        logger.exception("memory fetch failed, continuing without memories")
        return []


def evaluate_and_save_memory(user_id: str, question: str) -> None:
    """Runs as a background task after the response is already sent."""
    eval_prompt = f"""Determine if this message contains a durable personal fact
or preference worth remembering long-term (name, role, goals, likes/dislikes,
constraints). One-off questions are NOT durable facts.

Message: "{question}"

Respond with ONLY valid JSON, no markdown fences:
{{"should_save": true or false, "fact": "concise extracted fact, or empty string"}}"""

    try:
        raw = eval_llm.invoke(eval_prompt).content.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(raw)
    except Exception:
        logger.warning("memory eval failed or returned non-JSON for user %s", user_id)
        return

    if parsed.get("should_save") and parsed.get("fact"):
        try:
            get_vector_store().add_texts(
                [parsed["fact"]], metadatas=[{"user_id": user_id}],
            )
        except Exception:
            logger.exception("failed to save memory for user %s", user_id)