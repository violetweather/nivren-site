import Link from "next/link";
import { StudioNav } from "./StudioNav";

export const metadata = { title: "Nivren Studio", description: "The Nivren-first environment for understanding, building, and shipping Nivren 1.0 (Edition 6) software." };

export default function StudioPage() {
  return <>
    <StudioNav />
    <section className="studio-hero shell">
      <div><span className="kicker">Nivren Studio developer preview</span><h1>See what your program <em>means.</em></h1><p>A Nivren-first Code‑OSS workbench with Edition 6 intelligence for Nivren 1.0, an account-free Agent surface, and the editing, terminal, Git, extension, and accessibility foundations developers already expect.</p><div className="hero-actions"><Link className="button primary" href="/studio/downloads">Download developer preview</Link><Link className="button secondary" href="/studio/docs">Explore the workflow</Link></div></div>
      <div className="studio-window" aria-label="Nivren Studio interface preview"><div className="studio-titlebar"><i/><i/><i/><span>commerce · Nivren Studio</span></div><div className="studio-workbench"><aside><b>PROJECT</b><span>api</span><span>shared</span><span>tests</span></aside><pre><code className="syntax-code"><span className="syn-keyword">define</span> fetch_user{`\n`}<span className="syn-keyword">needs</span> Network <span className="syn-keyword">within</span> <span className="syn-string">&quot;api.example.com&quot;</span>{`\n`}{`{`}{`\n`}    <span className="syn-keyword">keep</span> response <span className="syn-keyword">set perform</span> request <span className="syn-keyword">or give</span>{`\n`}    <span className="syn-keyword">give</span> response <span className="syn-keyword">through</span> decode_user{`\n`}{`}`}</code></pre><section><b>INTENT</b><strong>1 external effect</strong><span>Network</span><span>0 plan allocations</span><span>Cleanup proven</span></section></div><div className="studio-agent"><span>⌁ Agent</span><p>Explain, plan, review, or run in an isolated checkpoint…</p><kbd>⌘↵</kbd></div></div>
    </section>
    <section className="proof-strip"><div className="shell proof-grid"><div><strong>Code‑OSS</strong><span>proven editor foundation</span></div><div><strong>5</strong><span>BYOK agent providers</span></div><div><strong>Nivren 1.0</strong><span>syntax, diagnostics, and commands</span></div><div><strong>Local first</strong><span>no Nivren account required</span></div></div></section>
    <section className="section shell"><div className="section-heading split-heading"><div><span className="kicker">Nivren, made visible</span><h2>An IDE only this language could have.</h2></div><p>Ordinary editing stays quiet. The deeper machinery appears when it answers a real question.</p></div><div className="studio-feature-grid">
      <article><span>01</span><h2>Intent lens</h2><p>Follow coral paths from source to effect order, authority, allocation, blocking, resources, optimization, and runtime evidence.</p></article>
      <article><span>02</span><h2>Semantic debugger</h2><p>Step through structured tasks and typed failures consistently across the VM, JIT, and native builds.</p></article>
      <article><span>03</span><h2>Agent with boundaries</h2><p>Bring your own provider. Preview context, isolate edits in worktrees, inspect evidence, and grant each effect separately.</p></article>
      <article><span>04</span><h2>Ship center</h2><p>Tests, coverage, profiles, packages, artifacts, signatures, SBOMs, provenance, and reproducibility in one reviewable path.</p></article>
      <article><span>05</span><h2>Remote, same model</h2><p>Use SSH, Docker, or Podman without sending source elsewhere or weakening Nivren&apos;s capability locks.</p></article>
      <article><span>06</span><h2>Your code keeps the room</h2><p>The compact Agent Shelf, reflowing Peek, and dedicated Agent Space never cover source code.</p></article>
    </div></section>
  </>;
}
