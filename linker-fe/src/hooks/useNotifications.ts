import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService, type NotificationContext } from '../services/notificationService'
import { queryKeys } from '../constants/queryKeys'

export function useNotifications(context?: NotificationContext) {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, context ?? 'all'],
    queryFn: () => notificationService.getAll(context),
    refetchInterval: 30_000, // poll every 30s
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (context?: NotificationContext) => notificationService.markAllRead(context),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

export function useMarkOneRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markOneRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}
