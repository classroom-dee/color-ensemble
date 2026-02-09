from datetime import datetime, timedelta, UTC
from jose import jwt
import hashlib
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=['argon2'], deprecated='auto')


def hash_password(password: str) -> str:
    pw_bytes = password.encode('utf-8')
    digest = hashlib.sha256(pw_bytes).digest()
    return pwd_context.hash(digest)


def verify_password(password: str, hashed: str) -> bool:
    pw_bytes = password.encode('utf-8')
    digest = hashlib.sha256(pw_bytes).digest()
    return pwd_context.verify(digest, hashed)


def create_access_token(subject: str) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {
        'sub': subject,
        'exp': expire,
    }
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
