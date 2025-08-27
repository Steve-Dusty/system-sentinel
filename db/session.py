from sqlmodel import SQLModel, Session, create_engine
from core.config import settings
from typing import Generator

# Create SQLModel engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session.
    """
    with Session(engine) as session:
        yield session


def create_tables():
    """Create all tables in the database."""
    SQLModel.metadata.create_all(engine)