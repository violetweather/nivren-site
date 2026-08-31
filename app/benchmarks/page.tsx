import type { Metadata } from "next";
import Link from "next/link";
import report from "@/benchmarks/nivren-vs-node/results/2026-08-31-phase-n.json";
import { SyntaxCode } from "../components/SyntaxCode";

export const metadata: Metadata = {
  title: "Nivren performance benchmarks",
  description: "The Edition 6 benchmark suite: twelve reproducible Nivren and Node.js workloads covering startup, checking, typed files, compute, allocation, concurrency, and a warmed HTTP service — every row published, wins and losses.",
};

const sourceUrl = "https://github.com/violetweather/nivren-site/tree/main/benchmarks/nivren-vs-node";

function formatMs(value: number) {
  return value < 10 ? `${value.toFixed(2)} ms` : `${value.toFixed(1)} ms`;
}

function comparison(nivren: number, node: number) {
  if (nivren < node) return { winner: "Nivren", factor: node / nivren };
  return { winner: "Node.js", factor: nivren / node };
}

const groups = [
  {
    category: "strength",
    id: "strength-results",
    kicker: "Everyday commands",
    title: "The whole command, done in milliseconds.",
    description: "Fresh-process runs of the work tools actually do: reaching a printed result, checking a source file, and moving typed documents between disk and canonical JSON. Nivren finishes each complete command before Node.js pays its startup cost.",
  },
  {
    category: "limit",
    id: "limit-results",
    kicker: "Compute and data",
    title: "Hot loops run as machine code.",
    description: "The Edition 6 engine compiles whole integer programs, recursive calls, and shape-heavy loops to native machine code, and its memory generation halved the cost of typed JSON. Two rows still lose to V8 — they stay published, because no row is quietly removed.",
  },
  {
    category: "concurrency",
    id: "concurrency-results",
    kicker: "Concurrency",
    title: "Structured tasks, measured honestly.",
    description: "A bounded producer and consumer move twenty thousand values through a channel. Nivren's structured tasks currently pay more per hop than Node's async queue; the row stays on the board as an open target.",
  },
  {
    category: "service",
    id: "service-results",
    kicker: "Warmed service",
    title: "Hot per-request latency, head to head.",
    description: "One long-lived server per runtime, two hundred warmup requests, then one thousand sequential requests from the same client. Sub-millisecond medians for both runtimes, with Nivren ahead.",
  },
].map((group) => ({ ...group, results: report.results.filter((result) => result.category === group.category) }));

