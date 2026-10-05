import { Link } from 'react-router-dom'
import { formatPrice, products } from '../data/products'
import styles from '../components/Layout.module.css'

export function ProductsPage() {
  return (
    <section>
      <h1 className={styles.title}>Каталог</h1>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`} className={styles.tile}>
              <span className={styles.muted}>{product.category}</span>
              <strong>{product.title}</strong>
              <span>{formatPrice(product.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
