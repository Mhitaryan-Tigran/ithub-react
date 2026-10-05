export type Category = 'laptops' | 'phones' | 'audio' | 'displays' | 'tablets'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: Category
  rating: number
  in_stock: boolean
}

export interface ProductPage {
  items: Product[]
  total: number
}

export interface User {
  id: number
  email: string
  name: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface OrderItem {
  product_id: number
  title: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  total: number
  created_at: string
  items: OrderItem[]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  laptops: 'Ноутбуки',
  phones: 'Смартфоны',
  audio: 'Аудио',
  displays: 'Мониторы',
  tablets: 'Планшеты',
}

export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
