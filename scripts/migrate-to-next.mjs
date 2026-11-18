import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const skip = new Set(["main.jsx", "router.jsx"]);

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, out);
    else if (/\.(jsx|js)$/.test(name.name) && !skip.has(name.name)) out.push(full);
  }
  return out;
}

const files = await walk(path.join(root, "src"));

for (const file of files) {
  let code = await readFile(file, "utf8");
  if (!code.includes("react-router-dom")) continue;

  const usesLink = /\bLink\b/.test(code);
  const usesNavLink = /\bNavLink\b/.test(code);
  const usesNavigate = /\buseNavigate\b/.test(code);
  const usesLocation = /\buseLocation\b/.test(code);
  const usesParams = /\buseParams\b/.test(code);
  const hadSearchParamsImport = /useSearchParams/.test(code);
  const usesScrollRestoration = /\bScrollRestoration\b/.test(code);

  code = code.replace(/^import\s+\{[^}]+\}\s+from\s+["']react-router-dom["'];\s*\n?/gm, "");

  const imports = [];
  if (usesLink) imports.push('import Link from "next/link";');
  if (usesNavLink) imports.push('import AppNavLink from "@/components/routing/AppNavLink";');
  const nav = [];
  if (usesNavigate) nav.push("useRouter");
  if (usesLocation) nav.push("usePathname", "useSearchParams");
  if (usesParams) nav.push("useParams");
  if (hadSearchParamsImport && !usesLocation) nav.push("useSearchParams");
  if (nav.length) imports.push(`import { ${[...new Set(nav)].join(", ")} } from "next/navigation";`);

  if (imports.length) {
    const insertAt = code.startsWith('"use client"') || code.startsWith("'use client'")
      ? code.indexOf("\n") + 1
      : 0;
    code = code.slice(0, insertAt) + `${imports.join("\n")}\n` + code.slice(insertAt);
  }

  code = code.replace(/\bNavLink\b/g, "AppNavLink");
  code = code.replace(/<Link to=/g, "<Link href=");
  code = code.replace(/<AppNavLink to=/g, "<AppNavLink href=");
  code = code.replace(/(\bLink\b[^>]*?)\bto=/g, "$1href=");

  if (usesNavigate) {
    code = code.replace(/\bconst navigate = useNavigate\(\);/g, "const router = useRouter();");
    code = code.replace(/\bnavigate\(/g, "ROUTER_PUSH(");
    code = code.replace(/ROUTER_PUSH\(([^)]+),\s*\{\s*replace:\s*true\s*\}\)/g, "router.replace($1)");
    code = code.replace(/ROUTER_PUSH\(/g, "router.push(");
  }

  if (usesLocation) {
    code = code.replace(/\bconst\s+location\s*=\s*useLocation\(\);/g, "const pathname = usePathname();");
    code = code.replace(/\blocation\.pathname\b/g, "pathname");
    code = code.replace(/\blocation\.state\b/g, "/* location.state */ null");
  }

  if (usesScrollRestoration) {
    code = code.replace(/^\s*<ScrollRestoration\s*\/>\s*\n?/m, "");
  }

  await writeFile(file, code, "utf8");
  console.log("migrated", path.relative(root, file));
}