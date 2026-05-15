import { useState } from 'react'
import { Mail, Clock, X, Check, MessageSquare, RefreshCw, XCircle, Send, UserPlus } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'

type Status = 'pending' | 'sent' | 'accepted' | 'rejected'
type Tab = 'all' | 'pending' | 'sent' | 'history'

interface Request {
  id: number
  name: string
  email: string
  time: string
  status: Status
  avatar: string
}

const REQUESTS: Request[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    email: 'alice@example.com',
    time: '2 hours ago',
    status: 'pending',
    avatar: 'AM',
  },
  {
    id: 2,
    name: 'David Lee',
    email: 'david.lee@design.co',
    time: 'Yesterday',
    status: 'sent',
    avatar: 'DL',
  },
  {
    id: 3,
    name: 'Sophia Chen',
    email: 'sophia.c@studio.io',
    time: '3 days ago',
    status: 'accepted',
    avatar: 'SC',
  },
  {
    id: 4,
    name: 'Marcus Wright',
    email: 'marcus@dev.net',
    time: 'Last week',
    status: 'rejected',
    avatar: 'MW',
  },
  {
    id: 5,
    name: 'Isabella Martinez',
    email: 'bella.m@marketing.org',
    time: 'Just now',
    status: 'pending',
    avatar: 'IM',
  },
]

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'all', label: 'All Requests', count: 5 },
  { key: 'pending', label: 'Pending Received', count: 2 },
  { key: 'sent', label: 'Sent', count: 1 },
  { key: 'history', label: 'History', count: 2 },
]

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  pending: {
    label: 'PENDING',
    className: 'bg-warning/15 text-warning',
  },
  sent: {
    label: 'SENT',
    className: 'bg-primary/10 text-primary',
  },
  accepted: {
    label: 'ACCEPTED',
    className: 'bg-success/15 text-success',
  },
  rejected: {
    label: 'REJECTED',
    className: 'bg-danger/10 text-danger',
  },
}

// Avatar background colors cycling
const AVATAR_COLORS = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-danger/10 text-danger',
]

function filterByTab(requests: Request[], tab: Tab): Request[] {
  if (tab === 'all') return requests
  if (tab === 'pending') return requests.filter((r) => r.status === 'pending')
  if (tab === 'sent') return requests.filter((r) => r.status === 'sent')
  if (tab === 'history') return requests.filter((r) => r.status === 'accepted' || r.status === 'rejected')
  return requests
}

export default function Requests() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [showSendModal, setShowSendModal] = useState(false)
  const [modalEmail, setModalEmail] = useState('')
  const [modalNote, setModalNote] = useState('')
  const visible = filterByTab(REQUESTS, activeTab)

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <PageHeader
          title="Chat Requests"
          subtitle="Manage your incoming and outgoing friend requests."
          actions={
            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Send New Request
            </button>
          }
        />

        {/* Send Request Modal */}
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserPlus className="size-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Send Friend Request</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Connect with someone by their email</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowSendModal(false); setModalEmail(''); setModalNote('') }}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-lg hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Email address <span className="text-danger">*</span>
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-xl focus-within:border-primary transition-colors">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <input
                      type="email"
                      placeholder="friend@example.com"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Add a note <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hey, let's connect on Linker!"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowSendModal(false); setModalEmail(''); setModalNote('') }}
                  className="px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSendModal(false); setModalEmail(''); setModalNote('') }}
                  disabled={!modalEmail.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="size-3.5" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-7">
        {/* Underline tabs */}
        <div className="flex items-center border-b border-border mb-6 gap-2">
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 px-1 mr-5 text-sm font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Request rows */}
        <div className="flex flex-col gap-3">
          {visible.map((req, i) => {
            const badge = STATUS_STYLES[req.status]
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]

            return (
              <div
                key={req.id}
                className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
              >
                {/* Avatar */}
                <div
                  className={`size-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${avatarColor}`}
                >
                  {req.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-base font-bold text-foreground">{req.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {req.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {req.time}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <X className="size-4" />
                        Decline
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Check className="size-4" />
                        Accept
                      </button>
                    </>
                  )}

                  {req.status === 'sent' && (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <XCircle className="size-4 text-muted-foreground" />
                      Cancel Request
                    </button>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-primary rounded-full text-sm font-bold hover:bg-primary/15 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="size-4" />
                      Message
                    </button>
                  )}

                  {req.status === 'rejected' && (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <RefreshCw className="size-4 text-muted-foreground" />
                      Send Again
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground py-16 text-center">
              No requests in this section.
            </p>
          )}
        </div>
      </div>
      </div>
    </AppLayout>
  )
}
