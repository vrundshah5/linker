import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoryService } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useDeleteCategory(successMessage = 'Category deleted') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
    onError: () => {
      toast.error('Failed to delete.')
    },
  })
}
