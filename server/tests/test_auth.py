from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from jose import jwt

from app.core.config import settings


def _unique_email() -> str:
    return f'user-{uuid4().hex[:12]}@example.com'


def _signup(client, email: str, password: str = 'test1234'):
    return client.post('/api/auth/signup', json={'email': email, 'password': password})


def _login(client, email: str, password: str = 'test1234'):
    return client.post('/api/auth/login', json={'email': email, 'password': password})


def test_signup_and_login_returns_valid_token_and_me(client):
    email = _unique_email()
    password = 'test1234'

    r = _signup(client, email=email, password=password)
    assert r.status_code == 200
    body = r.json()
    assert body['email'] == email
    assert 'id' in body

    r = _login(client, email=email, password=password)
    assert r.status_code == 200
    data = r.json()
    assert data['token_type'] == 'bearer'
    assert isinstance(data['access_token'], str) and len(data['access_token']) > 10

    # token works on protected endpoint
    headers = {'Authorization': f'Bearer {data["access_token"]}'}
    r = client.get('/api/users/me', headers=headers)
    assert r.status_code == 200
    me = r.json()
    assert me['email'] == email


def test_signup_duplicate_email_returns_400(client):
    email = _unique_email()
    password = 'test1234'

    r = _signup(client, email=email, password=password)
    assert r.status_code == 200

    r = _signup(client, email=email, password=password)
    assert r.status_code == 400
    assert r.json()['detail'] == 'Email already registered'


def test_login_wrong_password_returns_401(client):
    email = _unique_email()
    r = _signup(client, email=email, password='correct-pass')
    assert r.status_code == 200

    r = _login(client, email=email, password='wrong-pass')
    assert r.status_code == 401
    assert r.json()['detail'] == 'Invalid email or password'


def test_me_requires_authentication(client):
    r = client.get('/api/users/me')
    assert r.status_code == 401


def test_me_rejects_malformed_token(client):
    r = client.get('/api/users/me', headers={'Authorization': 'Bearer not-a-jwt'})
    assert r.status_code == 401
    assert r.json()['detail'] == 'Could not validate credentials'


def test_me_rejects_non_string_subject(client):
    # Ensure non-string 'sub' claim fails (guarded in get_current_user)
    payload = {
        'sub': 123,
        'exp': datetime.now(tz=timezone.utc) + timedelta(minutes=5),
    }
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    r = client.get('/api/users/me', headers={'Authorization': f'Bearer {token}'})
    assert r.status_code == 401
    assert r.json()['detail'] == 'Could not validate credentials'


def test_me_rejects_expired_token(client):
    # create a real user so that the only failure mode is token validation
    email = _unique_email()
    r = _signup(client, email=email)
    assert r.status_code == 200

    expired_payload = {
        'sub': email,
        'exp': datetime.now(tz=timezone.utc) - timedelta(minutes=5),
    }
    token = jwt.encode(
        expired_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    r = client.get('/api/users/me', headers={'Authorization': f'Bearer {token}'})
    assert r.status_code == 401
    assert r.json()['detail'] == 'Could not validate credentials'
