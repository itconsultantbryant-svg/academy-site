import api from './api'
import { postJsonWithRetry } from '../lib/postJsonWithRetry'

function registrationTimeoutMs() {
  const n = Number(import.meta.env.VITE_REGISTRATION_API_TIMEOUT_MS)
  return Number.isFinite(n) && n > 0 ? n : 45000
}

function registrationMaxAttempts() {
  const n = Number(import.meta.env.VITE_REGISTRATION_RETRY_ATTEMPTS)
  if (!Number.isFinite(n) || n < 1) return 3
  return Math.min(Math.floor(n), 5)
}

/**
 * Registration bypasses the global short API timeout — mobile networks often need
 * several seconds for TLS + cold API (e.g. Render sleep). Retries cover brief drops.
 */
export async function submitRegistration(payload) {
  return postJsonWithRetry(api, '/api/registrations', payload, {
    timeoutMs: registrationTimeoutMs(),
    maxAttempts: registrationMaxAttempts(),
    baseDelayMs: 1200,
  })
}
