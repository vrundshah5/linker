import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { queryKeys } from '../constants/queryKeys'

/**
 * Subscribes to live buzz and mention events for the current user.
 * Invalidates the unread counts + detail queries on new events.
 */
export function useRealtimeMentionBuzz(userId: string | undefined) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`buzz-mention:${userId}`)
      .on('broadcast', { event: 'new_buzz' }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.unread() })
        qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.buzzes() })
      })
      .on('broadcast', { event: 'new_mention' }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.unread() })
        qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.mentions() })
      })
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [userId, qc])
}
