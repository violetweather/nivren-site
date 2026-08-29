import Link from "next/link";
import { NivrenMark } from "./NivrenMark";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/examples", label: "Examples" },
  { href: "/packages", label: "Packages" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/studio", label: "Studio" },
];

export function SiteNav() {
  return (
    <div className="nav-dock">
      <Link className="nav-brand" href="/" aria-label="Nivren home">
        <NivrenMark className="nav-mark" />
        <span>NIVREN</span>
      </Link>
      <nav className="nav-pill" aria-label="Primary navigation">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>{link.label}</Link>
        ))}
      </nav>
      <div className="nav-end">
        <Link className="nav-get" href="/install">
          Install <span aria-hidden="true">→</span>
        </Link>
        <details className="nav-more">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Secondary navigation">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
            <Link href="/downloads">Downloads</Link>
            <Link href="/install">Install</Link>
          </nav>
        </details>
      </div>
    </div>
  );
}
