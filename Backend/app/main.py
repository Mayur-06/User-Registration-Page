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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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