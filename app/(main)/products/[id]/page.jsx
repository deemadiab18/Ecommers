import ProductDetailsPage from "@/views/ProductDetailsPage";
import { isGithubPagesExport, productIds } from "@/lib/staticExportPaths";

export async function generateStaticParams() {
  if (!isGithubPagesExport()) return [];
  const ids = await productIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <ProductDetailsPage />;
}
