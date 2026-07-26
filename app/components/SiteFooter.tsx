import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link className="brand inverse" href="/"><span className="brand-mark">N</span><span>Nivren</span></Link>
          <p>Code that reads like intent.</p>
          <span className="beta-note">0.9.0-beta.1 · Edition 1</span>
        </div>
        <div><h3>Learn</h3><Link href="/docs">Documentation</Link><Link href="/install">Installation</Link><Link href="/examples">Examples</Link></div>
        <div><h3>Project</h3><Link href="/downloads">Downloads</Link><a href="https://github.com/violetweather/nivren">GitHub</a><a href="https://github.com/violetweather/nivren/blob/main/ROADMAP.md">Roadmap</a></div>
        <div><h3>Edition 1</h3><a href="https://github.com/violetweather/nivren/tree/main/spec">Specifications</a><a href="https://github.com/violetweather/nivren/tree/main/conformance">Conformance</a><a href="https://github.com/violetweather/nivren/blob/main/SECURITY.md">Security</a></div>
      </div>
      <div className="shell footer-bottom"><span>Apache-2.0 licensed</span><span>Built with care for predictable software.</span></div>
    </footer>
  );
}
