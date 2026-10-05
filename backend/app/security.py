import time
from typing import Literal

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings
from .db import connect
from .schemas import TokenPair, User

bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def make_token(user_id: int, kind: Literal["access", "refresh"], version: int) -> str:
    ttl = settings.access_ttl_seconds if kind == "access" else settings.refresh_ttl_seconds
    now = int(time.time())
    return jwt.encode({"sub": str(user_id), "type": kind, "ver": version, "iat": now, "exp": now + ttl}, settings.jwt_secret, algorithm="HS256")


def issue_pair(user_id: int, version: int) -> TokenPair:
    return TokenPair(access_token=make_token(user_id, "access", version), refresh_token=make_token(user_id, "refresh", version), expires_in=settings.access_ttl_seconds)


def decode(token: str, kind: Literal["access", "refresh"]) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"{kind} token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"invalid {kind} token")
    if payload.get("type") != kind:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"expected a {kind} token")
    return payload


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "missing bearer token")
    payload = decode(credentials.credentials, "access")
    with connect() as conn:
        row = conn.execute("SELECT id, email, name, token_version FROM users WHERE id = ?", (int(payload["sub"]),)).fetchone()
    if row is None or row["token_version"] != payload["ver"]:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "token revoked")
    return User(id=row["id"], email=row["email"], name=row["name"])
