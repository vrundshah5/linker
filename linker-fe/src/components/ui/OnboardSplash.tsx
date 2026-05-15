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
  const accentColor = isPersonal ? 'bg-primary' : 'bg-warning'
  const accentText = isPersonal ? 'text-primary' : 'text-warning'
  const accentBg = isPersonal ? 'bg-primary/10' : 'bg-warning/10'
  const accentRing = isPersonal ? 'ring-primary/30' : 'ring-warning/30'
  const firstName = userName.split(' ')[0]
  const dashboardLabel = isPersonal ? 'Personal Dashboard' : 'Professional Workspace'

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${
        phase === 'in' ? 'opacity-0' : phase === 'hold' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative flex flex-col items-center gap-6 px-14 py-14 bg-surface border border-border rounded-3xl shadow-2xl max-w-sm w-full mx-6 transition-all duration-500 ${
          phase === 'in' ? 'scale-90 opacity-0' : phase === 'hold' ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      >
        {/* Sparkles top-right */}
        <Sparkles className={`absolute top-5 right-5 size-5 ${accentText} opacity-60`} />
        <Sparkles className={`absolute top-10 right-10 size-3 ${accentText} opacity-30`} />
        <Sparkles className={`absolute bottom-8 left-7 size-4 ${accentText} opacity-40`} />

        {/* Logo ring */}
        <div className={`size-20 rounded-3xl ${accentColor} text-primary-foreground flex items-center justify-center shadow-lg ring-4 ${accentRing}`}>
          <Link className="size-9" />
        </div>

        {/* Checkmark badge */}
        <div className={`absolute top-24 left-1/2 -translate-x-1/2 translate-y-6 size-8 rounded-full ${accentColor} text-primary-foreground flex items-center justify-center shadow-md border-2 border-surface`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            You're all set, {firstName}! 🎉
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

        {/* Floating dots decoration */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`size-2 rounded-full ${accentBg} border ${isPersonal ? 'border-primary/30' : 'border-warning/30'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
