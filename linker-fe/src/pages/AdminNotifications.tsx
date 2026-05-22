import { useState } from 'react'
import { X, CheckCheck, Bell } from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'
import NotifAvatar from '../components/ui/NotifAvatar'
import type { NotificationType } from '../services/notificationService'
import {
  useNotifications,
  useMarkAllRead,
  useMarkOneRead,
  useDeleteNotification,
} from '../hooks/useNotifications'

const TYPE_META: Record<NotificationType, { bg: string; color: string; label: string }> = {
  new_user:         { bg: 'bg-primary/10', color: 'text-primary', label: 'System'         },
  request_received: { bg: 'bg-primary/10', color: 'text-primary', label: 'System'         },
  request_accepted: { bg: 'bg-primary/10', color: 'text-primary', label: 'System'         },
  request_rejected: { bg: 'bg-primary/10', color: 'text-primary', label: 'System'         },
  project_invite:   { bg: 'bg-primary/10', color: 'text-primary', label: 'System'         },
  support_ticket:   { bg: 'bg-warning/10', color: 'text-warning', label: 'Support Ticket' },
}

const FILTER_TABS = ['All', 'Unread', 'Support Tickets'] as const
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

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const { data: notifications = [] } = useNotifications('admin')
  const { mutate: markAllRead } = useMarkAllRead()
  const { mutate: markOneRead } = useMarkOneRead()
  const { mutate: deleteOne } = useDeleteNotification()

  const unread = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All')             return true
    if (activeTab === 'Unread')          return !n.read
    if (activeTab === 'Support Tickets') return n.type === 'support_ticket'
    return true
  })

  function tabCount(tab: FilterTab) {
    if (tab === 'All')             return notifications.length
    if (tab === 'Unread')          return notifications.filter((n) => !n.read).length
    if (tab === 'Support Tickets') return notifications.filter((n) => n.type === 'support_ticket').length
    return 0
  }

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Notifications"
            subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
            actions={
              unread > 0 ? (
                <button
                  type="button"
                  onClick={() => markAllRead('admin')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-danger border border-danger/30 rounded-xl hover:bg-danger/5 transition-colors cursor-pointer"
                >
                  <CheckCheck className="size-4" />
                  Mark all as read
                </button>
              ) : undefined
            }
          />

          <div className="pb-4 flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => {
              const count = tabCount(tab)
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-danger text-white'
                      : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="py-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Bell className="size-7 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground mb-1">No notifications</p>
                <p className="text-sm text-muted-foreground">Nothing here yet.</p>
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                {filtered.map((n, idx) => {
                  const { bg, color, label } = TYPE_META[n.type]
                  return (
                    <div
                      key={n._id}
                      onClick={() => { if (!n.read) markOneRead(n._id) }}
                      className={`flex items-start gap-4 px-6 py-4 transition-colors ${!n.read ? 'bg-secondary/20' : 'hover:bg-muted/40'} ${idx !== 0 ? 'border-t border-border' : ''}`}
                    >
                      <NotifAvatar n={n} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-foreground leading-snug">{n.title}</p>
                          {!n.read && <span className="size-2 rounded-full bg-danger shrink-0" />}
                          <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${bg} ${color}`}>{label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">{n.body}</p>
                        <p className="text-xs text-muted-foreground mt-1.5">{timeAgo(n.createdAt)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteOne(n._id) }}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 mt-1 p-1 rounded-lg hover:bg-muted"
                        aria-label="Dismiss"
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
    </AdminLayout>
  )
}
