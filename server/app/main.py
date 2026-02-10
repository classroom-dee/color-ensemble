from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.core.config import settings
from app.api import auth, users, colors


@asynccontextmanager
async def on_startup(app: FastAPI):
    if settings.ENV != 'test':
        init_db()
    yield


def create_app(is_prod=False) -> FastAPI:
    app = FastAPI(
        title='Color Ensemble API',
        version='0.1.0',
        lifespan=on_startup if is_prod else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(auth.router, prefix='/api')
    app.include_router(users.router, prefix='/api')
    app.include_router(colors.router, prefix='/api')
    app.include_router(colors.favorites_router, prefix='/api')

    return app
