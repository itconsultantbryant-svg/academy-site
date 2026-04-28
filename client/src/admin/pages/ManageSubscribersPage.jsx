import { useEffect, useState } from 'react'
import { listSubscribers } from '../../services/admin/subscriberAdminService'

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
  const w = window.open('', '_blank', 'width=1000,height=700')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}

export default function ManageSubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await listSubscribers()
        if (active) {
          setSubscribers(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (e) {
        if (active) {
          setError(e?.response?.data?.error?.message || 'Failed to load subscribers')
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

  if (loading) return <p>Loading subscribers...</p>
  if (error) return <p className="text-rose-200">{error}</p>
  const grouped = groupByDay(subscribers)

  function exportExcel() {
    if (!subscribers.length) return
    const headers = ['Date', 'Name', 'Email', 'Subscribed At']
    const rows = subscribers.map((item) => [
      item.created_at ? formatDay(item.created_at) : 'Unknown date',
      item.name,
      item.email,
      item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    ])
    downloadExcelLike(headers, rows, `subscribers-${new Date().toISOString().slice(0, 10)}.xls`)
  }

  function exportPdf() {
    if (!subscribers.length) return
    const headers = ['Date', 'Name', 'Email', 'Subscribed At']
    const rows = subscribers.map((item) => [
      item.created_at ? formatDay(item.created_at) : 'Unknown date',
      item.name,
      item.email,
      item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    ])
    printAsPdf('Subscribers Report', headers, rows)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Subscribers</h2>
        <div className="flex gap-2">
          <button type="button" onClick={exportPdf} disabled={!subscribers.length} className="btn-outline disabled:opacity-50">
            Export PDF
          </button>
          <button type="button" onClick={exportExcel} disabled={!subscribers.length} className="btn-outline disabled:opacity-50">
            Export Excel
          </button>
        </div>
      </div>
      {subscribers.length === 0 ? (
        <p className="text-slate-300">No subscribers yet.</p>
      ) : (
        grouped.map((group) => (
          <article key={group.key} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              {group.label} ({group.items.length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[620px] text-left text-sm text-slate-200">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.email}</td>
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
