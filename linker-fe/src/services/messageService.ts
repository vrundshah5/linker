import api from '../lib/axios'

export interface ConversationUser {
  userId: string
  name: string
  email: string
  lastMessage: {
    content: string
    createdAt: string
    isFromMe: boolean
  } | null
  unreadCount: number
}

export interface AppMessage {
  _id: string
  fromUserId: { _id: string; name: string; email: string }
  toUserId: string
  content: string
  read: boolean
  createdAt: string
}

export const messageService = {
  getConversations: async (): Promise<ConversationUser[]> => {
    const res = await api.get<{ success: boolean; data: ConversationUser[] }>('/messages/conversations')
    return res.data.data
  },

  getMessages: async (userId: string, page = 1): Promise<AppMessage[]> => {
    const res = await api.get<{ success: boolean; data: AppMessage[] }>(
      `/messages/${userId}`,
      { params: { page, limit: 50 } }
    )
    return res.data.data
  },

  send: async (userId: string, content: string): Promise<AppMessage> => {
    const res = await api.post<{ success: boolean; data: AppMessage }>(
      `/messages/${userId}`,
      { content }
    )
    return res.data.data
  },

  markRead: async (userId: string): Promise<void> => {
    await api.patch(`/messages/${userId}/read`)
  },
}
