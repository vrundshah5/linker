import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, Lock, ArrowLeftRight } from 'lucide-react'
import BellButton from './BellButton'
import WorkspaceSwitchSplash from './WorkspaceSwitchSplash'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useSwitchWorkspace } from '../../hooks/useProfile'
import type { NotificationContext } from '../../services/notificationService'

export default function GlobalTopNav() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { mutate: switchWorkspace, isPending: isSwitching, switchTarget } = useSwitchWorkspace()
  const hasMultipleWorkspaces = user.workspaces.length > 1

  const isAdmin = location.pathname.startsWith('/admin')
  const isProfessional = !isAdmin && (
    location.pathname.startsWith('/professional') ||
    location.pathname.startsWith('/projects')
  )

  const badge = isAdmin ? 'Admin' : isProfessional ? 'Professional' : 'Personal'
  const accentClass = isAdmin ? 'text-danger' : 'text-primary'
  const accentBg = isAdmin ? 'bg-danger/10' : 'bg-primary/10'
  const badgeBg = isAdmin
    ? 'bg-danger/10 text-danger'
    : isProfessional
    ? 'bg-primary/10 text-primary'
    : 'bg-muted text-muted-foreground'
  const profilePath = isAdmin
    ? '/admin/profile'
    : isProfessional
    ? '/professional-profile'
    : '/profile'
  const notifContext: NotificationContext | undefined = isProfessional
    ? 'professional'
    : isAdmin
    ? undefined
    : 'personal'

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
    <div className="flex items-center justify-end gap-3 px-8 py-3.5 border-b border-border bg-background shrink-0">
      {/* Switch workspace button */}
      {hasMultipleWorkspaces && !isAdmin && (
        <button
          type="button"
          onClick={() => switchWorkspace(isProfessional ? 'personal' : 'professional')}
          className="size-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0"
          aria-label="Switch workspace"
        >
          <ArrowLeftRight className="size-[18px]" />
        </button>
      )}
      <BellButton context={notifContext} />

      {/* User avatar + dropdown */}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`size-9 rounded-full ${accentBg} flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-border transition-all`}
          aria-label="User menu"
        >
          <span className={`text-xs font-bold ${accentClass}`}>{user.initials}</span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
            {/* User info header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <div className={`size-10 rounded-full ${accentBg} flex items-center justify-center shrink-0`}>
                <span className={`text-sm font-bold ${accentClass}`}>{user.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg} uppercase tracking-wider mt-1`}>
                  {badge}
                </span>
              </div>
            </div>

            {/* View Profile */}
            <button
              type="button"
              onClick={() => { setOpen(false); navigate(profilePath) }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <div className={`size-7 rounded-lg ${accentBg} flex items-center justify-center shrink-0`}>
                <User className={`size-3.5 ${accentClass}`} />
              </div>
              View Profile
            </button>

            <div className="border-t border-border" />

            {/* Change Password */}
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/change-password') }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <div className={`size-7 rounded-lg ${accentBg} flex items-center justify-center shrink-0`}>
                <Lock className={`size-3.5 ${accentClass}`} />
              </div>
              Change Password
            </button>

            <div className="border-t border-border" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/login')
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-danger hover:bg-danger/5 transition-colors cursor-pointer"
            >
              <div className="size-7 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                <LogOut className="size-3.5 text-danger" />
              </div>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
    {isSwitching && switchTarget && <WorkspaceSwitchSplash targetWorkspace={switchTarget} />}
    </>
  )
}
