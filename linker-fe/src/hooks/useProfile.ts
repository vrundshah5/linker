import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { profileService, type UpdateProfilePayload } from '../services/profileService'
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
        localStorage.setItem('user', JSON.stringify({ ...stored, name: user.name, email: user.email }))
      }
      toast.success('Profile saved')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to save profile')
    },
  })
}

export function useSwitchWorkspace() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (type: 'personal' | 'professional') => profileService.switchWorkspace(type),
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
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to switch workspace')
    },
  })
}
