import { api } from "./client";

function page(data) {
  return {
    results: data?.results ?? 0,
    metadata: {
      currentPage: data?.metadata?.currentPage ?? 1,
      numberOfPages: data?.metadata?.numberOfPages ?? 0,
      limit: data?.metadata?.limit ?? 40,
      nextPage: data?.metadata?.nextPage ?? null,
    },
    items: data?.data ?? [],
  };
}

export function getProducts(params) {
  return api.get("/api/v1/products", { params }).then((response) => page(response.data));
}

export function getProduct(id) {
  return api.get(`/api/v1/products/${id}`).then((response) => response.data.data);
}
