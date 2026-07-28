import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const release = JSON.parse(await readFile(new URL("../release.json", import.meta.url), "utf8"));
const versionPattern = /^\d+\.\d+\.\d+-beta\.\d+$/;
assert.match(release.public.version, versionPattern);
assert.match(release.candidate.version, versionPattern);
assert.equal(release.public.published, true);
assert.notEqual(release.public.version, release.candidate.version, "an unpublished candidate must not reuse a public tag");
assert.equal(new Set(release.public.assets).size, release.public.assets.length, "release assets must be unique");
assert.ok(release.public.assets.includes("SHA256SUMS"));
for (const asset of release.public.assets) {
  assert.ok(asset === "SHA256SUMS" || asset.includes(release.public.version), `${asset} does not match the public version`);
}

const downloads = await readFile(new URL("../app/downloads/page.tsx", import.meta.url), "utf8");
assert.doesNotMatch(downloads, /0\.10\.0-beta\.\d+/, "downloads must derive versions from release.json");

if (process.argv.includes("--remote")) {
  const response = await fetch(`https://api.github.com/repos/${release.repository}/releases/tags/v${release.public.version}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "nivren-site-release-verifier" },
  });
  assert.equal(response.status, 200, `GitHub release lookup failed: ${response.status}`);
  const remote = await response.json();
  assert.equal(remote.draft, false);
  assert.equal(remote.prerelease, true);
  assert.ok(remote.published_at);
  const remoteAssets = remote.assets.map((asset) => asset.name).sort();
  assert.deepEqual(remoteAssets, [...release.public.assets].sort());
}

console.log(`verified public ${release.public.version}, candidate ${release.candidate.version}${process.argv.includes("--remote") ? ", and GitHub assets" : ""}`);
