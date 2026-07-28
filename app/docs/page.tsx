import type { Metadata } from "next";
import { DocsExplorer } from "./DocsExplorer";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn Nivren Edition 4, from intent-first syntax and capabilities to packages, web services, native hosts, WebAssembly, and tooling.",
};

export default function DocsPage() {
  return (
    <>
      <section className="page-hero compact">
        <div className="shell">
          <span className="kicker">Edition 4 guide</span>
          <h1>Documentation</h1>
          <p>A detailed, searchable guide to syntax, typed failure, projects, package authoring, capabilities, I/O, concurrency, native boundaries, deployment targets, and the complete toolchain.</p>
          <div className="page-hero-meta"><span className="meta-pill">19 detailed guides</span><span className="meta-pill">Edition 4 candidate docs</span><span className="meta-pill">Compiled examples</span><span className="meta-pill">Checkpoint-gated</span></div>
        </div>
      </section>
      <DocsExplorer />
    </>
  );
}
