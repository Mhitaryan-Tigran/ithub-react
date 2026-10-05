# backend

FastAPI + SQLite API used by tasks 04–06.

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness |
| GET | `/products` | `category`, `search`, `in_stock`, `limit` (≤100), `offset`, `delay_ms` (≤5000, to demo loading) |
| GET | `/products/{id}` | 404 when missing |
| POST / PATCH / DELETE | `/products/{id}` | require a Bearer token |
| POST | `/auth/register`, `/auth/login` | return an access + refresh pair |
| POST | `/auth/refresh` | exchanges a refresh token for a new pair |
| POST | `/auth/logout` | bumps `token_version`, revoking every issued token |
| GET | `/auth/me` | current user |
| GET / POST | `/orders` | order history and checkout, 409 when a product is out of stock |

Access tokens live 5 minutes, refresh tokens 7 days. Settings are read from `.env` (see `.env.example`).

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/pytest
.venv/bin/uvicorn app.main:app --port 8000
```
