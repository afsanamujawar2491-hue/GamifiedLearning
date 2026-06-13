import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import QuizzesPage from './pages/QuizzesPage'
import QuizTakingPage from './pages/QuizTakingPage'
import GamesPage from './pages/GamesPage'
import GamePlayingPage from './pages/GamePlayingPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminQuizzes from './pages/admin/AdminQuizzes'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute role="STUDENT"><QuizzesPage /></ProtectedRoute>} />
        <Route path="/quizzes/:id" element={<ProtectedRoute role="STUDENT"><QuizTakingPage /></ProtectedRoute>} />
        <Route path="/games" element={<ProtectedRoute role="STUDENT"><GamesPage /></ProtectedRoute>} />
        <Route path="/games/:slug" element={<ProtectedRoute role="STUDENT"><GamePlayingPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute role="STUDENT"><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="TEACHER"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="TEACHER"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/quizzes" element={<ProtectedRoute role="TEACHER"><AdminQuizzes /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
