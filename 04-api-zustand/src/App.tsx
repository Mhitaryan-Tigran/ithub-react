import { Catalog } from './components/Catalog'
import styles from './components/Catalog.module.css'

export default function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Каталог из FastAPI</h1>
      <p className={styles.lead}>Axios-клиент, состояние запроса как дискриминированный union и Zustand-хранилище с загрузкой внутри.</p>
      <Catalog />
    </main>
  )
}
