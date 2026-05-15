import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Globe, Plus, Copy, Trash2, Loader2, Link2, Star } from 'lucide-react'
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
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
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
        <PageHeader
          title={category?.name ?? 'Category'}
          subtitle={category?.description || 'Your saved links.'}
          actions={
            activeTab === 'all' ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="size-4" />
                Add Link
              </button>
            ) : undefined
          }
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Tabs */}
          <div className="inline-flex items-center bg-surface border border-border rounded-full p-1 mb-6">
            {tabs.map(({ key, label, count }) => (
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
                <span className={`ml-1.5 text-xs ${activeTab === key ? 'text-primary' : 'text-muted-foreground'}`}>
                  ({count})
                </span>
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
            <div className="flex flex-col gap-3">
              {visibleLinks.map((link) => {
                const favicon = getFavicon(link.url)
                return (
                  <div
                    key={link._id}
                    className="group flex items-center gap-4 px-5 py-4 bg-surface border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    {/* Favicon */}
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt=""
                          className="size-5"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <Globe className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate block mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.url}
                      </a>
                      {link.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{link.description}</p>
                      )}
                    </div>

                    {/* Date */}
                    <span className="text-sm text-muted-foreground shrink-0 w-14 text-right">
                      {formatDate(link.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Star — always visible when favorited, otherwise shown on hover */}
                      <button
                        type="button"
                        title={link.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={() => updateLink({ id: link._id, payload: { isFavorite: !link.isFavorite } })}
                        className={`size-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          link.isFavorite
                            ? 'text-warning'
                            : 'text-muted-foreground hover:text-warning opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Star className={`size-4 ${link.isFavorite ? 'fill-warning' : ''}`} />
                      </button>
                      <button
                        type="button"
                        title="Copy link"
                        onClick={() => navigator.clipboard.writeText(link.url)}
                        className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Copy className="size-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => deleteLink(link._id)}
                        className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
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
