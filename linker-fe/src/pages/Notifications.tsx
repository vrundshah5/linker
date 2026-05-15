import { useState } from 'react'
import { X, CheckCheck, Link2, UserPlus, MessageSquare, Star } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import { MOCK_NOTIFICATIONS, type Notification } from '../components/ui/NotificationPanel'

const TYPE_ICON: Record<Notification['type'], { icon: React.ElementType; bg: string; color: string; label: string }> = {
  link:    { icon: Link2,         bg: 'bg-primary/10',  color: 'text-primary',  label: 'Resource' },
  invite:  { icon: UserPlus,      bg: 'bg-success/15',  color: 'text-success',  label: 'Invite'   },
  message: { icon: MessageSquare, bg: 'bg-warning/15',  color: 'text-warning',  label: 'Message'  },
  system:  { icon: Star,          bg: 'bg-danger/10',   color: 'text-danger',   label: 'System'   },
}

const FILTER_TABS = ['All', 'Unread', 'Resource', 'Invite', 'Message', 'System'] as const
type FilterTab = typeof FILTER_TABS[number]

// Extra mock data to fill the page
const ALL_NOTIFICATIONS: Notification[] = [
  ...MOCK_NOTIFICATIONS,
  { id: 6,  type: 'invite',  title: 'You were added to Internal Wiki',    body: 'Emma Watson added you to the Internal Wiki Migration project.',   time: '3 days ago',  read: true  },
  { id: 7,  type: 'message', title: 'New message from John Smith',         body: 'John Smith: "The new component library is ready for review."',    time: '3 days ago',  read: true  },
  { id: 8,  type: 'link',    title: 'New resource added',                  body: 'Sarah Connor added "Figma Design System" to Acme Corp Redesign.', time: '4 days ago',  read: true  },
  { id: 9,  type: 'system',  title: 'Password changed',                    body: 'Your account password was changed successfully.',                  time: '5 days ago',  read: true  },
  { id: 10, type: 'invite',  title: 'Invitation to Marketing Q4 Campaign', body: 'You were invited to join Marketing Q4 Campaign by Alex Rivera.',  time: '1 week ago',  read: true  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<FilterTab>('All')

  const unread = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function dismiss(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Unread') return !n.read
    return TYPE_ICON[n.type].label === activeTab
  })

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

        <PageHeader
          title="Notifications"
          subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          actions={
            unread > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
              >
                <CheckCheck className="size-4" />
                Mark all as read
              </button>
            ) : undefined
          }
        />

        {/* Filter tabs */}
        <div className="px-8 pt-5 pb-2 flex items-center gap-2 flex-wrap shrink-0">
          {FILTER_TABS.map((tab) => {
            const count = tab === 'Unread'
              ? notifications.filter((n) => !n.read).length
              : tab === 'All'
              ? notifications.length
              : notifications.filter((n) => TYPE_ICON[n.type].label === tab).length

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Bell className="size-7 text-muted-foreground" />
              </div>
              <p className="text-base font-bold text-foreground mb-1">No notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up in this category.</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {filtered.map((n, idx) => {
                const { icon: Icon, bg, color, label } = TYPE_ICON[n.type]
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                      !n.read ? 'bg-secondary/20' : 'hover:bg-muted/40'
                    } ${idx !== 0 ? 'border-t border-border' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`size-10 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`size-5 ${color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-foreground leading-snug">{n.title}</p>
                        {!n.read && (
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                        <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${bg} ${color}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{n.body}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{n.time}</p>
                    </div>

                    {/* Dismiss */}
                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 mt-1 p-1 rounded-lg hover:bg-muted"
                      aria-label="Dismiss notification"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  )
}
