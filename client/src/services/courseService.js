import { localCourses } from '../data/courseCatalog'

export async function getCourses(params = {}) {
  const category = String(params?.category || '').trim().toLowerCase()
  const query = String(params?.q || '').trim().toLowerCase()
  const rows = localCourses.filter((course) => {
    const categoryOk = category
      ? String(course.category?.name || '').toLowerCase() === category
      : true
    const queryOk = query
      ? `${course.title} ${course.description} ${course.category?.name || ''} ${(course.tags || []).join(' ')}`
          .toLowerCase()
          .includes(query)
      : true
    return categoryOk && queryOk
  })
  return rows
}

export async function getCourseById(id) {
  return localCourses.find((course) => String(course.id) === String(id)) || null
}
