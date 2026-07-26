import type { Metadata } from "next";
import Link from "next/link";
import { InstallChooser } from "./InstallChooser";

export const metadata: Metadata = { title: "Install", description: "Install the Nivren compatibility beta on macOS, Linux, or Windows." };

export default function InstallPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Start building</span><h1>Install Nivren</h1><p>Use the guided installer to detect your system, verify Nivren, configure PATH, and optionally add VS Code support.</p></div></section>
    <div className="shell content-shell install-content">
      <div className="notice"><span className="notice-mark">!</span><div><strong>You stay in control</strong>The installer shows where files go and asks before changing PATH or installing editor support. Unattended options are available for automation.</div></div>
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
