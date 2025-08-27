from datetime import timedelta, datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from core.config import settings
from core.models import User, UserCreate, UserUpdate, UserRead, Token
from auth.security import (
    authenticate_user,
    create_access_token,
    create_user,
    get_current_active_user,
    get_current_superuser,
    get_user_by_email,
    get_user_by_username,
    get_password_hash
)
from db.session import get_db

# Create router
router = APIRouter()


@router.post("/auth/register", response_model=UserRead, tags=["Authentication"])
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    # Check if user already exists
    if get_user_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    if get_user_by_username(db, username=user_in.username):
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    # Create user
    user = create_user(db, user_in)
    return user


@router.post("/auth/login", response_model=Token, tags=["Authentication"])
def login_user(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Login user and return access token.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        subject=user.username, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }


@router.get("/auth/me", response_model=UserRead, tags=["Authentication"])
def read_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information.
    """
    return current_user


@router.put("/auth/me", response_model=UserRead, tags=["Authentication"])
def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update current user information.
    """
    # Check if email/username is already taken by another user
    if user_update.email and user_update.email != current_user.email:
        existing_user = get_user_by_email(db, user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    if user_update.username and user_update.username != current_user.username:
        existing_user = get_user_by_username(db, user_update.username)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
    
    # Update user fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        current_user.hashed_password = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/users", response_model=List[UserRead], tags=["Users"])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """
    Get all users (superuser only).
    """
    statement = select(User).offset(skip).limit(limit)
    users = db.exec(statement).all()
    return users


@router.get("/users/{user_id}", response_model=UserRead, tags=["Users"])
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """
    Get user by ID (superuser only).
    """
    statement = select(User).where(User.id == user_id)
    user = db.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}", tags=["Users"])
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """
    Delete user by ID (superuser only).
    """
    statement = select(User).where(User.id == user_id)
    user = db.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete yourself"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
