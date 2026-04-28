import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

export default function OnlineCoursesLinkPage() {
  usePageMeta({
    title: 'Online Courses Link',
    description: 'Access online course enrollment and learning resources.',
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Online Courses Link
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Start learning online immediately using our course catalog and enrollment pathways.
        </p>
      </div>
      <div className="glass-card space-y-4 p-6 md:p-8">
        <p className="text-sm text-blue-100">
          Browse the complete online program list and choose the training path that matches your
          goals.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          Go to Courses <span aria-hidden="true">{'->'}</span>
        </Link>
      </div>
    </motion.section>
  )
}
