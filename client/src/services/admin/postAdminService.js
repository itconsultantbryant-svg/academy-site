import api from '../api'

function toFormData(payload) {
  const fd = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    fd.append(k, v)
  })
  return fd
}

export async function listPosts() {
  const { data } = await api.get('/api/posts')
  return data.posts || []
}

export async function createPost() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function updatePost() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}

export async function deletePost() {
  throw new Error('Admin is in analysis/view mode only. Editing is disabled.')
}