export default function BenchmarksPage() {
  const rows = report.results;
  const wonRows = rows.filter((result) => result.nivren.median_ms < result.node.median_ms);
  const openRows = rows.filter((result) => result.node.median_ms * 1.05 < result.nivren.median_ms);
  const strengthLeads = rows.filter((result) => result.category === "strength").map((result) => result.node.median_ms / result.nivren.median_ms);

  return <>
    <section className="page-hero benchmark-hero">
      <div className="shell">
        <span className="kicker">The Edition 6 benchmark suite</span>
        <h1>Twelve workloads. Every row published.</h1>
        <p>Edition 6 is the runtime edition, and this suite is its scoreboard: startup, checking, typed files, hot compute, allocation churn, structured concurrency, and a warmed HTTP service. Nivren is ahead on {wonRows.length} of {rows.length} rows — and the rows it still loses stay on the board.</p>
        <div className="page-hero-meta"><span className="meta-pill">{report.environment.cpu.trim()} · {report.environment.architecture}</span><span className="meta-pill">Nivren 1.0.0 · Edition 6 engine</span><span className="meta-pill">Node.js {report.environment.node}</span><span className="meta-pill">August 31, 2026</span></div>
      </div>
    </section>

    <div className="shell content-shell benchmark-page">
      <section className="benchmark-verdict" aria-labelledby="benchmark-summary">
        <div className="benchmark-verdict-copy">
          <span className="kicker">The useful summary</span>
          <h2 id="benchmark-summary">Fast to start. Fast when compiled. Honest where it isn&apos;t.</h2>
          <p>Across everyday commands Nivren completes the whole job — with semantic, type, and capability checks included — before Node.js finishes starting. Compiled integer, recursive, and shape-heavy compute now runs as native machine code. Allocation churn and channel-heavy concurrency remain behind V8, and both are published here at full size.</p>
        </div>
        <div className="benchmark-stat-grid">
          <article className="benchmark-stat nivren-win"><strong>{Math.min(...strengthLeads).toFixed(1)}–{Math.max(...strengthLeads).toFixed(1)}×</strong><span>Nivren&apos;s lead</span><p>Across the four everyday command workloads</p></article>
          <article className="benchmark-stat nivren-win"><strong>{wonRows.length} / {rows.length}</strong><span>Rows Nivren wins</span><p>Fresh processes, identical required output</p></article>
          <article className="benchmark-stat node-win"><strong>{openRows.length}</strong><span>Open rows, published anyway</span><p>Allocation churn and channel concurrency still favor V8</p></article>
        </div>
      </section>

      {groups.map(group => <section className="benchmark-results" aria-labelledby={group.id} key={group.id}>
        <div className="benchmark-section-heading"><div><span className="kicker">{group.kicker}</span><h2 id={group.id}>{group.title}</h2></div><p>{group.description}</p></div>
        <div className="benchmark-table-wrap">
          <table className="benchmark-table">
            <thead><tr><th>Workload</th><th>Nivren</th><th>Node.js</th><th>Fastest</th></tr></thead>
            <tbody>{group.results.map(result => {
              const resultComparison = comparison(result.nivren.median_ms, result.node.median_ms);
              const scale = Math.max(result.nivren.median_ms, result.node.median_ms);
              return <tr key={result.id}>
                <th scope="row"><strong>{result.label}</strong><span>{result.description}</span></th>
                <td><strong>{formatMs(result.nivren.median_ms)}</strong><div className="bench-bar"><i className="nivren-bar" style={{ width: `${Math.max(2, result.nivren.median_ms / scale * 100)}%` }} /></div><span>p95 {formatMs(result.nivren.p95_ms)}</span></td>
                <td><strong>{formatMs(result.node.median_ms)}</strong><div className="bench-bar"><i className="node-bar" style={{ width: `${Math.max(2, result.node.median_ms / scale * 100)}%` }} /></div><span>p95 {formatMs(result.node.p95_ms)}</span></td>
                <td><span className={`winner-pill ${resultComparison.winner === "Nivren" ? "winner-nivren" : "winner-node"}`}>{resultComparison.winner} · {resultComparison.factor.toFixed(2)}×</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </section>)}

      <section className="benchmark-reading">
        <article><span>01</span><h2>What Edition 6 changed</h2><p>The memory generation shrank every runtime value from 48 to 24 bytes, shares one field-name table per shape, decodes typed JSON without copying paths, and replaces the system allocator with mimalloc. The native generation compiles whole integer programs — loops, recursive calls, and flattened shapes — through the Cranelift tier, with hardware overflow checks, and <code>niv build --aot</code> emits the program as one relocatable native object.</p></article>
        <article><span>02</span><h2>How to read the caveats</h2><p>The source-check row is intentionally not identical work: Nivren performs semantic, type, and capability checks while <code>node --check</code> checks JavaScript syntax. Compute rows use checked 64-bit Nivren integers against optimized JavaScript numbers. Allocation churn and channel concurrency are real losses, kept at full size. This is a workload comparison, not a universal language ranking.</p></article>
      </section>

      <section className="benchmark-method" aria-labelledby="method-title">
        <div><span className="kicker">Reproduce it</span><h2 id="method-title">The wins and losses use one public harness.</h2><p>Every sample starts a fresh process, runtime order alternates, and paired programs must succeed with byte-identical output or the run fails. The service row warms each server with two hundred requests before measuring one thousand more. Reports record medians, p95s, ranges, runtime versions, and machine details in versioned JSON.</p><a className="button primary" href={sourceUrl}>View benchmark source <span aria-hidden="true">↗</span></a></div>
        <div className="prose-card benchmark-recipe"><h3>Measured environment</h3><dl><div><dt>Processor</dt><dd>{report.environment.cpu.trim()}</dd></div><div><dt>System</dt><dd>{report.environment.os} · {report.environment.architecture}</dd></div><div><dt>Nivren</dt><dd>Nivren 1.0.0 · Edition 6 engine</dd></div><div><dt>Node.js</dt><dd>{report.environment.node}</dd></div></dl><h3>Run it</h3><pre><SyntaxCode language="shell" code="NIVREN_BIN=/path/to/niv node benchmarks/nivren-vs-node/run.mjs" /></pre></div>
      </section>

      <div className="benchmark-next"><div><strong>Performance is a visible product promise.</strong><span>Each release reruns the same twelve workflows, keeps the open rows public, and adds new real-world cases without rewriting history.</span></div><Link href="/downloads">Get the measured release →</Link></div>
    </div>
  </>;
}
