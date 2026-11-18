import { useQuery } from "@tanstack/react-query";
import { getCategory, getCategorySubcategories } from "../api/categories";
import { queryKeys } from "../api/queryKeys";

export function useCategory(id) {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => getCategory(id),
    enabled: Boolean(id),
  });
}

export function useCategorySubcategories(id) {
  return useQuery({
    queryKey: queryKeys.subcategories(id),
    queryFn: () => getCategorySubcategories(id),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  });
}