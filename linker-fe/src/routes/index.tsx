import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Onboard = lazy(() => import('../pages/Onboard'))
const OnboardProfessional = lazy(() => import('../pages/OnboardProfessional'))
const OnboardPersonal = lazy(() => import('../pages/OnboardPersonal'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const CategoryDetail = lazy(() => import('../pages/CategoryDetail'))
const Requests = lazy(() => import('../pages/Requests'))
const Messages = lazy(() => import('../pages/Messages'))
const ArchivedLinks = lazy(() => import('../pages/ArchivedLinks'))
const ProfessionalDashboard = lazy(() => import('../pages/ProfessionalDashboard'))
const ProjectResources = lazy(() => import('../pages/ProjectResources'))
const ProjectChat = lazy(() => import('../pages/ProjectChat'))
const ProjectTeamMembers = lazy(() => import('../pages/ProjectTeamMembers'))
const ProjectSettings = lazy(() => import('../pages/ProjectSettings'))
const AdminOverview = lazy(() => import('../pages/AdminOverview'))
const AdminGlobalCategories = lazy(() => import('../pages/AdminGlobalCategories'))
const AdminManageUsers = lazy(() => import('../pages/AdminManageUsers'))
const AdminUserDetail = lazy(() => import('../pages/AdminUserDetail'))
const AdminSystemReports = lazy(() => import('../pages/AdminSystemReports'))
const AdminPlatformSettings = lazy(() => import('../pages/AdminPlatformSettings'))
const Profile = lazy(() => import('../pages/Profile'))
const Notifications = lazy(() => import('../pages/Notifications'))

export const routes: RouteObject[] = [
  // Auth
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },

  // Onboarding
  { path: '/onboard', element: <Onboard /> },
  { path: '/onboard/professional', element: <OnboardProfessional /> },
  { path: '/onboard/personal', element: <OnboardPersonal /> },

  // App
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/messages', element: <Messages /> },
  // /categories/new is removed — creation is handled via modal on the dashboard
  { path: '/categories', element: <Navigate to="/dashboard" replace /> },
  { path: '/categories/:id', element: <CategoryDetail /> },
  { path: '/requests', element: <Requests /> },
  { path: '/archived', element: <ArchivedLinks /> },
  { path: '/professional-dashboard', element: <ProfessionalDashboard /> },
  { path: '/projects/acme-corp-redesign/resources', element: <ProjectResources /> },
  { path: '/projects/acme-corp-redesign/chat', element: <ProjectChat /> },
  { path: '/projects/acme-corp-redesign/members', element: <ProjectTeamMembers /> },
  { path: '/projects/acme-corp-redesign/settings', element: <ProjectSettings /> },
  { path: '/admin/overview', element: <AdminOverview /> },
  { path: '/admin/categories', element: <AdminGlobalCategories /> },
  { path: '/admin/users', element: <AdminManageUsers /> },
  { path: '/admin/users/:id', element: <AdminUserDetail /> },
  { path: '/admin/reports', element: <AdminSystemReports /> },
  { path: '/admin/settings', element: <AdminPlatformSettings /> },
  { path: '/profile', element: <Profile /> },
  { path: '/notifications', element: <Notifications /> },

  // Fallback
  { path: '*', element: <Navigate to="/login" replace /> },
]
