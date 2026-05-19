import { useState } from 'react'
import { Mail, Clock, X, Check, MessageSquare, XCircle, Send, UserPlus } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import { useRequests, useSendRequest, useRespondRequest, useCancelRequest } from '../hooks/useRequests'
import type { ConnectionRequest } from '../services/requestService'

type Tab = 'all' | 'pending' | 'sent' | 'history'

const STATUS_STYLES = {
  pending:  { label: 'PENDING',  className: 'bg-warning/15 text-warning' },
  sent:     { label: 'SENT',     className: 'bg-primary/10 text-primary' },
  accepted: { label: 'ACCEPTED', className: 'bg-success/15 text-success' },
  rejected: { label: 'REJECTED', className: 'bg-danger/10 text-danger'   },
} as const

const AVATAR_COLORS = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-danger/10 text-danger',
]

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export default function Requests() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [showSendModal, setShowSendModal] = useState(false)
  const [modalEmail, setModalEmail] = useState('')
  const [modalNote, setModalNote] = useState('')
  const [error, setError] = useState('')

  const { data } = useRequests()
  const { mutate: sendRequest, isPending: isSending } = useSendRequest()
  const { mutate: respondRequest } = useRespondRequest()
  const { mutate: cancelRequest } = useCancelRequest()

  // Merge received + sent into a unified list for display
  const received: ConnectionRequest[] = data?.received ?? []
  const sent: ConnectionRequest[] = data?.sent ?? []

  // Build unified view rows
  type Row = { req: ConnectionRequest; direction: 'received' | 'sent' }
  const allRows: Row[] = [
    ...received.map((r) => ({ req: r, direction: 'received' as const })),
    ...sent.map((r) => ({ req: r, direction: 'sent' as const })),
  ].sort((a, b) => new Date(b.req.createdAt).getTime() - new Date(a.req.createdAt).getTime())

  const pendingRows = received.filter((r) => r.status === 'pending').map((r) => ({ req: r, direction: 'received' as const }))
  const sentRows = sent.map((r) => ({ req: r, direction: 'sent' as const }))
  const historyRows = [
    ...received.filter((r) => r.status === 'accepted' || r.status === 'rejected').map((r) => ({ req: r, direction: 'received' as const })),
    ...sent.filter((r) => r.status === 'accepted' || r.status === 'rejected').map((r) => ({ req: r, direction: 'sent' as const })),
  ]

  const TABS = [
    { key: 'all' as Tab,     label: 'All Requests',       count: allRows.length     },
    { key: 'pending' as Tab, label: 'Pending Received',   count: pendingRows.length },
    { key: 'sent' as Tab,    label: 'Sent',               count: sentRows.length    },
    { key: 'history' as Tab, label: 'History',            count: historyRows.length },
  ]

  const visible = activeTab === 'all' ? allRows
    : activeTab === 'pending' ? pendingRows
    : activeTab === 'sent' ? sentRows
    : historyRows

  function handleSend() {
    setError('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(modalEmail.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    sendRequest(
      { email: modalEmail.trim(), note: modalNote.trim() || undefined },
      {
        onSuccess: () => {
          setShowSendModal(false)
          setModalEmail('')
          setModalNote('')
          setError('')
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          setError(msg ?? 'Failed to send request.')
        },
      }
    )
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

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
                  onClick={() => { setShowSendModal(false); setModalEmail(''); setModalNote(''); setError('') }}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-lg hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 flex flex-col gap-4">
                {error && (
                  <p className="text-sm text-danger bg-danger/5 border border-danger/20 px-4 py-2.5 rounded-xl">{error}</p>
                )}
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
                  onClick={() => { setShowSendModal(false); setModalEmail(''); setModalNote(''); setError('') }}
                  className="px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!modalEmail.trim() || isSending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="size-3.5" />
                  {isSending ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
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
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <UserPlus className="size-7 text-muted-foreground" />
              </div>
              <p className="text-base font-bold text-foreground mb-1">No requests here</p>
              <p className="text-sm text-muted-foreground">Use "Send New Request" to connect with someone.</p>
            </div>
          ) : (
            visible.map(({ req, direction }, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
              const otherUser = direction === 'received' ? req.fromUserId : req.toUserId
              const displayStatus = direction === 'sent' && req.status === 'pending' ? 'sent' : req.status

              return (
                <div
                  key={req._id}
                  className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Avatar */}
                  <div className={`size-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${avatarColor}`}>
                    {initials(otherUser.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-base font-bold text-foreground">{otherUser.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${STATUS_STYLES[displayStatus].className}`}>
                        {STATUS_STYLES[displayStatus].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {otherUser.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {timeAgo(req.createdAt)}
                      </span>
                    </div>
                    {req.note && (
                      <p className="text-xs text-muted-foreground mt-1.5 italic">"{req.note}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {direction === 'received' && req.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => respondRequest({ id: req._id, action: 'rejected' })}
                          className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <X className="size-4" />
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => respondRequest({ id: req._id, action: 'accepted' })}
                          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <Check className="size-4" />
                          Accept
                        </button>
                      </>
                    )}

                    {direction === 'sent' && req.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => cancelRequest(req._id)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <XCircle className="size-4 text-muted-foreground" />
                        Cancel Request
                      </button>
                    )}

                    {req.status === 'accepted' && (
                      <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success rounded-full text-sm font-bold cursor-default"
                      >
                        <MessageSquare className="size-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      </div>
    </AppLayout>
  )
}
