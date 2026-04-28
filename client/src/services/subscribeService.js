import api from './api'

export async function subscribeUser(payload) {
  const { data } = await api.post('/api/subscribers', payload)
  return data
}
