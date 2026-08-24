"""add image_url to messages

Revision ID: e4c7fc8be694
Revises: 3d89f4f24ee9
Create Date: 2026-08-24 06:52:51.890396

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4c7fc8be694'
down_revision: Union[str, Sequence[str], None] = '3d89f4f24ee9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("messages", sa.Column("image_url", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("messages", "image_url")
