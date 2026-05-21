import { type ReactNode } from 'react'

/* ── avatar definitions ──────────────────────────────────────────── */

interface AvatarDef {
  id: string
  label: string
  node: ReactNode
}

/** Builds a local avatar img node from the public/avatars folder */
function av(id: string, label: string): ReactNode {
  return (
    <img
      src={`/avatars/${id}.png`}
      alt={label}
      className="w-full h-full object-cover"
      style={{ imageRendering: 'auto' }}
      draggable={false}
      decoding="async"
    />
  )
}

export const AVATARS: AvatarDef[] = [
  { id: 'avatar-1',  label: 'Liam',    node: av('avatar-1',  'Liam')    },
  { id: 'avatar-2',  label: 'Mia',     node: av('avatar-2',  'Mia')     },
  { id: 'avatar-3',  label: 'Noah',    node: av('avatar-3',  'Noah')    },
  { id: 'avatar-4',  label: 'Alex',    node: av('avatar-4',  'Alex')    },
  { id: 'avatar-5',  label: 'Zoe',     node: av('avatar-5',  'Zoe')     },
  { id: 'avatar-6',  label: 'Marcus',  node: av('avatar-6',  'Marcus')  },
  { id: 'avatar-7',  label: 'Kai',     node: av('avatar-7',  'Kai')     },
  { id: 'avatar-8',  label: 'James',   node: av('avatar-8',  'James')   },
  { id: 'avatar-9',  label: 'Sofia',   node: av('avatar-9',  'Sofia')   },
  { id: 'avatar-10', label: 'Ryo',     node: av('avatar-10', 'Ryo')     },
  { id: 'avatar-11', label: 'Arthur',  node: av('avatar-11', 'Arthur')  },
  { id: 'avatar-12', label: 'Amara',   node: av('avatar-12', 'Amara')   },
]

/* ── progress ring ───────────────────────────────────────────────── */

interface ProfileCompletionRingProps {
  percent: number
  size?: number
  children: ReactNode
}

export function ProfileCompletionRing({
  percent,
  size = 160,
  children,
}: ProfileCompletionRingProps) {
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Track + Arc */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      {/* Avatar inside */}
      <div
        className="rounded-full overflow-hidden bg-surface flex items-center justify-center"
        style={{ width: size - stroke * 4, height: size - stroke * 4 }}
      >
        {children}
      </div>

      {/* Percent badge */}
      <div className="absolute -right-1 top-5 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
        {percent}%
      </div>
    </div>
  )
}

/* ── avatar picker grid ──────────────────────────────────────────── */

interface AvatarPickerProps {
  selected: string
  onSelect: (id: string) => void
}

export function AvatarPickerGrid({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2.5">
      {AVATARS.map((a) => (
        <button
          key={a.id}
          type="button"
          title={a.label}
          onClick={() => onSelect(a.id)}
          className={`size-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer hover:scale-110 ${
            selected === a.id
              ? 'border-primary ring-2 ring-primary/30 scale-110'
              : 'border-border hover:border-primary/40'
          }`}
        >
          {a.node}
        </button>
      ))}
    </div>
  )
}

/* ── helpers ─────────────────────────────────────────────────────── */

export function getAvatarById(id: string) {
  return AVATARS.find((a) => a.id === id)
}

export function computeProfileCompletion(fields: {
  name: string
  avatar: string
  phone: string
  location: string
  jobTitle: string
  company: string
  website: string
  bio: string
}) {
  const checks = [
    fields.name,
    fields.avatar,
    fields.phone,
    fields.location,
    fields.jobTitle,
    fields.company,
    fields.website,
    fields.bio,
  ]
  const filled = checks.filter((v) => v.trim().length > 0).length
  return Math.round((filled / checks.length) * 100)
}
