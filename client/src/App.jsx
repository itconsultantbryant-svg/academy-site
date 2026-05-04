import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import GlobalLayout from './components/GlobalLayout'
import PendingRegistrationSync from './components/PendingRegistrationSync'
import { PageSkeleton } from './components/Skeletons'
import AdminLayout from './admin/AdminLayout'
import { adminRoutes } from './admin/adminRoutes'
import HomePage from './pages/HomePage'

const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CertificateVerificationPage = lazy(() =>
  import('./pages/CertificateVerificationPage')
)
const BankDetailsPage = lazy(() => import('./pages/BankDetailsPage'))
const FacultyPage = lazy(() => import('./pages/FacultyPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const OurFacilityPage = lazy(() => import('./pages/OurFacilityPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'))
const OnlineCoursesLinkPage = lazy(() => import('./pages/OnlineCoursesLinkPage'))
const HandbookPage = lazy(() => import('./pages/HandbookPage'))
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const DashboardOverviewPage = lazy(() =>
  import('./admin/pages/DashboardOverviewPage')
)
const ManageCoursesPage = lazy(() => import('./admin/pages/ManageCoursesPage'))
const ManagePostsPage = lazy(() => import('./admin/pages/ManagePostsPage'))
const ManageContentPage = lazy(() => import('./admin/pages/ManageContentPage'))
const ManageCertificatesPage = lazy(() =>
  import('./admin/pages/ManageCertificatesPage')
)
const ManageSubscribersPage = lazy(() =>
  import('./admin/pages/ManageSubscribersPage')
)
const StudentRegistrationPage = lazy(() => import('./pages/StudentRegistrationPage'))
const ManageRegistrationsPage = lazy(() =>
  import('./admin/pages/ManageRegistrationsPage')
)

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <PendingRegistrationSync />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route element={<GlobalLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<ArticlePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/bank-details" element={<BankDetailsPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/instructors" element={<Navigate to="/faculty" replace />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/our-facility" element={<OurFacilityPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="/online-courses-link" element={<OnlineCoursesLinkPage />} />
              <Route path="/handbook" element={<HandbookPage />} />
              <Route path="/register" element={<StudentRegistrationPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route
                path="/verify-certificate"
                element={<CertificateVerificationPage />}
              />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverviewPage />} />
                {adminRoutes
                  .filter((route) => route.path)
                  .map((route) => {
                    if (route.pageKey === 'courses') {
                      return <Route key={route.path} path={route.path} element={<ManageCoursesPage />} />
                    }
                    if (route.pageKey === 'posts') {
                      return <Route key={route.path} path={route.path} element={<ManagePostsPage />} />
                    }
                    if (route.pageKey === 'content') {
                      return <Route key={route.path} path={route.path} element={<ManageContentPage />} />
                    }
                    if (route.pageKey === 'certificates') {
                      return (
                        <Route key={route.path} path={route.path} element={<ManageCertificatesPage />} />
                      )
                    }
                    if (route.pageKey === 'subscribers') {
                      return (
                        <Route key={route.path} path={route.path} element={<ManageSubscribersPage />} />
                      )
                    }
                    if (route.pageKey === 'registrations') {
                      return (
                        <Route key={route.path} path={route.path} element={<ManageRegistrationsPage />} />
                      )
                    }
                    return null
                  })}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}
