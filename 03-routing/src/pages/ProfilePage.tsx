import { useAuth } from '../auth/useAuth'
import styles from '../components/Layout.module.css'

export function ProfilePage() {
  const { user } = useAuth()
  return (
    <section className={styles.card}>
      <p className={styles.muted}>Защищённая страница</p>
      <h1 className={styles.title}>{user?.name}</h1>
      <p>Сюда нельзя попасть без входа: прямой переход на /profile перенаправляет на /login.</p>
    </section>
  )
}
