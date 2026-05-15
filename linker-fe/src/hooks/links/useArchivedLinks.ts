import { useQuery } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useArchivedLinks() {
  return useQuery({
    queryKey: queryKeys.links.archived(),
    queryFn: () => linkService.getArchivedLinks(),
    // Always fetch fresh data when the page is opened, and poll every 8s
    // so links saved by the extension appear without a manual refresh.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: 8_000,
  })
}
