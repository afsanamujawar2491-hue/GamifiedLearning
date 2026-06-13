import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingBackground({ className = '' }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-kid-sun/20 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-kid-mint/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-kid-coral/15 blur-3xl" />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-kid-sun/25 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-kid-mint/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-kid-coral/20 blur-3xl"
        animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
