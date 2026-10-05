import { useAuth } from '../auth/useAuth'
import styles from './Layout.module.css'

export function UserBadge() {
  const { user } = useAuth()
  if (!user) return <span className={styles.muted}>Гость</span>
  return (
    <span className={styles.badge}>
      <span className={styles.avatar}>{user.name.slice(0, 1).toUpperCase()}</span>
      {user.name}
    </span>
  )
}
