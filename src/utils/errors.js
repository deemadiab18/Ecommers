export function getApiError(error) {
  const data = error?.response?.data;
  if (!data) {
    if (error?.code === "ERR_NETWORK") return { message: "Check your connection and try again.", field: null };
    return { message: "Something went wrong. Please try again.", field: null };
  }
  const raw = data.errors;
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (first?.msg) return { message: String(first.msg).trim(), field: first.param || null };
  if (typeof data.message === "string" && data.message !== "fail" && data.message !== "success") {
    return { message: data.message, field: null };
  }
  if (typeof data.statusMsg === "string" && data.statusMsg === "fail" && typeof data.message === "string") {
    return { message: data.message, field: null };
  }
  return { message: "Something went wrong. Please try again.", field: null };
}

export function applyApiError(error, setError, setFormError) {
  const parsed = getApiError(error);
  let field = parsed.field;
  if (/already exists/i.test(parsed.message)) field = "email";
  if (field === "password" && /current password/i.test(parsed.message)) field = "currentPassword";
  if (field === "password" && /confirmation/i.test(parsed.message)) field = "rePassword";
  if (field === "email" && /already exists/i.test(parsed.message)) {
    setError?.("email", { type: "server", message: "An account with this email already exists." });
    return parsed;
  }
  if (field && setError) {
    setError(field, { type: "server", message: parsed.message });
    return parsed;
  }
  setFormError?.(parsed.message);
  return parsed;
}
