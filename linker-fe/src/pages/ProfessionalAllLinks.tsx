import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { Link2, ExternalLink, Globe, Loader2 } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { useProjects } from '../hooks/useProjects'
import { projectService } from '../services/projectService'
import { queryKeys } from '../constants/queryKeys'
import type { ProjectResourceItem } from '../services/projectService'

function FaviconImg({ url }: { url: string }) {
  const [errored, setErrored] = useState(false)
  let hostname = ''
  try { hostname = new URL(url).hostname } catch { /* */ }
  if (!hostname || errored) return <Globe className="size-4 shrink-0 text-muted-foreground/40" />
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
      alt=""
      width={16}
      height={16}
      onError={() => setErrored(true)}
      className="size-4 object-contain shrink-0"
    />
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

type FlatLink = ProjectResourceItem & { projectName: string; projectColor: string }

export default function ProfessionalAllLinks() {
  const navigate = useNavigate()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const resourceQueries = useQueries({
    queries: (projects ?? []).map((p) => ({
      queryKey: queryKeys.projects.resources(p._id),
      queryFn: () => projectService.listResources(p._id),
      enabled: Boolean(projects),
    })),
  })

  const allLinks: FlatLink[] = (projects ?? []).flatMap((p, i) =>
    (resourceQueries[i]?.data ?? []).map((r) => ({
      ...r,
      projectName: p.name,
      projectColor: p.color,
    })),
  )

  const allLoaded = resourceQueries.every((q) => !q.isLoading)

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="All Project Links"
            subtitle={
              allLoaded
                ? `${allLinks.length} link${allLinks.length !== 1 ? 's' : ''} across ${projects?.length ?? 0} project${(projects?.length ?? 0) !== 1 ? 's' : ''}`
                : 'Loading links…'
            }
            icon={<Link2 className="size-5" />}
          />

          {projectsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !projects?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Link2 className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No projects yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a project and add links to see them here</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_2fr_1fr_120px_40px] gap-4 px-5 py-3 border-b border-border bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">URL</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Added</p>
                <div />
              </div>

              {!allLoaded && allLinks.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : allLinks.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No links found in any project</p>
                </div>
              ) : (
                allLinks.map((r) => {
                  let hostname = r.url
                  try { hostname = new URL(r.url).hostname.replace(/^www\./, '') } catch { /* */ }
                  return (
                    <div
                      key={r._id}
                      className="grid grid-cols-[2fr_2fr_1fr_120px_40px] gap-4 items-center px-5 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      {/* Title */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FaviconImg url={r.url} />
                        <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                      </div>

                      {/* URL */}
                      <p className="text-xs text-muted-foreground truncate">{hostname}</p>

                      {/* Project chip */}
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary truncate"
                        onClick={() => navigate(`/projects/${r.projectId}/resources`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {r.projectName}
                      </span>

                      {/* Date */}
                      <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>

                      {/* Open */}
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center text-primary hover:opacity-75 transition-opacity"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}

import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import ProjectIcon from '../components/ui/ProjectIcon'
import { useProjects } from '../hooks/useProjects'
import { projectService } from '../services/projectService'
import { queryKeys } from '../constants/queryKeys'
import type { ProjectResourceItem } from '../services/projectService'

function FaviconImg({ url }: { url: string }) {
  const [errored, setErrored] = useState(false)
  let hostname = ''
  try { hostname = new URL(url).hostname } catch { /* */ }
  if (!hostname || errored) return <Globe className="size-4 shrink-0 text-muted-foreground/40" />
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
      alt=""
      width={16}
      height={16}
      onError={() => setErrored(true)}
      className="size-4 object-contain shrink-0"
    />
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ProjectSection({
  projectId,
  projectName,
  project,
  resources,
  isLoading,
}: {
  projectId: string
  projectName: string
  projectColor: string
  project: Parameters<typeof ProjectIcon>[0]['project']
  resources: ProjectResourceItem[]
  isLoading: boolean
}) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Project header */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors select-none ${expanded ? 'border-b border-border' : ''}`}
      >
        <ProjectIcon project={project} size="sm" />
        <p className="flex-1 text-sm font-bold text-foreground">{projectName}</p>
        {isLoading ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : (
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {resources.length} link{resources.length !== 1 ? 's' : ''}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/projects/${projectId}/resources`) }}
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-75 transition-opacity px-2 py-1 rounded-lg hover:bg-primary/10"
        >
          <ExternalLink className="size-3" />
          View all
        </button>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Resources */}
      {expanded && (
        isLoading ? (
          <div className="px-5 py-6 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : resources.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs text-muted-foreground">No links in this project yet</p>
          </div>
        ) : (
          resources.map((r) => {
            let hostname = r.url
            try { hostname = new URL(r.url).hostname.replace(/^www\./, '') } catch { /* */ }
            return (
              <div
                key={r._id}
                className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-b-0"
              >
                <FaviconImg url={r.url} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{hostname}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {formatDate(r.createdAt)}
                </p>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-75 transition-opacity shrink-0"
                >
                  <ExternalLink className="size-3" />
                  Open
                </a>
              </div>
            )
          })
        )
      )}
    </div>
  )
}

export default function ProfessionalAllLinks() {
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const resourceQueries = useQueries({
    queries: (projects ?? []).map((p) => ({
      queryKey: queryKeys.projects.resources(p._id),
      queryFn: () => projectService.listResources(p._id),
      enabled: Boolean(projects),
    })),
  })

  const totalLinks = resourceQueries.reduce((sum, q) => sum + (q.data?.length ?? 0), 0)
  const allLoaded = resourceQueries.every((q) => !q.isLoading)

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="All Project Links"
            subtitle={
              allLoaded
                ? `${totalLinks} link${totalLinks !== 1 ? 's' : ''} across ${projects?.length ?? 0} project${(projects?.length ?? 0) !== 1 ? 's' : ''}`
                : 'Loading links…'
            }
            icon={<Link2 className="size-5" />}
          />

          {projectsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !projects?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Link2 className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No projects yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a project and add links to see them here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map((p, i) => (
                <ProjectSection
                  key={p._id}
                  projectId={p._id}
                  projectName={p.name}
                  projectColor={p.color}
                  project={p}
                  resources={resourceQueries[i]?.data ?? []}
                  isLoading={resourceQueries[i]?.isLoading ?? false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}
