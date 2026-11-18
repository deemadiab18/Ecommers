import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";
import { queryKeys } from "../api/queryKeys";

export function useProducts(params, options = {}) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    staleTime: 60_000,
    ...options,
  });
}