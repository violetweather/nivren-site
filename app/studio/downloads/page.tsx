import { StudioNav } from "../StudioNav";

const releaseBase = "https://github.com/violetweather/nivren-studio-releases/releases/download/v1.132.0-developer.1";

const downloads = [
  { name: "macOS 14+ · Apple silicon", asset: "Nivren-Studio-macOS-arm64-1.132.0-developer.dmg", status: "Developer preview · verified DMG", format: "DMG", proof: "SHA-256 · SPDX SBOM · release manifest · ad-hoc application signature" },
  { name: "macOS 14+ · Intel", status: "Build passed · release pending" },
  { name: "Windows 11 · x64", asset: "Nivren-Studio-Windows-x64-1.132.0-developer.1.zip", status: "Developer preview · verified ZIP", format: "Portable ZIP", proof: "SHA-256 · 3,075-package SPDX SBOM · release manifest · unsigned" },
  { name: "Windows 11 · ARM64", asset: "Nivren-Studio-Windows-ARM64-1.132.0-developer.1.zip", status: "Developer preview · verified ZIP", format: "Portable ZIP", proof: "SHA-256 · 3,075-package SPDX SBOM · release manifest · unsigned" },
  { name: "Ubuntu / Fedora · x64", status: "Build passed · release pending" },
  { name: "Ubuntu / Fedora · ARM64", status: "Build passed · release pending" },
];

export const metadata = { title: "Studio downloads" };

export default function StudioDownloads() {
  return <>
    <StudioNav />
    <section className="page-hero compact shell">
      <span className="kicker">1.132.0-developer.1 · Developer preview</span>
      <h1>Studio downloads</h1>
      <p>Verified developer previews are available for Apple-silicon Macs and Windows x64/ARM64. Other platforms stay visibly unavailable until their builds and runtime evidence pass.</p>
    </section>
    <section className="content-shell shell">
      <div className="studio-download-grid">
        {downloads.map((download) => <article key={download.name}>
          <span className="download-state">{download.status}</span>
          <h2>{download.name}</h2>
          {download.asset ? <><p>{download.format} · Nivren language support and Agent included</p><p>{download.proof}</p><a className="download-action" href={`${releaseBase}/${download.asset}`}>Download preview</a></> : <><p>Build and platform validation are still in progress.</p><span className="download-action disabled">Unavailable</span></>}
        </article>)}
      </div>
      <div className="studio-callout">
        <div>
          <span className="kicker">Preview, honestly labeled</span>
          <h2>Three verified builds today.</h2>
          <p>The macOS DMG is ad-hoc signed and not notarized. The Windows x64 and ARM64 packages are unsigned portable ZIPs, not guided installers. Independent runtime validation, signing, updates, rollback, and uninstall remain 1.0-gated work.</p>
          <a className="button secondary" href="https://github.com/violetweather/nivren-studio-releases/releases/tag/v1.132.0-developer.1">Checksums, SBOM, manifest, and release notes</a>
        </div>
      </div>
    </section>
  </>;
}
