import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import styles from './Layout.module.css'

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)

export function AppLayout() {
  const { user, logout } = useAuth()
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink to="/" end className={linkClass}>Главная</NavLink>
          <NavLink to="/products" className={linkClass}>Каталог</NavLink>
          <NavLink to="/profile" className={linkClass}>Профиль</NavLink>
          <NavLink to="/about" className={linkClass}>О проекте</NavLink>
        </nav>
        {user ? (
          <button className={styles.ghost} onClick={logout}>Выйти ({user.name})</button>
        ) : (
          <NavLink to="/login" className={linkClass}>Войти</NavLink>
        )}
      </header>
      <main className={styles.page}>
        <Outlet />
      </main>
    </>
  )
}
