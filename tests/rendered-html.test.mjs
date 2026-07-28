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
  assert.match(html, /Edition 3 capability program/);
  assert.match(html, /0\.10\.0-beta\.6/);
  assert.match(html, /17 \/ 17/);
  assert.match(html, /6 \+ WebAssembly/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/install"/);
  assert.match(html, /href="\/downloads"/);
  assert.match(html, /property="og:image" content="https:\/\/violetweather\.github\.io\/nivren-site\/og\.png"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

for (const [pathname, expected] of [
  ["/docs", "Documentation"],
  ["/install", "Install Nivren"],
  ["/downloads", "Downloads"],
  ["/examples", "Examples"],
  ["/benchmarks", "Quick tools. Small processes. Explicit safety."],
  ["/packages", "Packages"],
]) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected));
  });
}

test("presents the Edition 3 site and removes starter UI", async () => {
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.name, "nivren-site");
  assert.equal(packageJson.dependencies["react-loading-skeleton"], undefined);
});

test("publishes the official package catalog and compatibility contract", async () => {
  const response = await render("/packages");
  const html = await response.text();
  const catalogChecks = new Set(["22 package guides", "nivren_aead", "ChaCha20-Poly1305", "nivren_redis", "semantic versions", "temporary immutable registry"]);
  for (const phrase of ["22 package guides", "nivren_aead", "Opaque zeroized keys", "ChaCha20-Poly1305", "Sealed · import_key · generate_key · seal", "nivren_aws", "AWS Signature Version 4", "Signature · sign_v4", "nivren_columnar", "Column · Table · table · select", "nivren_image", "Image · image · encode_ppm · decode_ppm", "nivren_oidc", "Authorization · CoreClaims · pkce_challenge", "nivren_matrix", "Matrix · matrix · at · add · multiply", "nivren_svg", "Canvas · canvas · add · rect · text · render", "nivren_wav", "Audio · encode_pcm16 · decode_pcm16", "nivren_metrics", "Sample · sample · encode", "nivren_trace", "OtlpAttribute · OtlpSpan", "export_otlp_json", "nivren_compression", "mandatory decompression ceilings", "gzip · gunzip · zlib · unzlib", "nivren_crypto", "constant-time-verified HMAC-SHA-256", "nivren_csv", "quoted multiline fields", "decode · encode · decode_with · encode_with", "nivren_stats", "sum · mean · variance · minimum", "nivren_jwt", "sign_hs256 · verify_hs256", "nivren_secrets", "Argon2id v=19", "random_key · hash_password", "nivren_sql", "without interpolating values", "nivren_redis", "RESP2/RESP3 framing", "MOVED/ASK Cluster redirects", "live Redis 6.2 through 8.8", "nivren_discord", "nivren_testing", "nivren_routing", "nivren_validation", "semantic versions", "temporary immutable registry"]) {
    if (!catalogChecks.has(phrase)) continue;
    assert.match(html, new RegExp(phrase, "i"));
  }
});

