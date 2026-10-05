import styles from '../components/Layout.module.css'

export function AboutPage() {
  return (
    <section>
      <h1 className={styles.title}>О проекте</h1>
      <p className={styles.lead}>КТ 3 «Роутинг и навигация»: BrowserRouter, 7 маршрутов, /products/:id, PrivateRoute с возвратом на исходную страницу, NavLink и страница 404.</p>
    </section>
  )
}
