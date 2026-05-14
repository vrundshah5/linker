import { useState } from 'react'
import { Search, Bell, UserMinus, ChevronDown } from 'lucide-react'
import ProjectLayout from '../components/layouts/ProjectLayout'

type Role = 'Admin' | 'Editor' | 'Viewer'

interface Member {
  id: number
  name: string
  email: string
  role: Role
  isYou: boolean
  avatarColor: string
  initials: string
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Jason Doe',
    email: 'jason@example.com',
    role: 'Admin',
    isYou: true,
    avatarColor: 'bg-warning/20 text-warning',
    initials: 'JD',
  },
  {
    id: 2,
    name: 'Sarah Connor',
    email: 'sarah@acme.com',
    role: 'Editor',
    isYou: false,
    avatarColor: 'bg-success/15 text-success',
    initials: 'SC',
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john@acme.com',
    role: 'Viewer',
    isYou: false,
    avatarColor: 'bg-primary/15 text-primary',
    initials: 'JS',
  },
  {
    id: 4,
    name: 'Emma Watson',
    email: 'emma@agency.co',
    role: 'Editor',
    isYou: false,
    avatarColor: 'bg-danger/10 text-danger',
    initials: 'EW',
  },
]

const ROLES: Role[] = ['Admin', 'Editor', 'Viewer']

export default function ProjectTeamMembers() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [search, setSearch] = useState('')

  function updateRole(id: number, role: Role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const visible = members.filter(
    (m) =>
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ProjectLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">Team Members</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage who has access to this project.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>

            <button
              type="button"
              className="size-10 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <Bell className="size-5" />
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Invite Member
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[1fr_220px_160px] px-6 py-3 border-b border-border">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Member
              </span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Role
              </span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {visible.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[1fr_220px_160px] items-center px-6 py-4"
                >
                  {/* Member info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${member.avatarColor}`}
                    >
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{member.name}</span>
                        {member.isYou && (
                          <span className="px-2 py-0.5 bg-secondary text-primary text-[10px] font-bold rounded-full tracking-wide">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Role dropdown */}
                  <div>
                    <div className="relative inline-flex items-center">
                      <select
                        value={member.role}
                        disabled={member.isYou}
                        onChange={(e) => updateRole(member.id, e.target.value as Role)}
                        className={`appearance-none pl-4 pr-8 py-2 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-colors ${
                          member.isYou ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-primary/40'
                        }`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    {!member.isYou && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-danger transition-colors cursor-pointer"
                      >
                        <UserMinus className="size-4" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {visible.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No members match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}
