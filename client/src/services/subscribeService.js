import api from './api'
import { postJsonWithRetry } from '../lib/postJsonWithRetry'

function subscribeTimeoutMs() {
  const n = Number(import.meta.env.VITE_SUBSCRIBE_API_TIMEOUT_MS)
  return Number.isFinite(n) && n > 0 ? n : 90000
}

export async function subscribeUser(payload) {
  return postJsonWithRetry(api, '/api/subscribers', payload, {
    timeoutMs: subscribeTimeoutMs(),
    maxAttempts: 5,
    baseDelayMs: 2000,
    maxBackoffMs: 60000,
  })
}
