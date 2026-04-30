/**
 * POST JSON with optional per-request timeout and retries for flaky networks
 * (high latency, intermittent drops on mobile carriers).
 */
export function isRetryableNetworkError(error) {
  if (!error) return false
  const code = error.code
  if (
    code === 'ECONNABORTED' ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'ERR_NETWORK' ||
    code === 'ECONNREFUSED'
  ) {
    return true
  }
  if (error.message === 'Network Error') return true
  const status = error.response?.status
  if (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status === 522 ||
    status === 524
  ) {
    return true
  }
  if (error.request && !error.response) return true
  return false
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function backoffMs(attempt, baseDelayMs, maxDelayMs) {
  const exp = baseDelayMs * 2 ** Math.max(0, attempt - 1)
  const jitter = Math.floor(Math.random() * 800)
  return Math.min(maxDelayMs, exp + jitter)
}

/**
 * @param {import('axios').AxiosInstance} httpClient
 * @param {string} url
 * @param {object} payload
 * @param {{ timeoutMs?: number; maxAttempts?: number; baseDelayMs?: number; maxBackoffMs?: number }} [options]
 */
export async function postJsonWithRetry(httpClient, url, payload, options = {}) {
  const {
    timeoutMs,
    maxAttempts = 3,
    baseDelayMs = 2000,
    maxBackoffMs = 45000,
  } = options
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const config = timeoutMs != null ? { timeout: timeoutMs } : {}
      const { data } = await httpClient.post(url, payload, config)
      return data
    } catch (e) {
      lastError = e
      if (attempt < maxAttempts && isRetryableNetworkError(e)) {
        await delay(backoffMs(attempt, baseDelayMs, maxBackoffMs))
        continue
      }
      throw e
    }
  }
  throw lastError
}
