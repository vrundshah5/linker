import { useMemo, useState } from 'react'
import { Globe, Loader2, Trash2, CheckSquare, Square } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import { useArchivedLinks } from '../hooks/links/useArchivedLinks'
import { useBulkDeleteLinks } from '../hooks/links/useBulkDeleteLinks'

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return null
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ArchivedLinks() {
  const [activeDomain, setActiveDomain] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data: archivedLinks = [], isLoading, isError } = useArchivedLinks()
  const { mutate: bulkDelete, isPending: deleting } = useBulkDeleteLinks()

  const domainFilters = useMemo(() => {
    const domains = archivedLinks.map((l) => getDomain(l.url))
    return ['All', ...Array.from(new Set(domains)).sort()]
  }, [archivedLinks])

  const visibleLinks = archivedLinks.filter((link) => {
    const matchesDomain =
      activeDomain === 'All' || getDomain(link.url) === activeDomain
    const matchesSearch =
      search.trim() === '' ||
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
    return matchesDomain && matchesSearch
  })

  const headingText = activeDomain === 'All' ? 'Showing All' : `Showing ${activeDomain}`

  const allVisibleIds = visibleLinks.map((l) => l._id)
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id))
  const someSelected = selected.size > 0

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allVisibleIds))
    }
  }

  function handleDeleteSelected() {
    const ids = Array.from(selected)
    bulkDelete(ids, { onSuccess: () => setSelected(new Set()) })
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Archived Links"
            subtitle="Access and manage all your archived resources from across categories."
            searchValue={search}
            onSearch={setSearch}
          />
          {/* Filter by domain */}
          <div className="mb-6">
            <p className="text-sm font-bold text-foreground mb-3">Filter by Domain</p>
            <div className="flex flex-wrap items-center gap-2">
              {domainFilters.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setActiveDomain(domain)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    activeDomain === domain
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-foreground border-border hover:border-primary/40 hover:bg-secondary/50'
                  }`}
                >
                  {domain}
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

              {/* Select-all + delete bar */}
              {visibleLinks.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {allSelected ? (
                    <CheckSquare className="size-4 text-primary" />
                  ) : (
                    <Square className="size-4 text-muted-foreground" />
                  )}
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>

                {someSelected && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger text-sm font-bold rounded-xl hover:bg-danger/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Delete {selected.size} selected
                  </button>
                )}
              </div>
              )}

              {/* Link rows */}
              <div className="flex flex-col gap-3">
                {visibleLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No archived links found.
                  </p>
                ) : (
                  visibleLinks.map((link) => {
                    const favicon = getFavicon(link.url)
                    const isChecked = selected.has(link._id)
                    return (
                      <div
                        key={link._id}
                        className={`flex items-center gap-5 px-6 py-5 bg-surface border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all ${
                          isChecked ? 'border-primary/40 bg-primary/5' : 'border-border'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleOne(link._id)}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          aria-label={isChecked ? 'Deselect' : 'Select'}
                        >
                          {isChecked ? (
                            <CheckSquare className="size-5 text-primary" />
                          ) : (
                            <Square className="size-5" />
                          )}
                        </button>

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

                        {/* Domain tag */}
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full shrink-0">
                          {getDomain(link.url)}
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
