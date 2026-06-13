import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import FloatingBackground from '../components/FloatingBackground'
import AnimatedPage from '../components/AnimatedPage'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [searchParams] = useSearchParams()
  const isRegister = searchParams.get('register') === 'true'
  const [mode, setMode] = useState(isRegister ? 'register' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', grade: '6' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let user
      if (mode === 'login') {
        user = await login(form.email, form.password)
      } else {
        user = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          grade: parseInt(form.grade),
        })
      }
      navigate(user.role === 'TEACHER' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kid-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingBackground />
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher variant="dark" />
      </div>
      <AnimatedPage className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-extrabold text-2xl">
            <GraduationCap className="w-9 h-9" />
            {t('app.name')}
          </Link>
          <p className="text-primary-200 mt-2 text-sm font-medium">{t('app.tagline')}</p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary-100"
        >
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition min-h-[44px] ${mode === 'login' ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}
            >
              {t('auth.login')}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition min-h-[44px] ${mode === 'register' ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}
            >
              {t('auth.studentSignUp')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={reduceMotion ? false : { opacity: 0, x: mode === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: mode === 'login' ? 10 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-extrabold text-slate-800 mb-1">
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">
                {mode === 'login' ? t('auth.loginHint') : t('auth.registerHint')}
              </p>
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.fullName')}</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 font-medium"
                    placeholder={t('auth.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.gradeClass')}</label>
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    {[5, 6, 7, 8, 9, 10].map((g) => (
                      <option key={g} value={g}>{t('common.class')} {g}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="w-full bg-gradient-to-r from-primary-600 to-kid-sky hover:shadow-lg disabled:opacity-60 text-white py-3.5 rounded-2xl font-extrabold transition min-h-[48px]"
            >
              {loading ? t('common.pleaseWait') : mode === 'login' ? t('auth.login') : t('auth.createAccountBtn')}
            </motion.button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              {t('auth.demoHint')}<br />
              {t('auth.teacherDemoHint')}
            </p>
          )}
        </motion.div>
      </AnimatedPage>
    </div>
  )
}
