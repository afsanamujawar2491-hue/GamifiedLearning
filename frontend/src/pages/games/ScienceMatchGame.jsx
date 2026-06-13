import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const PAIRS = [
  { term: 'Photosynthesis', definition: 'Process plants use to make food from sunlight', options: ['Process plants use to make food from sunlight', 'How animals breathe', 'Water cycle process', 'Rock formation'] },
  { term: 'Gravity', definition: 'Force that pulls objects toward each other', options: ['Force that pulls objects toward each other', 'Speed of light', 'Magnetic field', 'Electric current'] },
  { term: 'Atom', definition: 'Smallest unit of matter', options: ['Smallest unit of matter', 'Largest planet', 'Type of cell', 'Unit of energy'] },
  { term: 'Evaporation', definition: 'Liquid turning into gas', options: ['Liquid turning into gas', 'Gas turning into liquid', 'Solid turning into liquid', 'Freezing process'] },
  { term: 'Magnet', definition: 'Object that attracts iron and steel', options: ['Object that attracts iron and steel', 'Source of light', 'Type of rock', 'Measuring instrument'] },
  { term: 'Ecosystem', definition: 'Community of living things and their environment', options: ['Community of living things and their environment', 'Single organism', 'Weather pattern', 'Mountain range'] },
  { term: 'Digestion', definition: 'Breaking down food in the body', options: ['Breaking down food in the body', 'Breathing process', 'Blood circulation', 'Muscle movement'] },
  { term: 'Solar System', definition: 'Sun and all objects orbiting it', options: ['Sun and all objects orbiting it', 'Group of stars', 'Earth only', 'Moon and stars'] },
]

export default function ScienceMatchGame({ onComplete }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)

  const start = () => {
    setIndex(0)
    setCorrect(0)
    setPhase('playing')
  }

  const pair = PAIRS[index]
  const shuffled = useMemo(
    () => [...PAIRS[index].options].sort(() => Math.random() - 0.5),
    [index]
  )

  const answer = (def) => {
    const pair = PAIRS[index]
    const isCorrect = def === pair.definition
    const newCorrect = isCorrect ? correct + 1 : correct

    if (index + 1 >= PAIRS.length) {
      onComplete(newCorrect, PAIRS.length)
    } else {
      setCorrect(newCorrect)
      setIndex(index + 1)
    }
  }

  if (phase === 'intro') {
    return (
      <div className="card-playful p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🔬</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{t('games.scienceMatch')}</h2>
        <p className="text-slate-500 font-medium mb-6">{t('games.scienceMatchDesc')}</p>
        <button onClick={start} className="bg-gradient-to-r from-primary-600 to-kid-sky text-white px-8 py-3 rounded-2xl font-extrabold hover:shadow-lg transition">
          {t('game.startGame')}
        </button>
      </div>
    )
  }

  return (
    <div className="card-playful p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-extrabold text-slate-500">
          {t('game.round')} {index + 1} / {PAIRS.length}
        </span>
        <span className="text-sm font-extrabold text-green-600">✓ {correct}</span>
      </div>

      <p className="text-slate-500 font-medium text-center mb-2">{t('game.matchDefinition')}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 rounded-2xl p-4 mb-6 text-center"
        >
          <span className="text-2xl font-extrabold text-primary-700">{pair.term}</span>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-3">
        {shuffled.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            className="w-full bg-slate-50 hover:bg-primary-50 text-slate-700 font-bold py-3 px-4 rounded-2xl transition text-left text-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
