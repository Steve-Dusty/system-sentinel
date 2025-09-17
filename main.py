from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from api.endpoints import router
from db.session import create_tables


def init_db():
    """Initialize database tables."""
    create_tables()
    print("✅ Database tables created successfully")


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
    description="Backend for the System-Sentinel anomaly detection dashboard.",
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

# Include API routes
app.include_router(router, prefix="/api")


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint that returns a welcome message."""
    return {
        "message": "System-Sentinel Backend is running.",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "System-Sentinel Backend"}