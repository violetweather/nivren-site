import Link from "next/link";

export function StudioNav() {
  return <nav className="studio-subnav" aria-label="Nivren Studio">
    <Link href="/studio">Overview</Link><Link href="/studio/docs">Docs</Link><Link href="/studio/downloads">Downloads</Link><Link href="/studio/plugins">Plugins</Link><Link href="/studio/compatibility">Compatibility</Link><Link href="/studio/releases">Releases</Link><Link href="/studio/privacy">Privacy</Link><Link href="/studio/security">Security</Link>
  </nav>;
}
