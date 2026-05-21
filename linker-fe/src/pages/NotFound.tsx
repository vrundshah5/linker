import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        {/* Icon */}
        <div className="size-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>

        {/* Error code */}
        <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
          Error 404
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Double-check the URL or go back to where you came from.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-sm font-semibold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
