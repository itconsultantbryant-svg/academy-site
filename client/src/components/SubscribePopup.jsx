import { useEffect, useMemo, useState } from 'react'
import { subscribeUser } from '../services/subscribeService'

const DISMISS_KEY = 'subscribe_popup_dismissed'
const SUBSCRIBED_KEY = 'subscribe_popup_subscribed'

export default function SubscribePopup() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const subscribed = localStorage.getItem(SUBSCRIBED_KEY) === '1'
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'
    if (subscribed || dismissed) return

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, 10000)
    return () => window.clearTimeout(timer)
  }, [])

  const canSubmit = useMemo(
    () => Boolean(name.trim()) && Boolean(email.trim()) && !submitting,
    [name, email, submitting]
  )

  function handleCancel() {
    setOpen(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!name.trim() || !email.trim()) {
      setError('Enter your name and email')
      return
    }
    try {
      setSubmitting(true)
      await subscribeUser({ name: name.trim(), email: email.trim() })
      setSuccess('Thanks for subscribing!')
      localStorage.setItem(SUBSCRIBED_KEY, '1')
      window.setTimeout(() => {
        setOpen(false)
      }, 1200)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Subscription failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-blue-200/20 bg-[#0b164d] p-5 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">Subscribe to our updates</h3>
        <p className="mt-2 text-sm text-blue-100">
          Receive updates on new courses, events, and learning opportunities.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={!canSubmit} className="btn-primary">
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {error ? <p className="mt-2 text-sm text-rose-200">{error}</p> : null}
        {success ? <p className="mt-2 text-sm text-emerald-200">{success}</p> : null}
        <button
          type="button"
          onClick={handleCancel}
          className="mt-3 rounded-full border border-white/25 px-4 py-1.5 text-sm text-blue-200 underline-offset-4 transition hover:bg-white/10 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
