import { useEffect, useState } from 'react'
import { errorMessage, shopApi } from '../api/endpoints'
import { ErrorBox } from '../components/ErrorBox'
import { Spinner } from '../components/Spinner'
import { useAuthStore } from '../store/authStore'
import { formatPrice, type Order } from '../types/api'
import type { RequestState } from '../types/request'
import ui from '../styles/ui.module.css'
import styles from './OrdersPage.module.css'

export function OrdersPage() {
  const user = useAuthStore((state) => state.user)
  const [request, setRequest] = useState<RequestState<Order[]>>({ status: 'idle' })

  const load = () => {
    setRequest({ status: 'loading' })
    shopApi.orders().then(
      (data) => setRequest({ status: 'success', data }),
      (error: unknown) => setRequest({ status: 'error', error: errorMessage(error) }),
    )
  }

  useEffect(load, [])

  return (
    <section>
      <p className={ui.eyebrow}>Защищённая страница · {user?.email}</p>
      <h1 className={ui.title}>Мои заказы</h1>
      {request.status === 'loading' && <Spinner label="Загружаем заказы…" />}
      {request.status === 'error' && <ErrorBox message={request.error} onRetry={load} />}
      {request.status === 'success' && (request.data.length === 0 ? <p className={ui.muted}>Заказов пока нет</p> : (
        <ul className={styles.orders}>
          {request.data.map((order) => (
            <li key={order.id} className={styles.order}>
              <div className={styles.head}>
                <strong>Заказ №{order.id}</strong>
                <span className={ui.muted}>{new Date(order.created_at + 'Z').toLocaleString('ru-RU')}</span>
              </div>
              <ul className={styles.items}>
                {order.items.map((item) => (
                  <li key={item.product_id}>{item.title} × {item.quantity} <span className={ui.muted}>{formatPrice(item.price * item.quantity)}</span></li>
                ))}
              </ul>
              <strong className={styles.total}>{formatPrice(order.total)}</strong>
            </li>
          ))}
        </ul>
      ))}
    </section>
  )
}
