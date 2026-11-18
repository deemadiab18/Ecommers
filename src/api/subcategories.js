import { api } from "./client";

export function getSubcategories(params) {
  return api.get("/api/v1/subcategories", { params }).then((response) => ({
    results: response.data?.results ?? 0,
    metadata: response.data?.metadata ?? null,
    items: response.data?.data ?? [],
  }));
}

export function getSubcategory(id) {
  return api.get(`/api/v1/subcategories/${id}`).then((response) => response.data.data);
}
