import type { Metadata } from "next";

export const metadata: Metadata = { title: "Examples", description: "See Nivren programs for data modeling, error handling, modules, and concurrency." };

const examples = [
  { tag: "Language", title: "Model a small domain", copy: "Nominal records and sealed enums make valid states visible.", code: `record User { name: String, active: Bool }
enum Access { Guest, Member, Admin }

fun greeting(user: User, access: Access) -> String {
    return match (access) {
        Guest => "Welcome, guest",
        Member => "Hello, " + user.name,
        Admin => "Admin: " + user.name
    }
}

let mira = User("Mira", true)
print(greeting(mira, Access.Member))` },
  { tag: "Reliability", title: "Handle failure explicitly", copy: "Typed results keep error paths local, exhaustive, and testable.", code: `fun loadConfig(path: String) -> Result<String, String> {
    return std.fs.read(path)
}

let config = loadConfig("app.json")
let message = match (config) {
    Ok(text) => std.json.compact(text),
    Err(problem) => err("config: " + problem)
}

print(match (message) {
    Ok(text) => text,
    Err(problem) => problem
})` },
  { tag: "Concurrency", title: "Bound the work", copy: "Structured tasks and bounded channels make ownership and backpressure explicit.", code: `let results = std.channel.create(8)

fun calculate() -> Int {
    let sent = std.channel.send(results, 6 * 7, 2.0)
    return match (sent) {
        Ok(value) => 1,
        Err(problem) => 0
    }
}

let worker = std.task.spawn(calculate)
let answer = std.channel.receive(results, 2.0)
let finished = std.task.await(worker)

print(match (answer) {
    Ok(value) => value,
    Err(problem) => 0
})` },
];

export default function ExamplesPage() {
  return <><section className="page-hero compact"><div className="shell"><span className="kicker">Learn by reading</span><h1>Examples</h1><p>Complete, type-checked patterns showing how Edition 1 code fits together.</p></div></section>
  <div className="shell content-shell example-list">{examples.map((example, index) => <article className="example-row" key={example.title}><div className="example-copy"><span>{String(index + 1).padStart(2,"0")} · {example.tag}</span><h2>{example.title}</h2><p>{example.copy}</p></div><div className="example-code"><div><i /><i /><i /><span>example.niv</span></div><pre><code>{example.code}</code></pre></div></article>)}</div></>;
}
