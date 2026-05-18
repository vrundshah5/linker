import { useEffect, useRef, useState } from 'react'
import { Trash2, Loader2, X, Folder, Plus, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AdminLayout from '../components/layouts/AdminLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'
import { useAdminCategories } from '../hooks/admin/useAdminCategories'
import { useCreateGlobalCategory } from '../hooks/admin/useCreateGlobalCategory'
import { useDeleteGlobalCategory } from '../hooks/admin/useDeleteGlobalCategory'
import { useUpdateGlobalCategory } from '../hooks/admin/useUpdateGlobalCategory'
import { getCategoryIcon } from '../lib/categoryIcons'
import type { AdminGlobalCategory } from '../services/admin.service'

const PRESET_COLORS = [
  { value: '#6c5dd3', label: 'Purple' },
  { value: '#3eac68', label: 'Green' },
  { value: '#ff9b26', label: 'Orange' },
  { value: '#ff6a55', label: 'Red' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ef4444', label: 'Crimson' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#64748b', label: 'Slate' },
]

// All recognised file extension groups
const EXTENSION_GROUPS: { group: string; exts: string[] }[] = [
  { group: 'Video', exts: ['mp4', 'mov', 'avi', 'mkv', 'webm'] },
  { group: 'Image', exts: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
  { group: 'Document', exts: ['pdf', 'doc', 'docx', 'txt', 'md'] },
  { group: 'Spreadsheet', exts: ['xls', 'xlsx', 'csv'] },
  { group: 'Presentation', exts: ['ppt', 'pptx'] },
  { group: 'Audio', exts: ['mp3', 'wav', 'ogg', 'flac'] },
  { group: 'Archive', exts: ['zip', 'rar', '7z', 'tar'] },
  { group: 'Code', exts: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py'] },
]
const ALL_EXTENSIONS = EXTENSION_GROUPS.flatMap((g) => g.exts)

// ── Extensions Multi-Select ──────────────────────────────────────────────────
function ExtensionsPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  function toggle(ext: string) {
    onChange(value.includes(ext) ? value.filter((x) => x !== ext) : [...value, ext])
  }

  function toggleAll() {
    onChange(value.length === ALL_EXTENSIONS.length ? [] : [...ALL_EXTENSIONS])
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground hover:border-primary transition-colors cursor-pointer"
      >
        <span className="text-left truncate">
          {value.length === 0
            ? <span className="text-muted-foreground">Select extensions…</span>
            : value.length === ALL_EXTENSIONS.length
            ? <span>All extensions</span>
            : value.slice(0, 5).map((e) => (
                <span key={e} className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded mr-1">.{e}</span>
              ))
          }
          {value.length > 5 && value.length < ALL_EXTENSIONS.length && (
            <span className="text-xs text-muted-foreground">+{value.length - 5} more</span>
          )}
        </span>
        <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-y-auto">
          {/* Select all */}
          <div className="sticky top-0 bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {value.length} / {ALL_EXTENSIONS.length} selected
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              {value.length === ALL_EXTENSIONS.length ? 'Clear all' : 'Select all'}
            </button>
          </div>

          {EXTENSION_GROUPS.map(({ group, exts }) => (
            <div key={group} className="px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">{group}</p>
              <div className="flex flex-wrap gap-1.5">
                {exts.map((ext) => {
                  const selected = value.includes(ext)
                  return (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => toggle(ext)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                      }`}
                    >
                      .{ext}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const createSchema = yup.object({
  name: yup.string().min(2, 'At least 2 characters').required('Name is required'),
  description: yup.string().optional(),
})
type CreateFormData = yup.InferType<typeof createSchema>

// ── Add Category Modal ───────────────────────────────────────────────────────
function AddCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState(PRESET_COLORS[0].value)
  const [extensions, setExtensions] = useState<string[]>([])
  const { mutateAsync: createCategory, isPending } = useCreateGlobalCategory()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
    resolver: yupResolver(createSchema),
  })

  useEffect(() => {
    if (!open) { reset(); setColor(PRESET_COLORS[0].value); setExtensions([]) }
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function onSubmit(data: CreateFormData) {
    await createCategory({ name: data.name.trim(), description: data.description?.trim(), icon: 'Folder', color, allowedExtensions: extensions })
    onClose()
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Folder className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Add Global Category</h2>
              <p className="text-xs text-muted-foreground">Available to all users during onboarding</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="gc-name" className="block text-sm font-bold text-foreground mb-2">Category Name</label>
            <div className={`flex items-center gap-3 px-4 py-3 bg-input border rounded-xl text-sm transition-colors focus-within:border-primary ${errors.name ? 'border-danger' : 'border-border'}`}>
              <Folder className="size-4 text-muted-foreground shrink-0" />
              <input id="gc-name" type="text" placeholder="e.g. Design Inspiration" {...register('name')} className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0" />
            </div>
            {errors.name && <p className="text-xs text-danger font-medium mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-2">
              Allowed Extensions
              <span className="ml-1.5 text-muted-foreground font-normal">(Optional)</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">Links saved in this category can be tagged with these file types.</p>
            <ExtensionsPicker value={extensions} onChange={setExtensions} />
          </div>

          <div>
            <label htmlFor="gc-desc" className="block text-sm font-bold text-foreground mb-2">Description <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <textarea id="gc-desc" rows={3} placeholder="Brief description..." {...register('description')} className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary transition-colors" />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">Theme Color</p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button key={c.value} type="button" onClick={() => setColor(c.value)} title={c.label}
                  className="relative size-8 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: c.value }}>
                  {color === c.value && <span className="absolute inset-0 flex items-center justify-center"><span className="size-2.5 rounded-full bg-white/90" /></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isPending && <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
              {isPending ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Category Modal ──────────────────────────────────────────────────────
function EditCategoryModal({ category, onClose }: { category: AdminGlobalCategory | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState(PRESET_COLORS[0].value)
  const [extensions, setExtensions] = useState<string[]>([])
  const { mutateAsync: updateCategory, isPending } = useUpdateGlobalCategory()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
    resolver: yupResolver(createSchema),
    defaultValues: { name: category?.name ?? '', description: category?.description ?? '' },
  })

  useEffect(() => {
    if (category) {
      reset({ name: category.name, description: category.description })
      setColor(category.color)
      setExtensions(category.allowedExtensions ?? [])
    }
  }, [category, reset])

  useEffect(() => {
    if (!category) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [category, onClose])

  async function onSubmit(data: CreateFormData) {
    if (!category) return
    await updateCategory({ id: category._id, payload: { name: data.name.trim(), description: data.description?.trim(), color, allowedExtensions: extensions } })
    onClose()
  }

  if (!category) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Edit Category</h2>
          <button type="button" onClick={onClose} className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"><X className="size-4" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-bold text-foreground mb-2">Category Name</label>
            <div className={`flex items-center gap-3 px-4 py-3 bg-input border rounded-xl text-sm focus-within:border-primary ${errors.name ? 'border-danger' : 'border-border'}`}>
              <Folder className="size-4 text-muted-foreground shrink-0" />
              <input id="edit-name" type="text" {...register('name')} className="flex-1 bg-transparent outline-none text-foreground min-w-0" />
            </div>
            {errors.name && <p className="text-xs text-danger font-medium mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-2">
              Allowed Extensions
              <span className="ml-1.5 text-muted-foreground font-normal">(Optional)</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">Links saved in this category can be tagged with these file types.</p>
            <ExtensionsPicker value={extensions} onChange={setExtensions} />
          </div>

          <div>
            <label htmlFor="edit-desc" className="block text-sm font-bold text-foreground mb-2">Description</label>
            <textarea id="edit-desc" rows={3} {...register('description')} className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground outline-none resize-none focus:border-primary transition-colors" />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">Theme Color</p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button key={c.value} type="button" onClick={() => setColor(c.value)} title={c.label}
                  className="relative size-8 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: c.value }}>
                  {color === c.value && <span className="absolute inset-0 flex items-center justify-center"><span className="size-2.5 rounded-full bg-white/90" /></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
              {isPending && <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminGlobalCategories() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminGlobalCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminGlobalCategory | null>(null)

  const { data: categories, isLoading } = useAdminCategories(debouncedSearch)
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteGlobalCategory()

  function handleSearch(value: string) {
    setSearch(value)
    clearTimeout((window as unknown as { _gcs?: number })._gcs)
    ;(window as unknown as { _gcs?: number })._gcs = window.setTimeout(() => setDebouncedSearch(value), 350)
  }

  return (
    <>
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Global Categories"
            subtitle="Manage default categories available to all new users."
            searchValue={search}
            onSearch={handleSearch}
            actions={
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="size-4" />
                Add Category
              </button>
            }
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Folder className="size-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">No global categories yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon)
                return (
                  <div
                    key={cat._id}
                    className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/25 hover:shadow-sm transition-all"
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div
                        className="size-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <Icon className="size-5" style={{ color: cat.color }} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cat.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    {/* Name + description */}
                    <div>
                      <h3 className="text-base font-bold text-foreground">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                      )}
                    </div>

                    {/* Allowed extensions */}
                    {cat.allowedExtensions && cat.allowedExtensions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cat.allowedExtensions.slice(0, 6).map((ext) => (
                          <span key={ext} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-bold rounded">
                            .{ext}
                          </span>
                        ))}
                        {cat.allowedExtensions.length > 6 && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-bold rounded">
                            +{cat.allowedExtensions.length - 6}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Color swatch */}
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs text-muted-foreground font-mono">{cat.color}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setEditTarget(cat)}
                        className="flex-1 py-2 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-border transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
                        className="size-10 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>

    <AddCategoryModal open={addOpen} onClose={() => setAddOpen(false)} />
    <EditCategoryModal category={editTarget} onClose={() => setEditTarget(null)} />

    <ConfirmModal
      open={deleteTarget !== null}
      title="Delete Category"
      description={`Are you sure you want to delete "${deleteTarget?.name ?? ''}"? This cannot be undone.`}
      confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
      onConfirm={() => {
        if (deleteTarget) deleteCategory(deleteTarget._id)
        setDeleteTarget(null)
      }}
      onCancel={() => setDeleteTarget(null)}
    />
    </>
  )
}


