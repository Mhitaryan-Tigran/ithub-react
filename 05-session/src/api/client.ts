import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokens } from './tokens'
import type { TokenPair } from './types'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const api = axios.create({ baseURL, timeout: 8000 })
const bare = axios.create({ baseURL, timeout: 8000 })

type Listener = (event: string) => void
let onEvent: Listener = () => {}
let onSessionExpired: () => void = () => {}

export function configureSession(listener: Listener, expired: () => void) {
  onEvent = listener
  onSessionExpired = expired
}

api.interceptors.request.use((config) => {
  const access = tokens.access()
  if (access) config.headers.Authorization = `Bearer ${access}`
  return config
})

let refreshing: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refresh = tokens.refresh()
  if (!refresh) throw new Error('no refresh token')
  const { data } = await bare.post<TokenPair>('/auth/refresh', { refresh_token: refresh })
  tokens.save(data.access_token, data.refresh_token)
  return data.access_token
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const isAuthCall = original?.url?.startsWith('/auth/login') || original?.url?.startsWith('/auth/refresh')
    if (error.response?.status !== 401 || !original || original._retry || isAuthCall) {
      return Promise.reject(error)
    }
    original._retry = true
    try {
      onEvent('401 → обновляем access-токен через /auth/refresh')
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null
      })
      const access = await refreshing
      onEvent('токен обновлён, повторяем исходный запрос')
      original.headers.Authorization = `Bearer ${access}`
      return api(original)
    } catch (refreshError) {
      onEvent('refresh не удался → выходим и отправляем на страницу входа')
      tokens.clear()
      onSessionExpired()
      return Promise.reject(refreshError)
    }
  },
)
