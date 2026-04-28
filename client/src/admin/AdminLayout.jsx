import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminLogin, getSession, logout } from '../services/admin/authService'
import usePageMeta from '../hooks/usePageMeta'
import { adminRoutes } from './adminRoutes'

const navItems = adminRoutes.map(({ to, label, end }) => ({ to, label, end }))

export default function AdminLayout() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState(
    import.meta.env.DEV ? 'admin@prinstineacademy.org' : '',
  )
  const [password, setPassword] = useState(
    import.meta.env.DEV ? 'Admin@PrinstineAcademy2026' : '',
  )
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(true)

  const isAuthenticated = useMemo(() => Boolean(user), [user])
  usePageMeta({
    title: isAuthenticated ? 'Admin Panel' : 'Admin Login',
    description: 'Administrative interface for Prinstine Academy.',
    noindex: true,
  })

  async function refreshSession() {
    try {
      const current = await getSession()
      setUser(current)
      setAuthError('')
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setAuthError('')
    try {
      await adminLogin(email, password)
      await refreshSession()
    } catch (e) {
      setAuthError(e?.response?.data?.error?.message || 'Login failed')
    }
  }

  function handleLogout() {
    if (!confirmLeaveIfDirty()) return
    logout()
    setUser(null)
  }

  const confirmLeaveIfDirty = useCallback(() => {
    if (!window.__adminHasUnsavedChanges) return true
    return window.confirm(
      'You have unsaved changes. Are you sure you want to leave this page?'
    )
  }, [])

  useEffect(() => {
    function onPopState() {
      if (confirmLeaveIfDirty()) return
      // Restore current history entry when user cancels back/forward navigation.
      window.history.go(1)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [confirmLeaveIfDirty])

  if (loading) {
    return <section className="glass-card p-6">Checking admin session...</section>
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-md space-y-4 glass-card p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <form onSubmit={handleLogin} className="grid gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="submit">Sign in</button>
        </form>
        {authError ? <p className="text-rose-200">{authError}</p> : null}
        <p className="text-sm text-slate-400">Use your admin credentials to continue.</p>
      </section>
    )
  }

  if (String(user?.role || '').toLowerCase() !== 'admin') {
    return (
      <section className="mx-auto max-w-lg space-y-4 glass-card p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-white">Admin Access Required</h1>
        <p className="text-sm text-slate-300">
          Your account is signed in but does not have admin permissions for this dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn-outline">
            Back to site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-sm text-rose-100 hover:bg-rose-500/30"
          >
            Logout
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-sm text-slate-300">Signed in as {user.email}</p>
          <p className="mt-1 text-xs text-amber-300">
            Dashboard is currently in analysis/view mode. Editing operations are disabled.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            onClick={(e) => {
              if (!confirmLeaveIfDirty()) e.preventDefault()
            }}
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
          >
            Back to site
          </Link>
          <button type="button" onClick={handleLogout} className="rounded-full border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-sm text-rose-100 hover:bg-rose-500/30">Logout</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="glass-card p-3">
          <nav className="grid gap-1" aria-label="Admin sections">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={(e) => {
                  if (!confirmLeaveIfDirty()) e.preventDefault()
                }}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-100'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-4 md:p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </section>
  )
}
