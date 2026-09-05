import type { Metadata } from "next";
import Link from "next/link";
import {InstallChooser} from "./InstallChooser";
import {publicRelease} from "../release";
import {SyntaxCode} from "../components/SyntaxCode";
export const metadata: Metadata={title:"Install Nivren",description:"Get Nivren for Windows, macOS, and Linux."};
export default function Install(){return <><section className="page-hero compact"><div className="shell"><span className="kicker">Nivren {publicRelease.version} · Stable</span><h1>Your next idea starts here.</h1><p>Choose your platform. The guided installer verifies the download and helps set up your editor.</p></div></section><div className="shell content-shell install-content"><InstallChooser/><p className="install-note">Prefer a manual download? <Link href="/downloads">Browse all release archives ↗</Link></p><section className="next-steps"><div><span className="step-label">After installation</span><h2>Make your first project.</h2><p>Create a project, run it, and make it your own. Everything you need is in the toolchain.</p><Link className="button primary" href="/docs">Read the quickstart ↗</Link></div><pre tabIndex={0}><SyntaxCode code={`niv new my-app
cd my-app
niv dev`} language="shell"/></pre></section><details className="docs-callout"><summary>Updating, rollback, and verification</summary><p>The installer verifies each archive against its SHA-256 checksum and keeps a previous verified version. Use <code>sh install.sh --rollback</code> on macOS or Linux, or <code>.\install.ps1 -Rollback</code> in PowerShell to restore it.</p><p>Read the installation guide in <Link href="/docs">the documentation</Link> for signed channels, receipts, and uninstall options.</p></details></div></>;}
