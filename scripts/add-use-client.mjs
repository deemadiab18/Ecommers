import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const marker = /^["']use client["'];?\s*\n/;
const needsClient =
  /\b(useState|useEffect|useMemo|useRef|useContext|useReducer|useForm|useWatch|useRouter|usePathname|useParams|useSearchParams|useQuery|useMutation|useInfiniteQuery)\b|from\s+["'][^"']*\/hooks\//;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

const dirs = [
  path.join(root, "src/views"),
  path.join(root, "src/components"),
  path.join(root, "src/context"),
  path.join(root, "src/components/layout/MainLayout.jsx"),
].flatMap((d) => (d.endsWith(".jsx") ? [d] : []));

const targets = new Set();
for (const dir of ["src/views", "src/components", "src/context"]) {
  for (const file of await walk(path.join(root, dir))) targets.add(file);
}
targets.add(path.join(root, "src/components/layout/MainLayout.jsx"));

for (const file of targets) {
  let code = await readFile(file, "utf8");
  if (marker.test(code) || !needsClient.test(code)) continue;
  code = `"use client";\n\n${code}`;
  await writeFile(file, code, "utf8");
  console.log("client", path.relative(root, file));
}