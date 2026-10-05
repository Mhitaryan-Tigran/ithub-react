import { createContext, useEffect, useState, type ReactNode } from 'react'

export interface User {
  id: number
  name: string
}

export interface AuthContextValue {
  user: User | null
  isRestoring: boolean
  login: (name: string) => void
  logout: () => void
}

const STORAGE_KEY = 'auth-user'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && 'id' in parsed && 'name' in parsed && typeof parsed.id === 'number' && typeof parsed.name === 'string') {
      return { id: parsed.id, name: parsed.name }
    }
  } catch {
    return null
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    setUser(readStoredUser())
    setIsRestoring(false)
  }, [])

  const login = (name: string) => {
    const next: User = { id: Date.now(), name: name.trim() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isRestoring, login, logout }}>{children}</AuthContext.Provider>
}
