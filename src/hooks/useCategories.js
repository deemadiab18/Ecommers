import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { queryKeys } from "../api/queryKeys";

export function useCategories(params = { limit: 12 }) {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: () => getCategories(params),
    staleTime: 5 * 60_000,
  });
}