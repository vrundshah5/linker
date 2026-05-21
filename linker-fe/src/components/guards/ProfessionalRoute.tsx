import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'

/**
 * Allows access only when workspaceType === 'professional'.
 * Personal users are redirected to their dashboard.
 * Unonboarded users are sent to /onboard.
 */
export default function ProfessionalRoute() {
  const { workspaceType } = useCurrentUser()

  if (workspaceType === 'professional') return <Outlet />
  if (workspaceType === 'personal') return <Navigate to="/dashboard" replace />
  return <Navigate to="/onboard" replace />
}
