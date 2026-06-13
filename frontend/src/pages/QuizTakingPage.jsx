import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { StudentLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import ConfettiCelebration from '../components/ConfettiCelebration'
import { getQuiz, submitQuiz } from '../api/student'
import { useAuth } from '../context/AuthContext'
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, Star, ArrowLeft } from 'lucide-react'

const OPTIONS = ['A', 'B', 'C', 'D']

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QuizTakingPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  const answersRef = useRef(answers)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    getQuiz(id)
      .then((res) => setQuiz(res.data))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await submitQuiz(id, answersRef.current)
      setResults(res.data)
      updateUser({ points: res.data.totalPoints, level: res.data.level })
      setPhase('results')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }, [id, submitting])

  useEffect(() => {
    if (phase !== 'taking') return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, handleSubmit])

  const startQuiz = () => {
    setTimeLeft((quiz?.timeLimit ?? 10) * 60)
    setPhase('taking')
  }

  const selectAnswer = (option) => {
    const qId = quiz.questions[currentIndex].id
    setAnswers({ ...answers, [qId]: option })
  }

  const goNext = () => {
    setDirection(1)
    setCurrentIndex((i) => i + 1)
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  const currentQuestion = quiz?.questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz?.questions?.length ?? 0

  const slideVariants = {
    enter: (d) => ({ x: reduceMotion ? 0 : d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: reduceMotion ? 0 : d > 0 ? -60 : 60, opacity: 0 }),
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </StudentLayout>
    )
  }

  if (!quiz) return null

  if (phase === 'intro') {
    return (
      <StudentLayout>
        <AnimatedPage>
          <Link to="/quizzes" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> {t('quiz.backToQuizzes')}
          </Link>
          <motion.div
            initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto card-playful p-8 text-center"
          >
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{quiz.title}</h1>
            <p className="text-slate-500 mb-6 font-medium">
              {quiz.subject} · {t(`quizzes.difficulty.${quiz.difficulty}`, { defaultValue: quiz.difficulty })} · {totalQuestions} {t('common.questions')}
            </p>
            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-1.5 text-accent-600 font-bold">
                <Star className="w-4 h-4" /> {t('quiz.upToPts', { points: quiz.pointsReward })}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <Clock className="w-4 h-4" /> {quiz.timeLimit} {t('common.minutes')}
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
              {t('quiz.introHint')}
            </p>
            <motion.button
              onClick={startQuiz}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="w-full bg-gradient-to-r from-primary-600 to-kid-sky text-white py-3.5 rounded-2xl font-extrabold transition min-h-[48px]"
            >
              {t('quiz.startQuiz')} 🎯
            </motion.button>
          </motion.div>
        </AnimatedPage>
      </StudentLayout>
    )
  }

  if (phase === 'results' && results) {
    const passed = results.scorePercent >= 60
    return (
      <StudentLayout>
        <ConfettiCelebration trigger={passed} />
        <AnimatedPage>
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="card-playful p-8 text-center mb-6"
            >
              <motion.div
                animate={passed && !reduceMotion ? { scale: [1, 1.15, 1] } : undefined}
                transition={{ duration: 0.6 }}
                className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-amber-100'}`}
              >
                <Trophy className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-amber-600'}`} />
              </motion.div>
              <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
                {passed ? t('quiz.greatJob') : t('quiz.keepPracticing')}
              </h1>
              <p className="text-slate-500 mb-6 font-medium">
                {t('quiz.scored', { score: results.score, total: results.total, percent: results.scorePercent })}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-accent-50 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-2xl font-extrabold text-accent-600">+{results.pointsEarned}</p>
                  <p className="text-xs text-amber-700 font-bold">{t('quiz.pointsEarned')}</p>
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 border-2 border-primary-100">
                  <p className="text-2xl font-extrabold text-primary-600">{results.totalPoints}</p>
                  <p className="text-xs text-primary-700 font-bold">{t('quiz.totalPoints')}</p>
                </div>
              </div>
              {results.newBadges?.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-extrabold text-slate-700 mb-3">{t('quiz.newBadges')}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {results.newBadges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-3 py-2">
                        <span className="text-xl">{badge.icon}</span>
                        <span className="text-sm font-extrabold text-amber-800">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Link to="/quizzes" className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-50 transition text-center min-h-[44px] flex items-center justify-center">
                  {t('quiz.moreQuizzes')}
                </Link>
                <Link to="/dashboard" className="flex-1 bg-gradient-to-r from-primary-600 to-kid-sky text-white py-3 rounded-2xl font-bold hover:shadow-lg transition text-center min-h-[44px] flex items-center justify-center">
                  {t('nav.dashboard')}
                </Link>
              </div>
            </motion.div>

            <div className="card-playful p-6">
              <h2 className="font-extrabold text-slate-800 mb-4">{t('quiz.answerReview')}</h2>
              <div className="space-y-3">
                {results.review.map((item, i) => (
                  <div key={item.questionId} className={`flex items-start gap-3 p-3 rounded-xl border-2 ${item.correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    {item.correct
                      ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <div className="text-sm">
                      <p className="font-bold text-slate-700">Q{i + 1}: {quiz.questions.find((q) => q.id === item.questionId)?.text}</p>
                      {!item.correct && (
                        <p className="text-slate-500 mt-1 font-medium">
                          {t('quiz.yourAnswer')}: {item.yourAnswer || '—'} · {t('quiz.correct')}: {item.correctOption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedPage>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <AnimatedPage>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-slate-600">
              {t('quiz.questionOf', { current: currentIndex + 1, total: totalQuestions })}
            </span>
            <motion.span
              animate={timeLeft < 60 && !reduceMotion ? { scale: [1, 1.08, 1] } : undefined}
              transition={{ duration: 0.8, repeat: timeLeft < 60 ? Infinity : 0 }}
              className={`flex items-center gap-1.5 text-sm font-extrabold px-4 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </motion.span>
          </div>

          <div className="h-3 bg-slate-200 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-kid-sky rounded-full"
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="card-playful p-8 mb-6"
            >
              <h2 className="text-lg font-extrabold text-slate-800 mb-6 leading-relaxed">
                {currentQuestion.text}
              </h2>
              <div className="space-y-3">
                {OPTIONS.map((opt) => {
                  const optionText = currentQuestion[`option${opt}`]
                  const selected = answers[currentQuestion.id] === opt
                  return (
                    <motion.button
                      key={opt}
                      onClick={() => selectAnswer(opt)}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border-2 transition min-h-[56px] ${
                        selected
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${
                        selected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt}
                      </span>
                      <span className="text-slate-700 font-medium">{optionText}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2.5 text-slate-600 hover:text-primary-600 disabled:opacity-40 font-bold min-h-[44px]"
            >
              <ChevronLeft className="w-5 h-5" /> {t('quiz.previous')}
            </button>

            <span className="text-xs text-slate-400 font-semibold">
              {t('quiz.answered', { answered: answeredCount, total: totalQuestions })}
            </span>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-kid-sky text-white rounded-2xl font-extrabold hover:shadow-lg transition min-h-[44px]"
              >
                {t('quiz.next')} <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < totalQuestions}
                className="px-6 py-2.5 bg-green-600 text-white rounded-2xl font-extrabold hover:bg-green-700 disabled:opacity-50 transition min-h-[44px]"
              >
                {submitting ? t('quiz.submitting') : t('quiz.submitQuiz')}
              </button>
            )}
          </div>
        </div>
      </AnimatedPage>
    </StudentLayout>
  )
}
