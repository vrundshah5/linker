import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, Upload, X } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'
import ProjectIcon from '../components/ui/ProjectIcon'
import { useProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { data: project } = useProject(projectId)
  const { mutate: updateProject } = useUpdateProject()
  const { mutate: deleteProject } = useDeleteProject()
  const user = useCurrentUser()
  const isOwner = project?.ownerId?._id === user.id
  const [projectName, setProjectName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#f59e0b')
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [iconChanged, setIconChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [canInvite, setCanInvite] = useState(false)
  const [canAddResources, setCanAddResources] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function updatePermission(key: 'anyoneCanInvite' | 'anyoneCanAddResources', value: boolean) {
    if (!projectId) return
    if (key === 'anyoneCanInvite') setCanInvite(value)
    else setCanAddResources(value)
    updateProject({
      id: projectId,
      name: projectName.trim() || project?.name || '',
      permissions: {
        anyoneCanInvite: key === 'anyoneCanInvite' ? value : canInvite,
        anyoneCanAddResources: key === 'anyoneCanAddResources' ? value : canAddResources,
      },
    })
  }

  // Sync project data when it loads
  useEffect(() => {
    if (project) {
      setProjectName(project.name)
      setSelectedColor(project.color || '#f59e0b')
      setIconPreview(project.iconUrl || null)
      setIconChanged(false)
      setCanInvite(project.permissions?.anyoneCanInvite ?? false)
      setCanAddResources(project.permissions?.anyoneCanAddResources ?? true)
    }
  }, [project])

  return (
    <>
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-24">
          <PageHeader
            title="Project Settings"
            subtitle="Configure project details, permissions, and workspace preferences."
          />

          {/* ── Active Project ── */}
          <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
            <h2 className="text-base font-bold text-foreground mb-1">Active Project</h2>
            <p className="text-sm text-muted-foreground mb-5">
              You are viewing settings for this specific project.
            </p>

            {/* Project name input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <Pencil className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Project Icon */}
            <div>
              <p className="text-sm font-bold text-foreground mb-3">Project Icon</p>
              <div className="flex items-center gap-5">
                {/* Live preview */}
                <div className="relative shrink-0">
                  <ProjectIcon
                    project={{ color: selectedColor, iconUrl: iconPreview ?? undefined, name: project?.name ?? '' }}
                    size="xl"
                  />
                  {iconPreview && (
                    <button
                      type="button"
                      title="Remove icon"
                      onClick={() => { setIconPreview(null); setIconChanged(true) }}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-danger text-white flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                {/* Upload area */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Image must be 2 MB or smaller.')
                        e.target.value = ''
                        return
                      }
                      const reader = new FileReader()
                      reader.onload = () => {
                        setIconPreview(reader.result as string)
                        setIconChanged(true)
                      }
                      reader.readAsDataURL(file)
                      e.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Upload className="size-4 text-muted-foreground" />
                    {iconPreview ? 'Replace Image' : 'Upload Image'}
                  </button>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF · Max 2 MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Permissions ── */}
          <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
            <h2 className="text-base font-bold text-foreground mb-5">Permissions</h2>

            <div className="flex flex-col gap-0 divide-y divide-border">
              {/* Toggle row */}
              {[
                {
                  label: 'Anyone can invite members',
                  description: 'Allow any team member to invite new people to this project.',
                  value: canInvite,
                  onChange: setCanInvite,
                },
                {
                  label: 'Anyone can add resources',
                  description: 'Allow any team member to add and create links in this project.',
                  value: canAddResources,
                  onChange: setCanAddResources,
                },
              ].map(({ label, description, value, onChange }) => (
                <div key={label} className="flex items-center justify-between py-4 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  {/* Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    onClick={() => onChange(!value)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                      value ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Danger Zone ── */}
          {isOwner && (
          <div className="bg-danger/5 border border-danger/25 rounded-2xl p-6">
            <h2 className="text-base font-bold text-danger mb-1.5">Danger Zone</h2>
            <p className="text-sm text-danger/70 mb-5">
              Once you delete a project, there is no going back. Please be certain.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-danger text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Delete Project
            </button>
          </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!projectId) return
              updateProject({
                id: projectId,
                name: projectName.trim(),
                ...(iconChanged ? { iconUrl: iconPreview ?? '' } : {}),
              })
            }}
            disabled={!projectName.trim()}
            className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </WorkspaceLayout>

    <ConfirmModal
      open={showDeleteModal}
      title="Delete Project"
      description="Are you sure you want to delete this project? All resources, members, and links will be permanently removed. This action cannot be undone."
      confirmLabel="Delete Project"
      onConfirm={() => {
        if (projectId) deleteProject(projectId, { onSuccess: () => navigate('/professional-dashboard') })
        setShowDeleteModal(false)
      }}
      onCancel={() => setShowDeleteModal(false)}
    />
    </>
  )
}
