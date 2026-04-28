import { useEffect, useState } from 'react'
import { listCourses } from '../../services/admin/courseAdminService'
import { listPosts } from '../../services/admin/postAdminService'
import { getSection } from '../../services/admin/contentAdminService'
import { listSubscribers } from '../../services/admin/subscriberAdminService'

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-cyan-200">{value}</p>
    </div>
  )
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({ courses: 0, posts: 0, cmsSections: 0, subscribers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [courses, posts, hero, footer, navbar, subscribers] = await Promise.all([
          listCourses(),
          listPosts(),
          getSection('hero'),
          getSection('footer'),
          getSection('navbar'),
          listSubscribers(),
        ])
        if (!active) return
        const configured = [hero, footer, navbar].filter((s) => s.exists).length
        setStats({
          courses: courses.length,
          posts: posts.length,
          cmsSections: configured,
          subscribers: subscribers.length,
        })
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
    </section>
  )
}
