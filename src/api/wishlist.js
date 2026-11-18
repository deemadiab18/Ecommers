import { api } from "./client";

export async function getWishlist() {
  try {
    const { data } = await api.get("/api/v1/wishlist");
    const items = Array.isArray(data?.data) ? data.data : [];
    return { count: data?.count ?? items.length, items };
  } catch (error) {
    if (error.response?.status === 404) return { count: 0, items: [] };
    throw error;
  }
}

export function addToWishlist(productId) {
  return api.post("/api/v1/wishlist", { productId }).then((response) => response.data);
}

export function removeFromWishlist(productId) {
  return api.delete(`/api/v1/wishlist/${productId}`).then((response) => response.data);
}
