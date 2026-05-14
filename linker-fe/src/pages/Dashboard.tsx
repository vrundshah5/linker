import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  MoreHorizontal,
  Link2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  Folder,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import BellButton from '../components/ui/BellButton'

interface Category {
  id: number
  name: string
  links: number
  iconBg: string
  iconColor: string
  btnBg: string
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Design Inspiration',
    links: 42,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    btnBg: 'bg-primary',
  },
  {
    id: 2,
    name: 'Dev Tools',
    links: 18,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    btnBg: 'bg-success',
  },
  {
    id: 3,
    name: 'Marketing',
    links: 8,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    btnBg: 'bg-warning',
  },
  {
    id: 4,
    name: 'Project Ideas',
    links: 12,
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
    btnBg: 'bg-danger',
  },
  {
    id: 5,
    name: 'Read Later',
    links: 56,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    btnBg: 'bg-primary',
  },
  {
    id: 6,
    name: 'Recipes',
    links: 24,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    btnBg: 'bg-success',
  },
]

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-foreground"
            >
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your categories and links.
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
            <BellButton />

            {/* New Category */}
            <button
              onClick={() => navigate('/categories/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="size-4" />
              New Category
            </button>
          </div>
        </div>

        {/* Pro banner */}
        <div className="relative bg-primary rounded-2xl p-8 mb-8 overflow-hidden">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning/20 text-warning rounded-full text-xs font-bold mb-4">
            <Sparkles className="size-3" />
            PRO FEATURE
          </div>

          <h2
            className="text-2xl font-bold text-primary-foreground mb-2 max-w-xs leading-tight"
          >
            Organize your digital life with Linker Pro
          </h2>
          <p
            className="text-sm mb-6 max-w-sm leading-relaxed"
            style={{
              color: 'color-mix(in oklab, var(--color-primary-foreground) 70%, transparent)',
            }}
          >
            Unlock unlimited categories, custom themes, and advanced link
            analytics to supercharge your productivity.
          </p>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface text-primary font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer">
            Upgrade Now
            <ArrowRight className="size-4" />
          </button>

          {/* Decorative icon */}
          <Sparkles
            className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none"
            style={{ width: 160, height: 160 }}
          />
        </div>

        {/* Categories header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-bold text-foreground"
          >
            Your Categories
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {/* Category cards */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`)}
              className={`bg-surface border border-border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer ${
                viewMode === 'list' ? 'flex items-center gap-4' : ''
              }`}
            >
              <div
                className={`flex items-start justify-between ${
                  viewMode === 'list' ? 'mb-0 shrink-0' : 'mb-4'
                }`}
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${cat.iconBg} ${cat.iconColor}`}
                >
                  <Folder className="size-5" />
                </div>
                {viewMode === 'grid' && (
                  <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
                    <MoreHorizontal className="size-4" />
                  </button>
                )}
              </div>

              <div className={viewMode === 'list' ? 'flex flex-1 items-center justify-between' : ''}>
                <h3
                  className={`font-bold text-foreground ${
                    viewMode === 'list' ? 'text-sm' : 'text-base mb-4'
                  }`}
                >
                  {cat.name}
                </h3>

                <div
                  className={`flex items-center ${
                    viewMode === 'list' ? 'gap-6' : 'justify-between'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Link2 className="size-4" />
                    <span>{cat.links} Links</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`); }}
                    className={`px-4 py-1.5 text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 transition-opacity cursor-pointer ${cat.btnBg}`}
                  >
                    View
                  </button>
                </div>
              </div>

              {viewMode === 'list' && (
                <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 shrink-0">
                  <MoreHorizontal className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </AppLayout>
  )
}
