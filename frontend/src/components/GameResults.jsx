import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ConfettiCelebration from './ConfettiCelebration'
import { Trophy, Star, ArrowLeft } from 'lucide-react'

export default function GameResults({ results, gameTitle, onPlayAgain }) {
  const { t } = useTranslation()
  const passed = results.scorePercent >= 60

  return (
    <div className="text-center">
      {passed && <ConfettiCelebration />}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-playful p-8 max-w-lg mx-auto"
      >
        <div className="text-5xl mb-4">{passed ? '🏆' : '💪'}</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
          {passed ? t('game.greatJob') : t('game.keepPracticing')}
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          {t('game.scored', { score: results.score, total: results.total, percent: results.scorePercent })}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-accent-50 rounded-2xl p-4">
            <Star className="w-6 h-6 text-accent-500 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-semibold">{t('quiz.pointsEarned')}</p>
            <p className="text-xl font-extrabold text-accent-600">+{results.pointsEarned}</p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-4">
            <Trophy className="w-6 h-6 text-primary-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-semibold">{t('quiz.totalPoints')}</p>
            <p className="text-xl font-extrabold text-primary-600">{results.totalPoints}</p>
          </div>
        </div>

        {results.newBadges?.length > 0 && (
          <div className="mb-6">
            <p className="font-extrabold text-slate-700 mb-2">{t('quiz.newBadges')}</p>
            <div className="flex justify-center gap-3">
              {results.newBadges.map((badge) => (
                <div key={badge.id} className="bg-amber-50 rounded-2xl px-4 py-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-bold text-amber-700">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-primary-600 to-kid-sky text-white px-6 py-3 rounded-2xl font-extrabold transition hover:shadow-lg"
          >
            {t('game.playAgain')}
          </button>
          <Link
            to="/games"
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-extrabold transition hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('game.moreGames')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
