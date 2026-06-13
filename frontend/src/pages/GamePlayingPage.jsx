import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StudentLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import GameResults from '../components/GameResults'
import { getGame, submitGame } from '../api/student'
import { useAuth } from '../context/AuthContext'
import MathSprintGame from './games/MathSprintGame'
import WordBuilderGame from './games/WordBuilderGame'
import ScienceMatchGame from './games/ScienceMatchGame'
import MapExplorerGame from './games/MapExplorerGame'
import { ArrowLeft } from 'lucide-react'

const GAME_COMPONENTS = {
  'math-sprint': MathSprintGame,
  'word-builder': WordBuilderGame,
  'science-match': ScienceMatchGame,
  'map-explorer': MapExplorerGame,
}

export default function GamePlayingPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('playing')
  const [results, setResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    getGame(slug)
      .then((res) => setGame(res.data))
      .catch(() => navigate('/games'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  const handleComplete = useCallback(async (score, total) => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await submitGame(slug, score, total)
      setResults(res.data)
      updateUser({ points: res.data.totalPoints, level: res.data.level })
      setPhase('results')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }, [slug, submitting, updateUser])

  const handlePlayAgain = () => {
    setPhase('playing')
    setResults(null)
    setGameKey((k) => k + 1)
  }

  const GameComponent = GAME_COMPONENTS[slug]

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center h-40 items-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </StudentLayout>
    )
  }

  if (!GameComponent) {
    navigate('/games')
    return null
  }

  return (
    <StudentLayout>
      <AnimatedPage>
        <Link to="/games" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          {t('game.backToGames')}
        </Link>

        {phase === 'results' && results ? (
          <GameResults
            results={results}
            gameTitle={game?.title}
            onPlayAgain={handlePlayAgain}
          />
        ) : (
          <div key={gameKey}>
            <GameComponent onComplete={handleComplete} />
          </div>
        )}
      </AnimatedPage>
    </StudentLayout>
  )
}
