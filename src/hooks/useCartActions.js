import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  applyCoupon,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";
import { queryKeys } from "../api/queryKeys";
import toast from "react-hot-toast";
import { getApiError } from "../utils/errors";

const emptyCart = {
  numOfCartItems: 0,
  cartId: null,
  totalCartPrice: 0,
  products: [],
};

function setCartCache(queryClient, cart) {
  queryClient.setQueryData(queryKeys.cart(), cart);
}

export function useAddToCartWithCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, count }) => {
      let cart = await addToCart(productId);
      if (count > 1) cart = await updateCartItem(productId, count);
      return cart;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(), cart);
      toast.success("Added to cart");
    },
    onError: (error) => toast.error(getApiError(error).message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => addToCart(productId),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(), cart);
      toast.success("Added to cart");
    },
    onError: (error) => {
      toast.error(getApiError(error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, count }) => updateCartItem(productId, count),
    onMutate: async ({ productId, count }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() });
      const previous = queryClient.getQueryData(queryKeys.cart());
      if (previous) {
        const products = (previous.products ?? []).map((line) => {
          const id = line.product?._id ?? line.product;
          return id === productId ? { ...line, count } : line;
        });
        setCartCache(queryClient, { ...previous, products });
      }
      return { previous };
    },
    onSuccess: (cart) => setCartCache(queryClient, cart),
    onError: (error, _vars, context) => {
      if (context?.previous) setCartCache(queryClient, context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => removeCartItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() });
      const previous = queryClient.getQueryData(queryKeys.cart());
      if (previous) {
        const products = (previous.products ?? []).filter(
          (line) => line.product?._id !== productId && line.product !== productId,
        );
        setCartCache(queryClient, {
          ...previous,
          numOfCartItems: products.length,
          products,
        });
      }
      return { previous };
    },
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
      toast.success("Removed from cart");
    },
    onError: (error, _id, context) => {
      if (context?.previous) setCartCache(queryClient, context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() });
      const previous = queryClient.getQueryData(queryKeys.cart());
      setCartCache(queryClient, emptyCart);
      return { previous };
    },
    onSuccess: () => {
      setCartCache(queryClient, emptyCart);
      toast.success("Cart cleared");
    },
    onError: (error, _vars, context) => {
      if (context?.previous) setCartCache(queryClient, context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (couponName) => applyCoupon(couponName),
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
      toast.success("Coupon applied");
    },
    onError: (error) => toast.error(getApiError(error).message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}