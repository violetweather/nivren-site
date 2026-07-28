import Link from "next/link";
import { CodeWindow } from "./components/CodeWindow";

const helloCode = `keep language is String set "Nivren"
keep values is [Int] set [2, 3, 5, 7]

define add
takes {
    total is Int
    value is Int
}
gives Int
{
    give total + value
}

show("Hello, " + language + "!")
show(values through std.list.fold with {
    initial set 0
    combine set add
})`;

export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> Edition 4 product candidate</div>
          <h1>Code that reads like <em>intent.</em></h1>
          <p className="hero-lede">
            Nivren is an intent-first application language with visible authority,
            typed failure, scoped concurrency, deterministic resources, and tooling from day one.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/install">Install Nivren <span aria-hidden="true">→</span></Link>
            <Link className="button secondary" href="/docs">Read the docs</Link>
          </div>
          <div className="quick-command" aria-label="Quick install command">
            <span className="prompt">$</span>
            <code>niv version</code>
            <span className="command-result">Nivren 0.10.0-beta.6</span>
          </div>
        </div>
        <div className="hero-code">
          <div className="code-orbit orbit-one" />
          <div className="code-orbit orbit-two" />
          <CodeWindow filename="hello.niv" code={helloCode} />
        </div>
      </section>

      <section className="proof-strip">
        <div className="shell proof-grid">
          <div><strong>3 / 4</strong><span>checkpoint gates passed</span></div>
          <div><strong>7.62×</strong><span>faster startup than Node on M4</span></div>
          <div><strong>6 + WebAssembly</strong><span>native, WASI & browser targets</span></div>
          <div><strong>0</strong><span>unsafe blocks in the core VM</span></div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split-heading">
          <div>
            <span className="kicker">One language, the whole path</span>
            <h2>Small core.<br />Serious range.</h2>
          </div>
          <p>Nivren keeps ordinary code obvious while giving larger applications the boundaries, performance, and operational tools they need.</p>
        </div>
        <div className="feature-grid">
          <article className="feature feature-large feature-safety">
            <span className="feature-number">01</span>
            <div>
              <h3>Safety you can explain</h3>
              <p>Non-null types by default, checked overflow, typed results, explicit <code>needs</code>, scoped grants, and a verified bytecode boundary.</p>
              <code>{"keep answer set perform load with {} or give"}</code>
            </div>
          </article>
          <article className="feature feature-tools">
            <span className="feature-number">02</span>
            <h3>Tooling is part of the language</h3>
            <p>Formatter, checker, test and benchmark runners, DAP debugger, profiler, coverage, documentation, workspaces, LSP, and VS Code support ship together.</p>
            <div className="tool-cloud"><span>fmt</span><span>lsp</span><span>test</span><span>bench</span><span>dap</span></div>
          </article>
          <article className="feature feature-runtime">
            <span className="feature-number">03</span>
            <h3>Start simple. Get fast.</h3>
            <p>A verified bytecode VM starts immediately. Hot integer functions tier into native code, standalone apps ship directly, and the compiler plus VM run under WASI or in a browser.</p>
            <div className="runtime-path"><span>source</span><i>→</i><span>bytecode</span><i>→</i><strong>native / web</strong></div>
            <Link className="runtime-benchmark-link" href="/benchmarks">See the honest Node.js comparison →</Link>
          </article>
          <article className="feature feature-packages">
            <span className="feature-number">04</span>
            <h3>Packages with receipts</h3>
            <p>Exact versions, checksum-pinned lockfiles, deterministic archives, publisher ownership, capability audits, yanking, signed provenance, advisories, and offline verification.</p>
              <div className="hash-line"><span>sha256</span><code>published per artifact</code></div>
          </article>
          <article className="feature feature-large feature-clarity">
            <span className="feature-number">05</span>
            <div>
              <h3>Clarity scales better</h3>
              <p><code>through</code> pipelines, <code>or give</code>, <code>using</code>, structured tasks, persistent data, and bounded web clients and servers.</p>
              <Link href="/docs">Explore the language <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section shell path-section">
        <div className="section-heading centered">
          <span className="kicker">From zero to running</span>
          <h2>One path. No ceremony.</h2>
        </div>
        <div className="steps">
          <article><span>1</span><h3>Create</h3><code>niv new my-app</code><p>Start with one standard layout, a first program, and a native test.</p></article>
          <article><span>2</span><h3>Develop</h3><code>niv dev</code><p>Check and run with the project&apos;s explicit authority and resource policy.</p></article>
          <article><span>3</span><h3>Ship</h3><code>niv ship</code><p>Test, document, package, and emit a directly executable standalone app.</p></article>
        </div>
      </section>

      <section className="cta-wrap shell">
        <div className="cta-panel">
          <div>
            <span className="kicker light">Edition 4 · Product Proof in progress</span>
            <h2>Make the next program<br />feel obvious.</h2>
          </div>
          <div className="cta-actions">
            <Link className="button light-button" href="/install">See installation choices</Link>
            <Link className="text-link-light" href="/examples">Browse examples →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
