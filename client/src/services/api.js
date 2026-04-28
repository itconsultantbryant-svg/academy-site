import axios from 'axios'

const configuredBase = String(import.meta.env.VITE_API_URL || '').trim()
const normalizedConfiguredBase = configuredBase.replace(/\/+$/, '')
const fallbackBase =
  import.meta.env.PROD
    ? 'https://prinstine-academy-api.onrender.com'
    : 'http://localhost:3000'
const baseURL = normalizedConfiguredBase || fallbackBase

export const api = axios.create({
  baseURL,
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
