import { api } from "./client";

/**
 * Cart reads and writes stay on v1.
 * Coupons only exist on v2 (`PUT /api/v2/cart/applyCoupon`). A bad code returns
 * 400 "Coupon is invalid or has expired", so the route is live and the field stays.
 * v1 and v2 read the same cart document; do not switch the rest of the cart to v2.
 */
export const CART_VERSION = "v1";
export const COUPON_ENABLED = true;

export function normalizeCart(data) {
  const lines = data?.data?.products ?? [];
  return {
    numOfCartItems: data?.numOfCartItems ?? lines.length ?? 0,
    cartId: data?.cartId ?? data?.data?._id ?? null,
    totalCartPrice: data?.data?.totalCartPrice ?? 0,
    products: lines.map((line) => ({
      _id: line._id,
      count: line.count,
      price: line.price,
      product: typeof line.product === "string" ? { _id: line.product } : line.product,
    })),
  };
}

const emptyCart = {
  numOfCartItems: 0,
  cartId: null,
  totalCartPrice: 0,
  products: [],
};

export async function getCart() {
  try {
    const { data } = await api.get("/api/v1/cart");
    return normalizeCart(data);
  } catch (error) {
    if (error.response?.status === 404) return emptyCart;
    throw error;
  }
}

export function addToCart(productId) {
  return api.post("/api/v1/cart", { productId }).then((response) => normalizeCart(response.data));
}

export function updateCartItem(productId, count) {
  return api.put(`/api/v1/cart/${productId}`, { count }).then((response) => normalizeCart(response.data));
}

export function removeCartItem(productId) {
  return api.delete(`/api/v1/cart/${productId}`).then((response) => normalizeCart(response.data));
}

export function clearCart() {
  return api.delete("/api/v1/cart").then((response) => response.data);
}

export function applyCoupon(couponName) {
  return api.put("/api/v2/cart/applyCoupon", { couponName }).then((response) => normalizeCart(response.data));
}
