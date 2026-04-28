import { useEffect, useMemo, useState } from 'react'
import { listRegistrations } from '../../services/admin/registrationAdminService'

function csvEscape(value) {
  const text = String(value ?? '')
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function formatDay(value) {
  if (!value) return 'Unknown date'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Unknown date'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function groupByDay(rows) {
  const map = new Map()
  rows.forEach((item) => {
    const raw = item.created_at
    const key = raw ? new Date(raw).toISOString().slice(0, 10) : 'unknown'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  })
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({ key, label: key === 'unknown' ? 'Unknown date' : formatDay(key), items }))
}

function printAsPdf(title, headers, rows) {
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="border:1px solid #ddd;padding:8px;font-size:12px;">${String(cell ?? '')}</td>`)
          .join('')}</tr>`
    )
    .join('')
  const html = `<!doctype html><html><head><title>${title}</title></head><body>
    <h2 style="font-family:Arial, sans-serif;">${title}</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
      <thead><tr>${headers
        .map((h) => `<th style="border:1px solid #ddd;padding:8px;background:#f4f4f4;font-size:12px;">${h}</th>`)
        .join('')}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </body></html>`
  const w = window.open('', '_blank', 'width=1100,height=750')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}

function downloadExcelLike(headers, rows, filename) {
  const tsv = [headers, ...rows]
    .map((row) => row.map((cell) => String(cell ?? '').replace(/\t/g, ' ')).join('\t'))
    .join('\n')
  const blob = new Blob([`\uFEFF${tsv}`], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
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
  const grouped = useMemo(() => groupByDay(registrations), [registrations])

  function buildExportRows() {
    return registrations.map((item) => [
      item.created_at ? formatDay(item.created_at) : 'Unknown date',
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
  }

  function handleExportCsv() {
    if (!registrations.length) return
    const headers = [
      'Date',
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
    const rows = buildExportRows()
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

  function handleExportExcel() {
    if (!registrations.length) return
    const headers = [
      'Date',
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
    downloadExcelLike(
      headers,
      buildExportRows(),
      `student-registrations-${new Date().toISOString().slice(0, 10)}.xls`
    )
  }

  function handleExportPdf() {
    if (!registrations.length) return
    const headers = ['Date', 'Full Name', 'Email', 'Phone', 'Course', 'Mode', 'Registered At']
    const rows = registrations.map((item) => [
      item.created_at ? formatDay(item.created_at) : 'Unknown date',
      item.full_name,
      item.email,
      item.phone,
      item.course_title,
      item.learning_mode,
      item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    ])
    printAsPdf('Student Registrations Report', headers, rows)
  }

  if (loading) return <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">Loading registrations...</p>
  if (error) return <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Student Registrations</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!registrations.length}
            className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!registrations.length}
            className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!registrations.length}
            className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">
          Registration data feeds this dashboard in real time and is grouped by day for easier review and export.
        </p>
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
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">No student registrations yet.</p>
      ) : (
        grouped.map((group) => (
          <article key={group.key} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              {group.label} ({group.items.length})
            </h3>
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
                  {group.items.map((item) => (
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
          </article>
        ))
      )}
    </section>
  )
}
