import { useQuery } from '@tanstack/react-query'
import { linkService } from '../../services/linkService'
import { queryKeys } from '../../constants/queryKeys'

export function useArchivedLinks() {
  return useQuery({
    queryKey: queryKeys.links.archived(),
    queryFn: () => linkService.getArchivedLinks(),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: 2_000, // poll every 2s so extension-saved links appear quickly
  })
}
