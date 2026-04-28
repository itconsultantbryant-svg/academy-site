import api from '../api'

export async function listRegistrations() {
  const { data } = await api.get('/api/admin/registrations')
  return data
}
