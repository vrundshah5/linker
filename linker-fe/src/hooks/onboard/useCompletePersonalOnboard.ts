import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { onboardService } from '../../services/onboard.service'

export function useCompletePersonalOnboard() {
  return useMutation({
    mutationFn: (categories: string[]) => onboardService.completePersonal(categories),
    onSuccess: ({ data }) => {
      const stored = localStorage.getItem('user')
      if (stored) {
        const user = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({
          ...user,
          onboardingComplete: true,
          workspaceType: data.user.workspaceType ?? 'personal',
          workspaces: data.user.workspaces ?? [...(user.workspaces ?? []), 'personal'],
        }))
      }
      toast.success(data.user.name ? `Welcome, ${data.user.name.split(' ')[0]}!` : 'Onboarding complete!')
    },
    onError: () => {
      toast.error('Failed to complete onboarding. Please try again.')
    },
  })
}
