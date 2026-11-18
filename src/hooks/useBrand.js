import { useQuery } from "@tanstack/react-query";
import { getBrand } from "../api/brands";
import { queryKeys } from "../api/queryKeys";

export function useBrand(id) {
  return useQuery({
    queryKey: queryKeys.brand(id),
    queryFn: () => getBrand(id),
    enabled: Boolean(id),
  });
}