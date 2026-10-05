import { create } from 'zustand'
import { AxiosError } from 'axios'
import { api, configureSession } from '../api/client'
import { tokens } from '../api/tokens'
import type { LoginRequest, TokenPair, User } from '../api/types'

type Status = 'restoring' | 'anonymous' | 'authenticated'

let restoring: Promise<void> | null = null

interface AuthStore {
  status: Status
  user: User | null
  log: string[]
  login: (credentials: LoginRequest) => Promise<void>
  restore: () => Promise<void>
  restoreOnce: () => Promise<void>
  logout: () => Promise<void>
  note: (event: string) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  status: 'restoring',
  user: null,
  log: [],
  note: (event) => set({ log: [`${new Date().toLocaleTimeString('ru-RU')} ${event}`, ...get().log].slice(0, 12) }),
  login: async (credentials) => {
    const { data } = await api.post<TokenPair>('/auth/login', credentials)
    tokens.save(data.access_token, data.refresh_token)
    const me = await api.get<User>('/auth/me')
    set({ status: 'authenticated', user: me.data })
    get().note(`вход: токены сохранены, access живёт ${data.expires_in} с`)
  },
  restore: () => {
    restoring ??= get().restoreOnce()
    return restoring
  },
  restoreOnce: async () => {
    if (!tokens.access() && !tokens.refresh()) {
      set({ status: 'anonymous' })
      return
    }
    try {
      const me = await api.get<User>('/auth/me')
      set({ status: 'authenticated', user: me.data })
      get().note('сессия восстановлена после перезагрузки')
    } catch {
      tokens.clear()
      set({ status: 'anonymous', user: null })
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      if (!(error instanceof AxiosError)) throw error
    }
    tokens.clear()
    set({ status: 'anonymous', user: null })
    get().note('выход: оба токена удалены, refresh отозван на сервере')
  },
}))

configureSession(
  (event) => useAuthStore.getState().note(event),
  () => useAuthStore.setState({ status: 'anonymous', user: null }),
)
