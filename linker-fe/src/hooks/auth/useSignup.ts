import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService, type SignupPayload } from '../../services/auth.service'

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: ({ data, message }) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success(message || 'Account created successfully!')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Signup failed. Please try again.')
    },
  })
}
