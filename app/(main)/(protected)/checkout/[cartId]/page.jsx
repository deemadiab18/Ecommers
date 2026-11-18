import CheckoutPage from "@/views/CheckoutPage";
import { isGithubPagesExport } from "@/lib/staticExportPaths";

export async function generateStaticParams() {
  if (!isGithubPagesExport()) return [];
  return [{ cartId: "__export__" }];
}

export default function Page() {
  return <CheckoutPage />;
}
