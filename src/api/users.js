import { api } from "./client";

export function changeMyPassword(body) {
  return api.put("/api/v1/users/changeMyPassword", body).then((response) => response.data);
}

/**
 * Sending the account's current email back returns 400 "E-mail already in use".
 * Callers should omit `email` unless it actually changed.
 */
export function updateMe(body) {
  return api.put("/api/v1/users/updateMe/", body).then((response) => response.data);
}
