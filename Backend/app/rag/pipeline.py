import time
import json
import logging
import os
from datetime import datetime, timezone
from google import genai
from google.genai import types
from pydantic import BaseModel
import time as time_module


logger = logging.getLogger(__name__)

PIPELINE_LOG_PATH = os.path.join(os.path.dirname(__file__), "pipeline_usage_log.jsonl")

class ChatAnswer(BaseModel):
    answer: str
    sources_used: list[str] = []

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
        "question": question[:200],  # truncate — this is a usage log, not a transcript
        "round_trips": round_trips,
        "tool_calls": tool_calls,      # e.g. {"search_memories": 1, "google_search": 1}
        "elapsed_seconds": round(elapsed_seconds, 2),
        "hit_cap": hit_cap,
    }
    try:
        with open(PIPELINE_LOG_PATH, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        logger.exception("failed to write pipeline usage log")       

class ToolRelevance(BaseModel):
    needs_memory: bool
    needs_documents: bool
    needs_web_search: bool


class RAGPipeline:

    def __init__(self, embedder, faiss_manager, generator, chunker, user_id: str, fetch_memories_fn):
        self.embedder = embedder
        self.faiss_manager = faiss_manager
        self.chunker = chunker
        self.generator = generator
        self.user_id = user_id
        self.fetch_memories_fn = fetch_memories_fn

        self._client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

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

    def _tool_search_memories(self, query: str) -> str:
        memories = self.fetch_memories_fn(self.user_id, query)
        if not memories:
            return "No relevant memories found for this user."
        return "\n".join(f"- {m}" for m in memories)

    def _tool_search_documents(self, query: str) -> str:
        query_embedding = self.embedder.encode(query)
        results = self.faiss_manager.search(query_embedding, top_k=3)
        if not results:
            return "No relevant documents found."
        return "\n\n".join(r["text"] for r in results)

    def ask(self, question: str) -> ChatAnswer:
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
                "Search documents this user has uploaded. Returns the top matching "
                "chunks in a single call — do not call this tool more than once per "
                "question. If the first result doesn't fully answer the question, "
                "say so rather than retrying with a different query."
            ),
            parameters={
                "type": "object",
                "properties": {"query": {"type": "string", "description": "What to search for"}},
                "required": ["query"],
            },
        )

        try:
            relevance_response = self._generate_with_retry(
                model="gemini-3.6-flash",
                contents=f"""Classify what kind of information this question needs.

    Question: "{question}"

    needs_memory: does this need facts/preferences about the specific user
    (their role, background, likes/dislikes, things they've told us before)?
    needs_documents: does this need content from files the user has uploaded?
    needs_web_search: does this need current, real-time, or internet information?

    A question can need multiple, one, or none of these.""",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ToolRelevance,
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
                ),
            )
            relevance: ToolRelevance = relevance_response.parsed
        except Exception as e:
            logger.warning("tool relevance classification failed for user %s: %r", self.user_id, e)
            relevance = ToolRelevance(needs_memory=True, needs_documents=True, needs_web_search=True)

        function_declarations = []
        if relevance.needs_memory:
            function_declarations.append(search_memories_decl)
        if relevance.needs_documents:
            function_declarations.append(search_documents_decl)

        tool_kwargs = {}
        if function_declarations:
            tool_kwargs["function_declarations"] = function_declarations
        if relevance.needs_web_search:
            tool_kwargs["google_search"] = types.GoogleSearch()

        tools = [types.Tool(**tool_kwargs)] if tool_kwargs else []

        system_prompt = """You are a helpful and conversational AI assistant.

    You may have tools available: search_memories (facts about this specific
    user), search_documents (content from files this user uploaded), and web
    search. Only the tools relevant to this question have been made available
    to you — call them if they help answer the question, but you don't need to
    call every available tool if the question doesn't require it.

    For casual conversation, greetings, or anything answerable directly, respond
    without calling any tool."""

        contents = [
            types.Content(role="user", parts=[types.Part(text=f"{system_prompt}\n\nQuestion: {question}")])
        ]

        config = types.GenerateContentConfig(
            tools=tools if tools else None,
            temperature=0.2,
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            tool_config=types.ToolConfig(include_server_side_tool_invocations=True) if tools else None,
        )

        try:
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
                    sources = sorted(tool_call_counts.keys())
                    if self._detect_web_search_used(candidate):
                        sources.append("google_search")
                    return ChatAnswer(
                    answer=response.text.strip(),
                    sources_used=sources,
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
                    elif fc.name == "search_memories":
                        result = self._tool_search_memories(fc.args.get("query", question))
                    elif fc.name == "search_documents":
                        result = self._tool_search_documents(fc.args.get("query", question))
                    else:
                        result = f"Unknown tool: {fc.name}"

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
            sources = sorted(tool_call_counts.keys())
            return ChatAnswer(
                        answer="I wasn't able to complete that request — too many tool calls were needed.",
                        sources_used=sources,
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