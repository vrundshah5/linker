import api from '../lib/axios'

export type NotificationType = 'new_user' | 'request_received' | 'request_accepted' | 'request_rejected'

export interface AppNotification {
  _id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  meta: {
    requestId?: string
    fromUserId?: { _id: string; name: string; email: string } | null
  }
  createdAt: string
}

export const notificationService = {
  getAll: async (): Promise<AppNotification[]> => {
    const res = await api.get<{ success: boolean; data: AppNotification[] }>('/notifications')
    return res.data.data
  },
  markAllRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all')
  },
  markOneRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`)
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`)
  },
}
