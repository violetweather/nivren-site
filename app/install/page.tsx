import type { Metadata } from "next";
import Link from "next/link";
import { InstallChooser } from "./InstallChooser";
import { publicRelease } from "../release";
import { SyntaxCode } from "../components/SyntaxCode";

export const metadata: Metadata = { title: "Install", description: "Install Nivren on macOS, Linux, or Windows with verified archives, PATH setup, and editor support." };

export default function InstallPage() {
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Start building</span><h1>Install Nivren</h1><p>Use the guided installer to detect your system, verify Nivren, configure PATH, optionally add VS Code support, retain a recovery version, and safely modify only roots carrying Nivren&apos;s ownership marker.</p></div></section>
    <div className="shell content-shell install-content">
      <div className="notice"><span className="notice-mark">✓</span><div><strong>Nivren {publicRelease.version} stable is ready — Edition {publicRelease.edition}</strong>The guided installer downloads the correct {publicRelease.version} archive, checks its SHA-256 digest, and can configure PATH and VS Code for you.</div></div>
      <InstallChooser />
      <section className="docs-callout"><span className="kicker">Signed updates</span><h2>Choose a channel after trust is established.</h2><p>The installer supports <code>stable</code>, <code>beta</code>, and <code>nightly</code> manifests signed by a dedicated Ed25519 key. Existing verified installs can run <code>sh install.sh --channel stable --channel-key ./nivren-channel.pub</code> or <code>.\install.ps1 -Channel stable -ChannelKey .\nivren-channel.pub</code>. The installer rejects expired, tampered, or older-generation manifests and requires the archive to match both its signed digest and <code>SHA256SUMS</code>. The channel public key is published as <a href="https://nivren.nnx.fyi/nivren-channel.pub">nivren-channel.pub</a> here and as <code>install/nivren-channel.pub</code> in the source repository; compare the two before trusting either. Unix and Windows x64/ARM64 fixtures cover retained keys and generations, digest failure atomicity, rollback, and safe uninstall.</p></section>
      <section className="docs-callout"><span className="kicker">Recovery is local</span><h2>Roll back without redownloading.</h2><p>Every successful install writes <code>install-receipt.json</code> and retains the previous verified version. Run <code>sh install.sh --rollback</code> on macOS/Linux or <code>.\install.ps1 -Rollback</code> on Windows. Rollback swaps current and previous versions and refuses missing ownership markers, malformed receipts, or missing binaries.</p></section>
      <section className="next-steps">
        <div><span className="step-label">Next</span><h2>Write something small.</h2><p>Follow the quickstart to check and run a complete first program, then turn it into a project.</p><Link className="button primary" href="/docs">Open quickstart →</Link></div>
        <div className="mini-terminal"><div><i /><i /><i /><span>terminal</span></div><pre><SyntaxCode language="output" code={`$ niv check hello.niv
hello.niv: ok

$ niv run hello.niv
Hello, Nivren!
17`} /></pre></div>
      </section>
    </div>
  </>;
}
