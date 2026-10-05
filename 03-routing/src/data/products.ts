export interface Product {
  id: number
  title: string
  price: number
  category: string
  description: string
}

export const products: Product[] = [
  { id: 1, title: 'MacBook Air 13 M4', price: 129990, category: 'Ноутбуки', description: 'Лёгкий ноутбук на 18 часов работы.' },
  { id: 2, title: 'iPhone 17', price: 89990, category: 'Смартфоны', description: '6,3 дюйма, ProMotion, камера 48 Мп.' },
  { id: 3, title: 'AirPods Pro 3', price: 24990, category: 'Аудио', description: 'Активное шумоподавление.' },
  { id: 4, title: 'iPad Air 11 M3', price: 64990, category: 'Планшеты', description: 'Для учёбы и рисования.' },
]

export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
