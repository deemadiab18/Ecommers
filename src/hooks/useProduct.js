import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api/products";
import { queryKeys } from "../api/queryKeys";

export function useProduct(id) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}