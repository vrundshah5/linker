import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X, CheckCheck, Bell, Check, XCircle } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import NotifAvatar from '../components/ui/NotifAvatar'
import type { NotificationType } from '../services/notificationService'
import {
  useNotifications,
  useMarkAllRead,
  useMarkOneRead,
  useDeleteNotification,
} from '../hooks/useNotifications'
import { useRespondToProjectInvite } from '../hooks/useProjects'

const TYPE_META: Record<NotificationType, { bg: string; color: string; label: string }> = {
  new_user:         { bg: 'bg-primary/10',  color: 'text-primary',  label: 'New User'       },
  request_received: { bg: 'bg-success/15',  color: 'text-success',  label: 'Request'        },
  request_accepted: { bg: 'bg-success/15',  color: 'text-success',  label: 'Accepted'       },
  request_rejected: { bg: 'bg-danger/10',   color: 'text-danger',   label: 'Declined'       },
  project_invite:   { bg: 'bg-primary/10',  color: 'text-primary',  label: 'Project Invite' },
  support_ticket:   { bg: 'bg-warning/10',  color: 'text-warning',  label: 'Support'        },
}

const FILTER_TABS = ['All', 'Unread', 'Project Invites'] as const
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

export default function ProfessionalNotifications() {
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('id')
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [responded, setResponded] = useState<Record<string, 'accepted' | 'rejected'>>({})
  const { data: notifications = [] } = useNotifications('professional')
  const { mutate: markAllRead } = useMarkAllRead()
  const { mutate: markOneRead } = useMarkOneRead()
  const { mutate: deleteOne } = useDeleteNotification()
  const { mutate: respondToInvite, isPending: isResponding } = useRespondToProjectInvite()
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightId, notifications])

  const unread = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All')             return true
    if (activeTab === 'Unread')          return !n.read
    if (activeTab === 'Project Invites') return n.type === 'project_invite'
    return true
  })

  function tabCount(tab: FilterTab) {
    if (tab === 'All')             return notifications.length
    if (tab === 'Unread')          return notifications.filter((n) => !n.read).length
    if (tab === 'Project Invites') return notifications.filter((n) => n.type === 'project_invite').length
    return 0
  }

  return (
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Notifications"
            subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
            actions={
              unread > 0 ? (
                <button
                  type="button"
                  onClick={() => markAllRead('professional')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
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
                      ? 'bg-primary text-primary-foreground'
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
                <p className="text-sm text-muted-foreground">You're all caught up in this category.</p>
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                {filtered.map((n, idx) => {
                  const { bg, color, label } = TYPE_META[n.type]
                  const isHighlighted = n._id === highlightId
                  const respondedStatus = responded[n._id]
                  const isInvite = n.type === 'project_invite' && !!n.meta.projectId && !respondedStatus
                  return (
                    <div
                      key={n._id}
                      ref={isHighlighted ? highlightRef : undefined}
                      className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                        isHighlighted ? 'ring-2 ring-primary ring-inset bg-primary/5'
                        : !n.read ? 'bg-secondary/20' : 'hover:bg-muted/40'
                      } ${idx !== 0 ? 'border-t border-border' : ''}`}
                    >
                      <NotifAvatar n={n} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-foreground leading-snug">{n.title}</p>
                          {!n.read && <span className="size-2 rounded-full bg-primary shrink-0" />}
                          <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${bg} ${color}`}>
                            {respondedStatus === 'accepted' ? 'Accepted'
                              : respondedStatus === 'rejected' ? 'Declined'
                              : label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">{n.body}</p>

                        {/* Accept / Decline for pending project invites */}
                        {isInvite && n.meta.projectId && (
                          <div className="flex items-center gap-2 mt-2.5">
                            <button
                              type="button"
                              disabled={isResponding}
                              onClick={() => {
                                markOneRead(n._id)
                                respondToInvite({ projectId: n.meta.projectId!, status: 'accepted' }, {
                                  onSuccess: () => setResponded((prev) => ({ ...prev, [n._id]: 'accepted' })),
                                })
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success text-xs font-bold rounded-lg hover:bg-success/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Check className="size-3.5" />
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={isResponding}
                              onClick={() => {
                                markOneRead(n._id)
                                respondToInvite({ projectId: n.meta.projectId!, status: 'rejected' }, {
                                  onSuccess: () => setResponded((prev) => ({ ...prev, [n._id]: 'rejected' })),
                                })
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger text-xs font-bold rounded-lg hover:bg-danger/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="size-3.5" />
                              Decline
                            </button>
                          </div>
                        )}

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
    </WorkspaceLayout>
  )
}
