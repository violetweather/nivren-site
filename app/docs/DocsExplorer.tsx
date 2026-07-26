"use client";

import { useMemo, useState } from "react";

type Section = { id: string; title: string; group: string; summary: string; body: React.ReactNode; search: string };

const sections: Section[] = [
  {
    id: "quickstart", title: "Quickstart", group: "Start here", summary: "Check and run your first Nivren program.", search: "install run check hello first program cli",
    body: <><p>Create a file named <code className="inline-code">hello.niv</code>, then check it before running it.</p><pre><code>{`let name: String = "Nivren"
print("Hello, " + name + "!")`}</code></pre><pre><code>{`niv check hello.niv
niv run hello.niv`}</code></pre><p>The checker reports syntax, name, type, and exhaustiveness errors without executing your program.</p></>
  },
  {
    id: "values", title: "Values & types", group: "Language", summary: "Numbers, strings, booleans, arrays, and nullability.", search: "int float string bool null array types immutable let var overflow optional",
    body: <><p>Nivren has signed 64-bit <code className="inline-code">Int</code>, binary64 <code className="inline-code">Float</code>, Unicode <code className="inline-code">String</code>, <code className="inline-code">Bool</code>, homogeneous arrays, functions, records, enums, and results.</p><pre><code>{`let answer: Int = 42
let ratio: Float = 0.75
let names: [String] = ["Ada", "Grace"]
var attempts: Int = 0`}</code></pre><p><code className="inline-code">let</code> is immutable. <code className="inline-code">var</code> allows reassignment without changing the binding&apos;s type. Integers trap overflow in every build.</p><h3>Nullable values</h3><pre><code>{`let label: String? = null
let shown: String = label ?? "untitled"`}</code></pre><p>Types are non-null by default. Add <code className="inline-code">?</code> explicitly and use <code className="inline-code">??</code> to provide a non-null fallback.</p></>
  },
  {
    id: "functions", title: "Functions & closures", group: "Language", summary: "Typed functions, recursion, and lexical capture.", search: "function fun parameters return closure recursion lexical scope",
    body: <><p>Functions can declare parameter and return types. Closures capture their lexical environment.</p><pre><code>{`fun makeCounter(start: Int) {
    var value: Int = start
    fun next() -> Int {
        value = value + 1
        return value
    }
    return next
}`}</code></pre><p>Calls are checked for arity and type before execution. Return paths must agree with the declared result type.</p></>
  },
  {
    id: "control", title: "Control flow", group: "Language", summary: "Conditionals, loops, iteration, and matching.", search: "if else while for match loop control exhaustive",
    body: <><p>Conditions require booleans; Nivren has no implicit truthiness. <code className="inline-code">for</code> iterates arrays and Unicode strings.</p><pre><code>{`for (value in [2, 3, 5, 7]) {
    if (value > 3) {
        print(value)
    }
}`}</code></pre><p>Pattern matches over sealed enums and typed results must be exhaustive, turning forgotten cases into checker errors.</p></>
  },
  {
    id: "data", title: "Records, enums & Result", group: "Language", summary: "Nominal data and explicit failure paths.", search: "record struct enum sealed result ok err match errors",
    body: <><pre><code>{`record User { name: String, active: Bool }
enum State { Idle, Running, Failed }

let user = User("Mira", true)
let state: State = State.Running`}</code></pre><p>Records are nominal, not shape-compatible. Sealed enums define a closed set of variants. <code className="inline-code">Result&lt;T, E&gt;</code> carries typed success or failure payloads using <code className="inline-code">ok(value)</code> and <code className="inline-code">err(value)</code>.</p></>
  },
  {
    id: "modules", title: "Modules & projects", group: "Projects", summary: "Private-by-default modules and strict manifests.", search: "module import export project manifest niv.toml private public",
    body: <><p>Every file is a module. Members stay private unless named in an export list.</p><pre><code>{`// math.niv
fun double(value: Int) -> Int { return value * 2 }
export { double }

// main.niv
import "math.niv"
print(math.double(21))`}</code></pre><p>Projects use a strict <code className="inline-code">niv.toml</code> containing package name, exact version, entry source, and exact dependencies.</p></>
  },
  {
    id: "packages", title: "Packages & registries", group: "Projects", summary: "Deterministic packages with locked identities.", search: "package registry install lock checksum provenance security dependencies",
    body: <><p>Dependencies use exact versions. Installation resolves the complete graph, verifies immutable archives, and writes SHA-256 identities to <code className="inline-code">niv.lock</code>.</p><pre><code>{`niv install /path/to/registry .
niv install --trusted https://registry.example root.pub .
niv package .
niv package verify target/my-app-1.0.0.nivpkg`}</code></pre><p>Trusted public registries add signed publishing provenance, authorization, advisories, revocation, and generation rollback protection.</p></>
  },
  {
    id: "stdlib", title: "Standard library", group: "Applications", summary: "Files, processes, JSON, networking, TLS, and time.", search: "standard library file path process env time json tcp http tls log sockets",
    body: <><p>The application standard library provides typed boundaries for files, paths, environment variables, processes, monotonic and wall time, strict JSON, TCP, HTTP, certificate-verified TLS, and structured logging.</p><pre><code>{`let document = std.json.compact("{\\"ready\\":true}")
let response = std.http.get("https://example.com", 5.0)
match (response) {
    Ok(body) => print(body),
    Err(problem) => std.log.error(problem)
}`}</code></pre><p>Operations that can fail return typed results instead of hiding exceptions.</p></>
  },
  {
    id: "concurrency", title: "Structured tasks", group: "Applications", summary: "Cancellation, deadlines, channels, and bounded work.", search: "async concurrency tasks cancellation deadline channels blocking executor",
    body: <><p>Tasks are structured: parents own child lifetimes, cancellation is cooperative, deadlines are explicit, and bounded channels apply backpressure.</p><pre><code>{`let channel = std.channel.create(8)
fun produce() -> Int {
    let sent = std.channel.send(channel, 42, 2.0)
    return 1
}
let task = std.task.spawn(produce)
let received = std.channel.receive(channel, 2.0)
let completed = std.task.await(task)`}</code></pre><p>Blocking work runs through an isolated executor instead of silently occupying task workers.</p></>
  },
  {
    id: "runtime", title: "Bytecode, GC & JIT", group: "Runtime", summary: "Portable execution with a native hot path.", search: "runtime vm bytecode verifier garbage collector gc jit native performance bundle",
    body: <><p>Source compiles to versioned, verified bytecode with source maps and call-frame metadata. Application bundles are self-contained and portable across Nivren runtimes.</p><pre><code>{`niv build .
niv disasm target/my-app.nivb
niv run target/my-app.nivb`}</code></pre><p>A precise concurrent generational collector manages closures and cycles. Hot eligible integer functions tier through Cranelift while preserving overflow checks.</p></>
  },
  {
    id: "tooling", title: "Developer tooling", group: "Tools", summary: "Format, test, debug, profile, cover, and document.", search: "formatter fmt test debugger profile coverage lsp vscode docs migration tools",
    body: <><pre><code>{`niv fmt --check .
niv test .
niv debug app.niv
niv profile app.niv
niv coverage app.niv
niv doc .
niv migrate --from 0.9 .
niv lsp`}</code></pre><p>The language server powers first-party VS Code diagnostics, completion, and formatting. The debugger supports stepping, breakpoints, scopes, and variable inspection.</p></>
  },
  {
    id: "cli", title: "CLI reference", group: "Tools", summary: "The complete command surface at a glance.", search: "cli command run check build install package registry disasm debug profile coverage fmt doc migrate test repl lsp version help",
    body: <><div className="cli-grid">{[
      ["run", "Run source, bytecode, or a project"], ["check", "Check without executing"], ["build", "Build a project bundle"], ["install", "Resolve and verify dependencies"], ["package", "Create or verify a package"], ["registry", "Publish, fetch, serve, and verify"], ["disasm", "Inspect verified bytecode"], ["debug", "Start the source debugger"], ["profile", "Measure runtime operations"], ["coverage", "Report source-line coverage"], ["fmt", "Format or verify formatting"], ["doc", "Generate public API docs"], ["migrate", "Upgrade older source"], ["test", "Run language-native tests"], ["repl", "Open the interactive shell"], ["lsp", "Start the language server"],
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
  const current = sections.find(section => section.id === active) ?? filtered[0] ?? sections[0];

  return (
    <div className="shell docs-layout">
      <aside className="docs-sidebar">
        <label className="doc-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search documentation</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search docs" /></label>
        <nav aria-label="Documentation sections">
          {filtered.length ? filtered.map(section => <button className={current.id === section.id ? "active" : ""} key={section.id} onClick={() => setActive(section.id)}><span>{section.group}</span>{section.title}</button>) : <p className="no-results">No sections match “{query}”.</p>}
        </nav>
      </aside>
      <article className="docs-content" key={current.id}>
        <span className="doc-group">{current.group}</span>
        <h2>{current.title}</h2>
        <p className="doc-summary">{current.summary}</p>
        <div className="doc-body">{current.body}</div>
        <div className="doc-source">Normative behavior is defined by the Edition 1 specifications in the source repository.</div>
      </article>
    </div>
  );
}
