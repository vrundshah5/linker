import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, User, Briefcase, Check, ArrowRight } from 'lucide-react'

type PlanType = 'personal' | 'professional'

const PLANS: {
  id: PlanType
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    id: 'personal',
    label: 'Personal',
    description: 'Save articles, inspiration, and personal resources.',
    icon: <User className="size-8" />,
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Manage project links and collaborate with a team.',
    icon: <Briefcase className="size-8" />,
  },
]

export default function Onboard() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PlanType>('professional')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate(`/onboard/${selected}`)
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-20 px-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-16">
        <div className="size-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-sm">
          <Link className="size-6" />
        </div>
        <span
          className="font-bold text-3xl text-foreground"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          Linker
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1
          className="text-4xl font-bold text-foreground mb-4 text-center"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          How are you planning to use Linker?
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-xl">
          We'll customize your onboarding experience and workspace based on your
          selection. You can always change this later.
        </p>

        {/* Plan selector */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="grid grid-cols-2 gap-6 max-w-2xl w-full mb-12">
            {PLANS.map((plan) => {
              const isSelected = selected === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-surface hover:border-primary/50'
                  }`}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 size-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center mb-6 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-primary'
                    }`}
                  >
                    {plan.icon}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {plan.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm text-lg w-full max-w-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            Continue to Setup
            <ArrowRight className="size-5" />
          </button>
        
        </form>
      </div>
    </div>
  )
}
