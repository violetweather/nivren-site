"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Section = {
  id: string;
  title: string;
  group: string;
  summary: string;
  search: string;
  paragraphs: string[];
  nivren?: string;
  command?: string;
  checks?: string[];
};

const sections: Section[] = [
  {
    id: "install", title: "Guided installation", group: "Start here", summary: "Install, update, roll back, and remove Nivren safely.", search: "install setup path vscode rollback windows mac linux",
    paragraphs: ["The guided installer detects the operating system and CPU, verifies the selected archive, and asks before changing PATH or installing VS Code support. Every managed install has an ownership marker and machine-readable receipt.", "The current public download is the Edition 3 beta. Edition 4 remains an unpublished candidate until every Product Proof gate passes. Local rollback and signed stable, beta, and nightly manifests are implemented; the production channel key, manifests, clean-platform recovery matrix, and incident drill remain release gates."],
    command: `# macOS or Linux
sh install.sh
sh install.sh --channel beta --channel-key ./nivren-channel.pub
sh install.sh --rollback
sh install.sh --uninstall

# Windows PowerShell
.\\install.ps1
.\\install.ps1 -Channel beta -ChannelKey .\\nivren-channel.pub
.\\install.ps1 -Rollback
.\\install.ps1 -Uninstall`,
    checks: ["Use --yes or -Yes only in controlled automation.", "Never install over an unmarked directory.", "Keep checksums, receipts, and the previous version until validation passes."],
  },
  {
    id: "quickstart", title: "Quickstart", group: "Start here", summary: "Create, develop, test, explain, and ship one standard project.", search: "new dev check test explain ship first project",
    paragraphs: ["A generated project contains a strict manifest, Edition 4 source, tests, explicit capabilities, and generated-documentation output. ship checks, tests, documents, packages, and creates a standalone executable; it never publishes externally."],
    command: `niv new hello-nivren
cd hello-nivren
niv dev
niv test
niv explain src/main.niv
niv ship`,
  },
  {
    id: "language", title: "Intent-first language", group: "Language", summary: "Read Edition 4's canonical declarations, labeled calls, and exhaustive outcomes.", search: "shape choice define takes gives keep set choose case carries labeled",
    paragraphs: ["shape and choice make data states nominal. define separates inputs, outputs, authority, and implementation. keep is immutable; change is explicitly mutable. Calls label every application-defined input.", "The formatter owns one canonical layout. Familiar arithmetic, indexing, literals, and property access remain compact."],
    nivren: `shape Signup holds {
    name is String
    age is Int
} with Json, Display, Validate

define welcome
takes {
    input is Signup
}
gives String or String
{
    when input.age < 13 {
        give err("a signup must be at least 13")
    }
    give ok("Welcome, " + input.name)
}

keep input set Signup with { name set "Mira" age set 24 }
choose welcome with { input set input } {
    case Ok carries message => message
    case Err carries problem => problem
}`,
  },
  {
    id: "failures", title: "Failure, absence, and cleanup", group: "Language", summary: "Keep expected failure typed and resource cleanup deterministic.", search: "error result gives or problem maybe none using cleanup",
    paragraphs: ["gives Value or Problem declares recoverable failure without exceptions. expression or give forwards the exact problem. maybe Value represents absence when no explanation is needed.", "using closes owned files, sockets, transactions, native libraries, and foreign handles on success, give, propagated failure, cancellation, and runtime failure."],
    nivren: `define load
takes {
    path is String
}
gives String or String
needs FileRead
{
    keep opened set perform std.files.open_read with { path set path } or give
    using file = opened {
        give perform std.files.read_open with { file set file maximum set 1048576 }
    }
}`,
  },
  {
    id: "intent", title: "Plans, perform, and explain", group: "Language", summary: "Make external effects visible without allocating plans for pure work.", search: "prepare perform through explain intent plan allocation effect order",
    paragraphs: ["prepare creates a typed immutable plan. perform is the visible external-effect boundary. through expresses a pipeline the compiler may fuse, batch, or parallelize only when failures, cleanup, tracing, and source-defined ordering are preserved.", "niv explain reports authority, resources, cancellation, buffering, blocking, fusion, allocation, and selected execution target. Pure intent constructs lower without runtime plan allocation."],
    nivren: `shape FetchPlan holds {
    url is String
    timeout is Float
} with Display, Validate

prepare request as FetchPlan with {
    url set "https://api.example.test/users"
    timeout set 5.0
}

perform request`,
  },
  {
    id: "capabilities", title: "Needs, grants, and limits", group: "Applications", summary: "Declare authority in source and narrow it in the project policy.", search: "capability needs scope policy limits network file native random",
    paragraphs: ["needs is checked transitively through calls, callbacks, and started tasks. niv.toml separately grants runtime authority. Files can be path-scoped; networks can be host- and method-scoped; environment, process, and native handles have their own narrow scopes.", "Instruction and memory limits apply to the entire structured task tree and are embedded in standalone applications."],
    command: `[capabilities]
FileRead = "path:./data"
Network = "host:api.example.com;method:GET,POST"
Native = "kind:database"

[limits]
instructions = "1000000"
memory_bytes = "67108864"`,
  },
  {
    id: "concurrency", title: "Structured concurrency", group: "Applications", summary: "Bound tasks, channels, deadlines, and shared state.", search: "task start wait together race channel backpressure lock atomic cancellation",
    paragraphs: ["Parents own child lifetimes. Cancellation is cooperative, together and race retain ownership, and bounded channels surface backpressure instead of growing hidden queues. Locks use scoped guards; AtomicInt supports linearizable counters."],
    nivren: `define run
gives Int or String
needs Channel, Task
{
    keep channel set perform std.channels.create with { capacity set 8 }
    define produce
    gives Int or String
    needs Channel
    {
        keep sent set perform std.channels.send with { channel set channel value set 42 timeout set 2.0 } or give
        give ok(1)
    }
    keep worker set start produce
    keep received set perform std.channels.receive with { channel set channel timeout set 2.0 } or give
    keep completed set wait worker or give
    give ok(received)
}`,
  },
  {
    id: "http", title: "HTTP, TLS, and WebSockets", group: "Applications", summary: "Build bounded clients and servers with verified transport security.", search: "http tls websocket routing middleware auth streaming server client",
    paragraphs: ["HTTP bodies, headers, timeouts, and response sizes are bounded. TLS clients verify certificates and hostnames; mTLS requires paired identities and explicit server policy. WebSocket framing, masking, message ceilings, and cleanup remain checked.", "nivren_routing adds exact and parameter routes plus request policies. Full authentication adapters, middleware composition, templates, and released-platform service evidence remain Product Proof work."],
    nivren: `define fetch
takes {
    url is String
}
gives String or String
needs Network
{
    give perform std.web.get with { url set url timeout set 5.0 }
}`,
    checks: ["Grant only required hosts and methods.", "Set body, header, message, and timeout ceilings.", "Test slow peers, cancellation, malformed framing, and certificate failure."],
  },
  {
    id: "database", title: "Database services", group: "Applications", summary: "Use typed requests, bounded pages, transactions, migrations, and owned drivers.", search: "database sql driver pool migration transaction query rows postgres mysql sqlite",
    paragraphs: ["nivren_database defines Edition 4 driver, pool, migration, request, row, and page contracts. The native CLI now ships a bundled SQLite host with rooted paths, parameterized query/execute, explicit transactions, bounded JSON rows, and deterministic opaque-handle cleanup.", "PostgreSQL and MySQL hosts, query streaming, pool integration, migration reference services, and the six-platform SQLite fixture matrix remain blocking work."],
    checks: ["Parameterize values and validate identifiers.", "Bound rows, field bytes, timeouts, and pool size.", "Test rollback, cancellation, saturation, reconnect, and migration recovery."],
  },
  {
    id: "realtime", title: "Realtime and Discord", group: "Applications", summary: "Model commands, gateway events, retries, and rate limits explicitly.", search: "discord realtime websocket event command retry rate limit gateway",
    paragraphs: ["nivren_discord provides Edition 4 message and command shapes, typed gateway events, identify payloads, secure gateway plans, bounded retry decisions, and rate-limit handling. Network work remains behind perform and host grants.", "Production bots should persist gateway sequence state, honor server retry timing, redact tokens, bound event payloads, and make command idempotency explicit."],
  },
  {
    id: "desktop", title: "Desktop applications", group: "Platforms", summary: "Embed Nivren behind a bounded native webview bridge.", search: "desktop gui webview bridge window signing updater mac windows linux",
    paragraphs: ["nivren_desktop defines bounded window, bridge-message, and staged-update contracts plus a Native opaque-handle adapter with VM/native equivalence and deterministic cleanup.", "Edition 4 does not yet ship released macOS, Windows, and Linux system-webview hosts. Origin, CSP, command allowlists, packaging, signing, notarization, and updater recovery must pass before desktop support is promoted."],
  },
  {
    id: "mobile", title: "Experimental mobile embedding", group: "Platforms", summary: "Call ABI v3 from Swift or Kotlin/JNI without losing ownership safety.", search: "ios android swift kotlin jni mobile embed abi",
    paragraphs: ["The release candidate contains Swift and Kotlin/JNI wrappers that preserve exact UTF-8, cap results at 16 MiB, check ABI version 3, and free every Nivren-owned buffer.", "Mobile remains experimental until Xcode and Android NDK builds, lifecycle and cancellation tests, device examples, per-ABI packaging, and clean-device evidence pass."],
  },
  {
    id: "gpu", title: "Portable GPU compute", group: "Platforms", summary: "Use checked compute plans with a required CPU fallback.", search: "gpu webgpu wgsl compute shader vector cpu fallback",
    paragraphs: ["nivren_gpu validates vector-add plans, deterministic WGSL, explicit item/workgroup limits, and a four-lane checked CPU fallback. Its Native device adapter verifies returned length and matches VM/native-control behavior.", "Real WebGPU hosts, cancellation, buffer validation, workload benchmarks, and the GPU-unavailable/slow-fallback platform matrix remain required. Edition 4 does not promise GPU rendering or a game engine."],
  },
  {
    id: "ffi", title: "Native libraries and embedding", group: "Runtime", summary: "Cross a visible C boundary with explicit ownership.", search: "ffi c abi native dynamic library callback handle unsafe embedding",
    paragraphs: ["ABI v3 checks, formats, compiles, VM-runs, and native-runs UTF-8 source through owned buffers. Async embedding adds one completion, cooperative cancellation, join, and an event-loop wake callback. NativeLibrary and NativeHandle values are opaque and scoped.", "Generated C11/C++17 shape and choice views are inspectable. Invalid lengths, callbacks, cancellation, foreign failures, panics, and handle misuse are covered by the compiler proof suite."],
    nivren: `define add
takes {
    path is String
}
gives Int or String
needs Native
{
    keep opened set perform std.native.open with { path set path } or give
    using library = opened {
        give perform std.native.call_int with { library set library symbol set "nivren_add" arguments set [20, 22] }
    }
}`,
  },
  {
    id: "wasm", title: "Browser Wasm and WASI", group: "Runtime", summary: "Run the Edition 4 compiler and portable VM in sandboxed hosts.", search: "wasm wasi browser sdk portable vm compiler",
    paragraphs: ["Reproducible WASI Preview 1 and zero-import browser guests check, format, compile, and execute Edition 4 through a bounded owned-memory ABI. The JavaScript SDK copies and frees every result exactly once.", "Native-only facilities fail explicitly in hosts that do not provide them; there is no silent TLS, filesystem, or FFI downgrade."],
  },
  {
    id: "packages", title: "Packages, registry, and offline work", group: "Projects", summary: "Pin immutable contents, authority, provenance, ownership, and advisories.", search: "package registry lock offline cache yank ownership provenance advisory",
    paragraphs: ["The 25 official packages are Edition 4 modules rebuilt, documented, published to a fixture registry, installed, imported, and executed together. Exact dependencies and content hashes are recorded in niv.lock. Offline install verifies the cached graph without network access.", "niv.authority.lock separately records the exact root and transitive package identity behind every capability scope and declared unsafe module. niv authority report previews the verified graph, check detects an unreviewed change, and lock accepts the new deterministic record. niv cache list verifies archive, extracted source, identity, checksum, and reachability; prune removes only verified unreachable entries. Hosted recovery and signed administrative operations remain release blockers."],
  },
  {
    id: "tooling", title: "Tooling and workspaces", group: "Tools", summary: "Use one formatter, language server, debugger protocol, profiler, and workspace workflow.", search: "fmt lsp dap debug profile coverage benchmark workspace incremental",
    paragraphs: ["niv-workspace.toml lists up to 256 normalized members. Nivren schedules exact-version internal dependencies first, preserves declaration order among independent members, and rejects cycles or member-version drift. check, build, test, bench, and ship retain each member's content fingerprint. niv bench reports warmups, 15 samples, median, p95, minimum, and versioned JSON. Property, compatibility, fuzz-smoke, and deterministic-time test profiles have first-class commands.", "niv profile reports execution and operation counts, allocation and garbage-collection work, materialized plans and ordered effects, async spawns/joins/cancellations/waits, and JIT/native decisions without recording source, values, secrets, or absolute project paths. The LSP provides diagnostics, completion, formatting, and Unicode-correct workspace rename. VS Code registers Edition 4 highlighting and a niv dap launch adapter; real pause/resume semantics and multi-editor evidence remain unfinished."],
    command: `niv workspace check .
niv workspace test .
niv workspace bench .
niv test --property tests/property
niv test --time 1700000000 tests/niv
niv fmt --check .
niv dap
niv profile --json profile.json app.niv
niv coverage app.niv`,
  },
  {
    id: "production", title: "Production checklist", group: "Tools", summary: "Ship reproducibly with least authority and honest support boundaries.", search: "production security deploy release reproducible audit sbom signing",
    paragraphs: ["A release must reproduce native, Wasm, library, container, desktop, mobile, and GPU artifacts where supported; verify SBOMs, manifests, checksums, signatures, and provenance; and compile every published snippet.", "Edition 4 remains unpublished until the Windows/macOS/Linux matrix, installer recovery, signed channels, platform hosts, accessibility/link checks, and independent security audit close every critical and high finding."],
    checks: ["Pin dependencies and review authority changes.", "Exercise failure, cancellation, slow-peer, and resource-ceiling paths.", "Measure startup, memory, latency, throughput, and fallback behavior.", "Keep experimental and unsupported areas labeled precisely."],
  },
  {
    id: "cli", title: "CLI reference", group: "Tools", summary: "The candidate command surface at a glance.", search: "cli new add dev check test bench build explain ship install registry dap",
    paragraphs: ["Core project commands, dependency-aware workspaces, test profiles, deterministic time, verified cache management, broad profiling, and signed-channel verification are implemented. Complete DAP execution control, hosted recovery, clean-platform update evidence, and independent audit evidence remain Product Proof blockers."],
    command: `niv new <project>          niv add <package> <version>
niv dev [project]          niv check <path>
niv test [path]            niv test --time <unix> [path]
niv test --property        niv test --fuzz-smoke
niv bench [path]             niv cache list [project]
niv cache prune [project]    niv authority report [project]
niv authority check [project]
niv authority lock [project] niv release verify-channel …
niv build [project]        niv explain <path>
niv ship [project]         niv workspace <action>
niv install --offline      niv package verify <archive>
niv fmt --check <path>     niv lsp
niv dap                    niv help`,
  },
];

