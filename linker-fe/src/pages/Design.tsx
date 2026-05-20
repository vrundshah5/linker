import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wand2,
  Undo2,
  Redo2,
  Palette,
  UserRound,
  Image,
  Type,
  RectangleHorizontal,
  Droplets,
  Star,
  Check,
  MoreHorizontal,
  Link,
  Zap,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { linkService } from '../services/linkService'
import { queryKeys } from '../constants/queryKeys'
import {
  useDesignStore,
  THEMES,
  getButtonStyles,
  FONT_MAP,
  type ButtonShape,
  type ButtonFill,
  type FontId,
  type HeaderLayout,
} from '../store/designStore'

// ─── Types ────────────────────────────────────────────────────────────────────
type SectionId = 'theme' | 'header' | 'wallpaper' | 'text' | 'buttons' | 'colors' | 'footer'

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: 'theme',    label: 'Theme',    icon: Palette },
  { id: 'header',   label: 'Header',   icon: UserRound },
  { id: 'wallpaper',label: 'Wallpaper',icon: Image },
  { id: 'text',     label: 'Text',     icon: Type },
  { id: 'buttons',  label: 'Buttons',  icon: RectangleHorizontal },
  { id: 'colors',   label: 'Colors',   icon: Droplets },
  { id: 'footer',   label: 'Footer',   icon: Star },
]

const BUTTON_SHAPES: { id: ButtonShape; label: string; radius: string }[] = [
  { id: 'rounded', label: 'Rounded', radius: '10px' },
  { id: 'pill',    label: 'Pill',    radius: '999px' },
  { id: 'square',  label: 'Square',  radius: '5px' },
  { id: 'sharp',   label: 'Sharp',   radius: '0' },
]

const BUTTON_FILLS: { id: ButtonFill; label: string }[] = [
  { id: 'solid',   label: 'Fill' },
  { id: 'outline', label: 'Outline' },
  { id: 'soft',    label: 'Soft' },
  { id: 'glass',   label: 'Glass' },
]

const FONTS: { id: FontId; label: string; sample: string }[] = [
  { id: 'system',  label: 'System',  sample: 'Aa' },
  { id: 'serif',   label: 'Serif',   sample: 'Aa' },
  { id: 'mono',    label: 'Mono',    sample: 'Aa' },
  { id: 'display', label: 'Display', sample: 'Aa' },
]

const HEADER_LAYOUTS: { id: HeaderLayout; label: string; premium?: boolean }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'hero',    label: 'Hero' },
]

