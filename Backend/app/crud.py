# import json, os, tempfile
# from threading import Lock

# DATA_FILE = "app/data/users.json"
# _lock = Lock()

# def read_users()->dict:
#     if not os.path.exists(DATA_FILE):
#         return {}
#     with open(DATA_FILE, "r") as f:
#         return json.load(f)

# def write_users(users: dict):
#     with _lock:
#         dir_ = os.path.dirname(DATA_FILE)
#         fd, tmp_path = tempfile.mkstemp(dir=dir_)
#         with os.fdopen(fd, "w") as f:
#             json.dump(users, f, indent=2)
#         os.replace(tmp_path, DATA_FILE) 


import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db_models import User, RefreshToken
from datetime import datetime, timedelta, timezone

async def get_user_by_email(db: AsyncSession, email: str) -> User | :
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, **fields) -> User:
    user = User(**fields)
    db.add(user)
    await db.commit()  
    await db.refresh(user)  #
    return user

async def delete_user(db: AsyncSession, user: User) -> None:
    await db.delete(user)
    await db.commit()


async def store_refresh_token(db, user_id: uuid.UUID, token_hash: str, days_valid: int = 7):
    rt = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=days_valid),
    )
    db.add(rt)
    await db.commit()
    return rt

async def get_valid_refresh_token(db, token_hash: str):
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,
            RefreshToken.expires_at > datetime.now(timezone.utc),
        )
    )
    return result.scalar_one_or_none()

async def revoke_refresh_token(db, rt: RefreshToken):
    rt.revoked = True
    await db.commit()