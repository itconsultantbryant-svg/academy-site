import { useEffect, useMemo, useState } from 'react'
import {
  getSection,
  saveSection,
  uploadSectionImage,
} from '../../services/admin/contentAdminService'
import { useToast } from '../components/ToastProvider'
import {
  useSaveShortcut,
  useUnsavedChanges,
} from '../components/useUnsavedChanges'

const sectionOptions = [
  'hero',
  'about',
  'footer',
  'navbar',
  'homepage-blocks',
  'stats',
  'categories',
  'courses',
  'why-choose-us',
  'blog-preview',
]

export default function ManageContentPage() {
  const [section, setSection] = useState('hero')
  const [jsonText, setJsonText] = useState('{}')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [initialJsonText, setInitialJsonText] = useState('{}')
  const [savingJson, setSavingJson] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const toast = useToast()

  async function load(sectionName) {
    setError('')
    setStatus('')
    try {
      const data = await getSection(sectionName)
      const text = JSON.stringify(data.content || {}, null, 2)
      setJsonText(text)
      setInitialJsonText(text)
      const img = data.content?.media?.image || ''
      setPreview(img)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to load section')
    }
  }

  useEffect(() => {
    load(section)
  }, [section])

  useEffect(() => {
    if (!image) return
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const parsed = useMemo(() => {
    try {
      return { ok: true, value: JSON.parse(jsonText || '{}') }
    } catch (e) {
      return { ok: false, message: e.message }
    }
  }, [jsonText])
  const isDirty = Boolean(image) || jsonText !== initialJsonText
  useUnsavedChanges(isDirty)

  async function submitJson(event) {
    event.preventDefault()
    setError('')
    setStatus('')
    if (!parsed.ok) {
      setError('JSON is invalid')
      return
    }
    try {
      setSavingJson(true)
      await saveSection(section, parsed.value)
      setStatus('Section saved')
      toast.success('Section saved')
      await load(section)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to save section')
      toast.error(e?.response?.data?.error?.message || 'Failed to save section')
    } finally {
      setSavingJson(false)
    }
  }
  useSaveShortcut(() => {
    if (parsed.ok && !savingJson) {
      submitJson({ preventDefault() {} })
    }
  }, true)

  async function submitImage(event) {
    event.preventDefault()
    if (!image) return
    setError('')
    setStatus('')
    try {
      setUploadingImage(true)
      await uploadSectionImage(section, image)
      setStatus('Image uploaded')
      toast.success('Section image uploaded')
      setImage(null)
      await load(section)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to upload image')
      toast.error(e?.response?.data?.error?.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Manage Content (CMS)</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">
          Edit structured CMS sections and media used by homepage, navbar, footer, and other content blocks.
        </p>
      </div>

      <label className="grid gap-1 rounded-xl border border-white/10 bg-white/5 p-4">
        <span className="text-sm text-slate-300">Section</span>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          {sectionOptions.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </label>

      <form onSubmit={submitJson} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <p className="text-sm text-slate-400">JSON Content</p>
        <textarea rows={14} value={jsonText} onChange={(e) => setJsonText(e.target.value)} className="font-mono text-sm" />
        {!parsed.ok ? <p className="text-rose-200">{parsed.message}</p> : null}
        <button type="submit" disabled={!parsed.ok || savingJson}>
          {savingJson ? 'Saving...' : 'Save Section JSON'}
        </button>
      </form>

      <form onSubmit={submitImage} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <p className="text-sm text-slate-400">Hero/Section Image Upload</p>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        {preview ? <img src={preview} alt="Section preview" className="max-h-40 rounded-lg object-cover" /> : null}
        <button type="submit" disabled={!image || uploadingImage}>
          {uploadingImage ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {status ? <p className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{status}</p> : null}
      {error ? <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
    </section>
  )
}
