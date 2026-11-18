export function loginHref(returnPath) {
  let path = returnPath;
  if (!path && typeof window !== "undefined") {
    path = `${window.location.pathname}${window.location.search}`;
  }
  if (!path || path.startsWith("/login") || path.startsWith("/register")) {
    return "/login";
  }
  return `/login?from=${encodeURIComponent(path)}`;
}