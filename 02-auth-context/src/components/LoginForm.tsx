import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'
import styles from './Layout.module.css'

export function LoginForm() {
  const { login } = useAuth()
  const [name, setName] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim()) login(name)
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <h2>Вход</h2>
      <p className={styles.muted}>Введите имя — данные сохранятся и переживут перезагрузку страницы.</p>
      <input className={styles.input} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ваше имя" aria-label="Имя" />
      <button className={styles.button} disabled={!name.trim()}>
        Войти
      </button>
    </form>
  )
}
