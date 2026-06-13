import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { StudentLayout } from '../components/Layout'
import StatCard from '../components/StatCard'
import AnimatedPage from '../components/AnimatedPage'
import StaggerList, { StaggerItem } from '../components/StaggerList'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/student'
import { Star, Flame, BookOpen, Trophy, ChevronRight } from 'lucide-react'

export default function StudentDashboard() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </StudentLayout>
    )
  }

  const progress = data?.levelProgress ?? 0
  const firstName = user?.name?.split(' ')[0]

  const quickActions = [
    { to: '/quizzes', label: t('dashboard.takeQuiz'), desc: t('dashboard.takeQuizDesc'), color: 'bg-primary-50 text-primary-700 border-primary-100' },
    { to: '/games', label: t('dashboard.playGame'), desc: t('dashboard.playGameDesc'), color: 'bg-green-50 text-green-700 border-green-100' },
    { to: '/leaderboard', label: t('dashboard.viewLeaderboard'), desc: t('dashboard.viewLeaderboardDesc'), color: 'bg-amber-50 text-amber-700 border-amber-100' },
  ]

  return (
    <StudentLayout>
      <AnimatedPage>
        <div className="mb-8">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-slate-800"
          >
            {t('dashboard.greeting', { name: firstName })}{' '}
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </motion.h1>
          <p className="text-slate-500 mt-1 font-medium">{t('dashboard.subtitle')}</p>
        </div>

        <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem><StatCard icon={Star} label={t('dashboard.totalPoints')} value={data?.points ?? 0} color="accent" /></StaggerItem>
          <StaggerItem><StatCard icon={Flame} label={t('dashboard.dayStreak')} value={`${data?.streak ?? 0} ${t('common.days')}`} color="primary" /></StaggerItem>
          <StaggerItem><StatCard icon={BookOpen} label={t('dashboard.quizzesDone')} value={data?.quizzesCompleted ?? 0} color="success" /></StaggerItem>
          <StaggerItem><StatCard icon={Trophy} label={t('dashboard.yourRank')} value={`#${data?.rank ?? '-'}`} color="purple" /></StaggerItem>
        </StaggerList>

        <div className="card-playful p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-800">{t('dashboard.levelProgress', { level: data?.level ?? 1 })}</h2>
            <span className="text-sm text-slate-500 font-bold">{t('dashboard.percentToNext', { percent: progress })}</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full progress-shimmer rounded-full"
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {t('dashboard.pointsNeeded', { points: data?.pointsToNextLevel ?? 100, level: (data?.level ?? 1) + 1 })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-playful p-6">
            <h2 className="font-extrabold text-slate-800 mb-4">{t('dashboard.quickActions')}</h2>
            <div className="space-y-3">
              {quickActions.map(({ to, label, desc, color }) => (
                <motion.div key={to} whileHover={reduceMotion ? undefined : { x: 4 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Link
                    to={to}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 ${color} hover:shadow-md transition min-h-[56px]`}
                  >
                    <div>
                      <p className="font-extrabold">{label}</p>
                      <p className="text-sm opacity-70 font-medium">{desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-60" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card-playful p-6">
            <h2 className="font-extrabold text-slate-800 mb-4">{t('dashboard.recentBadges')}</h2>
            {data?.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {data.badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                    className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-3 py-2"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-extrabold text-amber-800">{badge.name}</p>
                      <p className="text-xs text-amber-600 font-medium">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium">{t('dashboard.noBadges')}</p>
            )}
          </div>
        </div>
      </AnimatedPage>
    </StudentLayout>
  )
}
