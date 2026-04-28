import { useEffect, useMemo, useState } from 'react'
import {
  createCourse,
  deleteCourse,
  listCourses,
  updateCourse,
} from '../../services/admin/courseAdminService'
import { useToast } from '../components/ToastProvider'
import {
  useSaveShortcut,
  useUnsavedChanges,
} from '../components/useUnsavedChanges'

const initialForm = {
  id: null,
  title: '',
  description: '',
  price: '',
  duration: '',
  category_id: '',
  image: null,
}

export default function ManageCoursesPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({})
  const pageSize = 8
  const toast = useToast()

  async function refresh() {
    setLoading(true)
    try {
      const data = await listCourses()
      setItems(data)
      setError('')
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => String(item.title || '').toLowerCase().includes(q))
  }, [items, query])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const titleError = !form.title.trim() ? 'Title is required' : ''
  const priceError =
    form.price !== '' && (Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      ? 'Price must be a non-negative number'
      : ''
  const durationError =
    form.duration !== '' &&
    (Number.isNaN(Number(form.duration)) || Number(form.duration) < 0)
      ? 'Duration must be a non-negative number'
      : ''
  const categoryError =
    form.category_id !== '' &&
    (Number.isNaN(Number(form.category_id)) || Number(form.category_id) < 1)
      ? 'Category ID must be a positive integer'
      : ''
  const formInvalid = Boolean(
    titleError || priceError || durationError || categoryError
  )
  const isDirty =
    Boolean(form.title || form.description || form.price || form.duration || form.category_id || form.image) ||
    Boolean(form.id)
  useUnsavedChanges(isDirty)

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  )

  useEffect(() => {
    if (page > pages) setPage(pages)
  }, [page, pages])

  useEffect(() => {
    if (!form.image) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(form.image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [form.image])

  function edit(item) {
    setForm({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      price: String(item.price ?? ''),
      duration: String(item.duration ?? ''),
      category_id: String(item.category?.id ?? ''),
      image: null,
    })
    setPreview(item.image || '')
    setTouched({})
  }

  function touch(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (formInvalid) {
      setTouched({
        title: true,
        price: true,
        duration: true,
        category_id: true,
      })
      setError('Please fix validation errors before submitting')
      return
    }
    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      duration: form.duration,
      category_id: form.category_id,
      image: form.image || undefined,
    }
    setSubmitting(true)
    try {
      if (form.id) await updateCourse(form.id, payload)
      else await createCourse(payload)
      setForm(initialForm)
      setPreview('')
      setTouched({})
      toast.success(form.id ? 'Course updated' : 'Course created')
      await refresh()
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to save course')
      toast.error(e?.response?.data?.error?.message || 'Failed to save course')
    } finally {
      setSubmitting(false)
    }
  }
  useSaveShortcut(() => {
    if (!formInvalid && !submitting) {
      submit({ preventDefault() {} })
    }
  }, true)

  async function remove(id) {
    if (!window.confirm('Delete this course?')) return
    const snapshot = items
    setItems((prev) => prev.filter((p) => p.id !== id))
    try {
      await deleteCourse(id)
      toast.success('Course deleted')
    } catch (e) {
      setItems(snapshot)
      setError(e?.response?.data?.error?.message || 'Failed to delete course')
      toast.error(e?.response?.data?.error?.message || 'Failed to delete course')
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Manage Courses</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">
          Create, update, and review courses connected to the public catalog and student registration flow.
        </p>
      </div>
      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_auto]">
        <input
          placeholder="Search courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
        />
        <p className="self-center text-sm text-slate-400">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
        </p>
      </div>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          {form.id ? 'Edit Course' : 'Create Course'}
        </p>
        <input placeholder="Title" value={form.title} onBlur={() => touch('title')} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        {touched.title && titleError ? <p className="text-xs text-rose-200">{titleError}</p> : null}
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
        <div className="grid gap-3 sm:grid-cols-3">
          <input placeholder="Price" value={form.price} onBlur={() => touch('price')} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <input placeholder="Duration" value={form.duration} onBlur={() => touch('duration')} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
          <input placeholder="Category ID" value={form.category_id} onBlur={() => touch('category_id')} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} />
        </div>
        {touched.price && priceError ? <p className="text-xs text-rose-200">{priceError}</p> : null}
        {touched.duration && durationError ? <p className="text-xs text-rose-200">{durationError}</p> : null}
        {touched.category_id && categoryError ? <p className="text-xs text-rose-200">{categoryError}</p> : null}
        <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
        {preview ? <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-cover" /> : null}
        <div className="flex gap-2">
          <button type="submit" disabled={formInvalid || submitting}>{submitting ? 'Saving...' : form.id ? 'Update' : 'Create'} Course</button>
          {form.id ? (
            <button type="button" onClick={() => { setForm(initialForm); setPreview(''); setTouched({}) }} className="border border-white/20 bg-transparent px-3 py-2 rounded-md text-slate-200">Cancel</button>
          ) : null}
        </div>
      </form>

      {error ? <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      {loading ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">Loading courses...</p>
      ) : (
        <>
          <ul className="space-y-2">
            {paginated.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium text-cyan-200">{item.title}</p>
                  <p className="text-sm text-slate-300">${item.price}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => edit(item)}>Edit</button>
                  <button type="button" onClick={() => remove(item.id)} className="border border-rose-300/40 bg-rose-500/20 px-3 py-2 rounded-md text-rose-100">Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm text-slate-400">
              Page {page} of {pages}
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <button type="button" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
