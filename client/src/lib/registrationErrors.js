/**
 * User-facing message for failed registration API calls.
 */
export function getRegistrationErrorMessage(error) {
  const serverMsg = error?.response?.data?.error?.message
  if (typeof serverMsg === 'string' && serverMsg.trim()) return serverMsg

  if (error?.code === 'ECONNABORTED') {
    return 'Connection was too slow and timed out. Please try again — if it keeps failing, switch network or try Wi‑Fi.'
  }
  if (error?.message === 'Network Error' || (!error?.response && error?.request)) {
    return 'Could not reach our server. Check your signal or Wi‑Fi, then tap Submit again.'
  }

  const status = error?.response?.status
  if (status >= 500) {
    return 'Our server is temporarily unavailable. Please try again in a moment.'
  }
  if (status === 413) {
    return 'Request was too large. Remove very long text and try again.'
  }

  return 'Registration could not be completed. Please check your connection and try again.'
}
