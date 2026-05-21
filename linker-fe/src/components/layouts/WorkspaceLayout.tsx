import { useState, useRef, useEffect, type ReactNode } from 'react'
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom'
import { Link, Briefcase, Users, Settings, ChevronDown, BookMarked, MessageSquare, ChevronUp } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import GlobalTopNav from '../ui/GlobalTopNav'
import { useProjects } from '../../hooks/useProjects'
import ProjectIcon from '../ui/ProjectIcon'

const PROJECT_NAV = [
  { suffix: 'resources', label: 'Resources', icon: BookMarked, end: true },
  { suffix: 'chat', label: 'Project Chat', icon: MessageSquare, end: true },
  { suffix: 'members', label: 'Team Members', icon: Users, end: true },
  { suffix: 'settings', label: 'Project Settings', icon: Settings, end: true },
]

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const user = useCurrentUser()
  const { data: projects } = useProjects()
  const { projectId: urlProjectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projectOpen, setProjectOpen] = useState(false)
  const projectRef = useRef<HTMLDivElement>(null)

  // URL takes priority, then manual selection, then first project
  const activeProjectId = urlProjectId ?? selectedProjectId ?? projects?.[0]?._id ?? null
  const activeProject = projects?.find((p) => p._id === activeProjectId) ?? projects?.[0]
  const isProjectOwner = activeProject?.ownerId?._id === user.id

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
          <div className="size-9 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
            <Link className="size-[18px]" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold text-lg text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Linker
            </span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
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
            <NavLink
              to="/professional-dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Briefcase className="size-[18px] shrink-0" />
              Projects
            </NavLink>
            {activeProject && PROJECT_NAV
              .filter(({ suffix }) => suffix !== 'settings' || isProjectOwner)
              .map(({ suffix, label, icon: Icon, end }) => (
              <NavLink
                key={suffix}
                to={`/projects/${activeProject._id}/${suffix}`}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
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
        {activeProject && (
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
              <div className={`size-6 rounded-lg flex items-center justify-center shrink-0`}>
                <ProjectIcon project={activeProject} size="xs" />
              </div>
              <span className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">{activeProject.name}</span>
              {(projects?.length ?? 0) > 1 && (
                projectOpen
                  ? <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Dropdown */}
            {projectOpen && (projects?.length ?? 0) > 1 && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {projects!.map((p) => {
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => {
                        setSelectedProjectId(p._id)
                        setProjectOpen(false)
                        // If currently on a project sub-page, navigate to the same sub-page for the new project
                        const projectPageMatch = location.pathname.match(/^\/projects\/[^/]+\/(.+)$/)
                        if (projectPageMatch) {
                          const subPage = projectPageMatch[1]
                          // If switching to a project where user is not owner, redirect away from settings
                          const isNewProjectOwner = p.ownerId?._id === user.id
                          if (subPage === 'settings' && !isNewProjectOwner) {
                            navigate(`/projects/${p._id}/resources`)
                          } else {
                            navigate(`/projects/${p._id}/${subPage}`)
                          }
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold transition-colors text-left ${
                        activeProject._id === p._id
                          ? `text-primary bg-muted`
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <ProjectIcon project={p} size="xs" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        )}

      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background flex flex-col">
        <GlobalTopNav />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
