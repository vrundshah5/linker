import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useMyCategories(context?: 'personal' | 'professional') {
  return useQuery({
    queryKey: context ? queryKeys.categories.mineByContext(context) : queryKeys.categories.mine(),
    queryFn: () => categoryService.getMyCategories(context),
    select: (res) => res.data.categories,
  })
}
