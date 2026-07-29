import { StudioNav } from "../StudioNav";

const releaseBase = "https://github.com/violetweather/nivren-studio-releases/releases/download/v1.0.0-beta.1";

const downloads = [
  { name: "macOS 14+ · Apple silicon", asset: "nivren-studio-v1.0.0-beta.1-macos-arm64.zip" },
  { name: "macOS 14+ · Intel", asset: "nivren-studio-v1.0.0-beta.1-macos-x64.zip" },
  { name: "Windows 11 · x64", asset: "nivren-studio-v1.0.0-beta.1-windows-x64.zip" },
  { name: "Windows 11 · ARM64", asset: "nivren-studio-v1.0.0-beta.1-windows-arm64.zip" },
  { name: "Linux · x64", asset: "nivren-studio-v1.0.0-beta.1-linux-x64.zip" },
  { name: "Linux · ARM64", asset: "nivren-studio-v1.0.0-beta.1-linux-arm64.zip" },
];

export const metadata = { title: "Studio downloads" };

export default function StudioDownloads() {
  return <>
    <StudioNav />
    <section className="page-hero compact shell">
      <span className="kicker">1.0.0-beta.1 · Public preview</span>
      <h1>Studio downloads</h1>
      <p>Portable developer-preview builds are available for all six target combinations. Every archive is built from one source revision and ships with verification evidence.</p>
    </section>
    <section className="content-shell shell">
      <div className="studio-download-grid">
        {downloads.map((download) => <article key={download.name}>
          <span className="download-state">Beta · verified artifact</span>
          <h2>{download.name}</h2>
          <p>Portable ZIP · bundled Nivren Edition 4 toolchain</p>
          <p>SHA-256 · Ed25519 signature · SPDX SBOM · commit-bound provenance · release manifest</p>
          <a className="download-action" href={`${releaseBase}/${download.asset}`}>Download beta</a>
        </article>)}
      </div>
      <div className="studio-callout">
        <div>
          <span className="kicker">Portable beta, honestly labeled</span>
          <h2>Six builds. One source revision.</h2>
          <p>These archives carry Nivren&apos;s artifact signature, not Apple, Microsoft, or Linux-distribution trust. Guided system installers, automatic updates, rollback, and uninstall remain stable-gated work.</p>
          <a className="button secondary" href="https://github.com/violetweather/nivren-studio-releases/releases/tag/v1.0.0-beta.1">Checksums, signatures, SBOMs, and release notes</a>
        </div>
      </div>
    </section>
  </>;
}
