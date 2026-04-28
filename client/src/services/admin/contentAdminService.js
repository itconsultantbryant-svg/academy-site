import api from '../api'

export async function getSection(section) {
  const { data } = await api.get(`/api/content/${section}`)
  return data
}

export async function saveSection() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function uploadSectionImage() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}
