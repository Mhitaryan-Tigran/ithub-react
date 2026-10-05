import { useState, type FormEvent } from 'react'
import { AxiosError } from 'axios'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import styles from '../components/Session.module.css'

interface Errors {
  email?: string
  password?: string
  form?: string
}

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Введите корректный email'
  if (password.length < 8) errors.password = 'Пароль — не меньше 8 символов'
  return errors
}

export function LoginPage() {
  const { status, login } = useAuthStore()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/account'
  const [email, setEmail] = useState('student@ithub.ru')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)

  if (status === 'authenticated') return <Navigate to={from} replace />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(email, password)
    setErrors(found)
    if (Object.keys(found).length) return
    setPending(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (error) {
      const status = error instanceof AxiosError ? error.response?.status : undefined
      setErrors({ form: status === 401 ? 'Неверный email или пароль' : 'Сервер недоступен' })
    } finally {
      setPending(false)
    }
  }

  return (
    <main className={styles.center}>
      <form className={styles.card} onSubmit={submit} noValidate>
        <h1>Вход</h1>
        <p className={styles.muted}>Тестовый аккаунт: student@ithub.ru / Password123</p>
        <label className={styles.field}>
          Email
          <input className={styles.input} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} autoComplete="username" />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>
        <label className={styles.field}>
          Пароль
          <input className={styles.input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} autoComplete="current-password" />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </label>
        {errors.form && <p className={styles.formError} role="alert">{errors.form}</p>}
        <button className={styles.button} disabled={pending}>{pending ? 'Входим…' : 'Войти'}</button>
      </form>
    </main>
  )
}
