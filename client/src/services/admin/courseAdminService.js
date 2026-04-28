import api from '../api'

function toFormData(payload) {
  const fd = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    fd.append(k, v)
  })
  return fd
}

export async function listCourses() {
  const { data } = await api.get('/api/courses')
  return data.courses || []
}

export async function createCourse() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function updateCourse() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function deleteCourse() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}
