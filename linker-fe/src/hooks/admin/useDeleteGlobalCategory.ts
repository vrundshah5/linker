import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useDeleteGlobalCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteGlobalCategory(id),
    onSuccess: ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
    },
    onError: () => {
      toast.error('Failed to delete category.')
    },
  })
}
