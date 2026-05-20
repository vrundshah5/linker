import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type React from 'react'

// ─── Theme definitions ────────────────────────────────────────────────────────
export interface Theme {
  id: string
  label: string
  swatch: string
  shell: string
  screenBg: string
  cardBg: string
  cardBgSoft: string
  cardText: string
  emptyText: string
  text: string
  subText: string
  avatarBg: string
  avatarText: string
  moreBg: string
  moreIcon: string
  footerBtnBg: string
  footerBtnText: string
}

export const THEMES: Theme[] = [
  {
    id: 'dark', label: 'Dark', swatch: '#111111', shell: '#111111',
    screenBg: '#000000', cardBg: '#1a1a1a', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.3)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.3)', avatarBg: 'rgba(108,93,211,0.25)', avatarText: '#a78bfa',
    moreBg: 'rgba(255,255,255,0.1)', moreIcon: 'rgba(255,255,255,0.8)',
    footerBtnBg: '#ffffff', footerBtnText: '#000000',
  },
  {
    id: 'light', label: 'Light', swatch: '#f5f5f5', shell: '#c8c8c8',
    screenBg: '#f8f9fa', cardBg: '#ffffff', cardBgSoft: 'rgba(0,0,0,0.05)',
    cardText: '#1e2022', emptyText: '#8f95b2', text: '#1e2022', subText: '#8f95b2',
    avatarBg: 'rgba(108,93,211,0.1)', avatarText: '#6c5dd3',
    moreBg: 'rgba(0,0,0,0.07)', moreIcon: '#4a4a4a',
    footerBtnBg: '#1e2022', footerBtnText: '#ffffff',
  },
  {
    id: 'purple', label: 'Purple', swatch: '#6c5dd3', shell: '#4a3fa0',
    screenBg: 'linear-gradient(160deg,#6c5dd3 0%,#3d2fa0 100%)',
    cardBg: 'rgba(255,255,255,0.18)', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.4)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.5)', avatarBg: 'rgba(255,255,255,0.2)', avatarText: '#ffffff',
    moreBg: 'rgba(255,255,255,0.2)', moreIcon: '#ffffff',
    footerBtnBg: '#ffffff', footerBtnText: '#6c5dd3',
  },
  {
    id: 'ocean', label: 'Ocean', swatch: '#0ea5e9', shell: '#0369a1',
    screenBg: 'linear-gradient(160deg,#0c4a6e 0%,#0ea5e9 100%)',
    cardBg: 'rgba(255,255,255,0.18)', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.4)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.5)', avatarBg: 'rgba(255,255,255,0.2)', avatarText: '#ffffff',
    moreBg: 'rgba(255,255,255,0.2)', moreIcon: '#ffffff',
    footerBtnBg: '#ffffff', footerBtnText: '#0c4a6e',
  },
  {
    id: 'sunset', label: 'Sunset', swatch: '#f97316', shell: '#c2410c',
    screenBg: 'linear-gradient(160deg,#7c2d12 0%,#f97316 60%,#fbbf24 100%)',
    cardBg: 'rgba(255,255,255,0.18)', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.4)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.5)', avatarBg: 'rgba(255,255,255,0.2)', avatarText: '#ffffff',
    moreBg: 'rgba(255,255,255,0.2)', moreIcon: '#ffffff',
    footerBtnBg: '#ffffff', footerBtnText: '#c2410c',
  },
  {
    id: 'forest', label: 'Forest', swatch: '#16a34a', shell: '#14532d',
    screenBg: 'linear-gradient(160deg,#052e16 0%,#16a34a 100%)',
    cardBg: 'rgba(255,255,255,0.18)', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.4)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.5)', avatarBg: 'rgba(255,255,255,0.2)', avatarText: '#ffffff',
    moreBg: 'rgba(255,255,255,0.2)', moreIcon: '#ffffff',
    footerBtnBg: '#ffffff', footerBtnText: '#052e16',
  },
  {
    id: 'rose', label: 'Rose', swatch: '#f43f5e', shell: '#9f1239',
    screenBg: 'linear-gradient(160deg,#4c0519 0%,#f43f5e 100%)',
    cardBg: 'rgba(255,255,255,0.18)', cardBgSoft: 'rgba(255,255,255,0.08)',
    cardText: '#ffffff', emptyText: 'rgba(255,255,255,0.4)', text: '#ffffff',
    subText: 'rgba(255,255,255,0.5)', avatarBg: 'rgba(255,255,255,0.2)', avatarText: '#ffffff',
    moreBg: 'rgba(255,255,255,0.2)', moreIcon: '#ffffff',
    footerBtnBg: '#ffffff', footerBtnText: '#9f1239',
  },
  {
    id: 'midnight', label: 'Midnight', swatch: '#1e3a5f', shell: '#0f1f2e',
    screenBg: 'linear-gradient(160deg,#0f1f2e 0%,#1e3a5f 100%)',
    cardBg: 'rgba(255,255,255,0.1)', cardBgSoft: 'rgba(255,255,255,0.05)',
    cardText: '#e2e8f0', emptyText: 'rgba(255,255,255,0.3)', text: '#e2e8f0',
    subText: 'rgba(255,255,255,0.35)', avatarBg: 'rgba(255,255,255,0.1)', avatarText: '#93c5fd',
    moreBg: 'rgba(255,255,255,0.1)', moreIcon: 'rgba(255,255,255,0.7)',
    footerBtnBg: '#93c5fd', footerBtnText: '#0f1f2e',
  },
]

