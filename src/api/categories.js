import { api } from "./client";

function page(data) {
  return {
    results: data?.results ?? 0,
    metadata: data?.metadata ?? null,
    items: data?.data ?? [],
  };
}

export function getCategories(params) {
  return api.get("/api/v1/categories", { params }).then((response) => page(response.data));
}

export function getCategory(id) {
  return api.get(`/api/v1/categories/${id}`).then((response) => response.data.data);
}

export function getCategorySubcategories(id) {
  return api.get(`/api/v1/categories/${id}/subcategories`).then((response) => page(response.data));
}
