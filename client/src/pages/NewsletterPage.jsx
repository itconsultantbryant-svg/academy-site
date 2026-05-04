import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import { subscribeUser } from '../services/subscribeService'

export default function NewsletterPage() {
  usePageMeta({
    title: 'Newsletter',
    description:
      'Subscribe to Prinstine Academy updates on courses, events, and learning opportunities.',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canSubmit = useMemo(
    () => Boolean(name.trim()) && Boolean(email.trim()) && !submitting,
    [name, email, submitting]
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!name.trim() || !email.trim()) {
      setError('Enter your name and email.')
      return
    }
    try {
      setSubmitting(true)
      await subscribeUser({ name: name.trim(), email: email.trim() })
      setSuccess("You're subscribed — thank you.")
      setName('')
      setEmail('')
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Could not subscribe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-lg space-y-8"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Newsletter
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100 md:text-base">
          Get updates on new courses, events, and learning opportunities from Prinstine Academy.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card grid gap-4 p-6 md:p-8"
      >
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Name</span>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Email</span>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <button type="submit" disabled={!canSubmit} className="btn-primary mt-1">
          {submitting ? 'Subscribing…' : 'Subscribe'}
        </button>
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
        <Link to="/" className="text-center text-sm text-blue-200/90 hover:text-blue-100">
          Back to home
        </Link>
      </form>
    </motion.section>
  )
}
