import { Link } from 'react-router-dom'
import ui from '../styles/ui.module.css'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <section className={styles.hero}>
      <p className={ui.eyebrow}>Fullstack React + TypeScript + FastAPI</p>
      <h1 className={styles.title}>Техника, которую выбирают для учёбы и работы.</h1>
      <p className={styles.lead}>Каталог с фильтрами, корзина, оформление заказов и история покупок — данные приходят из Python API.</p>
      <div className={styles.actions}>
        <Link to="/products" className={ui.button}>Открыть каталог</Link>
        <Link to="/orders" className={ui.link}>Мои заказы ›</Link>
      </div>
    </section>
  )
}
