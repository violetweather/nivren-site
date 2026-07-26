import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete Nivren landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Nivren — Code that reads like intent<\/title>/i);
  assert.match(html, /Code that reads like/);
  assert.match(html, /Edition 1 compatibility beta/);
  assert.match(html, /27 \/ 27/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/install"/);
  assert.match(html, /href="\/downloads"/);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

for (const [pathname, expected] of [
  ["/docs", "Documentation"],
  ["/install", "Install Nivren"],
  ["/downloads", "Downloads"],
  ["/examples", "Examples"],
]) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected));
  });
}

test("ships the verified Apple Silicon beta and removes starter UI", async () => {
  const archive = await readFile(new URL("../public/downloads/nivren-0.9.0-beta.1-macos-arm64.zip", import.meta.url));
  assert.equal(createHash("sha256").update(archive).digest("hex"), "cdcb9e6f7c6b0b9557ed9bdc8d1ef5c3f810fcf6ff99b0fb08263ffb778e75a7");
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.name, "nivren-site");
  assert.equal(packageJson.dependencies["react-loading-skeleton"], undefined);
});
