import { CATEGORY_LABELS, type Product } from '../types/product'
import styles from './Catalog.module.css'

export function ProductCard({ product }: { product: Product }) {
  return (
    <li className={styles.card}>
      <span className={styles.muted}>{CATEGORY_LABELS[product.category]}</span>
      <strong className={styles.name}>{product.title}</strong>
      <span className={styles.desc}>{product.description}</span>
      <div className={styles.row}>
        <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
        <span className={product.in_stock ? styles.ok : styles.out}>{product.in_stock ? 'В наличии' : 'Нет в наличии'}</span>
      </div>
      <span className={styles.muted}>★ {product.rating.toFixed(1)}</span>
    </li>
  )
}
