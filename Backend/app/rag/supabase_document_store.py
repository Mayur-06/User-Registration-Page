import numpy as np
import re
import base64

from app.supabase_client import get_service_client
from app.rag.preprocessor import normalize_text
from app.rag.sentence_splitter import split_sentences
from app.rag.textchunker import TextChunker

INSERT_CHUNK_SIZE = 500


class SupabaseDocumentStore:
    def __init__(self, embedder, user_id, base_dir=None):
        self.embedder = embedder
        self.user_id = str(user_id)
        self.client = get_service_client()

    def _restore_tables(self, text: str) -> str:
        def replace_table(match):
            encoded = match.group(1)
            try:
                return base64.b64decode(encoded).decode("utf-8")
            except Exception:
                return match.group(0)

        return re.sub(r'__TABLE_START__([A-Za-z0-9+/=]+)__TABLE_END__', replace_table, text)

    # ---------------------------------------------------
    # Search with parent-child retrieval
    # ---------------------------------------------------
    def search(self, query_embedding, top_k=3, query_text=None):
        if isinstance(query_embedding, np.ndarray):
            query_embedding = query_embedding.tolist()

        if query_text is not None:
            child_results = self._hybrid_search_children(
                query_embedding, query_text, top_k
            )
            if not child_results:
                return []

            parent_ids = []
            seen_parents = set()
            for r in child_results:
                parent_id = r.get("parent_id")
                if parent_id and parent_id not in seen_parents:
                    seen_parents.add(parent_id)
                    parent_ids.append(parent_id)

            if not parent_ids:
                return child_results[:top_k]

            parent_rows = (
                self.client.table("document_chunks")
                .select("id, content, doc_id")
                .eq("user_id", self.user_id)
                .eq("chunk_type", "parent")
                .in_("id", parent_ids)
                .execute()
            )
            parent_map = {row["id"]: row for row in (parent_rows.data or [])}

            parent_results = []
            for parent_id in parent_ids:
                parent_row = parent_map.get(parent_id)
                if not parent_row:
                    continue
                best_child = next(
                    (r for r in child_results if r.get("parent_id") == parent_id),
                    child_results[0],
                )
                parent_results.append(
                    {
                        "chunk_id": parent_row["id"],
                        "score": best_child.get("score", 0),
                        "doc_id": parent_row["doc_id"],
                        "text": parent_row["content"],
                        "child_chunk_id": best_child.get("chunk_id"),
                        "child_score": best_child.get("score"),
                    }
                )
            return parent_results[:top_k]

        response = (
            self.client.rpc(
                "match_document_chunks",
                {
                    "query_embedding": query_embedding,
                    "filter": {"user_id": self.user_id, "chunk_type": "child"},
                },
            )
            .limit(top_k)
            .execute()
        )

        parent_ids = []
        seen_parents = set()
        child_map: dict[str, dict] = {}
        for row in response.data:
            parent_id = row.get("parent_id")
            if parent_id and parent_id not in seen_parents:
                seen_parents.add(parent_id)
                parent_ids.append(parent_id)
            child_map[row["id"]] = row

        if not parent_ids:
            return [
                {
                    "chunk_id": row["id"],
                    "score": row["similarity"],
                    "doc_id": row["doc_id"],
                    "text": row["content"],
                }
                for row in response.data
            ]

        parent_rows = (
            self.client.table("document_chunks")
            .select("id, content, doc_id")
            .eq("user_id", self.user_id)
            .eq("chunk_type", "parent")
            .in_("id", parent_ids)
            .execute()
        )
        parent_map = {row["id"]: row for row in (parent_rows.data or [])}

        results = []
        for parent_id in parent_ids:
            parent_row = parent_map.get(parent_id)
            if not parent_row:
                continue
            best_child = next(
                (child_map[child_id] for child_id, r in child_map.items() if r.get("parent_id") == parent_id),
                response.data[0],
            )
            results.append(
                {
                    "chunk_id": parent_row["id"],
                    "score": best_child.get("similarity", 0),
                    "doc_id": parent_row["doc_id"],
                    "text": parent_row["content"],
                    "child_chunk_id": best_child.get("id"),
                    "child_score": best_child.get("similarity"),
                }
            )
        return results[:top_k]

    def _hybrid_search_children(self, query_embedding, query_text, top_k):
        variant_embedding = self.embedder.encode(normalize_text(query_text)).tolist()
        response = (
            self.client.rpc(
                "match_document_chunks_hybrid",
                {
                    "query_embedding": variant_embedding,
                    "query_text": normalize_text(query_text),
                    "match_count": top_k * 2,
                    "p_user_id": self.user_id,
                    "p_chunk_type": "child",
                },
            )
            .limit(top_k * 2)
            .execute()
        )

        seen: dict[str, dict] = {}
        for idx, row in enumerate(response.data, start=1):
            chunk_id = row["id"]
            score = row.get("rrf_score", 0)
            parent_id = row.get("parent_id")
            if chunk_id not in seen or score > seen[chunk_id]["score"]:
                seen[chunk_id] = {
                    "chunk_id": chunk_id,
                    "score": score,
                    "doc_id": row["doc_id"],
                    "text": row["content"],
                    "parent_id": parent_id,
                    "similarity": row.get("similarity"),
                    "bm25_score": row.get("bm25_score"),
                    "rank": idx,
                }

        return sorted(seen.values(), key=lambda x: x["score"], reverse=True)[: top_k * 2]

    # ---------------------------------------------------
    # Add document with parent-child chunking
    # ---------------------------------------------------
    def add_document(self, doc_id, chunks):
        text_chunker = TextChunker(chunk_size=175, chunk_overlap=35)

        if isinstance(chunks, str):
            text = self._restore_tables(chunks)
            parent_texts = text_chunker.chunk_text(text)
        else:
            parent_texts = [self._restore_tables(s) for s in chunks if s and s.strip()]

        if not parent_texts:
            return 0

        parent_rows = []
        for parent_text in parent_texts:
            parent_rows.append(
                {
                    "user_id": self.user_id,
                    "doc_id": doc_id,
                    "content": parent_text,
                    "chunk_type": "parent",
                    "embedding": None,
                }
            )

        inserted_parents = []
        for i in range(0, len(parent_rows), INSERT_CHUNK_SIZE):
            batch = parent_rows[i : i + INSERT_CHUNK_SIZE]
            response = (
                self.client.table("document_chunks").insert(batch).execute()
            )
            inserted_parents.extend(response.data or [])

        if len(inserted_parents) != len(parent_rows):
            raise RuntimeError(
                f"Expected {len(parent_rows)} parent rows inserted, got {len(inserted_parents)}"
            )

        child_rows = []
        for parent_row, parent_text in zip(inserted_parents, parent_texts):
            child_sentences = split_sentences(parent_text)
            if not child_sentences:
                continue
            child_embeddings = self.embedder.encode_batch(child_sentences)
            child_embeddings = np.asarray(child_embeddings, dtype="float32")
            if child_embeddings.ndim == 1:
                child_embeddings = child_embeddings.reshape(1, -1)

            for seq_idx, (sentence, emb) in enumerate(
                zip(child_sentences, child_embeddings)
            ):
                child_rows.append(
                    {
                        "user_id": self.user_id,
                        "doc_id": doc_id,
                        "content": sentence,
                        "chunk_type": "child",
                        "embedding": emb.tolist(),
                        "parent_id": parent_row["id"],
                        "sequence_index": seq_idx,
                    }
                )

        for i in range(0, len(child_rows), INSERT_CHUNK_SIZE):
            batch = child_rows[i : i + INSERT_CHUNK_SIZE]
            self.client.table("document_chunks").insert(batch).execute()

        return len(parent_rows) + len(child_rows)

    # ---------------------------------------------------
    # Delete document
    # ---------------------------------------------------
    def delete_document(self, document_name):
        result = (
            self.client.table("document_chunks")
            .delete()
            .eq("user_id", self.user_id)
            .eq("doc_id", document_name)
            .execute()
        )
        return len(result.data)

    # ---------------------------------------------------
    # List uploaded documents
    # ---------------------------------------------------
    def list_documents(self):
        result = (
            self.client.table("document_chunks")
            .select("doc_id")
            .eq("user_id", self.user_id)
            .execute()
        )
        return sorted({row["doc_id"] for row in result.data})
