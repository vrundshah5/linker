import { useState, useRef, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Folder, ImagePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AppLayout from '../components/layouts/AppLayout'
import { createCategory } from '../services/categoryService'

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .required('Category name is required'),
  description: yup.string().optional(),
})

type CategoryFormData = yup.InferType<typeof schema>

const PRESET_COLORS = ['#6c5dd3', '#3eac68', '#ff9b26', '#ff6a55']

export default function CreateCategory() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [themeColor, setThemeColor] = useState(PRESET_COLORS[0])
  const [customColor, setCustomColor] = useState('')
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({ resolver: yupResolver(schema) })

  function handleIconChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setIconPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function onSubmit(data: CategoryFormData) {
    setSubmitError(null)
    try {
      await createCategory({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        themeColor,
        icon: iconPreview ?? undefined,
      })
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
          >
            Create New Category
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize your links by creating a new category.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-56 focus-within:border-primary transition-colors">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
            />
          </div>

          {/* Bell */}
          <button
            type="button"
            className="size-10 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <Bell className="size-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-2xl">

            {/* Category Icon */}
            <div className="flex items-center gap-6 pb-7 border-b border-border mb-7">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="size-20 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-secondary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer overflow-hidden"
              >
                {iconPreview ? (
                  <img src={iconPreview} alt="Category icon" className="size-full object-cover" />
                ) : (
                  <ImagePlus className="size-7 text-primary" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
              />
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Category Icon</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload an icon or select from our library.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Choose Icon
                </button>
              </div>
            </div>

            {/* Category Name */}
            <div className="mb-6">
              <label htmlFor="category-name" className="block text-sm font-bold text-foreground mb-2">
                Category Name
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-input border rounded-xl text-sm transition-colors focus-within:border-primary ${
                  errors.name ? 'border-danger' : 'border-border'
                }`}
              >
                <Folder className="size-4 text-muted-foreground shrink-0" />
                <input
                  id="category-name"
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
            <div className="mb-7">
              <label htmlFor="category-description" className="block text-sm font-bold text-foreground mb-2">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <textarea
                id="category-description"
                placeholder="What kind of links will be stored here?"
                rows={4}
                {...register('description')}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary transition-colors"
              />
            </div>

            {/* Theme Color */}
            <div className="pb-7 border-b border-border mb-7">
              <p className="text-sm font-bold text-foreground mb-3">Theme Color</p>
              <div className="flex items-center gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setThemeColor(color)}
                    className="size-9 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {themeColor === color && (
                      <span className="flex items-center justify-center size-full">
                        <span className="size-2 rounded-full bg-primary-foreground" />
                      </span>
                    )}
                  </button>
                ))}

                {/* Custom color picker */}
                <label
                  className="size-9 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors text-muted-foreground text-lg font-bold"
                  aria-label="Pick a custom color"
                >
                  +
                  <input
                    type="color"
                    value={customColor || themeColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value)
                      setThemeColor(e.target.value)
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <p className="text-sm text-danger mb-5">{submitError}</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </AppLayout>
  )
}
