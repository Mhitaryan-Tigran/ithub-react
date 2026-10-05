import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { CATEGORY_LABELS, formatPrice, type Product } from '../types/api'
import styles from './ProductCard.module.css'

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add)
  return (
    <li className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.body}>
        <span className={styles.category}>{CATEGORY_LABELS[product.category]}</span>
        <strong className={styles.title}>{product.title}</strong>
        <span className={styles.description}>{product.description}</span>
      </Link>
      <div className={styles.footer}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <button className={styles.add} disabled={!product.in_stock} onClick={() => add(product)}>
          {product.in_stock ? 'В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </li>
  )
}
