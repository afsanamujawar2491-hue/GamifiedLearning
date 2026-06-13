import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const PUZZLES = [
  { scrambled: 'KOOB', word: 'BOOK', options: ['BOOK', 'COOK', 'LOOK', 'HOOK'] },
  { scrambled: 'LOSHCO', word: 'SCHOOL', options: ['SCHOOL', 'CHLOOS', 'SCHOLA', 'COOLHS'] },
  { scrambled: 'CHERTAE', word: 'TEACHER', options: ['TEACHER', 'CHEATER', 'HECTARE', 'REACTED'] },
  { scrambled: 'DENTSTU', word: 'STUDENT', options: ['STUDENT', 'STUNTED', 'DENTIST', 'TUNED'] },
  { scrambled: 'RGAEN', word: 'ORANGE', options: ['ORANGE', 'GROAN', 'ANGER', 'RANGE'] },
  { scrambled: 'PLEAP', word: 'APPLE', options: ['APPLE', 'MAPLE', 'PLEAT', 'PEPAL'] },
  { scrambled: 'RETAW', word: 'WATER', options: ['WATER', 'EARTH', 'TREAT', 'HEART'] },
  { scrambled: 'YHAPP', word: 'HAPPY', options: ['HAPPY', 'HYPER', 'PHASE', 'SHARP'] },
]

export default function WordBuilderGame({ onComplete }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)

  const start = () => {
    setIndex(0)
    setCorrect(0)
    setPhase('playing')
  }

  const answer = (word) => {
    const puzzle = PUZZLES[index]
    const isCorrect = word === puzzle.word
    const newCorrect = isCorrect ? correct + 1 : correct

    if (index + 1 >= PUZZLES.length) {
      onComplete(newCorrect, PUZZLES.length)
    } else {
      setCorrect(newCorrect)
      setIndex(index + 1)
    }
  }

  if (phase === 'intro') {
    return (
      <div className="card-playful p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{t('games.wordBuilder')}</h2>
        <p className="text-slate-500 font-medium mb-6">{t('games.wordBuilderDesc')}</p>
        <button onClick={start} className="bg-gradient-to-r from-primary-600 to-kid-sky text-white px-8 py-3 rounded-2xl font-extrabold hover:shadow-lg transition">
          {t('game.startGame')}
        </button>
      </div>
    )
  }

  const puzzle = PUZZLES[index]
  const uniqueOptions = [...new Set(puzzle.options)]

  return (
    <div className="card-playful p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-extrabold text-slate-500">
          {t('game.round')} {index + 1} / {PUZZLES.length}
        </span>
        <span className="text-sm font-extrabold text-green-600">✓ {correct}</span>
      </div>

      <p className="text-slate-500 font-medium text-center mb-2">{t('game.unscramble')}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-4xl font-extrabold text-primary-600 text-center tracking-widest mb-8"
        >
          {puzzle.scrambled.split('').join(' ')}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {uniqueOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-extrabold py-3 rounded-2xl transition flex items-center justify-center gap-1"
          >
            {opt}
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  )
}
