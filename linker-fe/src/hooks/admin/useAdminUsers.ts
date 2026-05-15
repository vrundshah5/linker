import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useAdminUsers(params: { search?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => adminService.listUsers(params),
    placeholderData: (prev) => prev,
  })
}
