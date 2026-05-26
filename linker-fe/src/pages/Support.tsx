import { useState, useRef, useEffect } from 'react'
import { Send, Clock, CheckCircle2, AlertCircle, Loader2, ChevronDown, Check, LifeBuoy } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import { useMyTickets, useSubmitTicket } from '../hooks/useSupport'
import type { TicketPriority, TicketStatus } from '../services/supportService'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: typeof Clock }> = {
  open:        { label: 'Open',        color: 'bg-warning/10 text-warning',   icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-primary/10 text-primary',   icon: AlertCircle },
  resolved:    { label: 'Resolved',    color: 'bg-success/10 text-success',   icon: CheckCircle2 },
}

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  high:   { label: 'High',   color: 'bg-danger/10 text-danger' },
}

const PRIORITY_OPTIONS: { value: TicketPriority; label: string; dot: string }[] = [
  { value: 'low',    label: 'Low — minor inconvenience',    dot: 'bg-muted-foreground' },
  { value: 'medium', label: 'Medium — affects my workflow', dot: 'bg-warning' },
  { value: 'high',   label: 'High — something is broken',  dot: 'bg-danger' },
]

function SupportContent({ workspace }: { workspace: 'personal' | 'professional' }) {
  const { data: tickets, isLoading } = useMyTickets()
  const { mutate: submit, isPending } = useSubmitTicket()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [priorityOpen, setPriorityOpen] = useState(false)
  const priorityRef = useRef<HTMLDivElement>(null)

  // Close priority dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    submit(
      { title, description, priority, workspace },
      {
        onSuccess: () => {
          toast.success('Ticket submitted! We\'ll get back to you soon.')
          setTitle('')
          setDescription('')
          setPriority('medium')
        },
        onError: () => toast.error('Failed to submit ticket. Please try again.'),
      }
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-8">

        <PageHeader
          title="Support"
          subtitle="Report a bug or ask for help — we'll respond as soon as possible."
        />

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* LEFT — Submit form */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Raise a new ticket</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short summary of the issue"
                  maxLength={120}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail — steps to reproduce, expected vs actual behaviour…"
                  maxLength={2000}
                  rows={5}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{description.length}/2000</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Priority</label>
                <div className="relative" ref={priorityRef}>
                  <button
                    type="button"
                    onClick={() => setPriorityOpen((o) => !o)}
                    className="w-full flex items-center justify-between gap-2 bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer hover:border-primary/50"
                  >
                    <span>{PRIORITY_OPTIONS.find((o) => o.value === priority)?.label}</span>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform ${priorityOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {priorityOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
                      {PRIORITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setPriority(opt.value); setPriorityOpen(false) }}
                          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={`size-2 rounded-full ${opt.dot}`} />
                            {opt.label}
                          </span>
                          {priority === opt.value && <Check className="size-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={!title.trim() || !description.trim() || isPending}
                className="flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 self-end"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Submit Ticket
              </button>
            </form>
          </div>

          {/* RIGHT — My tickets */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-4">My Tickets</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-6 text-muted-foreground animate-spin" />
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center text-center">
                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <LifeBuoy className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">No tickets yet</p>
                <p className="text-sm text-muted-foreground mt-1">Submitted tickets will appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tickets.map((ticket) => {
                  const status = STATUS_CONFIG[ticket.status]
                  const priority = PRIORITY_CONFIG[ticket.priority]
                  const StatusIcon = status.icon
                  return (
                    <div key={ticket._id} className="bg-surface border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-sm font-bold text-foreground leading-tight">{ticket.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${priority.color}`}>
                            {priority.label}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                            <StatusIcon className="size-3" />
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{ticket.description}</p>
                      {ticket.adminNote && (
                        <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                          <p className="text-xs font-bold text-primary mb-0.5">Admin response</p>
                          <p className="text-sm text-foreground">{ticket.adminNote}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

interface SupportPageProps {
  variant?: 'personal' | 'professional'
}

export default function Support({ variant = 'personal' }: SupportPageProps) {
  if (variant === 'professional') {
    return <WorkspaceLayout><SupportContent workspace="professional" /></WorkspaceLayout>
  }
  return <AppLayout><SupportContent workspace="personal" /></AppLayout>
}
