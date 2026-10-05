import asyncio
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import connect, init_db
from .schemas import (LoginRequest, Order, OrderCreate, OrderItem, Product, ProductCreate, ProductPage, ProductUpdate, RefreshRequest, RegisterRequest,
                      TokenPair, User)
from .security import current_user, decode, hash_password, issue_pair, verify_password


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Shop API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def to_product(row) -> Product:
    return Product(**{**dict(row), "in_stock": bool(row["in_stock"])})


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/products", response_model=ProductPage)
async def list_products(category: str | None = None, search: str | None = None, in_stock: bool | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0), delay_ms: int = Query(0, ge=0, le=5000)):
    if delay_ms:
        await asyncio.sleep(delay_ms / 1000)
    where, params = [], []
    if category:
        where.append("category = ?")
        params.append(category)
    if search:
        where.append("(title LIKE ? OR description LIKE ?)")
        params += [f"%{search}%", f"%{search}%"]
    if in_stock is not None:
        where.append("in_stock = ?")
        params.append(int(in_stock))
    clause = f"WHERE {' AND '.join(where)}" if where else ""
    with connect() as conn:
        total = conn.execute(f"SELECT COUNT(*) FROM products {clause}", params).fetchone()[0]
        rows = conn.execute(f"SELECT * FROM products {clause} ORDER BY id LIMIT ? OFFSET ?", [*params, limit, offset]).fetchall()
    return ProductPage(items=[to_product(r) for r in rows], total=total)


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    with connect() as conn:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "product not found")
    return to_product(row)


@app.post("/products", response_model=Product, status_code=201)
def create_product(data: ProductCreate, user: User = Depends(current_user)):
    with connect() as conn:
        cur = conn.execute("INSERT INTO products (title, description, price, category, rating, in_stock) VALUES (?, ?, ?, ?, ?, ?)", (data.title, data.description, data.price, data.category, data.rating, int(data.in_stock)))
        row = conn.execute("SELECT * FROM products WHERE id = ?", (cur.lastrowid,)).fetchone()
    return to_product(row)


@app.patch("/products/{product_id}", response_model=Product)
def update_product(product_id: int, data: ProductUpdate, user: User = Depends(current_user)):
    changes = data.model_dump(exclude_unset=True)
    if "in_stock" in changes:
        changes["in_stock"] = int(changes["in_stock"])
    with connect() as conn:
        if conn.execute("SELECT 1 FROM products WHERE id = ?", (product_id,)).fetchone() is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "product not found")
        if changes:
            conn.execute(f"UPDATE products SET {', '.join(f'{k} = ?' for k in changes)} WHERE id = ?", [*changes.values(), product_id])
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return to_product(row)


@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, user: User = Depends(current_user)):
    with connect() as conn:
        if conn.execute("DELETE FROM products WHERE id = ?", (product_id,)).rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "product not found")


@app.post("/auth/register", response_model=TokenPair, status_code=201)
def register(data: RegisterRequest):
    with connect() as conn:
        if conn.execute("SELECT 1 FROM users WHERE email = ?", (data.email.lower(),)).fetchone():
            raise HTTPException(status.HTTP_409_CONFLICT, "email already registered")
        cur = conn.execute("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)", (data.email.lower(), data.name, hash_password(data.password)))
    return issue_pair(cur.lastrowid, 0)


@app.post("/auth/login", response_model=TokenPair)
def login(data: LoginRequest):
    with connect() as conn:
        row = conn.execute("SELECT id, password_hash, token_version FROM users WHERE email = ?", (data.email.lower(),)).fetchone()
    if row is None or not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid email or password")
    return issue_pair(row["id"], row["token_version"])


@app.post("/auth/refresh", response_model=TokenPair)
def refresh(data: RefreshRequest):
    payload = decode(data.refresh_token, "refresh")
    with connect() as conn:
        row = conn.execute("SELECT id, token_version FROM users WHERE id = ?", (int(payload["sub"]),)).fetchone()
    if row is None or row["token_version"] != payload["ver"]:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "refresh token revoked")
    return issue_pair(row["id"], row["token_version"])


@app.post("/auth/logout", status_code=204)
def logout(user: User = Depends(current_user)):
    with connect() as conn:
        conn.execute("UPDATE users SET token_version = token_version + 1 WHERE id = ?", (user.id,))


@app.get("/auth/me", response_model=User)
def me(user: User = Depends(current_user)):
    return user


@app.post("/orders", response_model=Order, status_code=201)
def create_order(data: OrderCreate, user: User = Depends(current_user)):
    with connect() as conn:
        items = []
        for item in data.items:
            row = conn.execute("SELECT id, title, price, in_stock FROM products WHERE id = ?", (item.product_id,)).fetchone()
            if row is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, f"product {item.product_id} not found")
            if not row["in_stock"]:
                raise HTTPException(status.HTTP_409_CONFLICT, f"{row['title']} is out of stock")
            items.append(OrderItem(product_id=row["id"], title=row["title"], quantity=item.quantity, price=row["price"]))
        total = sum(i.price * i.quantity for i in items)
        cur = conn.execute("INSERT INTO orders (user_id, total) VALUES (?, ?)", (user.id, total))
        conn.executemany("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [(cur.lastrowid, i.product_id, i.quantity, i.price) for i in items])
        created = conn.execute("SELECT created_at FROM orders WHERE id = ?", (cur.lastrowid,)).fetchone()[0]
    return Order(id=cur.lastrowid, total=total, created_at=created, items=items)


@app.get("/orders", response_model=list[Order])
def list_orders(user: User = Depends(current_user)):
    with connect() as conn:
        orders = conn.execute("SELECT id, total, created_at FROM orders WHERE user_id = ? ORDER BY id DESC", (user.id,)).fetchall()
        result = []
        for o in orders:
            items = conn.execute("SELECT oi.product_id, p.title, oi.quantity, oi.price FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?", (o["id"],)).fetchall()
            result.append(Order(id=o["id"], total=o["total"], created_at=o["created_at"], items=[OrderItem(**dict(i)) for i in items]))
    return result
