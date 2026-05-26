import { useEffect, useState } from 'react'
import { X, AtSign, Zap, Loader2 } from 'lucide-react'
import {
  useMentions,
  useBuzzes,
  useMarkMentionsRead,
  useMarkBuzzesRead,
} from '../../hooks/useMentionBuzz'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

type Tab = 'mentioned' | 'buzz'

interface Props {
  open: boolean
  onClose: () => void
  defaultTab?: Tab
}

export function MentionBuzzDrawer({ open, onClose, defaultTab = 'mentioned' }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  const { data: mentions = [], isLoading: loadingMentions } = useMentions()
  const { data: buzzes = [], isLoading: loadingBuzzes } = useBuzzes()
  const markMentionsRead = useMarkMentionsRead()
  const markBuzzesRead = useMarkBuzzesRead()

  // Sync tab with defaultTab when drawer opens
  useEffect(() => {
    if (open) setActiveTab(defaultTab)
  }, [open, defaultTab])

  // Mark items as read when tab becomes active and drawer is open
  useEffect(() => {
    if (!open) return
    if (activeTab === 'mentioned') markMentionsRead.mutate()
    if (activeTab === 'buzz') markBuzzesRead.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, open])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-[360px] flex flex-col bg-surface border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-bold text-foreground">Notifications</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-0 shrink-0">
          <button
            onClick={() => setActiveTab('mentioned')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'mentioned'
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <AtSign className="size-4" />
            Mentioned
            {mentions.filter((m) => !m.read).length > 0 && (
              <span className="ml-1 size-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {Math.min(mentions.filter((m) => !m.read).length, 99)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('buzz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'buzz'
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Zap className="size-4" />
            Buzz
            {buzzes.filter((b) => !b.read).length > 0 && (
              <span className="ml-1 size-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {Math.min(buzzes.filter((b) => !b.read).length, 99)}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-3">
          {/* ── Mentioned tab ── */}
          {activeTab === 'mentioned' && (
            <div className="flex flex-col">
              {loadingMentions ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : mentions.length === 0 ? (
                <div className="flex flex-col items-center py-16 px-6 text-center gap-3">
                  <AtSign className="size-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No mentions yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    When someone tags you with @{'{yourname}'} in a project chat, it will appear here.
                  </p>
                </div>
              ) : (
                mentions.map((mention) => (
                  <div
                    key={mention._id}
                    className={`flex gap-3 px-5 py-4 border-b border-border last:border-0 transition-colors ${
                      !mention.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    {/* Unread dot */}
                    <div className="pt-1.5 shrink-0">
                      <span
                        className={`block size-2 rounded-full ${
                          mention.read ? 'bg-border' : 'bg-primary'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {mention.fromUserId?.name ?? 'Unknown'}
                        </span>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {timeAgo(mention.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        in <span className="font-medium text-foreground">{mention.projectId?.name ?? 'a project'}</span>
                      </p>
                      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                        {mention.messageText}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Buzz tab ── */}
          {activeTab === 'buzz' && (
            <div className="flex flex-col">
              {/* Buzz list */}
              {loadingBuzzes ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : buzzes.length === 0 ? (
                <div className="flex flex-col items-center py-16 px-6 text-center gap-3">
                  <Zap className="size-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No buzzes yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    When someone buzzes you from the project chat, it will appear here.
                  </p>
                </div>
              ) : (
                buzzes.map((buzz) => (
                  <div
                    key={buzz._id}
                    className={`flex gap-3 px-5 py-4 border-b border-border last:border-0 transition-colors ${
                      !buzz.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="pt-1.5 shrink-0">
                      <span
                        className={`block size-2 rounded-full ${
                          buzz.read ? 'bg-border' : 'bg-yellow-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {buzz.fromUserId?.name ?? 'Someone'}
                        </span>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {timeAgo(buzz.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Zap className="inline size-3 mr-0.5 text-yellow-400" />
                        buzzed you!
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
