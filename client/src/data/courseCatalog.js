import { findAssetUrl } from './assetLibrary'

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function makeCourse(title, category, tags, imageHint, index) {
  const fallbackImage = findAssetUrl('logo')
  return {
    id: `${slug(title)}-${index + 1}`,
    title,
    description: `${title} is a practical, job-focused program designed to build real capabilities through guided learning and hands-on activities.`,
    category: { name: category },
    tags,
    duration: '8 - 12 weeks',
    price: 100,
    image: findAssetUrl(imageHint || title, fallbackImage),
  }
}

const PRICE_LIST = [
  ['AI Essentials', 150],
  ['Advanced Data Analytics with SQL', 350],
  ['Data Analysis', 175],
  ['Cybersecurity', 350],
  ['Advanced Computer', 150],
  ['Introduction to Computer', 100],
  ['No Code Development', 150],
  ['Programming', 200],
  ['AI Essentials', 100],
  ['Data Analysis', 175],
  ['Project Proposal and Grant Writing', 100],
  ['Marketing and Public Relations', 100],
  ['Applied Business Statistics', 150],
  ['Taxation', 150],
  ['Insurance Accounting', 125],
  ['SAP Functional Module', 250],
  ['QuickBooks', 125],
  ['Odoo', 250],
  ['Zoho Books', 250],
  ['Sage Accounting', 250],
  ['Internal Audit and Control', 100],
  ['Banking and Cash Management', 100],
  ['Investment Banking', 100],
  ['Credit Analysis', 100],
  ['Financial Management', 100],
  ['Procurement and Logistics Management', 100],
  ['Entrepreneurship & Business Development', 100],
  ['Project Management', 100],
  ['Human Resource Management', 100],
  ['Customer Service Management', 100],
  ['Communication & Team Management', 100],
  ['Office Management', 100],
  ['Leadership & Planning', 100],
  ['Organization Governance', 100],
  ['Solar Basics', 165],
  ['Solar Intermediate', 175],
  ['Advanced Solar', 225],
  ['Electrical Configuration ( House wiring )', 225],
]

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .replace(/\s*&\s*/g, ' and ')
    .trim()
}

function inferCategory(title) {
  const key = normalizeTitle(title)
  if (key.includes('solar') || key.includes('electrical')) return 'Energy & Technical Skills'
  if (key.includes('computer') || key.includes('programming') || key.includes('ai') || key.includes('data') || key.includes('cyber')) return 'Technology & Digital Skills'
  if (key.includes('accounting') || key.includes('bank') || key.includes('finance') || key.includes('tax') || key.includes('audit') || key.includes('credit') || key.includes('zoho') || key.includes('quickbooks') || key.includes('odoo') || key.includes('sap')) return 'Accounting & Finance'
  if (key.includes('human resource') || key.includes('customer service') || key.includes('office') || key.includes('leadership') || key.includes('organization') || key.includes('project') || key.includes('procurement') || key.includes('communication') || key.includes('entrepreneur')) return 'Business & Management'
  if (key.includes('marketing')) return 'Marketing & Communication'
  return 'General'
}

function inferTags(title) {
  const words = normalizeTitle(title).split(' ').filter(Boolean)
  return [...new Set(words)].slice(0, 4)
}

const RAW_COURSES = PRICE_LIST.map(([title, price]) => [
  title,
  inferCategory(title),
  inferTags(title),
  title,
  price,
])

export const localCourses = RAW_COURSES.map((item, index) =>
  {
    const course = makeCourse(item[0], item[1], item[2], item[3], index)
    course.price = item[4]
    return course
  }
)

export const courseCategories = [
  ...new Set(localCourses.map((course) => course.category?.name).filter(Boolean)),
]
