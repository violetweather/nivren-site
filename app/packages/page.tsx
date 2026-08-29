import type { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "../components/Marquee";
import { packages } from "./catalog";

export const metadata: Metadata = {
  title: "Packages",
  description: "Detailed guides for every official Nivren package, including APIs, capabilities, limits, examples, and compatibility guarantees.",
};

export default function PackagesPage() {
  return <>
    <section className="page-hero compact"><div className="shell">
      <span className="kicker">25 exact, inspectable dependencies</span>
      <h1>Package reference</h1>
      <p>Every official package now has a practical guide covering its complete public surface, required authority, resource limits, intended use, sharp edges, and a copyable Nivren example.</p>
      <div className="page-hero-meta"><span className="meta-pill">25 package guides</span><span className="meta-pill">Capability notes</span><span className="meta-pill">Typed examples</span></div>
    </div></section>
    <Marquee items={packages.map(item => item.name)} />
    <div className="shell content-shell package-index">
      <div className="package-intro">
        <div><span className="kicker">Choose by job</span><h2>Small packages. Visible boundaries.</h2></div>
        <p>Official packages are ordinary Edition 4 source: no lifecycle scripts, hidden network calls, or ambient permissions. Each guide covers authority, resource limits, failures, cost, production checks—and what the package deliberately leaves to your application.</p>
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
      <section className="docs-callout"><span className="kicker">Compatibility</span><h2>Stable means visible.</h2><p>Official packages use semantic versions. Exposed types, capabilities, error shapes, resource ceilings, and deterministic behavior are compatibility surface. Every release is rebuilt twice, published to a temporary immutable registry, installed into a clean consumer, and exercised on both Nivren engines before it can ship.</p></section>
    </div>
  </>;
}
