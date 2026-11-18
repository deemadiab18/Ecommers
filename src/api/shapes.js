/**
 * Response shapes recorded against https://ecommerce.routemisr.com
 * on 17 Nov 2026. Services parse these shapes, not the prompt's guesses.
 *
 * @typedef {Object} PageMeta
 * @property {number} currentPage
 * @property {number} numberOfPages
 * @property {number} limit
 * @property {number} [nextPage]
 *
 * @typedef {Object} NamedRef
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} [image]
 *
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {number} quantity
 * @property {number} price
 * @property {number} [priceAfterDiscount] Present on discounted products. Sale price; `price` is the original.
 * @property {string} imageCover Full URL on the catalog. Wishlist `images[]` can be bare filenames.
 * @property {string[]} images
 * @property {number} sold
 * @property {number} ratingsAverage
 * @property {number} ratingsQuantity
 * @property {NamedRef} category
 * @property {NamedRef} brand
 * @property {{_id: string, name: string, slug: string, category: string}[]} subcategory
 *
 * Auth
 * - POST /auth/signup -> 201 { message: "success", user: { name, email, role }, token }
 * - POST /auth/signin -> 200 same shape. 401 { statusMsg: "fail", message: "Incorrect email or password" }
 * - Validation errors are a single object, not an array:
 *   400 { message: "fail", errors: { value, msg, param, location } }
 * - Duplicate signup -> 409 { statusMsg: "fail", message: "Account Already Exists" }
 * - Password rule from the API: "must be at least 6 chars". Digits and capitals are not required.
 *   The UI asks for 8 characters including a number, matching the design.
 * - Phone: "accept only egypt phone numbers" (01[0125] + 8 digits).
 * - JWT payload: { id, name, role, iat, exp }. No email. Email is stored from the auth response.
 * - GET /auth/verifyToken -> { message: "verified", decoded: { id, name, role, iat, exp } }
 *   401 { statusMsg, message: "invalid token. Please login to get access" }
 * - POST /auth/forgotPasswords -> { statusMsg: "success", message: "Reset code sent to your email" }
 * - POST /auth/verifyResetCode 400 -> { statusMsg: "fail", message: "Reset code is invalid or has expired" }
 * - PUT /auth/resetPassword before verify -> { statusMsg: "fail", message: "reset code not verified" }
 * - PUT /users/changeMyPassword success -> { message: "success", user, token }
 *   Wrong current password -> errors.param is "password", msg "Incorrect current password"
 *   Password mismatch -> errors.param is "password", msg "Password confirmation is incorrect"
 * - PUT /users/updateMe/ with the user's own current email -> 400 "E-mail already in use"
 *
 * Cart v1
 * - Empty GET -> { status, numOfCartItems: 0, data: { products: [], totalCartPrice: 0 } } and no cartId
 * - POST add -> product field is an id string. GET/PUT populate a partial product object.
 * - DELETE /cart -> { message: "success" }
 * - PUT /api/v2/cart/applyCoupon with an unknown code -> 400 "Coupon is invalid or has expired"
 *   The route itself responds, so the coupon field stays available. GET /api/v2/cart reads the same cart.
 *
 * Wishlist
 * - GET -> { status, count, data: Product[] }
 * - POST/DELETE -> { status, message, data: string[] } product ids
 *
 * Addresses
 * - GET -> { results, status, data: Address[] }
 * - POST -> { status, message, data: Address[] } the full list, not one address
 *
 * Orders
 * - POST /orders/checkout-session/:cartId?url=<origin>
 *   -> { status, session: { url, success_url: origin+"/allorders", cancel_url: origin+"/cart" } }
 * - POST /orders/:cartId (cash) 201 -> { status, data: Order } with cartItems.product as an id
 * - GET /orders/user/:id -> Order[] (not wrapped). cartItems.product is populated.
 *   Order fields: _id, id (numeric), shippingAddress, taxPrice, shippingPrice, totalOrderPrice,
 *   paymentMethodType, isPaid, isDelivered, cartItems, user, createdAt
 *
 * Catalog list envelope: { results, metadata, data: [] }
 * GET /categories/:id/subcategories can return rows whose `category` is a different id.
 * GET /products?keyword= returned 0 results for "Woman", "milk", and "sh" during the probe.
 */

export {};
