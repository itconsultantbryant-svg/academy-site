import { useEffect } from 'react'
import { flushPendingRegistrations } from '../lib/pendingRegistrationQueue'
import { submitRegistration } from '../services/registrationService'

/**
 * Retries registrations saved locally when the network failed after optimistic submit.
 */
export default function PendingRegistrationSync() {
  useEffect(() => {
    function sync() {
      void flushPendingRegistrations(submitRegistration)
    }
    sync()
    const interval = window.setInterval(sync, 2 * 60 * 1000)
    window.addEventListener('online', sync)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('online', sync)
    }
  }, [])
  return null
}