test("publishes a detailed guide for every official package", async () => {
  const catalog = await readFile(new URL("../app/packages/catalog.ts", import.meta.url), "utf8");
  const names = [...catalog.matchAll(/name: "(nivren_[a-z]+)"/g)].map((match) => match[1]);
  assert.equal(names.length, 22);
  for (const name of names) {
    const response = await render(`/packages/${name}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const phrase of [name, "Add it to a project", "A focused example", "Public API", "Required authority", "Bounds and failure behavior", "When to use it"]) {
      assert.match(html, new RegExp(phrase));
    }
  }
});

test("documents the guided cross-platform installers", async () => {
  const install = await render("/install");
  const html = await install.text();
  assert.match(html, /install\/install\.sh/);
  assert.match(html, /Verification is built in/);
  assert.match(html, /ownership marker/);
  const chooser = await readFile(new URL("../app/install/InstallChooser.tsx", import.meta.url), "utf8");
  assert.match(chooser, /install\.ps1/);
  const explorer = await readFile(new URL("../app/docs/DocsExplorer.tsx", import.meta.url), "utf8");
  assert.match(explorer, /--uninstall/);
  assert.match(explorer, /-Uninstall/);
});

test("documents distinctive Edition 3 capabilities", async () => {
  const docs = await render("/docs");
  const html = await docs.text();
  assert.match(html, /Edition 3 guide/);
  const explorer = await readFile(new URL("../app/docs/DocsExplorer.tsx", import.meta.url), "utf8");
  for (const phrase of ["or give", "memory_bytes", "prefix:NIVREN_", "command:git", "kind:database", "protocol Named", "adopt Named for User", "Named.name(value)", "orphan ownership rule", "qualified identities", "Failed(String)", "Array([Response])", "Pair<Left, Right>", "Maybe<Value>", "Pair<String, Int>", "std.bigint.parse", "std.binary.u16_be", "std.binary.read_u16_be", "little-endian", "std.iter.range", "std.iter.lines", "std.iter.tcp_lines", "lazy, end-exclusive", "truly lazy", "std.iter.transform", "std.iter.fold", "std.iter.find", "single-pass", "std.transactions.commit", "always rolls back", "std.native.open", "std.native.call_int", "NativeLibrary", "std.host.invoke_async", "shared executor", "std.files.read_async", "std.json.decode", "std.json.read_next_as", "std.reflect.schema", "niv bindgen c", "niv inspect", "event-loop wake", "wake-driven runtime event loop", "std.web.request", "std.net.write_some", "std.net.ready_any", "std.net.read_ready", "std.net.write_ready", "std.web.websocket_connect", "websocket_secure_connect", "std.web.websocket_secure_listen", "std.web.websocket_secure_accept", "TlsListener", "client_certificate_pem", "client_auth", "client_ca_pem", "std.web.tls_options", "std.locks.acquire", "AtomicInt", "std.atomics.add", "sequentially consistent", "niv registry search", "--crash-report", "build --standalone", "start produce", "wasm32-wasip1", "wasm32-unknown-unknown", "zero-import", "JavaScript SDK", "nivren_wasm_run", "16 MiB", "no silent security downgrade"]) {
    assert.match(explorer, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const phrase of ["Anatomy of a program", "Results, errors & recovery", "Authoring a package", "Production workflow", "Previous", "Next"]) {
    assert.match(explorer, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /23 detailed guides/);
});

test("publishes every portable beta target", async () => {
  const response = await render("/downloads");
  const html = await response.text();
  assert.match(html, /WASI Preview 1/);
  assert.match(html, /Browser SDK/);
  assert.match(html, /JavaScript loader/);
  assert.match(html, /Linux x64 \+ ARM64/);
  assert.match(html, /Non-root/);
  assert.match(html, /Portable compiler \+ VM/);
  assert.match(html, /nivren-v0\.10\.0-beta\.6-wasm32-wasip1\.wasm/);
  assert.match(html, /nivren-v0\.10\.0-beta\.6-browser\.wasm/);
  assert.match(html, /nivren-0\.10\.0-beta\.6\.vsix/);
  assert.match(html, /pkgs\/container\/nivren/);
});

test("publishes reproducible Nivren versus Node.js results", async () => {
  const response = await render("/benchmarks");
  const html = await response.text();
  for (const phrase of ["Measured on real Nivren-shaped work", "Where Nivren fits today", "Current limits", "Source-to-result startup", "One-shot source check", "Typed JSON file pipeline", "Text file pipeline", "Tiered integer loop", "Recursive calls", "Nested loop arithmetic", "Apple M4", "Nivren 0.10.0-beta.6", "Node.js 26.5.0", "What the strengths mean", "The wins and losses use one public harness"]) {
    assert.match(html, new RegExp(phrase));
  }
  const benchmarkReport = JSON.parse(await readFile(new URL("../benchmarks/nivren-vs-node/results/2026-07-27-macos-arm64.json", import.meta.url), "utf8"));
  assert.equal(benchmarkReport.results.length, 7);
  assert.equal(benchmarkReport.results.filter(result => result.category === "strength").length, 4);
  assert.equal(benchmarkReport.results.filter(result => result.category === "limit").length, 3);
  assert.equal(benchmarkReport.results[0].output, "42");
  assert.equal(benchmarkReport.results[1].output, "successful check");
  assert.ok(benchmarkReport.results[2].output.includes("Nivren benchmark events"));
  assert.ok(benchmarkReport.results[3].output.includes("start worker=alpha"));
});
