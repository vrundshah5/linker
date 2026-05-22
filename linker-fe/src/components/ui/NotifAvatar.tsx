import { UserPlus, UserCheck, UserX, Users, FolderPlus, LifeBuoy } from 'lucide-react'
import type { AppNotification, NotificationType } from '../../services/notificationService'

const META: Record<NotificationType, { icon: React.ElementType; bg: string; color: string }> = {
  new_user:         { icon: Users,      bg: 'bg-primary/10', color: 'text-primary' },
  request_received: { icon: UserPlus,   bg: 'bg-success/15', color: 'text-success' },
  request_accepted: { icon: UserCheck,  bg: 'bg-success/15', color: 'text-success' },
  request_rejected: { icon: UserX,      bg: 'bg-danger/10',  color: 'text-danger'  },
  project_invite:   { icon: FolderPlus, bg: 'bg-primary/10', color: 'text-primary' },
  support_ticket:   { icon: LifeBuoy,   bg: 'bg-warning/10', color: 'text-warning' },
}

const USER_TYPES: NotificationType[] = [
  'request_received', 'request_accepted', 'request_rejected', 'project_invite',
]

interface Props {
  n: AppNotification
  /** sm = 32px (panel dropdown), md = 40px (full page) */
  size?: 'sm' | 'md'
}

export default function NotifAvatar({ n, size = 'md' }: Props) {
  const { icon: Icon, bg, color } = META[n.type]
  const actor = n.meta.fromUserId && typeof n.meta.fromUserId === 'object' ? n.meta.fromUserId : null
  const dim = size === 'sm' ? 'size-8' : 'size-10'
  const iconDim = size === 'sm' ? 'size-4' : 'size-5'

  // User-triggered: show actor avatar or initials
  if (USER_TYPES.includes(n.type) && actor) {
    if (actor.avatar) {
      return (
        <div className={`${dim} rounded-xl shrink-0 overflow-hidden mt-0.5`}>
          <img
            src={`/avatars/${actor.avatar}.png`}
            alt={actor.name}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    // Initials fallback when no avatar set
    const initials = actor.name
      .split(' ')
      .map((w: string) => w[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return (
      <div className={`${dim} rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} font-bold ${color}`}>
          {initials}
        </span>
      </div>
    )
  }

  // System notifications: icon in themed circle
  return (
    <div className={`${dim} rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
      <Icon className={`${iconDim} ${color}`} />
    </div>
  )
}
