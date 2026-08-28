"""add_parent_child_chunking

Revision ID: parent_child_001
Revises: a1b2c3d4e5f6
Create Date: 2026-08-27 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'parent_child_001'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE document_chunks
        ADD COLUMN IF NOT EXISTS chunk_type TEXT NOT NULL DEFAULT 'child';
    """)

    op.execute("""
        ALTER TABLE document_chunks
        ADD COLUMN IF NOT EXISTS parent_id UUID NULL REFERENCES document_chunks(id);
    """)

    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_document_chunks_parent_id
        ON document_chunks (parent_id);
    """)

    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_document_chunks_chunk_type
        ON document_chunks (chunk_type);
    """)

    op.execute("""
        UPDATE document_chunks
        SET chunk_type = 'child'
        WHERE chunk_type IS NULL;
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_document_chunks_chunk_type;")
    op.execute("DROP INDEX IF EXISTS ix_document_chunks_parent_id;")
    op.execute("ALTER TABLE document_chunks DROP COLUMN IF EXISTS parent_id;")
    op.execute("ALTER TABLE document_chunks DROP COLUMN IF EXISTS chunk_type;")
