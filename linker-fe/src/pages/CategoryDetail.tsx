import { useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Globe, Plus, Copy, Trash2, Loader2, Link2, Star, ChevronRight, MoreVertical } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import AddLinkModal from '../components/ui/AddLinkModal'
import { useLinks } from '../hooks/links/useLinks'
import { useDeleteLink } from '../hooks/links/useDeleteLink'
import { useUpdateLink } from '../hooks/links/useUpdateLink'
import { useMyCategories } from '../hooks/categories/useMyCategories'

type Tab = 'all' | 'favorites' | 'archived'

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [modalOpen, setModalOpen] = useState(false)

  const { data: categories } = useMyCategories()
  const category = categories?.find((c) => c._id === id)

  const { data: links = [], isLoading } = useLinks(id ?? '')
  const { mutate: deleteLink } = useDeleteLink(id ?? '')
  const { mutate: updateLink } = useUpdateLink(id ?? '')

  const visibleLinks = links.filter((l) => {
    if (activeTab === 'favorites') return l.isFavorite
    if (activeTab === 'archived') return l.isArchived
    return true
  })

  const tabs = [
    { key: 'all' as Tab, label: 'All Links', count: links.length },
    { key: 'favorites' as Tab, label: 'Favorites', count: links.filter((l) => l.isFavorite).length },
    { key: 'archived' as Tab, label: 'Archived', count: links.filter((l) => l.isArchived).length },
  ]

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground font-bold">
            <RouterLink
              to="/dashboard"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Dashboard
            </RouterLink>
            <ChevronRight className="size-4" />
            <span className="text-foreground">
              {category?.name ?? 'Category'}
            </span>
          </nav>

          {/* Header */}
          <PageHeader
            title={category?.name ?? 'Category'}
            subtitle={category?.description || 'Your saved links.'}
            actions={
              activeTab === 'all' ? (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="size-[18px]" />
                  Add Link
                </button>
              ) : undefined
            }
          />

          {/* Tabs */}
          <div className="inline-flex items-center gap-1 bg-surface p-2 rounded-2xl shadow-sm mb-6">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  activeTab === key
                    ? 'bg-[#f4f7fe] text-primary'
                    : 'text-muted-foreground hover:bg-[#f4f7fe]'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Links list */}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              {visibleLinks.map((link) => {
                const favicon = getFavicon(link.url)
                return (
                  <div
                    key={link._id}
                    className="bg-surface px-5 py-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
                  >
                      {/* Favicon */}
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {favicon ? (
                          <img
                            src={favicon}
                            alt=""
                            className="size-6"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <Globe className="size-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-foreground truncate mb-1">
                          {link.title}
                        </h4>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary truncate hover:underline block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link.url}
                        </a>
                      </div>

                      {/* Date */}
                      <div className="text-sm text-muted-foreground shrink-0 w-24 text-right">
                        {formatDate(link.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Star */}
                        <button
                          type="button"
                          title={link.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          onClick={() => updateLink({ id: link._id, payload: { isFavorite: !link.isFavorite } })}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            link.isFavorite
                              ? 'text-warning !opacity-100'
                              : 'text-muted-foreground hover:text-warning'
                          }`}
                        >
                          <Star className={`size-[18px] ${link.isFavorite ? 'fill-warning' : ''}`} />
                        </button>
                        {/* Copy */}
                        <button
                          type="button"
                          title="Copy link"
                          onClick={() => navigator.clipboard.writeText(link.url)}
                          className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                        >
                          <Copy className="size-[18px]" />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => deleteLink(link._id)}
                          className="p-2 text-muted-foreground hover:text-danger rounded-lg hover:bg-danger/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-[18px]" />
                        </button>
                        {/* More */}
                        <button
                          type="button"
                          title="More options"
                          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        >
                          <MoreVertical className="size-[18px]" />
                        </button>
                      </div>
                  </div>
                )
              })}

              {visibleLinks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Link2 className="size-7 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">No links yet</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {activeTab === 'all' ? 'Add your first link to this category.' : 'No links in this section yet.'}
                  </p>
                  {activeTab === 'all' && (
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Plus className="size-4" />
                      Add Link
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {id && (
        <AddLinkModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          categoryId={id}
        />
      )}
    </AppLayout>
  )
}
