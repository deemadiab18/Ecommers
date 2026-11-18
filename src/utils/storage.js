const TOKEN_KEY = "freshcart_token";
const USER_KEY = "freshcart_user";
export const REMEMBER_EMAIL_KEY = "freshcart_remember_email";
export const RESET_FLOW_KEY = "freshcart_reset_flow";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readToken() {
  if (!canUseStorage()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function readUser() {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(token, user) {
  if (!canUseStorage()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}