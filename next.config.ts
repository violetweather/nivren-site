import type { NextConfig } from "next";

// The static export is served at the site root on the custom domain
// (nivren.nnx.fyi). Set NEXT_PUBLIC_BASE_PATH (for example "/nivren-site")
// only when hosting under a sub-path such as a project Pages URL.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
