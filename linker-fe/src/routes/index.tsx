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
const CreateCategory = lazy(() => import('../pages/CreateCategory'))
const CategoryDetail = lazy(() => import('../pages/CategoryDetail'))
const Requests = lazy(() => import('../pages/Requests'))

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
  { path: '/categories', element: <Navigate to="/dashboard" replace /> },
  { path: '/categories/new', element: <CreateCategory /> },
  { path: '/categories/:id', element: <CategoryDetail /> },
  { path: '/requests', element: <Requests /> },

  // Fallback
  { path: '*', element: <Navigate to="/login" replace /> },
]
