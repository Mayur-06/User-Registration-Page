"""make user_memories embedding not null

Revision ID: f026ab806184
Revises: c1c3b4ecd35d
Create Date: 2026-08-21 09:22:40.069920

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f026ab806184'
down_revision: Union[str, Sequence[str], None] = 'c1c3b4ecd35d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE user_memories ALTER COLUMN embedding SET NOT NULL;")



def downgrade() -> None:
     op.execute("ALTER TABLE user_memories ALTER COLUMN embedding DROP NOT NULL;")

