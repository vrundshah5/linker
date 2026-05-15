import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/admin.service'
import { queryKeys } from '../../constants/queryKeys'

export function useAdminCategories(search?: string) {
  return useQuery({
    queryKey: queryKeys.admin.globalCategories(search),
    queryFn: () => adminService.listGlobalCategories(search),
    select: (res) => res.data.categories,
    placeholderData: (prev) => prev,
  })
}
