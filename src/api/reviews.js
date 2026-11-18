import { api } from "./client";

export function getProductReviews(productId, params) {
  return api.get(`/api/v1/products/${productId}/reviews`, { params }).then((response) => ({
    results: response.data?.results ?? 0,
    metadata: response.data?.metadata ?? null,
    items: response.data?.data ?? [],
  }));
}

export function addProductReview(productId, body) {
  return api.post(`/api/v1/products/${productId}/reviews`, body).then((response) => response.data);
}

export function updateReview(id, body) {
  return api.put(`/api/v1/reviews/${id}`, body).then((response) => response.data);
}

export function deleteReview(id) {
  return api.delete(`/api/v1/reviews/${id}`).then((response) => response.data);
}
