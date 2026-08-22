from fastapi import APIRouter, HTTPException, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import hash_password, verify_password, create_access_token, generate_refresh_token, hash_token
from app.models import LoginRequest, SignupRequest, UserResponse
from app.db import get_db
from app.crud import get_user_by_email, create_user, store_refresh_token, get_valid_refresh_token, revoke_refresh_token, get_user_by_id


router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=201)
async def signup(payload: SignupRequest, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = await create_user(
        db,
        name=payload.name,
        age=payload.age,
        occupation=payload.occupation,
        education_qualification=payload.education_qualification,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    return user

@router.post("/login")
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    access_token = create_access_token(str(user.id))

    refresh_token = generate_refresh_token()
    await store_refresh_token(db, user.id, hash_token(refresh_token))

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    old_token = request.cookies.get("refresh_token")
    if not old_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    rt = await get_valid_refresh_token(db, hash_token(old_token))
    if not rt:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # rotation: revoke old, issue new
    await revoke_refresh_token(db, rt)
    new_refresh_token = generate_refresh_token()
    await store_refresh_token(db, rt.user_id, hash_token(new_refresh_token))

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    new_access_token = create_access_token(str(rt.user_id))
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    old_token = request.cookies.get("refresh_token")
    if old_token:
        rt = await get_valid_refresh_token(db, hash_token(old_token))
        if rt:
            await revoke_refresh_token(db, rt)
    response.delete_cookie("refresh_token")
    return {"detail": "Logged out"}


    

    

