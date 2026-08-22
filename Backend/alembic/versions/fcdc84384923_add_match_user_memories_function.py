"""add match user memories function

Revision ID: fcdc84384923
Revises: d9ba0c763c55
Create Date: 2026-08-19 15:06:14.997213

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fcdc84384923'
down_revision: Union[str, Sequence[str], None] = 'd9ba0c763c55'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE FUNCTION match_user_memories(
            query_embedding VECTOR(768),
            match_count INT,
            filter JSONB
        )
        RETURNS TABLE (
            id UUID,
            content TEXT,
            similarity FLOAT
        )
        LANGUAGE SQL
        AS $$
            SELECT
                id,
                content,
                1 - (embedding <=> query_embedding) AS similarity
            FROM user_memories
            WHERE user_id = (filter->>'user_id')::UUID
            ORDER BY embedding <=> query_embedding
            LIMIT match_count;
        $$;
    """)


def downgrade() -> None:
    op.execute("""
        DROP FUNCTION IF EXISTS match_user_memories(
            VECTOR(768),
            INT,
            JSONB
        );
    """)