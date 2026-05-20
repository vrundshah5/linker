import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  BarChart2,
  Info,
  ChevronRight,
  Monitor,
  Smartphone,
  Globe,
  Link,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { publicService } from '../services/publicService'
import { queryKeys } from '../constants/queryKeys'

/* ── helpers ──────────────────────────────────────────────── */

function seededRand(seed: number, min: number, max: number): number {
  const x = Math.sin(seed + 1.618) * 10000
  return Math.floor(Math.abs(x - Math.floor(x)) * (max - min + 1)) + min
}

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`
  } catch {
    return null
  }
}

/* ── constants ────────────────────────────────────────────── */

const PERIODS = [
  { label: 'Last 7 days', days: 7, cols: 7 },
  { label: 'Last 30 days', days: 30, cols: 15 },
  { label: 'Last 90 days', days: 90, cols: 12 },
]

/* ── component ────────────────────────────────────────────── */

export default function Insights() {
  const user = useCurrentUser()
  const [periodIdx, setPeriodIdx] = useState(0)
  const period = PERIODS[periodIdx]

  const { data } = useQuery({
    queryKey: queryKeys.publicCollection.byUser(user.id),
    queryFn: () => publicService.getFavorites(user.id),
    enabled: !!user.id,
  })
  const links = data?.links ?? []

  /* deterministic seed based on user id */
  const seed = useMemo(
    () => user.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    [user.id],
  )

  /* chart data */
  const chartData = useMemo(() => {
    return Array.from({ length: period.cols }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (period.cols - 1 - i))
      const views = seededRand(seed + i * 7, 0, 14)
      const clicks = seededRand(seed + i * 3, 0, Math.max(0, Math.floor(views * 0.6)))
      return {
        label:
          period.cols <= 7
            ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : period.cols <= 15
              ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : d.toLocaleDateString('en-US', { month: 'short' }),
        views,
        clicks,
      }
    })
  }, [seed, period.cols])

  const totalViews = chartData.reduce((s, d) => s + d.views, 0)
  const totalClicks = chartData.reduce((s, d) => s + d.clicks, 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'
  const avgDaily = totalViews > 0 ? (totalViews / period.days).toFixed(1) : '0'
  const maxBar = Math.max(...chartData.map((d) => d.views), 1)
  const mostActiveDay = chartData.reduce(
    (best, d) => (d.views > best.views ? d : best),
    chartData[0],
  )

  /* top links with seeded click/view counts */
  const topLinks = useMemo(
    () =>
      links
        .map((l, i) => ({
          ...l,
          views: seededRand(seed + i * 5 + 1, 4, 50),
          clicks: seededRand(seed + i * 11 + 2, 0, 18),
        }))
        .sort((a, b) => b.views - a.views),
    [links, seed],
  )
  const maxLinkViews = Math.max(...topLinks.map((l) => l.views), 1)

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 py-6">

          {/* ── Page header ───────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track how your collection performs over time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="size-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
                <Info className="size-4" />
              </button>
              {/* Period selector */}
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

          {/* ── Stats row ─────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {([
              {
                label: 'Views',
                value: totalViews,
                icon: Eye,
                color: 'text-primary',
                bg: 'bg-primary/10',
                change: '+12%',
                changeColor: 'text-success bg-success/10',
                sub: `${avgDaily} avg / day`,
              },
              {
                label: 'Clicks',
                value: totalClicks,
                icon: MousePointerClick,
                color: 'text-success',
                bg: 'bg-success/10',
                change: '+5%',
                changeColor: 'text-success bg-success/10',
                sub: `${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}% of views`,
              },
              {
                label: 'Click-Through Rate',
                value: `${ctr}%`,
                icon: TrendingUp,
                color: 'text-warning',
                bg: 'bg-warning/10',
                change: null,
                changeColor: '',
                sub: 'Views that became clicks',
              },
            ] as const).map(({ label, value, icon: Icon, color, bg, change, changeColor, sub }) => (
              <div
                key={label}
                className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`size-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  {change && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${changeColor}`}>
                      {change}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Activity chart ────────────────────────────── */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-foreground">Linker activity</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{period.label}</p>
              </div>
              <button className="size-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Chart area */}
            <div className="flex gap-3">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-right pb-6" style={{ height: 200 }}>
                {[14, 10, 7, 4, 0].map((n) => (
                  <span key={n} className="text-[10px] text-muted-foreground leading-none">
                    {n}
                  </span>
                ))}
              </div>

              {/* Bars + x-axis */}
              <div className="flex-1">
                {/* Grid lines + bars */}
                <div
                  className="relative border-b border-border"
                  style={{ height: 200 }}
                >
                  {/* Horizontal grid lines */}
                  {[0.25, 0.5, 0.71, 1].map((frac) => (
                    <div
                      key={frac}
                      className="absolute w-full border-t border-dashed border-border/50"
                      style={{ bottom: `${frac * 100}%` }}
                    />
                  ))}

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end gap-1 px-1 pb-px">
                    {chartData.map((d, i) => (
                      <div
                        key={i}
                        className="flex-1 flex items-end gap-px group cursor-default"
                      >
                        {/* Views bar */}
                        <div
                          className="flex-1 bg-primary rounded-t-sm transition-all group-hover:opacity-80 min-h-[2px]"
                          style={{ height: `${Math.max((d.views / maxBar) * 188, d.views > 0 ? 4 : 0)}px` }}
                          title={`${d.views} views`}
                        />
                        {/* Clicks bar */}
                        <div
                          className="flex-1 bg-success/50 rounded-t-sm transition-all group-hover:opacity-80 min-h-[2px]"
                          style={{ height: `${Math.max((d.clicks / maxBar) * 188, d.clicks > 0 ? 4 : 0)}px` }}
                          title={`${d.clicks} clicks`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex gap-1 px-1 mt-2">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className="text-[9px] text-muted-foreground leading-none">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pl-8">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground font-medium">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-success/50" />
                <span className="text-xs text-muted-foreground font-medium">Clicks</span>
              </div>
            </div>
          </div>

          {/* ── Bottom grid ───────────────────────────────── */}
          <div className="grid grid-cols-[1fr_300px] gap-6 mb-6">

            {/* Top links */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-foreground">Top links</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Most viewed in your collection</p>
                </div>
                <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                  {period.label}
                </span>
              </div>

              {topLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-12 bg-muted rounded-2xl flex items-center justify-center mb-3">
                    <BarChart2 className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">No data yet</p>
                  <p className="text-sm text-muted-foreground">
                    Star some links in your categories to populate your collection
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {topLinks.slice(0, 6).map((link, i) => {
                    const favicon = getFaviconUrl(link.url)
                    return (
                      <div key={link._id} className="flex items-center gap-3 py-3 group">
                        {/* Rank */}
                        <span
                          className={`text-xs font-bold w-5 text-right shrink-0 ${
                            i === 0
                              ? 'text-warning'
                              : i === 1
                                ? 'text-muted-foreground'
                                : i === 2
                                  ? 'text-warning/60'
                                  : 'text-muted-foreground/50'
                          }`}
                        >
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

                        {/* Title + bar */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{link.title}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(link.views / maxLinkViews) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {link.views} views
                            </span>
                          </div>
                        </div>

                        {/* Clicks + external link */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-bold text-foreground">{link.clicks}</span>
                            <p className="text-[10px] text-muted-foreground">clicks</p>
                          </div>
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

              {/* Device breakdown */}
              <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-4">Devices</h2>
                <div className="flex flex-col gap-3">
                  {(
                    [
                      { label: 'Mobile', icon: Smartphone, value: 68, color: 'bg-primary' },
                      { label: 'Desktop', icon: Monitor, value: 27, color: 'bg-success' },
                      { label: 'Other', icon: Globe, value: 5, color: 'bg-muted-foreground' },
                    ] as const
                  ).map(({ label, icon: Icon, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-foreground">{label}</span>
                          <span className="text-xs text-muted-foreground">{value}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-3">Quick stats</h2>
                <div className="flex flex-col">
                  {[
                    { label: 'Avg. daily views', value: avgDaily },
                    {
                      label: 'Most active day',
                      value: mostActiveDay?.label ?? '—',
                    },
                    { label: 'Links in collection', value: links.length },
                    {
                      label: 'Peak views',
                      value: Math.max(...chartData.map((d) => d.views)),
                    },
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

          {/* ── Collection health banner ───────────────────── */}
          <div className="bg-primary rounded-2xl p-6 flex items-center gap-4 mb-6">
            <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base">Grow your reach</p>
              <p className="text-white/70 text-sm mt-0.5">
                Add more links to your collection and share your Linker profile to increase views and clicks.
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
