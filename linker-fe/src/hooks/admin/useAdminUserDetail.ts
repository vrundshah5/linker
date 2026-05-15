import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId),
    queryFn: () => adminService.getUserDetail(userId),
    select: (res) => res.data,
    enabled: !!userId,
  })
}
