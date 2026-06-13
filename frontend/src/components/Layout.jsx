import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'
import { GraduationCap, LogOut, LayoutDashboard, Trophy, BookOpen, Gamepad2 } from 'lucide-react'

export function PublicLayout({ children }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-primary-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-extrabold text-xl">
            <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
              <GraduationCap className="w-8 h-8 text-kid-sky" />
            </motion.div>
            <span>{t('app.name')}</span>
          </Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-semibold hidden sm:block">
              {t('nav.login')}
            </Link>
            <Link
              to="/login?register=true"
              className="bg-gradient-to-r from-primary-500 to-kid-sky text-white px-5 py-2.5 rounded-2xl hover:shadow-lg hover:shadow-primary-200 font-bold transition min-h-[44px] flex items-center"
            >
              {t('nav.getStarted')} ✨
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-primary-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm font-medium">
          {t('app.footer')}
        </div>
      </footer>
    </div>
  )
}

export function StudentLayout({ children }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/quizzes', icon: BookOpen, label: t('nav.quizzes') },
    { to: '/games', icon: Gamepad2, label: t('nav.games') },
    { to: '/leaderboard', icon: Trophy, label: t('nav.leaderboard') },
  ]

  return (
    <div className="min-h-screen">
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-primary-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-700 font-extrabold">
            <GraduationCap className="w-7 h-7 text-kid-sky" />
            <span>{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-slate-600 hover:bg-primary-50 hover:text-primary-700 text-sm font-bold transition min-h-[44px]"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-accent-600 font-bold">{user?.points ?? 0} {t('common.pts')} · {t('common.level')} {user?.level ?? 1}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={t('nav.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

export function AdminLayout({ children }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/admin', label: t('nav.overview') },
    { to: '/admin/students', label: t('nav.students') },
    { to: '/admin/quizzes', label: t('nav.quizzes') },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="w-7 h-7 text-accent-400" />
            <span>{t('nav.teacherHub')}</span>
          </div>
          <p className="text-slate-400 text-sm mt-1">{user?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white font-semibold transition"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-3">
          <LanguageSwitcher variant="dark" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-white transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
