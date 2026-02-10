import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


@pytest.fixture(scope='session')
def engine():
    engine = create_engine(
        'sqlite+pysqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    from app.db.base import Base
    import app.db.models  # noqa

    print(Base.metadata.tables.keys())

    Base.metadata.create_all(bind=engine)
    return engine


@pytest.fixture()
def db_session(engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(engine):
    from app.main import create_app
    from app.db.session import get_db

    app = create_app()

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


def _signup_and_login(
    client: TestClient, email: str = 'test@test.com', password: str = 'test1234'
):
    r = client.post('/api/auth/signup', json={'email': email, 'password': password})
    assert r.status_code in (200, 400)
    r = client.post('/api/auth/login', json={'email': email, 'password': password})
    assert r.status_code == 200
    token = r.json()['access_token']
    return token


@pytest.fixture()
def auth_header(client: TestClient):
    token = _signup_and_login(client)
    return {'Authorization': f'Bearer {token}'}
