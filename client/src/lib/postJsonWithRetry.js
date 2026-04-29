/**
 * POST JSON with optional per-request timeout and retries for flaky networks
 * (high latency, intermittent drops on mobile carriers).
 */
export function isRetryableNetworkError(error) {
  if (!error) return false
  if (error.code === 'ECONNABORTED') return true
  if (error.message === 'Network Error') return true
  const status = error.response?.status
  if (status === 408 || status === 429 || status === 502 || status === 503 || status === 504) {
    return true
  }
  if (error.request && !error.response) return true
  return false
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @param {import('axios').AxiosInstance} httpClient
 * @param {string} url
 * @param {object} payload
 * @param {{ timeoutMs?: number; maxAttempts?: number; baseDelayMs?: number }} [options]
 */
export async function postJsonWithRetry(httpClient, url, payload, options = {}) {
  const { timeoutMs, maxAttempts = 3, baseDelayMs = 1000 } = options
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const config = timeoutMs != null ? { timeout: timeoutMs } : {}
      const { data } = await httpClient.post(url, payload, config)
      return data
    } catch (e) {
      lastError = e
      if (attempt < maxAttempts && isRetryableNetworkError(e)) {
        await delay(baseDelayMs * attempt)
        continue
      }
      throw e
    }
  }
  throw lastError
}
