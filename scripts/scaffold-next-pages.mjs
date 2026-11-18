import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const routes = [
  ["app/(main)/products/page.jsx", "@/views/ProductsPage"],
  ["app/(main)/products/[id]/page.jsx", "@/views/ProductDetailsPage"],
  ["app/(main)/brands/page.jsx", "@/views/BrandsPage"],
  ["app/(main)/brands/[id]/page.jsx", "@/views/BrandDetailsPage"],
  ["app/(main)/categories/page.jsx", "@/views/CategoriesPage"],
  ["app/(main)/categories/[id]/page.jsx", "@/views/CategoryDetailsPage"],
  ["app/(main)/contact/page.jsx", "@/views/InfoPage"],
  ["app/(main)/faqs/page.jsx", "@/views/InfoPage"],
  ["app/(main)/shipping/page.jsx", "@/views/InfoPage"],
  ["app/(main)/privacy/page.jsx", "@/views/InfoPage"],
  ["app/(main)/terms/page.jsx", "@/views/InfoPage"],
  ["app/(main)/(protected)/cart/page.jsx", "@/views/CartPage"],
  ["app/(main)/(protected)/wishlist/page.jsx", "@/views/WishlistPage"],
  ["app/(main)/(protected)/checkout/[cartId]/page.jsx", "@/views/CheckoutPage"],
  ["app/(main)/(protected)/profile/page.jsx", "@/views/ProfilePage"],
  ["app/(main)/(protected)/allorders/page.jsx", "@/views/OrdersPage"],
  ["app/(main)/(protected)/profile/orders/page.jsx", "@/views/OrdersPage"],
  ["app/(main)/(protected)/change-password/page.jsx", "@/views/auth/ChangePasswordPage"],
  ["app/(auth)/login/page.jsx", "@/views/auth/LoginPage"],
  ["app/(auth)/register/page.jsx", "@/views/auth/RegisterPage"],
  ["app/(auth)/forgot-password/page.jsx", "@/views/auth/ForgotPasswordPage"],
];

for (const [file, importPath] of routes) {
  const dir = path.dirname(path.join(root, file));
  await mkdir(dir, { recursive: true });
  const component = importPath.split("/").pop();
  const body = `import ${component} from "${importPath}";\n\nexport default function Page() {\n  return <${component} />;\n}\n`;
  await writeFile(path.join(root, file), body, "utf8");
}