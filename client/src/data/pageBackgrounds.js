import { findAssetUrl } from './assetLibrary'

const DEFAULT_BACKGROUNDS = [
  findAssetUrl('slide-1'),
  findAssetUrl('slide-2'),
].filter(Boolean)

const ROUTE_BACKGROUNDS = {
  '/': [findAssetUrl('slide-1'), findAssetUrl('slide-3')],
  '/courses': [findAssetUrl('slide-2'), findAssetUrl('Data Analysis')],
  '/gallery': [findAssetUrl('slide-4'), findAssetUrl('slide-5')],
  '/our-facility': [findAssetUrl('Facility-1'), findAssetUrl('Facility-2')],
  '/contact': [findAssetUrl('slide-5'), findAssetUrl('Communication')],
  '/about': [findAssetUrl('slide-3'), findAssetUrl('Leadership')],
  '/faculty': [findAssetUrl('Leadership'), findAssetUrl('slide-4')],
}

export function getBackgroundsForPath(pathname) {
  const exact = ROUTE_BACKGROUNDS[pathname]
  if (Array.isArray(exact) && exact.filter(Boolean).length) {
    return exact.filter(Boolean)
  }
  if (pathname.startsWith('/courses/')) {
    return [findAssetUrl('Programming'), findAssetUrl('Project Management')].filter(Boolean)
  }
  if (pathname.startsWith('/blog')) {
    return [findAssetUrl('Marketing and Public Relations'), findAssetUrl('Public Speaking')].filter(Boolean)
  }
  if (pathname.startsWith('/admin')) {
    return [findAssetUrl('logo')].filter(Boolean)
  }
  return DEFAULT_BACKGROUNDS
}
