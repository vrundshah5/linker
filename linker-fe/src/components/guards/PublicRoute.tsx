import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export default function PublicRoute() {
  const token = localStorage.getItem('token')
  const user = useCurrentUser()

  if (!token) return <Outlet />

  if (user.workspaceType === 'professional') {
    return <Navigate to="/professional-dashboard" replace />
  }
  return <Navigate to="/dashboard" replace />
}
