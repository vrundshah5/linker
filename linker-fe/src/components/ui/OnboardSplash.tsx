import { useEffect, useState } from 'react'
import { Sparkles, Link } from 'lucide-react'

interface OnboardSplashProps {
  userName: string
  workspaceType: 'personal' | 'professional'
  onDone: () => void
}

export default function OnboardSplash({ userName, workspaceType, onDone }: OnboardSplashProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('out'), 2600)
    const t3 = setTimeout(() => onDone(), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  const isPersonal = workspaceType === 'personal'
  const accentColor = 'bg-primary'
  const accentText = 'text-primary'
  const accentRing = 'ring-primary/30'
  const firstName = userName.split(' ')[0]
  const dashboardLabel = isPersonal ? 'Personal Dashboard' : 'Professional Workspace'

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${
        phase === 'in' ? 'opacity-0' : phase === 'hold' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Outer wrapper: character sits on top of the card */}
      <div
        className={`flex flex-col items-center max-w-sm w-full mx-6 transition-all duration-500 ${
          phase === 'in' ? 'scale-90 opacity-0' : phase === 'hold' ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      >
          {/* 3D character — overlaps the top edge of the card */}
          <img
            src="/avatars/OnBoard.png"
          alt=""
          aria-hidden="true"
          className="w-40 h-40 object-contain relative z-10 -mb-12 drop-shadow-xl select-none pointer-events-none"
        />

        {/* Card */}
        <div className={`relative w-full flex flex-col items-center gap-5 px-10 pt-16 pb-10 bg-surface border border-border rounded-3xl shadow-2xl`}>
          {/* Sparkles */}
          <Sparkles className={`absolute top-5 right-5 size-5 ${accentText} opacity-60`} />
          <Sparkles className={`absolute top-10 right-10 size-3 ${accentText} opacity-30`} />

          {/* Logo ring with checkmark badge */}
          <div className="relative">
            <div className={`size-16 rounded-2xl ${accentColor} text-primary-foreground flex items-center justify-center shadow-lg ring-4 ${accentRing}`}>
              <Link className="size-7" />
            </div>
            <div className={`absolute -bottom-2 -right-2 size-7 rounded-full ${accentColor} text-primary-foreground flex items-center justify-center shadow-md border-2 border-surface`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              You're all set, {firstName}!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your <span className={`font-bold ${accentText}`}>{dashboardLabel}</span> is ready.<br />
              Taking you there now…
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${accentColor} rounded-full transition-all duration-[2200ms] ease-linear ${
                phase === 'hold' ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
