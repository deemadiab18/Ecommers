export const queryKeys = {
  categories: (params) => ["categories", params],
  products: (params) => ["products", params],
  product: (id) => ["product", id],
  brands: (params) => ["brands", params],
  brand: (id) => ["brand", id],
  category: (id) => ["category", id],
  subcategories: (categoryId) => ["subcategories", categoryId],
  reviews: (productId, params) => ["reviews", productId, params],
  cart: () => ["cart"],
  wishlist: () => ["wishlist"],
  addresses: () => ["addresses"],
  orders: (userId) => ["orders", userId],
};