import Link from "next/link";
import { candidateRelease, publicRelease } from "../release";

const columns = [
  {
    heading: "Language",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/examples", label: "Examples" },
      { href: "/packages", label: "Packages" },
      { href: "/benchmarks", label: "Benchmarks" },
    ],
  },
  {
    heading: "Ship",
    links: [
      { href: "/install", label: "Install" },
      { href: "/downloads", label: "Downloads" },
      { href: "/studio", label: "Nivren Studio" },
    ],
  },
];

const external = [
  { href: "https://github.com/violetweather/nivren", label: "Source" },
  { href: "https://github.com/violetweather/nivren/tree/main/spec", label: "Specifications" },
  { href: "https://github.com/violetweather/nivren/tree/main/conformance", label: "Conformance" },
  { href: "https://github.com/violetweather/nivren/blob/main/SECURITY.md", label: "Security" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-wordmark" aria-hidden="true">NIVREN</p>
      <div className="footer-cols">
        {columns.map((column) => (
          <div key={column.heading}>
            <h2>{column.heading}</h2>
            {column.links.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
          </div>
        ))}
        <div>
          <h2>Open</h2>
          {external.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <div className="footer-state">
          <h2>State</h2>
          <p>
            <b>{publicRelease.version}</b> public beta
          </p>
          <p>
            Product Proof {candidateRelease.checkpointGatesPassed}/{candidateRelease.checkpointGatesRequired} · not 1.0 until every gate passes
          </p>
          <p>Apache-2.0</p>
        </div>
      </div>
    </footer>
  );
}
