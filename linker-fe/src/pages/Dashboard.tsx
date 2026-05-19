import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  Sparkle,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Heart,
  Layout,
  ArrowUpRight,
  ArrowLeftRight,
  Loader2,
  PenTool,
  Code,
  TrendingUp,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import WorkspaceSwitchSplash from '../components/ui/WorkspaceSwitchSplash'
import BellButton from '../components/ui/BellButton'
import { useMyCategories } from '../hooks/categories/useMyCategories'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useSwitchWorkspace } from '../hooks/useProfile'
import { getCategoryIcon } from '../lib/categoryIcons'

/* ── colour helpers for category cards ─────────────────────── */
const CARD_THEMES = [
  { bg: 'bg-primary/10', text: 'text-primary', FallbackIcon: PenTool },
  { bg: 'bg-danger/10', text: 'text-danger', FallbackIcon: Code },
  { bg: 'bg-success/10', text: 'text-success', FallbackIcon: TrendingUp },
]

/* ── placeholder recent-link cards (static for now) ────────── */
const RECENT_CARDS = [
  {
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=340&fit=crop',
    tag: 'Front End',
    tagColor: 'bg-primary/10 text-primary',
    title: "Beginner's Guide to Becoming a Professional Front-End Developer",
    author: 'Leonardo Samsul',
    role: 'Mentor',
    avatar: 'https://i.pravatar.cc/80?img=11',
  },
  {
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=340&fit=crop',
    tag: 'UI/UX Design',
    tagColor: 'bg-warning/10 text-warning',
    title: 'Optimizing User Experience with the Best UI/UX Design',
    author: 'Bayu Salto',
    role: 'Mentor',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=340&fit=crop',
    tag: 'Branding',
    tagColor: 'bg-danger/10 text-danger',
    title: 'Reviving and Refreshing Company Image',
    author: 'Padhang Satrio',
    role: 'Mentor',
    avatar: 'https://i.pravatar.cc/80?img=13',
  },
]

const LESSON_ROWS = [
  { name: 'Padhang Satrio', date: '2/16/2024', type: 'UI/UX Design', desc: 'Understand Of UI/UX Design', avatar: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Bayu Salto', date: '2/14/2024', type: 'Front End', desc: 'Advanced React Patterns', avatar: 'https://i.pravatar.cc/80?img=12' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: categories, isLoading } = useMyCategories()
  const user = useCurrentUser()
  const { mutate: switchWorkspace, isPending: isSwitching, switchTarget } = useSwitchWorkspace()
  const hasMultipleWorkspaces = user.workspaces.length > 1

  const topCategories = categories?.slice(0, 3) ?? []

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto h-full">

        {/* Top bar: search + switch + bell + user */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 bg-surface border border-border rounded-2xl flex items-center px-4 py-3 shadow-sm">
            <Search className="size-5 text-muted-foreground mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search your links..."
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {hasMultipleWorkspaces && (
              <button
                type="button"
                onClick={() => switchWorkspace('professional')}
                className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Switch workspace"
              >
                <ArrowLeftRight className="size-[18px]" />
              </button>
            )}
            <BellButton context="personal" />
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                <span className="text-xs font-bold text-primary">{user.initials}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{user.name}</span>
            </div>
          </div>
        </div>

          {/* Hero banner */}
          <div className="bg-primary rounded-3xl p-10 mb-8 relative overflow-hidden shadow-lg flex items-center shrink-0">
            <div className="relative z-10 w-2/3">
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3 block">
                LINK MANAGEMENT
              </span>
              <h2
                className="text-4xl font-bold text-white mb-6 leading-tight max-w-lg"
                style={{ fontFamily: 'var(--font-headings)' }}
              >
                Sharpen Your Workflow with Smart Link Organization
              </h2>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-foreground/90 transition-colors cursor-pointer"
              >
                Get Started
                <span className="size-5 bg-background text-foreground rounded-full flex items-center justify-center">
                  <ChevronRight className="size-3" />
                </span>
              </button>
            </div>
            <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" style={{ width: 160, height: 160 }} />
            <Sparkle className="absolute right-1/3 top-10 text-white/20 pointer-events-none" style={{ width: 60, height: 60 }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Category quick-cards */}
          <div className="flex items-center gap-4 mb-8">
            {isLoading && (
              <div className="flex-1 flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && topCategories.map((cat, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length]
              const Icon = getCategoryIcon(cat.icon)
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => navigate(`/categories/${cat._id}`)}
                  className="flex-1 bg-surface rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-transparent hover:border-primary/20 transition-colors cursor-pointer group text-left"
                >
                  <div className={`size-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">{cat.linkCount} links</p>
                    <p className="text-sm font-bold text-foreground">{cat.name}</p>
                  </div>
                  <MoreVertical className="size-4 text-muted-foreground ml-auto" />
                </button>
              )
            })}
            {!isLoading && topCategories.length === 0 && (
              <div className="flex-1 text-center py-6">
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              </div>
            )}
          </div>

          {/* Continue Watching / Recent Links */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Continue Watching
              </h3>
              <div className="flex gap-2">
                <button type="button" className="size-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" className="size-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 cursor-pointer">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {RECENT_CARDS.map((card, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-3xl p-3 shadow-sm border border-transparent hover:border-primary/20 transition-colors cursor-pointer group"
                >
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-muted">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-3 size-8 bg-black/30 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
                    >
                      <Heart className="size-3.5" />
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${card.tagColor}`}>
                      <Layout className="size-3" />
                      {card.tag}
                    </span>
                    <h4 className="font-bold text-foreground text-sm leading-snug mb-4 line-clamp-2 h-10">
                      {card.title}
                    </h4>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <img src={card.avatar} alt={card.author} className="size-8 rounded-full" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{card.author}</span>
                        <span className="text-[10px] text-muted-foreground">{card.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Lesson table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
                Your Lesson
              </h3>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="text-primary text-sm font-bold hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>
            <div className="bg-surface rounded-3xl shadow-sm border border-transparent overflow-hidden">
              {/* Table header */}
              <div className="flex items-center px-6 py-4 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <div className="flex-[2]">Mentor</div>
                <div className="flex-[1.5]">Type</div>
                <div className="flex-[3]">Desc</div>
                <div className="flex-[1] text-right">Action</div>
              </div>
              {/* Table rows */}
              <div className="flex flex-col p-2">
                {LESSON_ROWS.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center px-4 py-3 hover:bg-muted/30 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div className="flex-[2] flex items-center gap-3">
                      <img src={row.avatar} alt={row.name} className="size-10 rounded-full" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{row.name}</span>
                        <span className="text-xs text-muted-foreground">{row.date}</span>
                      </div>
                    </div>
                    <div className="flex-[1.5]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        <Layout className="size-3" />
                        {row.type}
                      </span>
                    </div>
                    <div className="flex-[3]">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {row.desc}
                      </span>
                    </div>
                    <div className="flex-[1] flex justify-end">
                      <span className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
      {isSwitching && switchTarget && <WorkspaceSwitchSplash targetWorkspace={switchTarget} />}
    </AppLayout>
  )
}
