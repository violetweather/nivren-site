"use client";

import { useMemo, useState } from "react";

type Section = { id: string; title: string; group: string; summary: string; body: React.ReactNode; search: string };

const sections: Section[] = [
  {
    id: "install", title: "Guided installation", group: "Start here", summary: "Install the right binary and configure your tools automatically.", search: "install setup path vscode mac linux windows automatic guided",
    body: <><p>The guided installer detects your operating system and CPU, verifies the official archive, and asks before updating PATH or installing VS Code support.</p><h3>macOS and Linux</h3><pre><code>{`curl --proto '=https' --tlsv1.2 -fsSLO \\
  https://raw.githubusercontent.com/violetweather/nivren/main/install/install.sh
sh install.sh`}</code></pre><h3>Windows PowerShell</h3><pre><code>{`Invoke-WebRequest https://raw.githubusercontent.com/violetweather/nivren/main/install/install.ps1 -OutFile install.ps1
Set-ExecutionPolicy -Scope Process Bypass
.\\install.ps1`}</code></pre><p>For automated setups, use <code className="inline-code">sh install.sh --yes</code> or <code className="inline-code">.\\install.ps1 -Yes</code>. Manual archives remain available on the Downloads page.</p></>
  },
  {
    id: "quickstart", title: "Quickstart", group: "Start here", summary: "Check and run your first Nivren program.", search: "install run check hello first program cli",
    body: <><p>Create a file named <code className="inline-code">hello.niv</code>, then check it before running it.</p><pre><code>{`keep name: String = "Nivren"
show("Hello, " + name + "!")`}</code></pre><pre><code>{`niv check hello.niv
niv run hello.niv`}</code></pre><p>The checker reports syntax, name, type, and exhaustiveness errors without executing your program.</p></>
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
    id: "functions", title: "Functions & closures", group: "Language", summary: "Typed functions, recursion, and lexical capture.", search: "function define parameters gives give closure recursion lexical scope",
    body: <><p>Functions can declare parameter and result types. Closures capture their lexical environment.</p><pre><code>{`define makeCounter(start: Int) {
    change value: Int = start
    define next() gives Int {
        value = value + 1
        give value
    }
    give next
}`}</code></pre><p>Calls are checked for arity and type before execution. Every <code className="inline-code">give</code> path must agree with the declared result type.</p></>
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
    id: "data", title: "Shapes, choices & Result", group: "Language", summary: "Nominal data and explicit failure paths.", search: "shape choice sealed result ok err choose errors",
    body: <><pre><code>{`shape User { name: String, active: Bool }
choice State { Idle, Running, Failed }

keep user = User("Mira", yes)
keep state: State = State.Running`}</code></pre><p>Shapes are nominal, not structurally interchangeable. Sealed choices define a closed set of variants. <code className="inline-code">Result&lt;T, E&gt;</code> carries typed success or failure payloads using <code className="inline-code">ok(value)</code> and <code className="inline-code">err(value)</code>.</p></>
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
    body: <><p>Dependencies use exact versions. Installation resolves the complete graph, verifies immutable archives, and writes SHA-256 identities to <code className="inline-code">niv.lock</code>.</p><pre><code>{`niv install /path/to/registry .
niv install --trusted https://registry.example root.pub .
niv package .
niv package verify target/my-app-1.0.0.nivpkg`}</code></pre><p>Trusted public registries add signed publishing provenance, authorization, advisories, revocation, and generation rollback protection.</p></>
  },
  {
    id: "stdlib", title: "Standard library", group: "Applications", summary: "Files, processes, JSON, networking, TLS, and time.", search: "standard library file path process env time json tcp http tls log sockets",
    body: <><p>The application standard library provides typed boundaries for files, paths, environment variables, processes, monotonic and wall time, strict JSON, TCP, HTTP, certificate-verified TLS, and structured logging.</p><pre><code>{`keep document = std.json.compact("{\\"ready\\":true}")
keep response = std.http.get("https://example.com", 5.0)
choose response {
    Ok(body) => show(body),
    Err(problem) => std.log.error(problem)
}`}</code></pre><p>Operations that can fail return typed results instead of hiding exceptions.</p></>
  },
  {
    id: "concurrency", title: "Structured tasks", group: "Applications", summary: "Cancellation, deadlines, channels, and bounded work.", search: "async concurrency tasks cancellation deadline channels blocking executor",
    body: <><p>Tasks are structured: parents own child lifetimes, cancellation is cooperative, deadlines are explicit, and bounded channels apply backpressure.</p><pre><code>{`keep channel = std.channel.create(8)
define produce() gives Int {
    keep sent = std.channel.send(channel, 42, 2.0)
    give 1
}
keep task = std.task.spawn(produce)
keep received = std.channel.receive(channel, 2.0)
keep completed = std.task.await(task)`}</code></pre><p>Blocking work runs through an isolated executor instead of silently occupying task workers.</p></>
  },
  {
    id: "runtime", title: "Bytecode, GC & JIT", group: "Runtime", summary: "Portable execution with a native hot path.", search: "runtime vm bytecode verifier garbage collector gc jit native performance bundle",
    body: <><p>Source compiles to versioned, verified bytecode with source maps and call-frame metadata. Application bundles are self-contained and portable across Nivren runtimes.</p><pre><code>{`niv build .
niv disasm target/my-app.nivb
niv run target/my-app.nivb`}</code></pre><p>A precise concurrent generational collector manages closures and cycles. Hot eligible integer functions tier through Cranelift while preserving overflow checks.</p></>
  },
  {
    id: "tooling", title: "Developer tooling", group: "Tools", summary: "Format, test, debug, profile, cover, and document.", search: "formatter fmt test debugger profile coverage lsp vscode docs tools",
    body: <><pre><code>{`niv fmt --check .
niv test .
niv debug app.niv
niv profile app.niv
niv coverage app.niv
niv doc .
niv lsp`}</code></pre><p>The language server powers first-party VS Code diagnostics, completion, and formatting. The debugger supports stepping, breakpoints, scopes, and variable inspection.</p></>
  },
  {
    id: "cli", title: "CLI reference", group: "Tools", summary: "The complete command surface at a glance.", search: "cli command run check build install package registry disasm debug profile coverage fmt doc test repl lsp version help",
    body: <><div className="cli-grid">{[
      ["run", "Run source, bytecode, or a project"], ["check", "Check without executing"], ["build", "Build a project bundle"], ["install", "Resolve and verify dependencies"], ["package", "Create or verify a package"], ["registry", "Publish, fetch, serve, and verify"], ["disasm", "Inspect verified bytecode"], ["debug", "Start the source debugger"], ["profile", "Measure runtime operations"], ["coverage", "Report source-line coverage"], ["fmt", "Format or verify formatting"], ["doc", "Generate public API docs"], ["test", "Run language-native tests"], ["repl", "Open the interactive shell"], ["lsp", "Start the language server"],
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
        <div className="doc-source">Normative behavior is defined by the Edition 2 specifications in the source repository.</div>
      </article>
    </div>
  );
}
