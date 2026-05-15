import { useEffect, useRef, useState } from 'react'
import { X, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useAddProjectMember } from '../../hooks/useProjects'

interface Props {
  open: boolean
  projectId: string
  onClose: () => void
}

export default function InviteMemberModal({ open, projectId, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { mutateAsync: addMember, isPending } = useAddProjectMember()

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setEmail('')
      setError('')
    } else {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setError('')
    try {
      await addMember({ projectId, email: trimmed })
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr?.response?.data?.message || 'Failed to invite member')
    }
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">Invite Team Member</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add a professional workspace user to this project
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="invite-email" className="block text-sm font-bold text-foreground mb-2">
              Email Address
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 bg-input border rounded-xl text-sm transition-colors focus-within:border-primary ${
                error ? 'border-danger' : 'border-border'
              }`}
            >
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="colleague@company.com"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-danger">
                <AlertCircle className="size-3.5 shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              The user must have a professional workspace to be added.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-muted-foreground font-bold text-sm hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !email.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Loader2 className="size-4 animate-spin shrink-0" />}
              {isPending ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
