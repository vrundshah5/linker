import api from '../lib/axios'

export type TicketStatus = 'open' | 'in-progress' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface SupportTicket {
  _id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  adminNote: string
  createdAt: string
  updatedAt: string
}

export interface AdminSupportTicket extends SupportTicket {
  userId: { _id: string; name: string; email: string }
}

export const supportService = {
  submit: async (data: { title: string; description: string; priority: TicketPriority }): Promise<SupportTicket> => {
    const res = await api.post<{ success: boolean; data: SupportTicket }>('/support', data)
    return res.data.data
  },

  getMyTickets: async (): Promise<SupportTicket[]> => {
    const res = await api.get<{ success: boolean; data: SupportTicket[] }>('/support/mine')
    return res.data.data
  },

  adminGetAll: async (params?: { status?: string; priority?: string }): Promise<{ tickets: AdminSupportTicket[]; total: number }> => {
    const res = await api.get<{ success: boolean; data: { tickets: AdminSupportTicket[]; total: number } }>('/support/admin', { params })
    return res.data.data
  },

  adminUpdate: async (id: string, data: { status?: TicketStatus; adminNote?: string }): Promise<AdminSupportTicket> => {
    const res = await api.patch<{ success: boolean; data: AdminSupportTicket }>(`/support/admin/${id}`, data)
    return res.data.data
  },
}
