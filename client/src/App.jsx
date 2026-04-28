import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import GlobalLayout from './components/GlobalLayout'
import { PageSkeleton } from './components/Skeletons'
import AdminLayout from './admin/AdminLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
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
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'))
const OnlineCoursesLinkPage = lazy(() => import('./pages/OnlineCoursesLinkPage'))
const HandbookPage = lazy(() => import('./pages/HandbookPage'))
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
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="/online-courses-link" element={<OnlineCoursesLinkPage />} />
              <Route path="/handbook" element={<HandbookPage />} />
              <Route path="/register" element={<StudentRegistrationPage />} />
              <Route
                path="/verify-certificate"
                element={<CertificateVerificationPage />}
              />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverviewPage />} />
                <Route path="courses" element={<ManageCoursesPage />} />
                <Route path="posts" element={<ManagePostsPage />} />
                <Route path="content" element={<ManageContentPage />} />
                <Route path="certificates" element={<ManageCertificatesPage />} />
                <Route path="subscribers" element={<ManageSubscribersPage />} />
                <Route path="registrations" element={<ManageRegistrationsPage />} />
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
