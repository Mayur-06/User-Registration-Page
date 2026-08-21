"""fix match_user_memories signature and table shape

Revision ID: c1c3b4ecd35d
Revises: fcdc84384923
Create Date: 2026-08-20 14:44:25.680962

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1c3b4ecd35d'
down_revision: Union[str, Sequence[str], None] = 'fcdc84384923'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP FUNCTION IF EXISTS match_user_memories(VECTOR(768), INT, JSONB);")
    op.execute("ALTER TABLE user_memories DROP COLUMN IF EXISTS user_id;")
    op.execute("ALTER TABLE user_memories ADD COLUMN IF NOT EXISTS metadata JSONB;")
    op.execute("ALTER TABLE user_memories ALTER COLUMN embedding TYPE VECTOR(384);")

    op.execute("""
        CREATE OR REPLACE FUNCTION match_user_memories(
            query_embedding VECTOR(384),
            filter JSONB DEFAULT '{}'
        )
        RETURNS TABLE (id UUID, content TEXT, metadata JSONB, similarity FLOAT)
        LANGUAGE plpgsql AS $$
        BEGIN
            RETURN QUERY
            SELECT
                user_memories.id,
                user_memories.content,
                user_memories.metadata,
                1 - (user_memories.embedding <=> query_embedding) AS similarity
            FROM user_memories
            WHERE user_memories.metadata @> filter
            ORDER BY user_memories.embedding <=> query_embedding;
        END;
        $$;
    """)

    op.execute("GRANT SELECT, INSERT, UPDATE ON public.user_memories TO service_role;")
    op.execute("GRANT EXECUTE ON FUNCTION public.match_user_memories(vector, jsonb) TO service_role;")


def downgrade() -> None:
    op.execute("DROP FUNCTION IF EXISTS match_user_memories(VECTOR(384), JSONB);")
    op.execute("ALTER TABLE user_memories DROP COLUMN IF EXISTS metadata;")
    op.execute("ALTER TABLE user_memories ADD COLUMN IF NOT EXISTS user_id UUID;")
