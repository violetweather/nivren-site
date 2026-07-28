import type { Metadata } from "next";
import Link from "next/link";
import { InstallChooser } from "./InstallChooser";

export const metadata: Metadata = { title: "Install", description: "Install Nivren on macOS, Linux, or Windows with verified archives, PATH setup, and editor support." };

export default function InstallPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Start building</span><h1>Install Nivren</h1><p>Use the guided installer to detect your system, verify Nivren, configure PATH, optionally add VS Code support, retain a recovery version, and safely modify only roots carrying Nivren&apos;s ownership marker.</p></div></section>
    <div className="shell content-shell install-content">
      <div className="notice"><span className="notice-mark">✓</span><div><strong>The Edition 3 beta is ready</strong>The guided installer downloads the correct 0.10.0-beta.6 archive, checks its SHA-256 digest, and can configure PATH and VS Code for you.</div></div>
      <InstallChooser />
      <section className="docs-callout"><span className="kicker">Recovery is local</span><h2>Roll back without redownloading.</h2><p>Every successful install writes <code>install-receipt.json</code> and retains the previous verified version. Run <code>sh install.sh --rollback</code> on macOS/Linux or <code>.\install.ps1 -Rollback</code> on Windows. Rollback swaps current and previous versions and refuses missing ownership markers, malformed receipts, or missing binaries.</p></section>
      <section className="next-steps">
        <div><span className="step-label">Next</span><h2>Write something small.</h2><p>Follow the quickstart to check and run a complete first program, then turn it into a project.</p><Link className="button primary" href="/docs">Open quickstart →</Link></div>
        <div className="mini-terminal"><div><i /><i /><i /><span>terminal</span></div><pre><code>{`$ niv check hello.niv
hello.niv: ok

$ niv run hello.niv
Hello, Nivren!
17`}</code></pre></div>
      </section>
    </div>
  </>;
}
