import { useState } from 'react'
import { Search, Globe } from 'lucide-react'
import ProjectLayout from '../components/layouts/ProjectLayout'
import BellButton from '../components/ui/BellButton'

interface Resource {
  id: number
  title: string
  url: string
  tags: string[]
  date: string
}

const RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Acme Corp Brand Guidelines v2.1',
    url: 'https://brandfolder.com/acme',
    tags: ['Design', 'Official'],
    date: 'Oct 12, 2023',
  },
  {
    id: 2,
    title: 'Figma - Core Component Library',
    url: 'https://figma.com/file/components',
    tags: ['Design'],
    date: 'Oct 15, 2023',
  },
  {
    id: 3,
    title: 'Competitor Analysis Q4',
    url: 'https://docs.google.com/presentation',
    tags: ['Research'],
    date: 'Oct 18, 2023',
  },
  {
    id: 4,
    title: 'Frontend Repository (GitHub)',
    url: 'https://github.com/acme/redesign-web',
    tags: ['Development'],
    date: 'Oct 20, 2023',
  },
]

const CATEGORY_FILTERS = ['All', 'Design', 'Development']

const TAG_STYLES: Record<string, string> = {
  Design: 'bg-secondary text-primary',
  Official: 'bg-secondary text-primary',
  Research: 'bg-secondary text-primary',
  Development: 'bg-secondary text-primary',
}

export default function ProjectResources() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [topSearch, setTopSearch] = useState('')
  const [inlineSearch, setInlineSearch] = useState('')

  const visibleResources = RESOURCES.filter((r) => {
    const matchesFilter =
      activeFilter === 'All' || r.tags.includes(activeFilter)
    const matchesTop =
      topSearch.trim() === '' ||
      r.title.toLowerCase().includes(topSearch.toLowerCase()) ||
      r.url.toLowerCase().includes(topSearch.toLowerCase())
    const matchesInline =
      inlineSearch.trim() === '' ||
      r.title.toLowerCase().includes(inlineSearch.toLowerCase()) ||
      r.url.toLowerCase().includes(inlineSearch.toLowerCase())
    return matchesFilter && matchesTop && matchesInline
  })

  return (
    <ProjectLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Project Resources
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              All saved links and documents for Acme Corp Redesign.
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>

            <BellButton />

            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              + Add Resource
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Filter bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-2">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-foreground border-border hover:border-primary/40 hover:bg-secondary/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Inline search */}
            <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search resources..."
                value={inlineSearch}
                onChange={(e) => setInlineSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>
          </div>

          {/* Resource rows */}
          <div className="flex flex-col gap-3">
            {visibleResources.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No resources found.
              </p>
            ) : (
              visibleResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-5 px-6 py-5 bg-surface border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Globe icon */}
                  <div className="size-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Globe className="size-5 text-muted-foreground" />
                  </div>

                  {/* Title + URL */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground leading-snug mb-0.5 truncate">
                      {resource.title}
                    </p>
                    <p className="text-xs text-primary truncate">{resource.url}</p>
                  </div>

                  {/* Tag badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${TAG_STYLES[tag] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-sm text-muted-foreground shrink-0 ml-2">
                    {resource.date}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}
