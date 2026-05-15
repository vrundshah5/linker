import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageService } from '../services/messageService'
import { queryKeys } from '../constants/queryKeys'

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: messageService.getConversations,
  })
}

export function useMessages(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.messages.thread(userId ?? ''),
    queryFn: () => messageService.getMessages(userId!),
    enabled: !!userId,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, content }: { userId: string; content: string }) =>
      messageService.send(userId, content),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.thread(userId) })
      qc.invalidateQueries({ queryKey: queryKeys.messages.conversations() })
    },
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => messageService.markRead(userId),
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.thread(userId) })
      qc.invalidateQueries({ queryKey: queryKeys.messages.conversations() })
    },
  })
}
