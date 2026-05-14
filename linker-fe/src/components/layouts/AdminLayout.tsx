import { type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Users,
  FolderOpen,
  FileBarChart2,
  Settings,
  ChevronDown,
} from 'lucide-react'
import UserMenuPopover from '../ui/UserMenuPopover'

const NAV_ITEMS = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: Users, end: true },
  { to: '/admin/categories', label: 'Global Categories', icon: FolderOpen, end: true },
  { to: '/admin/reports', label: 'System Reports', icon: FileBarChart2, end: true },
  { to: '/admin/settings', label: 'Platform Settings', icon: Settings, end: true },
]

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col">

        {/* Logo */}
        <div className="flex items-start gap-3 px-5 pt-7 pb-6">
          <div className="size-9 bg-danger/15 text-danger rounded-xl flex items-center justify-center shrink-0">
            <Shield className="size-[18px]" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold text-lg text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Linker
            </span>
            <span className="text-[10px] font-bold text-danger tracking-widest uppercase">
              Super Admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="px-3 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Administration
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
                      ? 'bg-danger/10 text-danger'
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
        <div className="p-3 border-t border-border">
          <UserMenuPopover accentClass="text-danger" accentBg="bg-danger/10">
            {(open) => (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                <div className="size-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-danger">AR</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate leading-tight">Admin Root</p>
                  <p className="text-xs text-muted-foreground">System Owner</p>
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
