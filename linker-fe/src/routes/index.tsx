import { lazy } from 'react'
import { type RouteObject } from 'react-router-dom'
import PrivateRoute from '../components/guards/PrivateRoute'
import PublicRoute from '../components/guards/PublicRoute'
import PersonalRoute from '../components/guards/PersonalRoute'
import ProfessionalRoute from '../components/guards/ProfessionalRoute'

const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Onboard = lazy(() => import('../pages/Onboard'))
const OnboardProfessional = lazy(() => import('../pages/OnboardProfessional'))
const OnboardPersonal = lazy(() => import('../pages/OnboardPersonal'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Categories = lazy(() => import('../pages/Categories'))
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
const AdminProfile = lazy(() => import('../pages/AdminProfile'))
const Profile = lazy(() => import('../pages/Profile'))
const ChangePassword = lazy(() => import('../pages/ChangePassword'))
const ProfessionalProfile = lazy(() => import('../pages/ProfessionalProfile'))
const Notifications = lazy(() => import('../pages/Notifications'))
const Collection = lazy(() => import('../pages/Collection'))
const Insights = lazy(() => import('../pages/Insights'))
const Design = lazy(() => import('../pages/Design'))
const PublicCollection = lazy(() => import('../pages/PublicCollection'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Unauthorized = lazy(() => import('../pages/Unauthorized'))

export const routes: RouteObject[] = [
  // Public auth routes — redirect to dashboard if already logged in
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
    ],
  },

  // Private routes — redirect to login if not authenticated
  {
    element: <PrivateRoute />,
    children: [
      // Onboarding — accessible regardless of workspace type
      { path: '/onboard', element: <Onboard /> },
      { path: '/onboard/professional', element: <OnboardProfessional /> },
      { path: '/onboard/personal', element: <OnboardPersonal /> },

      // Shared routes — accessible from both workspace types
      { path: '/profile', element: <Profile /> },
      { path: '/change-password', element: <ChangePassword /> },
      { path: '/notifications', element: <Notifications /> },

      // Admin routes
      { path: '/admin/overview', element: <AdminOverview /> },
      { path: '/admin/categories', element: <AdminGlobalCategories /> },
      { path: '/admin/users', element: <AdminManageUsers /> },
      { path: '/admin/users/:id', element: <AdminUserDetail /> },
      { path: '/admin/reports', element: <AdminSystemReports /> },
      { path: '/admin/settings', element: <AdminPlatformSettings /> },
      { path: '/admin/profile', element: <AdminProfile /> },

      // Personal workspace routes — blocked for professional users
      {
        element: <PersonalRoute />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/categories', element: <Categories /> },
          { path: '/categories/:id', element: <CategoryDetail /> },
          { path: '/messages', element: <Messages /> },
          { path: '/requests', element: <Requests /> },
          { path: '/archived', element: <ArchivedLinks /> },
          { path: '/collection', element: <Collection /> },
          { path: '/insights', element: <Insights /> },
          { path: '/design', element: <Design /> },
        ],
      },

      // Professional workspace routes — blocked for personal users
      {
        element: <ProfessionalRoute />,
        children: [
          { path: '/professional-dashboard', element: <ProfessionalDashboard /> },
          { path: '/professional-profile', element: <ProfessionalProfile /> },
          { path: '/projects/:projectId/resources', element: <ProjectResources /> },
          { path: '/projects/:projectId/chat', element: <ProjectChat /> },
          { path: '/projects/:projectId/members', element: <ProjectTeamMembers /> },
          { path: '/projects/:projectId/settings', element: <ProjectSettings /> },
        ],
      },
    ],
  },

  // Public (no auth required, no redirect)
  { path: '/c/:userId', element: <PublicCollection /> },
  { path: '/unauthorized', element: <Unauthorized /> },

  // 404 fallback
  { path: '*', element: <NotFound /> },
]
