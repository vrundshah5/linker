import { useNavigate } from 'react-router-dom'
import { Briefcase, Users, Link2, ArrowRight, Loader2 } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import ProjectIcon from '../components/ui/ProjectIcon'
import { useProjects } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useCurrentUser'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ProfessionalProjects() {
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects()
  const user = useCurrentUser()

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="Active Projects"
            subtitle={`${projects?.length ?? 0} project${(projects?.length ?? 0) !== 1 ? 's' : ''} in your workspace`}
            icon={<Briefcase className="size-5" />}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !projects?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No projects yet</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_80px_80px_120px_40px] gap-4 px-5 py-3 border-b border-border bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Members</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Links</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Created</p>
                <div />
              </div>

              {/* Table rows */}
              {projects.map((p) => {
                const isOwner = p.ownerId._id === user.id
                return (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/projects/${p._id}/resources`)}
                    className="grid grid-cols-[2fr_1fr_80px_80px_120px_40px] gap-4 items-center px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    {/* Project name + icon */}
                    <div className="flex items-center gap-3 min-w-0">
                      <ProjectIcon project={p} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Role badge */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isOwner
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isOwner ? 'Owner' : 'Member'}
                      </span>
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="size-3.5" />
                      <span>{p.members.length}</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <Link2 className="size-3.5" />
                      <span>{p.resourceCount ?? 0}</span>
                    </div>

                    {/* Created date */}
                    <p className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>

                    {/* Arrow */}
                    <ArrowRight className="size-4 text-muted-foreground/50" />
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
