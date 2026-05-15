import { useState } from 'react'
import {
  Activity,
  DollarSign,
  Link2,
  Shield,
  Download,
  Database,
  Ban,
  TriangleAlert,
  FolderPlus,
  ArrowRight,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'

const EXPORTS = [
  {
    id: 1,
    title: 'User Engagement Report',
    description: 'Detailed breakdown of DAU, MAU, and feature usage.',
    icon: Activity,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    title: 'Financial Summary',
    description: 'Revenue from Pro subscriptions and churn rate.',
    icon: DollarSign,
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
  },
  {
    id: 3,
    title: 'Link Analytics',
    description: 'Most shared domains, total link volume, and dead links.',
    icon: Link2,
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
  },
  {
    id: 4,
    title: 'Security & Audit Log',
    description: 'Failed login attempts, banned users, and system errors.',
    icon: Shield,
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
  },
]

const ACTIVITY_LOG = [
  {
    id: 1,
    title: 'System Backup Completed',
    by: 'By System',
    time: '10 mins ago',
    icon: Database,
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
  },
  {
    id: 2,
    title: 'User John Doe Banned',
    by: 'By Admin Root',
    time: '1 hour ago',
    icon: Ban,
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
  },
  {
    id: 3,
    title: 'API Rate Limit Exceeded',
    by: 'By System',
    time: '3 hours ago',
    icon: TriangleAlert,
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
  },
  {
    id: 4,
    title: 'New Global Category Added',
    by: 'By Admin Root',
    time: 'Yesterday',
    icon: FolderPlus,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
]

export default function AdminSystemReports() {
  const [search, setSearch] = useState('')

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        <PageHeader
          title="System Reports"
          subtitle="Export data and view automated system analytics."
          searchValue={search}
          onSearch={setSearch}
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Available Exports */}
          <h2 className="text-base font-bold text-foreground mb-4">Available Exports</h2>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {EXPORTS.map(({ id, title, description, icon: Icon, iconBg, iconColor }) => (
              <div
                key={id}
                className="flex items-center gap-4 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/25 hover:shadow-sm transition-all"
              >
                {/* Icon */}
                <div className={`size-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`size-5 ${iconColor}`} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-snug">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>

                {/* Download */}
                <button
                  type="button"
                  title="Download report"
                  className="size-9 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer shrink-0"
                >
                  <Download className="size-4.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Recent Activity Log */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Recent Activity Log</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-75 transition-opacity cursor-pointer"
            >
              View Full Log
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
            {ACTIVITY_LOG.map(({ id, title, by, time, icon: Icon, iconBg, iconColor }) => (
              <div key={id} className="flex items-center gap-4 px-6 py-5">
                <div className={`size-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`size-4.5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-snug">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{by}</p>
                </div>
                <span className="text-sm text-muted-foreground shrink-0">{time}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
