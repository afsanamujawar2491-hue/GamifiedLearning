import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  { text: 'What is the capital of Rajasthan?', answer: 'Jaipur', options: ['Jaipur', 'Udaipur', 'Jodhpur', 'Bikaner'] },
  { text: 'Which state is known as the "Land of Five Rivers"?', answer: 'Punjab', options: ['Punjab', 'Haryana', 'Gujarat', 'Kerala'] },
  { text: 'Which is the southernmost state of India?', answer: 'Tamil Nadu', options: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh'] },
  { text: 'The Taj Mahal is located in which state?', answer: 'Uttar Pradesh', options: ['Uttar Pradesh', 'Rajasthan', 'Delhi', 'Madhya Pradesh'] },
  { text: 'Which state has the longest coastline in India?', answer: 'Gujarat', options: ['Gujarat', 'Maharashtra', 'Kerala', 'Tamil Nadu'] },
  { text: 'Which city is known as the "Silicon Valley of India"?', answer: 'Bengaluru', options: ['Bengaluru', 'Hyderabad', 'Pune', 'Chennai'] },
  { text: 'Which river flows through Varanasi?', answer: 'Ganga', options: ['Ganga', 'Yamuna', 'Godavari', 'Narmada'] },
  { text: 'Which state is famous for tea plantations?', answer: 'Assam', options: ['Assam', 'Kerala', 'Punjab', 'Goa'] },
]

export default function MapExplorerGame({ onComplete }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)

  const start = () => {
    setIndex(0)
    setCorrect(0)
    setPhase('playing')
  }

  const answer = (opt) => {
    const q = QUESTIONS[index]
    const isCorrect = opt === q.answer
    const newCorrect = isCorrect ? correct + 1 : correct

    if (index + 1 >= QUESTIONS.length) {
      onComplete(newCorrect, QUESTIONS.length)
    } else {
      setCorrect(newCorrect)
      setIndex(index + 1)
    }
  }

  if (phase === 'intro') {
    return (
      <div className="card-playful p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{t('games.mapExplorer')}</h2>
        <p className="text-slate-500 font-medium mb-6">{t('games.mapExplorerDesc')}</p>
        <button onClick={start} className="bg-gradient-to-r from-primary-600 to-kid-sky text-white px-8 py-3 rounded-2xl font-extrabold hover:shadow-lg transition">
          {t('game.startGame')}
        </button>
      </div>
    )
  }

  const q = QUESTIONS[index]

  return (
    <div className="card-playful p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-extrabold text-slate-500">
          {t('game.round')} {index + 1} / {QUESTIONS.length}
        </span>
        <span className="text-sm font-extrabold text-green-600">✓ {correct}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-extrabold text-slate-800 text-center mb-8"
        >
          {q.text}
        </motion.p>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-extrabold py-3 rounded-2xl transition"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
