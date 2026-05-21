import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Globe, Loader2, Trash2, BookMarked,
  LayoutList, LayoutGrid, Table2, LayoutDashboard,
  Pencil, Check, X,
} from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import AddResourceModal from '../components/ui/AddResourceModal'
import ConfirmModal from '../components/ui/ConfirmModal'
import {
  useProject,
  useProjectResources,
  useAddProjectResources,
  useDeleteProjectResource,
  useUpdateProjectResource,
} from '../hooks/useProjects'
import type { ProjectResourceItem } from '../services/projectService'

type ViewMode = 'list' | 'grid' | 'card' | 'table'

function FaviconIcon({ url }: { url: string }) {
  const [errored, setErrored] = useState(false)
  let hostname = ''
  try { hostname = new URL(url).hostname } catch { /* invalid url */ }

  if (!hostname || errored) {
    return <Globe className="size-5 text-muted-foreground" />
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
      alt=""
      width={20}
      height={20}
      onError={() => setErrored(true)}
      className="size-5 object-contain"
    />
  )
}

function InlineEdit({
  resource,
  projectId,
  onDone,
}: {
  resource: ProjectResourceItem
  projectId: string
  onDone: () => void
}) {
  const [title, setTitle] = useState(resource.title)
  const [url, setUrl] = useState(resource.url)
  const { mutate: updateResource, isPending } = useUpdateProjectResource()

  function save() {
    if (!title.trim() || !url.trim()) return
    updateResource(
      { projectId, resourceId: resource._id, payload: { title: title.trim(), url: url.trim() } },
      { onSuccess: onDone },
    )
  }

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
        className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
      />
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={save}
          disabled={isPending || !title.trim() || !url.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          Save
        </button>
        <button
          onClick={onDone}
          className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground text-xs font-bold rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-3" /> Cancel
        </button>
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const VIEW_MODES: { id: ViewMode; icon: React.ElementType; label: string }[] = [
  { id: 'list',  icon: LayoutList,      label: 'List' },
  { id: 'grid',  icon: LayoutGrid,      label: 'Grid' },
  { id: 'card',  icon: LayoutDashboard, label: 'Card' },
  { id: 'table', icon: Table2,          label: 'Table' },
]

export default function ProjectResources() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)
  const { data: resources, isLoading } = useProjectResources(projectId)
  const { mutate: addResources, isPending: adding } = useAddProjectResources()
  const { mutate: deleteResource } = useDeleteProjectResource()

  const [topSearch, setTopSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const projectName = project?.name ?? 'Project'

  const visibleResources = (resources ?? []).filter((r) => {
    const q = topSearch.trim().toLowerCase()
    if (!q) return true
    return r.title.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)
  })

  function handleAddResources(items: { url: string; title: string }[]) {
    if (!projectId) return
    addResources({ projectId, resources: items }, { onSuccess: () => setShowAddModal(false) })
  }

  const isEmpty = !isLoading && visibleResources.length === 0

  return (
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <AddResourceModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddResources}
          isPending={adding}
        />

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Project Resources"
            subtitle={`All saved links and documents for ${projectName}.`}
            searchValue={topSearch}
            onSearch={setTopSearch}
            actions={
              <div className="flex items-center gap-3">
                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                  {VIEW_MODES.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      title={label}
                      onClick={() => setViewMode(id)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        viewMode === id
                          ? 'bg-surface text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                >
                  + Add Resource
                </button>
              </div>
            }
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center">
              <BookMarked className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-base font-bold text-foreground mb-1">No resources yet</p>
              <p className="text-sm text-muted-foreground">
                Click "+ Add Resource" to save links and documents to this project.
              </p>
            </div>
          ) : viewMode === 'list' ? (
            /* ── LIST VIEW ─────────────────────────────── */
            <div className="flex flex-col gap-3">
              {visibleResources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="size-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FaviconIcon url={resource.url} />
                  </div>
                  {editingId === resource._id && projectId ? (
                    <InlineEdit resource={resource} projectId={projectId} onDone={() => setEditingId(null)} />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-snug mb-0.5 truncate">
                        {resource.title || resource.url}
                      </p>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary truncate block hover:underline">
                        {resource.url}
                      </a>
                    </div>
                  )}
                  {editingId !== resource._id && (
                    <>
                      <p className="text-sm text-muted-foreground shrink-0 ml-2">{formatDate(resource.createdAt)}</p>
                      <button type="button" onClick={() => setEditingId(resource._id)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0" aria-label="Edit resource">
                        <Pencil className="size-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget({ id: resource._id, title: resource.title || resource.url })}
                        className="p-2 text-muted-foreground hover:text-danger transition-colors cursor-pointer shrink-0" aria-label="Delete resource">
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            /* ── GRID VIEW ─────────────────────────────── */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleResources.map((resource) => (
                <div key={resource._id}
                  className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <FaviconIcon url={resource.url} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingId(resource._id === editingId ? null : resource._id)}
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: resource._id, title: resource.title || resource.url })}
                        className="p-1.5 text-muted-foreground hover:text-danger rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {editingId === resource._id && projectId ? (
                    <InlineEdit resource={resource} projectId={projectId} onDone={() => setEditingId(null)} />
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground leading-snug mb-1 line-clamp-2">
                          {resource.title || resource.url}
                        </p>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary block truncate hover:underline">{resource.url}</a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-auto">{formatDate(resource.createdAt)}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : viewMode === 'card' ? (
            /* ── CARD VIEW ─────────────────────────────── */
            <div className="flex flex-col gap-4">
              {visibleResources.map((resource) => (
                <div key={resource._id}
                  className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                      <FaviconIcon url={resource.url} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === resource._id && projectId ? (
                        <InlineEdit resource={resource} projectId={projectId} onDone={() => setEditingId(null)} />
                      ) : (
                        <>
                          <p className="text-base font-bold text-foreground mb-1">{resource.title || resource.url}</p>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all">{resource.url}</a>
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground flex-1">
                              Added by <span className="font-semibold text-foreground">{resource.addedBy?.name ?? 'Unknown'}</span> · {formatDate(resource.createdAt)}
                            </p>
                            <button onClick={() => setEditingId(resource._id)}
                              className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-colors cursor-pointer">
                              <Pencil className="size-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ id: resource._id, title: resource.title || resource.url })}
                              className="p-2 text-muted-foreground hover:text-danger rounded-lg hover:bg-muted transition-colors cursor-pointer">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── TABLE VIEW ────────────────────────────── */
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Resource</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Added by</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3.5 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleResources.map((resource, idx) => (
                    <tr key={resource._id}
                      className={`transition-colors hover:bg-muted/30 ${idx !== visibleResources.length - 1 ? 'border-b border-border' : ''}`}>
                      <td className="px-5 py-4">
                        {editingId === resource._id && projectId ? (
                          <InlineEdit resource={resource} projectId={projectId} onDone={() => setEditingId(null)} />
                        ) : (
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <FaviconIcon url={resource.url} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{resource.title || resource.url}</p>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-primary truncate block hover:underline max-w-xs">{resource.url}</a>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{resource.addedBy?.name ?? '—'}</td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{formatDate(resource.createdAt)}</td>
                      <td className="px-5 py-4">
                        {editingId !== resource._id && (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEditingId(resource._id)}
                              className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors cursor-pointer">
                              <Pencil className="size-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ id: resource._id, title: resource.title || resource.url })}
                              className="p-2 text-muted-foreground hover:text-danger rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ConfirmModal
          open={!!deleteTarget}
          title="Delete Resource"
          description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            if (projectId && deleteTarget) {
              deleteResource({ projectId, resourceId: deleteTarget.id })
            }
            setDeleteTarget(null)
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </WorkspaceLayout>
  )
}
