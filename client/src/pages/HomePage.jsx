import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getSectionContent } from '../services/contentService'
import { getCourses } from '../services/courseService'
import { getPosts } from '../services/postService'
import Reveal from '../components/Reveal'
import { PageSkeleton } from '../components/Skeletons'
import ErrorState from '../components/ErrorState'
import usePageMeta from '../hooks/usePageMeta'
import useStructuredData from '../hooks/useStructuredData'
import logoImage from '../assets/logo.png'
import informationSheetPdf from '../assets/information sheet.pdf'
import { findAssetUrl } from '../data/assetLibrary'
import { formatPrice } from '../lib/formatters'

const SECTION_KEYS = ['hero', 'stats', 'categories', 'why-choose-us']

const OFFERINGS = [
  {
    id: '01',
    title: 'Personal Skill Development',
    text: 'Start where you are and grow at your pace with practical skills that make you more confident and more valuable.',
  },
  {
    id: '02',
    title: 'Role Ready Training',
    text: 'Prepare for your first role or next promotion with job-aligned training focused on real workplace practice.',
  },
  {
    id: '03',
    title: 'Career Upskilling & Advancement',
    text: 'Stay ahead with leadership, communication, digital tools, and entrepreneurship skill paths.',
  },
  {
    id: '04',
    title: 'Progress Tracking & Support',
    text: 'Get mentorship check-ins, clear milestones, and support systems that help you stay consistent.',
  },
]

const PROGRAM_TYPES = [
  {
    title: 'Certificate Programs (12 Weeks)',
    duration: '12 Weeks',
    text:
      'Our Certificate Programs are intensive, skills-focused training courses designed to equip participants with practical knowledge and industry-relevant competencies within a 12-week period. These programs combine structured learning, hands-on experience, and professional guidance to help individuals build expertise and enhance career opportunities.',
  },
  {
    title: 'Organization Training Programs (Flexible Duration)',
    duration: 'Flexible Duration',
    text:
      'Our Organization Training Programs are customized learning solutions tailored to meet the specific needs and goals of businesses, institutions, and teams. Program duration is flexible based on organizational requirements, ensuring targeted skill development, improved performance, and measurable impact within the workplace.',
  },
  {
    title: 'Acceleration Programs (Flexible Duration)',
    duration: 'Flexible Duration',
    text:
      'Our Acceleration Programs are personalized development pathways designed to help individuals achieve specific goals at an accelerated pace. With flexible timelines based on individual needs, these programs provide focused coaching, practical learning, and strategic support to fast-track personal, academic, or professional growth.',
  },
]

const FALLBACK_COURSES = [
  { id: 'fallback-course-1', title: 'Digital Literacy & Productivity', description: 'Build practical daily workplace digital skills.', price: 99 },
  { id: 'fallback-course-2', title: 'Business Communication Essentials', description: 'Improve writing, speaking, and professional communication.', price: 120 },
  { id: 'fallback-course-3', title: 'Foundations of Entrepreneurship', description: 'Learn to launch and manage growth-focused ventures.', price: 150 },
]

const FALLBACK_POSTS = [
  { id: 'fallback-post-1', title: 'How Skill-Based Learning Drives Career Growth', content: 'Explore practical pathways to improve employability and workplace confidence.' },
  { id: 'fallback-post-2', title: 'Why Modern Teams Need Continuous Training', content: 'Learn why upskilling is now core to business resilience and performance.' },
]

function buildFiveSlides(input) {
  const cleaned = [...new Set(input.filter((item) => typeof item === 'string' && item.trim()))]
  if (cleaned.length === 0) return []
  const slides = []
  let idx = 0
  while (slides.length < 5) {
    slides.push(cleaned[idx % cleaned.length])
    idx += 1
  }
  return slides
}

