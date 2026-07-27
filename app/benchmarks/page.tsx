import type { Metadata } from "next";
import Link from "next/link";
import report from "@/benchmarks/nivren-vs-node/results/2026-07-27-macos-arm64.json";

export const metadata: Metadata = {
  title: "Nivren vs Node.js benchmarks",
  description: "A reproducible, plain-spoken comparison of Nivren 0.10.0-beta.6 and Node.js 26 on startup, computation, and memory.",
};

const sourceUrl = "https://github.com/violetweather/nivren-site/tree/main/benchmarks/nivren-vs-node";

function formatMs(value: number) {
  return value < 10 ? `${value.toFixed(2)} ms` : `${value.toFixed(1)} ms`;
}

function formatMemory(value: number | null) {
  return value === null ? "Not measured" : `${(value / 1024).toFixed(1)} MiB`;
}

function comparison(nivren: number, node: number) {
  if (nivren < node) return { winner: "Nivren", factor: node / nivren };
  return { winner: "Node.js", factor: nivren / node };
}

export default function BenchmarksPage() {
  const startup = report.results[0];
  const startupLead = startup.node.median_ms / startup.nivren.median_ms;
  const compute = report.results.slice(1);
  const minimumComputeLead = Math.min(...compute.map(result => result.node_speedup));
  const maximumComputeLead = Math.max(...compute.map(result => result.node_speedup));
  const memoryRatios = report.results.flatMap(result => result.nivren.peak_rss_kb && result.node.peak_rss_kb
    ? [result.node.peak_rss_kb / result.nivren.peak_rss_kb]
    : []);

  return <>
    <section className="page-hero benchmark-hero">
      <div className="shell">
        <span className="kicker">Measured, not marketed</span>
        <h1>Nivren vs Node.js</h1>
        <p>A small reproducible comparison of source-to-result latency, sustained computation, and process memory. The result is mixed: Nivren starts lean and fast; Node&apos;s mature optimizing runtime wins decisively once computation gets hot.</p>
        <div className="page-hero-meta"><span className="meta-pill">Apple M4 · arm64</span><span className="meta-pill">Nivren 0.10.0-beta.6</span><span className="meta-pill">Node.js 26.5.0</span><span className="meta-pill">July 27, 2026</span></div>
      </div>
    </section>

    <div className="shell content-shell benchmark-page">
      <section className="benchmark-verdict" aria-labelledby="benchmark-summary">
        <div className="benchmark-verdict-copy">
          <span className="kicker">The honest summary</span>
          <h2 id="benchmark-summary">Fast to arrive.<br />More work to do.</h2>
          <p>Nivren&apos;s tiny runtime reaches the first result quickly and stays memory-light. Node.js pays more to start V8, then repays that cost with far stronger optimization on loops and recursive calls.</p>
        </div>
        <div className="benchmark-stat-grid">
          <article className="benchmark-stat nivren-win"><strong>{startupLead.toFixed(2)}×</strong><span>Nivren&apos;s startup lead</span><p>{formatMs(startup.nivren.median_ms)} versus {formatMs(startup.node.median_ms)}</p></article>
          <article className="benchmark-stat node-win"><strong>{minimumComputeLead.toFixed(2)}–{maximumComputeLead.toFixed(0)}×</strong><span>Node&apos;s compute lead</span><p>Across the three sustained workloads</p></article>
          <article className="benchmark-stat memory-win"><strong>{Math.min(...memoryRatios).toFixed(1)}–{Math.max(...memoryRatios).toFixed(1)}×</strong><span>Lower Nivren peak memory</span><p>Across all four fresh processes</p></article>
        </div>
      </section>

      <section className="benchmark-results" aria-labelledby="results-title">
        <div className="benchmark-section-heading"><div><span className="kicker">Median wall time</span><h2 id="results-title">Four deliberately small tests.</h2></div><p>Each sample starts a fresh process. Runtime order alternates, outputs must match, and every compute test gets three warmup processes before eleven measured runs.</p></div>
        <div className="benchmark-table-wrap">
          <table className="benchmark-table">
            <thead><tr><th>Workload</th><th>Nivren</th><th>Node.js</th><th>Fastest</th><th>Peak memory</th></tr></thead>
            <tbody>{report.results.map(result => {
              const resultComparison = comparison(result.nivren.median_ms, result.node.median_ms);
              const scale = Math.max(result.nivren.median_ms, result.node.median_ms);
              return <tr key={result.id}>
                <th scope="row"><strong>{result.label}</strong><span>{result.description}</span></th>
                <td><strong>{formatMs(result.nivren.median_ms)}</strong><div className="bench-bar"><i className="nivren-bar" style={{ width: `${Math.max(2, result.nivren.median_ms / scale * 100)}%` }} /></div><span>p95 {formatMs(result.nivren.p95_ms)}</span></td>
                <td><strong>{formatMs(result.node.median_ms)}</strong><div className="bench-bar"><i className="node-bar" style={{ width: `${Math.max(2, result.node.median_ms / scale * 100)}%` }} /></div><span>p95 {formatMs(result.node.p95_ms)}</span></td>
                <td><span className={`winner-pill ${resultComparison.winner === "Nivren" ? "winner-nivren" : "winner-node"}`}>{resultComparison.winner} · {resultComparison.factor.toFixed(2)}×</span></td>
                <td><span>Nivren {formatMemory(result.nivren.peak_rss_kb)}</span><span>Node {formatMemory(result.node.peak_rss_kb)}</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </section>

      <section className="benchmark-reading">
        <article><span>01</span><h2>What the numbers say</h2><p>Nivren&apos;s 3.11 ms source startup and roughly 9–11 MiB footprint are excellent foundations for command-line tools, scripts, and short-lived workers. Node wins the compute tests by 4.48× to 53.98×, with recursion exposing the largest gap. Nivren&apos;s tiered JIT is working, but it is not yet in V8&apos;s performance class.</p></article>
        <article><span>02</span><h2>What they do not say</h2><p>These are microbenchmarks, not a universal language ranking. They do not cover servers, asynchronous I/O, databases, WebAssembly, package workloads, developer productivity, or Nivren&apos;s checked arithmetic and capability enforcement. JavaScript numbers and Nivren integers also have different overflow semantics.</p></article>
      </section>

      <section className="benchmark-method" aria-labelledby="method-title">
        <div><span className="kicker">Reproduce it</span><h2 id="method-title">Every input is public.</h2><p>The repository contains the paired Nivren and JavaScript programs, runner, raw samples summary, runtime versions, and machine description. Change the run counts or point it at a future Nivren binary and regenerate the report.</p><a className="button primary" href={sourceUrl}>View benchmark source <span aria-hidden="true">↗</span></a></div>
        <div className="prose-card benchmark-recipe"><h3>Measured environment</h3><dl><div><dt>Processor</dt><dd>{report.environment.cpu}</dd></div><div><dt>System</dt><dd>{report.environment.os} · {report.environment.architecture}</dd></div><div><dt>Nivren</dt><dd>{report.environment.nivren}</dd></div><div><dt>Node.js</dt><dd>{report.environment.node}</dd></div></dl><h3>Run it</h3><pre><code>NIVREN_BIN=/path/to/niv node benchmarks/nivren-vs-node/run.mjs</code></pre></div>
      </section>

      <div className="benchmark-next"><div><strong>Performance is now a visible product promise.</strong><span>Future releases can rerun this exact suite and show progress without moving the goalposts.</span></div><Link href="/downloads">Try the measured beta →</Link></div>
    </div>
  </>;
}
