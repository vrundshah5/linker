import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, X, Folder } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useUpdateCategory } from '../../hooks/categories/useUpdateCategory'
import { useDeleteCategory } from '../../hooks/categories/useDeleteCategory'
import ConfirmModal from './ConfirmModal'
import type { UserCategory } from '../../services/categoryService'

// ── Shared preset colors ────────────────────────────────────────────────────
const PRESET_COLORS = [
  { value: '#6c5dd3', label: 'Purple' },
  { value: '#3eac68', label: 'Green' },
  { value: '#ff9b26', label: 'Orange' },
  { value: '#ff6a55', label: 'Red' },
]

// ── Edit Modal ───────────────────────────────────────────────────────────────
const editSchema = yup.object({
  name: yup.string().min(2, 'At least 2 characters').required('Name is required'),
  description: yup.string().optional(),
})
type EditFormData = yup.InferType<typeof editSchema>

function EditModal({
  category,
  onClose,
}: {
  category: UserCategory | null
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState(PRESET_COLORS[0].value)
  const { mutateAsync: update, isPending } = useUpdateCategory()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>({
    resolver: yupResolver(editSchema),
  })

  useEffect(() => {
    if (category) {
      reset({ name: category.name, description: category.description })
      setColor(category.themeColor)
    }
  }, [category, reset])

  useEffect(() => {
    if (!category) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [category, onClose])

  async function onSubmit(data: EditFormData) {
    if (!category) return
    await update({ id: category._id, payload: { name: data.name.trim(), description: data.description?.trim(), themeColor: color } })
    onClose()
  }

  if (!category) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { e.stopPropagation(); if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Folder className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Edit Category</h2>
              <p className="text-xs text-muted-foreground">Update name, description or colour</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-5">
          <div>
            <label htmlFor="edit-cat-name" className="block text-sm font-bold text-foreground mb-2">Category Name</label>
            <div className={`flex items-center gap-3 px-4 py-3 bg-input border rounded-xl text-sm transition-colors focus-within:border-primary ${errors.name ? 'border-danger' : 'border-border'}`}>
              <Folder className="size-4 text-muted-foreground shrink-0" />
              <input id="edit-cat-name" type="text" {...register('name')} className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0" />
            </div>
            {errors.name && <p className="text-xs text-danger font-medium mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-cat-desc" className="block text-sm font-bold text-foreground mb-2">Description <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <textarea id="edit-cat-desc" rows={3} {...register('description')} className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary transition-colors" />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">Theme Color</p>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button key={c.value} type="button" onClick={() => setColor(c.value)} title={c.label}
                  className="relative size-9 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: c.value }}>
                  {color === c.value && <span className="absolute inset-0 flex items-center justify-center"><span className="size-2.5 rounded-full bg-white/90" /></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
              {isPending && <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── 3-dot menu ───────────────────────────────────────────────────────────────
interface CategoryCardMenuProps {
  category: UserCategory
}

export default function CategoryCardMenu({ category }: CategoryCardMenuProps) {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    /* Stop ALL clicks inside this component from reaching the card's onClick */
    <div onClick={(e) => e.stopPropagation()}>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-lg hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => { setOpen(false); setEditOpen(true) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5 text-muted-foreground" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setDeleteOpen(true) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      <EditModal category={editOpen ? category : null} onClose={() => setEditOpen(false)} />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Category"
        description={`Delete "${category.name}"? This cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        onConfirm={() => { deleteCategory(category._id); setDeleteOpen(false) }}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
