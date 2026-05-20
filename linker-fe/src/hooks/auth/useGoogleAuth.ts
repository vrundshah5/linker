import { useGoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../../services/auth.service'

function useGoogleAuthMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credential: string) => authService.googleAuth(credential),
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      const { role, onboardingComplete, workspaceType } = data.user
      if (role === 'admin') {
        navigate('/admin/overview')
      } else if (!onboardingComplete) {
        navigate('/onboard')
      } else if (workspaceType === 'professional') {
        navigate('/professional-dashboard')
      } else {
        navigate('/dashboard')
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Google sign-in failed. Please try again.')
    },
  })
}

export function useGoogleAuth() {
  const mutation = useGoogleAuthMutation()

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      mutation.mutate(tokenResponse.access_token)
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed.')
    },
  })

  return {
    triggerGoogleLogin,
    isPending: mutation.isPending,
  }
}
