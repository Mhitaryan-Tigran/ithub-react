import { Link } from 'react-router-dom'
import styles from '../components/Layout.module.css'

export function HomePage() {
  return (
    <section>
      <h1 className={styles.title}>Магазин техники</h1>
      <p className={styles.lead}>Клиентская маршрутизация на React Router: страницы, параметр в пути, защищённый маршрут и 404.</p>
      <Link to="/products" className={styles.button}>Открыть каталог</Link>
    </section>
  )
}
