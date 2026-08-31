import type { Metadata } from "next";
import { DocsExplorer } from "./DocsExplorer";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn Nivren 1.0.0 (Edition 6), from intent-first syntax and capabilities to packages, the live registry, web services, native and AOT builds, WebAssembly, and tooling.",
};

export default function DocsPage() {
  return (
    <>
      <section className="page-hero compact">
        <div className="shell">
          <span className="kicker">Edition 6 guide</span>
          <h1>Documentation</h1>
          <p>A detailed, searchable guide to syntax, typed failure, projects, package authoring, capabilities, I/O, concurrency, native boundaries, deployment targets, and the complete toolchain.</p>
          <div className="page-hero-meta"><span className="meta-pill">20 detailed guides</span><span className="meta-pill">1.0.0 stable docs</span><span className="meta-pill">Compiled examples</span><span className="meta-pill">Frozen syntax</span></div>
        </div>
      </section>
      <DocsExplorer />
    </>
  );
}
