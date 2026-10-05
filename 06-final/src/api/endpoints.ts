import { AxiosError } from 'axios'
import { api } from './client'
import type { Category, Order, Product, ProductPage, TokenPair, User } from '../types/api'

export const shopApi = {
  products: (params: { category?: Category; search?: string }) => api.get<ProductPage>('/products', { params }).then((r) => r.data),
  product: (id: number) => api.get<Product>(`/products/${id}`).then((r) => r.data),
  login: (email: string, password: string) => api.post<TokenPair>('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
  logout: () => api.post('/auth/logout'),
  orders: () => api.get<Order[]>('/orders').then((r) => r.data),
  createOrder: (items: { product_id: number; quantity: number }[]) => api.post<Order>('/orders', { items }).then((r) => r.data),
}

export function errorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) return 'Сервер недоступен. Запустите FastAPI на порту 8000.'
    const detail: unknown = error.response.data?.detail
    if (typeof detail === 'string') return detail
    return `Ошибка ${error.response.status}`
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка'
}
