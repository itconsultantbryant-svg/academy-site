import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { localCourses } from '../data/courseCatalog'
import usePageMeta from '../hooks/usePageMeta'
import { enqueuePendingRegistration } from '../lib/pendingRegistrationQueue'
import { submitRegistration } from '../services/registrationService'

export default function StudentRegistrationPage() {
  usePageMeta({
    title: 'Student Registration',
    description:
      'Register to enroll at Prinstine Academy by selecting your preferred course and submitting your details.',
  })

  const [searchParams] = useSearchParams()
  const initialCourseId = searchParams.get('course') || ''
  const courses = useMemo(
    () => {
      const seenTitles = new Set()
      return [...localCourses]
        .map((item) => ({ id: String(item.id), title: String(item.title || '').trim() }))
        .filter((item) => {
          const key = item.title.toLowerCase()
          if (!key || seenTitles.has(key)) return false
          seenTitles.add(key)
          return true
        })
        .sort((a, b) => a.title.localeCompare(b.title))
    },
    []
  )

  const initialCourse = courses.find((item) => item.id === initialCourseId)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseId: initialCourse?.id || '',
    learningMode: 'in-person',
    highestEducation: '',
    address: '',
    notes: '',
  })
  const [submitCooldown, setSubmitCooldown] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const submitLockRef = useRef(false)

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const selectedCourse = courses.find((item) => item.id === form.courseId)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.courseId) {
      setError('Full name, email, phone, and selected course are required.')
      return
    }
    if (submitLockRef.current || submitCooldown) return

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      courseId: form.courseId,
      courseTitle: selectedCourse?.title || '',
      learningMode: form.learningMode,
      highestEducation: form.highestEducation.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
    }

    submitLockRef.current = true
    setSubmitCooldown(true)
    setSuccess(
      'Thank you — your registration is received. Our admissions team will contact you using the details you provided.'
    )
    setForm((prev) => ({
      ...prev,
      fullName: '',
      email: '',
      phone: '',
      highestEducation: '',
      address: '',
      notes: '',
    }))

    window.setTimeout(() => {
      submitLockRef.current = false
    }, 1000)
    window.setTimeout(() => {
      setSubmitCooldown(false)
    }, 1200)

    void (async () => {
      try {
        await submitRegistration(payload)
      } catch {
        enqueuePendingRegistration(payload)
      }
    })()
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Student Registration
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Complete this registration form to enroll in your chosen course at Prinstine Academy.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card mx-auto grid w-full max-w-5xl gap-4 p-5 md:p-6 lg:grid-cols-2"
      >
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Full Name</span>
          <input
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Email Address</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Phone Number</span>
          <input
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Course Selection</span>
          <select
            value={form.courseId}
            onChange={(e) => updateField('courseId', e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Preferred Learning Mode</span>
          <select
            value={form.learningMode}
            onChange={(e) => updateField('learningMode', e.target.value)}
          >
            <option value="in-person">In person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-blue-100">Highest Education</span>
          <input
            value={form.highestEducation}
            onChange={(e) => updateField('highestEducation', e.target.value)}
            placeholder="Example: B.Sc., Diploma, High School"
          />
        </label>
        <label className="grid gap-1.5 text-sm lg:col-span-2">
          <span className="font-medium text-blue-100">Address</span>
          <input
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Enter your address"
          />
        </label>
        <label className="grid gap-1.5 text-sm lg:col-span-2">
          <span className="font-medium text-blue-100">Additional Notes</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Any extra details you want to share"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-2 lg:col-span-2">
          <button type="submit" disabled={submitCooldown} className="btn-primary">
            Submit Registration
          </button>
          <Link to="/courses" className="btn-outline">
            Back to Courses
          </Link>
        </div>
        <p className="text-xs leading-relaxed text-blue-200/75 lg:col-span-2">
          Prefer to talk through options first? Use{' '}
          <Link to="/contact" className="font-medium text-cyan-200 underline-offset-2 hover:underline">
            Contact
          </Link>{' '}
          — we respond to every inquiry.
        </p>
        {error ? <p className="text-sm text-rose-200 lg:col-span-2">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-200 lg:col-span-2">{success}</p> : null}
      </form>
    </motion.section>
  )
}
