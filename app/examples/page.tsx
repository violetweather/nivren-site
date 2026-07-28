import type { Metadata } from "next";
import { SyntaxCode } from "../components/SyntaxCode";

export const metadata: Metadata = { title: "Examples", description: "See distinctive Edition 4 programs for typed failure, capabilities, structured concurrency, native hosts, and web services." };

const examples = [
  { tag: "Systems", title: "Share one checked atomic", copy: "AtomicInt crosses structured-task boundaries while overflow remains a typed result.", code: `define count
gives Int or String
needs Task
{
    keep counter set std.atomics.create with { value set 0 }
    define increment
    gives Null or String
    {
        keep previous set std.atomics.add with { atomic set counter amount set 1 } or give
        give ok(none)
    }
    keep completed set together [start increment, start increment] or give
    give ok(std.atomics.load with { atomic set counter })
}` },
  { tag: "Portable", title: "Run unchanged in a WASI host", copy: "Generics and exhaustive choices stay portable while unavailable host facilities fail explicitly.", code: `choice Maybe<Value> holds {
    case Some carries Value
    case None
}

define double
takes {
    value is Int
}
gives Int
{
    give value * 2
}

keep value set Maybe.Some(double with { value set 21 })
choose value {
    case Some carries found => found
    case None => 0
}` },
  { tag: "Language", title: "Model a small domain", copy: "Shapes, choices, and labeled construction make valid states visible.", code: `shape User holds {
    name is String
    active is Bool
} with Json, Display, Validate

choice Access holds {
    case Guest
    case Member
    case Admin
}

define greeting
takes {
    user is User
    access is Access
}
gives String
{
    give choose access {
        case Guest => "Welcome, guest"
        case Member => "Hello, " + user.name
        case Admin => "Admin: " + user.name
    }
}

keep mira set User with { name set "Mira" active set yes }
show(greeting with { user set mira access set Access.Member })` },
  { tag: "Reliability", title: "Own authority and failure", copy: "Needs, perform, using, and or give keep authority, effects, and cleanup visible.", code: `define load_configuration
takes {
    path is String
}
gives String or String
needs FileRead
{
    keep opened set perform std.files.open_read with { path set path } or give
    using file = opened {
        give perform std.files.read_open with { file set file maximum set 1048576 }
    }
}

choose perform load_configuration with { path set "app.json" } {
    case Ok carries text => text
    case Err carries problem => "configuration: " + problem
}` },
  { tag: "Async files", title: "Queue bounded disk work", copy: "Disk work becomes a structured task and executor saturation remains typed.", code: `define load
takes {
    path is String
}
gives String or String
needs FileRead, Task
{
    keep queued set perform std.files.read_async with { path set path maximum set 1048576 } or give
    give wait queued
}` },
  { tag: "Concurrency", title: "Bound the work", copy: "Intent words make ownership, joining, and backpressure explicit.", code: `define run
gives Int or String
needs Channel, Task
{
    keep results set perform std.channels.create with { capacity set 8 }
    define calculate
    gives Int or String
    needs Channel
    {
        keep sent set perform std.channels.send with { channel set results value set 42 timeout set 2.0 } or give
        give ok(1)
    }
    keep worker set start calculate
    keep answer set perform std.channels.receive with { channel set results timeout set 2.0 } or give
    keep finished set wait worker or give
    give ok(answer)
}` },
  { tag: "Realtime", title: "Speak WebSocket safely", copy: "The upgrade, message ceiling, typed failure, and socket lifetime stay visible.", code: `define echo
takes {
    connection is TcpStream
}
gives Null or String
needs Network
{
    keep request set perform std.web.read_request with { stream set connection maximum set 65536 } or give
    keep upgraded set perform std.web.websocket_accept with { stream set connection request set request } or give
    using socket = upgraded {
        keep message set perform std.web.websocket_receive with { websocket set socket maximum set 1048576 } or give
        keep sent set perform std.web.websocket_send with { websocket set socket message set "Nivren heard: " + message } or give
        give ok(none)
    }
}` },
  { tag: "Shared state", title: "Release every lock", copy: "Bounded acquisition and using make guard lifetime explicit.", code: `define run
gives Int or String
needs Task
{
    keep counter set std.locks.create with { value set 0 }
    define increment
    gives Null or String
    needs Task
    {
        keep acquired set perform std.locks.acquire with { lock set counter timeout set 2.0 } or give
        using guard = acquired {
            keep current set perform std.locks.read with { guard set guard } or give
            keep written set perform std.locks.write with { guard set guard value set current + 1 } or give
            give ok(none)
        }
    }
    keep finished set together [start increment, start increment] or give
    give ok(2)
}` },
  { tag: "Resources", title: "Rollback unless committed", copy: "A transaction closes safely on every path; only commit publishes staged state.", code: `define update
gives Map<String, Int> or String
{
    keep original set std.map.single with { key set "count" value set 1 }
    keep transaction set std.transactions.begin with { map set original }
    using changes = transaction {
        keep written set std.transactions.set with { transaction set changes key set "count" value set 2 } or give
        give std.transactions.commit with { transaction set changes }
    }
}` },
  { tag: "Native", title: "Own the C boundary", copy: "Native authority, the ABI shape, and the library lifetime all stay visible.", code: `define add
takes {
    path is String
}
gives Int or String
needs Native
{
    keep opened set perform std.native.open with { path set path } or give
    using library = opened {
        give perform std.native.call_int with { library set library symbol set "nivren_add" arguments set [20, 22] }
    }
}` },
  { tag: "Time", title: "Name the timezone", copy: "DateTime preserves the instant and IANA zone instead of passing ambiguous timestamps.", code: `define meeting
takes {
    seconds is Int
    zone is String
}
gives String or String
{
    keep instant set std.time.from_unix with { seconds set seconds zone set "UTC" } or give
    keep local set std.time.in_zone with { value set instant zone set zone } or give
    give ok(std.time.format with { value set local })
}` },
  { tag: "Data", title: "Stream through a shape", copy: "A derived shape drives decoding while each record stays under an explicit memory ceiling.", code: `shape Event holds {
    id is Int
    kind is String
} with Json, Validate

define first
takes {
    path is String
}
gives maybe Event or String
needs FileRead
{
    keep opened set perform std.files.open_read with { path set path } or give
    using file = opened {
        give perform std.json.read_next_as with { schema set Event file set file maximum set 65536 }
    }
}` },
];

export default function ExamplesPage() {
  return <><section className="page-hero compact"><div className="shell"><span className="kicker">Learn by reading</span><h1>Examples</h1><p>Complete, type-checked patterns showing what makes Edition 4 unmistakably Nivren.</p></div></section>
  <div className="shell content-shell example-list">{examples.map((example, index) => <article className="example-row" key={example.title}><div className="example-copy"><span>{String(index + 1).padStart(2,"0")} · {example.tag}</span><h2>{example.title}</h2><p>{example.copy}</p></div><div className="example-code"><div><i /><i /><i /><span>example.niv</span></div><pre><SyntaxCode code={example.code} /></pre></div></article>)}</div></>;
}
