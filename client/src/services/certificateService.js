import api from './api'

export async function verifyCertificate(params) {
  const { data } = await api.get('/api/certificates/verify', { params })
  return data.certificates || []
}
