import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { queryKeys } from '../constants/queryKeys'

/**
 * Subscribes to live project chat messages.
 * Invalidates the messages query whenever a new message is broadcast.
 */
export function useRealtimeProjectChat(projectId: string | undefined) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!supabase || !projectId) return

    const channel = supabase
      .channel(`project-chat:${projectId}`)
      .on('broadcast', { event: 'new_project_message' }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.projects.messages(projectId) })
      })
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [projectId, qc])
}
