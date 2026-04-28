import api, { setAuthToken } from '../api'

export async function adminLogin(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })
  if (data?.token) setAuthToken(data.token)
  return data
}

export async function getSession() {
  const { data } = await api.get('/api/auth/me')
  return data.user
}

export function logout() {
  setAuthToken('')
}
