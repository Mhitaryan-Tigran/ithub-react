import { useEffect, type FormEvent } from 'react'
import { ErrorBox } from '../components/ErrorBox'
import { ProductCard } from '../components/ProductCard'
import { Spinner } from '../components/Spinner'
import { useCatalogStore } from '../store/catalogStore'
import { CATEGORY_LABELS, type Category } from '../types/api'
import ui from '../styles/ui.module.css'
import styles from './CatalogPage.module.css'

const categories = Object.keys(CATEGORY_LABELS) as Category[]

export function CatalogPage() {
  const { category, search, request, setCategory, setSearch, load } = useCatalogStore()

  useEffect(() => {
    void load()
  }, [load])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void load()
  }

  return (
    <section>
      <h1 className={ui.title}>Каталог</h1>
      <form className={styles.search} onSubmit={submit} role="search">
        <input className={ui.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по названию" aria-label="Поиск" />
        <button className={ui.button}>Найти</button>
      </form>
      <div className={styles.chips}>
        <button className={category === null ? styles.chipActive : styles.chip} onClick={() => setCategory(null)}>Все</button>
        {categories.map((item) => (
          <button key={item} className={category === item ? styles.chipActive : styles.chip} onClick={() => setCategory(item)}>{CATEGORY_LABELS[item]}</button>
        ))}
      </div>
      {request.status === 'loading' && <Spinner label="Загружаем товары…" />}
      {request.status === 'error' && <ErrorBox message={request.error} onRetry={() => void load()} />}
      {request.status === 'success' && (request.data.items.length === 0 ? (
        <p className={ui.muted}>Ничего не найдено</p>
      ) : (
        <ul className={styles.grid}>
          {request.data.items.map((product) => <ProductCard key={product.id} product={product} />)}
        </ul>
      ))}
    </section>
  )
}
