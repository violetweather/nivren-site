import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /Edition 6 · stable/);
  assert.match(html, /1\.0\.1/);
  assert.match(html, /25 × 1\.0\.0/);
  assert.match(html, /6 \+ WebAssembly/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/install"/);
  assert.match(html, /href="\/downloads"/);
  assert.match(html, /property="og:image" content="https:\/\/nivren\.nnx\.fyi\/og-edition4\.png"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.doesNotMatch(html, /public beta|Product Proof|Edition [245] /);
});

for (const [pathname, expected] of [
  ["/docs", "Documentation"],
  ["/install", "Install Nivren"],
  ["/downloads", "Downloads"],
  ["/examples", "Examples"],
  ["/benchmarks", "Twelve workloads. Every row published."],
  ["/packages", "Packages"],
  ["/studio", "See what your program"],
  ["/studio/docs", "Studio documentation"],
  ["/studio/downloads", "Studio downloads"],
  ["/studio/plugins", "Studio plugins"],
  ["/studio/compatibility", "Compatibility"],
  ["/studio/releases", "Studio releases"],
  ["/studio/privacy", "Privacy"],
  ["/studio/security", "Security"],
]) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected));
  });
}

test("presents the Edition 6 stable site and removes starter UI", async () => {
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.name, "nivren-site");
  assert.equal(packageJson.dependencies["react-loading-skeleton"], undefined);
});

test("publishes the official package catalog, live registry, and compatibility contract", async () => {
  const response = await render("/packages");
  const html = await response.text();
  for (const phrase of [
    "25 package guides", "every one at 1\\.0\\.0", "Live signed registry",
    "violetweather\\.github\\.io/nivren-registry", "--trusted", "Ed25519",
    "signed advisory, never a deletion", "niv trust",
    "nivren_aead", "ChaCha20-Poly1305", "nivren_aws", "AWS Signature Version 4",
    "nivren_compression", "gzip · gzip_decode · zlib · zlib_decode",
    "nivren_discord", "validate_retry_policy",
    "nivren_redis", "nivren_database", "nivren_desktop", "nivren_gpu",
    "semantic versions",
  ]) {
    assert.match(html, new RegExp(phrase, "i"));
  }
});

