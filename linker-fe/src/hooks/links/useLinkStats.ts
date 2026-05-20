import { useQuery } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useLinkStats(days = 30) {
  return useQuery({
    queryKey: queryKeys.links.stats(days),
    queryFn: () => linkService.getStats(days),
  })
}
