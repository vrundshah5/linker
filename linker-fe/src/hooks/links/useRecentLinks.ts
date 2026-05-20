import { useQuery } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useRecentLinks(limit = 6) {
  return useQuery({
    queryKey: queryKeys.links.recent(),
    queryFn: () => linkService.getRecentLinks(limit),
  })
}
