import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService, type LoginPayload } from '../../services/auth.service'

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data, message }) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success(message || 'Logged in successfully!')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.')
    },
  })
}
