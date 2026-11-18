import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/orders";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";

export function useUserOrders() {
  const { user, status } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.orders(userId),
    queryFn: () => getUserOrders(userId),
    enabled: status === "authenticated" && Boolean(userId),
    staleTime: 30_000,
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()),
  });
}