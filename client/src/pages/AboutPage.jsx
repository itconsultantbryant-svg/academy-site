import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import { findAssetUrl } from '../data/assetLibrary'

const HIGHLIGHTS = [
  'Licensed and accredited by the Ministry of Education.',
  'Competency-based technical and professional training programs.',
  'Qualified instructors with practical industry and teaching experience.',
  'Learning model that bridges education and workforce needs.',
]

export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const sosSlides = useMemo(
    () =>
      [findAssetUrl('SOS-Training-1'), findAssetUrl('SOS-Training-2'), findAssetUrl('SOS-Training-3')].filter(
        Boolean
      ),
    []
  )

  usePageMeta({
    title: 'About',
    description:
      'Learn about Prinstine Academy, its accreditation status, philosophy, and commitment to practical professional training.',
  })

  useEffect(() => {
    if (sosSlides.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sosSlides.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [sosSlides])

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
          About Prinstine Academy
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          We Empower. We Educate. We Elevate.
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-blue-100 md:text-base">
          Prinstine Academy is a licensed and accredited training institution recognized by the
          Ministry of Education, committed to delivering high-quality technical and professional
          education that meets national and international standards.
        </p>
        {sosSlides.length ? (
          <div className="mt-5">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={sosSlides[activeSlide]}
                  src={sosSlides[activeSlide]}
                  alt={`SOS training slide ${activeSlide + 1}`}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  loading="lazy"
                  decoding="async"
                />
              </AnimatePresence>
              {sosSlides.length > 1 ? (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1">
                  {sosSlides.map((_, idx) => (
                    <button
                      key={`about-sos-dot-${idx}`}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to SOS slide ${idx + 1}`}
                      className={`h-2 w-2 rounded-full p-0 ${idx === activeSlide ? 'bg-white' : 'bg-white/45'}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="glass-card space-y-4 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-blue-100 md:text-base">
            Guided by our core philosophy - We Empower, We Educate, and We Elevate - we are
            dedicated to transforming lives through practical skills development and professional
            training.
          </p>
          <p className="text-sm leading-relaxed text-blue-100 md:text-base">
            We specialize in offering technical and professional courses designed to meet the
            evolving demands of today&apos;s workforce. Our programs combine theoretical knowledge
            with hands-on practical experience so learners gain the competencies needed to excel
            in their chosen careers and industries.
          </p>
          <p className="text-sm leading-relaxed text-blue-100 md:text-base">
            At Prinstine Academy, we are driven by excellence, integrity, and innovation in
            education. Our courses are delivered by qualified and experienced professionals who are
            committed to nurturing talent, building capacity, and supporting learners to achieve
            their full potential in a dynamic and competitive world.
          </p>
          <p className="text-sm leading-relaxed text-blue-100 md:text-base">
            As a trusted institution in professional training, we continue to bridge the gap
            between education and industry by providing competency-based learning solutions that
            empower individuals, strengthen organizations, and contribute meaningfully to national
            development.
          </p>
        </article>
        <article className="glass-card space-y-3 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Why Prinstine Academy</h2>
          <ul className="space-y-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-blue-100">
                - {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </motion.section>
  )
}
