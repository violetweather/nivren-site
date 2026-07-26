"use client";

import { useState } from "react";

type Platform = "mac" | "linux" | "windows" | "source";

const instructions: Record<Platform, { label: string; available: string; commands: string; note: string }> = {
  mac: { label: "macOS", available: "Apple Silicon binary available", commands: `# After downloading and extracting the ZIP
install -d "$HOME/.local/bin"
install -m 755 nivren-0.9.0-beta.1-macos-arm64/bin/niv \\
  "$HOME/.local/bin/niv"
niv version`, note: "The current local beta binary supports Apple Silicon. Intel builds will arrive through the hosted release workflow." },
  linux: { label: "Linux", available: "Build from source", commands: `git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked
install -d "$HOME/.local/bin"
install -m 755 target/release/niv "$HOME/.local/bin/niv"
niv version`, note: "Prebuilt x64 and ARM64 archives are configured and will appear after the first six-platform hosted release." },
  windows: { label: "Windows", available: "Build from source", commands: `git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --locked
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\\Nivren\\bin"
Copy-Item target\\release\\niv.exe "$env:LOCALAPPDATA\\Nivren\\bin\\niv.exe"
& "$env:LOCALAPPDATA\\Nivren\\bin\\niv.exe" version`, note: "Add the Nivren bin folder to your user Path. Prebuilt x64 and ARM64 archives will follow the hosted release." },
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
      <div className="installer-title"><div><span>{item.available}</span><h2>{item.label} installation</h2></div>{platform === "mac" && <a className="button primary" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/downloads/nivren-0.9.0-beta.1-macos-arm64.zip`}>Download ZIP</a>}</div>
      <div className="command-block install-command"><button onClick={copy} aria-label="Copy install commands">{copied ? "Copied" : "Copy"}</button><pre><code>{item.commands}</code></pre></div>
      <p className="install-note">{item.note}</p>
    </div>
    <div className="verify-row"><span className="verify-mark">✓</span><div><strong>Verify before installing</strong><p>Compare the archive with the published SHA-256 checksum and verify its GitHub provenance attestation when available.</p></div></div>
  </section>;
}
