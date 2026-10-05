import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import styles from '../components/Layout.module.css'

interface LocationState {
  from?: Location
}

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/profile'
  const [name, setName] = useState('')

  if (user) return <Navigate to={from} replace />

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    login(name)
    navigate(from, { replace: true })
  }

  return (
    <form onSubmit={submit} className={`${styles.card} ${styles.form}`}>
      <h1 className={styles.title}>Вход</h1>
      {from !== '/profile' || location.state ? <p className={styles.muted}>После входа вернём вас на {from}</p> : null}
      <input className={styles.input} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ваше имя" aria-label="Имя" />
      <button className={styles.button} disabled={!name.trim()}>Войти</button>
    </form>
  )
}
