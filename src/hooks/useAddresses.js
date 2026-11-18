import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../api/addresses";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";

export function useAddresses() {
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.addresses(),
    queryFn: getAddresses,
    enabled: status === "authenticated",
    staleTime: 60_000,
  });
}