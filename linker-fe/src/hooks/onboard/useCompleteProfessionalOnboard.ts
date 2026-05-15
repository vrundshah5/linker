import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { onboardService } from '../../services/onboard.service'

interface ProfessionalPayload {
  projectName: string
  projectDescription?: string
  invitedEmails: string[]
  resources: string[]
}

export function useCompleteProfessionalOnboard() {
  return useMutation({
    mutationFn: (payload: ProfessionalPayload) => onboardService.completeProfessional(payload),
    onSuccess: ({ data }) => {
      const stored = localStorage.getItem('user')
      if (stored) {
        const user = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({ ...user, onboardingComplete: true, workspaceType: 'professional' }))
      }
      toast.success(data.user.name ? `Welcome, ${data.user.name.split(' ')[0]}!` : 'Onboarding complete!')
    },
    onError: () => {
      toast.error('Failed to complete onboarding. Please try again.')
    },
  })
}
