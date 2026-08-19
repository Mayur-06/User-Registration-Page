from fastapi import FastAPI
from app.routes import health, auth_routes, user
#from app.routes import documents
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat

from app.routes import conversations

app = FastAPI()
app.include_router(health.router)
app.include_router(auth_routes.router)
app.include_router(user.router)
#app.include_router(documents.router)

app.include_router(chat.router)
app.include_router(conversations.router)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#         "http://localhost:5174",
#         "http://127.0.0.1:5174",
#         "http://localhost:5175",
#         "http://127.0.0.1:5175",
#         "http://localhost:5176",
#         "http://127.0.0.1:5176",
#         "http://116.202.210.102:5176",
#         "http://localhost:8001",
#         "http://127.0.0.1:8001",
#         "http://116.202.210.102:8001",
#         "http://localhost:3000",
#         "http://127.0.0.1:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Simple health check for Supabase connectivity
@app.get("/supabase-health")
async def supabase_health():
    from app.supabase_client import get_client
    client = get_client()
    try:
        # Attempt to fetch the current user via the auth endpoint.
        response = client.auth.get_user()
        return {"status": "ok", "user": response}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://f4ce-49-36-186-18.ngrok-free.app ",  # your frontend's ngrok URL
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://116.202.210.102:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)