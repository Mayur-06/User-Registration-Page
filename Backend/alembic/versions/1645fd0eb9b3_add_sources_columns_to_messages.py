"""add sources columns to messages

Revision ID: 1645fd0eb9b3
Revises: c643cbf11c5a
Create Date: 2026-08-25 11:31:51.181621

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1645fd0eb9b3'
down_revision: Union[str, Sequence[str], None] = 'c643cbf11c5a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('messages', sa.Column('sources_used', sa.Text(), nullable=True))
    op.add_column('messages', sa.Column('sources_called', sa.Text(), nullable=True))
    op.add_column('messages', sa.Column('sources_available', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('messages', 'sources_available')
    op.drop_column('messages', 'sources_called')
    op.drop_column('messages', 'sources_used')
