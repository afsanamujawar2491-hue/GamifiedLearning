import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

function generateProblem() {
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b, answer

  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1
    b = Math.floor(Math.random() * 50) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 40) + 20
    b = Math.floor(Math.random() * a)
    answer = a - b
  } else {
    a = Math.floor(Math.random() * 12) + 1
    b = Math.floor(Math.random() * 12) + 1
    answer = a * b
  }

  const wrong = new Set()
  while (wrong.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5
    const w = answer + offset
    if (w !== answer && w >= 0) wrong.add(w)
  }

  const options = [answer, ...Array.from(wrong)]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }

  return { text: `${a} ${op} ${b} = ?`, answer, options }
}

export default function MathSprintGame({ onComplete }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState('intro')
  const [timeLeft, setTimeLeft] = useState(60)
  const [problem, setProblem] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const correctRef = useRef(0)
  const totalRef = useRef(0)

  useEffect(() => { correctRef.current = correct }, [correct])
  useEffect(() => { totalRef.current = total }, [total])

  const finish = useCallback(() => {
    onComplete(correctRef.current, Math.max(totalRef.current, 1))
  }, [onComplete])

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, finish])

  const start = () => {
    setCorrect(0)
    setTotal(0)
    setTimeLeft(60)
    setProblem(generateProblem())
    setPhase('playing')
  }

  const answer = (value) => {
    setTotal((t) => t + 1)
    if (value === problem.answer) setCorrect((c) => c + 1)
    setProblem(generateProblem())
  }

  if (phase === 'intro') {
    return (
      <div className="card-playful p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🔢</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{t('games.mathSprint')}</h2>
        <p className="text-slate-500 font-medium mb-6">{t('games.mathSprintDesc')}</p>
        <button onClick={start} className="bg-gradient-to-r from-primary-600 to-kid-sky text-white px-8 py-3 rounded-2xl font-extrabold hover:shadow-lg transition">
          {t('game.startGame')}
        </button>
      </div>
    )
  }

  return (
    <div className="card-playful p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-red-600 font-extrabold">
          <Clock className="w-5 h-5" />
          {timeLeft}s
        </div>
        <div className="text-sm font-extrabold text-green-600">
          ✓ {correct} / {total}
        </div>
      </div>

      <motion.div
        key={problem?.text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-slate-800 text-center mb-8"
      >
        {problem?.text}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {problem?.options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-extrabold text-xl py-4 rounded-2xl transition"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
