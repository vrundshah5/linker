import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
    },
    onError: () => {
      toast.error('Failed to delete user.')
    },
  })
}
