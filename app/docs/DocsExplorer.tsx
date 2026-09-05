"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SyntaxCode } from "../components/SyntaxCode";

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
    paragraphs: ["The guided installer detects the operating system and CPU, verifies the selected archive, and asks before changing PATH or installing VS Code support. Every managed install has an ownership marker and machine-readable receipt.", "The current public download is Nivren 1.0.0 stable, the Edition 6 runtime edition. The syntax is frozen, and the compatibility promise is unconditional from 1.0 onward: your source runs unchanged on every later release, and the 1.0.x line carries fixes only. Local rollback and signed stable, beta, and nightly manifest support are built in."],
    command: `# macOS or Linux
sh install.sh
sh install.sh --channel stable --channel-key ./nivren-channel.pub
sh install.sh --rollback
sh install.sh --uninstall

# Windows PowerShell
.\\install.ps1
.\\install.ps1 -Channel stable -ChannelKey .\\nivren-channel.pub
.\\install.ps1 -Rollback
.\\install.ps1 -Uninstall`,
    checks: ["Use --yes or -Yes only in controlled automation.", "Never install over an unmarked directory.", "Keep checksums, receipts, and the previous version until validation passes."],
  },
  {
    id: "quickstart", title: "Quickstart", group: "Start here", summary: "Create, develop, test, explain, and ship one standard project.", search: "new dev check test explain ship first project",
    paragraphs: ["A generated project contains a strict manifest, Nivren source, tests, explicit capabilities, and generated-documentation output. ship checks, tests, documents, packages, and creates a standalone executable; it never publishes externally."],
    command: `niv new hello-nivren
cd hello-nivren
niv dev
niv test
niv explain src/main.niv
niv ship`,
  },
  {
    id: "language", title: "Intent-first language", group: "Language", summary: "Read Nivren's canonical declarations, labeled calls, and exhaustive outcomes.", search: "shape choice define takes gives keep set choose case carries labeled",
    paragraphs: ["shape and choice make data states nominal. define separates inputs, outputs, authority, and implementation. keep is immutable; change is explicitly mutable. Calls label every application-defined input.", "The formatter owns one canonical layout. Familiar arithmetic, indexing, literals, and property access remain compact."],
    nivren: `shape Signup holds {
    name is String
    age is Int
} derives Json, Display, Validate

define welcome
takes {
    input is Signup
}
gives String or Problem
{
    when input.age < 13 {
        give err(std.problems.create("app", "a signup must be at least 13"))
    }
    give ok("Welcome, " + input.name)
}

keep input set Signup with { name set "Mira" age set 24 }
choose welcome with { input set input } {
    case Ok carries message => message
    case Err carries problem => problem.message
}`,
  },
  {
    id: "failures", title: "Failure, absence, and cleanup", group: "Language", summary: "Keep expected failure typed and resource cleanup deterministic.", search: "error result gives or problem maybe none using cleanup",
    paragraphs: ["gives Value or Problem declares recoverable failure without exceptions. expression or give forwards the exact problem. maybe Value represents absence when no explanation is needed.", "using closes owned files, sockets, transactions, native libraries, and foreign handles on success, give, propagated failure, cancellation, and runtime failure."],
    nivren: `define load
takes {
    path is String
}
gives String or Problem
needs FileRead
{
    keep opened set perform std.files.open_read with { path set path } or give
    using file set opened {
        give perform std.files.read_from with { file set file maximum set 1048576 }
    }
}`,
  },
  {
    id: "intent", title: "Plans, perform, and explain", group: "Language", summary: "Make external effects visible without allocating plans for pure work.", search: "prepare perform through explain intent plan allocation effect order",
    paragraphs: ["prepare creates a typed immutable plan. perform is the visible external-effect boundary. through expresses a pipeline the compiler may fuse, batch, or parallelize only when failures, cleanup, tracing, and source-defined ordering are preserved.", "niv explain reports authority, resources, cancellation, buffering, blocking, fusion, allocation, and selected execution target. Pure intent constructs lower without runtime plan allocation."],
    nivren: `shape FetchPlan holds {
    url is String
    timeout is Float
} derives Display, Validate

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
gives Int or Problem
needs Channel, Task
{
    keep channel set perform std.channels.create with { capacity set 8 }
    define produce
    gives Int or Problem
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
    paragraphs: ["HTTP bodies, headers, timeouts, and response sizes are bounded. TLS clients verify certificates and hostnames; mTLS requires paired identities and explicit server policy. WebSocket framing, masking, message ceilings, and cleanup remain checked.", "nivren_routing adds exact and parameter routes plus request policies while std.web owns listening, TLS, body reads, and response writes. The public benchmark suite measures a warmed Nivren HTTP service head to head against Node.js."],
    nivren: `define fetch
takes {
    url is String
}
gives String or Problem
needs Network
{
    give perform std.web.get with { url set url timeout set 5.0 }
}`,
    checks: ["Grant only required hosts and methods.", "Set body, header, message, and timeout ceilings.", "Test slow peers, cancellation, malformed framing, and certificate failure."],
  },
  {
    id: "database", title: "Database services", group: "Applications", summary: "Use typed requests, bounded pages, transactions, migrations, and owned drivers.", search: "database sql driver pool migration transaction query rows postgres mysql sqlite",
    paragraphs: ["nivren_database defines driver, pool, migration, request, row, and page contracts. The bundled Edition 6 database host routes memory:// and sqlite: to a rooted SQLite engine with parameterized query/execute, explicit transactions, bounded JSON rows, and deterministic opaque-handle cleanup.", "The same bounded envelope now reaches real servers: postgres://, postgresql://, and mysql:// URLs open genuine client connections, and live-server round trips are exercised wherever a server URL is provided."],
    checks: ["Parameterize values and validate identifiers.", "Bound rows, field bytes, timeouts, and pool size.", "Test rollback, cancellation, saturation, reconnect, and migration recovery."],
  },
  {
    id: "realtime", title: "Realtime and Discord", group: "Applications", summary: "Model commands, gateway events, retries, and rate limits explicitly.", search: "discord realtime websocket event command retry rate limit gateway",
    paragraphs: ["nivren_discord provides typed message and command shapes, typed gateway events, identify payloads, secure gateway plans, bounded retry decisions, and rate-limit handling. Network work remains behind perform and host grants.", "Production bots should persist gateway sequence state, honor server retry timing, redact tokens, bound event payloads, and make command idempotency explicit."],
  },
  {
    id: "desktop", title: "Desktop applications", group: "Platforms", summary: "Embed Nivren behind a bounded native webview bridge.", search: "desktop gui webview bridge window signing updater mac windows linux",
    paragraphs: ["nivren_desktop defines bounded window, bridge-message, and staged-update contracts plus a Native opaque-handle adapter with VM/native equivalence and deterministic cleanup.", "Edition 6 ships a real Windows WebView2 host: it owns windows on dedicated event-loop threads, serves the bundled app:// shell behind a locked default-src 'none' content-security policy, revalidates every window plan, bridge message, and update manifest host-side, and round-trips bridge messages through live page JavaScript. macOS and Linux hosts remain experimental and say so."],
  },
  {
    id: "mobile", title: "Experimental mobile embedding", group: "Platforms", summary: "Call ABI v3 from Swift or Kotlin/JNI without losing ownership safety.", search: "ios android swift kotlin jni mobile embed abi",
    paragraphs: ["The release contains Swift and Kotlin/JNI wrappers that preserve exact UTF-8, cap results at 16 MiB, check ABI version 3, and free every Nivren-owned buffer.", "Mobile embedding is experimental and labeled so: device builds, lifecycle and cancellation evidence, and per-ABI packaging are field work on the 1.0.x line."],
  },
  {
    id: "gpu", title: "Portable GPU compute", group: "Platforms", summary: "Use checked compute plans with a required CPU fallback.", search: "gpu webgpu wgsl compute shader vector cpu fallback",
    paragraphs: ["nivren_gpu validates vector-add plans, deterministic WGSL, explicit item/workgroup limits, and a four-lane checked CPU fallback. Its Native device adapter verifies returned length and matches VM/native-control behavior.", "Edition 6 ships a real WebGPU host built on wgpu: it validates and dispatches bounded WGSL compute, the add-kernel proof passes through the VM, native control, and the project CLI, and an executable test matrix covers the GPU-unavailable fallback. Nivren promises compute, not GPU rendering or a game engine."],
  },
  {
    id: "runtime", title: "The Edition 6 runtime", group: "Runtime", summary: "The memory and native generations behind 1.0.0's speed.", search: "runtime edition 6 memory native aot cranelift jit mimalloc allocator performance",
    paragraphs: ["The memory generation shrank every runtime value from 48 to 24 bytes, shares one field-name table per shape so construction copies no strings, decodes typed JSON without allocating path strings, and replaces the system allocator with mimalloc.", "The native generation compiles whole integer programs — loops, recursive calls, and flattened shapes — to machine code through the Cranelift tier with hardware overflow checks. niv build --aot additionally emits the planned program as one relocatable native object exporting nivren_program_native, with typed fault reporting for overflow, division by zero, and call-depth exhaustion. None of this changes the language: Edition 6 adds no syntax."],
    command: `niv build --aot app.niv
niv run --native app.niv
niv explain app.niv`,
  },
  {
    id: "ffi", title: "Native libraries and embedding", group: "Runtime", summary: "Cross a visible C boundary with explicit ownership.", search: "ffi c abi native dynamic library callback handle unsafe embedding",
    paragraphs: ["ABI v3 checks, formats, compiles, VM-runs, and native-runs UTF-8 source through owned buffers. Async embedding adds one completion, cooperative cancellation, join, and an event-loop wake callback. NativeLibrary and NativeHandle values are opaque and scoped.", "Generated C11/C++17 shape and choice views are inspectable. Invalid lengths, callbacks, cancellation, foreign failures, panics, and handle misuse are covered by the compiler proof suite."],
    nivren: `define add
takes {
    path is String
}
gives Int or Problem
needs Native
{
    keep opened set perform std.native.open with { path set path } or give
    using library set opened {
        give perform std.native.call_int with { library set library symbol set "nivren_add" arguments set [20, 22] }
    }
}`,
  },
  {
    id: "wasm", title: "Browser Wasm and WASI", group: "Runtime", summary: "Run the Nivren compiler and portable VM in sandboxed hosts.", search: "wasm wasi browser sdk portable vm compiler",
    paragraphs: ["Reproducible WASI Preview 1 and zero-import browser guests check, format, compile, and execute Nivren through a bounded owned-memory ABI. The JavaScript SDK copies and frees every result exactly once.", "Native-only facilities fail explicitly in hosts that do not provide them; there is no silent TLS, filesystem, or FFI downgrade."],
  },
  {
    id: "packages", title: "Packages, registry, and offline work", group: "Projects", summary: "Install from the live signed registry and pin contents, authority, provenance, and advisories.", search: "package registry lock offline cache yank ownership provenance advisory trust install trusted",
    paragraphs: ["The live registry serves all 25 official packages at 1.0.0 as signed, immutable static artifacts. niv install --trusted verifies everything on your machine against a pinned Ed25519 root key: publisher authorizations bound to a repository and CI workflow, per-release provenance binding the exact archive SHA-256, and a signed status whose generation only increases — so rollback and tampering fail closed. The niv trust family (keygen, authorize, attest, sign-status, sign-advisory) signs the whole chain, and niv registry verify-release re-checks any release. Exact dependencies and content hashes are recorded in niv.lock; offline install verifies the cached graph without network access.", "niv.authority.lock separately records the exact root and transitive package identity behind every capability scope and declared unsafe module. niv authority report previews the verified graph, check detects an unreviewed change, and lock accepts the new deterministic record. niv cache list verifies archive, extracted source, identity, checksum, and reachability; prune removes only verified unreachable entries."],
    command: `niv add nivren_stats 1.0.0
niv install --trusted https://violetweather.github.io/nivren-registry ./nivren-root.pub
niv install --offline
niv registry verify-release …
niv authority report`,
  },
  {
    id: "tooling", title: "Tooling and workspaces", group: "Tools", summary: "Use one formatter, language server, debugger protocol, profiler, and workspace workflow.", search: "fmt lsp dap debug profile coverage benchmark workspace incremental",
    paragraphs: ["niv-workspace.toml lists up to 256 normalized members. Nivren schedules exact-version internal dependencies first, preserves declaration order among independent members, and rejects cycles or member-version drift. check, build, test, bench, and ship retain each member's content fingerprint. niv bench reports warmups, 15 samples, median, p95, minimum, and versioned JSON. Property, compatibility, fuzz-smoke, and deterministic-time test profiles have first-class commands.", "niv profile reports execution and operation counts, allocation and garbage-collection work, materialized plans and ordered effects, async spawns/joins/cancellations/waits, and JIT/native decisions without recording source, values, secrets, or absolute project paths. The LSP provides diagnostics, completion, formatting, and Unicode-correct workspace rename. The Edition 6 debugger is real: niv dap runs the debugged program live on a worker thread with entry and breakpoint stops, step over/in/out, resumable continue, and program output forwarded as DAP events, and VS Code registers Nivren highlighting plus a niv dap launch adapter."],
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
    paragraphs: ["A release must reproduce native, Wasm, library, container, desktop, and GPU artifacts where supported; verify SBOMs, manifests, checksums, signatures, and provenance; and compile every published snippet.", "Nivren 1.0.0 stable rests on named internal evidence gates — the six-platform matrix, installer recovery, artifact reproducibility, application capability, and the documentation site — each with a fresh receipt. An independent security audit and an independently attested signing-recovery drill are 1.1 gates, and nothing here claims them before they exist. Every deferred surface is labeled experimental wherever it is described."],
    checks: ["Pin dependencies and review authority changes.", "Exercise failure, cancellation, slow-peer, and resource-ceiling paths.", "Measure startup, memory, latency, throughput, and fallback behavior.", "Keep experimental and unsupported areas labeled precisely."],
  },
  {
    id: "cli", title: "CLI reference", group: "Tools", summary: "The 1.0.0 command surface at a glance.", search: "cli new add dev check test bench build aot explain ship install registry trust dap repl",
    paragraphs: ["One binary carries the whole path: project commands, dependency-aware workspaces, test profiles, deterministic time, verified cache management, broad profiling, AOT native objects, live debugging, and the signed registry trust chain."],
    command: `niv new <project>          niv add <package> <version>
niv dev [project]          niv check <path>
niv test [path]            niv test --time <unix> [path]
niv test --property        niv test --fuzz-smoke
niv bench [path]           niv cache list [project]
niv cache prune [project]  niv authority report [project]
niv authority check [project]
niv authority lock [project]
niv build [project]        niv build --aot <path>
niv explain <path>         niv ship [project]
niv workspace <action>     niv package verify <archive>
niv install --trusted <registry> <root-key>
niv install --offline      niv registry verify-release …
niv trust keygen|authorize|attest|sign-status|sign-advisory
niv fmt --check <path>     niv lsp
niv dap                    niv repl
niv debug <path>           niv help`,
  },
];

export function DocsExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("quickstart");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? sections.filter((section) => `${section.id} ${section.title} ${section.group} ${section.summary} ${section.search}`.toLowerCase().includes(needle)) : sections;
  }, [query]);
  const current = filtered.find((section) => section.id === active) ?? filtered[0] ?? sections[0];
  const currentIndex = sections.findIndex((section) => section.id === current.id);
  const previous = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return <div className="shell docs-layout">
    <aside className="docs-sidebar">
      <label className="doc-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search documentation</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search docs" /></label>
      <p className="doc-count">{filtered.length} of {sections.length} detailed guides</p>
      <div className="doc-mobile-picker"><label htmlFor="doc-topic">Choose a guide</label><select id="doc-topic" value={current.id} onChange={event=>setActive(event.target.value)} disabled={!filtered.length}>{filtered.map(section=><option key={section.id} value={section.id}>{section.group} — {section.title}</option>)}</select></div><nav aria-label="Documentation sections">{filtered.length ? filtered.map((section) => <button className={current.id === section.id ? "active" : ""} key={section.id} aria-current={current.id === section.id ? "page" : undefined} onClick={() => setActive(section.id)}><span>{section.group}</span>{section.title}</button>) : <p className="no-results">No sections match “{query}”.</p>}</nav>
    </aside>
    <article className="docs-content" key={current.id} hidden={!filtered.length}>
      <span className="doc-group">{current.group}</span><h2>{current.title}</h2><p className="doc-summary">{current.summary}</p>
      <div className="doc-body">{current.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{current.nivren ? <pre tabIndex={0}><SyntaxCode code={current.nivren} /></pre> : null}{current.command ? <pre tabIndex={0}><SyntaxCode code={current.command} language="shell" /></pre> : null}{current.checks ? <><h3>Production checks</h3><ul>{current.checks.map((check) => <li key={check}>{check}</li>)}</ul></> : null}{current.id === "packages" ? <p>Explore the <Link className="inline-code" href="/packages">official package guides</Link> for APIs, failures, performance notes, and release checks.</p> : null}</div>
      <div className="doc-source">Normative behavior is defined by the frozen language specification — Edition 6 adds no syntax — and the source-controlled standard-library, bytecode, package, embedding, and Wasm specifications.</div>
      <nav className="doc-pager" aria-label="Previous and next documentation sections">{previous ? <button type="button" onClick={() => {setQuery(""); setActive(previous.id);}}><span>Previous</span>{previous.title}</button> : <span />}{next ? <button type="button" onClick={() => {setQuery(""); setActive(next.id);}}><span>Next</span>{next.title}</button> : <span />}</nav>
    </article>
    {!filtered.length && <div className="docs-empty" role="status"><h2>No guides found.</h2><p>Try a language feature, command, or topic.</p><button type="button" onClick={()=>setQuery("")}>Clear search</button></div>}
  </div>;
}
