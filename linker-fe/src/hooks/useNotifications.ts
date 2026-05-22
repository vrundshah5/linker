import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService, type NotificationContext, type AppNotification } from '../services/notificationService'
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
    onSuccess: (_data, context) => {
      // Immediately update every cached notification list
      qc.setQueriesData<AppNotification[]>(
        { queryKey: queryKeys.notifications.all },
        (old) => {
          if (!old) return old
          return old.map((n) =>
            !context || n.context === context ? { ...n, read: true } : n
          )
        },
      )
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

export function useMarkOneRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markOneRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all })
      const prev = qc.getQueriesData<AppNotification[]>({ queryKey: queryKeys.notifications.all })
      qc.setQueriesData<AppNotification[]>(
        { queryKey: queryKeys.notifications.all },
        (old) => {
          if (!old) return old
          return old.map((n) => (n._id === id ? { ...n, read: true } : n))
        },
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        for (const [key, data] of ctx.prev) qc.setQueryData(key, data)
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all })
      const prev = qc.getQueriesData<AppNotification[]>({ queryKey: queryKeys.notifications.all })
      qc.setQueriesData<AppNotification[]>(
        { queryKey: queryKeys.notifications.all },
        (old) => old?.filter((n) => n._id !== id),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        for (const [key, data] of ctx.prev) qc.setQueryData(key, data)
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}
