import { useState } from 'react'
import { api } from '../api/client'
import { tokens } from '../api/tokens'
import type { Order } from '../api/types'
import { useAuthStore } from '../store/authStore'
import styles from '../components/Session.module.css'

type OrdersState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string } | { status: 'success'; data: Order[] }

export function AccountPage() {
  const { user, log, logout } = useAuthStore()
  const [orders, setOrders] = useState<OrdersState>({ status: 'idle' })

  const loadOrders = async () => {
    setOrders({ status: 'loading' })
    try {
      const { data } = await api.get<Order[]>('/orders')
      setOrders({ status: 'success', data })
    } catch {
      setOrders({ status: 'error', error: 'Запрос не удался' })
    }
  }

  const placeOrder = async () => {
    await api.post('/orders', { items: [{ product_id: 7, quantity: 1 }] })
    await loadOrders()
  }

  const expireAccess = () => {
    localStorage.setItem('access_token', 'expired.access.token')
    useAuthStore.getState().note('access-токен испорчен — следующий запрос получит 401')
  }

  const breakBoth = () => {
    localStorage.setItem('access_token', 'expired.access.token')
    localStorage.setItem('refresh_token', 'revoked.refresh.token')
    useAuthStore.getState().note('испорчены оба токена — refresh не сможет помочь')
  }

  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <div>
          <p className={styles.muted}>Защищённая страница</p>
          <h1>{user?.name}</h1>
          <p className={styles.muted}>{user?.email}</p>
        </div>
        <button className={styles.ghost} onClick={() => void logout()}>Выйти</button>
      </header>
      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Заказы</h2>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => void loadOrders()}>Загрузить /orders</button>
            <button className={styles.ghost} onClick={() => void placeOrder()}>Оформить заказ</button>
          </div>
          {orders.status === 'loading' && <p className={styles.muted}>Загружаем…</p>}
          {orders.status === 'error' && <p className={styles.formError}>{orders.error}</p>}
          {orders.status === 'success' && (orders.data.length === 0 ? <p className={styles.muted}>Заказов пока нет</p> : (
            <ul className={styles.list}>
              {orders.data.map((order) => (
                <li key={order.id}>№{order.id} · {order.items.map((item) => item.title).join(', ')} · <strong>{order.total.toLocaleString('ru-RU')} ₽</strong></li>
              ))}
            </ul>
          ))}
        </section>
        <section className={styles.card}>
          <h2>Токены</h2>
          <code className={styles.code}>access: {tokens.access()?.slice(0, 28)}…{'\n'}refresh: {tokens.refresh()?.slice(0, 28)}…</code>
          <div className={styles.actions}>
            <button className={styles.ghost} onClick={expireAccess}>Испортить access</button>
            <button className={styles.ghost} onClick={breakBoth}>Испортить оба</button>
          </div>
          <h3>Журнал сессии</h3>
          <ol className={styles.log}>{log.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ol>
        </section>
      </div>
    </main>
  )
}
