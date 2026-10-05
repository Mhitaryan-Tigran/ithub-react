import { useEffect } from 'react'
import { useProductStore } from '../store/productStore'
import { CATEGORY_LABELS, type Category } from '../types/product'
import { ProductCard } from './ProductCard'
import styles from './Catalog.module.css'

const categories = Object.keys(CATEGORY_LABELS) as Category[]

export function Catalog() {
  const { category, request, setCategory, load } = useProductStore()

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section>
      <div className={styles.filters}>
        <button className={category === null ? styles.chipActive : styles.chip} onClick={() => setCategory(null)}>Все</button>
        {categories.map((item) => (
          <button key={item} className={category === item ? styles.chipActive : styles.chip} onClick={() => setCategory(item)}>
            {CATEGORY_LABELS[item]}
          </button>
        ))}
      </div>
      <div className={styles.filters}>
        <button className={styles.ghost} onClick={() => void load({ delay_ms: 2000 })}>Медленный запрос</button>
        <button className={styles.ghost} onClick={() => void load({ limit: 1000 })}>Запрос с ошибкой</button>
      </div>
      {request.status === 'idle' && <p className={styles.muted}>Запрос ещё не отправлен</p>}
      {request.status === 'loading' && (
        <div className={styles.state} role="status">
          <span className={styles.spinner} /> Загружаем товары…
        </div>
      )}
      {request.status === 'error' && (
        <div className={styles.error} role="alert">
          <strong>Не удалось загрузить</strong>
          <span>{request.error}</span>
          <button className={styles.ghost} onClick={() => void load()}>Повторить</button>
        </div>
      )}
      {request.status === 'success' && (
        <>
          <p className={styles.muted}>Найдено: {request.data.total}</p>
          <ul className={styles.grid}>
            {request.data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
