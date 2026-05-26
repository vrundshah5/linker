import { useEffect, useRef, useState } from 'react'
import { X, Link2, Loader2, ChevronDown, Check } from 'lucide-react'
import { useCreateLink } from '../../hooks/links/useCreateLink'
import { useMyCategories } from '../../hooks/categories/useMyCategories'
import { getCategoryIcon } from '../../lib/categoryIcons'

interface Props {
  open: boolean
  onClose: () => void
  categoryId?: string
  context?: 'personal' | 'professional'
}

export default function AddLinkModal({ open, onClose, categoryId, context }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId ?? '')
  const [error, setError] = useState('')
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const catDropdownRef = useRef<HTMLDivElement>(null)

  const urlRef = useRef<HTMLInputElement>(null)
  const { mutate: createLink, isPending } = useCreateLink(categoryId)
  const { data: categories } = useMyCategories(context)

  // Close category dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false)
      }
    }
    if (catDropdownOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [catDropdownOpen])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setUrl('')
      setTitle('')
      setDescription('')
      setSelectedCategoryId(categoryId ?? '')
      setError('')
      setTimeout(() => urlRef.current?.focus(), 50)
    }
  }, [open, categoryId])

  if (!open) return null

  const resolvedCategoryId = categoryId ?? selectedCategoryId
  const canSubmit = !isPending && url.trim() && title.trim() && resolvedCategoryId

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!resolvedCategoryId) {
      setError('Please select a category.')
      return
    }

    let normalised = url.trim()
    if (!normalised.startsWith('http://') && !normalised.startsWith('https://')) {
      normalised = `https://${normalised}`
    }
    try {
      new URL(normalised)
    } catch {
      setError('Please enter a valid URL.')
      return
    }

    createLink(
      { categoryId: resolvedCategoryId, title: title.trim(), url: normalised, description: description.trim() },
      {
        onSuccess: () => { onClose() },
        onError: () => { setError('Failed to save link. Please try again.') },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="size-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Add Link</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3.5">

          {/* Category selector — only when no categoryId is pre-set */}
          {!categoryId && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                Category <span className="text-danger">*</span>
              </label>
              <div className="relative" ref={catDropdownRef}>
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setCatDropdownOpen((p) => !p)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 bg-background border rounded-xl text-sm transition-colors cursor-pointer ${
                    catDropdownOpen ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {selectedCategoryId && categories ? (() => {
                    const cat = categories.find((c) => c._id === selectedCategoryId)
                    if (!cat) return null
                    const Icon = getCategoryIcon(cat.icon)
                    return (
                      <>
                        <div
                          className="size-6 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.themeColor}20`, color: cat.themeColor }}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <span className="flex-1 text-left text-foreground font-medium truncate">{cat.name}</span>
                      </>
                    )
                  })() : (
                    <span className="flex-1 text-left text-muted-foreground">Select a category…</span>
                  )}
                  <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${catDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown list */}
                {catDropdownOpen && categories && categories.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-52 overflow-y-auto">
                    {categories.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon)
                      const isSelected = cat._id === selectedCategoryId
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSelectedCategoryId(cat._id); setCatDropdownOpen(false) }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-primary/8 text-foreground'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <div
                            className="size-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.themeColor}20`, color: cat.themeColor }}
                          >
                            <Icon className="size-4" />
                          </div>
                          <span className="flex-1 text-left font-medium truncate">{cat.name}</span>
                          {isSelected && <Check className="size-4 text-primary shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">
              URL <span className="text-danger">*</span>
            </label>
            <input
              ref={urlRef}
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Give this link a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">
              Description{' '}
              <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <textarea
              placeholder="Short note about this link…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-danger font-semibold">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

