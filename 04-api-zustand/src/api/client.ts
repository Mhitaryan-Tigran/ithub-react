import axios, { AxiosError } from 'axios'
import type { ProductPage, ProductQuery } from '../types/product'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 8000,
})

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const { data } = await api.get<ProductPage>('/products', { params: query })
  return data
}

export function errorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const detail: unknown = error.response.data?.detail
      const text = Array.isArray(detail) ? detail.map((d: { msg?: string }) => d.msg).join('; ') : typeof detail === 'string' ? detail : error.message
      return `Сервер ответил ${error.response.status}: ${text}`
    }
    return 'Сервер недоступен — запустите FastAPI на порту 8000'
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка'
}
