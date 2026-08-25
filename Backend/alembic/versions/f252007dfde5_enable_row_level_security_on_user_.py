"""enable row level security on user_memories

Revision ID: f252007dfde5
Revises: 0302d0514abd
Create Date: 2026-08-21 09:26:43.833522

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f252007dfde5'
down_revision: Union[str, Sequence[str], None] = '0302d0514abd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;")
    op.execute("""
        CREATE POLICY user_memories_own_rows ON user_memories
        FOR ALL USING ((metadata->>'user_id')::UUID = auth.uid());
    """)


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS user_memories_own_rows ON user_memories;")
    op.execute("ALTER TABLE user_memories DISABLE ROW LEVEL SECURITY;")
