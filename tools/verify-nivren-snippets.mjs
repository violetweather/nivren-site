import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const examples = readFileSync(resolve("app/examples/page.tsx"), "utf8");
const docs = readFileSync(resolve("app/docs/DocsExplorer.tsx"), "utf8");
const packageCatalog = readFileSync(resolve("app/packages/catalog.ts"), "utf8");
const packageSnippets = [...packageCatalog.matchAll(/example: `([\s\S]*?)`/g)].map((match) => match[1]);
if (packageSnippets.length !== 25) {
  throw new Error(`expected 25 official package examples, found ${packageSnippets.length}`);
}
for (const [index, snippet] of packageSnippets.entries()) {
  if (/^\s*define\s+\w+\s*\(/m.test(snippet)
      || /^\s*(?:keep|change)\s+\w+(?:\s*:\s*[^=]+)?\s*=/m.test(snippet)
      || /^\s*(?:shape|choice)\s+\w+\s*\{/m.test(snippet)) {
    throw new Error(`official package example ${index + 1} contains pre-Edition-5 syntax`);
  }
}
const snippets = [
  ...[...examples.matchAll(/code: `([\s\S]*?)`\s*}/g)].map((match) => match[1]),
  ...[...docs.matchAll(/nivren: `([\s\S]*?)`/g)].map((match) => match[1]),
];
if (snippets.length < 15) throw new Error(`expected at least 15 examples, found ${snippets.length}`);

const binary = process.env.NIVREN_BIN ?? resolve("../nivren-performance/target/debug/niv");
const root = mkdtempSync(join(tmpdir(), "nivren-site-snippets-"));
try {
  for (const [index, snippet] of snippets.entries()) {
    const path = join(root, `example-${index + 1}.niv`);
    writeFileSync(path, `${snippet}\n`, "utf8");
    const checked = spawnSync(binary, ["check", path], { encoding: "utf8" });
    if (checked.status !== 0) {
      process.stderr.write(checked.stdout);
      process.stderr.write(checked.stderr);
      throw new Error(`Edition 5 snippet ${index + 1} did not type-check`);
    }
  }
  console.log(`${snippets.length} Edition 5 site snippets type-check; 25 package examples pass the pre-Edition-5 residue gate`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
