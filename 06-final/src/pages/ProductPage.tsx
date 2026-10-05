import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { errorMessage, shopApi } from '../api/endpoints'
import { ErrorBox } from '../components/ErrorBox'
import { Spinner } from '../components/Spinner'
import { useCartStore } from '../store/cartStore'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types/api'
import type { RequestState } from '../types/request'
import ui from '../styles/ui.module.css'
import styles from './ProductPage.module.css'

type ProductParams = { id: string }

export function ProductPage() {
  const { id } = useParams<ProductParams>()
  const productId = Number(id)
  const add = useCartStore((state) => state.add)
  const [request, setRequest] = useState<RequestState<Product>>({ status: 'idle' })

  useEffect(() => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setRequest({ status: 'error', error: `Некорректный id: ${id}` })
      return
    }
    let active = true
    setRequest({ status: 'loading' })
    shopApi.product(productId).then(
      (data) => active && setRequest({ status: 'success', data }),
      (error: unknown) => active && setRequest({ status: 'error', error: errorMessage(error) }),
    )
    return () => {
      active = false
    }
  }, [id, productId])

  return (
    <section>
      <Link to="/products" className={ui.link}>‹ Каталог</Link>
      {request.status === 'loading' && <Spinner label="Загружаем товар…" />}
      {request.status === 'error' && <ErrorBox message={request.error} />}
      {request.status === 'success' && (
        <article className={styles.product}>
          <p className={ui.eyebrow}>{CATEGORY_LABELS[request.data.category]} · ★ {request.data.rating.toFixed(1)}</p>
          <h1 className={ui.title}>{request.data.title}</h1>
          <p className={styles.description}>{request.data.description}</p>
          <p className={styles.price}>{formatPrice(request.data.price)}</p>
          <button className={ui.button} disabled={!request.data.in_stock} onClick={() => add(request.data)}>
            {request.data.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
          </button>
        </article>
      )}
    </section>
  )
}
