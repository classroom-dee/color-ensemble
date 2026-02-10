from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    ENV: str = os.environ.get('ENV', 'ci')
    DATABASE_URL: str = os.environ.get('DATABASE_URL', 'sqlite:///./ci.db')
    JWT_SECRET_KEY: str = os.environ.get('JWT_SECRET_KEY', 'ci-key')
    JWT_ALGORITHM: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRE_MINUTES: int = 60 * 24

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
