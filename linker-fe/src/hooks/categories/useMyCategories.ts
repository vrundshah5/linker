import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useMyCategories() {
  return useQuery({
    queryKey: queryKeys.categories.mine(),
    queryFn: () => categoryService.getMyCategories(),
    select: (res) => res.data.categories,
  })
}
