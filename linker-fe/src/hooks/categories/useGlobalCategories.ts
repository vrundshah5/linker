import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../../services/categoryService'
import { queryKeys } from '../../constants/queryKeys'

export function useGlobalCategories() {
  return useQuery({
    queryKey: queryKeys.categories.global(),
    queryFn: () => categoryService.getGlobalCategories(),
    select: (res) => res.data.categories,
    staleTime: 5 * 60 * 1000, // global categories rarely change
  })
}
