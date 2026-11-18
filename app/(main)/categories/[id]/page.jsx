import CategoryDetailsPage from "@/views/CategoryDetailsPage";
import { categoryIds, isGithubPagesExport } from "@/lib/staticExportPaths";

export async function generateStaticParams() {
  if (!isGithubPagesExport()) return [];
  const ids = await categoryIds();
  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <CategoryDetailsPage />;
}
