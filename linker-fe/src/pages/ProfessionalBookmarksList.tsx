import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { BookMarked, ExternalLink, Globe, Loader2, Folder } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { linkService } from '../services/linkService'
import { queryKeys } from '../constants/queryKeys'
import type { Link } from '../services/linkService'

function FaviconImg({ url }: { url: string }) {
  const [errored, setErrored] = useState(false)
  let hostname = ''
  try { hostname = new URL(url).hostname } catch { /* */ }
  if (!hostname || errored) return <Globe className="size-4 shrink-0 text-muted-foreground/40" />
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
      alt=""
      width={16}
      height={16}
      onError={() => setErrored(true)}
      className="size-4 object-contain shrink-0"
    />
  )
}

type FlatBookmark = Link & { folderName: string; folderColor: string }

export default function ProfessionalBookmarksList() {
  const navigate = useNavigate()
  const { data: categories, isLoading: catsLoading } = useMyCategories('professional')

  const importedFolders = (categories ?? []).filter(
    (c) => c.description === 'Imported from bookmarks',
  )

  const linkQueries = useQueries({
    queries: importedFolders.map((c) => ({
      queryKey: queryKeys.links.byCategory(c._id),
      queryFn: () => linkService.getLinks(c._id),
      enabled: importedFolders.length > 0,
    })),
  })

  const allBookmarks: FlatBookmark[] = importedFolders.flatMap((c, i) =>
    (linkQueries[i]?.data ?? []).map((l) => ({
      ...l,
      folderName: c.name,
      folderColor: c.themeColor,
    })),
  )

  const allLoaded = linkQueries.every((q) => !q.isLoading)
  const totalFolders = importedFolders.length

  return (
    <WorkspaceLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 pt-4 pb-8">
          <PageHeader
            title="Bookmarks"
            subtitle={
              allLoaded
                ? `${allBookmarks.length} bookmark${allBookmarks.length !== 1 ? 's' : ''} in ${totalFolders} folder${totalFolders !== 1 ? 's' : ''}`
                : 'Loading bookmarks…'
            }
            icon={<BookMarked className="size-5" />}
            actions={
              <button
                type="button"
                onClick={() => navigate('/professional-bookmarks')}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <Folder className="size-4" />
                View folders
              </button>
            }
          />

          {catsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : importedFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookMarked className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No bookmarks imported yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the Import page to bring in your browser bookmarks
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_2fr_1fr_40px] gap-4 px-5 py-3 border-b border-border bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">URL</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Folder</p>
                <div />
              </div>

              {!allLoaded && allBookmarks.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : allBookmarks.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No links in bookmark folders yet</p>
                </div>
              ) : (
                allBookmarks.map((b) => {
                  let hostname = b.url
                  try { hostname = new URL(b.url).hostname.replace(/^www\./, '') } catch { /* */ }
                  return (
                    <div
                      key={b._id}
                      className="grid grid-cols-[2fr_2fr_1fr_40px] gap-4 items-center px-5 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      {/* Title */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FaviconImg url={b.url} />
                        <p className="text-sm font-medium text-foreground truncate">{b.title}</p>
                      </div>

                      {/* URL */}
                      <p className="text-xs text-muted-foreground truncate">{hostname}</p>

                      {/* Folder chip */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary truncate">
                        {b.folderName}
                      </span>

                      {/* Open */}
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-primary hover:opacity-75 transition-opacity"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  )
}
