import { Link } from 'lucide-react'

interface WorkspaceSwitchSplashProps {
  targetWorkspace: 'personal' | 'professional'
}

export default function WorkspaceSwitchSplash({ targetWorkspace }: WorkspaceSwitchSplashProps) {
  const isProfessional = targetWorkspace === 'professional'

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div
        className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 animate-pulse"
      >
        <Link className="size-7" />
      </div>
      <p
        className="text-lg font-bold text-foreground mb-1"
        style={{ fontFamily: 'var(--font-headings)' }}
      >
        Switching to {isProfessional ? 'Professional' : 'Personal'}
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Setting up your workspace…
      </p>
      <div
        className={`size-6 border-[2.5px] border-border ${isProfessional ? 'border-t-warning' : 'border-t-primary'} rounded-full animate-spin`}
      />
    </div>
  )
}
