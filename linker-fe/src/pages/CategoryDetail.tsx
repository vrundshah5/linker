import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Bell, Globe, Plus, Copy, Trash2, MoreVertical } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'

type Tab = 'all' | 'favorites' | 'archived'

interface LinkItem {
  id: number
  title: string
  url: string
  tags: string[]
  date: string
  favicon?: string
  tab: Tab[]
}

const MOCK_LINKS: LinkItem[] = [
  {
    id: 1,
    title: 'Dribbble - Discover the Worlds Top Designers & Creative Professionals',
    url: 'https://dribbble.com',
    tags: ['Design', 'Inspiration'],
    date: 'Oct 24',
    tab: ['all', 'favorites'],
  },
  {
    id: 2,
    title: 'Behance :: Best of Behance',
    url: 'https://behance.net',
    tags: ['Design'],
    date: 'Oct 22',
    tab: ['all', 'favorites'],
  },
  {
    id: 3,
    title: 'Awwwards - Website Awards - Best Web Design Trends',
    url: 'https://awwwards.com',
    tags: ['Web', 'Inspiration'],
    date: 'Oct 20',
    tab: ['all'],
  },
  {
    id: 4,
    title: 'Mobbin - The worlds largest mobile app design reference library',
    url: 'https://mobbin.com',
    tags: ['Mobile', 'UX'],
    date: 'Oct 15',
    tab: ['all', 'favorites'],
  },
  {
    id: 5,
    title: 'Godly - Website inspiration',
    url: 'https://godly.website',
    tags: ['Web'],
    date: 'Oct 10',
    tab: ['all', 'archived'],
  },
  {
    id: 6,
    title: 'Lapa Ninja - Landing Page Inspiration',
    url: 'https://lapa.ninja',
    tags: ['Landing'],
    date: 'Oct 05',
    tab: ['all', 'archived'],
  },
]

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'all', label: 'All Links', count: 42 },
  { key: 'favorites', label: 'Favorites', count: 12 },
  { key: 'archived', label: 'Archived', count: 3 },
]

// Derive a display name from the route param
function formatName(slug: string | undefined) {
  if (!slug) return 'Category'
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const categoryName = formatName(id)
  const visibleLinks = MOCK_LINKS.filter((l) => l.tab.includes(activeTab))

  return (
    <AppLayout>
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center justify-between gap-4">
        {/* Breadcrumb + title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span className="text-border">›</span>
            <span className="text-foreground font-medium truncate">{categoryName}</span>
          </div>
          <h1
            className="text-2xl font-bold text-foreground leading-tight truncate"
            style={{ fontFamily: 'var(--font-headings)' }}
          >
            {categoryName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Curated list of UI/UX design portfolios and agency websites.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search..."
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
            <Plus className="size-4" />
            Add Link
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-7">
        {/* Tabs */}
        <div className="inline-flex items-center bg-surface border border-border rounded-full p-1 mb-6">
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                activeTab === key
                  ? 'bg-secondary text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
              <span
                className={`ml-1.5 text-xs ${
                  activeTab === key ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                ({count})
              </span>
            </button>
          ))}
        </div>

        {/* Links list */}
        <div className="flex flex-col gap-3">
          {visibleLinks.map((link) => (
            <div
              key={link.id}
              className="group flex items-center gap-4 px-5 py-4 bg-surface border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
            >
              {/* Favicon / Globe */}
              <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                {link.favicon ? (
                  <img src={link.favicon} alt="" className="size-5 rounded" />
                ) : (
                  <Globe className="size-5 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{link.title}</p>
                <a
                  href={`https://${link.url.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate block mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.url}
                </a>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 shrink-0">
                {link.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary text-primary text-xs font-bold rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Date */}
              <span className="text-sm text-muted-foreground shrink-0 w-14 text-right">
                {link.date}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Copy link"
                  onClick={() => navigator.clipboard.writeText(link.url)}
                  className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Copy className="size-4" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  type="button"
                  title="More options"
                  className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <MoreVertical className="size-4" />
                </button>
              </div>
            </div>
          ))}

          {visibleLinks.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No links in this section yet.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
