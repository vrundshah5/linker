import { useMutation } from '@tanstack/react-query'
import { onboardService } from '../../services/onboard.service'

interface ProfessionalPayload {
  projectName?: string
  projectDescription?: string
  invitedEmails?: string[]
  resources?: string[]
}

export function useCompleteProfessionalOnboard() {
  return useMutation({
    mutationFn: (payload: ProfessionalPayload) => onboardService.completeProfessional(payload),
    onSuccess: ({ data }) => {
      const stored = localStorage.getItem('user')
      if (stored) {
        const user = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({
          ...user,
          onboardingComplete: true,
          workspaceType: data.user.workspaceType ?? 'professional',
          workspaces: data.user.workspaces ?? [...(user.workspaces ?? []), 'professional'],
        }))
      }
      // Toast suppressed — the onboard splash handles the success feedback
    },
    onError: () => {
      // toast suppressed here too; parent can show inline error if needed
    },
  })
}
