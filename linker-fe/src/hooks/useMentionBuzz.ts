import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import mentionBuzzService from '../services/mentionBuzzService'
import { queryKeys } from '../constants/queryKeys'

export function useMentionBuzzUnread() {
  return useQuery({
    queryKey: queryKeys.mentionBuzz.unread(),
    queryFn: mentionBuzzService.getUnreadCounts,
    select: (res) => res.data,
    refetchInterval: 30_000,
  })
}

export function useMentions() {
  return useQuery({
    queryKey: queryKeys.mentionBuzz.mentions(),
    queryFn: mentionBuzzService.getMentions,
    select: (res) => res.data,
  })
}

export function useBuzzes() {
  return useQuery({
    queryKey: queryKeys.mentionBuzz.buzzes(),
    queryFn: mentionBuzzService.getBuzzes,
    select: (res) => res.data,
  })
}

export function useBuzzContacts() {
  return useQuery({
    queryKey: queryKeys.mentionBuzz.contacts(),
    queryFn: mentionBuzzService.getContacts,
    select: (res) => res.data,
  })
}

export function useMarkMentionsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: mentionBuzzService.markMentionsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.unread() })
      qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.mentions() })
    },
  })
}

export function useMarkBuzzesRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: mentionBuzzService.markBuzzesRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.unread() })
      qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.buzzes() })
    },
  })
}

export function useSendBuzz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (toUserId: string) => mentionBuzzService.sendBuzz(toUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentionBuzz.buzzes() })
    },
  })
}
