import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const examples = readFileSync(resolve("app/examples/page.tsx"), "utf8");
const docs = readFileSync(resolve("app/docs/DocsExplorer.tsx"), "utf8");
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
      throw new Error(`Edition 4 snippet ${index + 1} did not type-check`);
    }
  }
  console.log(`${snippets.length} Edition 4 site snippets type-check`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
