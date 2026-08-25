from fastapi import APIRouter, Depends, HTTPException, status, Response, UploadFile, File
from fastapi.security.oauth2 import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from jose import JWTError, jwt

from pathlib import Path
import shutil
import cloudinary.uploader
from app import cloudinary_client
from app.models import UserResponse, UpdateUserRequest
import os
import uuid


from app.db import get_db
from app.crud import get_user_by_id, delete_user, update_user



router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"

ALLOWED_IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

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

@router.post("/me/profile-image",response_model=UserResponse)
async def upload_profile_image(
    file: UploadFile=File(...),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.filename}. Only JPG, PNG, and WEBP are supported.",
        )
    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    temp_dir = Path("temp_uploads")
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_path = temp_dir / f"{user_id}{ext}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        size_bytes = temp_path.stat().st_size
        if size_bytes > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="Image must be under 5MB.")

        upload_result = cloudinary.uploader.upload(
            str(temp_path),
            folder="profile_images",
            public_id=user_id,       
            overwrite=True,
            resource_type="image",
        )
        old_public_id = user.profile_image_public_id
        if old_public_id and old_public_id != upload_result["public_id"]:
            cloudinary.uploader.destroy(old_public_id)

        user = await update_user(
            db,
            user,
            profile_image_url=upload_result["secure_url"],
            profile_image_public_id=upload_result["public_id"],
        )
    finally:
        temp_path.unlink(missing_ok=True)

    return user

@router.patch("/me", response_model=UserResponse)
async def update_me(
    payload: UpdateUserRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = payload.model_dump(exclude_unset=True)
    user = await update_user(db, user, **update_data)
    return user

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