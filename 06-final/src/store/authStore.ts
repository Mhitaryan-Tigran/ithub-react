import { create } from 'zustand'
import { configureSession } from '../api/client'
import { shopApi } from '../api/endpoints'
import { tokens } from '../api/tokens'
import type { User } from '../types/api'

type Status = 'restoring' | 'anonymous' | 'authenticated'

let restoring: Promise<void> | null = null

interface AuthStore {
  status: Status
  user: User | null
  login: (email: string, password: string) => Promise<void>
  restore: () => Promise<void>
  logout: () => Promise<void>
}

async function restoreSession(set: (state: Partial<AuthStore>) => void) {
  if (!tokens.access() && !tokens.refresh()) {
    set({ status: 'anonymous' })
    return
  }
  try {
    set({ status: 'authenticated', user: await shopApi.me() })
  } catch {
    tokens.clear()
    set({ status: 'anonymous', user: null })
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'restoring',
  user: null,
  login: async (email, password) => {
    const pair = await shopApi.login(email, password)
    tokens.save(pair.access_token, pair.refresh_token)
    set({ status: 'authenticated', user: await shopApi.me() })
  },
  restore: () => {
    restoring ??= restoreSession(set)
    return restoring
  },
  logout: async () => {
    await shopApi.logout().catch(() => undefined)
    tokens.clear()
    set({ status: 'anonymous', user: null })
  },
}))

configureSession(
  () => undefined,
  () => useAuthStore.setState({ status: 'anonymous', user: null }),
)