export default function HomePage() {
  usePageMeta({
    title: 'Home',
    description:
      'Learn smarter, achieve faster with Prinstine Academy through practical courses and recognized certifications.',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sections, setSections] = useState({})
  const [courses, setCourses] = useState([])
  const [posts, setPosts] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [programSlide, setProgramSlide] = useState(0)
  const coursesSliderRef = useRef(null)
  const infoSheetDownloadHref = informationSheetPdf

  const siteUrl = window.location.origin
  const logoUrl = logoImage.startsWith('http') ? logoImage : `${siteUrl}${logoImage}`
  useStructuredData({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Prinstine Academy',
        url: siteUrl,
        logo: logoUrl,
      },
      {
        '@type': 'WebSite',
        name: 'Prinstine Academy',
        url: siteUrl,
      },
    ],
  })

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [sectionResponses, coursesRes, postsRes] = await Promise.allSettled([
          Promise.all(SECTION_KEYS.map((key) => getSectionContent(key))),
          getCourses(),
          getPosts(),
        ])
        if (!active) return
        const next = {}
        const sectionValues =
          sectionResponses.status === 'fulfilled' ? sectionResponses.value : []
        SECTION_KEYS.forEach((key, idx) => {
          next[key] = sectionValues[idx]?.content || {}
        })
        setSections(next)
        setCourses(
          coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)
            ? coursesRes.value
            : []
        )
        setPosts(
          postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)
            ? postsRes.value
            : []
        )
        setError('')
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.error?.message || '')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const configured = Array.isArray(sections.stats?.items) ? sections.stats.items : []
    if (configured.length > 0) return configured
    return [
      { label: 'Businesses Trained', value: '50+' },
      { label: 'Completion Rate', value: '98%' },
      { label: 'Active Learners', value: '500+' },
    ]
  }, [sections.stats])

  const categories = Array.isArray(sections.categories?.items)
    ? sections.categories.items
    : []
  const hero = sections.hero || {}
  const whyChooseUs = Array.isArray(sections['why-choose-us']?.items)
    ? sections['why-choose-us'].items
    : []
  const featuredCourses = courses.length ? courses : FALLBACK_COURSES
  const latestPosts = (posts.length ? posts : FALLBACK_POSTS).slice(0, 2)
  const heroSlides = useMemo(() => {
    const fixedSlides = [
      findAssetUrl('slide-1'),
      findAssetUrl('slide-2'),
      findAssetUrl('slide-3'),
      findAssetUrl('slide-4'),
      findAssetUrl('slide-5'),
    ].filter(Boolean)
    if (fixedSlides.length === 5) return fixedSlides
    const configured = Array.isArray(hero.media?.gallery)
      ? hero.media.gallery.filter((entry) => typeof entry === 'string' && entry.trim())
      : []
    return buildFiveSlides([...fixedSlides, ...configured, hero.media?.image, logoImage])
  }, [hero.media])
  const programSlides = useMemo(
    () =>
      [
        findAssetUrl('Graduation-1'),
        findAssetUrl('Graduation-2'),
        findAssetUrl('Graduation-3'),
        findAssetUrl('Organization-Training'),
        findAssetUrl('SOS-Training-1'),
        findAssetUrl('SOS-Training-2'),
        findAssetUrl('SOS-Training-3'),
        findAssetUrl('SOS-Training-4'),
      ].filter(Boolean),
    []
  )

  useEffect(() => {
    if (!heroSlides.length) return
    setActiveSlide((prev) => prev % heroSlides.length)
  }, [heroSlides])

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [heroSlides])

  useEffect(() => {
    if (!programSlides.length) return
    setProgramSlide((prev) => prev % programSlides.length)
  }, [programSlides])

  useEffect(() => {
    if (programSlides.length <= 1) return
    const timer = window.setInterval(() => {
      setProgramSlide((prev) => (prev + 1) % programSlides.length)
    }, 3600)
    return () => window.clearInterval(timer)
  }, [programSlides])

  function scrollCourses(direction) {
    const el = coursesSliderRef.current
    if (!el) return
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.8))
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = coursesSliderRef.current
    if (!el || featuredCourses.length <= 1) return
    const timer = window.setInterval(() => {
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }
      const amount = Math.max(280, Math.floor(el.clientWidth * 0.8))
      el.scrollBy({ left: amount, behavior: 'smooth' })
    }, 4200)
    return () => window.clearInterval(timer)
  }, [featuredCourses.length])

  if (loading) return <PageSkeleton />
  if (error) return <ErrorState title="Homepage unavailable" message={error} />

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-12 lg:space-y-16"
    >
      <Reveal className="grid gap-8 rounded-3xl bg-gradient-to-r from-[#0a2fce] via-[#1039d1] to-[#2148df] p-6 md:grid-cols-[1.2fr_1fr] md:p-10 lg:p-12">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
            Welcome to Prinstine Academy
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl md:leading-[1.08]">
            We Educate. Empower. Elevate.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
            Learn with us today
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              Enroll Now
              <span aria-hidden="true">{'->'}</span>
            </Link>
            <a
              href={infoSheetDownloadHref}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Download Information Sheet
              <span aria-hidden="true">{'->'}</span>
            </a>
          </div>
        </div>
        {heroSlides.length ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900/35 shadow-[0_24px_60px_rgba(5,15,58,0.35)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={heroSlides[activeSlide]}
                src={heroSlides[activeSlide]}
                alt={`${hero.title || 'Prinstine Academy Hero'} slide ${activeSlide + 1}`}
                className="absolute inset-0 h-full w-full object-contain object-center"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                loading="eager"
                decoding="async"
              />
            </AnimatePresence>
            {heroSlides.length > 1 ? (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1">
                {heroSlides.map((_, idx) => (
                  <button
                    key={`slide-dot-${idx}`}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 w-2 rounded-full p-0 ${idx === activeSlide ? 'bg-white' : 'bg-white/45'}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm leading-relaxed text-blue-100">
            Accredited & Licensed by the Ministry of Education of Liberia
          </div>
        )}
      </Reveal>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item, idx) => (
          <Reveal
            key={item.id || idx}
            delay={idx * 0.05}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200/40 hover:bg-white/10"
          >
            <p className="text-3xl font-bold tracking-tight text-amber-300 md:text-4xl">
              {item.value || item.number || '-'}
            </p>
            <p className="mt-1 text-sm text-blue-100">{item.label || item.title}</p>
          </Reveal>
        ))}
      </section>

      <SectionHeading
        title="What We Offer"
        subtitle="Technical and vocational training programs streamlined to build practical, job-ready skills."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {OFFERINGS.map((item, idx) => (
          <Reveal
            key={item.id}
            delay={idx * 0.05}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10"
          >
            <p className="mb-2 text-sm font-semibold text-amber-300">{item.id}</p>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">{item.text}</p>
          </Reveal>
        ))}
      </section>

      <SectionHeading
        title="Programs Designed for Real Outcomes"
        subtitle="Choose from structured certificate tracks, customized organization training, and accelerated growth pathways."
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {PROGRAM_TYPES.map((item, idx) => (
          <Reveal
            key={item.title}
            delay={idx * 0.05}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/10 md:p-6"
          >
            <p className="inline-flex rounded-full bg-blue-900/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
              {item.duration}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">{item.text}</p>
          </Reveal>
        ))}
      </section>
      {programSlides.length ? (
        <section className="rounded-2xl border border-blue-200/20 bg-white/5 p-3 md:p-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-transparent">
            <AnimatePresence mode="wait">
              <motion.img
                key={programSlides[programSlide]}
                src={programSlides[programSlide]}
                alt={`Program spotlight slide ${programSlide + 1}`}
                className="absolute inset-0 h-full w-full object-contain object-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-transparent" aria-hidden="true" />
            {programSlides.length > 1 ? (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1">
                {programSlides.map((_, idx) => (
                  <button
                    key={`program-slide-dot-${idx}`}
                    type="button"
                    onClick={() => setProgramSlide(idx)}
                    aria-label={`Go to program slide ${idx + 1}`}
                    className={`h-2 w-2 rounded-full p-0 ${idx === programSlide ? 'bg-white' : 'bg-white/45'}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <SectionHeading title="Top Categories" subtitle="Explore in-demand learning tracks aligned to modern workforce needs." />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(categories.length ? categories : [{ name: 'AI + Data' }, { name: 'Business & Finance' }, { name: 'Cloud + IT Ops' }, { name: 'Technical Skills' }]).map((category, idx) => (
          <Reveal
            key={category.id || `${category.name}-${idx}`}
            delay={idx * 0.04}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-300/60 hover:bg-white/10"
          >
            <p className="text-lg font-semibold text-white">
              {category.name || category.title}
            </p>
          </Reveal>
        ))}
      </section>

      <SectionHeading
        title="Popular Courses"
        subtitle="Upskill with tailored learning solutions and practical certification pathways."
      />
      <section className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollCourses(-1)}
            aria-label="Scroll courses left"
            className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-blue-100 transition hover:bg-white/20 md:inline-flex"
          >
            {'<-'}
          </button>
          <button
            type="button"
            onClick={() => scrollCourses(1)}
            aria-label="Scroll courses right"
            className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-blue-100 transition hover:bg-white/20 md:inline-flex"
          >
            {'->'}
          </button>
        </div>
        <div ref={coursesSliderRef} className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {featuredCourses.map((course, idx) => (
          <Reveal
            key={course.id}
            delay={idx * 0.05}
            interactive
            className="min-w-[270px] flex-1 snap-start rounded-2xl border border-blue-200/20 bg-white/5 p-4 transition duration-200 hover:-translate-y-1 hover:border-blue-200/40 hover:bg-white/10 md:min-w-[310px]"
          >
            <Link to={`/courses/${course.id}`} aria-label={`Open course details for ${course.title}`} className="block">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="mb-3 aspect-[4/3] w-full rounded-xl bg-slate-900/35 object-contain object-center"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <p className="text-lg font-semibold text-white transition hover:text-amber-300">
                {course.title}
              </p>
              <p className="mt-1 text-sm text-blue-100">
                {course.description || 'Professional practical training.'}
              </p>
              <p className="mt-2 text-sm font-semibold text-amber-300">{formatPrice(course.price)}</p>
            </Link>
          </Reveal>
        ))}
        </div>
        <div className="flex justify-start">
          <Link to="/courses" className="btn-outline">
            Explore more Courses
            <span aria-hidden="true">{'->'}</span>
          </Link>
        </div>
      </section>

      <SectionHeading
        title="Why Teams and Professionals Choose Us"
        subtitle="Deliver real results with an engaging and flexible learning experience."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {(whyChooseUs.length
          ? whyChooseUs
          : [
              { title: 'Expert-Led Courses', text: 'Real-world insights from experienced professionals.' },
              { title: 'Scalable Team Training', text: 'Training built for organizations of any size.' },
              { title: 'Recognized Certificates', text: 'Verifiable certificates for completed courses.' },
            ]).map((item, idx) => (
          <Reveal
            key={item.id || `${item.title}-${idx}`}
            delay={idx * 0.05}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200/40 hover:bg-white/10"
          >
            <h3 className="text-lg font-semibold text-white">
              {item.title || item.heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">{item.text || item.description}</p>
          </Reveal>
        ))}
      </section>

      <SectionHeading
        title="Latest Articles and News"
        subtitle="Insights, updates, and practical guidance from the Prinstine Academy team."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {latestPosts.map((post, idx) => (
          <Reveal
            key={post.id}
            delay={idx * 0.05}
            interactive
            className="rounded-2xl border border-blue-200/20 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200/40 hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              {post.content?.replace(/<[^>]+>/g, '').slice(0, 120) || 'Latest update from Prinstine Academy.'}
            </p>
            <Link
              to={`/blog/${post.id}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
            >
              Read More
              <span aria-hidden="true">{'->'}</span>
            </Link>
          </Reveal>
        ))}
      </section>

      <Reveal className="rounded-3xl border border-blue-200/25 bg-white/5 p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_auto] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
              About Prinstine Academy
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Practical Learning for Real Career Growth
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
              We are committed to helping learners and organizations build relevant, market-ready
              skills through structured training, mentorship, and recognized certifications. Our
              programs are designed to be flexible, practical, and focused on outcomes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/about" className="btn-primary">
              Read More
              <span aria-hidden="true">{'->'}</span>
            </Link>
            <Link to="/contact" className="btn-outline">
              Talk to Us
            </Link>
          </div>
        </div>
      </Reveal>

      <section className="rounded-3xl border border-blue-200/20 bg-gradient-to-r from-[#0b2fcb] to-[#1d47de] p-6 md:p-10">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Educate. Empower. Elevate.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
          From individual learners to enterprises, Prinstine Academy creates and
          delivers impactful learning experiences designed for growth.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            Start Learning Today
            <span aria-hidden="true">{'->'}</span>
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </motion.section>
  )
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="space-y-2.5">
      <h2 className="text-[1.75rem] font-bold tracking-tight text-white md:text-[2.1rem]">{title}</h2>
      {subtitle ? <p className="max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">{subtitle}</p> : null}
    </div>
  )
}
