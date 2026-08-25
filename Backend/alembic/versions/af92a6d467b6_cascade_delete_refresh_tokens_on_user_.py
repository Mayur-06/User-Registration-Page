"""cascade delete refresh tokens on user delete

Revision ID: af92a6d467b6
Revises: 268b533e3cc8
Create Date: 2026-08-12 13:33:50.498237

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'af92a6d467b6'
down_revision: Union[str, Sequence[str], None] = '268b533e3cc8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        "refresh_tokens_user_id_fkey", "refresh_tokens", type_="foreignkey"
    )
    op.create_foreign_key(
        "refresh_tokens_user_id_fkey",
        "refresh_tokens",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(
        "refresh_tokens_user_id_fkey", "refresh_tokens", type_="foreignkey"
    )
    op.create_foreign_key(
        "refresh_tokens_user_id_fkey",
        "refresh_tokens",
        "users",
        ["user_id"],
        ["id"],
    )