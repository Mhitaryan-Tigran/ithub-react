import time

import pytest
from fastapi.testclient import TestClient

from app.config import settings


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "database_path", str(tmp_path / "test.db"))
    from app.main import app
    with TestClient(app) as c:
        yield c


def login(client):
    return client.post("/auth/login", json={"email": "student@ithub.ru", "password": "Password123"}).json()


def test_products_filters(client):
    page = client.get("/products", params={"category": "audio"}).json()
    assert page["total"] == 3 and {p["category"] for p in page["items"]} == {"audio"}
    assert client.get("/products", params={"search": "MacBook"}).json()["total"] == 2
    assert client.get("/products/999").status_code == 404


def test_login_me_and_bad_password(client):
    tokens = login(client)
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert me.json()["email"] == "student@ithub.ru"
    assert client.post("/auth/login", json={"email": "student@ithub.ru", "password": "nope12345"}).status_code == 401
    assert client.get("/auth/me").status_code == 401


def test_refresh_and_logout_revokes(client):
    tokens = login(client)
    time.sleep(1.1)
    fresh = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]}).json()
    assert fresh["access_token"] != tokens["access_token"]
    assert client.post("/auth/refresh", json={"refresh_token": tokens["access_token"]}).status_code == 401
    client.post("/auth/logout", headers={"Authorization": f"Bearer {fresh['access_token']}"})
    assert client.post("/auth/refresh", json={"refresh_token": fresh["refresh_token"]}).status_code == 401


def test_orders_need_auth_and_stock(client):
    assert client.post("/orders", json={"items": [{"product_id": 1, "quantity": 1}]}).status_code == 401
    headers = {"Authorization": f"Bearer {login(client)['access_token']}"}
    order = client.post("/orders", json={"items": [{"product_id": 1, "quantity": 2}, {"product_id": 7, "quantity": 1}]}, headers=headers).json()
    assert order["total"] == 129990 * 2 + 24990
    assert client.post("/orders", json={"items": [{"product_id": 3, "quantity": 1}]}, headers=headers).status_code == 409
    assert len(client.get("/orders", headers=headers).json()) == 1
