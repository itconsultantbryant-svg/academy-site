import { useEffect, useMemo, useState } from 'react'
import { listRegistrations } from '../../services/admin/registrationAdminService'

function csvEscape(value) {
  const text = String(value ?? '')
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export default function ManageRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await listRegistrations()
        if (!active) return
        setRegistrations(Array.isArray(data?.registrations) ? data.registrations : [])
        setStats(Array.isArray(data?.stats) ? data.stats : [])
      } catch (e) {
        if (active) {
          setError(e?.response?.data?.error?.message || 'Failed to load registrations')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const maxCount = useMemo(
    () => stats.reduce((max, item) => Math.max(max, Number(item.count || 0)), 0),
    [stats]
  )

  function handleExportCsv() {
    if (!registrations.length) return
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Course',
      'Mode',
      'Highest Education',
      'Address',
      'Notes',
      'Registered At',
    ]
    const rows = registrations.map((item) => [
      item.full_name,
      item.email,
      item.phone,
      item.course_title,
      item.learning_mode,
      item.highest_education || '',
      item.address || '',
      item.notes || '',
      item.created_at ? new Date(item.created_at).toISOString() : '',
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `student-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p>Loading registrations...</p>
  if (error) return <p className="text-rose-200">{error}</p>

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Student Registrations</h2>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={!registrations.length}
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">
          Course Registration Analytics
        </h3>
        {stats.length === 0 ? (
          <p className="mt-3 text-slate-300">No registration analytics yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {stats.map((item) => {
              const count = Number(item.count || 0)
              const width = maxCount > 0 ? Math.max(6, Math.round((count / maxCount) * 100)) : 0
              return (
                <div key={item.courseTitle} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="line-clamp-1 text-slate-200">{item.courseTitle}</p>
                    <p className="font-semibold text-amber-300">{count}</p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {registrations.length === 0 ? (
        <p className="text-slate-300">No student registrations yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1080px] text-left text-sm text-slate-200">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Education</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item) => (
                <tr key={item.id} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3">{item.full_name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">{item.course_title}</td>
                  <td className="px-4 py-3">{item.learning_mode}</td>
                  <td className="px-4 py-3">{item.highest_education || '-'}</td>
                  <td className="px-4 py-3">{item.address || '-'}</td>
                  <td className="px-4 py-3">{item.notes || '-'}</td>
                  <td className="px-4 py-3">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
