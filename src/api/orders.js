import { api } from "./client";

export function createCashOrder(cartId, shippingAddress) {
  return api.post(`/api/v1/orders/${cartId}`, { shippingAddress }).then((response) => response.data?.data);
}

export function createCheckoutSession(cartId, shippingAddress, origin) {
  return api
    .post(`/api/v1/orders/checkout-session/${cartId}`, { shippingAddress }, { params: { url: origin } })
    .then((response) => response.data?.session);
}

export function getUserOrders(userId) {
  return api.get(`/api/v1/orders/user/${userId}`).then((response) => (Array.isArray(response.data) ? response.data : []));
}
