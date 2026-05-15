import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,             // data is always considered stale — refetch on every mount/focus
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

export default queryClient
