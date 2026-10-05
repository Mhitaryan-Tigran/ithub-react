import { useAuth } from '../auth/useAuth'
import { UserBadge } from './UserBadge'
import styles from './Layout.module.css'

export function Header() {
  const { user, logout } = useAuth()
  return (
    <header className={styles.header}>
      <strong>Context API</strong>
      <div className={styles.headerRight}>
        <UserBadge />
        {user && (
          <button className={styles.ghost} onClick={logout}>
            Выйти
          </button>
        )}
      </div>
    </header>
  )
}
