"""switch_bm25_query_to_websearch_to_tsquery

Revision ID: c643cbf11c5a
Revises: 1ebedd3300e8
Create Date: 2026-08-24 14:25:02.808150

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c643cbf11c5a'
down_revision: Union[str, Sequence[str], None] = '1ebedd3300e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE OR REPLACE FUNCTION match_document_chunks_hybrid(
            query_embedding VECTOR(384),
            query_text TEXT,
            match_count INT,
            p_user_id UUID
        )
        RETURNS TABLE (
            id UUID,
            content TEXT,
            doc_id TEXT,
            similarity FLOAT,
            bm25_score FLOAT,
            rrf_score FLOAT
        )
        LANGUAGE sql AS $$
            WITH bm25_english AS (
                SELECT
                    dc.id,
                    ROW_NUMBER() OVER (
                        ORDER BY ts_rank(dc.content_tsv, websearch_to_tsquery('english', query_text)) DESC
                    ) AS bm25_rank,
                    ts_rank(dc.content_tsv, websearch_to_tsquery('english', query_text)) AS bm25_score
                FROM document_chunks dc
                WHERE dc.user_id = p_user_id
                  AND dc.content_tsv @@ websearch_to_tsquery('english', query_text)
                LIMIT match_count * 2
            ),
            bm25_simple AS (
                SELECT
                    dc.id,
                    ROW_NUMBER() OVER (
                        ORDER BY ts_rank(dc.content_tsv_simple, websearch_to_tsquery('simple', query_text)) DESC
                    ) AS bm25_rank,
                    ts_rank(dc.content_tsv_simple, websearch_to_tsquery('simple', query_text)) AS bm25_score
                FROM document_chunks dc
                WHERE dc.user_id = p_user_id
                  AND dc.content_tsv_simple @@ websearch_to_tsquery('simple', query_text)
                LIMIT match_count * 2
            ),
            bm25_results AS (
                SELECT id, bm25_rank, bm25_score FROM bm25_english
                UNION ALL
                SELECT id, bm25_rank, bm25_score FROM bm25_simple
            ),
            ranked AS (
                SELECT
                    id,
                    MIN(bm25_rank) AS bm25_rank,
                    MAX(bm25_score) AS bm25_score
                FROM bm25_results
                GROUP BY id
            ),
            vector_results AS (
                SELECT
                    dc.id,
                    ROW_NUMBER() OVER (
                        ORDER BY dc.embedding <=> query_embedding
                    ) AS vector_rank
                FROM document_chunks dc
                WHERE dc.user_id = p_user_id
                ORDER BY dc.embedding <=> query_embedding
                LIMIT match_count * 2
            ),
            combined AS (
                SELECT
                    COALESCE(r.id, v.id) AS id,
                    COALESCE(r.bm25_rank, match_count * 2 + 1) AS bm25_rank,
                    COALESCE(v.vector_rank, match_count * 2 + 1) AS vector_rank,
                    r.bm25_score
                FROM ranked r
                FULL OUTER JOIN vector_results v ON r.id = v.id
                WHERE COALESCE(r.id, v.id) IS NOT NULL
            )
            SELECT
                dc.id,
                dc.content,
                dc.doc_id,
                1 - (dc.embedding <=> query_embedding) AS similarity,
                COALESCE(c.bm25_score, 0) AS bm25_score,
                1.0 / (60 + c.bm25_rank) + 1.0 / (60 + c.vector_rank) AS rrf_score
            FROM combined c
            JOIN document_chunks dc ON dc.id = c.id
            ORDER BY rrf_score DESC
            LIMIT match_count;
        $$;
    """)

    op.execute("""
        CREATE OR REPLACE FUNCTION match_user_memories_hybrid(
            query_embedding VECTOR(384),
            query_text TEXT,
            match_count INT,
            filter JSONB DEFAULT '{}'
        )
        RETURNS TABLE (
            id UUID,
            content TEXT,
            metadata JSONB,
            similarity FLOAT,
            bm25_score FLOAT,
            rrf_score FLOAT
        )
        LANGUAGE sql AS $$
            WITH bm25_english AS (
                SELECT
                    um.id,
                    ROW_NUMBER() OVER (
                        ORDER BY ts_rank(um.content_tsv, websearch_to_tsquery('english', query_text)) DESC
                    ) AS bm25_rank,
                    ts_rank(um.content_tsv, websearch_to_tsquery('english', query_text)) AS bm25_score
                FROM user_memories um
                WHERE um.metadata @> filter
                  AND um.content_tsv @@ websearch_to_tsquery('english', query_text)
                LIMIT match_count * 2
            ),
            bm25_simple AS (
                SELECT
                    um.id,
                    ROW_NUMBER() OVER (
                        ORDER BY ts_rank(um.content_tsv_simple, websearch_to_tsquery('simple', query_text)) DESC
                    ) AS bm25_rank,
                    ts_rank(um.content_tsv_simple, websearch_to_tsquery('simple', query_text)) AS bm25_score
                FROM user_memories um
                WHERE um.metadata @> filter
                  AND um.content_tsv_simple @@ websearch_to_tsquery('simple', query_text)
                LIMIT match_count * 2
            ),
            bm25_results AS (
                SELECT id, bm25_rank, bm25_score FROM bm25_english
                UNION ALL
                SELECT id, bm25_rank, bm25_score FROM bm25_simple
            ),
            ranked AS (
                SELECT
                    id,
                    MIN(bm25_rank) AS bm25_rank,
                    MAX(bm25_score) AS bm25_score
                FROM bm25_results
                GROUP BY id
            ),
            vector_results AS (
                SELECT
                    um.id,
                    ROW_NUMBER() OVER (
                        ORDER BY um.embedding <=> query_embedding
                    ) AS vector_rank
                FROM user_memories um
                WHERE um.metadata @> filter
                ORDER BY um.embedding <=> query_embedding
                LIMIT match_count * 2
            ),
            combined AS (
                SELECT
                    COALESCE(r.id, v.id) AS id,
                    COALESCE(r.bm25_rank, match_count * 2 + 1) AS bm25_rank,
                    COALESCE(v.vector_rank, match_count * 2 + 1) AS vector_rank,
                    r.bm25_score
                FROM ranked r
                FULL OUTER JOIN vector_results v ON r.id = v.id
                WHERE COALESCE(r.id, v.id) IS NOT NULL
            )
            SELECT
                um.id,
                um.content,
                um.metadata,
                1 - (um.embedding <=> query_embedding) AS similarity,
                COALESCE(c.bm25_score, 0) AS bm25_score,
                1.0 / (60 + c.bm25_rank) + 1.0 / (60 + c.vector_rank) AS rrf_score
            FROM combined c
            JOIN user_memories um ON um.id = c.id
            ORDER BY rrf_score DESC
            LIMIT match_count;
        $$;
    """)

    op.execute("GRANT SELECT, INSERT, UPDATE ON public.document_chunks TO service_role;")
    op.execute("GRANT EXECUTE ON FUNCTION public.match_document_chunks_hybrid(vector, text, int, uuid) TO service_role;")
    op.execute("GRANT SELECT, INSERT, UPDATE ON public.user_memories TO service_role;")
    op.execute("GRANT EXECUTE ON FUNCTION public.match_user_memories_hybrid(vector, text, int, jsonb) TO service_role;")


def downgrade() -> None:
    op.execute("DROP FUNCTION IF EXISTS match_user_memories_hybrid(vector, text, int, jsonb);")
    op.execute("DROP FUNCTION IF EXISTS match_document_chunks_hybrid(vector, text, int, uuid);")
