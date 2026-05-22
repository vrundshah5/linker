import api from '../lib/axios'

export type NotificationType = 'new_user' | 'request_received' | 'request_accepted' | 'request_rejected' | 'project_invite' | 'support_ticket'
export type NotificationContext = 'personal' | 'professional' | 'admin'

export interface AppNotification {
  _id: string
  userId: string
  type: NotificationType
  context: NotificationContext
  title: string
  body: string
  read: boolean
  meta: {
    requestId?: string
    fromUserId?: { _id: string; name: string; email: string } | null
    projectId?: string | null
    actorName?: string | null
    projectName?: string | null
  }
  createdAt: string
}

export const notificationService = {
  getAll: async (context?: NotificationContext): Promise<AppNotification[]> => {
    const params = context ? { context } : {}
    const res = await api.get<{ success: boolean; data: AppNotification[] }>('/notifications', { params })
    return res.data.data
  },
  markAllRead: async (context?: NotificationContext): Promise<void> => {
    const params = context ? { context } : {}
    await api.patch('/notifications/read-all', null, { params })
  },
  markOneRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`)
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`)
  },
}
