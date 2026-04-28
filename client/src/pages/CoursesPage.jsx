import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCourses } from '../services/courseService'
import Reveal from '../components/Reveal'
import { GridSkeleton } from '../components/Skeletons'
import ErrorState from '../components/ErrorState'
import usePageMeta from '../hooks/usePageMeta'
import useStructuredData from '../hooks/useStructuredData'
import { formatPrice } from '../lib/formatters'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  usePageMeta({
    title: 'Courses',
    description:
      'Browse Prinstine Academy courses with practical curriculum and flexible learning paths.',
  })
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Prinstine Academy Courses',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        url: `${window.location.origin}/courses/${course.id}`,
      },
    })),
  })

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getCourses()
        if (active) setCourses(data)
      } catch (e) {
        if (active) setError(e?.response?.data?.error?.message || 'Failed to load courses')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase()
    return courses.filter((course) => {
      const categoryOk =
        activeCategory === 'all'
          ? true
          : String(course.category?.name || '').toLowerCase() === activeCategory
      const tagOk =
        activeTag === 'all'
          ? true
          : Array.isArray(course.tags) &&
            course.tags.map((t) => String(t).toLowerCase()).includes(activeTag)
      const searchOk = term
        ? `${course.title || ''} ${course.description || ''} ${course.category?.name || ''} ${(course.tags || []).join(' ')}`
        .toLowerCase()
        .includes(term)
        : true
      return categoryOk && tagOk && searchOk
    })
  }, [courses, query, activeCategory, activeTag])

  const categories = useMemo(
    () =>
      [...new Set(courses.map((course) => course.category?.name).filter(Boolean))].sort(),
    [courses]
  )

  const tags = useMemo(
    () =>
      [...new Set(courses.flatMap((course) => course.tags || []).filter(Boolean))].sort(),
    [courses]
  )

  if (loading) return <GridSkeleton />
  if (error) {
    return (
      <ErrorState
        title="Courses unavailable"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Courses</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Explore practical, role-ready programs designed to accelerate your career.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <StatCard label="Available courses" value={String(courses.length)} />
          <StatCard label="Showing" value={String(filteredCourses.length)} />
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-blue-200/20 bg-white/5 p-4 md:grid-cols-[1fr_auto] md:items-center md:p-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses by title, category, or keywords"
          className="w-full"
          aria-label="Search courses"
        />
        <p className="text-sm text-blue-100">
          Flexible practical training with industry-aligned content.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          {filteredCourses.length === 0 ? (
            <p className="text-blue-100">No courses available yet.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course, idx) => (
                <Reveal
                  key={course.id}
                  delay={0.04 * (idx % 6)}
                  interactive
                  className="glass-card p-5 md:p-6 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/50"
                >
                  {course.image ? (
                    <Link to={`/courses/${course.id}`} aria-label={`Open course details for ${course.title}`}>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="mb-3 h-44 w-full rounded-xl object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  ) : null}
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-lg font-semibold text-white hover:text-amber-300"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm text-blue-100">
                    {course.description || 'Professional practical training for real-world impact.'}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-amber-300">{formatPrice(course.price)}</p>
                    <p className="text-xs uppercase tracking-wide text-blue-200">
                      {course.category?.name || 'General'}
                    </p>
                  </div>
                  {Array.isArray(course.tags) && course.tags.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {course.tags.slice(0, 4).map((tag) => (
                        <span key={`${course.id}-${tag}`} className="rounded-full bg-blue-900/30 px-2 py-1 text-[11px] text-blue-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Reveal>
              ))}
            </ul>
          )}
        </div>
        <aside className="space-y-3 lg:sticky lg:top-24">
          <div className="section-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-200">
              Filter by Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`rounded-full px-3 py-1.5 text-xs ${activeCategory === 'all' ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-blue-100'}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category.toLowerCase())}
                  className={`rounded-full px-3 py-1.5 text-xs ${activeCategory === category.toLowerCase() ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-blue-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="section-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-200">
              Filter by Tag
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag('all')}
                className={`rounded-full px-3 py-1.5 text-xs ${activeTag === 'all' ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-blue-100'}`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag.toLowerCase())}
                  className={`rounded-full px-3 py-1.5 text-xs ${activeTag === tag.toLowerCase() ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-blue-100'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-blue-200/25 bg-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-blue-100">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}
