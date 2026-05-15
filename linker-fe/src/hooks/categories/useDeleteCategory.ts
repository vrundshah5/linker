import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryService } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
    onError: () => {
      toast.error('Failed to delete category.')
    },
  })
}
