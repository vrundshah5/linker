import { useMutation } from '@tanstack/react-query'
import { authService, type LoginPayload } from '../../services/auth.service'

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token)
    },
  })
}
