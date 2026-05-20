import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  Sparkle,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  ArrowUpRight,
  Loader2,
  PenTool,
  Code,
  TrendingUp,
  ExternalLink,
  Link2,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useRecentLinks } from '../hooks/links/useRecentLinks'
import { getCategoryIcon } from '../lib/categoryIcons'

/* ── colour helpers for category cards ─────────────────────── */
const CARD_THEMES = [
  { bg: 'bg-primary/10', text: 'text-primary', FallbackIcon: PenTool },
  { bg: 'bg-danger/10', text: 'text-danger', FallbackIcon: Code },
  { bg: 'bg-success/10', text: 'text-success', FallbackIcon: TrendingUp },
]

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: categories, isLoading } = useMyCategories()
  const { data: recentLinks, isLoading: isLoadingRecent } = useRecentLinks(6)
  const user = useCurrentUser()

  const topCategories = categories?.slice(0, 3) ?? []

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto h-full">

        {/* Top bar: search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 bg-surface border border-border rounded-2xl flex items-center px-4 py-3 shadow-sm">
            <Search className="size-5 text-muted-foreground mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search your links..."
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
            />
          </div>
        </div>

          {/* Hero banner */}
          <div className="bg-primary rounded-3xl p-10 mb-8 relative overflow-hidden shadow-lg flex items-center shrink-0">
            <div className="relative z-10 w-2/3">
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3 block">
                LINK MANAGEMENT
              </span>
              <h2
                className="text-4xl font-bold text-white mb-6 leading-tight max-w-lg"
                style={{ fontFamily: 'var(--font-headings)' }}
              >
                Sharpen Your Workflow with Smart Link Organization
              </h2>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-foreground/90 transition-colors cursor-pointer"
              >
                Get Started
                <span className="size-5 bg-background text-foreground rounded-full flex items-center justify-center">
                  <ChevronRight className="size-3" />
                </span>
              </button>
            </div>
            <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" style={{ width: 160, height: 160 }} />
            <Sparkle className="absolute right-1/3 top-10 text-white/20 pointer-events-none" style={{ width: 60, height: 60 }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Category quick-cards */}
          <div className="flex items-center gap-4 mb-8">
            {isLoading && (
              <div className="flex-1 flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && topCategories.map((cat, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length]
              const Icon = getCategoryIcon(cat.icon)
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => navigate(`/categories/${cat._id}`)}
                  className="flex-1 bg-surface rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-transparent hover:border-primary/20 transition-colors cursor-pointer group text-left"
                >
                  <div className={`size-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">{cat.linkCount} links</p>
                    <p className="text-sm font-bold text-foreground">{cat.name}</p>
                  </div>
                  <MoreVertical className="size-4 text-muted-foreground ml-auto" />
                </button>
              )
            })}
            {!isLoading && topCategories.length === 0 && (
              <div className="flex-1 text-center py-6">
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              </div>
            )}
          </div>

          {/* Recently Added Links */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Recently Added
              </h3>
              <div className="flex gap-2">
                <button type="button" className="size-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" className="size-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 cursor-pointer">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {isLoadingRecent && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoadingRecent && (!recentLinks || recentLinks.length === 0) && (
              <div className="bg-surface rounded-3xl border border-border border-dashed flex flex-col items-center justify-center py-12 gap-3">
                <div className="size-12 bg-muted rounded-2xl flex items-center justify-center">
                  <Link2 className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-bold text-foreground">No links yet</p>
                <p className="text-xs text-muted-foreground">Add links to a category and they'll appear here</p>
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="mt-1 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:opacity-90 cursor-pointer"
                >
                  Browse Categories
                </button>
              </div>
            )}

            {!isLoadingRecent && recentLinks && recentLinks.length > 0 && (
              <div className="grid grid-cols-3 gap-6">
                {recentLinks.slice(0, 3).map((link) => {
                  const favicon = getFavicon(link.url)
                  const domain = getDomain(link.url)
                  const cat = link.categoryId
                  const CatIcon = getCategoryIcon(cat?.icon)
                  return (
                    <div
                      key={link._id}
                      className="bg-surface rounded-3xl p-3 shadow-sm border border-transparent hover:border-primary/20 transition-colors cursor-pointer group"
                      onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                    >
                      {/* Thumbnail area */}
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-muted flex items-center justify-center">
                        {favicon ? (
                          <img src={favicon} alt={domain} className="size-16 rounded-xl object-contain" />
                        ) : (
                          <ExternalLink className="size-10 text-muted-foreground/40" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 group-hover:to-black/20 transition-colors" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(`/categories/${cat?._id}`) }}
                          className="absolute top-3 right-3 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold hover:bg-black/50 transition-colors cursor-pointer"
                        >
                          {cat?.name ?? 'Link'}
                        </button>
                      </div>
                      <div className="px-2 pb-2">
                        <span className="text-[10px] text-muted-foreground font-medium mb-1 block truncate">{domain}</span>
                        <h4 className="font-bold text-foreground text-sm leading-snug mb-4 line-clamp-2 h-10">
                          {link.title}
                        </h4>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <CatIcon className="size-4 text-primary" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate">{cat?.name ?? '—'}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDate(link.createdAt)}</span>
                          </div>
                          <ArrowUpRight className="size-4 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Your Categories table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Your Categories
              </h3>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="text-primary text-sm font-bold hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>
            <div className="bg-surface rounded-3xl shadow-sm border border-transparent overflow-hidden">
              {/* Table header */}
              <div className="flex items-center px-6 py-4 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <div className="flex-[2]">Category</div>
                <div className="flex-[1.5]">Links</div>
                <div className="flex-[3]">Created</div>
                <div className="flex-[1] text-right">Open</div>
              </div>
              <div className="flex flex-col p-2">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!isLoading && categories && categories.slice(0, 6).map((cat, i) => {
                  const theme = CARD_THEMES[i % CARD_THEMES.length]
                  const Icon = getCategoryIcon(cat.icon)
                  return (
                    <div
                      key={cat._id}
                      className="flex items-center px-4 py-3 hover:bg-muted/30 rounded-2xl transition-colors cursor-pointer group"
                      onClick={() => navigate(`/categories/${cat._id}`)}
                    >
                      <div className="flex-[2] flex items-center gap-3">
                        <div className={`size-10 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center shrink-0`}>
                          <Icon className="size-5" />
                        </div>
                        <span className="text-sm font-bold text-foreground truncate">{cat.name}</span>
                      </div>
                      <div className="flex-[1.5]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                          {cat.linkCount} {cat.linkCount === 1 ? 'link' : 'links'}
                        </span>
                      </div>
                      <div className="flex-[3]">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(cat.createdAt)}
                        </span>
                      </div>
                      <div className="flex-[1] flex justify-end">
                        <span className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  )
                })}
                {!isLoading && (!categories || categories.length === 0) && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No categories yet. <button type="button" onClick={() => navigate('/categories')} className="text-primary font-bold hover:underline cursor-pointer">Create one</button>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </AppLayout>
  )
}
