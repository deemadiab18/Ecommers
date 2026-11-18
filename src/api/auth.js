import { api } from "./client";

export function signUp(body) {
  return api.post("/api/v1/auth/signup", body).then((response) => response.data);
}

export function signIn(body) {
  return api.post("/api/v1/auth/signin", body).then((response) => response.data);
}

export function forgotPassword(email) {
  return api.post("/api/v1/auth/forgotPasswords", { email }).then((response) => response.data);
}

export function verifyResetCode(resetCode) {
  return api.post("/api/v1/auth/verifyResetCode", { resetCode }).then((response) => response.data);
}

export function resetPassword(body) {
  return api.put("/api/v1/auth/resetPassword", body).then((response) => response.data);
}

export function verifyToken() {
  return api.get("/api/v1/auth/verifyToken").then((response) => response.data);
}
