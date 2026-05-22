import { useState } from 'react'
import { Ban, Loader2, Eye, Trash2, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/layouts/AdminLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'
import { useAdminUsers } from '../hooks/admin/useAdminUsers'
import { useToggleBan } from '../hooks/admin/useToggleBan'
import { useDeleteUser } from '../hooks/admin/useDeleteUser'
import type { AdminUser } from '../services/admin.service'

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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminManageUsers() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [sortKey, setSortKey] = useState<'name' | 'status' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const navigate = useNavigate()

  const { data, isLoading } = useAdminUsers({ search: debouncedSearch, page, limit: 10 })
  const { mutate: toggleBan } = useToggleBan()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
    clearTimeout((window as unknown as { _st?: number })._st)
    ;(window as unknown as { _st?: number })._st = window.setTimeout(() => setDebouncedSearch(value), 400)
  }

  function handleSort(key: 'name' | 'status' | 'createdAt') {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }: { col: 'name' | 'status' | 'createdAt' }) {
    if (sortKey !== col) return <ChevronsUpDown className="size-3 ml-1 opacity-40" />
    return sortDir === 'asc'
      ? <ChevronUp className="size-3 ml-1 text-primary" />
      : <ChevronDown className="size-3 ml-1 text-primary" />
  }

  const rawUsers = data?.data.users ?? []
  const users = [...rawUsers].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name')      cmp = a.name.localeCompare(b.name)
    if (sortKey === 'status')    cmp = (a.isBanned ? 1 : 0) - (b.isBanned ? 1 : 0)
    if (sortKey === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })

  const pagination = data?.data.pagination
  const totalPages = pagination?.totalPages ?? 1
  const startIndex = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
  const endIndex = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <>
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Manage Users"
            subtitle="View, edit, or ban users from the platform."
            searchValue={search}
            onSearch={handleSearch}
            searchPlaceholder="Search users by name or email..."
          />
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[2fr_2fr_110px_1fr_110px_140px_130px] px-6 py-3 border-b border-border">
              {([
                { key: 'name',      label: 'User'       },
                { key: null,        label: 'Email'      },
                { key: 'status',    label: 'Status'     },
                { key: null,        label: 'Workspace'  },
                { key: null,        label: 'Onboarding' },
                { key: 'createdAt', label: 'Joined'     },
                { key: null,        label: 'Actions'    },
              ] as { key: 'name' | 'status' | 'createdAt' | null; label: string }[]).map(({ key, label }) => (
                <span
                  key={label}
                  onClick={() => key && handleSort(key)}
                  className={`text-[11px] font-bold text-muted-foreground uppercase tracking-wider inline-flex items-center ${key ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''}`}
                >
                  {label}
                  {key && <SortIcon col={key} />}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : users.length === 0 ? (
                <p className="px-6 py-10 text-sm text-muted-foreground text-center">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-[2fr_2fr_110px_1fr_110px_140px_130px] items-center px-6 py-4"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      {user.avatar ? (
                        <div className="size-10 rounded-full overflow-hidden shrink-0">
                          <img src={`/avatars/${user.avatar}.png`} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${getAvatarColor(user._id)}`}>
                          {getInitials(user.name)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-foreground truncate capitalize">{user.name}</span>
                    </div>

                    {/* Email */}
                    <span className="text-sm text-muted-foreground truncate pr-4">{user.email}</span>

                    {/* Status */}
                    <div className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold ${user.isBanned ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                      <span className={`size-1.5 rounded-full shrink-0 ${user.isBanned ? 'bg-danger' : 'bg-success'}`} />
                      {user.isBanned ? 'Banned' : 'Active'}
                    </div>

                    {/* Workspace */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(user.workspaces?.length ? user.workspaces : user.workspaceType ? [user.workspaceType] : []).map((w) => (
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
                      ))}
                      {(!user.workspaces?.length && !user.workspaceType) && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Onboarding */}
                    <div className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold ${user.onboardingComplete ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      <span className={`size-1.5 rounded-full shrink-0 ${user.onboardingComplete ? 'bg-success' : 'bg-warning'}`} />
                      {user.onboardingComplete ? 'Done' : 'Pending'}
                    </div>

                    {/* Joined */}
                    <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        title="View user"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          <button
                            type="button"
                            title={user.isBanned ? 'Unban user' : 'Ban user'}
                            onClick={() => setBanTarget(user)}
                            className={`transition-colors cursor-pointer ${user.isBanned ? 'text-danger' : 'text-muted-foreground hover:text-danger'}`}
                          >
                            <Ban className="size-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete user"
                            onClick={() => setDeleteTarget(user)}
                            className="text-muted-foreground hover:text-danger transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {pagination ? `Showing ${startIndex}–${endIndex} of ${pagination.total.toLocaleString()} users` : ''}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-1.5 text-sm font-semibold border border-border rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-1.5 text-sm font-semibold border border-border rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>

    <ConfirmModal
      open={banTarget !== null}
      title={banTarget?.isBanned ? 'Unban User' : 'Ban User'}
      description={banTarget?.isBanned
        ? `Are you sure you want to unban ${banTarget?.name}? They will regain access.`
        : `Are you sure you want to ban ${banTarget?.name}? They will lose access to the platform.`
      }
      confirmLabel={banTarget?.isBanned ? 'Unban' : 'Ban'}
      variant={banTarget?.isBanned ? 'warning' : 'danger'}
      onConfirm={() => {
        if (banTarget) toggleBan(banTarget._id)
        setBanTarget(null)
      }}
      onCancel={() => setBanTarget(null)}
    />
    <ConfirmModal
      open={deleteTarget !== null}
      title="Delete User"
      description={`Are you sure you want to permanently delete ${deleteTarget?.name}? This action cannot be undone and will remove all their data.`}
      confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
      variant="danger"
      onConfirm={() => {
        if (deleteTarget) deleteUser(deleteTarget._id)
        setDeleteTarget(null)
      }}
      onCancel={() => setDeleteTarget(null)}
    />
    </>
  )
}

