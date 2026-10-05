import sqlite3
from contextlib import contextmanager

import bcrypt

from .config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    token_version INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    in_stock INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items (
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price REAL NOT NULL
);
"""

PRODUCTS = [
    ("MacBook Air 13 M4", "Лёгкий ноутбук на 18 часов работы, 16 ГБ памяти.", 129990, "laptops", 4.8, 1),
    ("MacBook Pro 14 M4 Pro", "Mini-LED дисплей 120 Гц, 24 ГБ памяти, 1 ТБ.", 249990, "laptops", 4.9, 1),
    ("ThinkPad X1 Carbon", "Бизнес-ультрабук 1,1 кг с лучшей клавиатурой в классе.", 189990, "laptops", 4.6, 0),
    ("iPhone 17", "6,3 дюйма, ProMotion, камера 48 Мп.", 89990, "phones", 4.7, 1),
    ("Pixel 10", "Чистый Android, семь лет обновлений.", 74990, "phones", 4.5, 1),
    ("Galaxy S26", "Компактный флагман с телеобъективом.", 84990, "phones", 4.4, 0),
    ("AirPods Pro 3", "Активное шумоподавление и отслеживание пульса.", 24990, "audio", 4.8, 1),
    ("Sony WH-1000XM6", "Полноразмерные наушники с лучшим шумодавом.", 37990, "audio", 4.7, 1),
    ("HomePod mini", "Компактная колонка с объёмным звуком.", 11990, "audio", 4.3, 1),
    ("Studio Display", "27 дюймов 5K, камера 12 Мп и шесть динамиков.", 169990, "displays", 4.6, 1),
    ("LG UltraFine 32 4K", "IPS, USB-C 96 Вт, заводская калибровка.", 64990, "displays", 4.4, 0),
    ("iPad Air 11 M3", "Планшет для учёбы и рисования с Apple Pencil Pro.", 64990, "tablets", 4.7, 1),
]


@contextmanager
def connect():
    conn = sqlite3.connect(settings.database_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db(seed: bool = True):
    with connect() as conn:
        conn.executescript(SCHEMA)
        if seed and conn.execute("SELECT COUNT(*) FROM products").fetchone()[0] == 0:
            conn.executemany("INSERT INTO products (title, description, price, category, rating, in_stock) VALUES (?, ?, ?, ?, ?, ?)", PRODUCTS)
        if seed and conn.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
            hashed = bcrypt.hashpw(b"Password123", bcrypt.gensalt()).decode()
            conn.execute("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)", ("student@ithub.ru", "Тигран", hashed))
