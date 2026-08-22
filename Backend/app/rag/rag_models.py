#schema
from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str



class ChatResponse(BaseModel):
    answer: str
    sources_used: list[str] = []


class HealthResponse(BaseModel):
    status: str