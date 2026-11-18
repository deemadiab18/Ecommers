import BrandDetailsPage from "@/views/BrandDetailsPage";
import { brandIds, isGithubPagesExport } from "@/lib/staticExportPaths";

export async function generateStaticParams() {
  if (!isGithubPagesExport()) return [];
  const ids = await brandIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <BrandDetailsPage />;
}
