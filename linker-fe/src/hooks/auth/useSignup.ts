import { useMutation } from '@tanstack/react-query'
import { authService, type SignupPayload } from '../../services/auth.service'

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token)
    },
  })
}
