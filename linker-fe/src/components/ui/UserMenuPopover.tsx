import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, ChevronDown, ChevronUp, ArrowLeftRight } from 'lucide-react'

interface UserMenuPopoverProps {
  children: (open: boolean) => ReactNode
  accentClass: string
  accentBg: string
  /** Route to switch workspace mode. If provided shows a Switch option. */
  switchTo?: { label: string; path: string; onSwitch?: () => void }
}

export default function UserMenuPopover({ children, accentClass, accentBg, switchTo }: UserMenuPopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full cursor-pointer"
      >
        {children(open)}
      </button>

      {/* Dropdown — pops upward, full sidebar width */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
          {/* Profile option */}
          <button
            type="button"
            onClick={() => { setOpen(false); navigate('/profile') }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <div className={`size-7 rounded-lg ${accentBg} flex items-center justify-center shrink-0`}>
              <User className={`size-3.5 ${accentClass}`} />
            </div>
            View Profile
          </button>

          {/* Switch workspace option */}
          {switchTo && (
            <>
              <div className="border-t border-border" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  if (switchTo.onSwitch) {
                    switchTo.onSwitch()
                  } else {
                    navigate(switchTo.path)
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="size-3.5 text-primary" />
                </div>
                <span>{switchTo.label}</span>
              </button>
            </>
          )}

          <div className="border-t border-border" />

          {/* Logout option */}
          <button
            type="button"
            onClick={() => { setOpen(false); navigate('/login') }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-danger hover:bg-danger/5 transition-colors cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
              <LogOut className="size-3.5 text-danger" />
            </div>
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
