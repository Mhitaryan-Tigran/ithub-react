import { useAuth } from '../auth/useAuth'
import { LoginForm } from './LoginForm'
import { Profile } from './Profile'
import styles from './Layout.module.css'

export function Dashboard() {
  const { user, isRestoring } = useAuth()
  if (isRestoring) return <p className={styles.muted}>Восстанавливаем сессию…</p>
  return <section className={styles.card}>{user ? <Profile /> : <LoginForm />}</section>
}