// ─── Design config types ──────────────────────────────────────────────────────
export type ButtonShape = 'rounded' | 'pill' | 'square' | 'sharp'
export type ButtonFill  = 'solid'   | 'outline' | 'soft' | 'glass'
export type HeaderLayout = 'classic' | 'hero'
export type FontId = 'system' | 'serif' | 'mono' | 'display'

// ─── Helper: compute button styles for phone preview ─────────────────────────
export function getButtonStyles(
  theme: Theme,
  shape: ButtonShape,
  fill: ButtonFill,
): React.CSSProperties {
  const radiusMap: Record<ButtonShape, string> = {
    rounded: '12px',
    pill: '999px',
    square: '6px',
    sharp: '0px',
  }
  const r = radiusMap[shape]

  switch (fill) {
    case 'outline':
      return { borderRadius: r, backgroundColor: 'transparent', color: theme.cardText, border: `2px solid ${theme.cardText}` }
    case 'soft':
      return { borderRadius: r, backgroundColor: theme.cardBgSoft, color: theme.cardText, border: 'none' }
    case 'glass':
      return { borderRadius: r, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: theme.cardText, border: '1px solid rgba(255,255,255,0.25)' }
    default: // solid
      return { borderRadius: r, backgroundColor: theme.cardBg, color: theme.cardText, border: 'none' }
  }
}

// ─── Font map ─────────────────────────────────────────────────────────────────
export const FONT_MAP: Record<FontId, string> = {
  system:  'system-ui, sans-serif',
  serif:   'Georgia, serif',
  mono:    '"Courier New", monospace',
  display: 'var(--font-headings, system-ui)',
}

// ─── Zustand store ────────────────────────────────────────────────────────────
interface DesignState {
  themeId: string
  buttonShape: ButtonShape
  buttonFill: ButtonFill
  headerLayout: HeaderLayout
  fontId: FontId
  showFooter: boolean
  setThemeId: (id: string) => void
  setButtonShape: (shape: ButtonShape) => void
  setButtonFill: (fill: ButtonFill) => void
  setHeaderLayout: (layout: HeaderLayout) => void
  setFontId: (id: FontId) => void
  setShowFooter: (show: boolean) => void
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      themeId: 'dark',
      buttonShape: 'rounded',
      buttonFill: 'solid',
      headerLayout: 'classic',
      fontId: 'system',
      showFooter: true,
      setThemeId:      (themeId)      => set({ themeId }),
      setButtonShape:  (buttonShape)  => set({ buttonShape }),
      setButtonFill:   (buttonFill)   => set({ buttonFill }),
      setHeaderLayout: (headerLayout) => set({ headerLayout }),
      setFontId:       (fontId)       => set({ fontId }),
      setShowFooter:   (showFooter)   => set({ showFooter }),
    }),
    { name: 'linker-design' },
  ),
)
