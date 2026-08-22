from dotenv import load_dotenv
from passlib.context import CryptContext  # type: ignore[import]
from jose import JWTError, jwt  # type: ignore[import]
from datetime import datetime, timedelta, timezone
import os
import secrets
import hashlib

pwd_context=CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()
SECRET_KEY= os.environ["JWT_SECRET"]
ALGORITHM="HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str)-> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str, expired_minutes: int=60)-> str:
    payload={
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expired_minutes)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def generate_refresh_token() -> str:
    return secrets.token_urlsafe(64)  # random, not a JWT — just an opaque secret

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


