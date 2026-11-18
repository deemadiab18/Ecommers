import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const clientMark = /^["']use client["']/;
const hookImport = /from\s+["'][^"']*\/hooks\//;
const hookCall =
  /\b(useState|useEffect|useMemo|useRef|useContext|useQuery|useMutation|useRouter|usePathname|useParams|useSearchParams|useForm)\b/;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

const issues = [];
for (const dir of ["src/views", "src/components", "app"]) {
  const base = path.join(root, dir);
  try {
    for (const file of await walk(base)) {
      const code = await readFile(file, "utf8");
      if (clientMark.test(code)) continue;
      if (hookImport.test(code) || hookCall.test(code)) {
        issues.push(path.relative(root, file));
      }
    }
  } catch {
    // app subdirs only
  }
}

if (issues.length) {
  console.log("Missing use client:\n" + issues.join("\n"));
  process.exit(1);
}
console.log("All hook-using JSX files declare use client.");