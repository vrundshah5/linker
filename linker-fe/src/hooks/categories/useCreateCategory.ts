import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoryService, type CreateCategoryPayload } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoryService.createCategory(payload),
    onSuccess: ({ data }) => {
      toast.success(`"${data.category.name}" created!`)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
    onError: () => {
      toast.error('Failed to create category. Please try again.')
    },
  })
}
