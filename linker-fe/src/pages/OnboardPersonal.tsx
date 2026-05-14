import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Link,
  Palette,
  Code2,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Coffee,
  DollarSign,
  Map,
  Check,
  ArrowRight,
} from 'lucide-react'

interface Category {
  id: string
  label: string
  icon: React.ReactNode
}

const CATEGORIES: Category[] = [
  { id: 'design', label: 'Design Inspiration', icon: <Palette className="size-6" /> },
  { id: 'devtools', label: 'Dev Tools', icon: <Code2 className="size-6" /> },
  { id: 'marketing', label: 'Marketing', icon: <TrendingUp className="size-6" /> },
  { id: 'ideas', label: 'Project Ideas', icon: <Lightbulb className="size-6" /> },
  { id: 'readlater', label: 'Read Later', icon: <BookOpen className="size-6" /> },
  { id: 'recipes', label: 'Recipes', icon: <Coffee className="size-6" /> },
  { id: 'finance', label: 'Finance', icon: <DollarSign className="size-6" /> },
  { id: 'travel', label: 'Travel Plans', icon: <Map className="size-6" /> },
]

export default function OnboardPersonal() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<string>>(
    new Set(['design', 'devtools', 'readlater']),
  )

  function toggleCategory(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleContinue() {
    // TODO: persist selected categories
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-20 px-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
          <Link className="size-5" />
        </div>
        <span
          className="font-bold text-2xl text-foreground"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          Linker
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-10 shadow-sm">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-muted rounded-full" />
        </div>

        <h1
          className="text-3xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          Select Global Categories
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          Pick some default categories to start organizing your personal links immediately.
        </p>

        {/* Category grid */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.has(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {/* Checkmark badge */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 size-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Check className="size-3" strokeWidth={3} />
                  </div>
                )}
                {cat.icon}
                <span
                  className={`text-xs font-bold text-center leading-tight ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/onboard')}
            className="px-4 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            Go to Dashboard
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
