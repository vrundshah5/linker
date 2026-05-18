import api from '../lib/axios'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  onboardingComplete: boolean
  workspaceType: 'personal' | 'professional' | null
  workspaces: string[]
}

export interface AuthResponse {
  success: boolean
  data: { token: string; user: AuthUser }
  message: string
}

export interface SignupPayload {
  fullName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload)
    return data
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },
}
