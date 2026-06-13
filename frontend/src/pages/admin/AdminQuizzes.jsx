import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '../../components/Layout'
import AnimatedPage from '../../components/AnimatedPage'
import { getQuizzes, createQuiz, updateQuiz, toggleQuiz, deleteQuiz, getQuiz } from '../../api/admin'
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react'

const difficultyColors = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
}

const emptyQuestion = () => ({
  text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A',
})

const emptyForm = () => ({
  title: '',
  subject: '',
  difficulty: 'EASY',
  pointsReward: 50,
  timeLimit: 10,
  questions: [emptyQuestion()],
})

export default function AdminQuizzes() {
  const { t } = useTranslation()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadQuizzes = () => {
    getQuizzes()
      .then((res) => setQuizzes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadQuizzes() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setError('')
    setShowForm(true)
  }

  const openEdit = async (quiz) => {
    setError('')
    try {
      const res = await getQuiz(quiz.id)
      const data = res.data
      setForm({
        title: data.title,
        subject: data.subject || '',
        difficulty: data.difficulty,
        pointsReward: data.pointsReward,
        timeLimit: data.timeLimit,
        questions: data.questions.map((q) => ({
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
        })),
      })
      setEditingId(quiz.id)
      setShowForm(true)
    } catch {
      setError(t('common.errorGeneric'))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await updateQuiz(editingId, form)
      } else {
        await createQuiz(form)
      }
      setShowForm(false)
      loadQuizzes()
    } catch (err) {
      setError(err.response?.data?.message || t('common.errorGeneric'))
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      await toggleQuiz(id)
      loadQuizzes()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return
    try {
      await deleteQuiz(id)
      loadQuizzes()
    } catch (err) {
      console.error(err)
    }
  }

  const updateQuestion = (index, field, value) => {
    setForm((prev) => {
      const questions = [...prev.questions]
      questions[index] = { ...questions[index], [field]: value }
      return { ...prev, questions }
    })
  }

  const addQuestion = () => {
    setForm((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }))
  }

  const removeQuestion = (index) => {
    if (form.questions.length <= 1) return
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  return (
    <AdminLayout>
      <AnimatedPage>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">{t('admin.quizzesTitle')}</h1>
            <p className="text-slate-500 mt-1 font-medium">{t('admin.quizzesSubtitle')}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-2xl font-bold transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            {t('admin.createQuiz')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card-playful p-12 text-center">
            <BookOpen className="w-14 h-14 text-primary-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-slate-700 mb-2 text-lg">{t('admin.noQuizzes')}</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">{t('admin.noQuizzesDesc')}</p>
          </div>
        ) : (
          <div className="card-playful overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 border-b-2 border-primary-100">
                <tr>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.quizTitle')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.subject')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.difficulty')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.questions')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.status')}</th>
                  <th className="text-left px-6 py-3 font-extrabold text-slate-600">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-slate-100 hover:bg-primary-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{quiz.title}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{quiz.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${difficultyColors[quiz.difficulty]}`}>
                        {t(`quizzes.difficulty.${quiz.difficulty}`, { defaultValue: quiz.difficulty })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{quiz.questionCount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${quiz.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {quiz.active ? t('admin.active') : t('admin.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(quiz)} className="p-2 rounded-xl hover:bg-primary-100 text-primary-600 transition" title={t('admin.edit')}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggle(quiz.id)} className="p-2 rounded-xl hover:bg-amber-100 text-amber-600 transition" title={t('admin.toggle')}>
                          {quiz.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(quiz.id)} className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition" title={t('admin.delete')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-slate-800">
                  {editingId ? t('admin.editQuiz') : t('admin.createQuiz')}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-600 mb-1">{t('admin.quizTitle')}</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">{t('admin.subject')}</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">{t('admin.difficulty')}</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium focus:border-primary-500 outline-none"
                    >
                      <option value="EASY">{t('quizzes.difficulty.EASY')}</option>
                      <option value="MEDIUM">{t('quizzes.difficulty.MEDIUM')}</option>
                      <option value="HARD">{t('quizzes.difficulty.HARD')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">{t('admin.pointsReward')}</label>
                    <input
                      type="number"
                      value={form.pointsReward}
                      onChange={(e) => setForm({ ...form, pointsReward: Number(e.target.value) })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">{t('admin.timeLimit')}</label>
                    <input
                      type="number"
                      value={form.timeLimit}
                      onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-700">{t('admin.questions')}</h3>
                <button onClick={addQuestion} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                  + {t('admin.addQuestion')}
                </button>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {form.questions.map((q, i) => (
                  <div key={i} className="border-2 border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-extrabold text-slate-500">{t('admin.question')} {i + 1}</span>
                      {form.questions.length > 1 && (
                        <button onClick={() => removeQuestion(i)} className="text-red-500 text-sm font-bold">{t('admin.remove')}</button>
                      )}
                    </div>
                    <input
                      value={q.text}
                      onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                      placeholder={t('admin.questionText')}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 mb-2 font-medium focus:border-primary-500 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <input
                          key={opt}
                          value={q[`option${opt}`]}
                          onChange={(e) => updateQuestion(i, `option${opt}`, e.target.value)}
                          placeholder={`${t('admin.option')} ${opt}`}
                          className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:border-primary-500 outline-none"
                        />
                      ))}
                    </div>
                    <select
                      value={q.correctOption}
                      onChange={(e) => updateQuestion(i, 'correctOption', e.target.value)}
                      className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:border-primary-500 outline-none"
                    >
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <option key={opt} value={opt}>{t('admin.correctAnswer')}: {opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition">
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl font-bold bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-60"
                >
                  {saving ? t('admin.saving') : t('admin.saveQuiz')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatedPage>
    </AdminLayout>
  )
}
