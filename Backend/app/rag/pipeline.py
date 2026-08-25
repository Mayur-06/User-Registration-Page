import time
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from google import genai
from google.genai import types
from pydantic import BaseModel
import time as time_module
from app.crud import get_messages


logger = logging.getLogger(__name__)

PIPELINE_LOG_PATH = os.path.join(os.path.dirname(__file__), "pipeline_usage_log.jsonl")
DOCUMENT_SEARCH_LOG_PATH = os.path.join(os.path.dirname(__file__), "document_search_log.jsonl")

MAX_CONTEXT_WINDOW = 1_048_576  # 1M tokens — adjust to match the active Gemini model window
CONTEXT_TARGET_RATIO = 0.8
TOOL_OUTPUT_BUFFER = 4000       # reserve space for potential tool outputs during the turn
IMAGE_TOKEN_ESTIMATE = 258
RECENT_TURNS_TO_PRESERVE = 4
SUMMARY_MODEL = "gemini-3.6-flash"

_conversation_summaries: dict[str, str] = {}

class ChatAnswer(BaseModel):
    answer: str
    sources_used: list[str] = []
    sources_called: list[str] = []
    sources_available: list[str] = []

def _log_pipeline_usage(
    user_id: str,
    question: str,
    round_trips: int,
    tool_calls: dict,
    elapsed_seconds: float,
    hit_cap: bool,
) -> None:
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "question": question[:200],
        "round_trips": round_trips,
        "tool_calls": tool_calls,
        "elapsed_seconds": round(elapsed_seconds, 2),
        "hit_cap": hit_cap,
    }
    try:
        with open(PIPELINE_LOG_PATH, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        logger.exception("failed to write pipeline usage log")


def _log_document_search(
    user_id: str,
    question: str,
    results: list[dict],
) -> None:
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "question": question[:200],
        "chunks_count": len(results),
        "chunks": [
            {
                "chunk_id": r.get("chunk_id"),
                "doc_id": r.get("doc_id"),
                "rank": r.get("rank"),
                "rrf_score": r.get("score"),
                "bm25_score": r.get("bm25_score"),
                "similarity": r.get("similarity"),
                "text": r.get("text", "")[:500],
            }
            for r in results
        ],
    }
    try:
        with open(DOCUMENT_SEARCH_LOG_PATH, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        logger.exception("failed to write document search log")       

class RAGPipeline:

    def __init__(self, embedder, faiss_manager, generator, chunker, user_id: str, fetch_memories_fn):
        self.embedder = embedder
        self.faiss_manager = faiss_manager
        self.chunker = chunker
        self.generator = generator
        self.user_id = user_id
        self.fetch_memories_fn = fetch_memories_fn

        self._client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    def _count_tokens(self, text: str) -> int:
        try:
            return self.generator.count_tokens(text)
        except Exception:
            logger.warning("token count estimation failed, using character heuristic")
            return max(1, len(text) // 4)

    def _fast_token_count(self, text: str) -> int:
        return max(1, len(text) // 4)

    def _estimate_image_tokens(self, image_bytes: bytes | None) -> int:
        if not image_bytes:
            return 0
        return IMAGE_TOKEN_ESTIMATE

    def _compress_history(self, older_messages: list[types.Content], existing_summary: str = "") -> str:
        texts = []
        for msg in older_messages:
            for part in msg.parts:
                if part.text:
                    texts.append(f"{msg.role}: {part.text}")

        history_block = "\n\n".join(texts)

        prompt = (
            "You are a context compression engine. Summarize the following older conversation messages "
            "concisely, preserving all important facts, user preferences, decisions, constraints, and context. "
            "Be thorough but compact.\n\n"
        )
        if existing_summary:
            prompt += f"Existing summary to extend:\n{existing_summary}\n\n"
        prompt += f"New messages to compress:\n{history_block}\n\nUpdated summary:"

        try:
            response = self._client.models.generate_content(
                model=SUMMARY_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.1),
            )
            summary = response.text.strip()
            return summary if summary else existing_summary or history_block[:2000]
        except Exception as e:
            logger.error("context summarization failed: %r", e)
            return existing_summary or history_block[:2000]

    def _manage_context_window(self, history: list[types.Content], cache_key: str, available_budget: int) -> list[types.Content]:
        if not history:
            return history

        all_text = " ".join(
            part.text for msg in history for part in msg.parts if part.text
        )
        total_tokens = self._count_tokens(all_text)

        if total_tokens <= available_budget:
            return history

        logger.info(
            "context window exceeded: %d tokens > %d available budget, compressing history",
            total_tokens, available_budget,
        )

        recent_budget = int(available_budget * 0.4)
        preserved = []
        recent_tokens = 0
        for msg in reversed(history):
            msg_text = " ".join(part.text for part in msg.parts if part.text)
            msg_tokens = self._fast_token_count(msg_text)
            if recent_tokens + msg_tokens > recent_budget:
                break
            preserved.insert(0, msg)
            recent_tokens += msg_tokens

        older_messages = history[:-len(preserved)] if preserved else history

        if not older_messages:
            return history

        existing_summary = _conversation_summaries.get(cache_key, "")
        new_summary = self._compress_history(older_messages, existing_summary)
        _conversation_summaries[cache_key] = new_summary

        anchor = types.Content(
            role="user",
            parts=[types.Part(
                text=(
                    "[System context — summary of earlier conversation:]\n"
                    f"{new_summary}\n\n"
                    "[Resuming recent conversation below:]"
                )
            )],
        )

        return [anchor] + preserved

    def _generate_with_retry(self, **kwargs):
        max_retries = 3
        for attempt in range(max_retries):
            try:
                return self._client.models.generate_content(**kwargs)
            except genai.errors.ServerError as e:
                if attempt == max_retries - 1:
                    raise
                wait = 2 ** attempt  # 1s, 2s, 4s
                logger.warning("Gemini API unavailable (attempt %d/%d), retrying in %ds: %s", attempt + 1, max_retries, wait, e)
                time_module.sleep(wait)    

    def _detect_web_search_used(self, candidate) -> bool:
        grounding = getattr(candidate, "grounding_metadata", None)
        if grounding is None:
            return False
        # grounding_metadata is populated (has search queries or grounding chunks)
        # only when google_search actually fired for this turn.
        return bool(getattr(grounding, "web_search_queries", None)) or bool(
            getattr(grounding, "grounding_chunks", None)
        ) 

    def _tool_search_memories(self, query: str) -> tuple[str, bool]:
        memories = self.fetch_memories_fn(self.user_id, query)
        if not memories:
            return "No relevant memories found for this user.", False
        return "\n".join(f"- {m}" for m in memories), True

    def _tool_search_documents(self, query: str) -> tuple[str, bool]:
        query_embedding = self.embedder.encode(query)
        results = self.faiss_manager.search(query_embedding, query_text=query, top_k=3, query_expansion=True)
        _log_document_search(self.user_id, query, results)
        if not results:
            return "No relevant documents found.", False
        return "\n\n".join(r["text"] for r in results), True

    async def _build_history_contents(db, conversation_id: uuid.UUID) -> list[types.Content]:
        messages = await get_messages(db, conversation_id)
        history = []
        for msg in messages:
            role = "user" if msg.role == "user" else "model"
            history.append(types.Content(role=role, parts=[types.Part(text=msg.text)]))
        return history

    def ask(
        self,
        question: str,
        image_bytes: bytes | None = None,
        image_mime_type: str = "image/jpeg",
        history: list[types.Content] | None = None,
        conversation_id: str | None = None,
    ) -> ChatAnswer:
        start_time = time.monotonic()
        tool_call_counts: dict[str, int] = {}
        round_trips = 0
        hit_cap = False

        MAX_ROUND_TRIPS = 5
        MAX_CALLS_PER_TOOL = 2

        search_memories_decl = types.FunctionDeclaration(
            name="search_memories",
            description=(
                "Search stored long-term facts and preferences about this specific "
                "user (name, occupation, likes/dislikes, ongoing constraints). "
                "Returns ALL relevant memories in a single call — do not call this "
                "tool more than once per question, even if the results seem brief."
            ),
            parameters={
                "type": "object",
                "properties": {"query": {"type": "string", "description": "What to search for"}},
                "required": ["query"],
            },
        )

        search_documents_decl = types.FunctionDeclaration(
            name="search_documents",
            description=(
                "Search through the user's uploaded files, historical attachments, "
                "and custom knowledge base. Returns the top matching chunks in a "
                "single call — do not call this tool more than once per question. "
                "If the first result doesn't fully answer the question, say so "
                "rather than retrying with a different query."
            ),
            parameters={
                "type": "object",
                "properties": {"query": {"type": "string", "description": "What to search for"}},
                "required": ["query"],
            },
        )

        has_documents = bool(self.faiss_manager.list_documents())
        has_image = image_bytes is not None

        search_memories_available = True
        search_documents_available = has_documents or has_image
        web_search_available = True

        function_declarations = [search_memories_decl]
        if search_documents_available:
            function_declarations.append(search_documents_decl)

        tool_kwargs = {}
        if function_declarations:
            tool_kwargs["function_declarations"] = function_declarations
        tool_kwargs["google_search"] = types.GoogleSearch()

        tools = [types.Tool(**tool_kwargs)] if tool_kwargs else []

        document_hint = ""
        if has_documents or has_image:
            document_hint = (
                "The user has uploaded files or attachments. "
                "When presented with ambiguous queries, location identification, "
                "or questions that may exist in personal notes or uploaded files, "
                "query search_documents first before answering from general knowledge.\n"
            )

        system_prompt = f"""You are a helpful and conversational AI assistant.

You have access to the following tools:
- search_memories: facts and preferences about this specific user
- search_documents: content from the user's uploaded files and knowledge base
- web search: current, real-time, or internet information

{document_hint}
When presented with ambiguous user queries or location identification that may exist in personal notes or uploaded files, query search_documents first.

For casual conversation, greetings, or anything answerable directly, respond
without calling any tool.

CRITICAL INSTRUCTION FOR NUMERICAL DATA:
- Search the provided context specifically for numerical figures, metrics, rates, dates, and amounts.
- If a exact number, percentage, or currency figure exists in the context related to the user's question, you MUST explicitly include that exact number in your response.
- Do NOT round, estimate, or omit specific digits provided in the source text.
- If a number is requested but truly absent from context, state: "The document does not specify a value for [X]."""

        parts = [types.Part(text=f"{system_prompt}\n\nQuestion: {question}")]
        if image_bytes:
            parts.append(types.Part.from_bytes(data=image_bytes, mime_type=image_mime_type))

        cache_key = conversation_id or self.user_id
        current_turn_text = f"{system_prompt}\n\nQuestion: {question}"
        current_turn_tokens = self._count_tokens(current_turn_text)
        image_tokens = self._estimate_image_tokens(image_bytes)

        target_threshold = int(MAX_CONTEXT_WINDOW * CONTEXT_TARGET_RATIO)
        available_budget = max(target_threshold - current_turn_tokens - image_tokens - TOOL_OUTPUT_BUFFER, 1000)

        managed_history = self._manage_context_window(history or [], cache_key=cache_key, available_budget=available_budget)
        contents = managed_history + [types.Content(role="user", parts=parts)]

        config = types.GenerateContentConfig(
            tools=tools if tools else None,
            temperature=0.2,
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            tool_config=types.ToolConfig(include_server_side_tool_invocations=True) if tools else None,
        )

        try:
            tool_found_results: dict[str, bool] = {}
            for i in range(MAX_ROUND_TRIPS):
                round_trips = i + 1
                response = self._generate_with_retry(
                    model="gemini-3.6-flash",
                    contents=contents,
                    config=config,
                )

                candidate = response.candidates[0]
                function_calls = [
                    part.function_call
                    for part in candidate.content.parts
                    if part.function_call is not None
                ]

                if not function_calls:
                    sources_available = []
                    if search_memories_available:
                        sources_available.append("search_memories")
                    if search_documents_available:
                        sources_available.append("search_documents")
                    if web_search_available:
                        sources_available.append("google_search")

                    sources_used = [
                        src for src, found in tool_found_results.items() if found
                    ]
                    if self._detect_web_search_used(candidate):
                        sources_used.append("google_search")
                        tool_found_results["google_search"] = True

                    sources_called = list(tool_call_counts.keys())
                    if self._detect_web_search_used(candidate):
                        sources_called.append("google_search")

                    return ChatAnswer(
                        answer=response.text.strip(),
                        sources_used=sorted(set(sources_used)),
                        sources_called=sorted(set(sources_called)),
                        sources_available=sorted(sources_available),
                    )

                contents.append(candidate.content)

                tool_response_parts = []
                for fc in function_calls:
                    tool_call_counts[fc.name] = tool_call_counts.get(fc.name, 0) + 1

                    if tool_call_counts[fc.name] > MAX_CALLS_PER_TOOL:
                        result = (
                            f"You've already called {fc.name} the maximum number of "
                            f"times for this question. Use the results you already have."
                        )
                        tool_found_results[fc.name] = tool_found_results.get(fc.name, False)
                    elif fc.name == "search_memories":
                        result, found = self._tool_search_memories(fc.args.get("query", question))
                        tool_found_results["search_memories"] = tool_found_results.get("search_memories", False) or found
                    elif fc.name == "search_documents":
                        result, found = self._tool_search_documents(fc.args.get("query", question))
                        tool_found_results["search_documents"] = tool_found_results.get("search_documents", False) or found
                    else:
                        result = f"Unknown tool: {fc.name}"
                        tool_found_results[fc.name] = tool_found_results.get(fc.name, False)

                    tool_response_parts.append(
                        types.Part(
                            function_response=types.FunctionResponse(
                                name=fc.name,
                                response={"result": result},
                                id=getattr(fc, "id", None),
                            )
                        )
                    )

                contents.append(types.Content(role="user", parts=tool_response_parts))

            hit_cap = True
            sources_available = []
            if search_memories_available:
                sources_available.append("search_memories")
            if search_documents_available:
                sources_available.append("search_documents")
            if web_search_available:
                sources_available.append("google_search")

            sources_used = [src for src, found in tool_found_results.items() if found]
            sources_called = list(tool_call_counts.keys())
            return ChatAnswer(
                        answer="I wasn't able to complete that request — too many tool calls were needed.",
                        sources_used=sorted(set(sources_used)),
                        sources_called=sorted(set(sources_called)),
                        sources_available=sorted(sources_available),
                    )
        finally:
            elapsed = time.monotonic() - start_time
            _log_pipeline_usage(
                self.user_id, question, round_trips, tool_call_counts, elapsed, hit_cap,
            )
            if elapsed > 8.0:
                logger.warning(
                    "slow /chat response for user %s: %.2fs, %d round trips, tools=%s",
                    self.user_id, elapsed, round_trips, tool_call_counts,
                )