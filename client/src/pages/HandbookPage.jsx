import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import facultyHandbookPdf from '../assets/Prinstine Academy Falculty  Handbook (5).pdf'
import studentHandbookPdf from '../assets/Prinstine Academy Student handbook final.pdf'

const HANDBOOKS = [
  {
    id: 'faculty',
    title: 'Prinstine Academy Faculty Handbook',
    summary:
      'Guidance for faculty standards, instructional quality, ethics, and academic delivery procedures.',
    href: facultyHandbookPdf,
    audience: 'Faculty and Academic Coordinators',
  },
  {
    id: 'student',
    title: 'Prinstine Academy Student Handbook',
    summary:
      'A complete guide for students covering enrollment expectations, conduct, academic policies, and support.',
    href: studentHandbookPdf,
    audience: 'Students and Parents/Guardians',
  },
]

export default function HandbookPage() {
  usePageMeta({
    title: 'Handbook',
    description:
      'Download official Prinstine Academy handbooks for faculty and students.',
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Handbook</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Access official academy handbooks for both faculty and students. These documents explain
          policies, expectations, and important procedures for a consistent learning experience.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {HANDBOOKS.map((item) => (
          <article
            key={item.id}
            className="glass-card group flex h-full flex-col justify-between rounded-2xl border border-blue-200/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300/40"
          >
            <div>
              <p className="inline-flex rounded-full bg-blue-900/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                {item.audience}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100">{item.summary}</p>
            </div>
            <a
              href={item.href}
              download
              className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-amber-300"
            >
              Download PDF
              <span aria-hidden="true">{'->'}</span>
            </a>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-blue-200/20 bg-white/5 p-4 text-sm text-blue-100">
        Tip: Keep these handbooks for quick reference throughout your academic session and training cycle.
      </div>
    </motion.section>
  )
}
