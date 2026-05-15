import api from '../lib/axios'

export interface UserProfile {
  _id: string
  name: string
  email: string
  role: string
  phone: string
  location: string
  jobTitle: string
  company: string
  website: string
  bio: string
  workspaceType: 'personal' | 'professional' | null
  hasProfessionalWorkspace: boolean
  onboardingComplete: boolean
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  location?: string
  jobTitle?: string
  company?: string
  website?: string
  bio?: string
}

export const profileService = {
  get: async (): Promise<UserProfile> => {
    const { data } = await api.get<{ success: boolean; data: { user: UserProfile } }>('/profile')
    return data.data.user
  },

  update: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await api.patch<{ success: boolean; data: { user: UserProfile } }>('/profile', payload)
    return data.data.user
  },

  switchWorkspace: async (workspaceType: 'personal' | 'professional'): Promise<UserProfile> => {
    const { data } = await api.patch<{ success: boolean; data: { user: UserProfile } }>(
      '/profile/workspace',
      { workspaceType }
    )
    return data.data.user
  },
}
