import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestService } from '../services/requestService'
import { queryKeys } from '../constants/queryKeys'

export function useRequests() {
  return useQuery({
    queryKey: queryKeys.requests.all,
    queryFn: requestService.getAll,
  })
}

export function useSendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, note }: { email: string; note?: string }) =>
      requestService.send(email, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.requests.all }),
  })
}

export function useRespondRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'accepted' | 'rejected' }) =>
      requestService.respond(id, action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.requests.all })
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useCancelRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => requestService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.requests.all }),
  })
}
