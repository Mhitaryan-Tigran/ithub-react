import { Link, useLocation } from 'react-router-dom'
import ui from '../styles/ui.module.css'

export function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <section>
      <p className={ui.eyebrow}>404</p>
      <h1 className={ui.title}>Страницы {pathname} нет</h1>
      <Link to="/" className={ui.link}>На главную ›</Link>
    </section>
  )
}
