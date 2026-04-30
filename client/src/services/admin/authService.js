import api, { setAuthToken } from '../api'

/** Login + session checks bypass the global short timeout (cold API / mobile networks). */
function authRequestTimeoutMs() {
  const n = Number(import.meta.env.VITE_AUTH_API_TIMEOUT_MS)
  return Number.isFinite(n) && n > 0 ? n : 30000
}

const authReq = () => ({ timeout: authRequestTimeoutMs() })

export async function adminLogin(email, password) {
  const { data } = await api.post(
    '/api/auth/login',
    { email, password },
    authReq()
  )
  if (data?.token) setAuthToken(data.token)
  return data
}

export async function getSession() {
  const { data } = await api.get('/api/auth/me', authReq())
  return data.user
}

export function logout() {
  setAuthToken('')
}
