import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Focus cancel button on open & close on Escape
  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  const confirmCls =
    variant === 'danger'
      ? 'bg-danger text-white hover:opacity-90'
      : 'bg-primary text-primary-foreground hover:opacity-90'

  const iconCls =
    variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onMouseDown={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onCancel() }}
    >
      {/* Panel */}
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Icon */}
        <div className={`size-12 rounded-2xl ${iconCls} flex items-center justify-center mb-4`}>
          <AlertTriangle className="size-6" />
        </div>

        {/* Text */}
        <h2 className="text-base font-bold text-foreground mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-surface border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 font-bold text-sm rounded-full transition-opacity cursor-pointer ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
