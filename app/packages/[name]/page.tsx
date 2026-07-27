import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packageByName, packages } from "../catalog";

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
      <div className="page-hero-meta"><span className="meta-pill">Edition 3</span><span className="meta-pill">1.0.0 package API</span><span className="meta-pill">Typed Result errors</span></div>
    </div></section>
    <article className="shell content-shell package-guide">
      <aside className="package-guide-nav" aria-label="On this page">
        <strong>On this page</strong>
        <a href="#install">Install</a><a href="#example">Example</a><a href="#api">Public API</a><a href="#authority">Authority</a><a href="#limits">Limits</a><a href="#guidance">Guidance</a>
      </aside>
      <div className="package-guide-body">
        <section id="install"><span className="doc-group">Install and import</span><h2>Add it to a project</h2><p>Package versions are exact and recorded in <code className="inline-code">niv.lock</code>. Installation verifies the immutable archive before code becomes importable.</p><pre><code>{`niv add ${item.name} 1.0.0\nniv install /path/to/registry`}</code></pre><pre><code>{`use "@${item.name}"`}</code></pre></section>
        <section id="example"><span className="doc-group">Working pattern</span><h2>A focused example</h2><pre><code>{item.example}</code></pre><p>Operations that can fail return <code className="inline-code">Result</code>; use <code className="inline-code">or give</code> inside a result-returning function or handle both branches with <code className="inline-code">choose</code>.</p></section>
        <section id="api"><span className="doc-group">Reference</span><h2>Public API</h2><div className="api-token-grid">{item.api.map((member) => <code key={member}>{member}</code>)}</div><p>Only these exposed names are package API. Helpers stay private to the module and cannot become accidental dependencies.</p></section>
        <section id="authority"><span className="doc-group">Capability model</span><h2>Required authority</h2><p>{item.capabilities}</p></section>
        <section id="limits"><span className="doc-group">Resource safety</span><h2>Bounds and failure behavior</h2><p>{item.limits}</p><p>Invalid, oversized, or incomplete input is rejected with a typed error rather than silently truncated or coerced.</p></section>
        <section id="guidance"><span className="doc-group">Design guidance</span><h2>When to use it</h2><p>{item.useWhen}</p><div className="guide-note"><strong>Important boundary</strong><p>{item.notes}</p></div></section>
        <div className="package-guide-footer"><Link href="/packages">Browse all 22 packages</Link><Link href="/docs">Continue into the language guide →</Link></div>
      </div>
    </article>
  </>;
}
