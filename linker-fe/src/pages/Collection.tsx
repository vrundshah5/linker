import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Share2,
  Check,
  Plus,
  GripVertical,
  LayoutTemplate,
  Pencil,
  MoreHorizontal,
  LayoutGrid,
  Archive,
  ChevronRight,
  Star,
  BarChart2,
  Calendar,
  Lock,
  Trash2,
  Wand2,
  Settings,
  Settings2,
  Image,
  Link,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { publicService } from '../services/publicService'
import { queryKeys } from '../constants/queryKeys'

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
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.publicCollection.byUser(user.id),
    queryFn: () => publicService.getFavorites(user.id),
    enabled: !!user.id,
  })

  const shareUrl = `${window.location.origin}/c/${user.id}`
  const handle = user.name.toLowerCase().replace(/\s+/g, '')
  const displayUrl = `linker.app/${handle}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const links = data?.links ?? []

  return (
    <AppLayout>
      <div className="h-full flex overflow-hidden">

        {/* ── Left: editor panel ── */}
        <div className="flex-1 bg-surface flex flex-col overflow-hidden border-r border-border">

          {/* Sticky header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-surface z-10 shrink-0">
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
              Links
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Wand2 className="size-4" />
                Enhance
              </button>
              <button className="size-10 flex items-center justify-center border border-border rounded-full text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Settings className="size-[18px]" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col items-center">
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
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <button
                      key={i}
                      className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add button */}
              <button className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg mb-4 hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                <Plus className="size-5" />
                Add
              </button>

              {/* Toolbar */}
              <div className="w-full flex items-center justify-between mb-8">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer">
                  <LayoutGrid className="size-4" />
                  Add collection
                </button>
                <button className="flex items-center gap-1 text-sm font-bold text-foreground hover:opacity-70 transition-opacity cursor-pointer">
                  <Archive className="size-4 mr-1" />
                  View archive
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Links / Collections */}
              {isLoading ? (
                <div className="w-full flex flex-col gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-36 rounded-[32px] bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : links.length === 0 ? (
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
                  {links.map((link) => {
                    const favicon = getFaviconUrl(link.url)
                    return (
                      <div
                        key={link._id}
                        className="w-full bg-surface border border-border rounded-[32px] p-6 shadow-sm relative group"
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

                          {/* Right: share + toggle + delete */}
                          <div className="flex flex-col items-end justify-between gap-8 shrink-0">
                            <div className="flex items-center gap-3">
                              <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                <Share2 className="size-[18px]" />
                              </button>
                              {/* Toggle on */}
                              <div className="w-10 h-6 bg-success rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                              </div>
                            </div>
                            <button className="text-muted-foreground hover:text-danger cursor-pointer transition-colors">
                              <Trash2 className="size-[18px]" />
                            </button>
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
        <div className="w-[480px] bg-[#f0f3fb] flex-col shrink-0 overflow-y-auto hidden xl:flex">

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
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 flex items-center justify-center bg-surface border border-border rounded-full text-foreground hover:bg-muted shadow-sm transition-colors shrink-0"
            >
              <Settings2 className="size-[18px]" />
            </a>
          </div>

          {/* Phone mockup */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-[300px] h-[620px] bg-[#111] rounded-[48px] p-[10px] shadow-2xl border-4 border-white/20 ring-1 ring-black/20 relative overflow-hidden">
              {/* Camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#111] rounded-b-2xl z-20" />
              {/* Screen */}
              <div className="w-full h-full bg-black rounded-[38px] overflow-hidden flex flex-col items-center pt-14 pb-6 px-4 relative">
                {/* More button */}
                <div className="absolute top-5 right-5 size-7 bg-white/10 rounded-full flex items-center justify-center text-white/80">
                  <MoreHorizontal className="size-4" />
                </div>

                {/* Avatar */}
                <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mb-3 ring-2 ring-white/10">
                  <span className="text-lg font-bold text-primary">{getInitials(user.name)}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-6">@{handle}</h3>

                {/* Link buttons */}
                <div className="w-full flex flex-col gap-3">
                  {links.length === 0 ? (
                    <div className="w-full bg-[#1a1a1a] text-white/30 py-3 px-4 rounded-2xl text-sm flex justify-center items-center text-center">
                      Your links will appear here
                    </div>
                  ) : (
                    links.slice(0, 4).map((link) => (
                      <div
                        key={link._id}
                        className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-2xl font-bold text-sm flex justify-center items-center"
                      >
                        <span className="truncate">{link.title}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer CTA */}
                <div className="mt-auto pt-6 flex flex-col items-center gap-3">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs shadow-lg">
                    Join {user.name.split(' ')[0]} on Linker
                  </button>
                  <div className="text-[10px] text-white/30 text-center leading-tight">
                    Report • Privacy<br />More from Linker
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
