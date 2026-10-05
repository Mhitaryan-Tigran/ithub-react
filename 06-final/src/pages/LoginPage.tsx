import { useState, type FormEvent } from 'react'
import { AxiosError } from 'axios'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import ui from '../styles/ui.module.css'

interface Errors {
  email?: string
  password?: string
  form?: string
}

export function LoginPage() {
  const { status, login } = useAuthStore()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/orders'
  const [email, setEmail] = useState('student@ithub.ru')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)

  if (status === 'authenticated') return <Navigate to={from} replace />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found: Errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = 'Введите корректный email'
    if (password.length < 8) found.password = 'Пароль — не меньше 8 символов'
    setErrors(found)
    if (found.email || found.password) return
    setPending(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({ form: error instanceof AxiosError && error.response?.status === 401 ? 'Неверный email или пароль' : 'Сервер недоступен' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={`${ui.card} ${ui.narrow}`} onSubmit={submit} noValidate>
      <h1 className={ui.title}>Вход</h1>
      <p className={ui.muted}>Тестовый аккаунт: student@ithub.ru / Password123</p>
      <label className={ui.field}>
        Email
        <input className={ui.input} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} autoComplete="username" />
        {errors.email && <span className={ui.errorText}>{errors.email}</span>}
      </label>
      <label className={ui.field}>
        Пароль
        <input className={ui.input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} autoComplete="current-password" />
        {errors.password && <span className={ui.errorText}>{errors.password}</span>}
      </label>
      {errors.form && <p className={ui.errorText} role="alert">{errors.form}</p>}
      <button className={ui.button} disabled={pending}>{pending ? 'Входим…' : 'Войти'}</button>
    </form>
  )
}
