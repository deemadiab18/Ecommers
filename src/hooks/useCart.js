import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/cart";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";

export function useCartSummary() {
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.cart(),
    queryFn: getCart,
    enabled: status === "authenticated",
    staleTime: 15_000,
  });
}