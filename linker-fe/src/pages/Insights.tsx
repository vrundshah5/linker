import { useState, useMemo } from 'react'
import {
  Link2,
  Heart,
  FolderOpen,
  BarChart2,
  Info,
  ArrowUpRight,
  Sparkles,
  Link,
  Loader2,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useLinkStats } from '../hooks/links/useLinkStats'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { useRecentLinks } from '../hooks/links/useRecentLinks'
import { getCategoryIcon } from '../lib/categoryIcons'

/* ── helpers ────────────────────────────────────────────────── */

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`
  } catch {
    return null
  }
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

/* ── constants ─────────────────────────────────────────────── */

const PERIODS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

const CATEGORY_COLORS = [
  'bg-primary',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-muted-foreground',
]

/* ── component ─────────────────────────────────────────────── */

export default function Insights() {
  const user = useCurrentUser()
  const [periodIdx, setPeriodIdx] = useState(1)
  const period = PERIODS[periodIdx]

  const { data: stats, isLoading: isLoadingStats } = useLinkStats(period.days)
  const { data: categories } = useMyCategories()
  const { data: recentLinks } = useRecentLinks(50)

  /* Build full daily array — fill 0 for days with no activity */
  const chartData = useMemo(() => {
    if (!stats) return []
    const dailyMap = new Map((stats.daily ?? []).map((d) => [d._id, d.count]))
    const cols = period.days <= 7 ? period.days : period.days <= 30 ? period.days : 30
    const step = period.days <= 30 ? 1 : Math.ceil(period.days / cols)

    return Array.from({ length: cols }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (cols - 1 - i) * step)
      const key = d.toISOString().slice(0, 10)
      const count =
        step === 1
          ? (dailyMap.get(key) ?? 0)
          : (() => {
              let total = 0
              for (let s = 0; s < step; s++) {
                const dd = new Date(d)
                dd.setDate(dd.getDate() - s)
                total += dailyMap.get(dd.toISOString().slice(0, 10)) ?? 0
              }
              return total
            })()
      return {
        label:
          period.days <= 7
            ? d.toLocaleDateString('en-US', { weekday: 'short' })
            : period.days <= 30
              ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : d.toLocaleDateString('en-US', { month: 'short' }),
        count,
      }
    })
  }, [stats, period.days])

  const chartMax = Math.max(...chartData.map((d) => d.count), 1)
  const totalAdded = chartData.reduce((s, d) => s + d.count, 0)
  const avgDaily = totalAdded > 0 ? (totalAdded / period.days).toFixed(1) : '0'
  const mostActiveDay = chartData.reduce(
    (best, d) => (d.count > best.count ? d : best),
    chartData[0] ?? { label: '—', count: 0 },
  )

  const yMax = chartMax
  const yTicks =
    yMax <= 3 ? [0, 1, 2, 3] :
    yMax <= 6 ? [0, 2, 4, 6] :
    yMax <= 10 ? [0, 3, 6, 10] :
    [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax]

  /* Favourite links */
  const favoriteLinks = useMemo(
    () => (recentLinks ?? []).filter((l) => l.isFavorite),
    [recentLinks],
  )

  /* Category breakdown */
  const catBreakdown = stats?.categoryBreakdown ?? []
  const catMax = Math.max(...catBreakdown.map((c) => c.count), 1)

  const isLoading = isLoadingStats

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 py-6">

          {/* ── Page header ────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track your link-saving activity over time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="size-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
                <Info className="size-4" />
              </button>
              <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
                {PERIODS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setPeriodIdx(i)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      periodIdx === i
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stats row ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {([
              {
                label: 'Total Links',
                value: isLoading ? '—' : (stats?.totalLinks ?? 0),
                icon: Link2,
                color: 'text-primary',
                bg: 'bg-primary/10',
                sub: `${stats?.totalArchived ?? 0} archived`,
              },
              {
                label: 'Starred Links',
                value: isLoading ? '—' : (stats?.totalFavorites ?? 0),
                icon: Heart,
                color: 'text-danger',
                bg: 'bg-danger/10',
                sub: 'Marked as favourite',
              },
              {
                label: 'Categories',
                value: isLoading ? '—' : (categories?.length ?? 0),
                icon: FolderOpen,
                color: 'text-warning',
                bg: 'bg-warning/10',
                sub: `${totalAdded} added in period`,
              },
            ] as const).map(({ label, value, icon: Icon, color, bg, sub }) => (
              <div
                key={label}
                className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`size-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                </div>
                {isLoading ? (
                  <div className="h-9 flex items-center">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-foreground">{value}</p>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Activity chart ─────────────────────────────── */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-foreground">Links added</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{period.label}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{totalAdded}</span>
                <span className="text-xs text-muted-foreground">total added</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center" style={{ height: 200 }}>
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex gap-3">
                {/* Y-axis */}
                <div className="relative w-6 shrink-0" style={{ height: 200 }}>
                  {yTicks.map((n) => (
                    <span
                      key={n}
                      className="absolute right-0 text-[10px] text-muted-foreground leading-none -translate-y-1/2"
                      style={{ bottom: `${(n / yMax) * 100}%` }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Bars + x-axis */}
                <div className="flex-1">
                  <div className="relative border-b border-border" style={{ height: 200 }}>
                    {/* Grid lines */}
                    {yTicks.filter((n) => n > 0).map((n) => (
                      <div
                        key={n}
                        className="absolute w-full border-t border-dashed border-border/50"
                        style={{ bottom: `${(n / yMax) * 100}%` }}
                      />
                    ))}

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end gap-1 px-1">
                      {chartData.map((d, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full flex items-end group cursor-default"
                          title={`${d.label}: ${d.count} link${d.count !== 1 ? 's' : ''} added`}
                        >
                          <div
                            className="w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary/70"
                            style={{ height: d.count > 0 ? `${Math.max((d.count / yMax) * 100, 2)}%` : '0%' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex gap-1 px-1 mt-2">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex-1 text-center">
                        <span className="text-[9px] text-muted-foreground leading-none">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pl-8">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground font-medium">Links added</span>
              </div>
            </div>
          </div>

          {/* ── Bottom grid ────────────────────────────────── */}
          <div className="grid grid-cols-[1fr_300px] gap-6 mb-6">

            {/* Starred links */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-foreground">Starred links</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Links you've marked as favourite</p>
                </div>
                <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                  {stats?.totalFavorites ?? 0} total
                </span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : favoriteLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-12 bg-muted rounded-2xl flex items-center justify-center mb-3">
                    <BarChart2 className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">No starred links</p>
                  <p className="text-sm text-muted-foreground">
                    Star links in your categories to see them here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {favoriteLinks.slice(0, 6).map((link, i) => {
                    const favicon = getFaviconUrl(link.url)
                    const CatIcon = getCategoryIcon(link.categoryId?.icon)
                    return (
                      <div key={link._id} className="flex items-center gap-3 py-3 group">
                        {/* Rank */}
                        <span className="text-xs font-bold w-5 text-right shrink-0 text-muted-foreground/50">
                          {i + 1}
                        </span>

                        {/* Favicon */}
                        <div className="size-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          {favicon ? (
                            <img
                              src={favicon}
                              alt=""
                              className="size-4"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          ) : (
                            <Link className="size-4 text-muted-foreground" />
                          )}
                        </div>

                        {/* Title + domain */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{link.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{getDomain(link.url)}</p>
                        </div>

                        {/* Category + open */}
                        <div className="flex items-center gap-2 shrink-0">
                          {link.categoryId && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                              <CatIcon className="size-3 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]">
                                {link.categoryId.name}
                              </span>
                            </div>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">

              {/* Category breakdown */}
              <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-4">By category</h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : catBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No data yet</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {catBreakdown.map((cat, i) => {
                      const Icon = getCategoryIcon(cat.icon)
                      return (
                        <div key={cat._id ?? i} className="flex items-center gap-3">
                          <Icon className="size-4 text-muted-foreground shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
                                {cat.name ?? 'Unnamed'}
                              </span>
                              <span className="text-xs text-muted-foreground">{cat.count}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} rounded-full transition-all`}
                                style={{ width: `${(cat.count / catMax) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-3">Quick stats</h2>
                <div className="flex flex-col">
                  {[
                    { label: 'Avg. added / day', value: avgDaily },
                    { label: 'Most active day', value: mostActiveDay.count > 0 ? mostActiveDay.label : '—' },
                    { label: 'Archived links', value: stats?.totalArchived ?? '—' },
                    { label: 'Added in period', value: totalAdded },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-sm font-bold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Banner ─────────────────────────────────────── */}
          <div className="bg-primary rounded-2xl p-6 flex items-center gap-4 mb-6">
            <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base">Share your collection</p>
              <p className="text-white/70 text-sm mt-0.5">
                Share your Linker profile so others can discover your starred links.
              </p>
            </div>
            <a
              href={`${window.location.origin}/c/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              View profile
              <ArrowUpRight className="size-4" />
            </a>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
