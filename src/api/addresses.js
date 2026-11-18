import { api } from "./client";

export function getAddresses() {
  return api.get("/api/v1/addresses").then((response) => response.data?.data ?? []);
}

export function getAddress(id) {
  return api.get(`/api/v1/addresses/${id}`).then((response) => response.data);
}

export function addAddress(body) {
  return api.post("/api/v1/addresses", body).then((response) => response.data?.data ?? []);
}

export function removeAddress(id) {
  return api.delete(`/api/v1/addresses/${id}`).then((response) => response.data);
}
