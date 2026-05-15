import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Check, Copy, Link, Share2, Star } from 'lucide-react'
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

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
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

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const links = data?.links ?? []

  return (
    <AppLayout>
      {/* Outer scroll container */}
      <div className="h-full overflow-y-auto relative">
        {/* Gradient blobs */}
        <div className="absolute inset-0 bg-secondary/50 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] size-[600px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] size-[600px] bg-warning/20 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] right-[20%] size-[400px] bg-success/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center py-16 px-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-warning to-success rounded-full blur-sm opacity-70" />
              <div className="size-24 rounded-full border-4 border-surface relative z-10 bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                style={{ fontFamily: 'var(--font-headings)' }}>
                {getInitials(user.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 size-8 bg-surface rounded-full flex items-center justify-center shadow-sm z-20 border border-border">
                <Star className="size-4 text-warning fill-warning" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-headings)' }}>
              {user.name}'s Favorite Links
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              A curated collection of favorite bookmarks and resources.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={copyLink}
                className="px-5 py-2.5 bg-surface text-foreground font-bold text-sm rounded-full shadow-sm border border-border flex items-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                {copied ? 'Copied!' : 'Copy Share Link'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Share2 className="size-4" />
                Share Collection
              </a>
            </div>
          </div>

          {/* Link list */}
          {isLoading ? (
            <div className="w-full flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-surface/60 animate-pulse" />
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-16">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="size-8 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">No favorites yet</h3>
              <p className="text-sm text-muted-foreground">
                Star links in your categories to build your collection.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {links.map((link, index) => {
                const favicon = getFaviconUrl(link.url)
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center p-4 bg-surface/80 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl hover:shadow-md transition-all"
                  >
                    {/* Rank badge */}
                    <div className="absolute -left-3 -top-3 size-8 bg-foreground text-background font-bold flex items-center justify-center rounded-full shadow-sm text-sm border-2 border-surface"
                      style={{ fontFamily: 'var(--font-headings)' }}>
                      #{index + 1}
                    </div>

                    {/* Icon/favicon */}
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mr-4">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt=""
                          className="size-6"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <Link className={`size-6 text-primary ${favicon ? 'hidden' : ''}`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-base font-bold text-foreground truncate mb-1">
                        {link.title}
                      </h3>
                      <p className="text-sm text-primary truncate">
                        {getHostname(link.url)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 size-10 rounded-full bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowUpRight className="size-5" />
                    </div>
                  </a>
                )
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 flex items-center justify-center gap-2 text-muted-foreground text-sm font-bold">
            <span>Powered by</span>
            <div className="flex items-center gap-1.5 text-foreground">
              <div className="size-5 bg-primary text-primary-foreground rounded flex items-center justify-center">
                <Link className="size-2.5" />
              </div>
              <span>Linker</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
