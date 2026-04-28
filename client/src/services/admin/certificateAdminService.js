import api from '../api'

export async function createCertificate() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function verifyCertificates(params) {
  const { data } = await api.get('/api/certificates/verify', { params })
  return data.certificates || []
}
