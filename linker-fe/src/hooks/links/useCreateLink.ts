import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService, type CreateLinkPayload } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useCreateLink(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => linkService.createLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.byCategory(categoryId) })
      // Also refresh category list so linkCount updates
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
  })
}
