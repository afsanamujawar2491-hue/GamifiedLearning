import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role === 'TEACHER' && user.role !== 'TEACHER') return <Navigate to="/dashboard" replace />
  if (role === 'STUDENT' && user.role !== 'STUDENT') return <Navigate to="/admin" replace />

  return children
}
