import { useRef, useState } from 'react'
import {
  Upload,
  Folder,
  Link2,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  ClipboardList,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/layouts/AppLayout'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { linkService } from '../services/linkService'
import { queryKeys } from '../constants/queryKeys'

// ─── Bookmark parser ──────────────────────────────────────────────────────────

export interface FlatBookmark {
  folder: string
  title: string
  url: string
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

/**
 * Parses a Netscape bookmarks HTML file directly from the raw string,
 * avoiding DOMParser quirks (strict HTML5 mode moves <H3> out of <DT>).
 *
 * Scans in order for:
 *   <H3>…</H3>  → push folder onto stack
 *   <A HREF="…">…</A> → record link under current stack path
 *   </DL>       → pop folder from stack
 */
function parseBookmarksHtml(html: string): FlatBookmark[] {
  const results: FlatBookmark[] = []
  const folderStack: string[] = []

  const re = /<H3[^>]*>([^<]*)<\/H3>|<A\b[^>]*\bHREF="([^"]*)"[^>]*>([^<]*)<\/A>|<\/DL>/gi
  let m: RegExpExecArray | null

  while ((m = re.exec(html)) !== null) {
    if (m[1] !== undefined) {
      // Folder name
      folderStack.push(decodeEntities(m[1].trim()) || 'Unnamed Folder')
    } else if (m[2] !== undefined) {
      // Bookmark link
      const href = m[2]
      if (/^https?:\/\//i.test(href)) {
        results.push({
          folder: folderStack.length ? folderStack[folderStack.length - 1] : 'Imported Bookmarks',
          title: decodeEntities((m[3] || '').trim()) || href,
          url: href,
        })
      }
    } else {
      // </DL> → close folder
      if (folderStack.length) folderStack.pop()
    }
  }

  return results
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

function getFavicon(url: string) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`
  } catch {
    return null
  }
}

// ─── Custom checkbox ─────────────────────────────────────────────────────────

function CustomCheckbox({
  checked,
  indeterminate = false,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      onClick={onChange}
      className={`size-4 shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
        checked || indeterminate
          ? 'bg-primary border-primary'
          : 'bg-background border-border hover:border-primary/60'
      }`}
    >
      {indeterminate && (
        <span className="block w-2 h-0.5 bg-white rounded-full" />
      )}
      {!indeterminate && checked && (
        <svg className="size-2.5 text-white" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function IndeterminateCheckbox({
  state,
  onChange,
}: {
  state: 'all' | 'some' | 'none'
  onChange: () => void
}) {
  return (
    <CustomCheckbox
      checked={state === 'all'}
      indeterminate={state === 'some'}
      onChange={onChange}
    />
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface Props {
  variant?: 'personal' | 'professional'
}

export default function ImportPage({ variant = 'personal' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const [isDragging, setIsDragging] = useState(false)
  const [parseError, setParseError] = useState('')
  const [groups, setGroups] = useState<FolderGroup[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [importedGroups, setImportedGroups] = useState<FolderGroup[]>([])

  // Import source state
  const [importSource, setImportSource] = useState<'html' | 'urls'>('html')
  const [pastedUrls, setPastedUrls] = useState('')
  const [urlFolderName, setUrlFolderName] = useState('')

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function getLinkKey(folderName: string, idx: number) {
    return `${folderName}::${idx}`
  }

  function getFolderSelectionState(group: FolderGroup): 'all' | 'some' | 'none' {
    const count = group.links.filter((_, i) => selectedLinks.has(getLinkKey(group.name, i))).length
    if (count === 0) return 'none'
    if (count === group.links.length) return 'all'
    return 'some'
  }

  const allLinkKeys = groups.flatMap((g) => g.links.map((_, i) => getLinkKey(g.name, i)))
  const totalLinkCount = allLinkKeys.length
  const selectedCount = allLinkKeys.filter((k) => selectedLinks.has(k)).length
  const masterState: 'all' | 'some' | 'none' =
    selectedCount === 0 ? 'none' : selectedCount === totalLinkCount ? 'all' : 'some'

  // ── Actions ──────────────────────────────────────────────────────────────────

  function resetAll() {
    setGroups([])
    setExpandedFolders(new Set())
    setSelectedLinks(new Set())
    setParseError('')
    setImportError('')
    setResult(null)
    setImportedGroups([])
    setPastedUrls('')
    setUrlFolderName('')
  }

  function processFile(file: File) {
    resetAll()
    if (!file.name.match(/\.(html?|htm)$/i)) {
      setParseError('Please select a bookmarks HTML file (.html)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const html = (e.target?.result as string) || ''
      const bookmarks = parseBookmarksHtml(html)
      if (bookmarks.length === 0) {
        setParseError('No bookmarks found. Make sure the file was exported from Chrome, Firefox, Safari, or Edge.')
        return
      }
      const groupMap = new Map<string, FlatBookmark[]>()
      for (const bm of bookmarks) {
        if (!groupMap.has(bm.folder)) groupMap.set(bm.folder, [])
        groupMap.get(bm.folder)!.push(bm)
      }
      const grouped = Array.from(groupMap.entries()).map(([name, links]) => ({ name, links }))
      setGroups(grouped)
      // Select all links by default
      const allKeys = new Set<string>()
      grouped.forEach((g) => g.links.forEach((_, i) => allKeys.add(getLinkKey(g.name, i))))
      setSelectedLinks(allKeys)
    }
    reader.readAsText(file)
  }

  function handlePastedUrls() {
    setParseError('')

    if (!urlFolderName.trim()) {
      setParseError('Folder name is required. Please enter a name for this group of URLs.')
      return
    }

    const lines = pastedUrls
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^https?:\/\//i.test(l))

    if (lines.length === 0) {
      setParseError('No valid URLs found. Make sure each URL starts with http:// or https://')
      return
    }

    const folder = urlFolderName.trim()
    const bookmarks: FlatBookmark[] = lines.map((url) => {
      let title = url
      try { title = new URL(url).hostname.replace(/^www\./, '') } catch { /* */ }
      return { folder, title, url }
    })

    const groupMap = new Map<string, FlatBookmark[]>()
    for (const bm of bookmarks) {
      if (!groupMap.has(bm.folder)) groupMap.set(bm.folder, [])
      groupMap.get(bm.folder)!.push(bm)
    }
    const grouped = Array.from(groupMap.entries()).map(([name, links]) => ({ name, links }))
    setGroups(grouped)
    const allKeys = new Set<string>()
    grouped.forEach((g) => g.links.forEach((_, i) => allKeys.add(getLinkKey(g.name, i))))
    setSelectedLinks(allKeys)
    setExpandedFolders(new Set(grouped.map((g) => g.name)))
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

  function toggleFolderExpand(name: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function toggleFolderSelection(group: FolderGroup) {
    const state = getFolderSelectionState(group)
    setSelectedLinks((prev) => {
      const next = new Set(prev)
      if (state === 'all') {
        group.links.forEach((_, i) => next.delete(getLinkKey(group.name, i)))
      } else {
        group.links.forEach((_, i) => next.add(getLinkKey(group.name, i)))
      }
      return next
    })
  }

  function toggleLinkSelection(key: string) {
    setSelectedLinks((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleMasterSelection() {
    if (masterState === 'all') {
      setSelectedLinks(new Set())
    } else {
      const allKeys = new Set<string>()
      groups.forEach((g) => g.links.forEach((_, i) => allKeys.add(getLinkKey(g.name, i))))
      setSelectedLinks(allKeys)
    }
  }

  async function handleImport() {
    if (selectedCount === 0 || isImporting) return
    setImportError('')
    setIsImporting(true)
    const items: FlatBookmark[] = []
    const selectedGroupMap = new Map<string, FlatBookmark[]>()
    for (const group of groups) {
      for (let i = 0; i < group.links.length; i++) {
        const key = getLinkKey(group.name, i)
        if (selectedLinks.has(key)) {
          items.push(group.links[i])
          if (!selectedGroupMap.has(group.name)) selectedGroupMap.set(group.name, [])
          selectedGroupMap.get(group.name)!.push(group.links[i])
        }
      }
    }
    const newImportedGroups = Array.from(selectedGroupMap.entries()).map(([name, links]) => ({ name, links }))
    try {
      const res = await linkService.importBookmarks(items, variant === 'professional' ? 'professional' : 'personal')
      setResult(res)
      setImportedGroups(newImportedGroups)
      setGroups([])
      setSelectedLinks(new Set())
      setExpandedFolders(new Set())
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setImportError(axiosErr?.response?.data?.message || 'Import failed. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  // ── POST-IMPORT results view ─────────────────────────────────────────────────

  if (result) {
    const resultContent = (
      <div className="h-full overflow-y-auto">
        <div className="px-8 py-8">
          <PageHeader
            title="Imported Links"
            subtitle={`${result.linksImported} bookmark${result.linksImported !== 1 ? 's' : ''} imported${result.categoriesCreated > 0 ? ` · ${result.categoriesCreated} new folder${result.categoriesCreated !== 1 ? 's' : ''} created` : ''}`}
            actions={
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw className="size-4" />
                Import more
              </button>
            }
          />

          {/* Success banner */}
          <div className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-2xl px-5 py-4 mb-6">
            <CheckCircle2 className="size-5 text-success shrink-0" />
            <p className="text-sm font-medium text-foreground">
              Successfully imported <span className="font-bold">{result.linksImported}</span> bookmark{result.linksImported !== 1 ? 's' : ''} across <span className="font-bold">{importedGroups.length}</span> folder{importedGroups.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Category-wise results */}
          <div className="flex flex-col gap-4">
            {importedGroups.map((group) => (
              <div key={group.name} className="bg-surface border border-border rounded-2xl overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Folder className="size-4 text-primary" />
                  </div>
                  <p className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">{group.name}</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
                    {group.links.length} link{group.links.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Link rows */}
                {group.links.map((link, i) => {
                  const favicon = getFavicon(link.url)
                  let hostname = link.url
                  try { hostname = new URL(link.url).hostname.replace(/^www\./, '') } catch { /* */ }
                  return (
                    <div key={i} className="flex items-center gap-3 px-6 py-3 border-b border-border/30 last:border-b-0">
                      {favicon
                        ? <img src={favicon} alt="" className="size-4 shrink-0 rounded-sm" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                        : <Link2 className="size-4 shrink-0 text-muted-foreground/50" />
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
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    return variant === 'professional'
      ? <WorkspaceLayout>{resultContent}</WorkspaceLayout>
      : <AppLayout>{resultContent}</AppLayout>
  }

  // ── PRE-IMPORT view ──────────────────────────────────────────────────────────

  const content = (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-8">
        <PageHeader
          title="Import Bookmarks"
          subtitle="Import from a browser export file or paste URLs directly"
          actions={groups.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedCount} of {totalLinkCount} selected
              </span>
              <button
                type="button"
                disabled={selectedCount === 0 || isImporting}
                onClick={handleImport}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isImporting && <Loader2 className="size-4 animate-spin" />}
                {isImporting ? 'Importing…' : 'Import selected'}
              </button>
            </div>
          ) : undefined}
        />

        <div className="flex flex-col gap-6">

          {/* Import source section — shown when no file loaded yet */}
          {groups.length === 0 && (
            <div className="flex flex-col gap-4">
              {/* Source tabs */}
              <div className="flex gap-1 bg-muted/40 p-1 rounded-xl border border-border self-start">
                <button
                  type="button"
                  onClick={() => { setImportSource('html'); setParseError('') }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                    importSource === 'html'
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="size-3.5" />
                  Bookmark File
                </button>
                <button
                  type="button"
                  onClick={() => { setImportSource('urls'); setParseError('') }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                    importSource === 'urls'
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ClipboardList className="size-3.5" />
                  Paste URLs
                </button>
              </div>

              {/* HTML file upload */}
              {importSource === 'html' && (
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 text-center cursor-pointer transition-colors select-none ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/20'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="size-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">Upload bookmarks file</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag & drop or click to select — works with Chrome, Firefox, Safari, and Edge exports
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/60">Accepts .html files · Max 1000 bookmarks</p>
                </div>
              )}

              {/* Paste URLs */}
              {importSource === 'urls' && (
                <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Folder name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={urlFolderName}
                      onChange={(e) => setUrlFolderName(e.target.value)}
                      placeholder="e.g. React Resources"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      URLs — one per line
                    </label>
                    <textarea
                      value={pastedUrls}
                      onChange={(e) => setPastedUrls(e.target.value)}
                      rows={8}
                      placeholder={"https://example.com\nhttps://github.com\nhttps://docs.react.dev"}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePastedUrls}
                    disabled={!pastedUrls.trim()}
                    className="self-start flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ClipboardList className="size-4" />
                    Parse URLs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Parse error */}
          {parseError && (
            <div className="flex items-center gap-2 text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
              <AlertCircle className="size-4 shrink-0" />
              <p className="text-sm font-medium">{parseError}</p>
            </div>
          )}

          {/* Import error */}
          {importError && (
            <div className="flex items-center gap-2 text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
              <AlertCircle className="size-4 shrink-0" />
              <p className="text-sm font-medium">{importError}</p>
            </div>
          )}

          {/* Replace file shortcut */}
          {groups.length > 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Upload className="size-4" />
              Choose a different file
            </button>
          )}

          {/* ── Folder / link table ── */}
          {groups.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">

              {/* Table header row */}
              <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-muted/30">
                <IndeterminateCheckbox state={masterState} onChange={toggleMasterSelection} />
                <span className="flex-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Folder / Bookmark
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider w-16 text-right">
                  Links
                </span>
              </div>

              {/* Folder rows */}
              {groups.map((group) => {
                const isExpanded = expandedFolders.has(group.name)
                const folderState = getFolderSelectionState(group)
                return (
                  <div key={group.name} className="border-b border-border last:border-b-0">

                    {/* Folder row */}
                    <div className="flex items-center gap-3 px-5 py-3">
                      <IndeterminateCheckbox state={folderState} onChange={() => toggleFolderSelection(group)} />
                      <button
                        type="button"
                        onClick={() => toggleFolderExpand(group.name)}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                      >
                        {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>
                      <Folder className="size-4 text-primary shrink-0" />
                      <span className="flex-1 min-w-0 text-sm font-bold text-foreground truncate">{group.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full w-16 text-right shrink-0">
                        {group.links.length}
                      </span>
                    </div>

                    {/* Link rows — shown when expanded */}
                    {isExpanded && (
                      <div className="border-t border-border/40">
                        {group.links.map((link, i) => {
                          const key = getLinkKey(group.name, i)
                          const favicon = getFavicon(link.url)
                          let hostname = link.url
                          try { hostname = new URL(link.url).hostname.replace(/^www\./, '') } catch { /* */ }
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 pl-14 pr-5 py-2.5 border-b border-border/20 last:border-b-0"
                            >
                              <CustomCheckbox
                                checked={selectedLinks.has(key)}
                                onChange={() => toggleLinkSelection(key)}
                              />
                              {favicon
                                ? <img src={favicon} alt="" className="size-4 shrink-0 rounded-sm" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                                : <Link2 className="size-4 shrink-0 text-muted-foreground/40" />
                              }
                              <span className="flex-1 min-w-0 text-sm text-foreground truncate">{link.title}</span>
                              <span className="text-xs text-muted-foreground/50 truncate max-w-[220px] shrink-0 hidden md:block">
                                {hostname}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept=".html,.htm" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  )

  return variant === 'professional'
    ? <WorkspaceLayout>{content}</WorkspaceLayout>
    : <AppLayout>{content}</AppLayout>
}

