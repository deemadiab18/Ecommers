import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../api/brands";
import { queryKeys } from "../api/queryKeys";

export function useBrands(params = { limit: 10, page: 1 }) {
  return useQuery({
    queryKey: queryKeys.brands(params),
    queryFn: () => getBrands(params),
    staleTime: 5 * 60_000,
  });
}