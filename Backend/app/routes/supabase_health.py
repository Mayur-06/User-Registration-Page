from fastapi import APIRouter
from app.supabase_client import get_service_client
import logging


logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/supabase_health")
async def supabase_health():
    try:
        get_service_client().table("user_memories").select("id").limit(1).execute()
        return {"status": "ok"}
    except Exception:
        logger.exception("Supabase health check failed")
        return {"status": "error"}