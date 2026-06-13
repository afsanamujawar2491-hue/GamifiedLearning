import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '../../components/Layout'
import AnimatedPage from '../../components/AnimatedPage'
import { getStudents } from '../../api/admin'

export default function AdminStudents() {
  const { t } = useTranslation()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <AnimatedPage>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800">{t('admin.studentsTitle')}</h1>
          <p className="text-slate-500 mt-1 font-medium">{t('admin.studentsSubtitle')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="card-playful overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 border-b-2 border-primary-100">
                <tr>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.name')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.email')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.classCol')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.levelCol')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.pointsCol')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.quizzesCol')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-primary-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{student.email}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{t('common.class')} {student.grade}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{t('common.level')} {student.level}</td>
                    <td className="px-6 py-4 font-extrabold text-accent-600">{student.points}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{student.quizzesCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedPage>
    </AdminLayout>
  )
}
