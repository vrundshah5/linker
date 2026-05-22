import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Mail,
  Calendar,
  Folder,
  Link2,
  Loader2,
  Briefcase,
  Users,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'
import { useAdminUserDetail } from '../hooks/admin/useAdminUserDetail'
import { getCategoryIcon } from '../lib/categoryIcons'

const AVATAR_COLORS = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-danger/10 text-danger',
]

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function getAvatarColor(id: string) {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useAdminUserDetail(id ?? '')

  const user = data?.user
  const customCategories = data?.customCategories ?? []
  const projects = data?.projects ?? []

  // Determine which workspace tabs to show
  const workspaces: ('personal' | 'professional')[] = user
    ? (user.workspaces?.length
        ? (user.workspaces as ('personal' | 'professional')[])
        : user.workspaceType
        ? [user.workspaceType]
        : [])
    : []
  const hasBoth = workspaces.includes('personal') && workspaces.includes('professional')
  const [activeTab, setActiveTab] = useState<'personal' | 'professional'>('personal')

  // Resolve which section to show
  const showTab: 'personal' | 'professional' = hasBoth
    ? activeTab
    : workspaces[0] ?? 'personal'

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground font-bold">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Manage Users
            </button>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{user?.name ?? 'User Detail'}</span>
          </nav>

          <PageHeader
            title={user?.name ?? 'User Detail'}
            subtitle={user?.email ?? 'View profile and workspace details'}
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !user ? (
            <p className="text-sm text-muted-foreground text-center py-16">User not found.</p>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Profile card */}
              <div className="bg-surface border border-border rounded-2xl p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    {user.avatar ? (
                      <div className="size-16 rounded-2xl overflow-hidden shrink-0">
                        <img src={`/avatars/${user.avatar}.png`} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`size-16 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold ${getAvatarColor(user._id)}`}
                      >
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-foreground capitalize">{user.name}</h2>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Mail className="size-3.5" />
                        {user.email}
                      </div>
                      {/* Status badge */}
                      <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.isBanned ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                      }`}>
                        <span className={`size-1.5 rounded-full ${user.isBanned ? 'bg-danger' : 'bg-success'}`} />
                        {user.isBanned ? 'Banned' : 'Active'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Workspace</p>
                    <div className="flex flex-wrap gap-1.5">
                      {workspaces.length > 0 ? workspaces.map((w) => (
                        <span
                          key={w}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                            w === 'personal'
                              ? 'border-primary/30 text-primary bg-primary/5'
                              : 'border-success/30 text-success bg-success/5'
                          }`}
                        >
                          {w.charAt(0).toUpperCase() + w.slice(1)}
                        </span>
                      )) : <span className="text-sm text-muted-foreground">—</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Onboarding</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.onboardingComplete ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {user.onboardingComplete ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Joined</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom categories / Projects */}
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                {/* Tab header — only shown when user has both workspaces */}
                {hasBoth ? (
                  <div className="px-6 py-3 border-b border-border">
                    <div className="inline-flex items-center gap-1 bg-background p-1.5 rounded-2xl shadow-sm">
                      {(['personal', 'professional'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer capitalize ${
                            activeTab === tab
                              ? 'bg-surface text-primary shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {showTab === 'professional' ? 'Projects' : 'Custom Categories'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {showTab === 'professional'
                          ? 'Projects this user owns or is a member of'
                          : 'Categories created by this user (excluding global selections)'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full">
                      {showTab === 'professional' ? projects.length : customCategories.length}
                    </span>
                  </div>
                )}

                {/* Tab content label when hasBoth */}
                {hasBoth && (
                  <div className="px-6 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {showTab === 'professional'
                        ? 'Projects this user owns or is a member of'
                        : 'Categories created by this user (excluding global selections)'}
                    </p>
                    <span className="px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full">
                      {showTab === 'professional' ? projects.length : customCategories.length}
                    </span>
                  </div>
                )}

                {/* Personal: categories */}
                {showTab === 'personal' && (
                  customCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                        <Folder className="size-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">This user hasn't created any custom categories yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {customCategories.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon)
                        return (
                          <div key={cat._id} className="flex items-center gap-4 px-6 py-4">
                            <div
                              className="size-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${cat.themeColor}20`, color: cat.themeColor }}
                            >
                              <Icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{cat.name}</p>
                              {cat.description && (
                                <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                              <Link2 className="size-3.5" />
                              <span>{cat.linkCount} links</span>
                            </div>
                            <div
                              className="size-4 rounded-full shrink-0"
                              style={{ backgroundColor: cat.themeColor }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )
                )}

                {/* Professional: projects */}
                {showTab === 'professional' && (
                  projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                        <Briefcase className="size-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">This user has no projects yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {projects.map((project) => (
                        <div key={project._id} className="flex items-center gap-4 px-6 py-4">
                          <div
                            className="size-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${project.color}20`, color: project.color }}
                          >
                            <Briefcase className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{project.name}</p>
                            {project.description && (
                              <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                            <Users className="size-3.5" />
                            <span>{project.members.length} members</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              project.ownerId === user!._id
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {project.ownerId === user!._id ? 'Owner' : 'Member'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
