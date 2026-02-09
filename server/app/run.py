from app.main import create_app
from app.db.init_db import init_db
from app.core.config import settings

# from contextlib import asynccontextmanager

# @asynccontextmanager
# async def on_startup(app: FastAPI):
#     if settings.ENV != 'test':
#         init_db()
#     yield

# app = FastAPI(title='Color Ensemble API', version='0.1.0', lifespan=on_startup)


init_db()
app = create_app()


@app.get('/health', tags=['health'])
def health_check():
    return {'status': 'ok', 'env': settings.ENV}
