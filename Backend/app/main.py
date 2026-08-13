from fastapi import FastAPI
from app.routes import health, auth_routes, user

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(health.router)
app.include_router(auth_routes.router)
app.include_router(user.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)