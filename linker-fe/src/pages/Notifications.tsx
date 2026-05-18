import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCheck, Bell, UserPlus, UserCheck, UserX, Users } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import type { NotificationType } from '../services/notificationService'
import {
  useNotifications,
  useMarkAllRead,
  useMarkOneRead,
  useDeleteNotification,
} from '../hooks/useNotifications'

const TYPE_META: Record<NotificationType, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  new_user:         { icon: Users,     bg: 'bg-primary/10',  color: 'text-primary',  label: 'New User'  },
  request_received: { icon: UserPlus,  bg: 'bg-success/15',  color: 'text-success',  label: 'Request'   },
  request_accepted: { icon: UserCheck, bg: 'bg-success/15',  color: 'text-success',  label: 'Accepted'  },
  request_rejected: { icon: UserX,     bg: 'bg-danger/10',   color: 'text-danger',   label: 'Declined'  },
}

const FILTER_TABS = ['All', 'Unread', 'Request', 'New User'] as const
type FilterTab = typeof FILTER_TABS[number]

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const { data: notifications = [] } = useNotifications('personal')
  const { mutate: markAllRead } = useMarkAllRead()
  const { mutate: markOneRead } = useMarkOneRead()
  const { mutate: deleteOne } = useDeleteNotification()

  const unread = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Unread') return !n.read
    if (activeTab === 'Request') return n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected'
    if (activeTab === 'New User') return n.type === 'new_user'
    return true
  })

  function handleClick(n: (typeof notifications)[number]) {
    if (!n.read) markOneRead(n._id)
    if (n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected') {
      navigate('/requests')
    }
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Notifications"
            subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
            actions={
              unread > 0 ? (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                >
                  <CheckCheck className="size-4" />
                  Mark all as read
                </button>
              ) : undefined
            }
          />

          {/* Filter tabs */}
          <div className="pb-4 flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => {
              const count = tab === 'Unread'
                ? notifications.filter((n) => !n.read).length
                : tab === 'All'
                ? notifications.length
                : tab === 'Request'
                ? notifications.filter((n) => n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected').length
                : notifications.filter((n) => n.type === 'new_user').length

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
          <div className="py-4">
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
                const { icon: Icon, bg, color, label } = TYPE_META[n.type]
                const isRequest = n.type === 'request_received' || n.type === 'request_accepted' || n.type === 'request_rejected'
                return (
                  <div
                    key={n._id}
                    onClick={() => handleClick(n)}
                    className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                      !n.read ? 'bg-secondary/20' : 'hover:bg-muted/40'
                    } ${idx !== 0 ? 'border-t border-border' : ''} ${isRequest ? 'cursor-pointer' : ''}`}
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
                      <p className="text-xs text-muted-foreground mt-1.5">{timeAgo(n.createdAt)}</p>
                    </div>

                    {/* Dismiss */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteOne(n._id) }}
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

      </div>
    </AppLayout>
  )
}
