const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com").replace(/\/$/, "");

async function fetchPaginated(path) {
  const ids = [];
  let page = 1;
  for (let guard = 0; guard < 50; guard += 1) {
    const url = new URL(`${API_BASE}${path}`);
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) break;
    const json = await response.json();
    const items = json.data ?? [];
    for (const item of items) {
      if (item?.id != null) ids.push(String(item.id));
      if (item?._id != null) ids.push(String(item._id));
    }
    const nextPage = json.metadata?.nextPage;
    if (!nextPage || nextPage === page) break;
    page = nextPage;
  }
  return [...new Set(ids)];
}

export function isGithubPagesExport() {
  return process.env.GITHUB_PAGES === "true";
}

export async function productIds() {
  return fetchPaginated("/api/v1/products");
}

export async function categoryIds() {
  return fetchPaginated("/api/v1/categories");
}

export async function brandIds() {
  return fetchPaginated("/api/v1/brands");
}