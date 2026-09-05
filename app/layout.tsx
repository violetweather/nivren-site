import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { publicRelease } from "./release";
import "./globals.css";

const officialOrigin = "https://nivren.nnx.fyi";
const image = `${officialOrigin}/og-edition4.png`;

export const metadata: Metadata = {
  metadataBase: new URL(officialOrigin),
  title: { default: "Nivren — Code that reads like intent", template: "%s · Nivren" },
  description: `Nivren ${publicRelease.version} stable, Edition ${publicRelease.edition}: an intent-first programming language with clear types, explicit permissions, and one toolchain from first program to standalone application.`,
  keywords: ["Nivren", "programming language", "compiler", "bytecode", "JIT", "AOT", "WebAssembly", "package registry"],
  openGraph: { title: "Nivren — Code that reads like intent", description: `Nivren ${publicRelease.version} stable — the Edition ${publicRelease.edition} runtime edition of the intent-first application language.`, type: "website", images: [{ url: image, width: 2400, height: 1260, alt: "Nivren — Code that reads like intent." }] },
  twitter: { card: "summary_large_image", images: [image] },
  icons: { icon: "/favicon.svg" },
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
