export const adminRoutes = [
  { path: '', to: '/admin', label: 'Overview', end: true, pageKey: 'overview' },
  { path: 'courses', to: '/admin/courses', label: 'Manage Courses', pageKey: 'courses' },
  { path: 'posts', to: '/admin/posts', label: 'Manage Posts', pageKey: 'posts' },
  { path: 'content', to: '/admin/content', label: 'Manage Content', pageKey: 'content' },
  {
    path: 'certificates',
    to: '/admin/certificates',
    label: 'Manage Certificates',
    pageKey: 'certificates',
  },
  { path: 'subscribers', to: '/admin/subscribers', label: 'Subscribers', pageKey: 'subscribers' },
  {
    path: 'registrations',
    to: '/admin/registrations',
    label: 'Registrations',
    pageKey: 'registrations',
  },
]

