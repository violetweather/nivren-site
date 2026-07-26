import type { Metadata } from "next";
import Link from "next/link";
import { InstallChooser } from "./InstallChooser";

export const metadata: Metadata = { title: "Install", description: "Install the Nivren compatibility beta on macOS, Linux, or Windows." };

export default function InstallPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Start building</span><h1>Install Nivren</h1><p>Get the compatibility beta, verify what you downloaded, and run your first checked program in a few minutes.</p></div></section>
    <div className="shell content-shell install-content">
      <div className="notice"><span className="notice-mark">!</span><div><strong>Compatibility beta</strong>Nivren 0.9 is ready for evaluation and pilot projects, but is not yet approved for running untrusted source, bytecode, or packages.</div></div>
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
