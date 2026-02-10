from pathlib import Path
from app.main import create_app
from app.core.config import settings
from fastapi.staticfiles import StaticFiles


app = create_app(is_prod=True)
PROJ_ROOT = Path(__file__).resolve().parent.parent.parent
DIST_DIR = PROJ_ROOT / 'client' / 'dist'


@app.get('/api/health', tags=['health'])
def health_check():
    return {'status': 'ok', 'env': settings.ENV}


app.mount(
    '/',
    StaticFiles(directory=DIST_DIR, html=True, check_dir=True),
    name='frontend_static',
)
