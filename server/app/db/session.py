from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


def get_engine():
    return create_engine(
        settings.DATABASE_URL,
        connect_args={'check_same_thread': False}
        if settings.DATABASE_URL.startswith('sqlite')
        else {},
    )


engine = get_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
