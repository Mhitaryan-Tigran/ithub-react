from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Category = Literal["laptops", "phones", "audio", "displays", "tablets"]


class Product(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: Category
    rating: float
    in_stock: bool


class ProductCreate(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=2, max_length=500)
    price: float = Field(ge=0)
    category: Category
    rating: float = Field(default=0, ge=0, le=5)
    in_stock: bool = True


class ProductUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = Field(default=None, min_length=2, max_length=500)
    price: float | None = Field(default=None, ge=0)
    category: Category | None = None
    rating: float | None = Field(default=None, ge=0, le=5)
    in_stock: bool | None = None


class ProductPage(BaseModel):
    items: list[Product]
    total: int


class User(BaseModel):
    id: int
    email: str
    name: str


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=60)
    password: str = Field(min_length=8, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=20)


class OrderCreate(BaseModel):
    items: list[OrderItemIn] = Field(min_length=1)


class OrderItem(BaseModel):
    product_id: int
    title: str
    quantity: int
    price: float


class Order(BaseModel):
    id: int
    total: float
    created_at: str
    items: list[OrderItem]
