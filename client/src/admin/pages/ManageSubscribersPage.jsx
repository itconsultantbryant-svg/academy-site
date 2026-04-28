import { useEffect, useState } from 'react'
import { listSubscribers } from '../../services/admin/subscriberAdminService'

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

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Subscribers</h2>
      {subscribers.length === 0 ? (
        <p className="text-slate-300">No subscribers yet.</p>
      ) : (
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
              {subscribers.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : 'N/A'}
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
