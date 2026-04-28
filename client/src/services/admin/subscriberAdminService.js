import api from '../api'

export async function listSubscribers() {
  const { data } = await api.get('/api/admin/subscribers')
  return data
}
