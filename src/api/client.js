import axios from "axios";
import { clearSession, readToken } from "../utils/storage";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: (params) => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value == null || value === "") return;
      if (Array.isArray(value)) value.forEach((item) => search.append(key, item));
      else search.append(key, value);
    });
    return search.toString();
  },
});

let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.token = token;
  return config;
});

const AUTH_ATTEMPT = /\/auth\/(signin|signup|forgotPasswords|verifyResetCode|resetPassword)/;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && !AUTH_ATTEMPT.test(url)) {
      clearSession();
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);