export function DocsExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("quickstart");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? sections.filter((section) => `${section.title} ${section.group} ${section.summary} ${section.search}`.toLowerCase().includes(needle)) : sections;
  }, [query]);
  const current = filtered.find((section) => section.id === active) ?? filtered[0] ?? sections[0];
  const currentIndex = sections.findIndex((section) => section.id === current.id);
  const previous = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return <div className="shell docs-layout">
    <aside className="docs-sidebar">
      <label className="doc-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search documentation</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search docs" /></label>
      <p className="doc-count">{filtered.length} of {sections.length} detailed guides</p>
      <nav aria-label="Documentation sections">{filtered.length ? filtered.map((section) => <button className={current.id === section.id ? "active" : ""} key={section.id} onClick={() => setActive(section.id)}><span>{section.group}</span>{section.title}</button>) : <p className="no-results">No sections match “{query}”.</p>}</nav>
    </aside>
    <article className="docs-content" key={current.id}>
      <span className="doc-group">{current.group}</span><h2>{current.title}</h2><p className="doc-summary">{current.summary}</p>
      <div className="doc-body">{current.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{current.nivren ? <pre><code>{current.nivren}</code></pre> : null}{current.command ? <pre><code>{current.command}</code></pre> : null}{current.checks ? <><h3>Production checks</h3><ul>{current.checks.map((check) => <li key={check}>{check}</li>)}</ul></> : null}{current.id === "packages" ? <p>Explore the <Link className="inline-code" href="/packages">official package guides</Link> for APIs, failures, performance notes, and release checks.</p> : null}</div>
      <div className="doc-source">Normative behavior is defined by the executable Edition 4 draft and source-controlled standard-library, bytecode, package, embedding, and Wasm specifications.</div>
      <nav className="doc-pager" aria-label="Previous and next documentation sections">{previous ? <button type="button" onClick={() => setActive(previous.id)}><span>Previous</span>{previous.title}</button> : <span />}{next ? <button type="button" onClick={() => setActive(next.id)}><span>Next</span>{next.title}</button> : <span />}</nav>
    </article>
  </div>;
}
