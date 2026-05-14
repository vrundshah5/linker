import { useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationPanel, { MOCK_NOTIFICATIONS, type Notification } from './NotificationPanel'

export default function BellButton() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const unread = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function dismiss(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative size-10 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" />
        )}
      </button>

      <NotificationPanel
        open={open}
        notifications={notifications}
        onClose={() => setOpen(false)}
        onMarkAllRead={markAllRead}
        onDismiss={dismiss}
      />
    </div>
  )
}
