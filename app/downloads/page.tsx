import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Downloads", description: "Download Nivren binaries and verify release integrity." };

const builds = [
  { platform: "macOS", arch: "Apple Silicon", icon: "⌘", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-macos-arm64.zip", detail: "macOS 15 · ZIP" },
  { platform: "macOS", arch: "Intel", icon: "⌘", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-macos-x64.zip", detail: "macOS 15 Intel · ZIP" },
  { platform: "Linux", arch: "x64", icon: ">_", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-linux-x64.zip", detail: "Ubuntu 24.04 · ZIP" },
  { platform: "Linux", arch: "ARM64", icon: ">_", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-linux-arm64.zip", detail: "Ubuntu 24.04 ARM · ZIP" },
  { platform: "Windows", arch: "x64", icon: "⊞", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-windows-x64.zip", detail: "Windows 2025 · ZIP" },
  { platform: "Windows", arch: "ARM64", icon: "⊞", state: "Download", href: "https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/nivren-v0.10.0-beta.6-windows-arm64.zip", detail: "Windows 11 ARM · ZIP" },
  { platform: "WebAssembly", arch: "WASI Preview 1", icon: "W", state: "1.0 audit", href: "", detail: "Portable compiler + VM · WASM" },
  { platform: "WebAssembly", arch: "Browser SDK", icon: "W", state: "1.0 audit", href: "", detail: "Zero imports · WASM + JavaScript" },
  { platform: "Container", arch: "Linux x64 + ARM64", icon: "□", state: "1.0 audit", href: "", detail: "Non-root · OCI + SBOM" },
];

export default function DownloadsPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Edition 3 release work</span><h1>Downloads</h1><p>Every final native archive will include the CLI, guided installers, native libraries and header, documentation, dependency notices, and an SPDX SBOM. Separately verified WASI/browser modules and a non-root multi-architecture OCI image cover portable and container hosts.</p></div></section>
    <div className="shell content-shell">
      <div className="release-line"><div><span className="release-dot" /><div><strong>Public artifacts stay frozen during the audit</strong><span>The links below remain the last published beta until Edition 3 and every release gate pass.</span></div></div><Link href="/install">Read the install plan →</Link></div>
      <div className="download-grid">
        {builds.map(build => <article className={`download-card ${build.href ? "available" : "pending"}`} key={`${build.platform}-${build.arch}`}>
          <div className="platform-icon">{build.icon}</div><span className="download-state">{build.state}</span><h2>{build.platform}</h2><h3>{build.arch}</h3><p>{build.detail}</p>
          {build.href ? <a className="download-action" href={build.href}>Download archive <span>↓</span></a> : <span className="download-action">Publishes after every gate passes</span>}
        </article>)}
      </div>
      <section className="verify-section">
        <div><span className="kicker">Trust, then run</span><h2>Verify the download.</h2><p>Download the release checksum manifest and compare the entry for your archive.</p><div className="digest"><span>SHA-256</span><a href="https://github.com/violetweather/nivren/releases/download/v0.10.0-beta.6/SHA256SUMS">Download SHA256SUMS ↗</a></div></div>
        <div className="prose-card"><h3>GitHub attestation</h3><p>Verify an archive or WASM module&apos;s signed build provenance:</p><pre><code>gh attestation verify --repo violetweather/nivren &lt;artifact&gt;</code></pre><h3>Build it yourself</h3><pre><code>{`git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked`}</code></pre><Link href="/install">Full installation guide →</Link></div>
      </section>
    </div>
  </>;
}
