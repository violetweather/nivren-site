import type { Metadata } from "next";
import Link from "next/link";
import report from "@/benchmarks/nivren-vs-node/results/2026-08-31-windows-x64.json";
import { SyntaxCode } from "../components/SyntaxCode";

export const metadata: Metadata = {
  title: "Nivren performance benchmarks",
  description: "Reproducible Nivren and Node.js measurements for startup, source checking, typed JSON and file work, memory, and compute-heavy limits.",
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
  const strengths = report.results.filter(result => result.category === "strength");
  const limits = report.results.filter(result => result.category === "limit");
  const strengthLeads = strengths.map(result => result.node.median_ms / result.nivren.median_ms);
  const computeLeads = limits.map(result => result.node_speedup);
  const memoryRatios = strengths.flatMap(result => result.nivren.peak_rss_kb && result.node.peak_rss_kb
    ? [result.node.peak_rss_kb / result.nivren.peak_rss_kb]
    : []);
  const groups = [
    {
      id: "strength-results",
      kicker: "Where Nivren fits today",
      title: "Fast, lean command-line work.",
      description: "These fresh-process tests match Nivren’s current strengths: getting to a result quickly, checking a source file, and safely moving a typed document from disk to canonical JSON.",
      results: strengths,
    },
    {
      id: "limit-results",
      kicker: "Current limits",
      title: "Hot compute still belongs to V8.",
      description: "We keep the compute-heavy cases visible so optimization progress remains measurable. They are useful engineering diagnostics, not the whole story of either language.",
      results: limits,
    },
  ];

  return <>
    <section className="page-hero benchmark-hero">
      <div className="shell">
        <span className="kicker">Measured on real Nivren-shaped work</span>
        <h1>Quick tools. Small processes. Explicit safety.</h1>
        <p>Nivren reaches useful command-line results in a few milliseconds while type and capability checks stay built in. The same transparent suite also shows where Node.js remains faster: long-running, compute-heavy JavaScript.</p>
        <div className="page-hero-meta"><span className="meta-pill">AMD Ryzen 9 9950X3D · x64</span><span className="meta-pill">Nivren 0.10.0-beta.8 · Edition 5</span><span className="meta-pill">Node.js 22.15.0</span><span className="meta-pill">August 31, 2026</span></div>
      </div>
    </section>

    <div className="shell content-shell benchmark-page">
      <section className="benchmark-verdict" aria-labelledby="benchmark-summary">
        <div className="benchmark-verdict-copy">
          <span className="kicker">The useful summary</span>
          <h2 id="benchmark-summary">Built for work that starts now.</h2>
          <p>Across startup, one-shot checking, typed JSON, and bounded text-file processing, Nivren completes the whole command before Node.js finishes paying most of its process-start cost. It does so with stricter default semantics, and peak memory stays reported whenever the platform can measure it.</p>
        </div>
        <div className="benchmark-stat-grid">
          <article className="benchmark-stat nivren-win"><strong>{Math.min(...strengthLeads).toFixed(1)}–{Math.max(...strengthLeads).toFixed(1)}×</strong><span>Nivren&apos;s lead</span><p>Across the four strength-first workflows</p></article>
          {memoryRatios.length ? <article className="benchmark-stat memory-win"><strong>{Math.min(...memoryRatios).toFixed(1)}–{Math.max(...memoryRatios).toFixed(1)}×</strong><span>Lower peak memory</span><p>Across the same fresh processes</p></article> : null}
          <article className="benchmark-stat node-win"><strong>{Math.min(...computeLeads).toFixed(1)}–{Math.max(...computeLeads).toFixed(1)}×</strong><span>Node&apos;s compute lead</span><p>The optimization target remains visible</p></article>
        </div>
      </section>

      {groups.map(group => <section className="benchmark-results" aria-labelledby={group.id} key={group.id}>
        <div className="benchmark-section-heading"><div><span className="kicker">{group.kicker}</span><h2 id={group.id}>{group.title}</h2></div><p>{group.description}</p></div>
        <div className="benchmark-table-wrap">
          <table className="benchmark-table">
            <thead><tr><th>Workload</th><th>Nivren</th><th>Node.js</th><th>Fastest</th><th>Peak memory</th></tr></thead>
            <tbody>{group.results.map(result => {
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
      </section>)}

      <section className="benchmark-reading">
        <article><span>01</span><h2>What the strengths mean</h2><p>Low startup and memory make Nivren a natural fit for command-line tools, scripts, automation steps, short-lived workers, and local data utilities. The data cases cover bounded text splitting plus typed JSON with file-capability enforcement, complete schema validation, and deterministic output.</p></article>
        <article><span>02</span><h2>How to read the caveats</h2><p>The source-check row is intentionally not identical work: Nivren performs semantic, type, and capability checks, while <code>node --check</code> checks JavaScript syntax. Compute cases use checked 64-bit Nivren integers and optimized JavaScript numbers. This is a workload comparison, not a universal language ranking.</p></article>
      </section>

      <section className="benchmark-method" aria-labelledby="method-title">
        <div><span className="kicker">Reproduce it</span><h2 id="method-title">The wins and losses use one public harness.</h2><p>Every sample starts a fresh process, runtime order alternates, paired programs must succeed with matching output, and the report includes medians, p95s, ranges, runtime versions, memory, and machine details. The strength-first presentation changes emphasis—not the underlying evidence.</p><a className="button primary" href={sourceUrl}>View benchmark source <span aria-hidden="true">↗</span></a></div>
        <div className="prose-card benchmark-recipe"><h3>Measured environment</h3><dl><div><dt>Processor</dt><dd>{report.environment.cpu.trim()}</dd></div><div><dt>System</dt><dd>{report.environment.os} · {report.environment.architecture}</dd></div><div><dt>Nivren</dt><dd>{report.environment.nivren}</dd></div><div><dt>Node.js</dt><dd>{report.environment.node}</dd></div></dl><h3>Run it</h3><pre><SyntaxCode language="shell" code="NIVREN_BIN=/path/to/niv node benchmarks/nivren-vs-node/run.mjs" /></pre></div>
      </section>

      <div className="benchmark-next"><div><strong>Performance is a visible product promise.</strong><span>Each release can rerun the same workflows, keep the limits public, and add new real-world cases without rewriting history.</span></div><Link href="/downloads">Try the measured beta →</Link></div>
    </div>
  </>;
}
