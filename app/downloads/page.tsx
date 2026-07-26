import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Downloads", description: "Download Nivren binaries and verify release integrity." };

const builds = [
  { platform: "macOS", arch: "Apple Silicon", icon: "⌘", state: "Download", href: "/downloads/nivren-0.9.0-beta.1-macos-arm64.zip", detail: "Verified local beta · ZIP" },
  { platform: "macOS", arch: "Intel", icon: "⌘", state: "Hosted build pending", detail: "Configured on macos-15-intel" },
  { platform: "Linux", arch: "x64", icon: ">_", state: "Hosted build pending", detail: "Configured on Ubuntu 24.04" },
  { platform: "Linux", arch: "ARM64", icon: ">_", state: "Hosted build pending", detail: "Configured on Ubuntu ARM64" },
  { platform: "Windows", arch: "x64", icon: "⊞", state: "Hosted build pending", detail: "Configured on Windows 2025" },
  { platform: "Windows", arch: "ARM64", icon: "⊞", state: "Hosted build pending", detail: "Configured on Windows 11 ARM" },
];

export default function DownloadsPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Release 0.9.0-beta.1</span><h1>Downloads</h1><p>Choose a platform archive or build from the locked source tree. Every official artifact is deterministic, checksummed, and provenance-attested.</p></div></section>
    <div className="shell content-shell">
      <div className="release-line"><div><span className="release-dot" /><div><strong>Latest compatibility beta</strong><span>Released July 26, 2026 · Edition 1</span></div></div><a href="https://github.com/violetweather/nivren/releases">All releases ↗</a></div>
      <div className="download-grid">
        {builds.map(build => <article className={`download-card ${build.href ? "available" : "pending"}`} key={`${build.platform}-${build.arch}`}>
          <div className="platform-icon">{build.icon}</div><span className="download-state">{build.state}</span><h2>{build.platform}</h2><h3>{build.arch}</h3><p>{build.detail}</p>
          {build.href ? <a className="download-action" href={build.href}>Download archive <span>↓</span></a> : <span className="download-action disabled">Awaiting hosted CI</span>}
        </article>)}
      </div>
      <section className="verify-section">
        <div><span className="kicker">Trust, then run</span><h2>Verify the download.</h2><p>The Apple Silicon beta currently published here has this exact digest:</p><div className="digest"><span>SHA-256</span><code>cdcb9e6f7c6b0b9557ed9bdc8d1ef5c3f810fcf6ff99b0fb08263ffb778e75a7</code></div></div>
        <div className="prose-card"><h3>GitHub attestation</h3><p>Once hosted release artifacts are published, verify their build provenance:</p><pre><code>gh attestation verify --repo violetweather/nivren &lt;artifact.zip&gt;</code></pre><h3>Build it yourself</h3><pre><code>{`git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked`}</code></pre><Link href="/install">Full installation guide →</Link></div>
      </section>
    </div>
  </>;
}
