import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useDeleteLink(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => linkService.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.byCategory(categoryId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
  })
}
