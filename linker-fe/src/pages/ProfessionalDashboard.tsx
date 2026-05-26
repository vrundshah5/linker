import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Users, Link2, Search, Plus, Loader2 } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import CreateProjectModal from '../components/ui/CreateProjectModal'
import ProjectIcon from '../components/ui/ProjectIcon'
import { MaskedAvatars } from '../components/ui/MaskedAvatars'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useProjects, useCreateProject } from '../hooks/useProjects'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ProfessionalDashboard() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects()
  const { mutate: createProject, isPending: creating } = useCreateProject()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const visibleProjects = (projects ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalCollaborators = (projects ?? []).reduce(
    (sum, p) => sum + p.members.filter((m) => m.userId._id !== user.id).length,
    0,
  )
  const totalLinks = (projects ?? []).reduce((sum, p) => sum + (p.resourceCount ?? 0), 0)
  const firstName = user.name.split(' ')[0] || user.name

  function handleCreate(data: { name: string; description: string }) {
    createProject({ name: data.name, description: data.description }, {
      onSuccess: () => {
        setShowCreate(false)
      },
    })
  }

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                Welcome to your Workspace,{' '}
                <span className="text-primary">{firstName}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                You have {projects?.length ?? 0} active project{(projects?.length ?? 0) !== 1 ? 's' : ''}. Let's get to work.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="size-4" />
                New Project
              </button>
            </div>
          </div>

          {/* Create project modal */}
          <CreateProjectModal
            open={showCreate}
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreate}
            isPending={creating}
          />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Briefcase, label: 'Active Projects', value: projects?.length ?? 0 },
              { icon: Users, label: 'Collaborators', value: totalCollaborators },
              { icon: Link2, label: 'Total Links', value: totalLinks },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-5 bg-surface border border-border rounded-2xl"
              >
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Your Projects */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl w-52 focus-within:border-warning transition-colors">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 text-muted-foreground animate-spin" />
              </div>
            ) : visibleProjects.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <Briefcase className="size-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-base font-bold text-foreground mb-1">No projects yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "New Project" to create your first workspace project.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {visibleProjects.map((project, idx) => {
                  const myMembership = project.members.find((m) => m.userId._id === user.id)
                  const role = myMembership?.role?.toUpperCase() ?? 'MEMBER'
                  // suppress idx-only usage lint warning
                  void idx

                  return (
                    <div
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}/resources`)}
                      className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                    >
                      {/* Icon + Role badge */}
                      <div className="flex items-start justify-between mb-5">
                        <ProjectIcon project={project} size="lg" />
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                            role === 'ADMIN'
                              ? 'bg-secondary text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {role}
                        </span>
                      </div>

                      {/* Name + last active */}
                      <p className="text-base font-bold text-foreground mb-1">{project.name}</p>
                      <p className="text-xs text-muted-foreground mb-5">
                        Last active {timeAgo(project.updatedAt)}
                      </p>

                      {/* Members — masked avatars on hover */}
                      {(() => {
                        const otherMembers = project.members.filter(
                          (m) => m.userId._id !== user.id,
                        )
                        const avatarData = otherMembers.map((m) => ({
                          name: m.userId.name,
                          avatar: m.userId.avatar
                            ? `/avatars/${m.userId.avatar}.png`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.userId.name)}&background=random&color=fff&size=64`,
                        }))
                        return (
                          <div className="flex items-center justify-between pr-2">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="size-4" />
                              <span className="text-sm font-semibold">{otherMembers.length}</span>
                            </div>
                            <MaskedAvatars
                              avatars={avatarData}
                              size={45}
                              column={26}
                              border={4}
                              movement={0.65}
                              ringed={true}
                              offset={-3}
                              blurOnRest={true}
                            />
                          </div>
                        )
                      })()}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
