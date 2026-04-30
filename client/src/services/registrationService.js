import api from './api'
import { postJsonWithRetry } from '../lib/postJsonWithRetry'

/** Mobile data (e.g. Orange) + cold Render often exceed 45s; allow two minutes per attempt. */
function registrationTimeoutMs() {
  const n = Number(import.meta.env.VITE_REGISTRATION_API_TIMEOUT_MS)
  return Number.isFinite(n) && n > 0 ? n : 120000
}

function registrationMaxAttempts() {
  const n = Number(import.meta.env.VITE_REGISTRATION_RETRY_ATTEMPTS)
  if (!Number.isFinite(n) || n < 1) return 5
  return Math.min(Math.floor(n), 6)
}

/**
 * Registration bypasses the global short API timeout — mobile networks often need
 * a long time for TLS + cold API. Retries with backoff cover brief drops.
 */
export async function submitRegistration(payload) {
  return postJsonWithRetry(api, '/api/registrations', payload, {
    timeoutMs: registrationTimeoutMs(),
    maxAttempts: registrationMaxAttempts(),
    baseDelayMs: 2000,
    maxBackoffMs: 60000,
  })
}
