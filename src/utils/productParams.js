export const PRODUCT_PAGE_SIZE = 12;

export const PRODUCT_SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "-createdAt", label: "Newest" },
  { value: "-ratingsAverage", label: "Top rated" },
  { value: "-sold", label: "Best sellers" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
];

export function readProductFilters(searchParams) {
  const empty = {
    keyword: "",
    sort: "",
    category: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    page: 1,
  };
  if (!searchParams || typeof searchParams.get !== "function") return empty;
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    sort: searchParams.get("sort") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
  };
}

export function toProductApiParams(filters, overrides = {}) {
  const page = overrides.page ?? filters.page;
  const params = {
    limit: PRODUCT_PAGE_SIZE,
    page,
    ...overrides,
  };
  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.sort) params.sort = filters.sort;
  if (filters.brand) params.brand = filters.brand;
  if (filters.category) params["category[in]"] = filters.category;
  if (filters.priceMin) params["price[gte]"] = filters.priceMin;
  if (filters.priceMax) params["price[lte]"] = filters.priceMax;
  return params;
}

export function applyFilterPatch(searchParams, patch) {
  const next = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(patch)) {
    if (value === "" || value == null) next.delete(key);
    else if (key === "page" && Number(value) <= 1) next.delete(key);
    else next.set(key, String(value));
  }
  return next;
}