import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useToggleBan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => adminService.toggleBan(userId),
    onSuccess: ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
    },
    onError: () => {
      toast.error('Failed to update user status.')
    },
  })
}
