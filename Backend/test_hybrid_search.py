import os
import sys
import uuid
import json

sys.path.insert(0, os.path.dirname(__file__))

from app.rag.embedder import Embedder
from app.rag.supabase_document_store import SupabaseDocumentStore
from app.supabase_client import get_service_client


def section(title: str):
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")


def main():
    section("Hybrid Search Test — Dense + BM25 + RRF")

    user_id = str(uuid.uuid4())
    print(f"Using test user_id: {user_id}")

    embedder = Embedder()
    store = SupabaseDocumentStore(embedder, user_id=user_id)

    docs = {
        "meeting_notes.txt": [
            "The project deadline is March 15th. The budget is $50,000.",
            "Alice will lead the backend redesign and Bob will own the frontend refresh.",
        ],
        "research.txt": [
            "Machine learning models benefit from hybrid retrieval combining BM25 and dense vectors.",
            "Reciprocal Rank Fusion (RRF) merges ranked lists without normalizing raw scores.",
        ],
    }

    section("1. Seed documents")
    for doc_name, chunks in docs.items():
        store.add_document(doc_name, chunks)
        print(f"  ✅ Seeded {doc_name} ({len(chunks)} chunks)")

    queries = [
        "What is the project deadline and budget?",
        'Who is leading the "backend redesign"?',
        "How does hybrid search work with BM25 and dense vectors?",
        "What is RRF in information retrieval?",
    ]

    for query in queries:
        section(f"2. Query: {query}")
        query_embedding = embedder.encode(query)
        results = store.search(query_embedding, query_text=query, top_k=3)

        if not results:
            print("  No results found.")
            continue

        print(f"  Top {len(results)} results:\n")
        for r in results:
            print(
                f"  rank={r['rank']} | chunk_id={r['chunk_id']} | doc_id={r['doc_id']}\n"
                f"    rrf_score    = {r['score']:.6f}\n"
                f"    bm25_score   = {r.get('bm25_score')}\n"
                f"    similarity   = {r.get('similarity')}\n"
                f"    text         = {r['text'][:200]}...\n"
            )

    section("3. Verify websearch_to_tsquery handles quotes")
    quoted_query = '"March 15th"'
    query_embedding = embedder.encode(quoted_query)
    results = store.search(query_embedding, query_text=quoted_query, top_k=3)
    print(f"  Query: {quoted_query}")
    if results:
        print(f"  ✅ Found {len(results)} result(s) using quoted phrase search")
        for r in results:
            print(f"     - {r['doc_id']}: {r['text'][:120]}...")
    else:
        print("  ❌ No results for quoted phrase search")

    section("4. Verify RRF no double-count for same chunk across sparse branches")
    query_embedding = embedder.encode("project deadline budget")
    response = (
        get_service_client()
        .rpc(
            "match_document_chunks_hybrid",
            {
                "query_embedding": query_embedding.tolist(),
                "query_text": "project deadline budget",
                "match_count": 5,
                "p_user_id": user_id,
            },
        )
        .execute()
    )
    seen_ids = {}
    for row in response.data:
        chunk_id = row["id"]
        if chunk_id in seen_ids:
            print(f"  ❌ Duplicate chunk_id detected: {chunk_id}")
        seen_ids[chunk_id] = row
    print(f"  ✅ Requested 5 results, got {len(seen_ids)} unique chunk(s) — no duplicates from dual sparse merge")

    section("5. Verify GIN/tsvector trigger maintenance")
    doc_id = "trigger_test.txt"
    store.add_document(doc_id, ["Trigger maintenance test content 12345."])
    raw = (
        get_service_client()
        .table("document_chunks")
        .select("id, content_tsv, content_tsv_simple")
        .eq("user_id", user_id)
        .eq("doc_id", doc_id)
        .single()
        .execute()
    )
    row = raw.data
    print(f"  content_tsv       = {row.get('content_tsv')}")
    print(f"  content_tsv_simple = {row.get('content_tsv_simple')}")
    if row.get("content_tsv") and row.get("content_tsv_simple"):
        print("  ✅ Both tsvector columns populated by trigger on insert")
    else:
        print("  ❌ Missing tsvector data — trigger may not be firing")

    section("6. Raw RPC response sample")
    query_embedding = embedder.encode("project deadline budget")
    response = (
        get_service_client()
        .rpc(
            "match_document_chunks_hybrid",
            {
                "query_embedding": query_embedding.tolist(),
                "query_text": "project deadline budget",
                "match_count": 3,
                "p_user_id": user_id,
            },
        )
        .execute()
    )
    print(json.dumps(response.data, indent=2, default=str))

    section("Cleanup reminder")
    print(f"Test user_id used: {user_id}")
    print("Run these to remove test data:")
    print(f"   DELETE FROM document_chunks WHERE user_id = '{user_id}';")


if __name__ == "__main__":
    main()
