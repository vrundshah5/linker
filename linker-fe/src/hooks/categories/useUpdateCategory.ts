import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoryService, type UpdateCategoryPayload } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: ({ data }) => {
      toast.success(`"${data.category.name}" updated!`)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
    onError: () => {
      toast.error('Failed to update category.')
    },
  })
}
