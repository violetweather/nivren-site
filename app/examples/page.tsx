import type { Metadata } from "next";

export const metadata: Metadata = { title: "Examples", description: "See Nivren programs for data modeling, error handling, modules, and concurrency." };

const examples = [
  { tag: "Language", title: "Model a small domain", copy: "Nominal shapes and sealed choices make valid states visible.", code: `shape User { name: String, active: Bool }
choice Access { Guest, Member, Admin }

define greeting(user: User, access: Access) gives String {
    give choose access {
        Guest => "Welcome, guest",
        Member => "Hello, " + user.name,
        Admin => "Admin: " + user.name
    }
}

keep mira = User("Mira", yes)
show(greeting(mira, Access.Member))` },
  { tag: "Reliability", title: "Handle failure explicitly", copy: "Typed results keep error paths local, exhaustive, and testable.", code: `define loadConfig(path: String) gives Result<String, String> {
    give std.fs.read(path)
}

keep config = loadConfig("app.json")
keep message = choose config {
    Ok(text) => std.json.compact(text),
    Err(problem) => err("config: " + problem)
}

show(choose message {
    Ok(text) => text,
    Err(problem) => problem
})` },
  { tag: "Concurrency", title: "Bound the work", copy: "Structured tasks and bounded channels make ownership and backpressure explicit.", code: `keep results = std.channel.create(8)

define calculate() gives Int {
    keep sent = std.channel.send(results, 6 * 7, 2.0)
    give choose sent {
        Ok(value) => 1,
        Err(problem) => 0
    }
}

keep worker = std.task.spawn(calculate)
keep answer = std.channel.receive(results, 2.0)
keep finished = std.task.await(worker)

show(choose answer {
    Ok(value) => value,
    Err(problem) => 0
})` },
];

export default function ExamplesPage() {
  return <><section className="page-hero compact"><div className="shell"><span className="kicker">Learn by reading</span><h1>Examples</h1><p>Complete, type-checked patterns showing how Edition 2 code fits together.</p></div></section>
  <div className="shell content-shell example-list">{examples.map((example, index) => <article className="example-row" key={example.title}><div className="example-copy"><span>{String(index + 1).padStart(2,"0")} · {example.tag}</span><h2>{example.title}</h2><p>{example.copy}</p></div><div className="example-code"><div><i /><i /><i /><span>example.niv</span></div><pre><code>{example.code}</code></pre></div></article>)}</div></>;
}
