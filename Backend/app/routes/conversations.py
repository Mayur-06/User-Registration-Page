import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.routes.user import get_current_user_id
from app.models import ConversationResponse, MessageResponse, CreateConversationRequest
from app.crud import (
    create_conversation, get_conversations, get_conversation,
    delete_conversation, get_messages,
)

router = APIRouter()


@router.post("/conversations", response_model=ConversationResponse, status_code=201)
async def create_new_conversation(
    payload: CreateConversationRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await create_conversation(db, uuid.UUID(user_id), payload.title)


@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await get_conversations(db, uuid.UUID(user_id))


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
async def list_messages(
    conversation_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    convo = await get_conversation(db, conversation_id, uuid.UUID(user_id))
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return await get_messages(db, conversation_id)


@router.delete("/conversations/{conversation_id}")
async def remove_conversation(
    conversation_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    convo = await get_conversation(db, conversation_id, uuid.UUID(user_id))
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    await delete_conversation(db, convo)
    return {"detail": "Conversation deleted"}