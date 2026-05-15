import api from '../lib/axios'

export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export interface RequestUser {
  _id: string
  name: string
  email: string
}

export interface ConnectionRequest {
  _id: string
  fromUserId: RequestUser
  toUserId: RequestUser
  note: string
  status: RequestStatus
  createdAt: string
}

export interface RequestsData {
  received: ConnectionRequest[]
  sent: ConnectionRequest[]
}

export const requestService = {
  getAll: async (): Promise<RequestsData> => {
    const res = await api.get<{ success: boolean; data: RequestsData }>('/requests')
    return res.data.data
  },
  send: async (email: string, note?: string): Promise<ConnectionRequest> => {
    const res = await api.post<{ success: boolean; data: ConnectionRequest }>('/requests', { email, note })
    return res.data.data
  },
  respond: async (id: string, action: 'accepted' | 'rejected'): Promise<ConnectionRequest> => {
    const res = await api.patch<{ success: boolean; data: ConnectionRequest }>(`/requests/${id}`, { action })
    return res.data.data
  },
  cancel: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`)
  },
}
