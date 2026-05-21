import { type ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Briefcase,
  MessageSquare,
  Users,
  Settings,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react'
import UserMenuPopover from '../ui/UserMenuPopover'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useProfile } from '../../hooks/useProfile'
import { getAvatarById } from '../ui/AvatarPicker'

const PROJECT_NAV = [
  { to: '/projects/acme-corp-redesign/resources', label: 'Resources', icon: Briefcase, end: true },
  { to: '/projects/acme-corp-redesign/chat', label: 'Project Chat', icon: MessageSquare, end: true },
  { to: '/projects/acme-corp-redesign/members', label: 'Team Members', icon: Users, end: true },
  { to: '/projects/acme-corp-redesign/settings', label: 'Project Settings', icon: Settings, end: true },
]

interface ProjectLayoutProps {
  children: ReactNode
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const user = useCurrentUser()
  const { data: profile } = useProfile()
  const avatarNode = profile?.avatar ? getAvatarById(profile.avatar)?.node : null
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col">

        {/* Back link */}
        <div className="px-5 pt-5 pb-3">
          <Link
            to="/professional-dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            All Projects
          </Link>
        </div>

        {/* Project identity */}
        <div className="flex items-center gap-3 px-5 py-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Briefcase className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight truncate">
              Acme Corp Redesign
            </p>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">
              Professional Workspace
            </p>
          </div>
        </div>

        {/* Project nav */}
        <div className="px-3 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Project
          </p>
          <nav className="flex flex-col gap-0.5">
            {PROJECT_NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="size-[17px] shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3 border-t border-border">
          <UserMenuPopover accentClass="text-primary" accentBg="bg-primary/10">
            {(open) => (
              <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                  {avatarNode
                    ? <div className="w-full h-full">{avatarNode}</div>
                    : <span className="text-xs font-bold text-primary">{user.initials}</span>
                  }
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-primary border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate leading-tight">Acme Corp</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{user.name}</p>
                </div>
                {open
                  ? <ChevronDown className="size-4 text-muted-foreground shrink-0 rotate-180 transition-transform" />
                  : <ChevronDown className="size-4 text-muted-foreground shrink-0 transition-transform" />
                }
              </div>
            )}
          </UserMenuPopover>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  )
}
