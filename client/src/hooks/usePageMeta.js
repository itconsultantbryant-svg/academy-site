import { useEffect } from 'react'

const DEFAULT_TITLE = 'Prinstine Academy'
const DEFAULT_DESCRIPTION =
  'Prinstine Academy offers practical courses, blogs, and certificate verification for modern learners.'
const SITE_URL = 'https://prinstineacademy.org'

function upsertMeta(name, content, attribute = 'name') {
  if (!content) return
  const selector = `meta[${attribute}="${name}"]`
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (!href) return
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export default function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/favicon.svg',
  noindex = false,
} = {}) {
  useEffect(() => {
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`
    const pageUrl = `${SITE_URL}${window.location.pathname}`
    const nextTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
    document.title = nextTitle

    upsertCanonical(pageUrl)
    upsertMeta('description', description)
    upsertMeta('og:title', nextTitle, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:type', 'website', 'property')
    upsertMeta('og:url', pageUrl, 'property')
    upsertMeta('og:image', absoluteImage, 'property')
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', nextTitle)
    upsertMeta('twitter:description', description)
    upsertMeta('twitter:image', absoluteImage)
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, image, noindex])
}
