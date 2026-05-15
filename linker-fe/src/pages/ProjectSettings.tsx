import { useState, useRef, useEffect } from 'react'
import { Search, Briefcase, ChevronDown, Pencil } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import BellButton from '../components/ui/BellButton'

interface Project {
  id: string
  name: string
  iconBg: string
  iconColor: string
}

const PROJECTS: Project[] = [
  { id: 'acme', name: 'Acme Corp Redesign', iconBg: 'bg-warning/15', iconColor: 'text-warning' },
  { id: 'marketing', name: 'Marketing Q4 Campaign', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { id: 'wiki', name: 'Internal Wiki Migration', iconBg: 'bg-success/15', iconColor: 'text-success' },
]

export default function ProjectSettings() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [projectName, setProjectName] = useState('Acme Corp Redesign')
  const [canInvite, setCanInvite] = useState(false)
  const [canAddResources, setCanAddResources] = useState(true)
  const [search, setSearch] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <>
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">Project Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure project details, permissions, and workspace preferences.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-48 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>
            <BellButton />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7 pb-24">

          {/* ── Active Project ── */}
          <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
            <h2 className="text-base font-bold text-foreground mb-1">Active Project</h2>
            <p className="text-sm text-muted-foreground mb-5">
              You are viewing settings for this specific project.
            </p>

            {/* Project switcher dropdown */}
            <div className="relative mb-5" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer text-left"
              >
                <div className={`size-8 rounded-lg ${selectedProject.iconBg} flex items-center justify-center shrink-0`}>
                  <Briefcase className={`size-4 ${selectedProject.iconColor}`} />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {selectedProject.name}
                </span>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 border-b border-border">
                    Switch Project Context
                  </p>
                  {PROJECTS.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => {
                        setSelectedProject(project)
                        setDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                        selectedProject.id === project.id
                          ? 'bg-warning/10'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`size-7 rounded-lg ${project.iconBg} flex items-center justify-center shrink-0`}>
                        <Briefcase className={`size-3.5 ${project.iconColor}`} />
                      </div>
                      <span className={`text-sm font-semibold ${selectedProject.id === project.id ? 'text-warning' : 'text-foreground'}`}>
                        {project.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-warning/15 flex items-center justify-center">
                  <Briefcase className="size-8 text-warning" />
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-center leading-tight"
                >
                  Change<br />Icon
                </button>
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
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-8 py-4 flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
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
      onConfirm={() => setShowDeleteModal(false)}
      onCancel={() => setShowDeleteModal(false)}
    />
    </>
  )
}
