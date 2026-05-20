import { type ReactNode } from 'react'
import { Search } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Extra controls rendered on the right (e.g. action buttons) */
  actions?: ReactNode
  searchValue?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  searchValue,
  onSearch,
  searchPlaceholder = 'Search...',
}: PageHeaderProps) {
  return (
    <div className="bg-surface rounded-2xl px-6 py-4 mb-6 shadow-sm flex items-center justify-between gap-4 shrink-0">
      {/* Left: title + subtitle */}
      <div className="min-w-0">
        <h1
          className="text-2xl font-bold text-foreground leading-tight truncate"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3 shrink-0">
        {(onSearch !== undefined || searchValue !== undefined) && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
            />
          </div>
        )}

        {actions}
      </div>
    </div>
  )
}
