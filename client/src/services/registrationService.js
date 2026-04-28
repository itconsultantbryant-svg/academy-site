import api from './api'

export async function submitRegistration(payload) {
  const { data } = await api.post('/api/registrations', payload)
  return data
}
