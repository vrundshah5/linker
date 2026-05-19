import { useState } from 'react'
import {
  Users,
  Folder,
  Link2,
  Star,
  Loader2,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'
import { useAdminStats } from '../hooks/admin/useAdminStats'

const CATEGORY_BAR_COLORS = [
  'bg-primary',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-muted-foreground',
]

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export default function AdminOverview() {
  const [search, setSearch] = useState('')
  const { data: stats, isLoading } = useAdminStats()

  const STATS = [
    {
      label: 'Total Users',
      value: stats ? formatNumber(stats.totalUsers) : '—',
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'User Categories',
      value: stats ? formatNumber(stats.totalCategories) : '—',
      icon: Folder,
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
    },
    {
      label: 'Total Links',
      value: stats ? formatNumber(stats.totalLinks) : '—',
      icon: Link2,
      iconBg: 'bg-warning/15',
      iconColor: 'text-warning',
    },
    {
      label: 'Global Categories',
      value: stats ? formatNumber(stats.activeGlobalCategories) : '—',
      icon: Star,
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
    },
  ]

  const userGrowth = stats?.userGrowth ?? []
  const maxGrowth = Math.max(...userGrowth.map((m) => m.count), 1)
  const categoryDistribution = stats?.categoryDistribution ?? []

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <PageHeader
            title="System Overview"
            subtitle="Monitor platform usage and global statistics."
            searchValue={search}
            onSearch={setSearch}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {STATS.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
              <div
                key={label}
                className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`size-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={`size-5 ${iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-[1fr_1fr] gap-5">

            {/* User Growth bar chart */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground">User Growth</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  New registrations over the last 7 months
                </p>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between gap-2 h-44">
                {userGrowth.map(({ month, count }) => {
                  const pct = maxGrowth > 0 ? Math.round((count / maxGrowth) * 100) : 0
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center" style={{ height: '132px' }}>
                        <div
                          className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-default"
                          style={{ height: `${Math.max(pct, 2)}%` }}
                          title={`${count} users`}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium">{month}</span>
                      <span className="text-[11px] font-bold text-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-base font-bold text-foreground">Category Distribution</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Most popular categories by total links
                  </p>
                </div>
              </div>

              {categoryDistribution.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">No data yet</p>
              ) : (
                <div className="flex flex-col gap-5 mt-6">
                  {categoryDistribution.map(({ name, count, pct }, i) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">{name}</span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {formatNumber(count)} links
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
          )}

        </div>
        </div>
      </div>
    </AdminLayout>
  )
}
