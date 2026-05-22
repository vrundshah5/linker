import { useState } from 'react'
import { LifeBuoy, Clock, CheckCircle2, AlertCircle, Loader2, ChevronDown, Search, X } from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import { useAdminTickets, useAdminUpdateTicket } from '../hooks/useSupport'
import type { TicketStatus, TicketPriority, AdminSupportTicket } from '../services/supportService'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: typeof Clock }> = {
  open:          { label: 'Open',        color: 'bg-warning/10 text-warning',  icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-primary/10 text-primary',  icon: AlertCircle },
  resolved:      { label: 'Resolved',    color: 'bg-success/10 text-success',  icon: CheckCircle2 },
}

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  high:   { label: 'High',   color: 'bg-danger/10 text-danger' },
}

function TicketDrawer({
  ticket,
  onClose,
}: {
  ticket: AdminSupportTicket
  onClose: () => void
}) {
  const { mutate: update, isPending } = useAdminUpdateTicket()
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [adminNote, setAdminNote] = useState(ticket.adminNote || '')

  function handleSave() {
    update(
      { id: ticket._id, status, adminNote },
      {
        onSuccess: () => { toast.success('Ticket updated'); onClose() },
        onError: () => toast.error('Update failed'),
      }
    )
  }

  const StatusIcon = STATUS_CONFIG[status].icon

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[480px] bg-surface border-l border-border flex flex-col h-full overflow-y-auto">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-base font-bold text-foreground">Ticket Detail</h2>
          <button type="button" onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 flex flex-col gap-6">
          {/* Submitted by */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Submitted by</p>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {ticket.userId.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{ticket.userId.name}</p>
                <p className="text-xs text-muted-foreground">{ticket.userId.email}</p>
              </div>
            </div>
          </div>

          {/* Title & description */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Title</p>
            <p className="text-sm font-semibold text-foreground">{ticket.title}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${PRIORITY_CONFIG[ticket.priority].color}`}>
              {PRIORITY_CONFIG[ticket.priority].label} priority
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="border-t border-border" />

          {/* Update status */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex gap-2">
              {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => {
                const cfg = STATUS_CONFIG[s]
                const Icon = cfg.icon
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                      status === s
                        ? `${cfg.color} border-current`
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Admin Note <span className="normal-case font-normal">(visible to user)</span></p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a response or note for the user…"
              rows={4}
              maxLength={1000}
              className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminSupport() {
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selected, setSelected] = useState<AdminSupportTicket | null>(null)

  const { data, isLoading } = useAdminTickets({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  })

  const tickets = data?.tickets ?? []
  const total = data?.total ?? 0

  return (
    <AdminLayout>
      <div className="h-full overflow-y-auto">
        <div className="px-8 py-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="size-12 rounded-2xl bg-danger/10 flex items-center justify-center shrink-0">
              <LifeBuoy className="size-6 text-danger" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{total} ticket{total !== 1 ? 's' : ''} total</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 text-sm font-semibold text-foreground outline-none pr-8 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 text-sm font-semibold text-foreground outline-none pr-8 cursor-pointer"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-16 flex flex-col items-center text-center">
              <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <LifeBuoy className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground">No tickets found</p>
              <p className="text-sm text-muted-foreground mt-1">Tickets submitted by users will appear here.</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">Title</th>
                    <th className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">Submitted By</th>
                    <th className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">Priority</th>
                    <th className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">Status</th>
                    <th className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, i) => {
                    const status = STATUS_CONFIG[ticket.status]
                    const prio = PRIORITY_CONFIG[ticket.priority]
                    const StatusIcon = status.icon
                    return (
                      <tr
                        key={ticket._id}
                        onClick={() => setSelected(ticket)}
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${i !== tickets.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm font-semibold text-foreground truncate">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{ticket.description}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-foreground">{ticket.userId.name}</p>
                          <p className="text-xs text-muted-foreground">{ticket.userId.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${prio.color}`}>
                            {prio.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                            <StatusIcon className="size-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && <TicketDrawer ticket={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  )
}
