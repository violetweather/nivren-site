import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Downloads", description: "Download Nivren binaries and verify release integrity." };

const builds = [
  { platform: "macOS", arch: "Apple Silicon", icon: "⌘", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-macos-arm64.zip", detail: "macOS 15 · ZIP" },
  { platform: "macOS", arch: "Intel", icon: "⌘", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-macos-x64.zip", detail: "macOS 15 Intel · ZIP" },
  { platform: "Linux", arch: "x64", icon: ">_", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-linux-x64.zip", detail: "Ubuntu 24.04 · ZIP" },
  { platform: "Linux", arch: "ARM64", icon: ">_", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-linux-arm64.zip", detail: "Ubuntu 24.04 ARM · ZIP" },
  { platform: "Windows", arch: "x64", icon: "⊞", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-windows-x64.zip", detail: "Windows 2025 · ZIP" },
  { platform: "Windows", arch: "ARM64", icon: "⊞", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/nivren-v0.10.0-beta.5-windows-arm64.zip", detail: "Windows 11 ARM · ZIP" },
];

export default function DownloadsPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Release 0.10.0-beta.5</span><h1>Downloads</h1><p>Choose a platform archive or build from the locked source tree. Every official artifact is deterministic, checksummed, and provenance-attested.</p></div></section>
    <div className="shell content-shell">
      <div className="release-line"><div><span className="release-dot" /><div><strong>Latest compatibility beta</strong><span>Released July 26, 2026 · Edition 2</span></div></div><Link href="/install">Use guided installer →</Link></div>
      <div className="download-grid">
        {builds.map(build => <article className={`download-card ${build.href ? "available" : "pending"}`} key={`${build.platform}-${build.arch}`}>
          <div className="platform-icon">{build.icon}</div><span className="download-state">{build.state}</span><h2>{build.platform}</h2><h3>{build.arch}</h3><p>{build.detail}</p>
          <a className="download-action" href={build.href}>Download archive <span>↓</span></a>
        </article>)}
      </div>
      <section className="verify-section">
        <div><span className="kicker">Trust, then run</span><h2>Verify the download.</h2><p>Download the release checksum manifest and compare the entry for your archive.</p><div className="digest"><span>SHA-256</span><a href="https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.5/SHA256SUMS">Download SHA256SUMS ↗</a></div></div>
        <div className="prose-card"><h3>GitHub attestation</h3><p>Verify the archive&apos;s signed build provenance:</p><pre><code>gh attestation verify --repo violetweather/nivren &lt;artifact.zip&gt;</code></pre><h3>Build it yourself</h3><pre><code>{`git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked`}</code></pre><Link href="/install">Full installation guide →</Link></div>
      </section>
    </div>
  </>;
}
