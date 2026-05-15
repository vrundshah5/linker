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
}
