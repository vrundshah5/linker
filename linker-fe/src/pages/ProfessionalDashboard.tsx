import { useState } from 'react'
import { Briefcase, Users, Link2, Search, Plus } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import BellButton from '../components/ui/BellButton'

interface Project {
  id: number
  name: string
  lastActive: string
  role: 'ADMIN' | 'MEMBER'
  iconBg: string
  iconColor: string
  members: string[]
  extraMembers: number
  links: number
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Acme Corp Redesign',
    lastActive: '2 hours ago',
    role: 'ADMIN',
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
    members: ['SC', 'JS', 'EW'],
    extraMembers: 2,
    links: 24,
  },
  {
    id: 2,
    name: 'Marketing Q4 Campaign',
    lastActive: 'Yesterday',
    role: 'MEMBER',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    members: ['SC', 'JS', 'EW'],
    extraMembers: 9,
    links: 45,
  },
  {
    id: 3,
    name: 'Internal Wiki Migration',
    lastActive: '3 days ago',
    role: 'ADMIN',
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
    members: ['SC', 'JS', 'EW'],
    extraMembers: 0,
    links: 8,
  },
]

const AVATAR_COLORS = [
  'bg-warning/20 text-warning',
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-danger/10 text-danger',
]

interface ActivityItem {
  id: number
  avatar: string
  avatarColor: string
  text: string
  projectName: string
  projectColor: string
  time: string
}

const ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    avatar: 'SC',
    avatarColor: 'bg-warning/20 text-warning',
    text: 'added 3 new links to',
    projectName: 'Acme Corp Redesign',
    projectColor: 'text-warning',
    time: '2 hours ago',
  },
  {
    id: 2,
    avatar: 'JS',
    avatarColor: 'bg-primary/15 text-primary',
    text: 'commented on a resource in',
    projectName: 'Marketing Q4 Campaign',
    projectColor: 'text-primary',
    time: '5 hours ago',
  },
  {
    id: 3,
    avatar: 'EW',
    avatarColor: 'bg-success/15 text-success',
    text: 'invited a new team member to',
    projectName: 'Internal Wiki Migration',
    projectColor: 'text-success',
    time: 'Yesterday',
  },
]

const ACTIVITY_NAMES: Record<string, string> = {
  SC: 'Sarah Connor',
  JS: 'John Smith',
  EW: 'Emma Watson',
}

export default function ProfessionalDashboard() {
  const [search, setSearch] = useState('')

  const visibleProjects = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                Welcome to your Workspace,{' '}
                <span className="text-warning">Jason</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                You have 3 active projects and 12 unread notifications. Let's get to work.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-warning text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              New Project
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Briefcase, label: 'Active Projects', value: 3 },
              { icon: Users, label: 'Collaborators', value: 18 },
              { icon: Link2, label: 'Total Links', value: 77 },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-5 bg-surface border border-border rounded-2xl"
              >
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Your Projects */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl w-52 focus-within:border-warning transition-colors">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-surface border border-border rounded-2xl p-6 hover:border-warning/40 hover:shadow-sm transition-all cursor-pointer"
                >
                  {/* Icon + Role badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`size-12 rounded-2xl ${project.iconBg} flex items-center justify-center`}
                    >
                      <Briefcase className={`size-6 ${project.iconColor}`} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        project.role === 'ADMIN'
                          ? 'bg-secondary text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {project.role}
                    </span>
                  </div>

                  {/* Name + last active */}
                  <p className="text-base font-bold text-foreground mb-1">{project.name}</p>
                  <p className="text-xs text-muted-foreground mb-5">
                    Last active {project.lastActive}
                  </p>

                  {/* Members + link count */}
                  <div className="flex items-center justify-between">
                    {/* Stacked avatars */}
                    <div className="flex items-center">
                      {project.members.map((initials, i) => (
                        <div
                          key={initials + i}
                          className={`size-7 rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-surface ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          } ${i > 0 ? '-ml-2' : ''}`}
                        >
                          {initials}
                        </div>
                      ))}
                      {project.extraMembers > 0 && (
                        <div className="size-7 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-surface -ml-2">
                          +{project.extraMembers}
                        </div>
                      )}
                    </div>

                    {/* Link count */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Link2 className="size-4" />
                      <span className="text-sm font-semibold">{project.links}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-5">Recent Activity</h2>
            <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
              {ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-5">
                  {/* Avatar */}
                  <div
                    className={`size-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${item.avatarColor}`}
                  >
                    {item.avatar}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{ACTIVITY_NAMES[item.avatar]}</span>{' '}
                      {item.text}{' '}
                      <span className={`font-bold ${item.projectColor}`}>
                        {item.projectName}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>

                  {/* View button */}
                  <button
                    type="button"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
