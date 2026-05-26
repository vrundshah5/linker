import api from '../lib/axios'

export interface Link {
  _id: string
  userId: string
  categoryId: string
  title: string
  url: string
  description: string
  isFavorite: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ArchivedLink {
  _id: string
  userId: string
  categoryId: {
    _id: string
    name: string
    themeColor: string
    icon: string
  }
  title: string
  url: string
  description: string
  isFavorite: boolean
  isArchived: true
  createdAt: string
  updatedAt: string
}

export interface RecentLink {
  _id: string
  userId: string
  categoryId: {
    _id: string
    name: string
    themeColor: string
    icon: string
  }
  title: string
  url: string
  description: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface LinkStats {
  totalLinks: number
  totalFavorites: number
  totalArchived: number
  daily: { _id: string; count: number }[]
  categoryBreakdown: { _id: string; count: number; name: string; icon: string; themeColor: string }[]
}

export interface CreateLinkPayload {
  categoryId: string
  title: string
  url: string
  description?: string
}

export interface UpdateLinkPayload {
  title?: string
  url?: string
  description?: string
  isFavorite?: boolean
  isArchived?: boolean
}

export const linkService = {
  getLinks: async (categoryId: string): Promise<Link[]> => {
    const { data } = await api.get('/links', { params: { categoryId } })
    return data.data.links
  },

  getArchivedLinks: async (): Promise<ArchivedLink[]> => {
    const { data } = await api.get('/links/archived')
    return data.data.links
  },

  getRecentLinks: async (limit = 6): Promise<RecentLink[]> => {
    const { data } = await api.get('/links/recent', { params: { limit } })
    return data.data.links
  },

  getFavoriteLinks: async (): Promise<RecentLink[]> => {
    const { data } = await api.get('/links/favorites')
    return data.data.links
  },

  getStats: async (days = 30): Promise<LinkStats> => {
    const { data } = await api.get('/links/stats', { params: { days } })
    return data.data
  },

  createLink: async (payload: CreateLinkPayload): Promise<Link> => {
    const { data } = await api.post('/links', payload)
    return data.data.link
  },

  updateLink: async (id: string, payload: UpdateLinkPayload): Promise<Link> => {
    const { data } = await api.patch(`/links/${id}`, payload)
    return data.data.link
  },

  deleteLink: async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`)
  },

  bulkDeleteLinks: async (ids: string[]): Promise<void> => {
    await api.delete('/links/bulk', { data: { ids } })
  },

  importBookmarks: async (items: { folder: string; title: string; url: string }[], context?: 'personal' | 'professional'): Promise<{ categoriesCreated: number; linksImported: number }> => {
    const { data } = await api.post('/links/import', { items, context: context ?? 'personal' })
    return data.data
  },
}
