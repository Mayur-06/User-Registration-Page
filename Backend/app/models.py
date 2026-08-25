from pydantic import BaseModel, EmailStr, Field
import uuid
from datetime import datetime

class SignupRequest(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(gt=0, lt=120)
    occupation: str = Field(min_length=1)
    education_qualification: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    age: int
    occupation: str
    education_qualification: str
    email: EmailStr
    profile_image_url: str | None = None

    model_config = {"from_attributes": True}  

class DeleteRequest(BaseModel):
    password: str

class ConversationResponse(BaseModel):
    id: uuid.UUID
    title: str
    created_at: datetime
    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    text: str
    created_at: datetime
    model_config = {"from_attributes": True}


class CreateConversationRequest(BaseModel):
    title: str | None = None


class UpdateUserRequest(BaseModel):
    name: str | None = None
    age: int | None = Field(default=None, gt=0, lt=120)
    occupation: str | None = None
    education_qualification: str | None = None


