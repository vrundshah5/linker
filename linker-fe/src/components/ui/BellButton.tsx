import { useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationPanel from './NotificationPanel'
import {
  useNotifications,
  useMarkAllRead,
  useMarkOneRead,
  useDeleteNotification,
} from '../../hooks/useNotifications'
import type { NotificationContext } from '../../services/notificationService'

interface BellButtonProps {
  context?: NotificationContext
}

export default function BellButton({ context }: BellButtonProps) {
  const [open, setOpen] = useState(false)
  const { data: notifications = [] } = useNotifications(context)
  const { mutate: markAllRead } = useMarkAllRead()
  const { mutate: markOneRead } = useMarkOneRead()
  const { mutate: deleteOne } = useDeleteNotification()

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative size-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" />
        )}
      </button>

      <NotificationPanel
        open={open}
        notifications={notifications}
        onClose={() => setOpen(false)}
        onMarkAllRead={() => markAllRead(context)}
        onMarkRead={(id) => markOneRead(id)}
        onDismiss={(id) => deleteOne(id)}
        context={context}
      />
    </div>
  )
}
