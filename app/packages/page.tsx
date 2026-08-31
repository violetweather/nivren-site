import type { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "../components/Marquee";
import { SyntaxCode } from "../components/SyntaxCode";
import { packages } from "./catalog";

export const metadata: Metadata = {
  title: "Packages",
  description: "The live signed Nivren registry and detailed guides for all 25 official 1.0.0 packages, including APIs, capabilities, limits, examples, and compatibility guarantees.",
};

const registryUrl = "https://violetweather.github.io/nivren-registry";

export default function PackagesPage() {
  return <>
    <section className="page-hero compact"><div className="shell">
      <span className="kicker">25 packages · every one at 1.0.0</span>
      <h1>Package reference</h1>
      <p>Every official package ships at 1.0.0 in the live signed registry, with a practical guide covering its complete public surface, required authority, resource limits, intended use, sharp edges, and a copyable Nivren example.</p>
      <div className="page-hero-meta"><span className="meta-pill">Live signed registry</span><span className="meta-pill">25 package guides</span><span className="meta-pill">Capability notes</span><span className="meta-pill">Typed examples</span></div>
    </div></section>
    <Marquee items={packages.map(item => item.name)} />
    <div className="shell content-shell package-index">
      <div className="package-intro">
        <div><span className="kicker">Choose by job</span><h2>Small packages. Visible boundaries.</h2></div>
        <p>Official packages are ordinary Nivren source: no lifecycle scripts, hidden network calls, or ambient permissions. Each guide covers authority, resource limits, failures, cost, production checks—and what the package deliberately leaves to your application.</p>
      </div>
      <div className="package-grid">
        {packages.map((item, index) => <article className="package-card" key={item.name}>
          <span>{String(index + 1).padStart(2, "0")} · {item.purpose}</span>
          <h2>{item.name}</h2>
          <p>{item.summary}</p>
          <div className="package-api"><strong>Public surface</strong><code>{item.api.join(" · ")}</code></div>
          <Link href={`/packages/${item.name}`}>Read the full guide <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
      <section className="verify-section">
        <div><span className="kicker">The live registry</span><h2>Signed, immutable, verified on your machine.</h2><p>The registry at <a href={registryUrl}>violetweather.github.io/nivren-registry</a> serves signed static artifacts. Your client verifies everything against a pinned Ed25519 root key: a publisher authorization bound to a repository and CI workflow, per-release provenance binding the exact archive SHA-256, and a short-lived signed status whose generation only ever increases — so a rolled-back or tampered registry fails closed. Artifacts are immutable; a yank is a signed advisory, never a deletion.</p></div>
        <div className="prose-card"><h3>Install from the registry</h3><pre><SyntaxCode language="shell" code={`niv add nivren_stats 1.0.0
niv install --trusted ${registryUrl} ./nivren-root.pub`} /></pre><h3>Publisher trust tooling</h3><p>The <code>niv trust</code> family signs the whole chain: <code>keygen</code>, <code>authorize</code>, <code>attest</code>, <code>sign-status</code>, and <code>sign-advisory</code>. Clients re-check any release with <code>niv registry verify-release</code>.</p></div>
      </section>
      <section className="docs-callout"><span className="kicker">Compatibility</span><h2>Stable means visible.</h2><p>Official packages use semantic versions. Exposed types, capabilities, error shapes, resource ceilings, and deterministic behavior are compatibility surface. Every release is rebuilt twice, published to the live signed registry, installed into a clean consumer by CI, and exercised on both Nivren engines before it can ship.</p></section>
    </div>
  </>;
}
