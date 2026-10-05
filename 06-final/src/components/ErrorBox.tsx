import ui from '../styles/ui.module.css'

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className={ui.error} role="alert">
      <strong>Не удалось загрузить</strong>
      <span>{message}</span>
      {onRetry && <button className={ui.ghost} onClick={onRetry}>Повторить</button>}
    </div>
  )
}
