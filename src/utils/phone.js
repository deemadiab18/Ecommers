export function toEgyptianPhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length === 12) return `0${digits.slice(2)}`;
  if (/^1[0125]\d{8}$/.test(digits)) return `0${digits}`;
  return digits;
}

export function isEgyptianPhone(input) {
  return /^01[0125]\d{8}$/.test(toEgyptianPhone(input));
}
