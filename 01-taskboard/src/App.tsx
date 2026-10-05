import { useState } from 'react'
import type { Task } from './types/task'
import { TaskBoard } from './components/TaskBoard'
import styles from './App.module.css'

const initialTasks: Task[] = [
  { id: 1, title: 'Настроить проект на Vite и TypeScript', isCompleted: true },
  { id: 2, title: 'Описать интерфейс Task', isCompleted: true },
  { id: 3, title: 'Вынести TaskItem в отдельный компонент', isCompleted: false },
  { id: 4, title: 'Отрисовать список через map с key = id', isCompleted: false },
  { id: 5, title: 'Обработать пустой список', isCompleted: false },
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const toggle = (id: number) => setTasks((list) => list.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)))

  return (
    <main className={styles.page}>
      <h1>TaskBoard</h1>
      <p className={styles.lead}>Условный рендеринг и рендеринг списков на TypeScript</p>
      <div className={styles.grid}>
        <TaskBoard title="Учёба" tasks={tasks} onToggle={toggle} />
        <TaskBoard title="Выходные" tasks={[]} onToggle={toggle} />
      </div>
    </main>
  )
}
