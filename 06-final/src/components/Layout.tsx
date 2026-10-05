import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cartCount, useCartStore } from '../store/cartStore'
import styles from './Layout.module.css'

const link = ({ isActive }: { isActive: boolean }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)

export function Layout() {
  const { user, logout } = useAuthStore()
  const count = useCartStore((state) => cartCount(state.lines))

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link to="/" className={styles.brand}>Tech Store</Link>
          <nav className={styles.nav}>
            <NavLink to="/products" className={link}>Каталог</NavLink>
            <NavLink to="/orders" className={link}>Заказы</NavLink>
            <NavLink to="/cart" className={link}>
              Корзина{count > 0 && <span className={styles.count}>{count}</span>}
            </NavLink>
          </nav>
          <div className={styles.account}>
            {user ? (
              <>
                <span className={styles.user}>{user.name}</span>
                <button className={styles.logout} onClick={() => void logout()}>Выйти</button>
              </>
            ) : (
              <NavLink to="/login" className={link}>Войти</NavLink>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}
