from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, colors


def create_app() -> FastAPI:
    app = FastAPI(title='Color Ensemble API', version='0.1.0')

    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(colors.router)
    app.include_router(colors.favorites_router)

    return app
