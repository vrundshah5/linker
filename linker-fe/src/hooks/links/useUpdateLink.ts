import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService, type UpdateLinkPayload } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useUpdateLink(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLinkPayload }) =>
      linkService.updateLink(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.byCategory(categoryId) })
    },
  })
}
