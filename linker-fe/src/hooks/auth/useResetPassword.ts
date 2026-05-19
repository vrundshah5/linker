import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '../../services/auth.service'

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onSuccess: ({ message }) => {
      toast.success(message || 'Password reset successfully!')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Reset failed. The link may have expired.')
    },
  })
}
