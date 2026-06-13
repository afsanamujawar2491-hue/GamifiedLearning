import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { PublicLayout } from '../components/Layout'
import AnimatedPage from '../components/AnimatedPage'
import FloatingBackground from '../components/FloatingBackground'
import StaggerList, { StaggerItem } from '../components/StaggerList'
import { BookOpen, Gamepad2, Trophy, Star, Users, Wifi } from 'lucide-react'

export default function LandingPage() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  const features = [
    { icon: BookOpen, titleKey: 'landing.featureQuizzesTitle', descKey: 'landing.featureQuizzesDesc', color: 'bg-primary-100 text-primary-600' },
    { icon: Gamepad2, titleKey: 'landing.featureGamesTitle', descKey: 'landing.featureGamesDesc', color: 'bg-green-100 text-green-600' },
    { icon: Trophy, titleKey: 'landing.featureLeaderboardTitle', descKey: 'landing.featureLeaderboardDesc', color: 'bg-amber-100 text-amber-600' },
    { icon: Star, titleKey: 'landing.featureBadgesTitle', descKey: 'landing.featureBadgesDesc', color: 'bg-purple-100 text-purple-600' },
  ]

  const stats = [
    { icon: Users, value: '500+', labelKey: 'landing.statStudents' },
    { icon: BookOpen, value: '50+', labelKey: 'landing.statQuizzes' },
    { icon: Wifi, value: t('landing.statOfflineValue'), labelKey: 'landing.statOffline' },
  ]

  return (
    <PublicLayout>
      <AnimatedPage>
        <section className="relative bg-kid-gradient text-white overflow-hidden">
          <FloatingBackground />
          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-2xl">
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-accent-500/30 text-accent-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-accent-400/30"
              >
                {t('landing.badge')} 🌟
              </motion.span>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
              >
                {t('landing.heroTitle')}
              </motion.h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary-100 text-lg mb-8 leading-relaxed font-medium"
              >
                {t('landing.heroSubtitle')}
              </motion.p>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div whileTap={reduceMotion ? undefined : { scale: 0.95 }}>
                  <Link
                    to="/login?register=true"
                    className="bg-accent-500 hover:bg-accent-400 text-white px-7 py-3.5 rounded-2xl font-extrabold transition shadow-xl shadow-accent-500/30 min-h-[48px] flex items-center"
                  >
                    {t('landing.startFree')} 🚀
                  </Link>
                </motion.div>
                <motion.div whileTap={reduceMotion ? undefined : { scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="border-2 border-white/40 hover:bg-white/15 text-white px-7 py-3.5 rounded-2xl font-bold transition min-h-[48px] flex items-center"
                  >
                    {t('landing.teacherLogin')}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white/80 border-b-2 border-primary-50">
          <StaggerList className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
            {stats.map(({ icon: Icon, value, labelKey }) => (
              <StaggerItem key={labelKey}>
                <Icon className="w-9 h-9 text-kid-sky mx-auto mb-2" />
                <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                <p className="text-slate-500 text-sm font-semibold">{t(labelKey)}</p>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-4">{t('landing.whyTitle')}</h2>
            <p className="text-slate-500 text-center max-w-xl mx-auto mb-12 font-medium">
              {t('landing.whySubtitle')}
            </p>
            <StaggerList className="grid md:grid-cols-2 gap-6">
              {features.map(({ icon: Icon, titleKey, descKey, color }) => (
                <StaggerItem key={titleKey}>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.02, y: -4 }}
                    className="card-playful p-6 h-full"
                  >
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-800 mb-2">{t(titleKey)}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">{t(descKey)}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary-50 to-amber-50 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4">{t('landing.ctaTitle')}</h2>
            <p className="text-slate-600 mb-8 font-medium">{t('landing.ctaSubtitle')}</p>
            <motion.div whileTap={reduceMotion ? undefined : { scale: 0.95 }}>
              <Link
                to="/login?register=true"
                className="inline-block bg-gradient-to-r from-primary-600 to-kid-sky hover:shadow-lg text-white px-10 py-4 rounded-2xl font-extrabold transition min-h-[48px]"
              >
                {t('landing.createAccount')} ✨
              </Link>
            </motion.div>
          </div>
        </section>
      </AnimatedPage>
    </PublicLayout>
  )
}
