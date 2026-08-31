import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { connect } from "node:net";
import { request as httpRequest } from "node:http";
import { arch, cpus, platform, release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const casesRoot = join(root, "cases");
const nivren = process.env.NIVREN_BIN ?? "niv";
const node = process.env.NODE_BIN ?? process.execPath;
const measuredRuns = Number.parseInt(process.env.BENCH_RUNS ?? "9", 10);
const warmupRuns = Number.parseInt(process.env.BENCH_WARMUPS ?? "3", 10);

if (!Number.isInteger(measuredRuns) || measuredRuns < 3 || !Number.isInteger(warmupRuns) || warmupRuns < 0) {
  throw new Error("BENCH_RUNS must be at least 3 and BENCH_WARMUPS must be non-negative integers");
}

// The typed JSON transform input is deterministic and generated on demand,
// so the repository does not carry a megabyte fixture.
const eventsPath = join(casesRoot, "json_transform", "data", "events.json");
if (!existsSync(eventsPath)) {
  const events = [];
  for (let index = 0; index < 20000; index += 1) {
    events.push({
      id: index,
      kind: index % 3 === 0 ? "deploy" : "build",
      active: index % 2 === 0,
      score: (index * 17) % 1000,
    });
  }
  mkdirSync(dirname(eventsPath), { recursive: true });
  writeFileSync(eventsPath, JSON.stringify({ title: "Nivren benchmark events", events }, null, 1));
}

const definitions = [
  { id: "startup", category: "strength", label: "Source-to-result startup", description: "Parse, check, compile, execute, and print one integer.", runs: Math.max(measuredRuns, 21), warmups: 2 },
  { id: "cli_check", category: "strength", label: "One-shot source check", description: "Nivren performs semantic and capability checks; Node.js performs its built-in syntax check.", compareOutput: false, runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "typed_json_file", category: "strength", label: "Typed JSON file pipeline", description: "Read a file, validate its complete schema, and emit canonical JSON.", runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "text_file", category: "strength", label: "Text file pipeline", description: "Read a UTF-8 log, split bounded lines, and emit a JSON array.", runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "arithmetic", category: "limit", label: "Tiered integer loop", description: "Two million calls to a small checked-integer kernel.", runs: measuredRuns, warmups: warmupRuns },
  { id: "fibonacci", category: "limit", label: "Recursive calls", description: "Naive recursive Fibonacci(30).", runs: measuredRuns, warmups: warmupRuns },
  { id: "nested_loops", category: "limit", label: "Nested loop arithmetic", description: "A 2000 × 2000 checked-integer checksum.", runs: measuredRuns, warmups: warmupRuns },
  { id: "shape_churn", category: "limit", label: "Shape-heavy loop", description: "Three hundred thousand typed shape constructions with field reads.", runs: measuredRuns, warmups: warmupRuns },
  { id: "json_transform", category: "limit", label: "Large typed JSON transform", description: "Decode a twenty-thousand-event JSON document through a declared schema and aggregate it.", runs: measuredRuns, warmups: warmupRuns },
  { id: "alloc_churn", category: "limit", label: "Allocation churn", description: "Short-lived arrays and strings built and dropped in a hot loop.", runs: measuredRuns, warmups: warmupRuns },
  { id: "tasks_channels", category: "concurrency", label: "Tasks and channels", description: "A bounded producer/consumer pair moving twenty thousand values; Nivren uses structured tasks and channels, Node an async queue.", runs: measuredRuns, warmups: warmupRuns },
];

const serviceDefinition = {
  id: "http_service",
  category: "service",
  label: "Warmed HTTP service",
  description: "One long-lived server process measured hot: per-request latency over one thousand sequential HTTP requests after two hundred warmup requests, same Node client for both runtimes.",
  requests: 1000,
  serviceWarmups: 200,
};

function commandFor(runtime, id) {
  if (id === "cli_check") {
    return runtime === "nivren"
      ? { command: nivren, args: ["check", join(casesRoot, "arithmetic.niv")] }
      : { command: node, args: ["--check", join(casesRoot, "arithmetic.mjs")] };
  }
  if (id === "typed_json_file" || id === "text_file" || id === "json_transform" || id === "http_service") {
    return runtime === "nivren"
      ? { command: nivren, args: ["run", "."], cwd: join(casesRoot, id) }
      : { command: node, args: [join(casesRoot, `${id}.mjs`)] };
  }
  return runtime === "nivren"
    ? { command: nivren, args: ["run", join(casesRoot, `${id}.niv`)] }
    : { command: node, args: [join(casesRoot, `${id}.mjs`)] };
}

function execute(spec) {
  const started = process.hrtime.bigint();
  const result = spawnSync(spec.command, spec.args, { cwd: spec.cwd, encoding: "utf8", timeout: 120_000 });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${spec.command} failed:\n${result.stderr}`);
  return { elapsedMs, output: result.stdout.trim() };
}

function percentile(values, quantile) {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.ceil(quantile * ordered.length) - 1)];
}

function summarize(values) {
  return {
    median_ms: Number(percentile(values, 0.5).toFixed(3)),
    p95_ms: Number(percentile(values, 0.95).toFixed(3)),
    min_ms: Number(Math.min(...values).toFixed(3)),
    max_ms: Number(Math.max(...values).toFixed(3)),
  };
}

function residentMemoryKb(spec) {
  if (platform() === "win32") {
    const command = [spec.command, ...spec.args]
      .map(part => `'` + String(part).replaceAll(`'`, `''`) + `'`)
      .join(",");
    const script = `$p = Start-Process -FilePath ${command.split(",")[0]} -ArgumentList @(${command.split(",").slice(1).join(",") || "' '"}) -WorkingDirectory '${(spec.cwd ?? process.cwd()).replaceAll(`'`, `''`)}' -NoNewWindow -PassThru; $p.WaitForExit(); [Math]::Round($p.PeakWorkingSet64 / 1KB)`;
    const timed = spawnSync("powershell", ["-NoProfile", "-Command", script], { encoding: "utf8", timeout: 240_000 });
    const value = Number.parseInt(String(timed.stdout).trim(), 10);
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  if (platform() !== "darwin") return null;
  const timed = spawnSync("/usr/bin/time", ["-l", spec.command, ...spec.args], { cwd: spec.cwd, encoding: "utf8", timeout: 120_000 });
  const match = timed.stderr.match(/(\d+)\s+maximum resident set size/);
  return match ? Math.round(Number(match[1]) / 1024) : null;
}

const nivrenVersion = execFileSync(nivren, ["version"], { encoding: "utf8" }).trim();
const nodeVersion = execFileSync(node, ["--version"], { encoding: "utf8" }).trim();
const results = [];

for (const definition of definitions) {
  const commands = {
    nivren: commandFor("nivren", definition.id),
    node: commandFor("node", definition.id),
  };

  for (let index = 0; index < definition.warmups; index += 1) {
    execute(commands.nivren);
    execute(commands.node);
  }

  const samples = { nivren: [], node: [] };
  let expectedOutput;
  for (let index = 0; index < definition.runs; index += 1) {
    const order = index % 2 === 0 ? ["nivren", "node"] : ["node", "nivren"];
    for (const runtime of order) {
      const sample = execute(commands[runtime]);
      const comparableOutput = definition.compareOutput === false ? "successful check" : sample.output;
      expectedOutput ??= comparableOutput;
      if (comparableOutput !== expectedOutput) {
        throw new Error(`${definition.id} output mismatch: expected ${expectedOutput}, received ${sample.output}`);
      }
      samples[runtime].push(sample.elapsedMs);
    }
  }

  const nivrenSummary = summarize(samples.nivren);
  const nodeSummary = summarize(samples.node);
  results.push({
    ...definition,
    output: expectedOutput,
    nivren: { ...nivrenSummary, peak_rss_kb: residentMemoryKb(commands.nivren) },
    node: { ...nodeSummary, peak_rss_kb: residentMemoryKb(commands.node) },
    node_speedup: Number((nivrenSummary.median_ms / nodeSummary.median_ms).toFixed(2)),
  });
}

function waitForPort(port, deadlineMs) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const attempt = () => {
      const socket = connect({ port, host: "127.0.0.1" }, () => {
        socket.destroy();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - started > deadlineMs) {
          reject(new Error(`service did not open port ${port}`));
        } else {
          setTimeout(attempt, 100);
        }
      });
    };
    attempt();
  });
}

function measureRequest(port) {
  return new Promise((resolve, reject) => {
    const started = process.hrtime.bigint();
    const request = httpRequest(
      { host: "127.0.0.1", port, path: "/", method: "GET", agent: false },
      response => {
        let body = "";
        response.on("data", chunk => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({ elapsedMs: Number(process.hrtime.bigint() - started) / 1_000_000, body });
        });
      },
    );
    request.on("error", reject);
    request.end();
  });
}

async function benchmarkService(definition) {
  const ports = { nivren: 46898, node: 46899 };
  const row = {};
  for (const runtime of ["nivren", "node"]) {
    const spec = commandFor(runtime, definition.id);
    const server = spawn(spec.command, spec.args, { cwd: spec.cwd, stdio: "ignore" });
    try {
      await waitForPort(ports[runtime], 30_000);
      for (let index = 0; index < definition.serviceWarmups; index += 1) {
        await measureRequest(ports[runtime]);
      }
      const latencies = [];
      let body;
      for (let index = 0; index < definition.requests; index += 1) {
        const sample = await measureRequest(ports[runtime]);
        body = sample.body;
        latencies.push(sample.elapsedMs);
      }
      if (body !== "ok") throw new Error(`${definition.id} ${runtime} body mismatch: ${body}`);
      row[runtime] = { ...summarize(latencies), peak_rss_kb: null };
    } finally {
      server.kill("SIGKILL");
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  results.push({
    id: definition.id,
    category: definition.category,
    label: definition.label,
    description: definition.description,
    runs: definition.requests,
    warmups: definition.serviceWarmups,
    output: "ok",
    nivren: row.nivren,
    node: row.node,
    node_speedup: Number((row.nivren.median_ms / row.node.median_ms).toFixed(2)),
  });
}

await benchmarkService(serviceDefinition);

const report = {
  schema: "org.nivren.benchmark.v1",
  generated_at: new Date().toISOString(),
  methodology: {
    measured_processes: "fresh process per sample",
    ordering: "alternating Nivren-first and Node-first",
    statistic: "median with p95, minimum, and maximum",
    scope: "wall-clock source-to-result latency; not a complete language ranking",
    semantics: "paired programs produce identical output; source checking reflects each runtime's built-in checker, while Nivren's typed JSON case additionally enforces a declared schema and file capability",
  },
  environment: {
    os: `${platform()} ${release()}`,
    architecture: arch(),
    cpu: cpus()[0]?.model ?? "unknown",
    logical_cpus: cpus().length,
    nivren: nivrenVersion,
    node: nodeVersion,
  },
  results,
};

const outputPath = process.env.BENCH_OUTPUT ?? join(root, "results", "latest.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.table(results.map((result) => ({
  benchmark: result.label,
  "Nivren median (ms)": result.nivren.median_ms,
  "Node median (ms)": result.node.median_ms,
  "Node speedup": `${result.node_speedup}×`,
})));
console.log(`Wrote ${outputPath}`);
