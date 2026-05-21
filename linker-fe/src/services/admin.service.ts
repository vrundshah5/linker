import api from '../lib/axios'
import type { UserCategory } from './categoryService'

export interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isBanned: boolean
  onboardingComplete: boolean
  workspaceType: 'personal' | 'professional' | null
  workspaces: string[]
  avatar?: string
  createdAt: string
}

export interface AdminProject {
  _id: string
  name: string
  description: string
  ownerId: string
  color: string
  members: { userId: string; role: string }[]
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

export interface AdminGlobalCategory {
  _id: string
  name: string
  description: string
  icon: string
  color: string
  isActive: boolean
  allowedExtensions: string[]
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  totalCategories: number
  totalLinks: number
  activeGlobalCategories: number
  userGrowth: { month: string; count: number }[]
  categoryDistribution: { name: string; count: number; pct: number }[]
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<{ success: boolean; data: AdminStats }>('/admin/stats')
    return data.data
  },

  listUsers: async (params: { search?: string; page?: number; limit?: number }): Promise<ListUsersResponse> => {
    const { data } = await api.get<ListUsersResponse>('/admin/users', { params })
    return data
  },

  toggleBan: async (userId: string): Promise<{ success: boolean; data: { user: AdminUser }; message: string }> => {
    const { data } = await api.patch(`/admin/users/${userId}/ban`)
    return data
  },

  getUserDetail: async (userId: string): Promise<{ success: boolean; data: { user: AdminUser; customCategories: UserCategory[]; projects: AdminProject[] }; message: string }> => {
    const { data } = await api.get(`/admin/users/${userId}`)
    return data
  },

  deleteUser: async (userId: string): Promise<{ success: boolean; data: null; message: string }> => {
    const { data } = await api.delete(`/admin/users/${userId}`)
    return data
  },

  listGlobalCategories: async (search?: string): Promise<{ success: boolean; data: { categories: AdminGlobalCategory[] }; message: string }> => {
    const { data } = await api.get('/admin/categories', { params: { search } })
    return data
  },

  createGlobalCategory: async (payload: { name: string; description?: string; icon?: string; color?: string; allowedExtensions?: string[] }): Promise<{ success: boolean; data: { category: AdminGlobalCategory }; message: string }> => {
    const { data } = await api.post('/admin/categories', payload)
    return data
  },

  updateGlobalCategory: async (id: string, payload: { name?: string; description?: string; icon?: string; color?: string; isActive?: boolean; allowedExtensions?: string[] }): Promise<{ success: boolean; data: { category: AdminGlobalCategory }; message: string }> => {
    const { data } = await api.patch(`/admin/categories/${id}`, payload)
    return data
  },

  deleteGlobalCategory: async (id: string): Promise<{ success: boolean; data: null; message: string }> => {
    const { data } = await api.delete(`/admin/categories/${id}`)
    return data
  },
}
