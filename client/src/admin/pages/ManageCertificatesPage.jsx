import { useState } from 'react'
import {
  createCertificate,
  verifyCertificates,
} from '../../services/admin/certificateAdminService'
import { useToast } from '../components/ToastProvider'
import {
  useSaveShortcut,
  useUnsavedChanges,
} from '../components/useUnsavedChanges'

const initial = {
  student_name: '',
  course_id: '',
  certificate_id: '',
  status: 'issued',
}

export default function ManageCertificatesPage() {
  const [form, setForm] = useState(initial)
  const [query, setQuery] = useState({ certificate_id: '', student_name: '' })
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [creating, setCreating] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [touchedCreate, setTouchedCreate] = useState({})
  const [touchedVerify, setTouchedVerify] = useState({})
  const toast = useToast()

  const createErrors = {
    student_name: !form.student_name.trim() ? 'Student name is required' : '',
    course_id:
      form.course_id === '' ||
      Number.isNaN(Number(form.course_id)) ||
      Number(form.course_id) < 1
        ? 'Course ID must be a positive integer'
        : '',
    certificate_id: !form.certificate_id.trim()
      ? 'Certificate ID is required'
      : '',
  }
  const createInvalid = Boolean(
    createErrors.student_name ||
      createErrors.course_id ||
      createErrors.certificate_id
  )
  const verifyInvalid =
    !query.certificate_id.trim() && !query.student_name.trim()
  const isDirty = Boolean(form.student_name || form.course_id || form.certificate_id)
  useUnsavedChanges(isDirty)

  async function submitCreate(event) {
    event.preventDefault()
    setError('')
    setStatus('')
    if (createInvalid) {
      setTouchedCreate({
        student_name: true,
        course_id: true,
        certificate_id: true,
      })
      setError('Please fix validation errors before creating certificate')
      return
    }
    try {
      setCreating(true)
      await createCertificate({
        student_name: form.student_name,
        course_id: Number(form.course_id),
        certificate_id: form.certificate_id,
        status: form.status,
      })
      setStatus('Certificate created')
      toast.success('Certificate created')
      setForm(initial)
      setTouchedCreate({})
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to create certificate')
      toast.error(
        e?.response?.data?.error?.message || 'Failed to create certificate'
      )
    } finally {
      setCreating(false)
    }
  }
  useSaveShortcut(() => {
    if (!createInvalid && !creating) {
      submitCreate({ preventDefault() {} })
    }
  }, true)

  async function submitVerify(event) {
    event.preventDefault()
    setError('')
    if (verifyInvalid) {
      setTouchedVerify({ certificate_id: true, student_name: true })
      setError('Provide certificate ID or student name to verify')
      return
    }
    try {
      setVerifying(true)
      const data = await verifyCertificates({
        certificate_id: query.certificate_id || undefined,
        student_name: query.student_name || undefined,
      })
      setResults(data)
      if (!data.length) toast.info('No certificates matched your query')
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'Failed to verify certificates')
      toast.error(
        e?.response?.data?.error?.message || 'Failed to verify certificates'
      )
    } finally {
      setVerifying(false)
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Manage Certificates</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">
          Create certificates and run verification checks linked to student course records.
        </p>
      </div>

      <form onSubmit={submitCreate} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <p className="text-sm text-slate-400">Create Certificate</p>
        <input placeholder="Student Name" value={form.student_name} onBlur={() => setTouchedCreate((t) => ({ ...t, student_name: true }))} onChange={(e) => setForm((f) => ({ ...f, student_name: e.target.value }))} required />
        {touchedCreate.student_name && createErrors.student_name ? <p className="text-xs text-rose-200">{createErrors.student_name}</p> : null}
        <input placeholder="Course ID" value={form.course_id} onBlur={() => setTouchedCreate((t) => ({ ...t, course_id: true }))} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))} required />
        {touchedCreate.course_id && createErrors.course_id ? <p className="text-xs text-rose-200">{createErrors.course_id}</p> : null}
        <input placeholder="Certificate ID" value={form.certificate_id} onBlur={() => setTouchedCreate((t) => ({ ...t, certificate_id: true }))} onChange={(e) => setForm((f) => ({ ...f, certificate_id: e.target.value }))} required />
        {touchedCreate.certificate_id && createErrors.certificate_id ? <p className="text-xs text-rose-200">{createErrors.certificate_id}</p> : null}
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
          <option value="pending">pending</option>
          <option value="issued">issued</option>
          <option value="revoked">revoked</option>
        </select>
        <button type="submit" disabled={createInvalid || creating}>
          {creating ? 'Creating...' : 'Create Certificate'}
        </button>
      </form>

      <form onSubmit={submitVerify} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <p className="text-sm text-slate-400">Verify Certificates</p>
        <input placeholder="Certificate ID" value={query.certificate_id} onBlur={() => setTouchedVerify((t) => ({ ...t, certificate_id: true }))} onChange={(e) => setQuery((q) => ({ ...q, certificate_id: e.target.value }))} />
        <input placeholder="Student Name" value={query.student_name} onBlur={() => setTouchedVerify((t) => ({ ...t, student_name: true }))} onChange={(e) => setQuery((q) => ({ ...q, student_name: e.target.value }))} />
        {verifyInvalid && (touchedVerify.certificate_id || touchedVerify.student_name) ? (
          <p className="text-xs text-rose-200">Provide certificate ID or student name</p>
        ) : null}
        <button type="submit" disabled={verifyInvalid || verifying}>
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {status ? <p className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{status}</p> : null}
      {error ? <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      {results.length ? (
        <ul className="space-y-2">
          {results.map((item, idx) => (
            <li key={`${item.student_name}-${item.course}-${idx}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong>{item.student_name}</strong> | {item.course} | {item.issue_date} | {item.status}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
