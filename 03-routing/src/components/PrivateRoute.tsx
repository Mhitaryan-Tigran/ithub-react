import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, isRestoring } = useAuth()
  const location = useLocation()
  if (isRestoring) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
