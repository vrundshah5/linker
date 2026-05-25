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
  otp: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  sendOtp: async (email: string): Promise<{ success: boolean; data: null; message: string }> => {
    const { data } = await api.post('/auth/send-otp', { email })
    return data
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload)
    return data
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  googleAuth: async (accessToken: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/google', { accessToken })
    return data
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post<{ success: boolean; data: null; message: string }>(
      '/auth/forgot-password',
      { email },
    )
    return data
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post<{ success: boolean; data: null; message: string }>(
      `/auth/reset-password/${token}`,
      { password },
    )
    return data
  },
}
