import api from './api'
import { getLocalPostById, localBlogPosts } from '../data/localBlogPosts'

export async function getPosts() {
  return localBlogPosts
}

export async function getPostById(id) {
  const localPost = getLocalPostById(id)
  if (localPost) return localPost
  try {
    const { data } = await api.get(`/api/posts/${id}`)
    return data.post || null
  } catch {
    return null
  }
}
