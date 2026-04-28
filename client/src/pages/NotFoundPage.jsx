import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta({
    title: '404 Not Found',
    description: 'The page you requested could not be found on Prinstine Academy.',
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card space-y-5 p-6 text-center md:p-10"
    >
      <p className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
        404 Error
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Page not found</h1>
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-blue-100 md:text-base">
        The page you requested does not exist or may have moved. Use the links below to continue exploring Prinstine Academy.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/courses"
          className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Browse Courses
        </Link>
        <Link
          to="/contact"
          className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Contact Support
        </Link>
      </div>
      <p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          Go back home
        </Link>
      </p>
    </motion.section>
  )
}
