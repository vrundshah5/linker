import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useUpdateGlobalCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; description?: string; icon?: string; color?: string; isActive?: boolean } }) =>
      adminService.updateGlobalCategory(id, payload),
    onSuccess: ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
    },
    onError: () => {
      toast.error('Failed to update category.')
    },
  })
}
