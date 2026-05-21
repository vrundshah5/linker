import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { profileService, type UpdateProfilePayload } from '../services/profileService'
import type { ChangePasswordPayload } from '../services/profileService'
import { queryKeys } from '../constants/queryKeys'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: profileService.get,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.update(payload),
    onSuccess: (user) => {
      qc.setQueryData(queryKeys.profile.me, user)
      // Keep localStorage in sync
      const raw = localStorage.getItem('user')
      if (raw) {
        const stored = JSON.parse(raw)
        localStorage.setItem('user', JSON.stringify({ ...stored, name: user.name, email: user.email, avatar: user.avatar }))
      }
      toast.success('Profile saved')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to save profile')
    },
  })
}

const SPLASH_MIN_MS = 1200

export function useSwitchWorkspace() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [switchTarget, setSwitchTarget] = useState<'personal' | 'professional' | null>(null)

  const mutation = useMutation({
    mutationFn: async (type: 'personal' | 'professional') => {
      setSwitchTarget(type)
      const [result] = await Promise.all([
        profileService.switchWorkspace(type),
        new Promise((r) => setTimeout(r, SPLASH_MIN_MS)),
      ])
      return result
    },
    onSuccess: (user) => {
      qc.setQueryData(queryKeys.profile.me, user)
      const raw = localStorage.getItem('user')
      if (raw) {
        const stored = JSON.parse(raw)
        localStorage.setItem(
          'user',
          JSON.stringify({ ...stored, workspaceType: user.workspaceType, workspaces: user.workspaces })
        )
      }
      if (user.workspaceType === 'professional') {
        navigate('/professional-dashboard')
      } else {
        navigate('/dashboard')
      }
      setSwitchTarget(null)
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setSwitchTarget(null)
      toast.error(err?.response?.data?.message || 'Failed to switch workspace')
    },
  })

  return { mutate: mutation.mutate, isPending: mutation.isPending, switchTarget }
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileService.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    },
  })
}
