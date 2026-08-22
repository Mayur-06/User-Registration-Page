"""add profile image fields to users

Revision ID: 3d89f4f24ee9
Revises: f252007dfde5
Create Date: 2026-08-21 13:36:14.636990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d89f4f24ee9'
down_revision: Union[str, Sequence[str], None] = 'f252007dfde5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("profile_image_url", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("profile_image_public_id", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "profile_image_public_id")
    op.drop_column("users", "profile_image_url")
