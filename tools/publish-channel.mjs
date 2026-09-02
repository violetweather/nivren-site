// Builds and signs a release channel manifest from a published GitHub
// release, writing public/channel-<channel>.json for the installers.
//
//   NIVREN_BIN=/path/to/niv NIVREN_CHANNEL_SECRET=~/.nivren-keys/channel.secret \
//     node tools/publish-channel.mjs --channel stable --version 1.0.1 --generation 1
//
// The manifest's asset digests come from the release's SHA256SUMS, so the
// signed document commits to the exact bytes GitHub serves. Generations
// must strictly increase per channel; the installers persist the highest
// one they have accepted and refuse older manifests.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const release = JSON.parse(readFileSync(resolve("release.json"), "utf8"));
const options = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[index + 1]]);
    return pairs;
  }, []),
);
const channel = options.channel ?? "stable";
const version = options.version ?? release.public.version;
const generation = Number(options.generation);
const validityDays = Number(options["validity-days"] ?? 90);
if (!["stable", "beta", "nightly"].includes(channel)) throw new Error("channel must be stable, beta, or nightly");
if (!/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/.test(version)) throw new Error(`unsafe version ${version}`);
if (!Number.isInteger(generation) || generation < 1) throw new Error("--generation must be a positive integer");
const binary = process.env.NIVREN_BIN ?? "niv";
const secret = process.env.NIVREN_CHANNEL_SECRET;
if (!secret || !existsSync(secret)) throw new Error("NIVREN_CHANNEL_SECRET must name the offline channel secret key file");

const base = `https://github.com/${release.repository}/releases/download/v${version}`;
const checksums = await (await fetch(`${base}/SHA256SUMS`)).text();
const assets = {};
for (const line of checksums.split("\n")) {
  const match = /^([0-9a-f]{64})  (nivren-[A-Za-z0-9._-]+)$/.exec(line.trim());
  if (match) assets[match[2]] = match[1];
}
if (Object.keys(assets).length === 0) throw new Error("SHA256SUMS listed no assets");

const existing = resolve(`public/channel-${channel}.json`);
if (existsSync(existing)) {
  const previous = JSON.parse(readFileSync(existing, "utf8"));
  if (previous.generation >= generation) throw new Error(`generation must exceed the published ${previous.generation}`);
}

const now = Math.floor(Date.now() / 1000);
const manifest = {
  format: 1,
  channel,
  version,
  generation,
  issued_at: now,
  expires_at: now + validityDays * 86400,
  base_url: base,
  assets,
  signature: "",
};
const scratch = mkdtempSync(join(tmpdir(), "nivren-channel-"));
const unsigned = join(scratch, "unsigned.json");
writeFileSync(unsigned, JSON.stringify(manifest, null, 2) + "\n");
execFileSync(binary, ["release", "sign-channel", unsigned, secret, existing], { stdio: "inherit" });
const publicKey = readFileSync(resolve("public/nivren-channel.pub"), "utf8").trim();
execFileSync(binary, ["release", "verify-channel", existing, resolve("public/nivren-channel.pub"), String(now), String(generation), channel], { stdio: "inherit" });
console.log(`signed channel-${channel}.json for ${version} at generation ${generation} (key ${publicKey.slice(0, 8)}…)`);
