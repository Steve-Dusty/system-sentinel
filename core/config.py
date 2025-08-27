from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    app_name: str = "System-Sentinel"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./system_sentinel.db"
    
    # Security
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Admin user (created on startup if doesn't exist)
    admin_email: str = "admin@systemsentinel.com"
    admin_password: str = "admin123"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()