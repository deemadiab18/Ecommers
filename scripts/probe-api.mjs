/**
 * One-off probe of https://ecommerce.routemisr.com
 * Logs status, top-level keys, and a trimmed sample of each response.
 * Writes the full dump to scripts/probe-results.json
 */
const BASE = "https://ecommerce.routemisr.com";
const results = [];

function summarize(data, depth = 0) {
  if (data == null || typeof data !== "object") return data;
  if (Array.isArray(data)) {
    return {
      __arrayLength: data.length,
      sample: data.slice(0, 1).map((item) => summarize(item, depth + 1)),
    };
  }
  if (depth > 3) return "[Object]";
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      out[key] = {
        __arrayLength: value.length,
        sample: value.slice(0, 1).map((item) => summarize(item, depth + 1)),
      };
    } else if (value && typeof value === "object") {
      out[key] = summarize(value, depth + 1);
    } else if (typeof value === "string" && value.length > 180) {
      out[key] = `${value.slice(0, 80)}…(${value.length})`;
    } else {
      out[key] = value;
    }
  }
  return out;
}

async function call(name, path, { method = "GET", body, token, query } = {}) {
  const url = new URL(BASE + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, v));
      else if (value != null) url.searchParams.set(key, value);
    }
  }
  const headers = { "Content-Type": "application/json" };
  if (token) headers.token = token;
  const started = Date.now();
  let status = 0;
  let data = null;
  let errorText = "";
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    status = res.status;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      errorText = text.slice(0, 400);
      data = null;
    }
  } catch (err) {
    errorText = err.message;
  }
  const entry = {
    name,
    method,
    path: url.pathname + url.search,
    status,
    ms: Date.now() - started,
    errorText: errorText || undefined,
    shape: data ? summarize(data) : null,
  };
  results.push(entry);
  console.log(`\n=== ${name} ${method} ${entry.path} -> ${status} (${entry.ms}ms) ===`);
  console.log(JSON.stringify(entry.shape ?? entry.errorText, null, 2));
  return { status, data };
}

const stamp = Date.now();
const email = `freshcart.probe.${stamp}@gmail.com`;
const password = "Probe1234";
const phone = `010${String(stamp).slice(-8)}`;

const products = await call("products", "/api/v1/products", { query: { limit: 2, page: 1 } });
const productId = products.data?.data?.[0]?._id;
if (productId) {
  await call("product by id", `/api/v1/products/${productId}`);
  await call("product reviews", `/api/v1/products/${productId}/reviews`);
}
await call("products sort+price", "/api/v1/products", {
  query: { limit: 1, sort: "-ratingsAverage", "price[gte]": 10, "price[lte]": 500 },
});

const categories = await call("categories", "/api/v1/categories", { query: { limit: 5 } });
const categoryId = categories.data?.data?.[0]?._id;
if (categoryId) {
  await call("category by id", `/api/v1/categories/${categoryId}`);
  await call("category subcategories", `/api/v1/categories/${categoryId}/subcategories`);
  await call("products by category", "/api/v1/products", {
    query: { limit: 1, "category[in]": categoryId },
  });
}
await call("subcategories", "/api/v1/subcategories", { query: { limit: 2 } });

const brands = await call("brands", "/api/v1/brands", { query: { limit: 5, page: 1 } });
const brandId = brands.data?.data?.[0]?._id;
if (brandId) {
  await call("brand by id", `/api/v1/brands/${brandId}`);
  await call("products by brand", "/api/v1/products", { query: { limit: 1, brand: brandId } });
}
await call("reviews list", "/api/v1/reviews", { query: { limit: 1 } });

const signup = await call("signup", "/api/v1/auth/signup", {
  method: "POST",
  body: { name: "Probe User", email, password, rePassword: password, phone },
});

let token = signup.data?.token;
if (!token) {
  const signinFallback = await call("signin after failed signup", "/api/v1/auth/signin", {
    method: "POST",
    body: { email, password },
  });
  token = signinFallback.data?.token;
} else {
  await call("signin", "/api/v1/auth/signin", {
    method: "POST",
    body: { email, password },
  });
}

if (token) {
  const parts = token.split(".");
  const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  console.log("\n=== JWT payload keys ===");
  console.log(JSON.stringify(payload, null, 2));
  results.push({ name: "jwt payload", shape: payload });

  await call("verifyToken", "/api/v1/auth/verifyToken", { token });
  await call("cart get empty", "/api/v1/cart", { token });
  if (productId) {
    await call("cart add", "/api/v1/cart", { method: "POST", token, body: { productId } });
    await call("cart get", "/api/v1/cart", { token });
    await call("cart update count", `/api/v1/cart/${productId}`, {
      method: "PUT",
      token,
      body: { count: 2 },
    });
  }
  await call("wishlist get", "/api/v1/wishlist", { token });
  if (productId) {
    await call("wishlist add", "/api/v1/wishlist", { method: "POST", token, body: { productId } });
    await call("wishlist get after add", "/api/v1/wishlist", { token });
    await call("wishlist remove", `/api/v1/wishlist/${productId}`, { method: "DELETE", token });
  }
  await call("addresses", "/api/v1/addresses", { token });
  await call("address create", "/api/v1/addresses", {
    method: "POST",
    token,
    body: { name: "Home", details: "12 El Tahrir Street, Dokki", phone, city: "Giza" },
  });
  const userId = payload.id || payload._id || payload.userId;
  if (userId) {
    await call("user orders", `/api/v1/orders/user/${userId}`, { token });
  }
  await call("coupon v2", "/api/v2/cart/applyCoupon", {
    method: "PUT",
    token,
    body: { couponName: "FRESH20" },
  });
  await call("cart v2 get", "/api/v2/cart", { token });
  if (productId) {
    await call("cart clear", "/api/v1/cart", { method: "DELETE", token });
  }
  await call("users list", "/api/v1/users", { token });
  await call("updateMe shape only invalid", "/api/v1/users/updateMe/", {
    method: "PUT",
    token,
    body: {},
  });
}

await call("forgotPasswords unknown", "/api/v1/auth/forgotPasswords", {
  method: "POST",
  body: { email },
});
await call("verifyResetCode bad", "/api/v1/auth/verifyResetCode", {
  method: "POST",
  body: { resetCode: "000000" },
});
await call("signin bad", "/api/v1/auth/signin", {
  method: "POST",
  body: { email: "nobody@example.com", password: "Wrong1234" },
});
await call("signup validation", "/api/v1/auth/signup", {
  method: "POST",
  body: { name: "A", email: "bad", password: "short", rePassword: "x", phone: "123" },
});

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        /token/i.test(key) ? "[redacted]" : redact(item),
      ]),
    );
  }
  if (typeof value === "string" && value.startsWith("eyJ")) return "[redacted jwt]";
  return value;
}

const fs = await import("node:fs");
fs.writeFileSync(
  new URL("./probe-results.json", import.meta.url),
  JSON.stringify({ email, phone, probedAt: new Date().toISOString(), results: redact(results) }, null, 2),
);
console.log("\nWrote scripts/probe-results.json");
