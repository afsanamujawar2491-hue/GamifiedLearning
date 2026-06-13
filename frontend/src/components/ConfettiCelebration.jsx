import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useReducedMotion } from 'framer-motion'

export default function ConfettiCelebration({ trigger }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!trigger || reduceMotion) return

    const duration = 2500
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#38bdf8', '#fbbf24', '#fb7185', '#6ee7b7', '#a78bfa'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#38bdf8', '#fbbf24', '#fb7185', '#6ee7b7', '#a78bfa'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    frame()
  }, [trigger, reduceMotion])

  return null
}
