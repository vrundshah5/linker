import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, Link2, UserPlus, MessageSquare, Star, CheckCheck } from 'lucide-react'

export interface Notification {
  id: number
  type: 'link' | 'invite' | 'message' | 'system'
  title: string
  body: string
  time: string
  read: boolean
}

const TYPE_ICON: Record<Notification['type'], { icon: React.ElementType; bg: string; color: string }> = {
  link:    { icon: Link2,         bg: 'bg-primary/10',  color: 'text-primary'  },
  invite:  { icon: UserPlus,      bg: 'bg-success/15',  color: 'text-success'  },
  message: { icon: MessageSquare, bg: 'bg-warning/15',  color: 'text-warning'  },
  system:  { icon: Star,          bg: 'bg-danger/10',   color: 'text-danger'   },
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'invite',  title: 'Sarah Connor joined your project',  body: 'Sarah accepted your invite to Acme Corp Redesign.',      time: '2 mins ago',   read: false },
  { id: 2, type: 'link',    title: 'New resource added',                body: 'John Smith added a link to Marketing Q4 Campaign.',      time: '1 hour ago',   read: false },
  { id: 3, type: 'message', title: 'New message from Emma Watson',      body: 'Hey, can you review the latest design files?',           time: '3 hours ago',  read: false },
  { id: 4, type: 'system',  title: 'Pro subscription renewed',          body: 'Your Pro plan has been successfully renewed.',           time: 'Yesterday',    read: true  },
  { id: 5, type: 'link',    title: 'Link shared with you',              body: 'Michael shared "Frontend Repo" from Internal Wiki.',     time: '2 days ago',   read: true  },
]

interface NotificationPanelProps {
  open: boolean
  notifications: Notification[]
  onClose: () => void
  onMarkAllRead: () => void
  onDismiss: (id: number) => void
}

export default function NotificationPanel({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onDismiss,
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
          <p className="text-sm text-muted-foreground text-center py-8">
            No notifications
          </p>
        ) : (
          notifications.map((n) => {
            const { icon: Icon, bg, color } = TYPE_ICON[n.type]
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${
                  n.read ? 'opacity-60' : 'bg-secondary/30'
                }`}
              >
                <div className={`size-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold text-foreground leading-snug ${!n.read ? '' : ''}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {n.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(n.id)}
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
