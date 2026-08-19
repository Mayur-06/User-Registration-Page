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
from app.db_models import Conversation, Message
from sqlalchemy import func

async def get_user_by_email(db: AsyncSession, email: str) -> User | None : 
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

async def update_user(db: AsyncSession, user: User, **fields) -> User:
    for key, value in fields.items():
        if value is not None and hasattr(user, key):
            setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user


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

async def create_conversation(db: AsyncSession, user_id: uuid.UUID, title: str | None = None) -> Conversation:
    if title is None:
        result = await db.execute(
            select(func.count()).select_from(Conversation).where(Conversation.user_id == user_id)
        )
        count = result.scalar_one()
        title = f"Untitled-{count + 1}"

    convo = Conversation(user_id=user_id, title=title)
    db.add(convo)
    await db.commit()
    await db.refresh(convo)
    return convo


async def get_conversations(db: AsyncSession, user_id: uuid.UUID) -> list[Conversation]:
    result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.created_at.desc())
    )
    return result.scalars().all()


async def get_conversation(db: AsyncSession, conversation_id: uuid.UUID, user_id: uuid.UUID) -> Conversation | None:
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def delete_conversation(db: AsyncSession, convo: Conversation) -> None:
    await db.delete(convo)
    await db.commit()


async def add_message(db: AsyncSession, conversation_id: uuid.UUID, role: str, text: str) -> Message:
    msg = Message(conversation_id=conversation_id, role=role, text=text)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


async def get_messages(db: AsyncSession, conversation_id: uuid.UUID) -> list[Message]:
    result = await db.execute(
        select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at.asc())
    )
    return result.scalars().all()