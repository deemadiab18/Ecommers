import { rm } from "node:fs/promises";
import path from "node:path";

const target = path.resolve(import.meta.dirname, "..", ".next");
await rm(target, { recursive: true, force: true });
console.log("Removed .next — start dev again.");