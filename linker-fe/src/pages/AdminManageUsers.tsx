import { useState } from 'react'
import { SquarePen, Ban } from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import BellButton from '../components/ui/BellButton'

type Status = 'Active' | 'Banned'
type Plan = 'Pro' | 'Free'

interface User {
  id: number
  name: string
  email: string
  status: Status
  plan: Plan
  joined: string
  initials: string
  avatarColor: string
}

const ALL_USERS: User[] = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@example.com', status: 'Active', plan: 'Pro', joined: 'Jan 12, 2023', initials: 'SC', avatarColor: 'bg-primary/15 text-primary' },
  { id: 2, name: 'John Smith', email: 'john@example.com', status: 'Active', plan: 'Free', joined: 'Feb 04, 2023', initials: 'JS', avatarColor: 'bg-success/15 text-success' },
  { id: 3, name: 'Emma Watson', email: 'emma@example.com', status: 'Banned', plan: 'Free', joined: 'Mar 15, 2023', initials: 'EW', avatarColor: 'bg-danger/10 text-danger' },
  { id: 4, name: 'Michael Doe', email: 'michael@example.com', status: 'Active', plan: 'Pro', joined: 'Apr 22, 2023', initials: 'MD', avatarColor: 'bg-warning/15 text-warning' },
  { id: 5, name: 'Alex Morgan', email: 'alex@example.com', status: 'Active', plan: 'Free', joined: 'May 01, 2023', initials: 'AM', avatarColor: 'bg-primary/15 text-primary' },
]

const PAGE_SIZE = 5
const TOTAL_USERS = 24592

export default function AdminManageUsers() {
  const [users, setUsers] = useState<User[]>(ALL_USERS)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [banTarget, setBanTarget] = useState<User | null>(null)

  function toggleBan(id: number) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u,
      ),
    )
    setBanTarget(null)
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(page * PAGE_SIZE, filtered.length)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  return (
    <>
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">Manage Users</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              View, edit, or ban users from the platform.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-64 focus-within:border-primary transition-colors">
              <svg className="size-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search users by email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>
            <BellButton />
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-danger text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Invite User
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[2fr_2fr_100px_90px_140px_120px] px-6 py-3 border-b border-border">
              {['User', 'Email', 'Status', 'Plan', 'Joined', 'Actions'].map((col) => (
                <span key={col} className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {visible.length === 0 ? (
                <p className="px-6 py-10 text-sm text-muted-foreground text-center">
                  No users found.
                </p>
              ) : (
                visible.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[2fr_2fr_100px_90px_140px_120px] items-center px-6 py-4"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${user.avatarColor}`}>
                        {user.initials}
                      </div>
                      <span className="text-sm font-bold text-foreground truncate">{user.name}</span>
                    </div>

                    {/* Email */}
                    <span className="text-sm text-muted-foreground truncate pr-4">{user.email}</span>

                    {/* Status */}
                    <span
                      className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'Active'
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {user.status}
                    </span>

                    {/* Plan */}
                    <span
                      className={`text-sm font-bold ${
                        user.plan === 'Pro' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {user.plan}
                    </span>

                    {/* Joined */}
                    <span className="text-sm text-muted-foreground">{user.joined}</span>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        title="Edit user"
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <SquarePen className="size-4" />
                      </button>
                      <button
                        type="button"
                        title={user.status === 'Banned' ? 'Unban user' : 'Ban user'}
                        onClick={() => setBanTarget(user)}
                        className={`transition-colors cursor-pointer ${
                          user.status === 'Banned'
                            ? 'text-danger'
                            : 'text-muted-foreground hover:text-danger'
                        }`}
                      >
                        <Ban className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex}–{endIndex} of {TOTAL_USERS.toLocaleString()} users
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
      title={banTarget?.status === 'Banned' ? 'Unban User' : 'Ban User'}
      description={banTarget?.status === 'Banned'
        ? `Are you sure you want to unban ${banTarget?.name}? They will regain access to the platform.`
        : `Are you sure you want to ban ${banTarget?.name}? They will lose access to the platform.`
      }
      confirmLabel={banTarget?.status === 'Banned' ? 'Unban' : 'Ban'}
      variant={banTarget?.status === 'Banned' ? 'warning' : 'danger'}
      onConfirm={() => banTarget && toggleBan(banTarget.id)}
      onCancel={() => setBanTarget(null)}
    />
    </>
  )
}
