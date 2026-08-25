from fastapi import APIRouter
from app.supabase_client import get_client
import logging
from app.rag.rag_models import HealthResponse


logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
def health():
    return HealthResponse(status="healthy")

@router.get("/supabase_health")
async def supabase_health():
    try:
        get_client().table("user_memories").select("id").limit(1).execute()
        return {"status": "ok"}
    except Exception:
        logger.exception("Supabase health check failed")
        return {"status": "error"}
