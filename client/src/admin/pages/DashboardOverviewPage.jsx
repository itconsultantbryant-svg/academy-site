import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCourses } from '../../services/admin/courseAdminService'
import { listPosts } from '../../services/admin/postAdminService'
import { getSection } from '../../services/admin/contentAdminService'
import { listSubscribers } from '../../services/admin/subscriberAdminService'
import { listRegistrations } from '../../services/admin/registrationAdminService'
import { adminRoutes } from '../adminRoutes'

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-cyan-200">{value}</p>
    </div>
  )
}

export default function DashboardOverviewPage() {
  const didLoadRef = useRef(false)
  const [stats, setStats] = useState({
    courses: 0,
    posts: 0,
    cmsSections: 0,
    subscribers: 0,
    registrations: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (didLoadRef.current) return
    didLoadRef.current = true
    let active = true
    async function load() {
      try {
        const [courses, posts, hero, footer, navbar, subscribers, registrationsData] = await Promise.all([
          listCourses(),
          listPosts(),
          getSection('hero'),
          getSection('footer'),
          getSection('navbar'),
          listSubscribers(),
          listRegistrations(),
        ])
        if (!active) return
        const configured = [hero, footer, navbar].filter((s) => s.exists).length
        const registrations = Array.isArray(registrationsData?.registrations)
          ? registrationsData.registrations
          : Array.isArray(registrationsData)
            ? registrationsData
            : []
        setStats({
          courses: courses.length,
          posts: posts.length,
          cmsSections: configured,
          subscribers: subscribers.length,
          registrations: registrations.length,
        })
        setError('')
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.error?.message || 'Failed to load dashboard analytics')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p>Loading overview...</p>

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Courses" value={stats.courses} />
        <StatCard label="Posts" value={stats.posts} />
        <StatCard label="CMS Sections Configured" value={stats.cmsSections} />
        <StatCard label="Subscribers" value={stats.subscribers} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Registrations" value={stats.registrations} />
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Data pipeline status</p>
          <p className="text-sm font-semibold text-emerald-200">
            Connected to registration and subscription analysis endpoints
          </p>
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          Admin Sections
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {adminRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
