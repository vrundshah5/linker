import { useState } from 'react'
import { Search, Bell, Globe } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'

interface ArchivedLink {
  id: number
  title: string
  url: string
  categories: string[]
  date: string
}

const ARCHIVED_LINKS: ArchivedLink[] = [
  {
    id: 1,
    title: 'Old UI/UX Trends 2022',
    url: 'https://awwwards.com/old-trends',
    categories: ['Design Inspiration'],
    date: 'Jan 15, 2023',
  },
  {
    id: 2,
    title: 'Deprecated React Features',
    url: 'https://reactjs.org/docs/legacy',
    categories: ['Dev Tools'],
    date: 'Mar 10, 2023',
  },
  {
    id: 3,
    title: 'SEO Strategies 2021',
    url: 'https://moz.com/seo-2021',
    categories: ['Marketing'],
    date: 'Feb 28, 2023',
  },
  {
    id: 4,
    title: 'Archived Portfolio V1',
    url: 'https://my-old-portfolio.com',
    categories: ['Design Inspiration', 'Personal'],
    date: 'Dec 05, 2022',
  },
  {
    id: 5,
    title: 'Idea: Social Network for Pets',
    url: 'https://github.com/ideas/1',
    categories: ['Project Ideas'],
    date: 'Aug 12, 2023',
  },
]

const CATEGORY_FILTERS = [
  'All',
  'Design Inspiration',
  'Dev Tools',
  'Marketing',
  'Project Ideas',
  'Read Later',
]

export default function ArchivedLinks() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const visibleLinks = ARCHIVED_LINKS.filter((link) => {
    const matchesCategory =
      activeFilter === 'All' || link.categories.includes(activeFilter)
    const matchesSearch =
      search.trim() === '' ||
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const headingText =
    activeFilter === 'All' ? 'Showing All Categories' : `Showing "${activeFilter}"`

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Archived Links
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Access and manage all your archived resources from across categories.
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
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Filter by category */}
          <div className="mb-6">
            <p className="text-sm font-bold text-foreground mb-3">Filter by Category</p>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-foreground border-border hover:border-primary/40 hover:bg-secondary/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border mb-6" />

          {/* Result heading */}
          <p className="text-base font-bold text-foreground mb-5">
            {headingText}{' '}
            <span className="font-normal text-muted-foreground">
              ({visibleLinks.length} link{visibleLinks.length !== 1 ? 's' : ''})
            </span>
          </p>

          {/* Link rows */}
          <div className="flex flex-col gap-3">
            {visibleLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No archived links found.
              </p>
            ) : (
              visibleLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Globe icon */}
                  <div className="size-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Globe className="size-5 text-muted-foreground" />
                  </div>

                  {/* Title + URL */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground leading-snug mb-0.5 truncate">
                      {link.title}
                    </p>
                    <p className="text-xs text-primary truncate">{link.url}</p>
                  </div>

                  {/* Category badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {link.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-sm text-muted-foreground shrink-0 ml-2">{link.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
