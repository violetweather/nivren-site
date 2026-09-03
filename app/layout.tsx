import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import "./globals.css";

const officialOrigin = "https://nivren.nnx.fyi";
const image = `${officialOrigin}/og-edition4.png`;

export const metadata: Metadata = {
  metadataBase: new URL(officialOrigin),
  title: { default: "Nivren — Code that reads like intent", template: "%s · Nivren" },
  description: "Nivren 1.0.0 stable, Edition 6: an intent-first application language with visible authority, typed failure, scoped concurrency, compiled native code, a live signed package registry, and first-party tooling.",
  keywords: ["Nivren", "programming language", "compiler", "bytecode", "JIT", "AOT", "WebAssembly", "package registry"],
  openGraph: { title: "Nivren — Code that reads like intent", description: "Nivren 1.0.0 stable — the Edition 6 runtime edition of the intent-first application language.", type: "website", images: [{ url: image, width: 2400, height: 1260, alt: "Nivren — Code that reads like intent." }] },
  twitter: { card: "summary_large_image", images: [image] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
