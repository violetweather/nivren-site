import type { Metadata } from "next";
import Link from "next/link";
import { InstallChooser } from "./InstallChooser";

export const metadata: Metadata = { title: "Install", description: "Install Nivren on macOS, Linux, or Windows with verified archives, PATH setup, and editor support." };

export default function InstallPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Start building</span><h1>Install Nivren</h1><p>Use the guided installer to detect your system, verify Nivren, configure PATH, optionally add VS Code support, and safely uninstall only roots carrying Nivren&apos;s ownership marker.</p></div></section>
    <div className="shell content-shell install-content">
      <div className="notice"><span className="notice-mark">!</span><div><strong>Publication is held for the complete audit</strong>The guided flow below is the release design. Existing public links remain on the last published build until Edition 3, its docs, and every release gate pass together.</div></div>
      <InstallChooser />
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
