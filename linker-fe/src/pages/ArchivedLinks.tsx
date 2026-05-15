import { useMemo, useState } from 'react'
import { Globe, Loader2 } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import { useArchivedLinks } from '../hooks/links/useArchivedLinks'

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ArchivedLinks() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const { data: archivedLinks = [], isLoading, isError } = useArchivedLinks()

  const categoryFilters = useMemo(() => {
    const names = archivedLinks.map((l) => l.categoryId.name)
    return ['All', ...Array.from(new Set(names))]
  }, [archivedLinks])

  const visibleLinks = archivedLinks.filter((link) => {
    const matchesCategory =
      activeFilter === 'All' || link.categoryId.name === activeFilter
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
        <PageHeader
          title="Archived Links"
          subtitle="Access and manage all your archived resources from across categories."
          searchValue={search}
          onSearch={setSearch}
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Filter by category */}
          <div className="mb-6">
            <p className="text-sm font-bold text-foreground mb-3">Filter by Category</p>
            <div className="flex flex-wrap items-center gap-2">
              {categoryFilters.map((filter) => (
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

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive py-8 text-center">Failed to load archived links.</p>
          ) : (
            <>
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
                  visibleLinks.map((link) => {
                    const favicon = getFavicon(link.url)
                    return (
                      <div
                        key={link._id}
                        className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                      >
                        {/* Favicon / Globe icon */}
                        <div className="size-11 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                          {favicon ? (
                            <img
                              src={favicon}
                              alt=""
                              className="size-5"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Globe className="size-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Title + URL */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground leading-snug mb-0.5 truncate">
                            {link.title}
                          </p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary truncate block hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>

                        {/* Category badge */}
                        <span
                          className="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full shrink-0"
                          style={{ borderColor: link.categoryId.themeColor, borderWidth: 1 }}
                        >
                          {link.categoryId.name}
                        </span>

                        {/* Date */}
                        <p className="text-sm text-muted-foreground shrink-0 ml-2">
                          {formatDate(link.createdAt)}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
