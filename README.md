# ithub-react

Coursework for "Fullstack React + TypeScript" at IThub. Every task is a separate Vite + React 19 + TypeScript (strict) project; tasks 4–6 talk to one shared FastAPI backend.

| Folder | Task | What it shows |
|---|---|---|
| [01-taskboard](01-taskboard) | Conditional rendering | typed props, lists with keys, empty state, CSS Modules |
| [02-auth-context](02-auth-context) | Context API | AuthContext, custom `useAuth` hook, localStorage restore |
| [03-routing](03-routing) | Protected routes | React Router 7, nested layout, `useParams`, PrivateRoute with return path, 404 |
| [04-api-zustand](04-api-zustand) | FastAPI integration | axios client, Zustand store, loading / error / success states |
| [05-session](05-session) | Session management | JWT access + refresh, axios interceptors, silent refresh and retry, logout |
| [06-final](06-final) | Final project | Tech Store: catalog, product page, cart, checkout, order history |
| [backend](backend) | API | FastAPI + SQLite: products, JWT auth, orders |

## Run

```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --port 8000
```

```bash
cd 06-final
cp .env.example .env
npm install
npm run dev
```

Test account: `student@ithub.ru` / `Password123`.

Each task folder has a README and a `screenshots/` directory.
