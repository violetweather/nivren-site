import type { Metadata } from "next";
import Link from "next/link";
import { betaLabel, publicRelease, releaseAssetUrl } from "../release";
import { SyntaxCode } from "../components/SyntaxCode";

export const metadata: Metadata = { title: "Downloads", description: "Download Nivren binaries and verify release integrity." };

const builds = [
  { platform: "macOS", arch: "Apple Silicon", icon: "⌘", asset: `nivren-v${publicRelease.version}-macos-arm64.zip`, action: "Download archive", detail: "macOS 15 · ZIP" },
  { platform: "macOS", arch: "Intel", icon: "⌘", asset: `nivren-v${publicRelease.version}-macos-x64.zip`, action: "Download archive", detail: "macOS 15 Intel · ZIP" },
  { platform: "Linux", arch: "x64", icon: ">_", asset: `nivren-v${publicRelease.version}-linux-x64.zip`, action: "Download archive", detail: "Ubuntu 24.04 · ZIP" },
  { platform: "Linux", arch: "ARM64", icon: ">_", asset: `nivren-v${publicRelease.version}-linux-arm64.zip`, action: "Download archive", detail: "Ubuntu 24.04 ARM · ZIP" },
  { platform: "Windows", arch: "x64", icon: "⊞", asset: `nivren-v${publicRelease.version}-windows-x64.zip`, action: "Download archive", detail: "Windows 2025 · ZIP" },
  { platform: "Windows", arch: "ARM64", icon: "⊞", asset: `nivren-v${publicRelease.version}-windows-arm64.zip`, action: "Download archive", detail: "Windows 11 ARM · ZIP" },
  { platform: "WebAssembly", arch: "WASI Preview 1", icon: "W", asset: `nivren-v${publicRelease.version}-wasm32-wasip1.wasm`, action: "Download module", detail: "Portable compiler + VM · WASM" },
  { platform: "WebAssembly", arch: "Browser SDK", icon: "W", asset: `nivren-v${publicRelease.version}-browser.mjs`, action: "Download SDK", detail: "JavaScript loader · companion WASM below" },
  { platform: "VS Code", arch: "Extension", icon: "{ }", asset: `nivren-${publicRelease.version}.vsix`, action: "Download VSIX", detail: "Syntax, diagnostics, formatting, completion" },
  { platform: "Container", arch: "Linux x64 + ARM64", icon: "□", href: "https://github.com/violetweather/nivren/pkgs/container/nivren", action: "Open package", detail: "Non-root · OCI + SBOM" },
];

const browserSdk = releaseAssetUrl(`nivren-v${publicRelease.version}-browser.mjs`);
const browserModule = releaseAssetUrl(`nivren-v${publicRelease.version}-browser.wasm`);
const checksums = releaseAssetUrl("SHA256SUMS");

export default function DownloadsPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Edition 4 public beta</span><h1>Downloads</h1><p>Every native archive includes the CLI, guided installers, native libraries and header, documentation, dependency notices, and an SPDX SBOM. Verified WASI/browser modules, a VS Code extension, and a non-root multi-architecture OCI image cover portable, editor, and container hosts.</p></div></section>
    <div className="shell content-shell">
      <div className="release-line"><div><span className="release-dot" /><div><strong>Nivren {publicRelease.version} is published</strong><span>All listed targets are reproducible, checksum-listed, and signed with GitHub build provenance.</span></div></div><Link href="/install">Use the guided installer →</Link></div>
      <div className="download-grid">
        {builds.map(build => <article className="download-card available" key={`${build.platform}-${build.arch}`}>
          <div className="platform-icon">{build.icon}</div><span className="download-state">{betaLabel(publicRelease.version)}</span><h2>{build.platform}</h2><h3>{build.arch}</h3><p>{build.detail}</p>
          <a className="download-action" href={"asset" in build && build.asset ? releaseAssetUrl(build.asset) : build.href}>{build.action} <span aria-hidden="true">↓</span></a>
        </article>)}
      </div>
      <section className="verify-section">
        <div><span className="kicker">Trust, then run</span><h2>Verify the download.</h2><p>Download the release checksum manifest and compare the entry for your artifact. Browser users need both the <a href={browserSdk}>JavaScript SDK</a> and its <a href={browserModule}>browser module</a>.</p><div className="digest"><span>SHA-256</span><a href={checksums}>Download SHA256SUMS ↗</a></div></div>
        <div className="prose-card"><h3>GitHub attestation</h3><p>Verify an archive or WASM module&apos;s signed build provenance:</p><pre><SyntaxCode language="shell" code="gh attestation verify --repo violetweather/nivren <artifact>" /></pre><h3>Build it yourself</h3><pre><SyntaxCode language="shell" code={`git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked`} /></pre><Link href="/install">Full installation guide →</Link></div>
      </section>
    </div>
  </>;
}
