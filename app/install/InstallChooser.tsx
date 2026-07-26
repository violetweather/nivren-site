"use client";

import { useState } from "react";

type Platform = "mac" | "linux" | "windows" | "source";

const instructions: Record<Platform, { label: string; available: string; commands: string; note: string }> = {
  mac: { label: "macOS", available: "Apple Silicon and Intel", commands: `# After downloading and extracting the ZIP
install -d "$HOME/.local/bin"
install -m 755 nivren-v0.10.0-beta.1-macos-arm64/bin/niv \\
  "$HOME/.local/bin/niv"
niv version`, note: "Use the macos-x64 archive instead on Intel. Verify SHA256SUMS and the GitHub attestation before installing." },
  linux: { label: "Linux", available: "x64 and ARM64 archives", commands: `# After downloading and extracting the matching ZIP
install -d "$HOME/.local/bin"
install -m 755 nivren-v0.10.0-beta.1-linux-x64/bin/niv "$HOME/.local/bin/niv"
niv version`, note: "Use the linux-arm64 archive on ARM machines. Verify SHA256SUMS and the GitHub attestation before installing." },
  windows: { label: "Windows", available: "x64 and ARM64 archives", commands: `# After downloading and extracting the matching ZIP
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\\Nivren\\bin"
Copy-Item nivren-v0.10.0-beta.1-windows-x64\\bin\\niv.exe "$env:LOCALAPPDATA\\Nivren\\bin\\niv.exe"
& "$env:LOCALAPPDATA\\Nivren\\bin\\niv.exe" version`, note: "Use the windows-arm64 archive on ARM machines, then add the Nivren bin folder to your user Path." },
  source: { label: "From source", available: "Rust 1.85+", commands: `git clone https://github.com/violetweather/nivren.git
cd nivren
cargo test --workspace --all-targets --locked
cargo build --release --locked
./target/release/niv version`, note: "Building from source uses the exact dependency graph in Cargo.lock and runs on any supported Rust host." },
};

export function InstallChooser() {
  const [platform, setPlatform] = useState<Platform>("mac");
  const [copied, setCopied] = useState(false);
  const item = instructions[platform];
  async function copy() {
    await navigator.clipboard.writeText(item.commands);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <section className="installer-card">
    <div className="platform-tabs" role="tablist" aria-label="Installation platform">
      {(Object.keys(instructions) as Platform[]).map(key => <button role="tab" aria-selected={platform === key} className={platform === key ? "active" : ""} key={key} onClick={() => { setPlatform(key); setCopied(false); }}>{instructions[key].label}</button>)}
    </div>
    <div className="installer-body">
      <div className="installer-title"><div><span>{item.available}</span><h2>{item.label} installation</h2></div>{platform !== "source" && <a className="button primary" href="https://github.com/violetweather/nivren/releases/tag/v0.10.0-beta.1">Choose download</a>}</div>
      <div className="command-block install-command"><button onClick={copy} aria-label="Copy install commands">{copied ? "Copied" : "Copy"}</button><pre><code>{item.commands}</code></pre></div>
      <p className="install-note">{item.note}</p>
    </div>
    <div className="verify-row"><span className="verify-mark">✓</span><div><strong>Verify before installing</strong><p>Compare the archive with the published SHA-256 checksum and verify its GitHub provenance attestation.</p></div></div>
  </section>;
}
