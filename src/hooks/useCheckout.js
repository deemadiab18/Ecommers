import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCashOrder, createCheckoutSession } from "../api/orders";
import { queryKeys } from "../api/queryKeys";
import toast from "react-hot-toast";
import { getApiError } from "../utils/errors";

const emptyCart = {
  numOfCartItems: 0,
  cartId: null,
  totalCartPrice: 0,
  products: [],
};

export function usePlaceCashOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartId, shippingAddress }) => createCashOrder(cartId, shippingAddress),
    onSuccess: (_order, variables) => {
      queryClient.setQueryData(queryKeys.cart(), emptyCart);
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders(variables.userId) });
      }
    },
    onError: (error) => toast.error(getApiError(error).message),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

export function useStartOnlineCheckout() {
  return useMutation({
    mutationFn: ({ cartId, shippingAddress }) =>
      createCheckoutSession(cartId, shippingAddress, window.location.origin),
    onError: (error) => toast.error(getApiError(error).message),
  });
}