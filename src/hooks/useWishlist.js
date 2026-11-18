import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../api/wishlist";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";

export function useWishlistSummary() {
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.wishlist(),
    queryFn: getWishlist,
    enabled: status === "authenticated",
    staleTime: 15_000,
  });
}