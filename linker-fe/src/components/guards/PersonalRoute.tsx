import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'

/**
 * Allows access only when workspaceType === 'personal'.
 * Professional users are redirected to their dashboard.
 * Unonboarded users are sent to /onboard.
 */
export default function PersonalRoute() {
  const { workspaceType } = useCurrentUser()

  if (workspaceType === 'personal') return <Outlet />
  if (workspaceType === 'professional') return <Navigate to="/professional-dashboard" replace />
  return <Navigate to="/onboard" replace />
}
