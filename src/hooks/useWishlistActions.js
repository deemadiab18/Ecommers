import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "../api/wishlist";
import { addToCart } from "../api/cart";
import { queryKeys } from "../api/queryKeys";
import { useWishlistSummary } from "./useWishlist";
import toast from "react-hot-toast";
import { getApiError } from "../utils/errors";

export function useWishlistProductIds() {
  const { data } = useWishlistSummary();
  return useMemo(() => new Set((data?.items ?? []).map((product) => product._id)), [data]);
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const ids = useWishlistProductIds();

  return useMutation({
    mutationFn: async (productId) => {
      const removing = ids.has(productId);
      if (removing) await removeFromWishlist(productId);
      else await addToWishlist(productId);
      return { removing };
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist() });
      const previous = queryClient.getQueryData(queryKeys.wishlist());
      if (previous) {
        const removing = ids.has(productId);
        queryClient.setQueryData(queryKeys.wishlist(), {
          ...previous,
          count: removing ? Math.max(0, (previous.count ?? 1) - 1) : (previous.count ?? 0) + 1,
          items: removing
            ? (previous.items ?? []).filter((item) => item._id !== productId)
            : [...(previous.items ?? []), { _id: productId }],
        });
      }
      return { previous };
    },
    onSuccess: ({ removing }) => {
      toast.success(removing ? "Removed from wishlist" : "Saved to wishlist");
    },
    onError: (error, _productId, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.wishlist(), context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist() });
      const previous = queryClient.getQueryData(queryKeys.wishlist());
      if (previous) {
        queryClient.setQueryData(queryKeys.wishlist(), {
          ...previous,
          count: Math.max(0, (previous.count ?? 1) - 1),
          items: (previous.items ?? []).filter((item) => item._id !== productId),
        });
      }
      return { previous };
    },
    onSuccess: () => toast.success("Removed from wishlist"),
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.wishlist(), context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() }),
  });
}

export function useMoveWishlistToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      const cart = await addToCart(productId);
      await removeFromWishlist(productId);
      return cart;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(), cart);
      toast.success("Moved to cart");
    },
    onError: (error) => toast.error(getApiError(error).message),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });
    },
  });
}