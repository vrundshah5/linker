import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService, type CreateLinkPayload } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useCreateLink(categoryId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => linkService.createLink(payload),
    onSuccess: (_, variables) => {
      const catId = variables.categoryId ?? categoryId ?? ''
      if (catId) queryClient.invalidateQueries({ queryKey: queryKeys.links.byCategory(catId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
  })
}
