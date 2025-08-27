from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import Session
from datetime import datetime

from core.config import settings
from api.endpoints import router
from db.session import create_tables, engine
from auth.security import get_user_by_email, get_password_hash
from core.models import User


def init_db():
    """Initialize database with admin user."""
    create_tables()
    
    # Create admin user if it doesn't exist
    with Session(engine) as db:
        admin_user = get_user_by_email(db, settings.admin_email)
        if not admin_user:
            admin_user_data = User(
                email=settings.admin_email,
                username="admin",
                full_name="System Administrator",
                hashed_password=get_password_hash(settings.admin_password),
                is_active=True,
                is_superuser=True,
                created_at=datetime.utcnow()
            )
            db.add(admin_user_data)
            db.commit()
            print(f"✅ Admin user created with email: {settings.admin_email}")
        else:
            print(f"ℹ️  Admin user already exists: {settings.admin_email}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting System-Sentinel Backend...")
    init_db()
    print("✅ Database initialized successfully")
    yield
    # Shutdown
    print("👋 Shutting down System-Sentinel Backend...")


app = FastAPI(
    title="System-Sentinel",
    description="Backend for the System-Sentinel anomaly detection dashboard with user authentication.",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication and user management routes
app.include_router(router, prefix="/api")


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint that returns a welcome message."""
    return {
        "message": "System-Sentinel Backend is running.",
        "version": "0.1.0",
        "docs": "/docs",
        "admin_email": settings.admin_email
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "System-Sentinel Backend"}