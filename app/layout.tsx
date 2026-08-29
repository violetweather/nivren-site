import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import "./globals.css";

const officialOrigin = "https://violetweather.github.io/nivren-site";
const image = `${officialOrigin}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(officialOrigin),
  title: { default: "Nivren — Code that reads like intent", template: "%s · Nivren" },
  description: "An intent-first application language with visible authority, typed failure, scoped concurrency, and first-party tooling.",
  keywords: ["Nivren", "programming language", "compiler", "bytecode", "JIT", "WebAssembly"],
  openGraph: { title: "Nivren — Code that reads like intent", description: "A safe, intent-first Edition 4 application language.", type: "website", images: [{ url: image, width: 1200, height: 630, alt: "Nivren — Code that reads like intent." }] },
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
