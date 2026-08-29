import Link from "next/link";
import { CodeTile } from "./components/CodeTile";
import { Marquee } from "./components/Marquee";
import { SyntaxCode } from "./components/SyntaxCode";
import { candidateRelease, publicRelease } from "./release";

const heroCode = `keep language is String set "Nivren"

define greet
takes { name is String }
gives String
{
    give "Hello, " + name + "!"
}`;

type Tile = { label: string; title: string; code: string; size?: "one" | "wide" | "tall" };

const tiles: Tile[] = [
  {
    label: "authority",
    title: "Effects are declared, then granted",
    size: "wide" as const,
    code: `define fetch
takes { url is String }
gives String or String
needs Network within "api.example.com"
{
    give perform std.web.get with { url set url }
}`,
  },
  {
    label: "failure",
    title: "No exceptions. No nulls.",
    code: `keep text set perform read
    with { path set "app.json" }
    or give

give ok(text)`,
  },
  {
    label: "choice",
    title: "Every case, exactly once",
    code: `choose state {
    case Idle => "idle"
    case Running => "running"
    case Failed carries problem => problem
    case Done => "done"
}`,
  },
  {
    label: "concurrency",
    title: "Tasks cannot outlive their scope",
    code: `keep joined set together
    [start first, start second]

keep quickest set race
    [start first, start second]`,
  },
  {
    label: "resources",
    title: "Closed on success, failure, and crash",
    size: "wide" as const,
    code: `using file = opened or give {
    give perform std.files.read_open
        with { file set file }
}`,
  },
  {
    label: "pipelines",
    title: "Left to right, in source order",
    code: `keep batches set [1, 2, 3, 4, 5]
    through std.list.batch
    with { size set 2 }`,
  },
];

const commands = [
  "niv new", "niv dev", "niv check", "niv test", "niv fmt", "niv doc",
  "niv debug", "niv profile", "niv coverage", "niv explain", "niv build", "niv ship",
];

const packages = [
  "nivren_sql", "nivren_crypto", "nivren_jwt", "nivren_redis", "nivren_aws",
  "nivren_csv", "nivren_image", "nivren_gpu", "nivren_matrix", "nivren_routing",
  "nivren_validation", "nivren_metrics",
];

const numbers = [
  { value: `${candidateRelease.checkpointGatesPassed} / ${candidateRelease.checkpointGatesRequired}`, label: "Product Proof checkpoints", note: `Completed for ${candidateRelease.version}. The rest gate 1.0.` },
  { value: "7.62×", label: "Faster startup than Node", note: "Source to printed result on an M4, fresh process each run." },
  { value: "6 + WebAssembly", label: "Compile targets", note: "Native, standalone, WASI, and a zero-import browser guest." },
  { value: "0", label: "Unsafe blocks in the core VM", note: "Unsafe authority never reaches a safe module implicitly." },
];

const session = `$ niv new my-app
  created my-app/ manifest, src/main.niv, tests/
$ niv dev
  checked 4 declarations  ok
  granted FileRead path:./data
  Hello, Nivren!
$ niv test
  6 passed, 0 failed
$ niv ship
  checked, tested, documented, packaged
  wrote target/my-app  standalone, 3.1 MiB`;

export default function Home() {
  return (
    <>
      <section className="stage">
        <p className="stage-meta">
          <span className="stamp">Edition 4 public beta</span>
          <span className="stamp-rule" aria-hidden="true" />
          <span className="stamp-version">{publicRelease.version}</span>
        </p>
        <h1>Code that reads like <em>intent.</em></h1>
        <div className="stage-foot">
          <p className="stage-lede">
            An application language where the source says what it keeps, changes, needs, and
            gives — and the compiler holds it to that.
          </p>
          <div className="stage-actions">
            <Link className="button primary" href="/install">
              Install Nivren <span aria-hidden="true">→</span>
            </Link>
            <Link className="button ghost" href="/docs">Read the docs</Link>
          </div>
          <pre className="stage-code" aria-label="A first Nivren program">
            <SyntaxCode code={heroCode} />
          </pre>
        </div>
      </section>

      <Marquee tone="loud" items={commands} />

      <section className="wall">
        <div className="wall-head">
          <h2>
            Small core.
            <br />
            Serious range.
          </h2>
          <p>
            Six ideas carry the whole language. Every one of them is visible in the source, checked
            before it runs, and reported by the tooling.
          </p>
        </div>
        <div className="wall-grid">
          {tiles.map((tile) => (
            <CodeTile key={tile.label} label={tile.label} title={tile.title} code={tile.code} size={tile.size} />
          ))}
        </div>
      </section>

      <section className="figures">
        <div className="figures-head">
          <h2>Evidence, not adjectives.</h2>
          <p>Every claim below has a public harness, a checked-in result, or an open gate.</p>
          <Link className="text-link" href="/benchmarks">
            See the full comparison <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ol className="figures-list">
          {numbers.map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="session">
        <div className="session-copy">
          <h2>
            One path.
            <br />
            No ceremony.
          </h2>
          <p>
            One command creates, checks, runs, tests, documents, packages, and emits a standalone
            executable. No plugin hunt. No build config. No separate release toolchain.
          </p>
          <Link className="text-link" href="/docs">
            Read the quickstart <span aria-hidden="true">→</span>
          </Link>
        </div>
        <pre className="session-code" aria-label="A complete Nivren session">
          <SyntaxCode code={session} language="shell" />
        </pre>
      </section>

      <Marquee items={packages} />

      <section className="finale">
        <p className="stage-meta">Edition 4 beta · Product Proof in progress</p>
        <h2>
          Make the next program
          <br />
          feel obvious.
        </h2>
        <div className="finale-actions">
          <Link className="button primary" href="/install">Install Nivren</Link>
          <Link className="button ghost" href="/downloads">Download an archive</Link>
          <Link className="text-link" href="/examples">
            Browse examples <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
