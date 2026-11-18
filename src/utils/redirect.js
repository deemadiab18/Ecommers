export function resolveReturnPath(locationState, fallback = "/") {
  const from = locationState?.from;
  if (!from) return fallback;
  const path =
    typeof from === "string"
      ? from
      : `${from.pathname || ""}${from.search || ""}${from.hash || ""}`;
  if (!path || path.startsWith("/login") || path.startsWith("/register")) return fallback;
  return path;
}