const ACCENT_COLORS = [
  '#6c5dd3', '#0ea5e9', '#f97316', '#16a34a',
  '#f43f5e', '#8b5cf6', '#eab308', '#06b6d4',
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`
  } catch { return null }
}

// ─── Mini theme card preview ──────────────────────────────────────────────────
function ThemeCard({ theme, active, onClick }: {
  theme: typeof THEMES[0]
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl cursor-pointer transition-all overflow-hidden border-2 ${
        active ? 'border-foreground shadow-lg' : 'border-transparent hover:border-border'
      }`}
    >
      {active && (
        <div className="absolute top-2 right-2 z-10 size-5 bg-foreground rounded-full flex items-center justify-center">
          <Check className="size-3 text-white" />
        </div>
      )}
      <div className="rounded-xl overflow-hidden" style={{ background: theme.screenBg }}>
        <div className="flex flex-col items-center gap-2 px-4 pt-5 pb-4">
          <div className="size-8 rounded-full" style={{ backgroundColor: theme.avatarBg }} />
          <div className="h-1.5 w-14 rounded-full opacity-60" style={{ backgroundColor: theme.text }} />
          <div className="w-full flex flex-col gap-1.5 mt-1">
            {[0, 1].map((i) => (
              <div key={i} className="h-6 w-full rounded-lg" style={{ backgroundColor: theme.cardBg }} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs font-medium text-foreground text-center py-2 px-2">{theme.label}</p>
    </button>
  )
}

// ─── Phone preview (live) ─────────────────────────────────────────────────────
function PhonePreview() {
  const user = useCurrentUser()
  const { themeId, buttonShape, buttonFill, headerLayout, fontId, showFooter } = useDesignStore()
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]
  const font = FONT_MAP[fontId]
  const handle = user.name.toLowerCase().replace(/\s+/g, '')

  const { data } = useQuery({
    queryKey: queryKeys.links.favorites(),
    queryFn: () => linkService.getFavoriteLinks(),
    enabled: !!user.id,
  })
  const links = data ?? []

  const btnStyles = getButtonStyles(theme, buttonShape, buttonFill)

  return (
    <div
      className="w-[270px] h-[560px] rounded-[44px] p-[9px] shadow-2xl border-4 border-white/20 ring-1 ring-black/20 relative overflow-hidden transition-all duration-500"
      style={{ backgroundColor: theme.shell }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 rounded-b-2xl z-20"
        style={{ backgroundColor: theme.shell }} />
      {/* Screen */}
      <div
        className="w-full h-full rounded-[36px] overflow-hidden flex flex-col items-center pb-5 px-3.5 relative transition-all duration-500"
        style={{ background: theme.screenBg, fontFamily: font }}
      >
        {/* More */}
        <div className="absolute top-4 right-4 size-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.moreBg, color: theme.moreIcon }}>
          <MoreHorizontal className="size-3.5" />
        </div>

        {/* Header section */}
        {headerLayout === 'hero' ? (
          <div className="w-full relative mb-3">
            {/* Hero banner */}
            <div className="w-full h-20 rounded-t-[36px]" style={{ background: 'rgba(255,255,255,0.12)' }} />
            {/* Avatar overlapping banner */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 size-14 rounded-full border-2 border-white/30 flex items-center justify-center"
              style={{ backgroundColor: theme.avatarBg }}>
              <span className="text-sm font-bold" style={{ color: theme.avatarText }}>{getInitials(user.name)}</span>
            </div>
            {/* spacer */}
            <div className="h-7" />
          </div>
        ) : (
          /* Classic */
          <div className="flex flex-col items-center pt-10 mb-2">
            <div className="size-16 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: theme.avatarBg }}>
              <span className="text-sm font-bold" style={{ color: theme.avatarText }}>{getInitials(user.name)}</span>
            </div>
          </div>
        )}

        <h3 className="font-bold text-sm mb-4 transition-all duration-300" style={{ color: theme.text }}>
          @{handle}
        </h3>

        {/* Links */}
        <div className="w-full flex flex-col gap-2">
          {links.length === 0 ? (
            <div className="w-full py-2.5 px-3 text-xs text-center" style={{ ...btnStyles, color: theme.emptyText }}>
              Your links will appear here
            </div>
          ) : (
            links.slice(0, 4).map((link) => {
              const favicon = getFaviconUrl(link.url)
              return (
                <div key={link._id} className="w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300"
                  style={btnStyles}>
                  {favicon && <img src={favicon} className="size-3 shrink-0" alt="" />}
                  <span className="truncate">{link.title}</span>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="mt-auto pt-4 flex flex-col items-center gap-2">
            <button className="px-5 py-1.5 rounded-full font-bold text-[10px] shadow-sm transition-all duration-300"
              style={{ backgroundColor: theme.footerBtnBg, color: theme.footerBtnText }}>
              Join {user.name.split(' ')[0]} on Linker
            </button>
            <div className="text-[9px] text-center leading-tight" style={{ color: theme.subText }}>
              Report • Privacy<br />More from Linker
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section panels ───────────────────────────────────────────────────────────
function ThemePanel() {
  const { themeId, setThemeId } = useDesignStore()
  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Theme</h2>
      <p className="text-sm text-muted-foreground mb-8">Choose a theme to apply to your public collection.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {THEMES.map((t) => (
          <ThemeCard key={t.id} theme={t} active={themeId === t.id} onClick={() => setThemeId(t.id)} />
        ))}
      </div>
    </div>
  )
}

function HeaderPanel() {
  const { headerLayout, setHeaderLayout } = useDesignStore()
  const user = useCurrentUser()

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Header</h2>
      <p className="text-sm text-muted-foreground mb-8">Choose how your profile header looks.</p>

      <h3 className="text-sm font-semibold text-foreground mb-3">Layout</h3>
      <div className="flex gap-3 mb-8">
        {HEADER_LAYOUTS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setHeaderLayout(id)}
            className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all cursor-pointer ${
              headerLayout === id
                ? 'border-foreground bg-muted'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            {label}
          </button>
        ))}
        {/* Premium locked placeholders */}
        {(['Banner', 'Cutout', 'Shape'] as const).map((lbl) => (
          <button
            key={lbl}
            disabled
            className="flex-1 py-4 rounded-2xl border-2 border-border text-sm font-bold text-muted-foreground/40 relative cursor-not-allowed overflow-hidden"
          >
            <Zap className="absolute top-1.5 right-1.5 size-3.5 text-amber-400" />
            {lbl}
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Profile image</h3>
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <UserRound className="size-7" />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer">
          + Add
        </button>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Title</h3>
      <input
        defaultValue={`@${user.name.toLowerCase().replace(/\s+/g, '')}`}
        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-foreground/40 transition-colors mb-6 bg-surface"
      />

      <h3 className="text-sm font-semibold text-foreground mb-3">Bio</h3>
      <textarea
        rows={3}
        placeholder="Tell your audience about yourself..."
        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-foreground/40 transition-colors resize-none bg-surface"
      />
    </div>
  )
}

function WallpaperPanel() {
  const { themeId, setThemeId } = useDesignStore()

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Wallpaper</h2>
      <p className="text-sm text-muted-foreground mb-8">Pick a background for your profile screen.</p>

      <div className="grid grid-cols-4 gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setThemeId(t.id)}
            className={`aspect-square rounded-2xl cursor-pointer border-2 transition-all overflow-hidden ${
              themeId === t.id ? 'border-foreground scale-105' : 'border-transparent hover:scale-105'
            }`}
            style={{ background: t.screenBg }}
            title={t.label}
          >
            {themeId === t.id && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="size-5 bg-white/30 rounded-full flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function TextPanel() {
  const { fontId, setFontId } = useDesignStore()
  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Text</h2>
      <p className="text-sm text-muted-foreground mb-8">Choose the font for your public collection.</p>

      <div className="grid grid-cols-2 gap-4">
        {FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFontId(f.id)}
            className={`rounded-2xl border-2 p-5 flex flex-col items-center gap-2 cursor-pointer transition-all ${
              fontId === f.id
                ? 'border-foreground bg-muted'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            <span className="text-4xl font-medium text-foreground" style={{ fontFamily: FONT_MAP[f.id] }}>
              {f.sample}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">{f.label}</span>
            {fontId === f.id && (
              <div className="size-5 bg-foreground rounded-full flex items-center justify-center">
                <Check className="size-3 text-background" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function ButtonsPanel() {
  const { themeId, buttonShape, buttonFill, setButtonShape, setButtonFill } = useDesignStore()
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Buttons</h2>
      <p className="text-sm text-muted-foreground mb-8">Style the link buttons on your collection.</p>

      <h3 className="text-sm font-semibold text-foreground mb-4">Shape</h3>
      <div className="grid grid-cols-4 gap-3 mb-10">
        {BUTTON_SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setButtonShape(s.id)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              buttonShape === s.id ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/40'
            }`}
          >
            <div
              className="w-full h-8 bg-foreground"
              style={{ borderRadius: s.radius }}
            />
            <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-4">Fill</h3>
      <div className="grid grid-cols-4 gap-3">
        {BUTTON_FILLS.map((f) => {
          const previewStyles = getButtonStyles(theme, buttonShape, f.id)
          return (
            <button
              key={f.id}
              onClick={() => setButtonFill(f.id)}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                buttonFill === f.id ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/40'
              }`}
            >
              <div className="w-full overflow-hidden rounded-lg" style={{ background: theme.screenBg, padding: '8px' }}>
                <div className="h-7 w-full flex items-center justify-center" style={previewStyles}>
                  <Link className="size-3" style={{ color: previewStyles.color }} />
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{f.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ColorsPanel() {
  const { themeId, setThemeId } = useDesignStore()

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Colors</h2>
      <p className="text-sm text-muted-foreground mb-8">Pick an accent color for your profile.</p>

      <h3 className="text-sm font-semibold text-foreground mb-4">Preset palettes</h3>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setThemeId(t.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
              themeId === t.id ? 'border-foreground' : 'border-border hover:border-foreground/30'
            }`}
          >
            <div className="flex gap-1.5">
              <div className="size-5 rounded-full" style={{ background: t.screenBg }} />
              <div className="size-5 rounded-full" style={{ backgroundColor: t.cardBg }} />
              <div className="size-5 rounded-full" style={{ backgroundColor: t.footerBtnBg }} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">{t.label}</span>
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-4">Accent swatches</h3>
      <div className="flex gap-3 flex-wrap">
        {ACCENT_COLORS.map((color) => (
          <button
            key={color}
            className="size-9 rounded-full cursor-pointer hover:scale-110 transition-transform border-2 border-white shadow"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

function FooterPanel() {
  const { showFooter, setShowFooter } = useDesignStore()
  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold text-foreground mb-2">Footer</h2>
      <p className="text-sm text-muted-foreground mb-8">Control what appears at the bottom of your collection.</p>

      <div className="flex items-center justify-between p-5 border border-border rounded-2xl bg-surface">
        <div>
          <p className="text-sm font-semibold text-foreground">Show Linker footer</p>
          <p className="text-xs text-muted-foreground mt-0.5">Displays a "Join on Linker" call-to-action</p>
        </div>
        <button
          onClick={() => setShowFooter(!showFooter)}
          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
            showFooter ? 'bg-green-500' : 'bg-gray-200'
          }`}
        >
          <div
            className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform duration-200 ${
              showFooter ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Design() {
  const [activeSection, setActiveSection] = useState<SectionId>('theme')
  const [saved, setSaved] = useState(true)

  function handleSave() {
    setSaved(true)
  }

  const PANEL_MAP: Record<SectionId, React.ReactNode> = {
    theme:     <ThemePanel />,
    header:    <HeaderPanel />,
    wallpaper: <WallpaperPanel />,
    text:      <TextPanel />,
    buttons:   <ButtonsPanel />,
    colors:    <ColorsPanel />,
    footer:    <FooterPanel />,
  }

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden">

        {/* ── Section sidebar ── */}
        <aside className="w-20 border-r border-border bg-surface flex flex-col items-center py-5 gap-1 shrink-0 overflow-y-auto">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-14 flex flex-col items-center gap-1 py-2.5 rounded-2xl cursor-pointer transition-all ${
                activeSection === id
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-semibold leading-tight">{label}</span>
            </button>
          ))}
        </aside>

        {/* ── Section content ── */}
        <div className="flex-1 overflow-y-auto bg-background border-r border-border">
          {/* Inner top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0 sticky top-0 z-10">
            <h1 className="text-base font-bold text-foreground">Design</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-foreground border border-border rounded-full px-4 py-1.5 hover:bg-muted transition-colors cursor-pointer">
                <Wand2 className="size-3.5" />
                Enhance
              </button>
              <button className="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer">
                <Undo2 className="size-4" />
              </button>
              <button className="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer">
                <Redo2 className="size-4" />
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Save
              </button>
              <span className="text-xs text-muted-foreground ml-1">
                {saved ? 'All saved' : 'Unsaved changes'}
              </span>
            </div>
          </div>

          {PANEL_MAP[activeSection]}
        </div>

        {/* ── Phone preview ── */}
        <div className="w-[380px] shrink-0 flex flex-col items-center justify-center gap-6 bg-[#f0f3fb] p-8 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Preview</p>
          <PhonePreview />
          <p className="text-xs text-muted-foreground text-center">
            Changes are reflected live in your collection
          </p>
        </div>

      </div>
    </AppLayout>
  )
}
