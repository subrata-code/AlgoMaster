import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Loader } from '@/components/EmptyState'
import { ROUTES } from '@/constants'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage'))
const Journey100Page = lazy(() => import('@/pages/Journey100Page'))
const ProblemsPage = lazy(() => import('@/pages/ProblemsPage'))
const ProblemDetailsPage = lazy(() => import('@/pages/ProblemDetailsPage'))
const TopicsPage = lazy(() => import('@/pages/TopicsPage'))
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProblemsPage = lazy(() => import('@/pages/admin/AdminProblemsPage'))
const CreateProblemPage = lazy(() => import('@/pages/admin/CreateProblemPage'))
const EditProblemPage = lazy(() => import('@/pages/admin/EditProblemPage'))

function PageFallback() {
  return <Loader label="Loading page..." />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.ROADMAP} element={<RoadmapPage />} />
          <Route path={ROUTES.JOURNEY_100} element={<Journey100Page />} />
          <Route path={ROUTES.PROBLEMS} element={<ProblemsPage />} />
          <Route path="/problems/:id" element={<ProblemDetailsPage />} />
          <Route path={ROUTES.TOPICS} element={<TopicsPage />} />
          <Route path={ROUTES.COMPANIES} element={<CompaniesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="problems" element={<AdminProblemsPage />} />
          <Route path="problems/create" element={<CreateProblemPage />} />
          <Route path="problems/:id/edit" element={<EditProblemPage />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
