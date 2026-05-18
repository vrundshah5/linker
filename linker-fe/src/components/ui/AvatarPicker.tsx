import { type ReactNode } from 'react'

/* ── avatar definitions ──────────────────────────────────────────── */

interface AvatarDef {
  id: string
  label: string
  node: ReactNode
}

function A({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill={bg} />
      {children}
    </svg>
  )
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'avatar-1',
    label: 'Alex',
    node: (
      <A bg="#FFDCB5">
        {/* Hair */}
        <path d="M12 42c0-21 17-38 38-38s38 17 38 38v-4c0-23-17-38-38-38S12 15 12 38z" fill="#5C3D2E" />
        <path d="M12 42c-1 0-1-6 2-12h72c3 6 3 12 2 12" fill="#5C3D2E" />
        {/* Ears */}
        <ellipse cx="14" cy="52" rx="5" ry="7" fill="#F5CAA0" />
        <ellipse cx="86" cy="52" rx="5" ry="7" fill="#F5CAA0" />
        {/* Glasses */}
        <circle cx="37" cy="48" r="10" stroke="#3D3D3D" strokeWidth="2" fill="white" fillOpacity=".15" />
        <circle cx="63" cy="48" r="10" stroke="#3D3D3D" strokeWidth="2" fill="white" fillOpacity=".15" />
        <path d="M47 48h6" stroke="#3D3D3D" strokeWidth="2" />
        <path d="M27 46l-13 2" stroke="#3D3D3D" strokeWidth="1.5" />
        <path d="M73 46l13 2" stroke="#3D3D3D" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="37" cy="49" r="3.5" fill="#3D3D3D" />
        <circle cx="63" cy="49" r="3.5" fill="#3D3D3D" />
        <circle cx="38.5" cy="47.5" r="1" fill="white" />
        <circle cx="64.5" cy="47.5" r="1" fill="white" />
        {/* Nose */}
        <path d="M48 56q2 4 4 0" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
        {/* Smile */}
        <path d="M38 68q12 12 24 0" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Teeth */}
        <path d="M42 68q8 6 16 0" fill="white" />
        {/* Eyebrows */}
        <path d="M29 38q8-4 16 0" stroke="#4A3225" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M55 38q8-4 16 0" stroke="#4A3225" strokeWidth="2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-2',
    label: 'Maya',
    node: (
      <A bg="#C68642">
        {/* Hair */}
        <path d="M10 50c0-22 18-44 40-44s40 22 40 44c0 0 2-44-40-44S8 6 10 50z" fill="#1A0F0A" />
        <path d="M10 50v20c0 0-2-8-2-20s5-28 10-32" fill="#1A0F0A" />
        <path d="M90 50v20c0 0 2-8 2-20s-5-28-10-32" fill="#1A0F0A" />
        {/* Ears */}
        <ellipse cx="16" cy="55" rx="4" ry="6" fill="#B07535" />
        <ellipse cx="84" cy="55" rx="4" ry="6" fill="#B07535" />
        {/* Earrings */}
        <circle cx="16" cy="63" r="2.5" fill="#FFD700" />
        <circle cx="84" cy="63" r="2.5" fill="#FFD700" />
        {/* Eyes */}
        <ellipse cx="37" cy="50" rx="4" ry="4.5" fill="#2D2D2D" />
        <ellipse cx="63" cy="50" rx="4" ry="4.5" fill="#2D2D2D" />
        <circle cx="38.5" cy="48.5" r="1.2" fill="white" />
        <circle cx="64.5" cy="48.5" r="1.2" fill="white" />
        {/* Eyelashes */}
        <path d="M31 47q2-3 5-2" stroke="#1A0F0A" strokeWidth="1.2" fill="none" />
        <path d="M57 47q2-3 5-2" stroke="#1A0F0A" strokeWidth="1.2" fill="none" />
        {/* Nose */}
        <path d="M48 58q2 3 4 0" stroke="#9A6830" strokeWidth="1.5" strokeLinecap="round" />
        {/* Lips */}
        <path d="M40 67q10 10 20 0" stroke="#C44040" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M43 67q7 5 14 0" fill="#D45050" />
        {/* Eyebrows */}
        <path d="M30 42q7-4 14 0" stroke="#1A0F0A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M56 42q7-4 14 0" stroke="#1A0F0A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-3',
    label: 'Sam',
    node: (
      <A bg="#F5D0A9">
        {/* Hair */}
        <path d="M14 40c0-20 16-36 36-36s36 16 36 36v-2c0-22-16-38-36-38S14 16 14 38z" fill="#8B6914" />
        <path d="M14 40h72c0-4-1-8-3-12H17c-2 4-3 8-3 12z" fill="#8B6914" />
        {/* Ears */}
        <ellipse cx="16" cy="52" rx="5" ry="7" fill="#E8C08A" />
        <ellipse cx="84" cy="52" rx="5" ry="7" fill="#E8C08A" />
        {/* Eyes */}
        <circle cx="37" cy="48" r="4" fill="#3D6B3D" />
        <circle cx="63" cy="48" r="4" fill="#3D6B3D" />
        <circle cx="37" cy="48" r="2" fill="#2D2D2D" />
        <circle cx="63" cy="48" r="2" fill="#2D2D2D" />
        <circle cx="38" cy="47" r="1" fill="white" />
        <circle cx="64" cy="47" r="1" fill="white" />
        {/* Nose */}
        <path d="M47 55q3 5 6 0" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
        {/* Beard */}
        <path d="M25 62c0 0 5 22 25 22s25-22 25-22" fill="#7A5C14" />
        <path d="M30 62c0 0 5 15 20 15s20-15 20-15" fill="#F5D0A9" />
        {/* Mouth in beard */}
        <path d="M42 68q8 6 16 0" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Eyebrows */}
        <path d="M29 40q8-4 16 0" stroke="#7A5C14" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M55 40q8-4 16 0" stroke="#7A5C14" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-4',
    label: 'Zoe',
    node: (
      <A bg="#8D5524">
        {/* Hair puff */}
        <ellipse cx="50" cy="18" rx="30" ry="18" fill="#1A1A1A" />
        <path d="M20 18c0-10 13-18 30-18s30 8 30 18c0 0-5-12-30-12S20 18 20 18z" fill="#2D2D2D" />
        {/* Hair sides */}
        <path d="M14 45c-2-20 12-32 18-34" fill="#1A1A1A" />
        <path d="M86 45c2-20-12-32-18-34" fill="#1A1A1A" />
        {/* Ears */}
        <ellipse cx="16" cy="55" rx="4" ry="6" fill="#7A4518" />
        <ellipse cx="84" cy="55" rx="4" ry="6" fill="#7A4518" />
        {/* Eyes */}
        <ellipse cx="37" cy="50" rx="4.5" ry="5" fill="white" />
        <ellipse cx="63" cy="50" rx="4.5" ry="5" fill="white" />
        <circle cx="37" cy="51" r="3" fill="#3D2B1F" />
        <circle cx="63" cy="51" r="3" fill="#3D2B1F" />
        <circle cx="38" cy="49.5" r="1" fill="white" />
        <circle cx="64" cy="49.5" r="1" fill="white" />
        {/* Nose */}
        <path d="M47 58q3 4 6 0" stroke="#6B3A15" strokeWidth="1.5" strokeLinecap="round" />
        {/* Smile */}
        <path d="M38 68q12 10 24 0" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M41 68q9 5 18 0" fill="white" />
        {/* Eyebrows */}
        <path d="M29 42q8-5 16 0" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M55 42q8-5 16 0" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-5',
    label: 'Leo',
    node: (
      <A bg="#FFCC99">
        {/* Cap */}
        <path d="M12 40c0-18 17-32 38-32s38 14 38 32H12z" fill="#6c5dd3" />
        <rect x="8" y="38" width="84" height="7" rx="3" fill="#5A4DBF" />
        <path d="M82 41c8 0 14-2 14-4" stroke="#5A4DBF" strokeWidth="4" strokeLinecap="round" />
        {/* Ears */}
        <ellipse cx="16" cy="52" rx="5" ry="7" fill="#EEBB82" />
        <ellipse cx="84" cy="52" rx="5" ry="7" fill="#EEBB82" />
        {/* Eyes */}
        <circle cx="37" cy="52" r="4" fill="#2D2D2D" />
        <circle cx="63" cy="52" r="4" fill="#2D2D2D" />
        <circle cx="38" cy="50.5" r="1.2" fill="white" />
        <circle cx="64" cy="50.5" r="1.2" fill="white" />
        {/* Nose */}
        <path d="M48 58q2 3 4 0" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round" />
        {/* Grin */}
        <path d="M36 67q14 14 28 0" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M40 67q10 7 20 0" fill="white" />
        {/* Eyebrows */}
        <path d="M30 45q7-3 14 0" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M56 45q7-3 14 0" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-6',
    label: 'Nina',
    node: (
      <A bg="#FFE0BD">
        {/* Bun */}
        <circle cx="50" cy="8" r="14" fill="#B8390E" />
        {/* Hair */}
        <path d="M14 42c0-18 16-34 36-34s36 16 36 34c0 0-4-22-36-22S14 42 14 42z" fill="#B8390E" />
        {/* Ears */}
        <ellipse cx="16" cy="52" rx="4" ry="6" fill="#F0CFA0" />
        <ellipse cx="84" cy="52" rx="4" ry="6" fill="#F0CFA0" />
        {/* Glasses */}
        <rect x="25" y="42" width="20" height="14" rx="7" stroke="#C88C32" strokeWidth="2" fill="white" fillOpacity=".12" />
        <rect x="55" y="42" width="20" height="14" rx="7" stroke="#C88C32" strokeWidth="2" fill="white" fillOpacity=".12" />
        <path d="M45 48h10" stroke="#C88C32" strokeWidth="2" />
        <path d="M25 48l-9 1" stroke="#C88C32" strokeWidth="1.5" />
        <path d="M75 48l9 1" stroke="#C88C32" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="35" cy="50" r="3" fill="#4A7023" />
        <circle cx="65" cy="50" r="3" fill="#4A7023" />
        <circle cx="35" cy="50" r="1.5" fill="#2D2D2D" />
        <circle cx="65" cy="50" r="1.5" fill="#2D2D2D" />
        <circle cx="36" cy="49" r=".8" fill="white" />
        <circle cx="66" cy="49" r=".8" fill="white" />
        {/* Freckles */}
        <circle cx="28" cy="58" r="1" fill="#D4A574" opacity=".5" />
        <circle cx="32" cy="60" r="1" fill="#D4A574" opacity=".5" />
        <circle cx="68" cy="58" r="1" fill="#D4A574" opacity=".5" />
        <circle cx="72" cy="60" r="1" fill="#D4A574" opacity=".5" />
        {/* Nose */}
        <path d="M48 57q2 3 4 0" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
        {/* Smile */}
        <path d="M40 68q10 8 20 0" stroke="#C44040" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Eyebrows */}
        <path d="M27 40q8-3 16 0" stroke="#B8390E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M57 40q8-3 16 0" stroke="#B8390E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-7',
    label: 'Jay',
    node: (
      <A bg="#DEB887">
        {/* Spiky hair */}
        <path d="M25 30l5-18 8 14 6-20 8 16 6-18 8 14 6-16 5 18c2 4 3 10 3 14H22c0-4 1-10 3-14z" fill="#2C2C2C" />
        {/* Ears */}
        <ellipse cx="16" cy="52" rx="5" ry="7" fill="#CDA06D" />
        <ellipse cx="84" cy="52" rx="5" ry="7" fill="#CDA06D" />
        {/* Eyes */}
        <ellipse cx="37" cy="50" rx="5" ry="5.5" fill="white" />
        <ellipse cx="63" cy="50" rx="5" ry="5.5" fill="white" />
        <circle cx="37" cy="51" r="3" fill="#2D2D2D" />
        <circle cx="63" cy="51" r="3" fill="#2D2D2D" />
        <circle cx="38.5" cy="49.5" r="1" fill="white" />
        <circle cx="64.5" cy="49.5" r="1" fill="white" />
        {/* Nose */}
        <path d="M47 57q3 4 6 0" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" />
        {/* Open mouth smile */}
        <ellipse cx="50" cy="70" rx="10" ry="8" fill="#3D3D3D" />
        <ellipse cx="50" cy="66" rx="8" ry="3" fill="white" />
        <ellipse cx="50" cy="75" rx="6" ry="2.5" fill="#C44040" />
        {/* Eyebrows */}
        <path d="M29 42q8-5 16 0" stroke="#2C2C2C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M55 42q8-5 16 0" stroke="#2C2C2C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
  {
    id: 'avatar-8',
    label: 'Aria',
    node: (
      <A bg="#A0522D">
        {/* Curly hair */}
        <circle cx="25" cy="22" r="12" fill="#1A0A00" />
        <circle cx="50" cy="14" r="14" fill="#1A0A00" />
        <circle cx="75" cy="22" r="12" fill="#1A0A00" />
        <circle cx="16" cy="38" r="10" fill="#1A0A00" />
        <circle cx="84" cy="38" r="10" fill="#1A0A00" />
        <circle cx="14" cy="52" r="8" fill="#1A0A00" />
        <circle cx="86" cy="52" r="8" fill="#1A0A00" />
        {/* Ears */}
        <ellipse cx="18" cy="55" rx="3.5" ry="5" fill="#8B4513" />
        <ellipse cx="82" cy="55" rx="3.5" ry="5" fill="#8B4513" />
        {/* Eyes */}
        <ellipse cx="37" cy="50" rx="4" ry="4.5" fill="white" />
        <ellipse cx="63" cy="50" rx="4" ry="4.5" fill="white" />
        <circle cx="37" cy="51" r="2.5" fill="#3D2B1F" />
        <circle cx="63" cy="51" r="2.5" fill="#3D2B1F" />
        <circle cx="38" cy="49.5" r="1" fill="white" />
        <circle cx="64" cy="49.5" r="1" fill="white" />
        {/* Eyelashes */}
        <path d="M31 47q2-3 4-1" stroke="#1A0A00" strokeWidth="1" fill="none" />
        <path d="M57 47q2-3 4-1" stroke="#1A0A00" strokeWidth="1" fill="none" />
        {/* Nose */}
        <path d="M47 58q3 3 6 0" stroke="#7A3B10" strokeWidth="1.5" strokeLinecap="round" />
        {/* Smile */}
        <path d="M40 68q10 8 20 0" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M43 68q7 4 14 0" fill="white" />
        {/* Eyebrows */}
        <path d="M30 42q7-4 14 0" stroke="#1A0A00" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M56 42q7-4 14 0" stroke="#1A0A00" strokeWidth="2" strokeLinecap="round" fill="none" />
      </A>
    ),
  },
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
    <div className="grid grid-cols-4 gap-2.5">
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
