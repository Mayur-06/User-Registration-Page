from pydantic import BaseModel, EmailStr, Field
import uuid
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

    model_config = {"from_attributes": True}   # add this line

class DeleteRequest(BaseModel):
    password: str


