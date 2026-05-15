import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, UserPlus, UserCheck, UserX, Users, CheckCheck } from 'lucide-react'
import type { AppNotification, NotificationType } from '../../services/notificationService'

const TYPE_META: Record<NotificationType, { icon: React.ElementType; bg: string; color: string }> = {
  new_user:         { icon: Users,     bg: 'bg-primary/10',  color: 'text-primary'  },
  request_received: { icon: UserPlus,  bg: 'bg-success/15',  color: 'text-success'  },
  request_accepted: { icon: UserCheck, bg: 'bg-success/15',  color: 'text-success'  },
  request_rejected: { icon: UserX,     bg: 'bg-danger/10',   color: 'text-danger'   },
}

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
}

export default function NotificationPanel({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onDismiss,
  onMarkRead,
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
    if (n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected') {
      onClose()
      navigate('/requests')
    }
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
            const { icon: Icon, bg, color } = TYPE_META[n.type]
            const isRequest = n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected'
            return (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${
                  n.read ? 'opacity-60' : 'bg-secondary/30'
                } ${isRequest ? 'cursor-pointer hover:bg-muted/50' : ''}`}
              >
                <div className={`size-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.body}</p>
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

      {/* Footer */}
      <div className="border-t border-border px-4 py-2.5 text-center">
        <button
          type="button"
          onClick={() => { onClose(); navigate('/notifications') }}
          className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}
