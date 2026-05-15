import { type ReactNode } from 'react'
import { Search } from 'lucide-react'
import BellButton from './BellButton'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Extra controls rendered after the BellButton (e.g. action buttons) */
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
    <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center justify-between gap-4 shrink-0">
      {/* Left: title + subtitle */}
      <div className="min-w-0">
        <h1
          className="text-2xl font-bold text-foreground leading-tight truncate"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: search + bell + actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue ?? ''}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
          />
        </div>

        <BellButton />

        {actions}
      </div>
    </div>
  )
}
