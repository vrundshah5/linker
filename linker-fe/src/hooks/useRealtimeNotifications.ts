import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { queryKeys } from '../constants/queryKeys'

/**
 * Subscribes to a user's private Supabase Realtime channel.
 * When the backend broadcasts a new notification, the notifications
 * query cache is invalidated so the UI updates instantly.
 */
export function useRealtimeNotifications(userId: string | undefined) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('broadcast', { event: 'new_notification' }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
      })
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [userId, qc])
}
