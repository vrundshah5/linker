import { useEffect, useRef, useState } from 'react'
import { X, Link2, Plus, Trash2, Loader2 } from 'lucide-react'

interface Resource {
  url: string
  title: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (resources: Resource[]) => void
  isPending?: boolean
}

export default function AddResourceModal({ open, onClose, onSubmit, isPending }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [resources, setResources] = useState<Resource[]>([{ url: '', title: '' }])

  // Reset when modal closes
  useEffect(() => {
    if (!open) setResources([{ url: '', title: '' }])
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

  function updateResource(index: number, field: keyof Resource, value: string) {
    setResources((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    )
  }

  function addRow() {
    setResources((prev) => [...prev, { url: '', title: '' }])
  }

  function removeRow(index: number) {
    setResources((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = resources.filter((r) => r.url.trim())
    if (valid.length === 0) return
    onSubmit(valid.map((r) => ({ url: r.url.trim(), title: r.title.trim() })))
  }

  if (!open) return null

  const hasValid = resources.some((r) => r.url.trim())

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-10 shadow-xl relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Add Resources
        </h1>
        <p className="text-base text-muted-foreground mb-10">
          Save links and documents to this project for easy access by the team.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Resources section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Resource Links
            </h3>
            <div className="flex flex-col gap-3">
              {resources.map((resource, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-input border border-border rounded-xl px-4 py-3 text-sm focus-within:border-primary transition-colors">
                      <Link2 className="text-muted-foreground shrink-0 size-[18px]" />
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => updateResource(idx, 'url', e.target.value)}
                        placeholder="Paste a URL..."
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => updateResource(idx, 'title', e.target.value)}
                      placeholder="Title (optional)"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="p-3 mt-0.5 border border-border text-muted-foreground rounded-xl hover:bg-danger/10 hover:text-danger transition-colors shrink-0 cursor-pointer"
                      aria-label="Remove resource"
                    >
                      <Trash2 className="size-[18px]" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add another */}
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-1"
              >
                <Plus className="size-4" />
                Add another resource
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !hasValid}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin shrink-0" />
              )}
              {isPending ? 'Adding...' : 'Add Resources'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
