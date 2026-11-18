# FreshCart

E-commerce storefront for [Route Academy](https://ecommerce.routemisr.com), built with **Next.js 15** (App Router), React 18, TanStack Query, Axios, React Hook Form, Zod, and Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env   # already set if you cloned with .env
npm run dev            # Turbopack (recommended)
```

If the site looks unstyled (plain HTML), the dev cache is stale — **stop the server**, then:

```bash
npm run dev:reset
```

Do not run `npm run build` while `npm run dev` is still running; that often breaks CSS in dev until you `dev:reset`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API origin, default `https://ecommerce.routemisr.com` |

Other scripts:

- `npm run build` — production build
- `npm start` — run the production server
- `npm run probe` — hit API endpoints and write `scripts/probe-results.json`

## Features

- Auth (signup, signin, forgot password, change password, `verifyToken` on load)
- Catalog (products, categories, brands, filters, reviews)
- Cart (v1) and wishlist with React Query
- Checkout (cash + Stripe session), order history
- Profile (`updateMe`) and saved addresses
- Responsive layout, toasts, protected/guest routes

## API endpoints used

All paths are relative to `NEXT_PUBLIC_API_BASE_URL`. Protected routes send a `token` header (JWT), not `Authorization`.

### Auth

| Method | Path | Used in app |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | Register |
| POST | `/api/v1/auth/signin` | Login |
| POST | `/api/v1/auth/forgotPasswords` | Forgot password |
| POST | `/api/v1/auth/verifyResetCode` | Forgot password |
| PUT | `/api/v1/auth/resetPassword` | Forgot password |
| GET | `/api/v1/auth/verifyToken` | App bootstrap |

### Users

| Method | Path | Used in app |
|--------|------|-------------|
| PUT | `/api/v1/users/changeMyPassword` | Change password |
| PUT | `/api/v1/users/updateMe/` | Profile |

### Catalog (public)

| Method | Path | Used in app |
|--------|------|-------------|
| GET | `/api/v1/products` | Shop, home, filters |
| GET | `/api/v1/products/:id` | Product details |
| GET | `/api/v1/categories` | Nav, categories |
| GET | `/api/v1/categories/:id` | Category details |
| GET | `/api/v1/categories/:id/subcategories` | Category details |
| GET | `/api/v1/brands` | Brands |
| GET | `/api/v1/brands/:id` | Brand details |
| GET | `/api/v1/subcategories` | Available via API module (not a dedicated page) |
| GET | `/api/v1/subcategories/:id` | Available via API module |

### Reviews

| Method | Path | Used in app |
|--------|------|-------------|
| GET | `/api/v1/products/:productId/reviews` | Product reviews |
| POST | `/api/v1/products/:productId/reviews` | Add review |
| PUT | `/api/v1/reviews/:id` | Edit own review |
| DELETE | `/api/v1/reviews/:id` | Delete own review |

### Cart (v1 default)

| Method | Path | Used in app |
|--------|------|-------------|
| GET | `/api/v1/cart` | Cart, navbar count |
| POST | `/api/v1/cart` | Add to cart |
| PUT | `/api/v1/cart/:productId` | Update quantity |
| DELETE | `/api/v1/cart/:productId` | Remove line |
| DELETE | `/api/v1/cart` | Clear cart |
| PUT | `/api/v2/cart/applyCoupon` | Optional coupon (`COUPON_ENABLED` in `src/api/cart.js`) |

### Wishlist

| Method | Path | Used in app |
|--------|------|-------------|
| GET | `/api/v1/wishlist` | Wishlist, hearts |
| POST | `/api/v1/wishlist` | Save product |
| DELETE | `/api/v1/wishlist/:productId` | Remove |

### Addresses

| Method | Path | Used in app |
|--------|------|-------------|
| GET | `/api/v1/addresses` | Profile, checkout picker |
| POST | `/api/v1/addresses` | Profile |
| DELETE | `/api/v1/addresses/:id` | Profile |
| GET | `/api/v1/addresses/:id` | Implemented in API module only |

### Orders

| Method | Path | Used in app |
|--------|------|-------------|
| POST | `/api/v1/orders/:cartId` | Cash checkout |
| POST | `/api/v1/orders/checkout-session/:cartId?url=` | Stripe checkout |
| GET | `/api/v1/orders/user/:userId` | Order history |

### Not used in the UI

These exist on the API but are not wired to pages:

- `GET /api/v1/orders/` (all orders — admin)
- `GET /api/v1/users` (user list)
- `GET /api/v1/reviews`, `GET /api/v1/reviews/:id` (global review endpoints)

## Probe notes (expected / non-failures)

From `npm run probe` (Nov 2026):

- **`PUT /api/v2/cart/applyCoupon`** with an invalid code returns **400** — route works; UI shows API error on bad coupons.
- **`POST /api/v1/auth/verifyResetCode`** with a bad code returns **400** — handled in forgot-password flow.
- **`POST /api/v1/auth/signin`** with wrong credentials returns **401** — handled on login.
- **`POST /api/v1/auth/signup`** with invalid body returns **400** — handled by Zod + API errors.

### Search quirk

During probing, `GET /api/v1/products?keyword=` returned **0 results** for some sample terms (`"Woman"`, `"milk"`, `"sh"`). The shop search UI still uses the API; try alternate keywords or browse categories if search appears empty.

## Project structure

```
app/            Next.js App Router (routes → src/views)
src/
  api/          Axios services + response notes (shapes.js)
  components/   UI, layout, product, cart, order, profile
  constants/    Store info, nav, static content pages
  context/      Auth
  hooks/        React Query hooks
  views/        Page UI (screens imported by app/*)
  routes/       Auth guards, bootstrap
  utils/        Validation, errors, helpers
scripts/
  probe-api.mjs
```

## License

Educational project — Route Academy E-commerce API.