import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Folder,
  Link2,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { getCategoryIcon } from '../lib/categoryIcons'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: categories, isLoading } = useMyCategories()

  const totalLinks = categories?.reduce((sum, c) => sum + c.linkCount, 0) ?? 0

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back — here's an overview of your workspace."
        />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">

            {/* Pro banner */}
            <div className="relative bg-primary rounded-2xl p-8 overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning/20 text-warning rounded-full text-xs font-bold mb-4">
                <Sparkles className="size-3" />
                PRO FEATURE
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2 max-w-xs leading-tight">
                Organize your digital life with Linker Pro
              </h2>
              <p
                className="text-sm mb-6 max-w-sm leading-relaxed"
                style={{ color: 'color-mix(in oklab, var(--color-primary-foreground) 70%, transparent)' }}
              >
                Unlock unlimited categories, custom themes, and advanced link analytics.
              </p>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-surface text-primary font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                Upgrade Now
                <ArrowRight className="size-4" />
              </button>
              <Sparkles
                className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none"
                style={{ width: 160, height: 160 }}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Folder className="size-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{categories?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Total Categories</p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <Link2 className="size-5 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">{totalLinks}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Total Links</p>
              </div>
            </div>

            {/* Recent categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">Recent Categories</h2>
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  View all <ChevronRight className="size-3.5" />
                </button>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {!isLoading && categories && categories.length > 0 && (
                <div className="flex flex-col gap-2">
                  {categories.slice(0, 5).map((cat) => {
                    const Icon = getCategoryIcon(cat.icon)
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => navigate(`/categories/${cat._id}`)}
                        className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary/25 hover:shadow-sm transition-all cursor-pointer w-full text-left"
                      >
                        <div
                          className="size-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.themeColor}20`, color: cat.themeColor }}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.linkCount} links</p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                      </button>
                    )
                  })}
                </div>
              )}

              {!isLoading && (!categories || categories.length === 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-muted-foreground mb-3">No categories yet.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/categories')}
                    className="text-sm font-bold text-primary hover:underline cursor-pointer"
                  >
                    Go to Categories →
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  )
}
