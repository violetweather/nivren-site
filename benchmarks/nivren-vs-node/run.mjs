import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
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

const definitions = [
  { id: "startup", category: "strength", label: "Source-to-result startup", description: "Parse, check, compile, execute, and print one integer.", runs: Math.max(measuredRuns, 21), warmups: 2 },
  { id: "cli_check", category: "strength", label: "One-shot source check", description: "Nivren performs semantic and capability checks; Node.js performs its built-in syntax check.", compareOutput: false, runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "typed_json_file", category: "strength", label: "Typed JSON file pipeline", description: "Read a file, validate its complete schema, and emit canonical JSON.", runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "text_file", category: "strength", label: "Text file pipeline", description: "Read a UTF-8 log, split bounded lines, and emit a JSON array.", runs: Math.max(measuredRuns, 15), warmups: 2 },
  { id: "arithmetic", category: "limit", label: "Tiered integer loop", description: "Two million calls to a small checked-integer kernel.", runs: measuredRuns, warmups: warmupRuns },
  { id: "fibonacci", category: "limit", label: "Recursive calls", description: "Naive recursive Fibonacci(30).", runs: measuredRuns, warmups: warmupRuns },
  { id: "nested_loops", category: "limit", label: "Nested loop arithmetic", description: "A 500 × 500 checked-integer checksum.", runs: measuredRuns, warmups: warmupRuns },
];

function commandFor(runtime, id) {
  if (id === "cli_check") {
    return runtime === "nivren"
      ? { command: nivren, args: ["check", join(casesRoot, "arithmetic.niv")] }
      : { command: node, args: ["--check", join(casesRoot, "arithmetic.mjs")] };
  }
  if (id === "typed_json_file" || id === "text_file") {
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
