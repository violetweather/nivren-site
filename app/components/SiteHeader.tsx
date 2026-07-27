import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href="/" aria-label="Nivren home">
          <span className="brand-mark">N</span><span>Nivren</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/docs">Docs</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/install">Install</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/benchmarks">Benchmarks</Link>
          <Link href="/downloads">Downloads</Link>
        </nav>
        <div className="nav-actions">
          <a className="github-link" href="https://github.com/violetweather/nivren">GitHub <span aria-hidden="true">↗</span></a>
          <Link className="nav-download" href="/downloads">Get Nivren</Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/docs">Docs</Link><Link href="/packages">Packages</Link><Link href="/install">Install</Link><Link href="/examples">Examples</Link><Link href="/benchmarks">Benchmarks</Link><Link href="/downloads">Downloads</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
