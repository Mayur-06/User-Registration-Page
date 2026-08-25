from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision = "d9ba0c763c55"
down_revision = "e76268c195ba"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Create user_memories table
    op.create_table(
        "user_memories",
        sa.Column(
            "id",
            sa.UUID(),
            primary_key=True,
            nullable=False,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "content",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "embedding",
            Vector(768),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=True,
            server_default=sa.text("now()"),
        ),
    )

    # IVFFlat index for cosine similarity
    op.execute(
        """
        CREATE INDEX ix_user_memories_embedding
        ON user_memories
        USING ivfflat (embedding vector_cosine_ops)
        """
    )


def downgrade() -> None:
    op.drop_index(
        "ix_user_memories_embedding",
        table_name="user_memories",
    )

    op.drop_table("user_memories")