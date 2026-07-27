# Nivren versus Node.js benchmark

This suite compares the published Nivren CLI with Node.js using paired programs that print the same result. It measures a fresh process for every sample, alternates runtime order to reduce drift, performs warmups, and reports median, p95, minimum, maximum, and peak resident memory on macOS.

It is intentionally a small, transparent microbenchmark—not a claim about every application. Nivren uses checked 64-bit integer arithmetic and visible runtime safety checks; JavaScript uses optimized IEEE-754 numbers in these cases. Those semantics are similar for the selected values, but not identical.

Run it with:

```sh
NIVREN_BIN=/path/to/niv node benchmarks/nivren-vs-node/run.mjs
```

Use `BENCH_RUNS` and `BENCH_WARMUPS` to change the measured and warmup counts. `BENCH_OUTPUT` selects the JSON result path. The committed report records the exact runtime versions and machine used for the public site.
