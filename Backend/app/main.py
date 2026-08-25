from fastapi import FastAPI
from app.routes import health, auth_routes, user, supabase_health
#from app.routes import documents
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat
import os
from app.routes import conversations

app = FastAPI()
app.include_router(health.router)
app.include_router(supabase_health.router)
app.include_router(auth_routes.router)
app.include_router(user.router)
app.include_router(chat.router)
app.include_router(conversations.router)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5176,http://127.0.0.1:5176",
).split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)