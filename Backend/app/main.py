from fastapi import FastAPI
from app.routes import health, auth_routes, user
#from app.routes import documents
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat
app = FastAPI()
app.include_router(health.router)
app.include_router(auth_routes.router)
app.include_router(user.router)
#app.include_router(documents.router)

app.include_router(chat.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
