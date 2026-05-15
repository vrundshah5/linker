import api from '../lib/axios'

export interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isBanned: boolean
  onboardingComplete: boolean
  workspaceType: 'personal' | 'professional' | null
  createdAt: string
}

export interface ListUsersResponse {
  success: boolean
  data: {
    users: AdminUser[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  message: string
}

export const adminService = {
  listUsers: async (params: { search?: string; page?: number; limit?: number }): Promise<ListUsersResponse> => {
    const { data } = await api.get<ListUsersResponse>('/admin/users', { params })
    return data
  },

  toggleBan: async (userId: string): Promise<{ success: boolean; data: { user: AdminUser }; message: string }> => {
    const { data } = await api.patch(`/admin/users/${userId}/ban`)
    return data
  },
}
