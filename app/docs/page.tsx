import type { Metadata } from "next";
import { DocsExplorer } from "./DocsExplorer";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn Nivren Edition 2, from first program to modules, packages, concurrency, and tooling.",
};

export default function DocsPage() {
  return (
    <>
      <section className="page-hero compact">
        <div className="shell">
          <span className="kicker">Edition 2 guide</span>
          <h1>Documentation</h1>
          <p>Learn the language from its smallest expressions to packages, structured tasks, verified bytecode, and native execution.</p>
          <div className="page-hero-meta"><span className="meta-pill">0.10 compatibility beta</span><span className="meta-pill">Rust-free usage</span><span className="meta-pill">27 conformance vectors</span></div>
        </div>
      </section>
      <DocsExplorer />
    </>
  );
}
