import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-a11y-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const seedRoutes = [
  "/",
  "/docs",
  "/install",
  "/downloads",
  "/examples",
  "/benchmarks",
  "/packages",
  "/studio",
  "/studio/docs",
  "/studio/downloads",
  "/studio/plugins",
  "/studio/compatibility",
  "/studio/releases",
  "/studio/privacy",
  "/studio/security",
];

async function packageRoutes() {
  const catalog = await readFile(new URL("../app/packages/catalog.ts", import.meta.url), "utf8");
  return [...catalog.matchAll(/name: "(nivren_[a-z]+)"/g)].map((match) => `/packages/${match[1]}`);
}

function internalLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const target = match[1].split("#")[0].split("?")[0];
    if (target === "" || /\.[a-z0-9]+$/i.test(target)) continue; // static assets ship via Pages
    links.add(target);
  }
  return links;
}

test("every internal link on every page renders", { timeout: 300_000 }, async () => {
  const pending = [...seedRoutes, ...(await packageRoutes())];
  const visited = new Map();
  const linkedFrom = new Map();
  while (pending.length > 0) {
    const route = pending.pop();
    if (visited.has(route)) continue;
    const response = await render(route);
    const html = response.status === 200 ? await response.text() : "";
    visited.set(route, response.status);
    for (const link of internalLinks(html)) {
      if (!linkedFrom.has(link)) linkedFrom.set(link, route);
      if (!visited.has(link)) pending.push(link);
    }
  }
  const broken = [...visited.entries()]
    .filter(([, status]) => status !== 200)
    .map(([route, status]) => `${route} -> ${status} (linked from ${linkedFrom.get(route) ?? "seed"})`);
  assert.deepEqual(broken, [], `broken internal links:\n${broken.join("\n")}`);
});

test("every page passes the static accessibility checks", { timeout: 300_000 }, async () => {
  const failures = [];
  for (const route of [...seedRoutes, ...(await packageRoutes())]) {
    const response = await render(route);
    if (response.status !== 200) {
      failures.push(`${route}: status ${response.status}`);
      continue;
    }
    const html = await response.text();
    if (!/<html[^>]*\blang="/.test(html)) {
      failures.push(`${route}: <html> is missing a lang attribute`);
    }
    if (!/<title>[^<]+<\/title>/.test(html)) {
      failures.push(`${route}: page has no title`);
    }
    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1Count !== 1) {
      failures.push(`${route}: expected exactly one <h1>, found ${h1Count}`);
    }
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(image[0])) {
        failures.push(`${route}: image without alt text: ${image[0].slice(0, 80)}`);
      }
    }
    for (const anchor of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
      const visibleText = anchor[1].replace(/<[^>]*>/g, "").trim();
      const hasLabel = /\baria-label="[^"]+"/.test(anchor[0]);
      if (visibleText === "" && !hasLabel) {
        failures.push(`${route}: link without a name: ${anchor[0].slice(0, 80)}`);
      }
    }
    for (const external of html.matchAll(/href="(http:\/\/[^"]+)"/g)) {
      failures.push(`${route}: insecure external link ${external[1]}`);
    }
  }
  assert.deepEqual(failures, [], `accessibility failures:\n${failures.join("\n")}`);
});
