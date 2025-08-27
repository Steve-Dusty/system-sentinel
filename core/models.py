from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from typing import Optional
from datetime import datetime


class UserBase(SQLModel):
    """Base user schema."""
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True


class User(UserBase, table=True):
    """User model for authentication."""
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    is_superuser: bool = False
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str


class UserUpdate(SQLModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserRead(UserBase):
    """Schema for user response."""
    id: int
    is_superuser: bool
    created_at: datetime


class Token(SQLModel):
    """Token response schema."""
    access_token: str
    token_type: str


class TokenData(SQLModel):
    """Token data schema."""
    username: Optional[str] = None