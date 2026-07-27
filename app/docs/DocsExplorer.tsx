"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Section = { id: string; title: string; group: string; summary: string; body: React.ReactElement; search: string };

const sections: Section[] = [
  {
    id: "install", title: "Guided installation", group: "Start here", summary: "Install the right binary and configure your tools automatically.", search: "install setup path vscode mac linux windows automatic guided",
    body: <><p>The guided installer detects your operating system and CPU, verifies the official archive, and asks before updating PATH or installing VS Code support.</p><h3>macOS and Linux</h3><pre><code>{`curl --proto '=https' --tlsv1.2 -fsSLO \\
  https://raw.githubusercontent.com/violetweather/nivren/main/install/install.sh
sh install.sh`}</code></pre><h3>Windows PowerShell</h3><pre><code>{`Invoke-WebRequest https://raw.githubusercontent.com/violetweather/nivren/main/install/install.ps1 -OutFile install.ps1
Set-ExecutionPolicy -Scope Process Bypass
.\\install.ps1`}</code></pre><p>For automated setups, use <code className="inline-code">sh install.sh --yes</code> or <code className="inline-code">.\\install.ps1 -Yes</code>. Remove a managed installation with <code className="inline-code">sh install.sh --uninstall</code> or <code className="inline-code">.\\install.ps1 -Uninstall</code>; both refuse unmarked or unsafe roots. Manual archives remain available on the Downloads page.</p></>
  },
  {
    id: "quickstart", title: "Quickstart", group: "Start here", summary: "Check and run your first Nivren program.", search: "install run check hello first program cli",
    body: <><p>Create one standard project, develop it under explicit policy, and ship the same layout. The generated project includes a strict manifest, source directory, tests, and a place for generated documentation.</p><pre><code>{`niv new hello-nivren
cd hello-nivren
niv dev
niv test
niv ship`}</code></pre><p><code className="inline-code">ship</code> checks, tests, documents, packages, and emits a directly executable standalone application. It never publishes externally.</p></>
  },
  {
    id: "program-shape", title: "Anatomy of a program", group: "Start here", summary: "Read a complete Edition 3 program from imports to handled output.", search: "program anatomy syntax use expose define needs result choose show example",
    body: <><p>A Nivren file reads from declarations into intent. Imports are explicit, bindings default to immutable, effectful functions publish their authority, and failures stay in the return type.</p><pre><code>{`use "@nivren_validation"

shape Signup { name: String, age: Int }

define welcome(input: Signup) gives Result<String, nivren_validation.Violation> {
    keep name = nivren_validation.required("name", input.name) or give
    keep age = nivren_validation.range("age", input.age, 13, 120) or give
    keep checked_age = age
    give ok(name)
}

keep result = welcome(Signup("Mira", 24))
choose result {
    Ok(message) => show(message),
    Err(problem) => show(problem.message)
}`}</code></pre><h3>How to read it</h3><p><code className="inline-code">use</code> names a module, <code className="inline-code">shape</code> creates a nominal record, <code className="inline-code">define</code> declares a checked function, and <code className="inline-code">or give</code> forwards the exact error payload. The final <code className="inline-code">choose</code> is exhaustive, so adding a result variant cannot silently fall through.</p><h3>Source conventions</h3><p>Files use UTF-8, newline-separated statements, braces for explicit scopes, and nested block comments. The formatter owns whitespace, while names and intent words remain ordinary readable text.</p></>
  },
  {
    id: "errors", title: "Results, errors & recovery", group: "Start here", summary: "Model expected failure as data and preserve context without exceptions.", search: "result error recovery ok err or give choose typed failure context nullable",
    body: <><p>Recoverable operations return <code className="inline-code">Result&lt;Value, Problem&gt;</code>. There is no invisible exception channel: a caller must propagate, transform, or exhaustively handle the error.</p><pre><code>{`define load(path: String) gives Result<String, String> needs FileRead {
    keep bytes = std.files.read(path, 1048576) or give
    give std.bytes.to_string(bytes)
}

choose load("settings.json") {
    Ok(text) => show(text),
    Err(problem) => std.log.error(problem)
}`}</code></pre><h3>Propagation</h3><p><code className="inline-code">expression or give</code> unwraps success and immediately returns the same typed error on failure. It is valid only where the surrounding function&apos;s result type can carry that error.</p><h3>Optional is not failure</h3><p>Use <code className="inline-code">Value?</code> and <code className="inline-code">none</code> for absence; use <code className="inline-code">Result</code> when the reason matters. <code className="inline-code">??</code> supplies an explicit nullable fallback, while <code className="inline-code">choose</code> keeps rich failures available.</p><h3>Cleanup</h3><p><code className="inline-code">using</code> closes owned resources on success, propagated error, early return, and cancellation. Cleanup errors are reported according to the resource contract instead of being discarded behind a destructor.</p></>
  },
  {
    id: "values", title: "Values & types", group: "Language", summary: "Numbers, strings, booleans, arrays, and nullability.", search: "int float string bool none array types immutable keep change overflow optional",
    body: <><p>Nivren has signed 64-bit <code className="inline-code">Int</code>, binary64 <code className="inline-code">Float</code>, Unicode <code className="inline-code">String</code>, <code className="inline-code">Bool</code>, homogeneous arrays, functions, shapes, choices, and results.</p><pre><code>{`keep answer: Int = 42
keep ratio: Float = 0.75
keep names: [String] = ["Ada", "Grace"]
change attempts: Int = 0`}</code></pre><p><code className="inline-code">keep</code> is immutable. <code className="inline-code">change</code> allows reassignment without changing the binding&apos;s type. Integers trap overflow in every build.</p><h3>Nullable values</h3><pre><code>{`keep label: String? = none
keep shown: String = label ?? "untitled"`}</code></pre><p>Types are non-null by default. Add <code className="inline-code">?</code> explicitly and use <code className="inline-code">??</code> to provide a non-null fallback.</p></>
  },
  {
    id: "functions", title: "Functions, protocols & closures", group: "Language", summary: "Typed functions, explicit protocols, recursion, and lexical capture.", search: "function define parameters gives give generic protocol adopt coherence marker closure recursion lexical scope",
    body: <><p>Functions can declare parameters, results, generic constraints, and required authority. Closures capture their lexical environment.</p><pre><code>{`define add<Value: Number>(left: Value, right: Value) gives Value {
    give left + right
}

protocol Named {
    define name(value: Self) gives String
}
shape User { name: String }
define user_name(value: User) gives String { give value.name }
adopt Named for User { name = user_name }
define present<Value: Named>(value: Value) gives String {
    give Named.name(value)
}

define makeCounter(start: Int) {
    change value: Int = start
    define next() gives Int {
        value = value + 1
        give value
    }
    give next
}`}</code></pre><p>Calls are checked for arity and type before execution. User protocols may remain markers or declare required members. Adoptions map every member to a signature- and capability-compatible function; <code className="inline-code">Named.name(value)</code> is statically constrained and dispatches coherently by nominal type. The orphan ownership rule and duplicate checks prevent conflicting package implementations, built-in safety protocols stay sealed, and qualified identities survive package boundaries. Every <code className="inline-code">give</code> path must agree with the declared result type.</p></>
  },
  {
    id: "control", title: "Control flow", group: "Language", summary: "Conditionals, loops, iteration, and choosing.", search: "when otherwise repeat each within choose loop control exhaustive",
    body: <><p>Conditions require booleans; Nivren has no implicit truthiness. <code className="inline-code">each</code> iterates arrays and Unicode strings.</p><pre><code>{`each value within [2, 3, 5, 7] {
    when value > 3 {
        show(value)
    }
}`}</code></pre><p><code className="inline-code">choose</code> expressions over sealed choices and typed results must be exhaustive, turning forgotten cases into checker errors.</p></>
  },
  {
    id: "iterators", title: "Iterator values", group: "Language", summary: "Build a lazy source, adapt it, then consume it exactly once.", search: "iterator iter from range lazy source next take skip transform select chain collect count fold find any every each single pass bounded",
    body: <><pre><code>{`define double(value: Int) gives Int { give value * 2 }
define useful(value: Int) gives Bool { give value > 4 }
define add(total: Int, value: Int) gives Int { give total + value }

keep source = std.iter.from([1, 2, 3, 4, 5])
keep mapped = std.iter.transform(source, double)
keep selected = std.iter.select(mapped, useful)
keep page = std.iter.take(std.iter.skip(selected, 1), 2)
keep values: [Int] = std.iter.collect(page)
keep total = std.iter.fold(std.iter.from(values), 0, add)
keep lazy_numbers = std.iter.range(0, 1000000, 1)`}</code></pre><p><code className="inline-code">Iterator&lt;T&gt;</code> is stateful and single-pass. <code className="inline-code">std.iter.range</code> is a lazy, end-exclusive numeric source that stores only its cursor. <code className="inline-code">std.iter.lines(file, maximum)</code> lazily yields typed line results from an open reader, normalizes CRLF, drains oversized lines, and continues without loading the file. <code className="inline-code">std.iter.tcp_lines(stream, maximum, timeout)</code> applies the same bounded, recoverable model to CRLF-framed network protocols, with a finite deadline for every pull. Typed <code className="inline-code">std.iter.chain</code>, <code className="inline-code">std.iter.count</code>, <code className="inline-code">std.iter.fold</code>, <code className="inline-code">std.iter.find</code>, <code className="inline-code">std.iter.any</code>, and <code className="inline-code">std.iter.every</code> cover common terminal queries; predicate terminals short-circuit and preserve the unvisited suffix. Transform and select callbacks are truly lazy: creating a stage invokes nothing, and each downstream request pulls only as far as needed through the shared cursor. Callback capabilities stay visible, adapter depth is capped, and materializing operations refuse unbounded work. Iterators can also feed <code className="inline-code">each value within stream</code>, but cannot cross task or channel boundaries.</p></>
  },
  {
    id: "data", title: "Data, shapes & choices", group: "Language", summary: "Exact numbers, binary protocols, nominal schemas, typed JSON, and explicit failure paths.", search: "bigint decimal fixed width signed unsigned u64 exact binary endian codec bytes shape schema json decode stream choice sealed result ok err choose errors",
    body: <><pre><code>{`keep price = std.decimal.parse("19.99")
keep huge = std.bigint.parse("1000000000000000000000000")
keep byte = std.u8.from_int(255)

shape User { name: String, active: Bool }
choice State { Idle, Running, Failed(String) }
shape Pair<Left, Right> { left: Left, right: Right }
choice Maybe<Value> { Some(Value), None }

keep user = User("Mira", yes)
keep pair: Pair<String, Int> = Pair("age", 42)
keep optional: Maybe<Int> = Maybe.Some(pair.right)
keep state: State = State.Failed("network unavailable")
keep message = choose state {
    Idle => "idle",
    Running => "running",
    Failed(problem) => problem
}
keep schema = std.reflect.schema(User)
keep decoded: Result<User, String> = std.json.decode(
    User, "{\\"name\\":\\"Mira\\",\\"active\\":true}"
)

keep header = std.binary.u16_be(std.u16.from_int(3) or give)
keep version = std.binary.read_u16_be(header, 0)`}</code></pre><p><code className="inline-code">Decimal</code> keeps base-10 arithmetic exact, <code className="inline-code">BigInt</code> grows beyond machine limits, and fixed-width signed/unsigned types make protocol layouts explicit; none coerce implicitly. <code className="inline-code">std.binary</code> encodes and decodes explicit big- or little-endian protocol fields. Reads inspect immutable bytes without copying, enforce complete bounds, and report failures through <code className="inline-code">Result</code>; concatenation is capped at 16 MiB. Shapes are nominal and double as strict JSON schemas: missing, unexpected, nested, choice, and numeric-range mismatches become typed errors. Generic data declarations infer checked type arguments: <code className="inline-code">Pair&lt;String, Int&gt;</code> and <code className="inline-code">Maybe&lt;Int&gt;</code> stay nominally distinct. Safe reflection exposes deterministic declaration metadata without addresses or runtime layout. Sealed choices define a closed set of variants; a variant such as <code className="inline-code">Failed(String)</code> is a one-argument typed constructor and its exhaustive <code className="inline-code">choose</code> arm binds the payload. Recursive payloads such as <code className="inline-code">Array([Response])</code> support protocol trees without unsafe casts. <code className="inline-code">Result&lt;T, E&gt;</code> carries typed success or failure payloads using <code className="inline-code">ok(value)</code> and <code className="inline-code">err(value)</code>.</p></>
  },
  {
    id: "modules", title: "Modules & projects", group: "Projects", summary: "Private-by-default modules and strict manifests.", search: "module use expose project manifest niv.toml private public",
    body: <><p>Every file is a module. Members stay private unless named in an <code className="inline-code">expose</code> list.</p><pre><code>{`// math.niv
define double(value: Int) gives Int { give value * 2 }
expose { double }

// main.niv
use "math.niv"
show(math.double(21))`}</code></pre><p>Projects use a strict <code className="inline-code">niv.toml</code> containing package name, exact version, entry source, and exact dependencies.</p></>
  },
  {
    id: "packages", title: "Packages & registries", group: "Projects", summary: "Deterministic packages with locked identities.", search: "package registry install lock checksum provenance security dependencies",
    body: <><p>Dependencies use exact versions. Installation verifies immutable archives and records SHA-256 identities in <code className="inline-code">niv.lock</code>. All twenty-two packages in the official catalog are tested, documented, rebuilt, installed, and imported together before release. Highlights include AWS Signature Version 4, OIDC/PKCE, W3C tracing, Prometheus metrics, columnar tables, matrices, RGB raster and PCM16 audio interchange, SVG interfaces, bounded CSV, algorithm-pinned HS256/Ed25519 authentication, opaque-key AEAD, Argon2id secrets, deterministic compression, and live-matrix Redis.</p><pre><code>{`niv registry search web /path/to/registry
niv install /path/to/registry .
niv install --trusted https://registry.example root.pub .
niv package .
niv package verify target/my-app-1.0.0.nivpkg`}</code></pre><p>Search is deterministic and bounded. Trusted public registries add signed publishing provenance, authorization, advisories, revocation, and generation rollback protection.</p></>
  },
  {
    id: "package-authoring", title: "Authoring a package", group: "Projects", summary: "Design a small public surface, test it, document it, and produce a reproducible archive.", search: "author package publish version expose api docs semantic reproducible archive registry",
    body: <><p>A package is a strict project whose entry module exposes its supported API. Everything else stays private, letting maintainers refactor without expanding compatibility obligations.</p><pre><code>{`[package]
name = "acme_slug"
version = "1.0.0"
entry = "src/main.niv"

[dependencies]
nivren_validation = "1.0.0"`}</code></pre><pre><code>{`// src/main.niv
define slug(value: String) gives Result<String, String> {
    give std.text.lower(value)
}

expose { slug }`}</code></pre><h3>Release checklist</h3><p>Run <code className="inline-code">niv check .</code>, <code className="inline-code">niv test .</code>, <code className="inline-code">niv doc .</code>, then <code className="inline-code">niv package .</code>. Verify the resulting archive independently with <code className="inline-code">niv package verify</code>. A registry publication binds the exact version to content identity and provenance; the same version cannot later mean different bytes.</p><h3>Compatibility surface</h3><p>Exposed declarations, parameter and result types, declared capabilities, error payloads, deterministic ordering, and documented resource ceilings are public behavior. Additive APIs usually fit a minor release; removed or narrowed behavior requires a major release.</p><p>Browse the <Link className="inline-code" href="/packages">official package guides</Link> for concrete patterns covering pure libraries, effectful adapters, cryptography, protocols, and typed data.</p></>
  },
  {
    id: "stdlib", title: "Standard library", group: "Applications", summary: "Files, tables, encoding, cryptography, typed streams, zoned time, HTTP/TLS, and WebSockets.", search: "standard library file path process env datetime timezone time csv tables hex base64 base64url encoding crypto random argon2 password sha256 hmac constant time json schema ndjson stream tcp http tls websocket log sockets",
    body: <><p>The standard library provides typed boundaries for deterministic files, paths, explicit bounded text splitting and concatenation, finite float parsing, bounded SHA-256/HMAC protocol primitives, capability-checked OS entropy, bounded Argon2id password storage, opaque zeroized <code className="inline-code">SecretKey</code> values and ChaCha20-Poly1305 authenticated encryption, environment, processes, immutable IANA-zoned DateTime values, shape-derived JSON and bounded newline-delimited streams, TCP clients/listeners with exact-byte and CRLF framing, distinct certificate-verified raw <code className="inline-code">TlsStream</code> connections, bounded HTTP and WebSocket clients/servers, native hosts, and structured logs.</p><pre><code>{`define fetch(url: String) gives Result<String, String> needs Network {
    keep response = std.web.request(
        "GET", url, std.web.headers(), "", 5.0, 1048576
    ) or give
    give ok(std.map.get(response, "status") ?? "missing")
}

keep response = fetch("https://example.com")
choose response {
    Ok(status) => show(status),
    Err(problem) => std.log.error(problem)
}`}</code></pre><p><code className="inline-code">std.files.read_async</code> and <code className="inline-code">write_async</code> run capped work on a bounded executor, returning ordinary structured tasks and a typed saturation error instead of growing a hidden queue. <code className="inline-code">std.json.read_next_as(Event, file, maximum)</code> validates one record at a time with bounded memory and returns <code className="inline-code">none</code> at clean end-of-file. Oversized records are drained without losing stream framing. <code className="inline-code">std.net.write_some</code> exposes bounded partial-write progress instead of hiding backpressure. <code className="inline-code">std.net.ready_any</code> registers up to 1024 streams in one OS poll and returns a deterministic ready index; <code className="inline-code">std.net.read_ready</code> and <code className="inline-code">std.net.write_ready</code> turn readiness into bounded high-level adapters. Listener accepts use the same reactor without sleep polling. WebSocket upgrades use <code className="inline-code">std.web.websocket_connect</code>, certificate-verified <code className="inline-code">websocket_secure_connect</code>, or <code className="inline-code">websocket_accept</code>. Secure servers own a closable <code className="inline-code">TlsListener</code> created by <code className="inline-code">std.web.websocket_secure_listen</code>; <code className="inline-code">std.web.websocket_secure_accept</code> performs a bounded TLS handshake and upgrade. <code className="inline-code">std.web.tls_options()</code> supports safe TLS version floors, bounded ALPN, and client trust roots without a verification-bypass switch. Clients set <code className="inline-code">client_certificate_pem</code> and <code className="inline-code">client_private_key_pem</code> together for mTLS; servers set <code className="inline-code">client_auth</code> to required with <code className="inline-code">client_ca_pem</code>. Certificate, key, and CA inputs are bounded, side-specific, and validated as pairs before connecting or binding. Text sends, receives, masking, framing, cleanup, and message bounds remain explicit and checked. Operations that can fail return typed results instead of hiding exceptions.</p></>
  },
  {
    id: "capabilities", title: "Needs, grants & limits", group: "Applications", summary: "Make authority visible in code and narrow it at runtime.", search: "needs capability grant path host memory instructions native random entropy policy sandbox",
    body: <><p><code className="inline-code">needs</code> is checked transitively, including callbacks and started work. <code className="inline-code">niv.toml</code> separately authorizes runtime effects.</p><pre><code>{`[capabilities]
FileRead = "path:./data"
Network = "host:api.example.com,*.cdn.example.com;method:GET,POST"
Environment = "prefix:NIVREN_"
Process = "command:git;arg0:status"
Native = "kind:database"
Random = "allow"

[limits]
instructions = "1000000"
memory_bytes = "67108864"`}</code></pre><p>Filesystem and dynamic-library grants can name approved paths. Network policy can select exact or wildcard host alternatives and AND-compose allowed HTTP methods; process policy can select command alternatives and require an exact first argument. Environment and native-host authority can be narrowed to names, prefixes, and handle kinds. Empty, duplicate, unknown, or incomplete policy clauses are rejected before execution. Whole-capability <code className="inline-code">allow</code> remains explicit. Instruction and memory budgets are shared by the complete structured task tree and embedded in standalone applications.</p></>
  },
  {
    id: "concurrency", title: "Structured tasks", group: "Applications", summary: "Cancellation, deadlines, channels, and bounded work.", search: "async concurrency tasks cancellation deadline channels blocking executor",
    body: <><p>Tasks are structured: parents own child lifetimes, cancellation is cooperative, deadlines are explicit, bounded channels apply backpressure, scoped lock guards serialize larger shared updates, and transferable <code className="inline-code">AtomicInt</code> values provide linearizable counters. A shared wake-driven runtime event loop handles completion, deadlines, and races without fixed-interval polling.</p><pre><code>{`keep channel = std.channels.create(8)
define produce() gives Int needs Channel {
    keep sent = std.channels.send(channel, 42, 2.0)
    give 1
}
keep task = start produce
keep received = std.channels.receive(channel, 2.0)
keep completed = wait task

keep counter = std.atomics.create(0)
keep previous = std.atomics.add(counter, 1) or give`}</code></pre><p>Use <code className="inline-code">together</code> and <code className="inline-code">race</code> for owned groups. Atomic load/store/swap/checked-add/compare-exchange operations are sequentially consistent and preserve their semantics through the portable locked fallback. Use <code className="inline-code">std.locks.acquire</code> with <code className="inline-code">using</code> for compound shared state. Work and acquired guards cannot silently outlive their owner.</p></>
  },
  {
    id: "transactions", title: "Scoped transactions", group: "Applications", summary: "Commit deliberately; otherwise `using` rolls back.", search: "transaction commit rollback close using map staged deterministic resource",
    body: <><pre><code>{`define update() gives Result<Map<String, Int>, String> {
    keep original = std.map.single("count", 1)
    keep transaction = std.transactions.begin(original)
    using changes = transaction {
        keep written = std.transactions.set(changes, "count", 2) or give
        give std.transactions.commit(changes)
    }
}`}</code></pre><p><code className="inline-code">Transaction&lt;K,V&gt;</code> stages insertion-ordered map updates under the shared memory budget. Commit returns the changed map; rollback returns the original. Closing twice is safe, every other after-close operation is an error, and leaving <code className="inline-code">using</code> without a commit always rolls back—even through <code className="inline-code">give</code>, <code className="inline-code">or give</code>, or a runtime failure.</p></>
  },
  {
    id: "native-libraries", title: "Dynamic C libraries", group: "Applications", summary: "Cross a visible, owned native boundary.", search: "native c abi dynamic library ffi int64 double path grant unsafe",
    body: <><p><code className="inline-code">NativeLibrary</code> is opaque, scoped, and never transferable. Opening, calling, and closing all require <code className="inline-code">needs Native</code>; a project can restrict opening to an approved path. Alongside fixed integer and float calls, <code className="inline-code">call_buffer</code> lends runtime-owned input/output memory through one bounded pointer/length ABI and rejects invalid returned lengths.</p><pre><code>{`define add(path: String) gives Result<Int, String> needs Native {
    keep opened = std.native.open(path) or give
    using library = opened {
        give std.native.call_int(library, "nivren_add", [20, 22])
    }
}`}</code></pre><p>Edition 3 exposes finite zero-to-six-argument all-<code className="inline-code">int64_t</code> and all-<code className="inline-code">double</code> C signatures. Symbols never outlive a call, closing twice is safe, and after-close calls return typed errors. The export must actually match the chosen signature: <code className="inline-code">Native</code> marks this as a deliberate trust boundary.</p></>
  },
  {
    id: "runtime", title: "Bytecode, GC & JIT", group: "Runtime", summary: "Portable execution with a native hot path.", search: "runtime vm bytecode verifier garbage collector gc jit native performance bundle",
    body: <><p>Source compiles to versioned, verified bytecode with source maps and call-frame metadata. Standalone applications embed that bundle and the project&apos;s authority/resource policy.</p><pre><code>{`niv build .
niv build --standalone .
niv disasm target/my-app.nivb
niv run target/my-app.nivb`}</code></pre><p>A precise concurrent generational collector manages closures and cycles. Hot eligible integer functions tier to native code while preserving overflow checks.</p></>
  },
  {
    id: "wasm", title: "WebAssembly, browsers & WASI", group: "Runtime", summary: "Embed the Edition 3 compiler and portable VM in browsers or sandboxed WASI hosts.", search: "webassembly wasm wasi browser javascript sdk playground embed compiler portable vm abi memory guest host",
    body: <><p>The release includes reproducible <code className="inline-code">wasm32-wasip1</code> and zero-import browser modules for editors, playgrounds, build tools, and sandboxed application hosts. Both check, format, compile, and run Edition 3 through a versioned owned-memory ABI with a 16 MiB input/result ceiling and panic isolation.</p><pre><code>{`rustup target add wasm32-wasip1
cargo build -p nivren-wasm --target wasm32-wasip1 --release --locked
node tools/test_wasm_host.mjs

rustup target add wasm32-unknown-unknown
cargo build -p nivren-wasm --target wasm32-unknown-unknown --release --locked
node tools/test_wasm_browser.mjs`}</code></pre><p>The public <code className="inline-code">Nivren</code> JavaScript SDK owns allocation, copying, and cleanup around <code className="inline-code">nivren_wasm_check</code>, <code className="inline-code">nivren_wasm_format</code>, <code className="inline-code">nivren_wasm_compile</code>, and <code className="inline-code">nivren_wasm_run</code>. Every result carries a status, length, and guest pointer; the SDK copies and frees it exactly once. Native JIT, dynamic libraries, TLS, and WebSockets report explicit errors when their host facilities are unavailable—there is no silent security downgrade.</p></>
  },
  {
    id: "containers", title: "Containers", group: "Runtime", summary: "Run the CLI in a small non-root OCI image without weakening project policy.", search: "docker container oci image non-root read-only sbom amd64 arm64 deploy",
    body: <><p>The official OCI recipe builds the release CLI into a minimal Debian image, includes certificate roots for verified TLS, runs as user/group 10001, and keeps <code className="inline-code">niv</code> as its entrypoint. Container isolation adds a boundary; Nivren capabilities and instruction/memory limits still apply inside it.</p><pre><code>{`docker pull ghcr.io/violetweather/nivren:v0.10.0-beta.6
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m ghcr.io/violetweather/nivren:v0.10.0-beta.6 version

docker build -f containers/Dockerfile -t nivren:local .
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m nivren:local version
docker run --rm -v "$PWD:/workspace" nivren:local check .`}</code></pre><p>The published amd64/arm64 OCI index carries maximal build provenance and an SBOM. The image is non-root and keeps the same explicit Nivren authority model as native installations.</p></>
  },
  {
    id: "tooling", title: "Developer tooling", group: "Tools", summary: "Format, test, debug, profile, cover, and document.", search: "formatter fmt test debugger profile coverage lsp vscode docs tools",
    body: <><pre><code>{`niv fmt --check .
niv test .
niv test --snapshots tests/niv
niv debug app.niv
niv inspect app.niv events.jsonl
niv profile app.niv
niv profile --json profile.json app.niv
niv run --crash-report crash.json app.niv
niv coverage app.niv
niv doc .
niv bindgen c messages.niv generated/messages.h
niv lsp`}</code></pre><p>JSON observations and nested source maps have stable schemas. <code className="inline-code">niv inspect</code> flushes versioned JSONL events while a program runs, including locations, operations, stack depth, variable names, final metrics, and heap counts while omitting source and variable values. Crash reports omit source, arguments, environment variables, local values, and full paths by design. The language server powers first-party VS Code diagnostics, intent-first correction hints, completion, formatting, and Unicode-correct rename that skips strings and comments. Its bounded workspace index covers open and closed modules, so exposed declarations and qualified references update together while unrelated same-named bindings remain untouched. Build tools can use the versioned Rust compiler facade or C ABI v2. Shape/choice bindings compile as C11 and C++17 views with explicit ownership. <code className="inline-code">std.host.invoke_async</code> submits a bounded native operation to the shared executor and returns an ordinary structured task with backpressure and cancellation checks; embedded program runs also receive one owned completion, cooperative cancellation, a joinable handle, and an event-loop wake callback. Scoped opaque handles keep native identifiers out of program values.</p></>
  },
  {
    id: "production-workflow", title: "Production workflow", group: "Tools", summary: "Turn a checked project into a reproducible, observable, least-authority application.", search: "production deploy release checklist ci observability profile coverage crash standalone security reproducible",
    body: <><p>The recommended workflow keeps the same project and policy from local development through release. CI should reject formatting drift, checker failures, test failures, unreviewed snapshots, dependency changes, and packaging differences.</p><pre><code>{`niv fmt --check .
niv check .
niv test .
niv coverage .
niv doc .
niv package .
niv build --standalone .`}</code></pre><h3>Before shipping</h3><ul><li>Pin every dependency exactly and review the resulting <code className="inline-code">niv.lock</code> identity.</li><li>Narrow filesystem paths, network hosts and methods, environment prefixes, process commands, and native kinds in <code className="inline-code">niv.toml</code>.</li><li>Set instruction and memory ceilings from measured production behavior, with deliberate headroom.</li><li>Exercise cancellation, deadlines, oversized input, unavailable services, and cleanup paths—not only success.</li><li>Capture coverage and profile output, and wire privacy-safe crash reports or live inspection into your operations path.</li></ul><h3>Release artifacts</h3><p><code className="inline-code">niv ship</code> is the convenient aggregate: it checks, tests, documents, packages, and creates a standalone executable without publishing externally. For web or sandboxed hosts, build the audited WASI guest; for containers, retain Nivren&apos;s project policy even when the container adds a second isolation boundary.</p><h3>Version discipline</h3><p>Edition changes protect syntax and semantic evolution. Package semantic versions protect library APIs. Application artifacts record compiler, bytecode, dependency, capability, and resource-limit inputs so a future build can explain what changed.</p></>
  },
  {
    id: "cli", title: "CLI reference", group: "Tools", summary: "The complete command surface at a glance.", search: "cli command run check build install package registry disasm debug profile coverage fmt doc test repl lsp version help",
    body: <><div className="cli-grid">{[
      ["new", "Create the standard project layout"], ["add", "Add an exact dependency"], ["dev", "Check and run a project"], ["ship", "Test, document, package, and stand alone"], ["run", "Run source, bytecode, or a project"], ["check", "Check without executing"], ["build", "Build bytecode, a standalone app, or checked native AOT objects"], ["bindgen", "Generate typed C11/C++17 schema views"], ["install", "Resolve and verify dependencies"], ["package", "Create or verify a package"], ["registry", "Search, publish, fetch, serve, and verify"], ["disasm", "Inspect verified bytecode"], ["sourcemap", "Export stable nested source mappings as JSON"], ["debug", "Start the source debugger"], ["inspect", "Stream privacy-safe live JSONL runtime events"], ["profile", "Measure runtime operations"], ["coverage", "Report source-line coverage"], ["fmt", "Format or verify formatting"], ["doc", "Generate public API docs"], ["test", "Run language-native tests"], ["repl", "Open the interactive shell"], ["lsp", "Start the language server"],
    ].map(([name, desc]) => <div key={name}><code>niv {name}</code><span>{desc}</span></div>)}</div></>
  },
];

