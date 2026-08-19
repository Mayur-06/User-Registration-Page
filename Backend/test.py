"""
Standalone smoke test for the memory layer.
Run from the Backend/ project root:

    python test_memory.py

Checks:
1. Supabase client + credentials work
2. fetch_memories() can query the table (empty is fine on first run)
3. evaluate_and_save_memory() correctly identifies a durable fact and saves it
4. evaluate_and_save_memory() correctly SKIPS a one-off question
5. fetch_memories() now retrieves the fact that was just saved
"""

import time
import uuid

from app.memory.graph import fetch_memories, evaluate_and_save_memory, get_vector_store

TEST_USER_ID = str(uuid.uuid4())  # fake user, isolated from real data


def section(title: str):
    print(f"\n{'=' * 60}\n{title}\n{'=' * 60}")


def main():
    section("1. Vector store connectivity")
    try:
        store = get_vector_store()
        print("✅ SupabaseVectorStore initialized OK")
    except Exception as e:
        print(f"❌ Failed to initialize vector store: {e}")
        print("   Check SUPABASE_URL / SUPABASE_SERVICE_KEY in .env")
        return

    section("2. fetch_memories() on empty user (should return [])")
    memories = fetch_memories(TEST_USER_ID, "What do you know about me?")
    print(f"Result: {memories}")
    assert memories == [], "Expected empty list for a brand-new user_id"
    print("✅ Empty fetch behaves correctly")

    section("3. evaluate_and_save_memory() — durable fact (SHOULD save)")
    fact_message = "I'm a Python developer and I prefer dark mode in every app I use."
    print(f"Message: {fact_message!r}")
    evaluate_and_save_memory(TEST_USER_ID, fact_message)
    print("(check logs above for save confirmation or errors)")

    section("4. evaluate_and_save_memory() — one-off question (should NOT save)")
    question_message = "What's the weather like today?"
    print(f"Message: {question_message!r}")
    evaluate_and_save_memory(TEST_USER_ID, question_message)
    print("(should log nothing saved — verify manually in Supabase table)")

    section("5. fetch_memories() should now retrieve the saved fact")
    print("Waiting 2s for the embedding write to settle...")
    time.sleep(2)
    memories = fetch_memories(TEST_USER_ID, "What programming language do I use?")
    print(f"Result: {memories}")
    if memories:
        print("✅ Retrieved saved memory successfully")
    else:
        print("❌ No memory retrieved — check Supabase table directly:")
        print(f"   SELECT * FROM user_memories WHERE user_id = '{TEST_USER_ID}';")

    section("Cleanup reminder")
    print(f"Test user_id used: {TEST_USER_ID}")
    print("Run this in Supabase SQL editor to remove test data:")
    print(f"   DELETE FROM user_memories WHERE user_id = '{TEST_USER_ID}';")


if __name__ == "__main__":
    main()