import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useCreateGlobalCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; description?: string; icon?: string; color?: string; allowedExtensions?: string[] }) =>
      adminService.createGlobalCategory(payload),
    onSuccess: ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
    },
    onError: () => {
      toast.error('Failed to create category.')
    },
  })
}
