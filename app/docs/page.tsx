import type { Metadata } from "next";
import { DocsExplorer } from "./DocsExplorer";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn Nivren Edition 3, from intent-first syntax and capabilities to packages, web services, native hosts, WebAssembly, and tooling.",
};

export default function DocsPage() {
  return (
    <>
      <section className="page-hero compact">
        <div className="shell">
          <span className="kicker">Edition 3 guide</span>
          <h1>Documentation</h1>
          <p>A detailed, searchable guide to syntax, typed failure, projects, package authoring, capabilities, I/O, concurrency, native boundaries, deployment targets, and the complete toolchain.</p>
          <div className="page-hero-meta"><span className="meta-pill">23 detailed guides</span><span className="meta-pill">Edition 3 working draft</span><span className="meta-pill">Copyable examples</span><span className="meta-pill">15 black-box vectors</span></div>
        </div>
      </section>
      <DocsExplorer />
    </>
  );
}