export function DocsExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("quickstart");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sections;
    return sections.filter(section => `${section.title} ${section.group} ${section.summary} ${section.search}`.toLowerCase().includes(needle));
  }, [query]);
  const current = filtered.find(section => section.id === active) ?? filtered[0] ?? sections[0];
  const currentIndex = sections.findIndex(section => section.id === current.id);
  const previous = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return (
    <div className="shell docs-layout">
      <aside className="docs-sidebar">
        <label className="doc-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search documentation</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search docs" /></label>
        <p className="doc-count">{filtered.length} of {sections.length} detailed guides</p>
        <nav aria-label="Documentation sections">
          {filtered.length ? filtered.map(section => <button className={current.id === section.id ? "active" : ""} key={section.id} onClick={() => setActive(section.id)}><span>{section.group}</span>{section.title}</button>) : <p className="no-results">No sections match “{query}”.</p>}
        </nav>
      </aside>
      <article className="docs-content" key={current.id}>
        <span className="doc-group">{current.group}</span>
        <h2>{current.title}</h2>
        <p className="doc-summary">{current.summary}</p>
        <div className="doc-body">{current.body}</div>
        <div className="doc-source">Normative behavior is defined by the Edition 3 language, standard-library, bytecode, package, and WASM specifications in the source repository.</div>
        <nav className="doc-pager" aria-label="Previous and next documentation sections">
          {previous ? <button type="button" onClick={() => setActive(previous.id)}><span>Previous</span>{previous.title}</button> : <span />}
          {next ? <button type="button" onClick={() => setActive(next.id)}><span>Next</span>{next.title}</button> : <span />}
        </nav>
      </article>
    </div>
  );
}
