import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Link2,
  LayoutGrid,
  List,
  Loader2,
  FolderOpen,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import PageHeader from '../components/ui/PageHeader'
import CreateCategoryModal from '../components/ui/CreateCategoryModal'
import CategoryCardMenu from '../components/ui/CategoryCardMenu'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { getCategoryIcon } from '../lib/categoryIcons'

export default function Categories() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const { data: categories, isLoading } = useMyCategories()

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Categories"
            subtitle="Organise your links into categories."
            actions={
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="size-4" />
                New Category
              </button>
            }
          />

            {/* Header row with view toggle */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                All Categories
                {categories && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({categories.length})
                  </span>
                )}
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

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Empty state */}
            {!isLoading && (!categories || categories.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <FolderOpen className="size-8 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No categories yet</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                  Create your first category to start organising your links.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="size-4" />
                  Create Category
                </button>
              </div>
            )}

            {/* Category cards */}
            {!isLoading && categories && categories.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-3 gap-4'
                    : 'flex flex-col gap-3'
                }
              >
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.icon)
                  return (
                    <div
                      key={cat._id}
                      onClick={() => navigate(`/categories/${cat._id}`)}
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
                          className="size-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${cat.themeColor}20`, color: cat.themeColor }}
                        >
                          <Icon className="size-5" />
                        </div>
                        {viewMode === 'grid' && (
                          <CategoryCardMenu category={cat} />
                        )}
                      </div>

                      <div className={viewMode === 'list' ? 'flex flex-1 items-center justify-between' : ''}>
                        <div className={viewMode === 'list' ? '' : 'mb-4'}>
                          <h3
                            className={`font-bold text-foreground ${
                              viewMode === 'list' ? 'text-sm' : 'text-base'
                            }`}
                          >
                            {cat.name}
                          </h3>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                            {cat.isGlobal ? 'Global' : 'User'}
                          </span>
                        </div>

                        <div
                          className={`flex items-center ${
                            viewMode === 'list' ? 'gap-6' : 'justify-between'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Link2 className="size-4" />
                            <span>{cat.linkCount} Links</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/categories/${cat._id}`)
                            }}
                            className="px-4 py-1.5 text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                            style={{ backgroundColor: cat.themeColor }}
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <CategoryCardMenu category={cat} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      </div>

      <CreateCategoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppLayout>
  )
}
