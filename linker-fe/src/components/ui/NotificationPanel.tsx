import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, CheckCheck } from 'lucide-react'
import type { AppNotification, NotificationContext } from '../../services/notificationService'
import NotifAvatar from './NotifAvatar'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface NotificationPanelProps {
  open: boolean
  notifications: AppNotification[]
  onClose: () => void
  onMarkAllRead: () => void
  onDismiss: (id: string) => void
  onMarkRead: (id: string) => void
  context?: NotificationContext
}

export default function NotificationPanel({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onDismiss,
  onMarkRead,
  context,
}: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const unread = notifications.filter((n) => !n.read).length

  if (!open) return null

  function handleClick(n: AppNotification) {
    if (!n.read) onMarkRead(n._id)
    onClose()
    const basePath =
      context === 'admin' ? '/admin/notifications'
      : context === 'professional' ? '/professional-notifications'
      : '/notifications'
    navigate(`${basePath}?id=${n._id}`)
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-foreground" />
          <span className="text-sm font-bold text-foreground">Notifications</span>
          {unread > 0 && (
            <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto scrollbar-hide divide-y divide-border">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
        ) : (
          notifications.map((n) => {
            return (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer ${
                  n.read ? 'opacity-60 hover:bg-muted/50' : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
              >
                <NotifAvatar n={n} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {n.type === 'project_invite' && n.meta.actorName && n.meta.projectName ? (
                      <><span className="font-semibold text-foreground">{n.meta.actorName}</span> added you to the project &ldquo;<span className="font-semibold text-foreground">{n.meta.projectName}</span>&rdquo;.</>
                    ) : n.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDismiss(n._id) }}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 mt-0.5"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Footer — only when there are notifications */}
      {notifications.length > 0 && (
      <div className="border-t border-border px-4 py-2.5 text-center">
        <button
          type="button"
          onClick={() => {
            onClose()
            if (context === 'admin') navigate('/admin/notifications')
            else if (context === 'professional') navigate('/professional-notifications')
            else navigate('/notifications')
          }}
          className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
        >
          View all notifications
        </button>
      </div>
      )}
    </div>
  )
}
