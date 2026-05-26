import api from '../lib/axios'

export interface GlobalCategory {
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

export interface UserCategory {
  _id: string
  userId: string
  name: string
  description: string
  themeColor: string
  icon: string
  isGlobal: boolean
  globalCategoryId: string | null
  linkCount: number
  context: 'personal' | 'professional'
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryPayload {
  name: string
  description?: string
  themeColor?: string
  icon?: string
  context?: 'personal' | 'professional'
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string
  themeColor?: string
}

export const categoryService = {
  getGlobalCategories: async (): Promise<{ data: { categories: GlobalCategory[] } }> => {
    const { data } = await api.get('/categories/global')
    return data
  },

  getMyCategories: async (context?: 'personal' | 'professional'): Promise<{ data: { categories: UserCategory[] } }> => {
    const params = context ? { context } : {}
    const { data } = await api.get('/categories', { params })
    return data
  },

  createCategory: async (payload: CreateCategoryPayload): Promise<{ data: { category: UserCategory } }> => {
    const { data } = await api.post('/categories', payload)
    return data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },

  updateCategory: async (id: string, payload: UpdateCategoryPayload): Promise<{ data: { category: UserCategory } }> => {
    const { data } = await api.patch(`/categories/${id}`, payload)
    return data
  },
}
