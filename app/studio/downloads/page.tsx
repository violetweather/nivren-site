import { StudioNav } from "../StudioNav";

const releaseBase = "https://github.com/violetweather/nivren-studio-releases/releases/download/v1.132.0-developer.1";

const downloads = [
  { name: "macOS 14+ · Apple silicon", asset: "Nivren-Studio-macOS-arm64-1.132.0-developer.dmg", status: "Developer preview · verified DMG" },
  { name: "macOS 14+ · Intel", status: "Not published" },
  { name: "Windows 11 · x64", status: "Not published" },
  { name: "Windows 11 · ARM64", status: "Not published" },
  { name: "Ubuntu / Fedora · x64", status: "Not published" },
  { name: "Ubuntu / Fedora · ARM64", status: "Not published" },
];

export const metadata = { title: "Studio downloads" };

export default function StudioDownloads() {
  return <>
    <StudioNav />
    <section className="page-hero compact shell">
      <span className="kicker">1.132.0-developer.1 · Developer preview</span>
      <h1>Studio downloads</h1>
      <p>The first Code‑OSS-based preview is available for Apple-silicon Macs. Other platforms stay visibly unavailable until their builds and runtime evidence pass.</p>
    </section>
    <section className="content-shell shell">
      <div className="studio-download-grid">
        {downloads.map((download) => <article key={download.name}>
          <span className="download-state">{download.status}</span>
          <h2>{download.name}</h2>
          {download.asset ? <><p>DMG · Nivren language support and Agent included</p><p>SHA-256 · SPDX SBOM · release manifest · ad-hoc application signature</p><a className="download-action" href={`${releaseBase}/${download.asset}`}>Download preview</a></> : <><p>Build and platform validation are still in progress.</p><span className="download-action disabled">Unavailable</span></>}
        </article>)}
      </div>
      <div className="studio-callout">
        <div>
          <span className="kicker">Preview, honestly labeled</span>
          <h2>One verified build today.</h2>
          <p>This DMG is ad-hoc signed for developer testing; it is not Apple Developer ID signed or notarized. Intel macOS, Windows, Linux, guided updates, rollback, and uninstall remain 1.0-gated work.</p>
          <a className="button secondary" href="https://github.com/violetweather/nivren-studio-releases/releases/tag/v1.132.0-developer.1">Checksums, SBOM, manifest, and release notes</a>
        </div>
      </div>
    </section>
  </>;
}
