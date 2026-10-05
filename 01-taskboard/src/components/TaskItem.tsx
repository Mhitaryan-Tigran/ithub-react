import type { Task } from '../types/task'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input type="checkbox" checked={task.isCompleted} onChange={() => onToggle(task.id)} className={styles.check} />
        <span className={task.isCompleted ? styles.done : styles.title}>{task.title}</span>
      </label>
      {task.isCompleted && <span className={styles.badge}>Готово</span>}
    </li>
  )
}
