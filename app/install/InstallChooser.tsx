"use client";

import { useState } from "react";

type Platform = "mac" | "linux" | "windows" | "source";

const instructions: Record<Platform, { label: string; available: string; commands: string; note: string }> = {
  mac: { label: "macOS", available: "Guided installer · Apple Silicon and Intel", commands: `curl --proto '=https' --tlsv1.2 -fsSLO \\
  https://raw.githubusercontent.com/violetweather/nivren/main/install/install.sh
sh install.sh`, note: "The installer detects your Mac, verifies the archive, keeps the docs, native libraries, C header, SBOM, and offers to configure PATH and VS Code." },
  linux: { label: "Linux", available: "Guided installer · x64 and ARM64", commands: `curl --proto '=https' --tlsv1.2 -fsSLO \\
  https://raw.githubusercontent.com/violetweather/nivren/main/install/install.sh
sh install.sh`, note: "The installer detects your architecture, verifies the archive, keeps the docs, native libraries, C header, SBOM, and offers to configure PATH and VS Code." },
  windows: { label: "Windows", available: "Guided installer · x64 and ARM64", commands: `Invoke-WebRequest https://raw.githubusercontent.com/violetweather/nivren/main/install/install.ps1 -OutFile install.ps1
Set-ExecutionPolicy -Scope Process Bypass
.\\install.ps1`, note: "The installer verifies the archive, retains its native SDK and SBOM, and offers to update your user PATH and install the VS Code extension." },
  source: { label: "From source", available: "Rust 1.88+", commands: `git clone https://github.com/violetweather/nivren.git
cd nivren
cargo test --workspace --all-targets --locked
cargo build --release --workspace --locked
./target/release/niv version`, note: "Building from source uses the exact dependency graph in Cargo.lock and runs on any supported Rust host." },
};

export function InstallChooser() {
  const [platform, setPlatform] = useState<Platform>("mac");
  const [copied, setCopied] = useState(false);
  const item = instructions[platform];
  const installerHref = platform === "windows"
    ? "https://raw.githubusercontent.com/violetweather/nivren/main/install/install.ps1"
    : "https://raw.githubusercontent.com/violetweather/nivren/main/install/install.sh";
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
      <div className="installer-title"><div><span>{item.available}</span><h2>{item.label} installation</h2></div>{platform !== "source" && <a className="button primary" href={installerHref}>Download installer</a>}</div>
      <div className="command-block install-command"><button onClick={copy} aria-label="Copy install commands">{copied ? "Copied" : "Copy"}</button><pre><code>{item.commands}</code></pre></div>
      <p className="install-note">{item.note}</p>
    </div>
    <div className="verify-row"><span className="verify-mark">✓</span><div><strong>Verification is built in</strong><p>The installer verifies SHA-256 automatically and also verifies GitHub provenance whenever GitHub CLI is available.</p></div></div>
  </section>;
}
