import type { Metadata } from "next";

export const metadata: Metadata = { title: "Examples", description: "See distinctive Edition 3 programs for typed failure, capabilities, structured concurrency, native hosts, and web services." };

const examples = [
  { tag: "Systems", title: "Share one checked atomic", copy: "AtomicInt is transferable between structured tasks while overflow and compare-exchange outcomes remain typed.", code: `define count() gives Result<Int, String> needs Task {
    keep counter = std.atomics.create(0)
    define increment() gives Result<Null, String> {
        keep previous = std.atomics.add(counter, 1) or give
        give ok(none)
    }
    keep completed = together [start increment, start increment] or give
    give ok(std.atomics.load(counter))
}` },
  { tag: "Portable", title: "Run unchanged in a WASI host", copy: "The portable VM keeps Edition 3 generics and exhaustive choices while unavailable native facilities fail explicitly.", code: `choice Maybe<Value> { Some(Value), None }

define double(value: Int) gives Int {
    give value * 2
}

keep values = [Maybe.Some(double(21)), Maybe.None]
choose values[0] {
    Some(value) => value,
    None => 0
}` },
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
  { tag: "Reliability", title: "Own authority and failure", copy: "Checked needs, scoped files, using, and or give keep authority and cleanup visible.", code: `define loadConfig(path: String) gives Result<String, String> needs FileRead {
    keep opened = std.files.open_read(path)
    using file = opened or give {
        give std.files.read_open(file, 1048576)
    }
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
  { tag: "Async files", title: "Queue bounded disk work", copy: "File work becomes a structured task while executor saturation remains a typed result.", code: `define load(path: String) gives Result<String, String> needs FileRead, Task {
    keep queued = std.files.read_async(path, 1048576) or give
    give wait queued
}` },
  { tag: "Concurrency", title: "Bound the work", copy: "Intent words make ownership, joining, racing, and backpressure explicit.", code: `keep results = std.channels.create(8)

define calculate() gives Int needs Channel {
    keep sent = std.channels.send(results, 6 * 7, 2.0)
    give choose sent {
        Ok(value) => 1,
        Err(problem) => 0
    }
}

keep worker = start calculate
keep answer = std.channels.receive(results, 2.0)
keep finished = wait worker

show(choose answer {
    Ok(value) => value,
    Err(problem) => 0
})` },
  { tag: "Realtime", title: "Speak WebSocket safely", copy: "The upgrade, typed failure, message limit, and resource lifetime stay visible.", code: `define echo(listener: TcpListener) gives Result<Null, String> needs Network {
    using server = listener {
        keep accepted = std.net.accept(server, 30.0)
        using connection = accepted or give {
            keep request = std.web.read_request(connection, 65536) or give
            keep upgraded = std.web.websocket_accept(connection, request)
            using socket = upgraded or give {
                keep message = std.web.websocket_receive(socket, 1048576) or give
                keep sent = std.web.websocket_send(socket, "Nivren heard: " + message) or give
                give ok(none)
            }
        }
    }
}` },
  { tag: "TLS", title: "Verify every secure socket", copy: "WSS clients verify hostnames; optional mTLS identities and required-client-certificate servers keep trust explicit.", code: `define connect(host: String) gives Result<WebSocket, String> needs Network {
    keep policy = std.web.tls_options()
    give std.web.websocket_secure_connect(host, 443, "/events", 10.0, policy)
}

define listen(cert: String, key: String) gives Result<TlsListener, String> needs Network {
    keep policy = std.web.tls_options()
    give std.web.websocket_secure_listen("127.0.0.1", 8443, cert, key, policy)
}

define mutual_policy(client_ca: String) gives Map<String, String> {
    keep auth = std.map.set(std.web.tls_options(), "client_auth", "required")
    give std.map.set(auth, "client_ca_pem", client_ca)
}` },
  { tag: "Shared state", title: "Release every lock", copy: "Bounded acquisition and using make contention and guard lifetime explicit.", code: `define increment(counter: Lock) gives Result<Null, String> needs Task {
    keep acquired = std.locks.acquire(counter, 2.0) or give
    using guard = acquired {
        keep current = std.locks.read(guard) or give
        keep written = std.locks.write(guard, current + 1) or give
        give ok(none)
    }
}

keep counter = std.locks.create(0)
keep workers = together [start increment(counter), start increment(counter)]` },
  { tag: "Resources", title: "Rollback unless committed", copy: "A transaction closes safely on every path; only an explicit commit publishes staged state.", code: `define update() gives Result<Map<String, Int>, String> {
    keep original = std.map.single("count", 1)
    keep transaction = std.transactions.begin(original)
    using changes = transaction {
        keep written = std.transactions.set(changes, "count", 2) or give
        give std.transactions.commit(changes)
    }
}` },
  { tag: "Native", title: "Own the C boundary", copy: "Native authority, the ABI shape, and the library lifetime all stay visible.", code: `define add(path: String) gives Result<Int, String> needs Native {
    keep opened = std.native.open(path) or give
    using library = opened {
        give std.native.call_int(library, "nivren_add", [20, 22])
    }
}` },
  { tag: "Time", title: "Name the timezone", copy: "DateTime preserves the instant and IANA zone instead of passing ambiguous timestamps around.", code: `define meeting(seconds: Int, zone: String) gives Result<String, String> {
    keep instant = std.time.from_unix(seconds, "UTC") or give
    keep local = std.time.in_zone(instant, zone) or give
    give ok(std.time.format(local))
}

choose meeting(0, "America/New_York") {
    Ok(value) => value,
    Err(problem) => problem
}` },
  { tag: "Numbers", title: "Keep exact values exact", copy: "Decimal handles base-10 amounts while BigInt handles values larger than a machine word.", code: `define total() gives Result<String, String> {
    keep subtotal = std.decimal.parse("19.99") or give
    keep tax = std.decimal.parse("1.60") or give
    give ok(std.decimal.format(subtotal + tax))
}

define huge() gives Result<BigInt, String> {
    keep value = std.bigint.parse("1000000000000000000000000") or give
    give ok(value * std.bigint.from_int(2))
}` },
  { tag: "Protocols", title: "Make width explicit", copy: "Signedness and width remain part of the type, with checked construction and overflow.", code: `define packet() gives Result<String, String> {
    keep version: U8 = std.u8.from_int(3) or give
    keep port: U16 = std.u16.from_int(8080) or give
    keep sequence: U64 = std.u64.parse("18446744073709551615") or give
    give ok(
        std.u8.format(version)
        + ":" + std.u16.format(port)
        + ":" + std.u64.format(sequence)
    )
}` },
  { tag: "Data", title: "Stream through a shape", copy: "A shape becomes the decoder while each newline-delimited record stays under an explicit memory ceiling.", code: `shape Event { id: Int, kind: String }

define first(path: String) gives Result<Event?, String> needs FileRead {
    keep opened = std.files.open_read(path) or give
    using file = opened {
        give std.json.read_next_as(Event, file, 65536)
    }
}

keep event = first("events.ndjson")` },
];

export default function ExamplesPage() {
  return <><section className="page-hero compact"><div className="shell"><span className="kicker">Learn by reading</span><h1>Examples</h1><p>Complete, type-checked patterns showing what makes Edition 3 unmistakably Nivren.</p></div></section>
  <div className="shell content-shell example-list">{examples.map((example, index) => <article className="example-row" key={example.title}><div className="example-copy"><span>{String(index + 1).padStart(2,"0")} · {example.tag}</span><h2>{example.title}</h2><p>{example.copy}</p></div><div className="example-code"><div><i /><i /><i /><span>example.niv</span></div><pre><code>{example.code}</code></pre></div></article>)}</div></>;
}
