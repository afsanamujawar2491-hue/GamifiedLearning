import api from './client'

export const getDashboard = () =>
  api.get('/student/dashboard')

export const getQuizzes = () =>
  api.get('/student/quizzes')

export const getQuiz = (id) =>
  api.get(`/student/quizzes/${id}`)

export const submitQuiz = (id, answers) =>
  api.post(`/student/quizzes/${id}/submit`, { answers })

export const getLeaderboard = () =>
  api.get('/leaderboard')

export const getGames = () =>
  api.get('/student/games')

export const getGame = (slug) =>
  api.get(`/student/games/${slug}`)

export const submitGame = (slug, score, total) =>
  api.post(`/student/games/${slug}/submit`, { score, total })
