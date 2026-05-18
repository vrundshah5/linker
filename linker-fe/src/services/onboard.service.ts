import api from '../lib/axios'
import type { AuthUser } from './auth.service'

interface OnboardResponse {
  success: boolean
  data: { user: AuthUser }
  message: string
}

export const onboardService = {
  selectWorkspaceType: async (workspaceType: 'personal' | 'professional'): Promise<OnboardResponse> => {
    const { data } = await api.patch<OnboardResponse>('/onboard/workspace-type', { workspaceType })
    return data
  },

  completePersonal: async (categories: string[]): Promise<OnboardResponse> => {
    const { data } = await api.patch<OnboardResponse>('/onboard/personal', { categories })
    return data
  },

  completeProfessional: async (payload: {
    projectName?: string
    projectDescription?: string
    invitedEmails?: string[]
    resources?: string[]
  }): Promise<OnboardResponse> => {
    const { data } = await api.patch<OnboardResponse>('/onboard/professional', payload)
    return data
  },
}
