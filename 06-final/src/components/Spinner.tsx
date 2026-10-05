import ui from '../styles/ui.module.css'

export function Spinner({ label }: { label: string }) {
  return (
    <div className={ui.state} role="status">
      <span className={ui.spinner} />
      {label}
    </div>
  )
}
