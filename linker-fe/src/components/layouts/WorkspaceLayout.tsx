import { useState, useEffect, type ReactNode } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Link, LayoutDashboard, Users, Settings, ChevronDown, ChevronRight, BookMarked, MessageSquare, LifeBuoy, Download, ChevronsUpDown, Folder } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import GlobalTopNav from '../ui/GlobalTopNav'
import { useProjects, useProjectChatBadges } from '../../hooks/useProjects'
import ProjectIcon from '../ui/ProjectIcon'

const PROJECT_NAV = [
  { suffix: 'resources', label: 'Resources', icon: BookMarked },
  { suffix: 'chat', label: 'Project Chat', icon: MessageSquare },
  { suffix: 'members', label: 'Members', icon: Users },
  { suffix: 'settings', label: 'Settings', icon: Settings },
]

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const user = useCurrentUser()
  const { data: projects } = useProjects()
  const { data: chatBadges = {} } = useProjectChatBadges()
  const { projectId: urlProjectId } = useParams<{ projectId: string }>()

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem('sidebar-expanded')
      const ids = stored ? (JSON.parse(stored) as string[]) : []
      if (urlProjectId && !ids.includes(urlProjectId)) ids.push(urlProjectId)
      return new Set(ids)
    } catch {
      return urlProjectId ? new Set([urlProjectId]) : new Set()
    }
  })

  // Auto-expand when navigating to a project via URL, preserve others
  useEffect(() => {
    if (urlProjectId) {
      setExpandedIds((prev) => {
        if (prev.has(urlProjectId)) return prev
        return new Set([...prev, urlProjectId])
      })
    }
  }, [urlProjectId])

  // Persist expanded state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('sidebar-expanded', JSON.stringify([...expandedIds]))
    } catch { /* ignore */ }
  }, [expandedIds])

  const toggleExpand = (id: string, isExpanded: boolean) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (isExpanded) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="flex items-start gap-2.5 px-5 pt-7 pb-5 shrink-0">
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

        {/* Dashboard link */}
        <div className="px-3 mb-1 shrink-0">
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
            <LayoutDashboard className="size-[18px] shrink-0" />
            Dashboard
          </NavLink>
        </div>

        {/* Projects list — scrollable middle section */}
        <div className="px-3 pb-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2 mt-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              My Projects
            </p>
            {(projects?.length ?? 0) > 0 && (
              <button
                type="button"
                title={projects?.every((p) => expandedIds.has(p._id)) ? 'Collapse all' : 'Expand all'}
                onClick={() => {
                  if (projects?.every((p) => expandedIds.has(p._id))) {
                    setExpandedIds(new Set())
                  } else {
                    setExpandedIds(new Set(projects!.map((p) => p._id)))
                  }
                }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronsUpDown className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col">
            {projects?.map((project) => {
              const isExpanded = expandedIds.has(project._id)
              const isOwner = project.ownerId?._id === user.id
              const latestAt = chatBadges[project._id]
              const seenAt = localStorage.getItem(`chat-seen-${project._id}`)
              const hasUnread = !!latestAt && (!seenAt || new Date(latestAt) > new Date(seenAt))

              return (
                <div key={project._id}>
                  {/* Project header row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(project._id, isExpanded)}
                    className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-xl transition-colors text-left group ${
                      isExpanded
                        ? 'bg-muted/60 hover:bg-muted'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <ProjectIcon project={project} size="xs" />
                    <span className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">
                      {project.name}
                    </span>
                    {hasUnread && (
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>

                  {/* Sub-nav items */}
                  {isExpanded && (
                    <div className="ml-6 mt-1 mb-2 flex flex-col gap-0.5 border-l border-border pl-2">
                      {PROJECT_NAV.filter(
                        ({ suffix }) => suffix !== 'settings' || isOwner
                      ).map(({ suffix, label, icon: Icon }) => (
                        <NavLink
                          key={suffix}
                          to={`/projects/${project._id}/${suffix}`}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                              isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium'
                            }`
                          }
                        >
                          <Icon className="size-[14px] shrink-0" />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Library + bottom links — always visible */}
        <div className="px-3 pb-4 shrink-0 border-t border-border pt-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Library
          </p>
          <div className="flex flex-col gap-1 mb-2">
            {[
              { to: '/professional-bookmarks', label: 'Bookmarks', icon: BookMarked },
              { to: '/professional-common-links', label: 'Categories', icon: Folder },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
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
          </div>
          <div className="border-t border-border pt-2 flex flex-col gap-1">
            <NavLink
              to="/professional-import"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Download className="size-[18px] shrink-0" />
              Import
            </NavLink>
            <NavLink
              to="/professional-support"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <LifeBuoy className="size-[18px] shrink-0" />
              Support
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background flex flex-col">
        <GlobalTopNav />
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  )
}
