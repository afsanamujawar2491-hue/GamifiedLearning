import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { StudentLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import StaggerList, { StaggerItem } from '../components/StaggerList'
import { getLeaderboard } from '../api/student'
import { useAuth } from '../context/AuthContext'
import { Trophy, Medal } from 'lucide-react'

const rankColors = ['text-amber-500', 'text-slate-400', 'text-amber-700']
const medalBgs = ['bg-amber-50 border-amber-200', 'bg-slate-50 border-slate-200', 'bg-orange-50 border-orange-200']

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then((res) => setEntries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <StudentLayout>
      <AnimatedPage>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-accent-500" />
            {t('leaderboard.title')} 🏆
          </h1>
          <p className="text-slate-500 mt-1 font-medium">{t('leaderboard.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="card-playful overflow-hidden">
            <StaggerList>
              {entries.map((entry, index) => {
                const isMe = entry.id === user?.id
                const isTop3 = index < 3
                return (
                  <StaggerItem key={entry.id}>
                    <motion.div
                      animate={isMe && !reduceMotion ? { backgroundColor: ['rgba(239,246,255,0)', 'rgba(239,246,255,1)', 'rgba(239,246,255,0)'] } : undefined}
                      transition={{ duration: 2, repeat: isMe ? Infinity : 0 }}
                      className={`flex items-center gap-4 px-6 py-4 border-b-2 border-slate-100 last:border-0 ${
                        isMe ? 'bg-primary-50' : isTop3 ? medalBgs[index] : ''
                      }`}
                    >
                      <div className={`w-8 text-center font-extrabold text-lg ${rankColors[index] ?? 'text-slate-400'}`}>
                        {isTop3 ? (
                          <motion.div
                            animate={!reduceMotion ? { y: [0, -4, 0] } : undefined}
                            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <Medal className="w-7 h-7 mx-auto" />
                          </motion.div>
                        ) : (
                          `#${index + 1}`
                        )}
                      </div>
                      <div className="w-11 h-11 bg-primary-100 rounded-2xl flex items-center justify-center font-extrabold text-primary-700 text-lg">
                        {entry.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-slate-800">
                          {entry.name} {isMe && <span className="text-primary-600 text-sm">{t('common.you')}</span>}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold">{t('common.class')} {entry.grade} · {t('common.level')} {entry.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-accent-600">{entry.points} {t('common.pts')}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerList>
          </div>
        )}
      </AnimatedPage>
    </StudentLayout>
  )
}
