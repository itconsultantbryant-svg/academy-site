import axios from 'axios'

const configuredBase = String(import.meta.env.VITE_API_URL || '').trim()
const normalizedConfiguredBase = configuredBase.replace(/\/+$/, '')

/**
 * API base URL:
 * - Leave `VITE_API_URL` unset to call `/api` on the **same origin** as the site (recommended).
 *   Production: configure your host to reverse-proxy `/api` → backend (see `vercel.json`).
 * - Set `VITE_API_URL` only if you cannot proxy (e.g. static host) — then use the full API origin.
 */
const baseURL = normalizedConfiguredBase || ''

// Short default for read-heavy calls; mutations (registration, subscribe) use per-request timeouts.
const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS)
const requestTimeoutMs =
  Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : 1000

export const api = axios.create({
  baseURL,
  timeout: requestTimeoutMs,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem('auth_token')
    return
  }
  localStorage.setItem('auth_token', token)
}

export default api
