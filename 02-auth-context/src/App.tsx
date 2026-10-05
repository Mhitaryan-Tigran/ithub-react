import { AuthProvider } from './auth/AuthContext'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import styles from './components/Layout.module.css'

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main className={styles.page}>
        <Dashboard />
      </main>
    </AuthProvider>
  )
}
