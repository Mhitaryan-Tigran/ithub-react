import { Link, useLocation } from 'react-router-dom'
import styles from '../components/Layout.module.css'

export function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <section>
      <p className={styles.code404}>404</p>
      <h1 className={styles.title}>Страницы {pathname} нет</h1>
      <Link to="/" className={styles.back}>На главную ›</Link>
    </section>
  )
}
