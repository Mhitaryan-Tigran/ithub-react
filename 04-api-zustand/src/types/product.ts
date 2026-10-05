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

export interface ProductQuery {
  category?: Category
  search?: string
  limit?: number
  delay_ms?: number
}

export const CATEGORY_LABELS: Record<Category, string> = {
  laptops: 'Ноутбуки',
  phones: 'Смартфоны',
  audio: 'Аудио',
  displays: 'Мониторы',
  tablets: 'Планшеты',
}
