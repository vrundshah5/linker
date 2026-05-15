import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { onboardService } from '../../services/onboard.service'

export function useSelectWorkspaceType() {
  return useMutation({
    mutationFn: (workspaceType: 'personal' | 'professional') =>
      onboardService.selectWorkspaceType(workspaceType),
    onSuccess: ({ data }) => {
      const stored = localStorage.getItem('user')
      if (stored) {
        const user = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({ ...user, workspaceType: data.user.workspaceType }))
      }
    },
    onError: () => {
      toast.error('Failed to save workspace type. Please try again.')
    },
  })
}
