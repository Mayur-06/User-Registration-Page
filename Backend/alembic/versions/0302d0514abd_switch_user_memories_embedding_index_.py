"""switch user_memories embedding index from ivfflat to hnsw

Revision ID: 0302d0514abd
Revises: f026ab806184
Create Date: 2026-08-21 09:24:31.411295

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0302d0514abd'
down_revision: Union[str, Sequence[str], None] = 'f026ab806184'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_user_memories_embedding;")
    op.execute("""
        CREATE INDEX ix_user_memories_embedding
        ON user_memories
        USING hnsw (embedding vector_cosine_ops);
    """)



def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_user_memories_embedding;")
    op.execute("""
        CREATE INDEX ix_user_memories_embedding
        ON user_memories
        USING ivfflat (embedding vector_cosine_ops);
    """)

