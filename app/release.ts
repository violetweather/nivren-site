import release from "@/release.json";

export const publicRelease = release.public;
export const candidateRelease = release.candidate;
export const releaseRepository = release.repository;

export function releaseAssetUrl(asset: string) {
  if (!publicRelease.assets.includes(asset)) {
    throw new Error(`unknown public release asset: ${asset}`);
  }
  return `https://github.com/${releaseRepository}/releases/download/v${publicRelease.version}/${asset}`;
}

export function releaseLabel(version: string) {
  const match = version.match(/-beta\.(\d+)$/);
  return match ? `Beta ${match[1]}` : "Stable";
}
