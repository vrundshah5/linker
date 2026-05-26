import { useEffect, useRef, useState } from 'react'
import { X, Folder } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateCategory } from '../../hooks/categories/useCreateCategory'

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'At least 2 characters')
    .required('Category name is required'),
  description: yup.string().optional(),
})

type FormData = yup.InferType<typeof schema>

const PRESET_COLORS = [
  { value: '#6c5dd3', label: 'Purple' },
  { value: '#3eac68', label: 'Green' },
  { value: '#ff9b26', label: 'Orange' },
  { value: '#ff6a55', label: 'Red' },
]

interface Props {
  open: boolean
  onClose: () => void
  context?: 'personal' | 'professional'
}

export default function CreateCategoryModal({ open, onClose, context = 'personal' }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [themeColor, setThemeColor] = useState(PRESET_COLORS[0].value)

  const { mutateAsync: createCategory, isPending } = useCreateCategory()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset()
      setThemeColor(PRESET_COLORS[0].value)
    }
  }, [open, reset])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function onSubmit(data: FormData) {
    await createCategory({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      themeColor,
      icon: 'Folder',
      context,
    })
    onClose()
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Panel */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${themeColor}20` }}
            >
              <Folder className="size-5" style={{ color: themeColor }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">New Category</h2>
              <p className="text-xs text-muted-foreground">Organise your links</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="modal-cat-name" className="block text-sm font-bold text-foreground mb-1.5">
              Category Name
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-2.5 bg-input border rounded-xl text-sm transition-colors focus-within:border-primary ${
                errors.name ? 'border-danger' : 'border-border'
              }`}
            >
              <Folder className="size-4 text-muted-foreground shrink-0" />
              <input
                id="modal-cat-name"
                type="text"
                placeholder="e.g. Design Inspiration"
                {...register('name')}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-danger font-medium mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="modal-cat-desc" className="block text-sm font-bold text-foreground mb-1.5">
              Description{' '}
              <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              id="modal-cat-desc"
              placeholder="What kind of links will go here?"
              rows={2}
              {...register('description')}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary transition-colors"
            />
          </div>

          {/* Theme Color */}
          <div>
            <p className="text-sm font-bold text-foreground mb-3">Theme Color</p>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setThemeColor(color.value)}
                  title={color.label}
                  className="relative size-9 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none shrink-0"
                  style={{ backgroundColor: color.value }}
                >
                  {themeColor === color.value && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="size-2.5 rounded-full bg-white/90" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Color preview strip */}
            <div
              className="mt-3 h-1.5 rounded-full transition-colors duration-200"
              style={{ backgroundColor: themeColor }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending && (
                <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isPending ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
