import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookMarked,
  Folder,
  Search,
  Download,
  ExternalLink,
  Link2,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import type { Link } from '../services/linkService'
import { useLinks } from '../hooks/links/useLinks'
import { useDeleteLink } from '../hooks/links/useDeleteLink'
import { useDeleteCategory } from '../hooks/categories/useDeleteCategory'

// ─── Category card with links ────────────────────────────────────────────────

function CategorySection({ categoryId, name, themeColor }: { categoryId: string; name: string; themeColor: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: links = [], isLoading } = useLinks(categoryId)
  const deleteLink = useDeleteLink(categoryId)
  const deleteCategory = useDeleteCategory()
  const [confirmFolderDelete, setConfirmFolderDelete] = useState(false)
  const [confirmLinkId, setConfirmLinkId] = useState<string | null>(null)

  function getFavicon(url: string) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16` } catch { return null }
  }

  function handleDeleteFolder() {
    if (!confirmFolderDelete) { setConfirmFolderDelete(true); return }
    deleteCategory.mutate(categoryId)
  }

  function handleDeleteLink(linkId: string) {
    if (confirmLinkId !== linkId) { setConfirmLinkId(linkId); return }
    deleteLink.mutate(linkId, { onSuccess: () => setConfirmLinkId(null) })
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Accordion header */}
      <div
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors select-none ${isOpen ? 'border-b border-border' : ''}`}
      >
        <div
          className="size-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${themeColor}20` }}
        >
          <Folder className="size-4" style={{ color: themeColor }} />
        </div>
        <p className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">{name}</p>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
          {(links as Link[]).length} link{(links as Link[]).length !== 1 ? 's' : ''}
        </span>
        {/* Delete folder — stops propagation so it doesn't toggle the accordion */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.stopPropagation(); handleDeleteFolder() }}
          onBlur={() => setConfirmFolderDelete(false)}
          disabled={deleteCategory.isPending}
          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
            confirmFolderDelete
              ? 'bg-danger/10 text-danger hover:bg-danger/20'
              : 'text-muted-foreground hover:text-danger hover:bg-danger/10'
          }`}
        >
          <Trash2 className="size-3.5" />
          {confirmFolderDelete ? 'Confirm?' : 'Delete folder'}
        </button>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Links — only rendered when open */}
      {isOpen && (
        isLoading ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs text-muted-foreground">Loading…</p>
          </div>
        ) : (links as Link[]).length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs text-muted-foreground">No links in this folder</p>
          </div>
        ) : (
          (links as Link[]).map((link) => {
            const favicon = getFavicon(link.url)
            let hostname = link.url
            try { hostname = new URL(link.url).hostname.replace(/^www\./, '') } catch { /* */ }
            const isPendingDelete = deleteLink.isPending && confirmLinkId === link._id
            return (
              <div key={link._id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-b-0">
                {favicon
                  ? <img src={favicon} alt="" className="size-4 shrink-0 rounded-sm" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  : <Link2 className="size-4 shrink-0 text-muted-foreground/40" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{hostname}</p>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-75 transition-opacity shrink-0"
                >
                  <ExternalLink className="size-3" />
                  Open
                </a>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleDeleteLink(link._id)}
                  onBlur={() => setConfirmLinkId(null)}
                  disabled={isPendingDelete}
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    confirmLinkId === link._id
                      ? 'bg-danger/10 text-danger hover:bg-danger/20'
                      : 'text-muted-foreground/50 hover:text-danger hover:bg-danger/10'
                  }`}
                >
                  <Trash2 className="size-3.5" />
                  {confirmLinkId === link._id ? 'Confirm?' : 'Delete'}
                </button>
              </div>
            )
          })
        )
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Bookmarks({ variant = 'personal' }: { variant?: 'personal' | 'professional' }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const context = variant === 'professional' ? 'professional' : 'personal'
  const { data: categories, isLoading } = useMyCategories(context)

  // Show only browser-imported bookmark folders
  const importedCategories = (categories ?? []).filter(
    (c) => c.description === 'Imported from bookmarks'
  )

  const filtered = importedCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const importPath = variant === 'professional' ? '/professional-import' : '/import'

  const pageContent = (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-8">
        <PageHeader
          title="Bookmarks"
          subtitle="Browser-imported bookmarks organised by folder"
          actions={
            <button
              type="button"
              onClick={() => navigate(importPath)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <Download className="size-4" />
              Import more
            </button>
          }
        />

        {/* Search */}
        {importedCategories.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search folders…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookMarked className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                {search ? 'No folders match your search' : 'No imported bookmarks yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? 'Try a different search term'
                  : 'Import a bookmarks HTML file from Chrome, Firefox or Safari to get started'}
              </p>
            </div>
            {!search && (
              <button
                type="button"
                onClick={() => navigate(importPath)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Download className="size-4" />
                Import Bookmarks
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((cat) => (
              <CategorySection
                key={cat._id}
                categoryId={cat._id}
                name={cat.name}
                themeColor={cat.themeColor || '#6c5dd3'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return variant === 'professional' ? (
    <WorkspaceLayout>{pageContent}</WorkspaceLayout>
  ) : (
    <AppLayout>{pageContent}</AppLayout>
  )
}
