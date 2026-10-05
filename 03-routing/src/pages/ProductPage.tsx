import { Link, useParams } from 'react-router-dom'
import { formatPrice, products } from '../data/products'
import styles from '../components/Layout.module.css'

type ProductParams = {
  id: string
}

export function ProductPage() {
  const { id } = useParams<ProductParams>()
  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <section>
        <h1 className={styles.title}>Товар #{id} не найден</h1>
        <Link to="/products" className={styles.back}>‹ К каталогу</Link>
      </section>
    )
  }

  return (
    <section className={styles.card}>
      <Link to="/products" className={styles.back}>‹ К каталогу</Link>
      <p className={styles.muted}>{product.category} · id {id}</p>
      <h1 className={styles.title}>{product.title}</h1>
      <p>{product.description}</p>
      <p className={styles.price}>{formatPrice(product.price)}</p>
    </section>
  )
}
