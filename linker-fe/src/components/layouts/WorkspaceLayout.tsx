import { useState, useRef, useEffect, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Link, Briefcase, Users, Settings, ChevronDown, BookMarked, MessageSquare, ChevronUp } from 'lucide-react'
import UserMenuPopover from '../ui/UserMenuPopover'
import { useCurrentUser } from '../../hooks/useCurrentUser'

const NAV_ITEMS = [
  { to: '/professional-dashboard', label: 'Projects', icon: Briefcase, end: true },
  { to: '/projects/acme-corp-redesign/resources', label: 'Resources', icon: BookMarked, end: true },
  { to: '/projects/acme-corp-redesign/chat', label: 'Project Chat', icon: MessageSquare, end: true },
  { to: '/projects/acme-corp-redesign/members', label: 'Team Members', icon: Users, end: true },
  { to: '/projects/acme-corp-redesign/settings', label: 'Project Settings', icon: Settings, end: true },
]

const PROJECTS = [
  { id: 'acme-corp-redesign', name: 'Acme Corp Redesign', iconBg: 'bg-warning', textColor: 'text-warning' },
  { id: 'marketing-q4', name: 'Marketing Q4 Campaign', iconBg: 'bg-primary', textColor: 'text-primary' },
  { id: 'internal-wiki', name: 'Internal Wiki Migration', iconBg: 'bg-success', textColor: 'text-success' },
]

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const user = useCurrentUser()
  const [activeProject, setActiveProject] = useState(PROJECTS[0])
  const [projectOpen, setProjectOpen] = useState(false)
  const projectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="flex items-start gap-2.5 px-5 pt-7 pb-6">
          <div className="size-9 bg-warning text-white rounded-xl flex items-center justify-center shrink-0">
            <Link className="size-[18px]" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold text-lg text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Linker
            </span>
            <span className="text-[10px] font-bold text-warning tracking-widest uppercase">
              Professional
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="px-3 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Workspace
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
                      ? 'bg-warning/10 text-warning'
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

        {/* Project selector */}
        <div className="px-3 pb-2 border-t border-border pt-3" ref={projectRef}>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Active Project
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProjectOpen((v) => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className={`size-6 rounded-lg ${activeProject.iconBg} flex items-center justify-center shrink-0`}>
                <Briefcase className="size-3 text-white" />
              </div>
              <span className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">{activeProject.name}</span>
              {PROJECTS.length > 1 && (
                projectOpen
                  ? <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Dropdown */}
            {projectOpen && PROJECTS.length > 1 && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {PROJECTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setActiveProject(p); setProjectOpen(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold transition-colors text-left ${
                      activeProject.id === p.id
                        ? `${p.textColor} bg-muted`
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className={`size-5 rounded ${p.iconBg} flex items-center justify-center shrink-0`}>
                      <Briefcase className="size-2.5 text-white" />
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-t border-border">
          <UserMenuPopover
            accentClass="text-warning"
            accentBg="bg-warning/10"
            switchTo={{ label: 'Switch to Personal', path: '/dashboard' }}
          >
            {(open) => (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                <div className="size-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="text-xs font-bold text-warning">{user.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">Acme Corp</p>
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

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  )
}
