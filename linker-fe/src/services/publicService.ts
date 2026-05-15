import api from '../lib/axios'

export interface PublicLink {
  _id: string
  title: string
  url: string
  description?: string
}

export interface PublicCollection {
  user: { _id: string; name: string }
  links: PublicLink[]
}

export const publicService = {
  getFavorites: async (userId: string): Promise<PublicCollection> => {
    const res = await api.get<{ success: boolean; data: PublicCollection }>(`/public/${userId}/favorites`)
    return res.data.data
  },
}
