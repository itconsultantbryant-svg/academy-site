import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCourseById, getCourses } from '../services/courseService'
import { PageSkeleton } from '../components/Skeletons'
import ErrorState from '../components/ErrorState'
import usePageMeta from '../hooks/usePageMeta'
import useStructuredData from '../hooks/useStructuredData'
import { formatPrice } from '../lib/formatters'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [relatedCourses, setRelatedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  usePageMeta({
    title: course?.title ? `${course.title} Course` : 'Course Details',
    description:
      course?.description?.slice(0, 150) ||
      'Explore complete course details, pricing, duration, and category.',
    image: course?.image || '/favicon.svg',
  })
  useStructuredData(
    course
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.description || 'Course details at Prinstine Academy.',
          image: course.image || undefined,
          provider: {
            '@type': 'Organization',
            name: 'Prinstine Academy',
            url: window.location.origin,
          },
          offers: {
            '@type': 'Offer',
            price: Number(course.price || 0),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }
      : null
  )

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [data, allCourses] = await Promise.all([getCourseById(id), getCourses()])
        if (!active) return
        setCourse(data)
        if (data) {
          const related = allCourses
            .filter((item) => item.id !== data.id)
            .filter(
              (item) =>
                item.category?.name === data.category?.name ||
                (item.tags || []).some((tag) => (data.tags || []).includes(tag))
            )
            .slice(0, 3)
          setRelatedCourses(related)
        } else {
          setRelatedCourses([])
        }
      } catch (e) {
        if (active) setError(e?.response?.data?.error?.message || 'Failed to load course')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <PageSkeleton />
  if (error) return <ErrorState title="Course unavailable" message={error} />
  if (!course) return <ErrorState title="Course not found" message="This course does not exist." />

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
          Course Details
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{course.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Build practical workplace capability through structured modules, project-based practice, and guided support.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="glass-card space-y-4 p-6 md:p-8">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              decoding="async"
              className="max-h-[420px] w-full rounded-xl object-cover"
            />
          ) : null}
          <h2 className="text-xl font-semibold text-white">About this course</h2>
          <p className="text-sm leading-relaxed text-blue-100 md:text-base">
            {course.description || 'No description available.'}
          </p>
          {Array.isArray(course.tags) && course.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-900/25 px-2.5 py-1 text-xs text-blue-100">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="glass-card space-y-3 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-white">Course Snapshot</h2>
          <p className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100">
            <strong className="text-white">Price:</strong> <span className="text-amber-300">{formatPrice(course.price)}</span>
          </p>
          <p className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100">
            <strong className="text-white">Duration:</strong> {course.duration || 'N/A'}
          </p>
          <p className="rounded-xl border border-blue-200/20 bg-white/5 p-3 text-sm text-blue-100">
            <strong className="text-white">Category:</strong> {course.category?.name || 'Uncategorized'}
          </p>
          <div className="pt-1">
            <Link
              to={`/register?course=${course.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Enroll or Ask Questions <span aria-hidden="true">{'->'}</span>
            </Link>
          </div>
        </aside>
      </div>
      {relatedCourses.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Similar Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCourses.map((item) => (
              <article key={item.id} className="glass-card p-5">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mb-3 h-36 w-full rounded-lg object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-blue-100">
                  {item.description}
                </p>
                <Link
                  to={`/courses/${item.id}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-300"
                >
                  View course <span aria-hidden="true">{'->'}</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </motion.section>
  )
}
