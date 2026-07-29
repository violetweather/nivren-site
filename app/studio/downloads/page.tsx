import { StudioNav } from "../StudioNav";

const downloads = [
  { name: "macOS 14+ · Apple silicon", formats: "Notarized PKG + DMG" },
  { name: "macOS 14+ · Intel", formats: "Notarized PKG + DMG" },
  { name: "Windows 11 · x64", formats: "Timestamped MSI + MSIX" },
  { name: "Windows 11 · ARM64", formats: "Timestamped MSI + MSIX" },
  { name: "Linux · x64", formats: "AppImage + DEB + RPM" },
  { name: "Linux · ARM64", formats: "AppImage + DEB + RPM" },
];

export const metadata = { title: "Studio downloads" };

export default function StudioDownloads() {
  return <>
    <StudioNav />
    <section className="page-hero compact shell">
      <span className="kicker">Private local candidate</span>
      <h1>Studio downloads</h1>
      <p>Installers appear here only after native signing, clean-system install, update, rollback, recovery, and uninstall evidence passes for that exact platform.</p>
    </section>
    <section className="content-shell shell">
      <div className="studio-download-grid">
        {downloads.map((download) => <article key={download.name}>
          <span className="download-state">Awaiting native release evidence</span>
          <h2>{download.name}</h2>
          <p>{download.formats}</p>
          <p>Offline payload · pinned signature · checksum · SPDX SBOM · provenance · safe uninstall</p>
          <span className="download-action disabled">Not published</span>
        </article>)}
      </div>
      <div className="studio-callout">
        <div>
          <span className="kicker">Evidence before claims</span>
          <h2>Six native receipts. One source revision.</h2>
          <p>The stable gate rejects partial, duplicate, mixed-source, extraction-only, and incorrectly signed platform evidence. Channel pinning and exact rollback are verified before a download can appear.</p>
        </div>
      </div>
    </section>
  </>;
}