test("publishes a detailed guide for every official package", async () => {
  const catalog = await readFile(new URL("../app/packages/catalog.ts", import.meta.url), "utf8");
  const names = [...catalog.matchAll(/name: "(nivren_[a-z]+)"/g)].map((match) => match[1]);
  assert.equal(names.length, 25);
  for (const name of names) {
    const response = await render(`/packages/${name}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const phrase of [name, "Add it to a project", "--trusted", "violetweather\\.github\\.io/nivren-registry", "A focused example", "Public API", "Required authority", "Bounds and failure behavior", "Failures to handle", "Performance notes", "Production checklist", "When to use it"]) {
      assert.match(html, new RegExp(phrase));
    }
  }
});

test("documents the guided cross-platform installers", async () => {
  const install = await render("/install");
  const html = await install.text();
  assert.match(html, /install\/install\.sh/);
  assert.match(html, /stable is ready/);
  assert.match(html, /Verification is built in/);
  assert.match(html, /ownership marker/);
  assert.match(html, /Roll back without redownloading/);
  assert.match(html, /install-receipt\.json/);
  assert.match(html, /--rollback/);
  assert.match(html, /-Rollback/);
  const chooser = await readFile(new URL("../app/install/InstallChooser.tsx", import.meta.url), "utf8");
  assert.match(chooser, /install\.ps1/);
  const explorer = await readFile(new URL("../app/docs/DocsExplorer.tsx", import.meta.url), "utf8");
  assert.match(explorer, /--uninstall/);
  assert.match(explorer, /-Uninstall/);
  assert.match(explorer, /--rollback/);
  assert.match(explorer, /-Rollback/);
});

test("documents the fail-closed Studio release matrix", async () => {
  const downloads = await render("/studio/downloads");
  const downloadHtml = await downloads.text();
  for (const phrase of ["Apple-silicon Macs and Windows x64/ARM64", "Developer preview", "Three verified builds today", "Nivren-Studio-Windows-x64-1.132.0-developer.1.zip", "Nivren-Studio-Windows-ARM64-1.132.0-developer.1.zip", "unsigned portable ZIPs"]) {
    assert.match(downloadHtml, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const docs = await render("/studio/docs");
  const docsHtml = await docs.text();
  for (const phrase of ["Package and prove", "pinned signatures", "exact rollback", "same-source six-platform matrix"]) {
    assert.match(docsHtml, new RegExp(phrase));
  }
  const compatibility = await render("/studio/compatibility");
  const compatibilityHtml = await compatibility.text();
  assert.match(compatibilityHtml, /Developer-preview DMG verified/);
  assert.match(compatibilityHtml, /Portable previews built, tested, audited, and published/);
  assert.match(compatibilityHtml, /installer and runtime evidence pending/);
  assert.match(compatibilityHtml, /Nivren 1\.0 · Edition 6/);
});

test("documents distinctive Edition 6 capabilities", async () => {
  const docs = await render("/docs");
  const html = await docs.text();
  assert.match(html, /Edition 6 guide/);
  const explorer = await readFile(new URL("../app/docs/DocsExplorer.tsx", import.meta.url), "utf8");
  for (const phrase of ["or give", "memory_bytes", "kind:database", "shape Signup holds", "gives String or Problem", "prepare request", "perform request", "start produce", "std.channels.send", "std.web.get", "nivren_routing", "nivren_database", "nivren_discord", "nivren_desktop", "Kotlin/JNI", "nivren_gpu", "CPU fallback", "std.native.open", "std.native.call_int", "ABI v3", "WASI Preview 1", "zero-import", "25 official packages", "niv-workspace.toml", "niv dap", "niv trust", "niv install --trusted", "niv build --aot", "WebView2", "wgpu", "postgres://", "mysql://", "mimalloc", "independent security audit"]) {
    assert.match(explorer, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const phrase of ["Intent-first language", "Failure, absence, and cleanup", "Database services", "Production checklist", "Previous", "Next"]) {
    assert.match(explorer, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /20 detailed guides/);
});

test("publishes every portable stable target", async () => {
  const response = await render("/downloads");
  const html = await response.text();
  assert.match(html, /WASI Preview 1/);
  assert.match(html, /Browser SDK/);
  assert.match(html, /JavaScript loader/);
  assert.match(html, /Linux x64 \+ ARM64/);
  assert.match(html, /Non-root/);
  assert.match(html, /Portable compiler \+ VM/);
  assert.match(html, /nivren-v1\.0\.1-wasm32-wasip1\.wasm/);
  assert.match(html, /nivren-v1\.0\.1-browser\.wasm/);
  assert.match(html, /nivren-1\.0\.1\.vsix/);
  assert.match(html, /pkgs\/container\/nivren/);
});

test("syntax-highlights every block-level code sample", async () => {
  const routes = ["/", "/docs", "/install", "/downloads", "/examples", "/benchmarks", "/packages", "/packages/nivren_database"];
  for (const route of routes) {
    const response = await render(route);
    const html = await response.text();
    for (const block of html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)) {
      assert.match(block[1], /class="[^"]*syn-|class="syntax-code/, `${route} contains an unhighlighted code block`);
    }
  }
});

test("publishes the complete Edition 6 benchmark suite", async () => {
  const response = await render("/benchmarks");
  const html = await response.text();
  for (const phrase of ["The Edition 6 benchmark suite", "Twelve workloads", "Everyday commands", "Compute and data", "Concurrency", "Warmed service", "Source-to-result startup", "One-shot source check", "Typed JSON file pipeline", "Text file pipeline", "Tiered integer loop", "Recursive calls", "Nested loop arithmetic", "Shape-heavy loop", "Large typed JSON transform", "Allocation churn", "Tasks and channels", "Warmed HTTP service", "AMD Ryzen 9 9950X3D", "Nivren 1.0.0 · Edition 6 engine", "Open rows, published anyway", "The wins and losses use one public harness"]) {
    assert.match(html, new RegExp(phrase));
  }
  const benchmarkReport = JSON.parse(await readFile(new URL("../benchmarks/nivren-vs-node/results/2026-08-31-phase-n.json", import.meta.url), "utf8"));
  assert.equal(benchmarkReport.results.length, 12);
  assert.equal(benchmarkReport.results.filter(result => result.category === "strength").length, 4);
  assert.equal(benchmarkReport.results.filter(result => result.category === "limit").length, 6);
  assert.equal(benchmarkReport.results.filter(result => result.category === "concurrency").length, 1);
  assert.equal(benchmarkReport.results.filter(result => result.category === "service").length, 1);
  assert.equal(benchmarkReport.results[0].output, "42");
  assert.equal(benchmarkReport.results[1].output, "successful check");
  const losses = benchmarkReport.results.filter(result => result.node.median_ms < result.nivren.median_ms);
  for (const loss of losses) {
    assert.match(html, new RegExp(loss.label), `losing row "${loss.label}" must stay published`);
  }
});

test("keeps release versions and download assets synchronized", async () => {
  const release = JSON.parse(await readFile(new URL("../release.json", import.meta.url), "utf8"));
  const response = await render("/downloads");
  const html = await response.text();
  assert.match(html, new RegExp(release.public.version.replaceAll(".", "\\.")));
  if (!release.candidate.published) {
    assert.doesNotMatch(html, new RegExp(`/releases/download/v${release.candidate.version.replaceAll(".", "\\.")}/`));
  }
  for (const asset of release.public.assets) {
    assert.match(html, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("renders accessible landmarks and resolves every internal link", async () => {
  const catalog = await readFile(new URL("../app/packages/catalog.ts", import.meta.url), "utf8");
  const packageRoutes = [...catalog.matchAll(/name: "(nivren_[a-z]+)"/g)].map((match) => `/packages/${match[1]}`);
  const routes = ["/", "/docs", "/install", "/downloads", "/examples", "/benchmarks", "/packages", "/studio", "/studio/docs", "/studio/downloads", "/studio/plugins", "/studio/compatibility", "/studio/releases", "/studio/privacy", "/studio/security", ...packageRoutes];
  const known = new Set(routes);
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /<html lang="en">/, route);
    assert.match(html, /<a class="skip-link" href="#main">Skip to content<\/a>/, route);
    assert.match(html, /<main id="main">/, route);
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route} must have exactly one h1`);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (!href.startsWith("/") || href.startsWith("/assets/")) continue;
      const target = href.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
      assert.ok(known.has(target), `${route} links to unknown internal route ${href}`);
    }
  }
});
