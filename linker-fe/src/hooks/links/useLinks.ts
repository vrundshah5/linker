import { useQuery } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useLinks(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.links.byCategory(categoryId),
    queryFn: () => linkService.getLinks(categoryId),
    enabled: Boolean(categoryId),
  })
}
