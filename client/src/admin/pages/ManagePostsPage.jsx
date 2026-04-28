import { useEffect, useMemo, useState } from 'react'
import {
  createPost,
  deletePost,
  listPosts,
  updatePost,
} from '../../services/admin/postAdminService'
import { useToast } from '../components/ToastProvider'
import {
  useSaveShortcut,
  useUnsavedChanges,
} from '../components/useUnsavedChanges'

const initialForm = {
  id: null,
  title: '',
  content: '',
  image: null,
}

export default function ManagePostsPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({})
  const pageSize = 8
  const toast = useToast()

  async function refresh() {
    const data = await listPosts()
    setItems(data)
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.response?.data?.error?.message || 'Failed to load posts'))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => String(item.title || '').toLowerCase().includes(q))
  }, [items, query])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const titleError = !form.title.trim() ? 'Title is required' : ''
  const contentError = !form.content.trim() ? 'Content is required' : ''
  const formInvalid = Boolean(titleError || contentError)
  const isDirty = Boolean(form.title || form.content || form.image) || Boolean(form.id)
  useUnsavedChanges(isDirty)

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  )

  useEffect(() => {
    if (page > pages) setPage(pages)
  }, [page, pages])

  useEffect(() => {
    if (!form.image) return
    const url = URL.createObjectURL(form.image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [form.image])

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (formInvalid) {
      setTouched({ title: true, content: true })
      setError('Please fix validation errors before submitting')
      return
    }
    const payload = { title: form.title, content: form.content, image: form.image || undefined }
    setSubmitting(true)
    try {
      if (form.id) await updatePost(form.id, payload)
      else await createPost(payload)
      setForm(initialForm)
      setPreview('')
      setTouched({})
      toast.success(form.id ? 'Post updated' : 'Post created')
      await refresh()
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to save post')
      toast.error(e?.response?.data?.error?.message || 'Failed to save post')
    } finally {
      setSubmitting(false)
    }
  }
  useSaveShortcut(() => {
    if (!formInvalid && !submitting) {
      submit({ preventDefault() {} })
    }
  }, true)

  function edit(item) {
    setForm({ id: item.id, title: item.title || '', content: item.content || '', image: null })
    setPreview(item.image || '')
    setTouched({})
  }

  function touch(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function remove(id) {
    if (!window.confirm('Delete this post?')) return
    const snapshot = items
    setItems((prev) => prev.filter((p) => p.id !== id))
    try {
      await deletePost(id)
      toast.success('Post deleted')
    } catch (e) {
      setItems(snapshot)
      setError(e?.response?.data?.error?.message || 'Failed to delete post')
      toast.error(e?.response?.data?.error?.message || 'Failed to delete post')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Manage Posts</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          placeholder="Search posts..."
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
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <input placeholder="Title" value={form.title} onBlur={() => touch('title')} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        {touched.title && titleError ? <p className="text-xs text-rose-200">{titleError}</p> : null}
        <textarea placeholder="Rich content (HTML supported)" rows={6} value={form.content} onBlur={() => touch('content')} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
        {touched.content && contentError ? <p className="text-xs text-rose-200">{contentError}</p> : null}
        <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
        {preview ? <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-cover" /> : null}
        <div className="flex gap-2">
          <button type="submit" disabled={formInvalid || submitting}>{submitting ? 'Saving...' : form.id ? 'Update' : 'Create'} Post</button>
          {form.id ? <button type="button" onClick={() => { setForm(initialForm); setPreview(''); setTouched({}) }} className="border border-white/20 bg-transparent px-3 py-2 rounded-md text-slate-200">Cancel</button> : null}
        </div>
      </form>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-sm text-slate-400">Live Preview</p>
        <h3 className="text-lg font-semibold text-cyan-200">{form.title || 'Post title preview'}</h3>
        <div className="prose prose-invert mt-2 max-w-none" dangerouslySetInnerHTML={{ __html: form.content || '<p>Content preview...</p>' }} />
      </div>

      {error ? <p className="text-rose-200">{error}</p> : null}

      <ul className="space-y-2">
        {paginated.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div>
              <p className="font-medium text-cyan-200">{item.title}</p>
              <p className="text-sm text-slate-400">{item.author?.email || 'Unknown author'}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => edit(item)}>Edit</button>
              <button type="button" onClick={() => remove(item.id)} className="border border-rose-300/40 bg-rose-500/20 px-3 py-2 rounded-md text-rose-100">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-2">
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
    </section>
  )
}
