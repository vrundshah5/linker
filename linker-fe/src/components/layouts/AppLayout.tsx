import { type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Link,
  LayoutDashboard,
  MessageSquare,
  Users,
  Archive,
  ChevronDown,
  Folder,
  LayoutGrid,
} from 'lucide-react'
import UserMenuPopover from '../ui/UserMenuPopover'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useSwitchWorkspace } from '../../hooks/useProfile'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/categories', label: 'Categories', icon: Folder, end: false },
  { to: '/collection', label: 'Collection', icon: LayoutGrid, end: true },
  { to: '/messages', label: 'Messages', icon: MessageSquare, end: true },
  { to: '/requests', label: 'Requests', icon: Users, end: true },
  { to: '/archived', label: 'Archived Links', icon: Archive, end: true },
]

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const user = useCurrentUser()
  const { mutate: switchWorkspace } = useSwitchWorkspace()

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-7 pb-6 shrink-0">
          <div className="size-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shrink-0">
            <Link className="size-[18px]" />
          </div>
          <span
            className="font-bold text-xl text-foreground"
            style={{ fontFamily: 'var(--font-headings)' }}
          >
            Linker
          </span>
        </div>

        {/* Nav */}
        <div className="px-3 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
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
                <Icon className="size-[18px] shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3 border-t border-border shrink-0">
          <UserMenuPopover
            accentClass="text-primary"
            accentBg="bg-primary/10"
            switchTo={user.hasProfessionalWorkspace ? { label: 'Switch to Professional', path: '/professional-dashboard', onSwitch: () => switchWorkspace('professional') } : undefined}
          >
            {(open) => (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{user.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Personal</p>
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
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

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  )
}
