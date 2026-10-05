import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'
import styles from './TaskBoard.module.css'

interface TaskBoardProps {
  title: string
  tasks: Task[]
  onToggle: (id: number) => void
}

export function TaskBoard({ title, tasks, onToggle }: TaskBoardProps) {
  const done = tasks.filter((task) => task.isCompleted).length

  return (
    <section className={styles.board}>
      <header className={styles.header}>
        <h2>{title}</h2>
        <span className={styles.counter}>{tasks.length === 0 ? 'пусто' : `${done} из ${tasks.length}`}</span>
      </header>
      {tasks.length === 0 ? (
        <p className={styles.empty}>Задач нет</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </section>
  )
}
