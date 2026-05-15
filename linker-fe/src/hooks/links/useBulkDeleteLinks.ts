import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useBulkDeleteLinks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => linkService.bulkDeleteLinks(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.archived() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.mine() })
    },
  })
}
