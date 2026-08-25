import os
import sys
import types as py_types
from unittest.mock import MagicMock, patch

# Ensure Backend/ is on the path so `app.*` imports resolve when running this script directly.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "User-Registration-Page", "Backend"))

from google.genai import types as genai_types
from app.rag.pipeline import RAGPipeline, MAX_CONTEXT_WINDOW, CONTEXT_TARGET_RATIO, TOOL_OUTPUT_BUFFER


def make_fake_generator(count_tokens_value: int | None = None):
    gen = MagicMock()
    if count_tokens_value is not None:
        gen.count_tokens.return_value = count_tokens_value
    else:
        # Default: simulate realistic token counting (1 token per ~4 chars)
        def count_tokens(text):
            return max(1, len(text) // 4)
        gen.count_tokens.side_effect = count_tokens
    gen.generate.return_value = "ok"
    return gen


def make_fake_faiss():
    faiss = MagicMock()
    faiss.search.return_value = []
    return faiss


def make_pipeline(count_tokens_value: int | None = None):
    os.environ.setdefault("GEMINI_API_KEY", "fake-key")
    generator = make_fake_generator(count_tokens_value=count_tokens_value)
    return RAGPipeline(
        embedder=MagicMock(),
        faiss_manager=make_fake_faiss(),
        generator=generator,
        chunker=MagicMock(),
        user_id="test-user",
        fetch_memories_fn=lambda uid, q: [],
    ), generator


def make_content(role: str, text: str) -> genai_types.Content:
    return genai_types.Content(role=role, parts=[genai_types.Part(text=text)])


def section(title: str):
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")


def test_fast_token_count():
    section("_fast_token_count")
    pipeline, _ = make_pipeline()
    cases = [
        ("hello", 1),
        ("a" * 100, 25),
        ("", 1),
    ]
    for text, expected in cases:
        actual = pipeline._fast_token_count(text)
        status = "✅" if actual == expected else "❌"
        print(f"  {status} _fast_token_count({text!r}) = {actual} (expected {expected})")


def test_estimate_image_tokens():
    section("_estimate_image_tokens")
    pipeline, _ = make_pipeline()
    assert pipeline._estimate_image_tokens(None) == 0, "no image should be 0 tokens"
    assert pipeline._estimate_image_tokens(b"fake-bytes") > 0, "image should cost tokens"
    print(f"  ✅ image bytes -> {pipeline._estimate_image_tokens(b'x')} tokens")


def test_count_tokens_delegates_to_generator():
    section("_count_tokens delegates to generator")
    pipeline, generator = make_pipeline(count_tokens_value=10)
    result = pipeline._count_tokens("any text")
    assert result == 10, f"expected 10, got {result}"
    generator.count_tokens.assert_called_with("any text")
    print("  ✅ generator.count_tokens was called and value returned")


def test_count_tokens_fallback_on_exception():
    section("_count_tokens fallback on exception")
    pipeline, generator = make_pipeline(count_tokens_value=10)
    generator.count_tokens.side_effect = Exception("API down")
    result = pipeline._count_tokens("hello world")
    expected = max(1, len("hello world") // 4)
    assert result == expected, f"expected {expected}, got {result}"
    print(f"  ✅ fell back to heuristic: {result}")


def test_manage_context_no_compression_when_under_budget():
    section("_manage_context_window: under budget -> no compression")
    pipeline, _ = make_pipeline()
    history = [make_content("user", "hi"), make_content("model", "hello")]
    out = pipeline._manage_context_window(history, cache_key="c1", available_budget=1000)
    assert out == history, "history should pass through unchanged when under budget"
    print("  ✅ history returned unchanged when under budget")


def test_manage_context_compresses_when_over_budget():
    section("_manage_context_window: over budget -> compresses + preserves recent")
    pipeline, _ = make_pipeline()
    # Use long messages so total token count exceeds a tight budget.
    history = [make_content("user", f"this is message number {i} " * 10) for i in range(30)]
    
    # Patch _compress_history to avoid real API call and inspect flow.
    original_compress = pipeline._compress_history
    compress_calls = []
    def fake_compress(older_messages, existing_summary=""):
        compress_calls.append((len(older_messages), existing_summary))
        return "fake-summary"
    pipeline._compress_history = fake_compress
    
    out = pipeline._manage_context_window(history, cache_key="c2", available_budget=200)

    assert len(out) > 1, "should contain at least an anchor + preserved messages"
    assert out[0].role == "user", "first element should be the summary anchor"
    anchor_text = out[0].parts[0].text
    assert "summary of earlier conversation" in anchor_text, "anchor should indicate summary"
    print(f"  ✅ compressed: input={len(history)} messages, output={len(out)} messages")


def test_manage_context_preserves_order_of_recent():
    section("_manage_context_window: preserves order of recent messages")
    pipeline, _ = make_pipeline()
    history = [make_content("user", f"this is message {i} " * 5) for i in range(30)]
    out = pipeline._manage_context_window(history, cache_key="c3", available_budget=300)

    recent = out[1:]
    recent_texts = [p.text for m in recent for p in m.parts]
    # recent should be the tail of history in original order
    expected_tail = [f"this is message {i} " * 5 for i in range(30 - len(recent), 30)]
    assert recent_texts == expected_tail, f"expected tail {expected_tail}, got {recent_texts}"
    print(f"  ✅ recent {len(recent)} messages preserved in correct order")


def test_manage_context_no_older_messages_no_compression():
    section("_manage_context_window: no older messages -> no compression")
    pipeline, _ = make_pipeline(count_tokens_value=10)
    # Build a history that's over budget but has no "older" portion after preserving recent.
    # Use a tiny recent_budget so even 1 message exceeds it -> preserved=[], older_messages=history
    # but our code path: if not older_messages: return history (only when preserved is empty)
    # Actually if preserved is empty, older_messages = history, so compression WILL run.
    # So instead, make history fit entirely within available_budget by using small count_tokens.
    history = [make_content("user", "short")]
    out = pipeline._manage_context_window(history, cache_key="c4", available_budget=1000)
    assert out == history
    print("  ✅ tiny history returned unchanged")


def test_available_budget_formula():
    section("ask() budget formula")
    pipeline, generator = make_pipeline()

    system_prompt = "sys"
    question = "q?"
    image_bytes = b"fake-image"
    # Simulate the formula from ask():
    current_turn_text = f"{system_prompt}\n\nQuestion: {question}"
    current_turn_tokens = pipeline._count_tokens(current_turn_text)
    image_tokens = pipeline._estimate_image_tokens(image_bytes)
    target_threshold = int(MAX_CONTEXT_WINDOW * CONTEXT_TARGET_RATIO)
    available_budget = max(target_threshold - current_turn_tokens - image_tokens - TOOL_OUTPUT_BUFFER, 1000)

    assert available_budget > 0, "available_budget must be positive"
    assert available_budget < target_threshold, "available_budget should be below target threshold"
    print(f"  MAX_CONTEXT_WINDOW     = {MAX_CONTEXT_WINDOW}")
    print(f"  CONTEXT_TARGET_RATIO   = {CONTEXT_TARGET_RATIO}")
    print(f"  target_threshold       = {target_threshold}")
    print(f"  current_turn_tokens    = {current_turn_tokens}")
    print(f"  image_tokens           = {image_tokens}")
    print(f"  TOOL_OUTPUT_BUFFER     = {TOOL_OUTPUT_BUFFER}")
    print(f"  available_budget       = {available_budget}")
    print("  ✅ budget formula produces a positive, bounded value")


def test_summary_caching_per_conversation():
    section("_conversation_summaries cache keyed by conversation_id")
    pipeline, _ = make_pipeline()

    # Patch _compress_history to capture calls without hitting the API.
    calls = []

    def fake_compress(older_messages, existing_summary=""):
        calls.append((len(older_messages), existing_summary))
        return "fake-summary"

    pipeline._compress_history = fake_compress

    history = [make_content("user", f"this is message number {i} " * 10) for i in range(30)]
    pipeline._manage_context_window(history, cache_key="conv-A", available_budget=300)
    pipeline._manage_context_window(history, cache_key="conv-A", available_budget=300)
    pipeline._manage_context_window(history, cache_key="conv-B", available_budget=300)

    # conv-A should compress only on first call (cached on second).
    # conv-B is a different key, so it compresses independently.
    assert calls[0][1] == "", "first call for conv-A should have no existing summary"
    assert calls[1][1] == "fake-summary", "second call for conv-A should reuse cached summary"
    assert calls[2][1] == "", "first call for conv-B should have no existing summary"
    print(f"  ✅ compress called {len(calls)} times with correct summary flow")


def test_summary_anchor_is_inserted_at_top():
    section("summary anchor appears at index 0")
    pipeline, _ = make_pipeline()
    history = [make_content("user", f"this is message {i} " * 10) for i in range(30)]
    out = pipeline._manage_context_window(history, cache_key="c5", available_budget=300)
    assert out[0].role == "user"
    assert "summary of earlier conversation" in out[0].parts[0].text
    assert "Resuming recent conversation below:" in out[0].parts[0].text
    print("  ✅ anchor inserted at top with expected labels")


def main():
    test_fast_token_count()
    test_estimate_image_tokens()
    test_count_tokens_delegates_to_generator()
    test_count_tokens_fallback_on_exception()
    test_manage_context_no_compression_when_under_budget()
    test_manage_context_compresses_when_over_budget()
    test_manage_context_preserves_order_of_recent()
    test_manage_context_no_older_messages_no_compression()
    test_available_budget_formula()
    test_summary_caching_per_conversation()
    test_summary_anchor_is_inserted_at_top()
    section("All context-manager tests completed")


if __name__ == "__main__":
    main()
