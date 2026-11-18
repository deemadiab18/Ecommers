import { api } from "./client";

function page(data) {
  return {
    results: data?.results ?? 0,
    metadata: data?.metadata ?? null,
    items: data?.data ?? [],
  };
}

export function getBrands(params) {
  return api.get("/api/v1/brands", { params }).then((response) => page(response.data));
}

export function getBrand(id) {
  return api.get(`/api/v1/brands/${id}`).then((response) => response.data.data);
}
