import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supportService, type TicketStatus, type TicketPriority } from '../services/supportService'
import { queryKeys } from '../constants/queryKeys'

export function useMyTickets() {
  return useQuery({
    queryKey: queryKeys.support.mine,
    queryFn: supportService.getMyTickets,
  })
}

export function useSubmitTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description: string; priority: TicketPriority }) =>
      supportService.submit(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.support.mine }),
  })
}

export function useAdminTickets(params?: { status?: string; priority?: string }) {
  return useQuery({
    queryKey: queryKeys.support.admin(params),
    queryFn: () => supportService.adminGetAll(params),
  })
}

export function useAdminUpdateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status?: TicketStatus; adminNote?: string }) =>
      supportService.adminUpdate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.support.all }),
  })
}
