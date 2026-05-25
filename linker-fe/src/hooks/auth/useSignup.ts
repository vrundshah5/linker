import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService, type SignupPayload } from '../../services/auth.service'

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Signup failed. Please try again.')
    },
  })
}
