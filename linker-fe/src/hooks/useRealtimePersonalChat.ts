import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { queryKeys } from '../constants/queryKeys'

/**
 * Subscribes to live personal chat messages for the current user.
 * Invalidates conversations + thread queries when a new message arrives.
 */
export function useRealtimePersonalChat(userId: string | undefined) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`personal-chat:${userId}`)
      .on('broadcast', { event: 'new_personal_message' }, (payload) => {
        qc.invalidateQueries({ queryKey: queryKeys.messages.conversations() })
        // Also refresh the open thread if it matches the sender
        const fromUserId = payload?.payload?.fromUserId as string | undefined
        if (fromUserId) {
          qc.invalidateQueries({ queryKey: queryKeys.messages.thread(fromUserId) })
        }
      })
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [userId, qc])
}
