import { useState } from 'react'
import {
  Users,
  Folder,
  Link2,
  Star,
  TrendingUp,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'

// ── Stat cards ────────────────────────────────────────────────
const STATS = [
  {
    label: 'Total Users',
    value: '24,592',
    change: '+12%',
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label: 'Active Categories',
    value: '8,234',
    change: '+5%',
    icon: Folder,
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
  },
  {
    label: 'Total Links Shared',
    value: '142,093',
    change: '+22%',
    icon: Link2,
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
  },
  {
    label: 'Pro Subscriptions',
    value: '3,412',
    change: '+8%',
    icon: Star,
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
  },
]

// ── Bar chart data ─────────────────────────────────────────────
const CHART_DATA = [
  { month: 'Jan', pct: 42 },
  { month: 'Feb', pct: 55 },
  { month: 'Mar', pct: 47 },
  { month: 'Apr', pct: 66 },
  { month: 'May', pct: 61 },
  { month: 'Jun', pct: 76 },
  { month: 'Jul', pct: 88 },
]

// ── Category distribution ──────────────────────────────────────
const CATEGORIES = [
  { name: 'Design Inspiration', count: '24k', pct: 100, color: 'bg-primary' },
  { name: 'Dev Tools', count: '18k', pct: 75, color: 'bg-success' },
  { name: 'Marketing', count: '12k', pct: 50, color: 'bg-warning' },
  { name: 'Project Ideas', count: '8k', pct: 33, color: 'bg-danger' },
  { name: 'Read Later', count: '5k', pct: 21, color: 'bg-muted-foreground' },
]

const PERIOD_OPTIONS = ['This Year', 'This Month', 'This Week']

export default function AdminOverview() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('This Year')
  const [periodOpen, setPeriodOpen] = useState(false)

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <PageHeader
          title="System Overview"
          subtitle="Monitor platform usage and global statistics."
          searchValue={search}
          onSearch={setSearch}
          actions={
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Generate Report
            </button>
          }
        />
        <div className="flex-1 overflow-y-auto">
        <div className="p-8">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {STATS.map(({ label, value, change, icon: Icon, iconBg, iconColor }) => (
              <div
                key={label}
                className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`size-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={`size-5 ${iconColor}`} />
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                    <TrendingUp className="size-3" />
                    {change}
                  </span>
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
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">User Growth</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    New registrations over the last 7 months
                  </p>
                </div>

                {/* Period dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPeriodOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    {period}
                    <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${periodOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {periodOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-lg z-10 overflow-hidden min-w-[130px]">
                      {PERIOD_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => { setPeriod(opt); setPeriodOpen(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                            opt === period
                              ? 'text-primary bg-secondary'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between gap-2 h-44">
                {CHART_DATA.map(({ month, pct }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '152px' }}>
                      <div
                        className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-default"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-base font-bold text-foreground">Category Distribution</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Most popular category types created by users
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-75 transition-opacity cursor-pointer shrink-0"
                >
                  View All
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-5 mt-6">
                {CATEGORIES.map(({ name, count, pct, color }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">{name}</span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {count} categories
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>
    </AdminLayout>
  )
}
