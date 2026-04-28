import api from './api'

export async function getSectionContent(section) {
  const { data } = await api.get(`/api/content/${section}`)
  return data
}
