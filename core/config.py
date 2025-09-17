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
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()