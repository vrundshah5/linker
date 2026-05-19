import { useEffect, useRef } from 'react'
import { X, Briefcase, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  projectName: yup
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .required('Project name is required'),
  description: yup.string().optional(),
})

type ProjectFormData = yup.InferType<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description: string }) => void
  isPending: boolean
}

export default function CreateProjectModal({ open, onClose, onSubmit, isPending }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: { projectName: '', description: '' },
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) reset()
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

  function handleFormSubmit(data: ProjectFormData) {
    onSubmit({
      name: data.projectName,
      description: data.description?.trim() || '',
    })
  }

  if (!open) return null

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
          Create a New Project
        </h1>
        <p className="text-base text-muted-foreground mb-10">
          Add the basic details for your new project to get started.
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-8">
          {/* Project Details */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Project Details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="modal-projectName"
                  className="text-sm font-bold text-foreground"
                >
                  Project Name
                </label>
                <input
                  id="modal-projectName"
                  type="text"
                  placeholder="e.g. Acme Corp Redesign"
                  {...register('projectName')}
                  className={`w-full bg-input border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors ${
                    errors.projectName ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.projectName && (
                  <p className="text-xs text-danger font-medium">{errors.projectName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="modal-description"
                  className="text-sm font-bold text-foreground"
                >
                  Description <span className="font-medium text-muted-foreground">(Optional)</span>
                </label>
                <textarea
                  id="modal-description"
                  rows={3}
                  placeholder="Briefly describe what this project is about..."
                  {...register('description')}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
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
              disabled={isPending}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin shrink-0" />
              )}
              {isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
