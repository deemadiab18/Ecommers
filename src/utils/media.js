const PRODUCT_MEDIA = "https://ecommerce.routemisr.com/Route-Academy-products/";

export function resolveMediaUrl(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return PRODUCT_MEDIA + String(src).replace(/^\//, "");
}
