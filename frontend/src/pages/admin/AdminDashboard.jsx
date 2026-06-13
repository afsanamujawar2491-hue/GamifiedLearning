import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '../../components/Layout'
import StatCard from '../../components/StatCard'
import AnimatedPage from '../../components/AnimatedPage'
import StaggerList, { StaggerItem } from '../../components/StaggerList'
import { getDashboard } from '../../api/admin'
import { Users, BookOpen, Trophy, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AnimatedPage>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800">{t('admin.dashboardTitle')}</h1>
          <p className="text-slate-500 mt-1 font-medium">{t('admin.dashboardSubtitle')}</p>
        </div>

        <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem><StatCard icon={Users} label={t('admin.totalStudents')} value={data?.totalStudents ?? 0} color="primary" /></StaggerItem>
          <StaggerItem><StatCard icon={BookOpen} label={t('admin.activeQuizzes')} value={data?.activeQuizzes ?? 0} color="success" /></StaggerItem>
          <StaggerItem><StatCard icon={Trophy} label={t('admin.quizzesCompleted')} value={data?.quizzesCompleted ?? 0} color="accent" /></StaggerItem>
          <StaggerItem><StatCard icon={TrendingUp} label={t('admin.avgScore')} value={`${data?.averageScore ?? 0}%`} color="purple" /></StaggerItem>
        </StaggerList>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-playful p-6">
            <h2 className="font-extrabold text-slate-800 mb-4">{t('admin.topPerformers')}</h2>
            {data?.topStudents?.length > 0 ? (
              <div className="space-y-3">
                {data.topStudents.map((student, i) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-extrabold text-slate-400">#{i + 1}</span>
                    <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-sm font-extrabold text-primary-700">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{t('common.class')} {student.grade}</p>
                    </div>
                    <span className="text-sm font-extrabold text-accent-600">{student.points} {t('common.pts')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium">{t('admin.noStudents')}</p>
            )}
          </div>

          <div className="card-playful p-6">
            <h2 className="font-extrabold text-slate-800 mb-4">{t('admin.recentActivity')}</h2>
            {data?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-700 font-medium">{activity.message}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium">{t('admin.noActivity')}</p>
            )}
          </div>
        </div>
      </AnimatedPage>
    </AdminLayout>
  )
}
