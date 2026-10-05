import { useAuth } from '../auth/useAuth'
import { Greeting } from './Greeting'
import styles from './Layout.module.css'

export function Profile() {
  return (
    <div>
      <h2>Профиль</h2>
      <Greeting />
      <p className={styles.muted}>Компоненты Header, UserBadge, Dashboard, Profile и Greeting читают пользователя через useAuth() — без передачи props.</p>
      <SessionInfo />
    </div>
  )
}

function SessionInfo() {
  const { user } = useAuth()
  return <code className={styles.code}>{JSON.stringify(user)}</code>
}
