import { Users, Loader2 } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { useProjects } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Project } from '../services/projectService'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function avatarColor(name: string) {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  ]
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

type Collaborator = {
  id: string
  name: string
  email: string
  projects: Pick<Project, '_id' | 'name' | 'color'>[]
}

function buildCollaborators(projects: Project[], currentUserId: string): Collaborator[] {
  const map = new Map<string, Collaborator>()
  for (const p of projects) {
    for (const m of p.members) {
      if (m.userId._id === currentUserId) continue
      if (!map.has(m.userId._id)) {
        map.set(m.userId._id, {
          id: m.userId._id,
          name: m.userId.name,
          email: m.userId.email,
          projects: [],
        })
      }
      map.get(m.userId._id)!.projects.push({ _id: p._id, name: p.name, color: p.color })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export default function ProfessionalCollaborators() {
  const { data: projects, isLoading } = useProjects()
  const user = useCurrentUser()

  const collaborators = buildCollaborators(projects ?? [], user.id)

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="Collaborators"
            subtitle={`${collaborators.length} unique collaborator${collaborators.length !== 1 ? 's' : ''} across all your projects`}
            icon={<Users className="size-5" />}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : collaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No collaborators yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Invite members to your projects to see them here
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 px-5 py-3 border-b border-border bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Collaborator</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Projects</p>
              </div>

              {collaborators.map((c) => {
                const color = avatarColor(c.name)
                return (
                  <div
                    key={c.id}
                    className="grid grid-cols-[2fr_2fr_1fr] gap-4 items-center px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="size-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {initials(c.name)}
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    </div>

                    {/* Email */}
                    <p className="text-sm text-muted-foreground truncate">{c.email}</p>

                    {/* Project chips — using theme primary */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.projects.map((p) => (
                        <span
                          key={p._id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}


function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function avatarColor(name: string) {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  ]
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

type Collaborator = {
  id: string
  name: string
  email: string
  projects: Pick<Project, '_id' | 'name' | 'color'>[]
}

function buildCollaborators(projects: Project[], currentUserId: string): Collaborator[] {
  const map = new Map<string, Collaborator>()
  for (const p of projects) {
    for (const m of p.members) {
      if (m.userId._id === currentUserId) continue
      if (!map.has(m.userId._id)) {
        map.set(m.userId._id, {
          id: m.userId._id,
          name: m.userId.name,
          email: m.userId.email,
          projects: [],
        })
      }
      map.get(m.userId._id)!.projects.push({ _id: p._id, name: p.name, color: p.color })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export default function ProfessionalCollaborators() {
  const { data: projects, isLoading } = useProjects()
  const user = useCurrentUser()

  const collaborators = buildCollaborators(projects ?? [], user.id)

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="Collaborators"
            subtitle={`${collaborators.length} unique collaborator${collaborators.length !== 1 ? 's' : ''} across all your projects`}
            icon={<Users className="size-5" />}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : collaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No collaborators yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Invite members to your projects to see them here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {collaborators.map((c) => {
                const color = avatarColor(c.name)
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 px-5 py-4 bg-surface border border-border rounded-2xl"
                  >
                    {/* Avatar */}
                    <div
                      className="size-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {initials(c.name)}
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>

                    {/* Projects */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {c.projects.map((p) => (
                        <span
                          key={p._id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ backgroundColor: `${p.color}20`, color: p.color }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}
