import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packageByName, packages } from "../catalog";
import { SyntaxCode } from "../../components/SyntaxCode";

type Props = { params: Promise<{ name: string }> };

export function generateStaticParams() {
  return packages.map((item) => ({ name: item.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = packageByName((await params).name);
  return item ? { title: item.name, description: item.summary } : {};
}

export default async function PackageGuide({ params }: Props) {
  const item = packageByName((await params).name);
  if (!item) notFound();
  return <>
    <section className="page-hero compact"><div className="shell">
      <Link className="back-link" href="/packages">← All packages</Link>
      <span className="kicker">{item.purpose}</span>
      <h1 className="package-title">{item.name}</h1>
      <p>{item.summary}</p>
      <div className="page-hero-meta"><span className="meta-pill">Edition 5</span><span className="meta-pill">1.0.0 package API</span><span className="meta-pill">Typed failures</span></div>
    </div></section>
    <article className="shell content-shell package-guide">
      <aside className="package-guide-nav" aria-label="On this page">
        <strong>On this page</strong>
        <a href="#install">Install</a><a href="#example">Example</a><a href="#api">Public API</a><a href="#authority">Authority</a><a href="#limits">Limits</a><a href="#failures">Failures</a><a href="#performance">Performance</a><a href="#production">Production</a><a href="#guidance">Guidance</a>
      </aside>
      <div className="package-guide-body">
        <section id="install"><span className="doc-group">Install and import</span><h2>Add it to a project</h2><p>Package versions are exact and recorded in <code className="inline-code">niv.lock</code>. Installation verifies the immutable archive before code becomes importable.</p><pre><SyntaxCode language="shell" code={`niv add ${item.name} 1.0.0\nniv install /path/to/registry`} /></pre><pre><SyntaxCode code={`use "@${item.name}"`} /></pre></section>
        <section id="example"><span className="doc-group">Working pattern</span><h2>A focused example</h2><pre><SyntaxCode code={item.example} /></pre><p>Operations that can fail use <code className="inline-code">gives Value or Problem</code>; use <code className="inline-code">or give</code> inside a failure-aware function or handle every case with <code className="inline-code">choose</code>.</p></section>
        <section id="api"><span className="doc-group">Reference</span><h2>Public API</h2><div className="api-token-grid">{item.api.map((member) => <code key={member}>{member}</code>)}</div><p>Only these exposed names are package API. Helpers stay private to the module and cannot become accidental dependencies.</p></section>
        <section id="authority"><span className="doc-group">Capability model</span><h2>Required authority</h2><p>{item.capabilities}</p></section>
        <section id="limits"><span className="doc-group">Resource safety</span><h2>Bounds and failure behavior</h2><p>{item.limits}</p><p>Invalid, oversized, or incomplete input is rejected with a typed error rather than silently truncated or coerced.</p></section>
        <section id="failures"><span className="doc-group">Operational reference</span><h2>Failures to handle</h2><ul>{(item.failures ?? ["Invalid or oversized input", "Unavailable authority or external resource", "A typed package-specific validation failure"]).map((failure) => <li key={failure}>{failure}</li>)}</ul><p>Handle these at the nearest useful boundary. Preserve the original typed problem when adding application context.</p></section>
        <section id="performance"><span className="doc-group">Cost model</span><h2>Performance notes</h2><p>{item.performance ?? "The package keeps work bounded and deterministic. Measure the complete application path—including parsing, allocation, I/O, and cleanup—before setting production limits."}</p></section>
        <section id="production"><span className="doc-group">Release readiness</span><h2>Production checklist</h2><ul>{(item.checklist ?? ["Pin the exact package version and review niv.lock", "Grant only the capabilities used by the selected API", "Test success, malformed input, resource ceilings, and cancellation", "Record package failures without leaking secrets", "Benchmark the real workload on every supported platform"]).map((check) => <li key={check}>{check}</li>)}</ul></section>
        <section id="guidance"><span className="doc-group">Design guidance</span><h2>When to use it</h2><p>{item.useWhen}</p><div className="guide-note"><strong>Important boundary</strong><p>{item.notes}</p></div></section>
        <div className="package-guide-footer"><Link href="/packages">Browse all 25 packages</Link><Link href="/docs">Continue into the language guide →</Link></div>
      </div>
    </article>
  </>;
}
