import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Share2,
  Check,
  Plus,
  GripVertical,
  LayoutTemplate,
  Pencil,
  MoreHorizontal,
  LayoutGrid,
  Star,
  BarChart2,
  Calendar,
  Lock,
  Trash2,
  Paintbrush,
  Image,
  Link,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { linkService, type RecentLink } from '../services/linkService'
import { queryKeys } from '../constants/queryKeys'
import { useDesignStore, THEMES, getButtonStyles } from '../store/designStore'

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`
  } catch {
    return null
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Collection() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [localLinks, setLocalLinks] = useState<RecentLink[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const { themeId, buttonShape, buttonFill, showFooter } = useDesignStore()
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]
  const btnStyles = getButtonStyles(theme, buttonShape, buttonFill)
  const dragIdxRef = useRef<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.links.favorites(),
    queryFn: () => linkService.getFavoriteLinks(),
    enabled: !!user.id,
  })

  // Sync from server, restore saved drag order
  useEffect(() => {
    const fetched = data ?? []
    const savedOrder: string[] = JSON.parse(
      localStorage.getItem(`col-order-${user.id}`) ?? '[]'
    )
    if (savedOrder.length) {
      const sorted = [...fetched].sort((a, b) => {
        const ia = savedOrder.indexOf(a._id)
        const ib = savedOrder.indexOf(b._id)
        return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib)
      })
      setLocalLinks(sorted)
    } else {
      setLocalLinks(fetched)
    }
  }, [data, user.id])

  function saveOrder(links: RecentLink[]) {
    localStorage.setItem(`col-order-${user.id}`, JSON.stringify(links.map((l) => l._id)))
  }

  // Toggle visibility (isFavorite) — keeps link in list
  const toggleMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      linkService.updateLink(id, { isFavorite }),
    onMutate: ({ id, isFavorite }) => {
      setLocalLinks((prev) => prev.map((l) => (l._id === id ? { ...l, isFavorite } : l)))
    },
    onSuccess: () => {
      // Do NOT invalidate favorites here — that would trigger useEffect to reset
      // localLinks from server (removing unfavorited links from the list).
      queryClient.invalidateQueries({ queryKey: queryKeys.links.stats(30) })
    },
    onError: () => {
      // On error revert by refetching
      queryClient.invalidateQueries({ queryKey: queryKeys.links.favorites() })
    },
  })

  // Remove from collection (unfavorite) — does NOT delete the link from the category
  const deleteMutation = useMutation({
    mutationFn: (id: string) => linkService.updateLink(id, { isFavorite: false }),
    onMutate: (id) => {
      setLocalLinks((prev) => prev.filter((l) => l._id !== id))
      setConfirmDelete(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.stats(30) })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.favorites() })
    },
  })

  // Drag and drop handlers
  function handleDragStart(i: number) {
    dragIdxRef.current = i
    setDragIdx(i)
  }

  function handleDragOver(e: React.DragEvent, toIdx: number) {
    e.preventDefault()
    const fromIdx = dragIdxRef.current
    if (fromIdx === null || fromIdx === toIdx) return
    setLocalLinks((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return next
    })
    dragIdxRef.current = toIdx
    setDragIdx(toIdx)
  }

  function handleDrop(reordered: RecentLink[]) {
    dragIdxRef.current = null
    setDragIdx(null)
    saveOrder(reordered)
  }

  const shareUrl = `${window.location.origin}/c/${user.id}`
  const handle = user.name.toLowerCase().replace(/\s+/g, '')
  const displayUrl = `linker.app/${handle}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AppLayout>
      <div className="h-full flex overflow-hidden">

        {/* ── Left: editor panel ── */}
        <div className="flex-1 bg-surface flex flex-col overflow-hidden border-r border-border">

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col items-center">

              {/* Profile section */}
              <div className="w-full flex flex-col items-center mb-8">
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-3 border-2 border-border">
                  <span className="text-2xl font-bold text-primary">{getInitials(user.name)}</span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-1">@{handle}</h2>
                <button className="text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer transition-colors">
                  Add bio
                </button>
              </div>

              {/* Add link button */}
              <button
                onClick={() => navigate('/categories')}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg mb-4 hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="size-5" />
                Add link
              </button>



              {/* Links / Collections */}
              {isLoading ? (
                <div className="w-full flex flex-col gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-36 rounded-[32px] bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : localLinks.length === 0 ? (
                /* Empty collection card */
                <div className="w-full bg-muted/20 border border-border rounded-[32px] p-6 relative group">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-grab opacity-40 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="size-5" />
                  </div>
                  <div className="pl-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <LayoutTemplate className="size-[18px]" />
                          <span>Layout</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground cursor-pointer group/edit">
                          <span>Add collection title</span>
                          <Pencil className="size-3.5 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-muted-foreground hover:text-foreground cursor-pointer">
                          <Plus className="size-[18px]" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground cursor-pointer">
                          <Share2 className="size-[18px]" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground cursor-pointer">
                          <MoreHorizontal className="size-[18px]" />
                        </button>
                        {/* Toggle off */}
                        <div className="w-10 h-6 bg-border rounded-full relative cursor-pointer ml-2 shrink-0">
                          <div className="absolute left-1 top-1 size-4 bg-muted-foreground rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="size-12 bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <Star className="size-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">No favorites yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Star links in your categories to build your collection.
                      </p>
                      <button className="px-6 py-2 bg-surface border border-border rounded-full text-sm font-bold text-foreground shadow-sm hover:bg-muted transition-colors cursor-pointer">
                        Add link
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {localLinks.map((link, i) => {
                    const favicon = getFaviconUrl(link.url)
                    const isConfirming = confirmDelete === link._id
                    return (
                      <div
                        key={link._id}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={() => handleDrop(localLinks)}
                        onDragEnd={() => { dragIdxRef.current = null; setDragIdx(null) }}
                        className={`w-full border rounded-[32px] p-6 shadow-sm relative group transition-all select-none ${
                          dragIdx === i
                            ? 'bg-muted/60 border-border/40 opacity-50 scale-[0.98]'
                            : 'bg-surface border-border opacity-100'
                        }`}
                      >
                        {/* Drag handle */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-grab opacity-40 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="size-5" />
                        </div>

                        <div className="pl-6 flex items-start justify-between gap-4">
                          {/* Left: info + actions */}
                          <div className="flex-1 min-w-0">
                            {/* Favicon + title row */}
                            <div className="flex items-center gap-3 mb-2">
                              <div className="size-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                {favicon ? (
                                  <img
                                    src={favicon}
                                    alt=""
                                    className="size-4"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : null}
                                <Link className={`size-4 text-muted-foreground ${favicon ? 'hidden' : ''}`} />
                              </div>
                              <div className="flex items-center gap-2 group/edit cursor-pointer flex-1 min-w-0">
                                <span className="font-bold text-foreground truncate">{link.title}</span>
                                <Pencil className="size-3.5 shrink-0 opacity-0 group-hover/edit:opacity-100 text-muted-foreground transition-opacity" />
                              </div>
                            </div>

                            {/* URL row */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 group/editurl cursor-pointer">
                              <span className="truncate max-w-[260px]">{link.url}</span>
                              <Pencil className="size-3.5 shrink-0 opacity-0 group-hover/editurl:opacity-100 transition-opacity" />
                            </div>

                            {/* Action icons row */}
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <LayoutGrid className="size-[18px]" />
                              </button>
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <Image className="size-[18px]" />
                              </button>
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <Star className="size-[18px]" />
                              </button>
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <BarChart2 className="size-[18px]" />
                              </button>
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <Calendar className="size-[18px]" />
                              </button>
                              <button className="hover:text-foreground cursor-pointer transition-colors">
                                <Lock className="size-[18px]" />
                              </button>
                              <span className="text-xs text-muted-foreground ml-1 flex items-center gap-1">
                                <BarChart2 className="size-3.5" />
                                0 clicks
                              </span>
                            </div>
                          </div>

                          {/* Right: toggle + delete */}
                          <div className="flex flex-col items-end justify-between gap-8 shrink-0">
                            <div className="flex items-center gap-3">
                              <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                <Share2 className="size-[18px]" />
                              </button>
                              {/* Toggle — show/hide on public profile */}
                              <button
                                onClick={() => toggleMutation.mutate({ id: link._id, isFavorite: !link.isFavorite })}
                                disabled={toggleMutation.isPending}
                                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors focus:outline-none ${
                                  link.isFavorite ? 'bg-success' : 'bg-border'
                                }`}
                                aria-label={link.isFavorite ? 'Hide from public profile' : 'Show on public profile'}
                              >
                                <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${
                                  link.isFavorite ? 'right-1' : 'left-1'
                                }`} />
                              </button>
                            </div>
                            {/* Delete with inline confirm */}
                            {isConfirming ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => deleteMutation.mutate(link._id)}
                                  disabled={deleteMutation.isPending}
                                  className="text-xs text-danger font-bold cursor-pointer transition-opacity hover:opacity-70"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(link._id)}
                                className="text-muted-foreground hover:text-danger cursor-pointer transition-colors"
                                aria-label="Delete link"
                              >
                                <Trash2 className="size-[18px]" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: phone preview panel ── */}
        <div className="w-[480px] bg-muted flex-col shrink-0 overflow-y-auto hidden xl:flex">

          {/* Top bar */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 shrink-0">
            <div className="flex items-center bg-surface border border-border rounded-full px-4 py-2 shadow-sm gap-3">
              <span className="text-sm font-medium text-foreground">{displayUrl}</span>
              <button
                onClick={copyLink}
                className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {copied ? <Check className="size-4 text-success" /> : <Share2 className="size-4" />}
              </button>
            </div>
            <button
              onClick={() => navigate('/design')}
              title="Open Design editor"
              className="size-10 flex items-center justify-center bg-surface border border-border rounded-full text-foreground hover:bg-muted shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <Paintbrush className="size-[18px]" />
            </button>
          </div>

          {/* Phone mockup */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
            <div
              className="w-[300px] h-[620px] rounded-[48px] p-[10px] shadow-2xl border-4 border-white/20 ring-1 ring-black/20 relative overflow-hidden transition-all duration-500"
              style={{ backgroundColor: theme.shell }}
            >
              {/* Camera notch */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 rounded-b-2xl z-20"
                style={{ backgroundColor: theme.shell }}
              />
              {/* Screen */}
              <div
                className="w-full h-full rounded-[38px] overflow-hidden flex flex-col items-center pt-14 pb-6 px-4 relative transition-all duration-500"
                style={{ background: theme.screenBg }}
              >
                {/* More button */}
                <div
                  className="absolute top-5 right-5 size-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.moreBg, color: theme.moreIcon }}
                >
                  <MoreHorizontal className="size-4" />
                </div>

                {/* Avatar */}
                <div
                  className="size-20 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: theme.avatarBg }}
                >
                  <span className="text-lg font-bold" style={{ color: theme.avatarText }}>
                    {getInitials(user.name)}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-6" style={{ color: theme.text }}>
                  @{handle}
                </h3>

                {/* Link buttons */}
                <div className="w-full flex flex-col gap-3">
                  {localLinks.filter(l => l.isFavorite).length === 0 ? (
                    <div
                      className="w-full py-3 px-4 text-sm flex justify-center items-center text-center"
                      style={{ ...btnStyles, color: theme.emptyText }}
                    >
                      Your links will appear here
                    </div>
                  ) : (
                    localLinks.filter(l => l.isFavorite).slice(0, 4).map((link) => (
                      <div
                        key={link._id}
                        className="w-full py-3 px-4 font-bold text-sm flex justify-center items-center"
                        style={btnStyles}
                      >
                        <span className="truncate">{link.title}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer CTA */}
                {showFooter && (
                  <div className="mt-auto pt-6 flex flex-col items-center gap-3">
                    <button
                      className="px-6 py-2 rounded-full font-bold text-xs shadow-lg"
                      style={{ backgroundColor: theme.footerBtnBg, color: theme.footerBtnText }}
                    >
                      Join {user.name.split(' ')[0]} on Linker
                    </button>
                    <div className="text-[10px] text-center leading-tight" style={{ color: theme.subText }}>
                      Report • Privacy<br />More from Linker
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

      </div>
    </AppLayout>
  )
}
