import { motion, useReducedMotion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const reduceMotion = useReducedMotion()
  const colors = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  const Wrapper = reduceMotion ? 'div' : motion.div
  const motionProps = reduceMotion
    ? {}
    : {
        whileHover: { scale: 1.03, y: -4 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }

  return (
    <Wrapper
      className={`rounded-3xl border-2 p-5 shadow-md ${colors[color]}`}
      {...motionProps}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-9 h-9 opacity-90" />}
        <div>
          <p className="text-sm font-bold opacity-80">{label}</p>
          <p className="text-2xl font-extrabold">{value}</p>
        </div>
      </div>
    </Wrapper>
  )
}
