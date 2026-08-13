from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security.oauth2 import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from jose import JWTError, jwt

#from app.auth import verify_password
#from pydantic import BaseModel
from app.models import DeleteRequest, UserResponse
import os
import uuid


from app.db import get_db
from app.crud import get_user_by_email, create_user, get_user_by_id, delete_user



router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")



@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# @router.delete("/me")
# async def delete_me(
#     user_id: str = Depends(get_current_user_id),
#     db: AsyncSession = Depends(get_db),
# ):
#     user = await get_user_by_id(db, uuid.UUID(user_id))
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     await delete_user(db, user)
#     return {"detail": "Account deleted"}

@router.delete("/me")
async def delete_me(
    response: Response,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await delete_user(db, user)
    response.delete_cookie("refresh_token")
    return {"detail": "Account deleted"}