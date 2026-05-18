import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Link,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useCompletePersonalOnboard } from '../hooks/onboard/useCompletePersonalOnboard'
import OnboardSplash from '../components/ui/OnboardSplash'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useGlobalCategories } from '../hooks/categories/useGlobalCategories'
import { getCategoryIcon } from '../lib/categoryIcons'

export default function OnboardPersonal() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const { data: globalCategories, isLoading: loadingCategories } = useGlobalCategories()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showSplash, setShowSplash] = useState(false)
  const { mutateAsync: completeOnboard, isPending } = useCompletePersonalOnboard()

  function toggleCategory(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleContinue() {
    await completeOnboard(Array.from(selected))
    setShowSplash(true)
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-20 px-6">
      {showSplash && (
        <OnboardSplash
          userName={user.name}
          workspaceType="personal"
          onDone={() => navigate('/dashboard')}
        />
      )}
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
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Select Global Categories
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          Pick some default categories to start organizing your personal links immediately.
        </p>

        {/* Loading */}
        {loadingCategories && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Category grid */}
        {!loadingCategories && globalCategories && globalCategories.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-10">
            {globalCategories.map((cat) => {
              const isSelected = selected.has(cat._id)
              const Icon = getCategoryIcon(cat.icon)
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => toggleCategory(cat._id)}
                  className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-secondary text-primary'
                      : 'border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 size-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                  )}
                  <Icon className="size-6" />
                  <span
                    className={`text-xs font-bold text-center leading-tight ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {!loadingCategories && (!globalCategories || globalCategories.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 mb-6 text-center">
            <p className="text-sm text-muted-foreground">No categories available yet. You can create your own after signing in.</p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/onboard')}
            className="px-4 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isPending}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && (
              <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {isPending ? 'Saving...' : 'Go to Dashboard'}
            {!isPending && <ArrowRight className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
