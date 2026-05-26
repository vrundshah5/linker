import { useEffect, useRef, useState } from 'react'
import {
  X,
  Upload,
  Folder,
  Link2,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

// ─── Bookmark parser ──────────────────────────────────────────────────────────

export interface FlatBookmark {
  folder: string
  title: string
  url: string
}

function walkDL(dl: Element, pathParts: string[]): FlatBookmark[] {
  const results: FlatBookmark[] = []
  const visited = new Set<Element>()

  for (const child of dl.children) {
    if (visited.has(child)) continue

    if (child.tagName === 'DT') {
      const a = child.querySelector('a')
      const h3 = child.querySelector('h3')

      if (a) {
        const href = a.getAttribute('href') || ''
        if (/^https?:\/\//i.test(href)) {
          results.push({
            folder: pathParts.length > 0 ? pathParts.join(' > ') : 'Imported Bookmarks',
            title: (a.textContent || '').trim() || href,
            url: href,
          })
        }
      } else if (h3) {
        const folderName = (h3.textContent || '').trim() || 'Unnamed Folder'
        const nextSibling = child.nextElementSibling
        if (nextSibling && nextSibling.tagName === 'DL') {
          visited.add(nextSibling)
          results.push(...walkDL(nextSibling, [...pathParts, folderName]))
        }
      }
    }
  }

  return results
}

function parseBookmarksHtml(html: string): FlatBookmark[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const rootDL = doc.querySelector('dl')
  if (!rootDL) return []
  return walkDL(rootDL, [])
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FolderGroup {
  name: string
  links: FlatBookmark[]
}

interface ImportResult {
  categoriesCreated: number
  linksImported: number
}

interface Props {
  open: boolean
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImportBookmarksModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const [isDragging, setIsDragging] = useState(false)
  const [parseError, setParseError] = useState('')
  const [groups, setGroups] = useState<FolderGroup[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)

  // Reset state when opened/closed
  useEffect(() => {
    if (!open) {
      setGroups([])
      setExpandedFolders(new Set())
      setParseError('')
      setImportError('')
      setResult(null)
      setIsImporting(false)
    }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function processFile(file: File) {
    setParseError('')
    setGroups([])
    setResult(null)

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      setParseError('Please select a bookmarks HTML file (.html)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const html = e.target?.result as string
      const bookmarks = parseBookmarksHtml(html)

      if (bookmarks.length === 0) {
        setParseError('No bookmarks found in this file. Make sure it is exported from your browser.')
        return
      }

      // Group by folder
      const groupMap = new Map<string, FlatBookmark[]>()
      for (const bm of bookmarks) {
        if (!groupMap.has(bm.folder)) groupMap.set(bm.folder, [])
        groupMap.get(bm.folder)!.push(bm)
      }

      const grouped: FolderGroup[] = Array.from(groupMap.entries()).map(([name, links]) => ({
        name,
        links,
      }))

      setGroups(grouped)
      // Auto-expand when there is only one folder
      if (grouped.length === 1) setExpandedFolders(new Set([grouped[0].name]))
    }
    reader.readAsText(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function toggleFolder(name: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  async function handleImport() {
    if (groups.length === 0 || isImporting) return
    setImportError('')
    setIsImporting(true)

    const items: FlatBookmark[] = groups.flatMap((g) => g.links)

    try {
      const res = await linkService.importBookmarks(items)
      setResult(res)
      // Invalidate categories + links so the sidebar / pages refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setImportError(axiosErr?.response?.data?.message || 'Import failed. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const totalLinks = groups.reduce((sum, g) => sum + g.links.length, 0)

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-bold text-foreground">Import Bookmarks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload a bookmarks HTML file exported from your browser
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Success state */}
          {result ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="size-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="size-7 text-success" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">Import complete!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-foreground font-semibold">{result.linksImported}</span> bookmark{result.linksImported !== 1 ? 's' : ''} imported
                  {result.categoriesCreated > 0 && (
                    <> across <span className="text-foreground font-semibold">{result.categoriesCreated}</span> new folder{result.categoriesCreated !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {groups.length > 0 ? 'Replace file' : 'Upload bookmarks file'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Drag & drop or click to select — export from Chrome, Firefox, Safari, or Edge
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Parse error */}
              {parseError && (
                <div className="flex items-center gap-2 text-danger">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <p className="text-xs font-medium">{parseError}</p>
                </div>
              )}

              {/* Preview tree */}
              {groups.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Preview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalLinks} bookmark{totalLinks !== 1 ? 's' : ''} · {groups.length} folder{groups.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    {groups.map((group, idx) => {
                      const isExpanded = expandedFolders.has(group.name)
                      return (
                        <div key={group.name} className={idx !== 0 ? 'border-t border-border' : ''}>
                          {/* Folder row */}
                          <button
                            type="button"
                            onClick={() => toggleFolder(group.name)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                          >
                            {isExpanded
                              ? <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                              : <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                            }
                            <Folder className="size-3.5 shrink-0 text-primary" />
                            <span className="flex-1 min-w-0 text-xs font-semibold text-foreground truncate">
                              {group.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              {group.links.length}
                            </span>
                          </button>

                          {/* Bookmark rows */}
                          {isExpanded && (
                            <div className="border-t border-border/50">
                              {group.links.slice(0, 50).map((link, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2.5 pl-9 pr-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/30 transition-colors"
                                >
                                  <Link2 className="size-3 shrink-0 text-muted-foreground/60" />
                                  <span className="flex-1 min-w-0 truncate">{link.title}</span>
                                </div>
                              ))}
                              {group.links.length > 50 && (
                                <p className="pl-9 pr-3 py-1.5 text-[11px] text-muted-foreground/60 italic">
                                  +{group.links.length - 50} more
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Import error */}
              {importError && (
                <div className="flex items-center gap-2 text-danger">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <p className="text-xs font-medium">{importError}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={groups.length === 0 || isImporting}
              onClick={handleImport}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isImporting && <Loader2 className="size-3.5 animate-spin" />}
              {isImporting ? 'Importing…' : `Import ${totalLinks > 0 ? totalLinks + ' bookmarks' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
