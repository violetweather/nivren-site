# Nivren versus Node.js benchmark

This suite compares the published Nivren CLI with Node.js using paired programs that produce the same result. It measures a fresh process for every sample, alternates runtime order to reduce drift, performs warmups, and reports median, p95, minimum, maximum, and peak resident memory on macOS.

The primary group covers Nivren-shaped work: process startup, one-shot checking, a file-to-typed-JSON pipeline, and bounded UTF-8 text splitting. The checker row is intentionally labeled as unlike work: Nivren performs semantic, type, and capability checking, while `node --check` performs syntax checking. The JSON pair both validate the same exact fields and print identical canonical output; Nivren additionally enforces the declared shape and `FileRead` capability. The text pair read the same log and emit the same line array.

The second group preserves three compute-heavy tests as a visible statement of current limits. Nivren uses checked 64-bit integer arithmetic; JavaScript uses optimized IEEE-754 numbers in these cases. Those semantics are similar for the selected values, but not identical. This suite is deliberately small and transparent—not a claim about every application or a substitute for application-specific measurement.

Run it with:

```sh
NIVREN_BIN=/path/to/niv node benchmarks/nivren-vs-node/run.mjs
```

Use `BENCH_RUNS` and `BENCH_WARMUPS` to change the measured and warmup counts. `BENCH_OUTPUT` selects the JSON result path. The committed report records the exact runtime versions and machine used for the public site.
