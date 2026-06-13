import api from './client'

export const getDashboard = () =>
  api.get('/admin/dashboard')

export const getStudents = () =>
  api.get('/admin/students')

export const getQuizzes = () =>
  api.get('/admin/quizzes')

export const getQuiz = (id) =>
  api.get(`/admin/quizzes/${id}`)

export const createQuiz = (data) =>
  api.post('/admin/quizzes', data)

export const updateQuiz = (id, data) =>
  api.put(`/admin/quizzes/${id}`, data)

export const toggleQuiz = (id) =>
  api.patch(`/admin/quizzes/${id}/toggle`)

export const deleteQuiz = (id) =>
  api.delete(`/admin/quizzes/${id}`)
