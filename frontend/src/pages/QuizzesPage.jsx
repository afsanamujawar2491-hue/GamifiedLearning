import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { StudentLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import StaggerList, { StaggerItem } from '../components/StaggerList'
import { getQuizzes } from '../api/student'
import { BookOpen, Clock, Star } from 'lucide-react'

const difficultyColors = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
}

export default function QuizzesPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuizzes()
      .then((res) => setQuizzes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <StudentLayout>
      <AnimatedPage>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">{t('quizzes.title')} 📚</h1>
          <p className="text-slate-500 mt-1 font-medium">{t('quizzes.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <StaggerList className="grid md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <StaggerItem key={quiz.id}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  className="card-playful p-6 h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${difficultyColors[quiz.difficulty]}`}
                    >
                      {t(`quizzes.difficulty.${quiz.difficulty}`, { defaultValue: quiz.difficulty })}
                    </motion.span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 mb-1 text-lg">{quiz.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{quiz.subject} · {quiz.questionCount} {t('common.questions')}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent-500" />
                        +{quiz.pointsReward} {t('common.pts')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.timeLimit} {t('common.min')}
                      </span>
                    </div>
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="bg-gradient-to-r from-primary-600 to-kid-sky hover:shadow-lg text-white text-sm px-5 py-2.5 rounded-2xl font-extrabold transition min-h-[44px] flex items-center"
                    >
                      {t('quizzes.startQuiz')}
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
