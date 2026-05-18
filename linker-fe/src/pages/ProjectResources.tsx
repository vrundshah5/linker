import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Globe, Loader2, Trash2, BookMarked } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import AddResourceModal from '../components/ui/AddResourceModal'
import ConfirmModal from '../components/ui/ConfirmModal'
import { useProject, useProjectResources, useAddProjectResources, useDeleteProjectResource } from '../hooks/useProjects'

export default function ProjectResources() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)
  const { data: resources, isLoading } = useProjectResources(projectId)
  const { mutate: addResources, isPending: adding } = useAddProjectResources()
  const { mutate: deleteResource } = useDeleteProjectResource()
  const [topSearch, setTopSearch] = useState('')
  const [inlineSearch, setInlineSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  const projectName = project?.name ?? 'Project'

  const visibleResources = (resources ?? []).filter((r) => {
    const q = (topSearch.trim() || inlineSearch.trim()).toLowerCase()
    if (!q) return true
    return (
      r.title.toLowerCase().includes(q) ||
      r.url.toLowerCase().includes(q)
    )
  })

  function handleAddResources(items: { url: string; title: string }[]) {
    if (!projectId) return
    addResources(
      { projectId, resources: items },
      { onSuccess: () => setShowAddModal(false) },
    )
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">

        <AddResourceModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddResources}
          isPending={adding}
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Project Resources"
            subtitle={`All saved links and documents for ${projectName}.`}
            searchValue={topSearch}
            onSearch={setTopSearch}
            actions={
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                + Add Resource
              </button>
            }
          />

          {/* Inline search */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search resources..."
                value={inlineSearch}
                onChange={(e) => setInlineSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>
          </div>

          {/* Resource rows */}
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 text-muted-foreground animate-spin" />
              </div>
            ) : visibleResources.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <BookMarked className="size-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-base font-bold text-foreground mb-1">No resources yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "+ Add Resource" to save links and documents to this project.
                </p>
              </div>
            ) : (
              visibleResources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Globe icon */}
                  <div className="size-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Globe className="size-5 text-muted-foreground" />
                  </div>

                  {/* Title + URL */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground leading-snug mb-0.5 truncate">
                      {resource.title || resource.url}
                    </p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary truncate block hover:underline"
                    >
                      {resource.url}
                    </a>
                  </div>

                  {/* Date */}
                  <p className="text-sm text-muted-foreground shrink-0 ml-2">
                    {formatDate(resource.createdAt)}
                  </p>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: resource._id, title: resource.title || resource.url })}
                    className="p-2 text-muted-foreground hover:text-danger transition-colors cursor-pointer shrink-0"
                    aria-label="Delete resource"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
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
