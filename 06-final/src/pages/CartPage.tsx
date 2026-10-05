import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { errorMessage, shopApi } from '../api/endpoints'
import { useAuthStore } from '../store/authStore'
import { cartTotal, useCartStore } from '../store/cartStore'
import { formatPrice, type Order } from '../types/api'
import type { RequestState } from '../types/request'
import ui from '../styles/ui.module.css'
import styles from './CartPage.module.css'

export function CartPage() {
  const { lines, setQuantity, remove, clear } = useCartStore()
  const status = useAuthStore((state) => state.status)
  const navigate = useNavigate()
  const [checkout, setCheckout] = useState<RequestState<Order>>({ status: 'idle' })

  const placeOrder = async () => {
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setCheckout({ status: 'loading' })
    try {
      const order = await shopApi.createOrder(lines.map((line) => ({ product_id: line.product.id, quantity: line.quantity })))
      clear()
      setCheckout({ status: 'success', data: order })
    } catch (error) {
      setCheckout({ status: 'error', error: errorMessage(error) })
    }
  }

  if (checkout.status === 'success') {
    return (
      <section className={ui.card}>
        <p className={ui.eyebrow}>Заказ №{checkout.data.id} оформлен</p>
        <h1 className={ui.title}>Спасибо!</h1>
        <p>Сумма {formatPrice(checkout.data.total)}. Заказ уже в истории.</p>
        <Link to="/orders" className={ui.button}>Мои заказы</Link>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section>
        <h1 className={ui.title}>Корзина</h1>
        <p className={ui.muted}>Корзина пуста. <Link to="/products" className={ui.link}>Перейти в каталог ›</Link></p>
      </section>
    )
  }

  return (
    <section>
      <h1 className={ui.title}>Корзина</h1>
      <ul className={styles.lines}>
        {lines.map((line) => (
          <li key={line.product.id} className={styles.line}>
            <Link to={`/products/${line.product.id}`} className={styles.name}>{line.product.title}</Link>
            <div className={styles.qty}>
              <button aria-label="Меньше" onClick={() => setQuantity(line.product.id, line.quantity - 1)}>−</button>
              <span>{line.quantity}</span>
              <button aria-label="Больше" onClick={() => setQuantity(line.product.id, line.quantity + 1)}>+</button>
            </div>
            <span className={styles.sum}>{formatPrice(line.product.price * line.quantity)}</span>
            <button className={styles.remove} onClick={() => remove(line.product.id)} aria-label={`Удалить ${line.product.title}`}>×</button>
          </li>
        ))}
      </ul>
      <div className={styles.total}>
        <span>Итого</span>
        <strong>{formatPrice(cartTotal(lines))}</strong>
      </div>
      {checkout.status === 'error' && <p className={ui.errorText} role="alert">{checkout.error}</p>}
      <button className={ui.button} disabled={checkout.status === 'loading'} onClick={() => void placeOrder()}>
        {checkout.status === 'loading' ? 'Оформляем…' : status === 'authenticated' ? 'Оформить заказ' : 'Войти и оформить'}
      </button>
    </section>
  )
}
