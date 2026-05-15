import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Folder,
  Link2,
  Loader2,
  Ban,
  ShieldOff,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import { useAdminUserDetail } from '../hooks/admin/useAdminUserDetail'
import { useToggleBan } from '../hooks/admin/useToggleBan'
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
  const { mutate: toggleBan, isPending: isBanning } = useToggleBan()

  const user = data?.user
  const customCategories = data?.customCategories ?? []

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="size-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">User Detail</h1>
            <p className="text-xs text-muted-foreground">View profile and custom categories</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
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
                    <div
                      className={`size-16 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold ${getAvatarColor(user._id)}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Mail className="size-3.5" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Status + ban button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.isBanned
                          ? 'bg-danger/10 text-danger'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                    {user.role !== 'admin' && (
                      <button
                        type="button"
                        disabled={isBanning}
                        onClick={() => toggleBan(user._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 ${
                          user.isBanned
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-danger/10 text-danger hover:bg-danger/20'
                        }`}
                      >
                        {user.isBanned ? (
                          <><ShieldOff className="size-3.5" /> Unban</>
                        ) : (
                          <><Ban className="size-3.5" /> Ban</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Workspace</p>
                    <p className="text-sm font-bold text-foreground capitalize">
                      {user.workspaceType ?? 'Not set'}
                    </p>
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

              {/* Custom categories */}
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Custom Categories</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Categories created by this user (excluding global selections)
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full">
                    {customCategories.length}
                  </span>
                </div>

                {customCategories.length === 0 ? (
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
                            title={cat.themeColor}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
