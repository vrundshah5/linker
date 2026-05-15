import { useState } from 'react'
import {
  Trash2,
  Pen,
  Code2,
  TrendingUp,
  Lightbulb,
  Archive,
} from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'

type Status = 'Active' | 'Hidden'

interface GlobalCategory {
  id: number
  name: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  status: Status
  users: string
  links: string
}

const INITIAL_CATEGORIES: GlobalCategory[] = [
  {
    id: 1,
    name: 'Design Inspiration',
    icon: Pen,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    status: 'Active',
    users: '24.2k',
    links: '142k',
  },
  {
    id: 2,
    name: 'Dev Tools',
    icon: Code2,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    status: 'Active',
    users: '18.5k',
    links: '89k',
  },
  {
    id: 3,
    name: 'Marketing',
    icon: TrendingUp,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    status: 'Active',
    users: '12.1k',
    links: '54k',
  },
  {
    id: 4,
    name: 'Project Ideas',
    icon: Lightbulb,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    status: 'Active',
    users: '8.4k',
    links: '22k',
  },
  {
    id: 5,
    name: 'Archived Resources',
    icon: Archive,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    status: 'Hidden',
    users: '2.1k',
    links: '8k',
  },
]

export default function AdminGlobalCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  function removeCategory(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeleteTarget(null)
  }

  const visible = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        <PageHeader
          title="Global Categories"
          subtitle="Manage default categories available to all new users."
          searchValue={search}
          onSearch={setSearch}
          actions={
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              + Add Global Category
            </button>
          }
        />

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">
              No categories match your search.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {visible.map((cat) => {
                const Icon = cat.icon
                return (
                  <div
                    key={cat.id}
                    className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/25 hover:shadow-sm transition-all"
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`size-12 rounded-xl ${cat.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`size-5 ${cat.iconColor}`} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cat.status === 'Active'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Users</p>
                        <p className="text-base font-bold text-foreground">{cat.users}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Links</p>
                        <p className="text-base font-bold text-foreground">{cat.links}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        className="flex-1 py-2 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-border transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat.id)}
                        className="size-10 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>

    <ConfirmModal
      open={deleteTarget !== null}
      title="Delete Category"
      description={`Are you sure you want to delete "${categories.find(c => c.id === deleteTarget)?.name ?? ''}"? This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={() => deleteTarget !== null && removeCategory(deleteTarget)}
      onCancel={() => setDeleteTarget(null)}
    />
    </>
  )
}
