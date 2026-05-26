import api from '../lib/axios'

export interface MentionItem {
  _id: string
  fromUserId: { _id: string; name: string; email: string }
  projectId: { _id: string; name: string }
  messageText: string
  read: boolean
  createdAt: string
}

export interface BuzzItem {
  _id: string
  fromUserId: { _id: string; name: string; email: string }
  read: boolean
  createdAt: string
}

export interface ContactItem {
  _id: string
  name: string
  email: string
}

export interface UnreadCounts {
  mentions: number
  buzzes: number
}

const mentionBuzzService = {
  getUnreadCounts: (): Promise<{ success: boolean; data: UnreadCounts }> =>
    api.get('/mention-buzz/unread').then((r) => r.data),

  getMentions: (): Promise<{ success: boolean; data: MentionItem[] }> =>
    api.get('/mention-buzz/mentions').then((r) => r.data),

  markMentionsRead: (): Promise<void> =>
    api.patch('/mention-buzz/mentions/read').then((r) => r.data),

  getBuzzes: (): Promise<{ success: boolean; data: BuzzItem[] }> =>
    api.get('/mention-buzz/buzzes').then((r) => r.data),

  markBuzzesRead: (): Promise<void> =>
    api.patch('/mention-buzz/buzzes/read').then((r) => r.data),

  sendBuzz: (toUserId: string): Promise<{ success: boolean; data: BuzzItem; message: string }> =>
    api.post('/mention-buzz/buzz', { toUserId }).then((r) => r.data),

  getContacts: (): Promise<{ success: boolean; data: ContactItem[] }> =>
    api.get('/mention-buzz/contacts').then((r) => r.data),
}

export default mentionBuzzService
