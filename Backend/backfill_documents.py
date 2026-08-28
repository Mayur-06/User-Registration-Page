import os
import sys
import argparse
import uuid

sys.path.insert(0, os.path.dirname(__file__))

from app.rag.embedder import Embedder
from app.rag.supabase_document_store import SupabaseDocumentStore
from app.rag.document_loader import DocumentLoader


def backfill_user_documents(user_id: str, doc_dir: str | None = None):
    embedder = Embedder()
    store = SupabaseDocumentStore(embedder, user_id=user_id)

    existing_docs = store.list_documents()
    print(f"Found {len(existing_docs)} documents for user {user_id}")

    if not existing_docs:
        print("Nothing to backfill.")
        return

    for doc_name in existing_docs:
        print(f"\nRe-ingesting: {doc_name}")
        if doc_dir:
            doc_path = os.path.join(doc_dir, doc_name)
        else:
            doc_path = doc_name

        if not os.path.exists(doc_path):
            print(f"  SKIP: file not found at {doc_path}")
            continue

        deleted = store.delete_document(doc_name)
        print(f"  Deleted {deleted} old chunks")

        try:
            loader = DocumentLoader(doc_path)
            document = loader.load()
        except Exception as exc:
            print(f"  ERROR loading: {exc}")
            continue

        if not document:
            print(f"  SKIP: empty document")
            continue

        chunks_added = store.add_document(doc_name, document)
        print(f"  Inserted {chunks_added} parent+child chunks")


def main():
    parser = argparse.ArgumentParser(description="Backfill documents into parent-child schema")
    parser.add_argument("user_id", help="User UUID to backfill")
    parser.add_argument("--doc-dir", help="Directory containing document files (optional)")
    args = parser.parse_args()

    backfill_user_documents(args.user_id, args.doc_dir)


if __name__ == "__main__":
    main()
