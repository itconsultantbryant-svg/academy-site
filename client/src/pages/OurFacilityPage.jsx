import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import { findAssetUrl } from '../data/assetLibrary'

const facilityImages = Array.from({ length: 24 }, (_, i) =>
  findAssetUrl(`Facility-${i + 1}`)
).filter(Boolean)

export default function OurFacilityPage() {
  usePageMeta({
    title: 'Our Facility',
    description:
      'Explore Prinstine Academy facilities designed to support practical, engaging, and professional learning experiences.',
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
          Our Facility
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Prinstine Academy provides a structured and learner-friendly environment where
          participants gain practical experience, confidence, and professional readiness through
          modern training spaces.
        </p>
      </div>

      <section className="glass-card p-5 md:p-6">
        <h2 className="text-2xl font-semibold text-white">Learning Environment</h2>
        <p className="mt-3 text-sm leading-relaxed text-blue-100 md:text-base">
          Our facility setup supports collaborative learning, focused technical practice, and
          instructor-guided sessions. The spaces are organized to make training efficient, safe,
          and engaging for both individual learners and organizational cohorts.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilityImages.map((image, idx) => (
          <article
            key={`facility-${idx + 1}`}
            className="overflow-hidden rounded-2xl border border-blue-200/20 bg-white/5"
          >
            <img
              src={image}
              alt="Facility"
              className="aspect-[4/3] w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="p-3">
              <p className="text-sm font-medium text-blue-100">Facility</p>
            </div>
          </article>
        ))}
      </section>
    </motion.section>
  )
}

