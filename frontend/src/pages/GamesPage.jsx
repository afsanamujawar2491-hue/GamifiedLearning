import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { StudentLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import StaggerList, { StaggerItem } from '../components/StaggerList'
import { getGames } from '../api/student'
import { Gamepad2 } from 'lucide-react'

export default function GamesPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGames()
      .then((res) => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <StudentLayout>
      <AnimatedPage>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-green-600" />
            {t('games.title')} 🎮
          </h1>
          <p className="text-slate-500 mt-1 font-medium">{t('games.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <StaggerList className="grid md:grid-cols-2 gap-4">
            {games.map((game) => (
              <StaggerItem key={game.id}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  className="card-playful p-6 h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span
                      className="text-4xl animate-wiggle inline-block"
                      whileHover={reduceMotion ? undefined : { rotate: [0, -10, 10, 0] }}
                    >
                      {game.emoji}
                    </motion.span>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">{game.title}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{game.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-accent-600">+{game.pointsReward} {t('common.pts')}</span>
                    <Link
                      to={`/games/${game.slug}`}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white text-sm px-5 py-2.5 rounded-2xl font-extrabold transition min-h-[44px] flex items-center"
                    >
                      {t('game.playNow')}
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </AnimatedPage>
    </StudentLayout>
  )
}
