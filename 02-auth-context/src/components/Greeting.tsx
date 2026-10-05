import { useAuth } from '../auth/useAuth'

export function Greeting() {
  const { user } = useAuth()
  return <p>Здравствуйте, {user?.name}! Вы вошли в систему.</p>
}
