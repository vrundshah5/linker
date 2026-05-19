import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '../../services/auth.service'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: ({ message }) => {
      toast.success(message || 'Reset instructions sent — check your inbox.')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.')
    },
  })
}
