import type { Metadata } from "next";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import "./globals.css";

const officialOrigin = "https://violetweather.github.io/nivren-site";
const image = `${officialOrigin}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(officialOrigin),
  title: { default: "Nivren — Code that reads like intent", template: "%s · Nivren" },
  description: "A safe, expressive application programming language with a coherent core, predictable performance, and first-party tooling.",
  keywords: ["Nivren", "programming language", "compiler", "bytecode", "JIT"],
  openGraph: { title: "Nivren — Code that reads like intent", description: "A safe, expressive application language. Edition 1 compatibility beta.", type: "website", images: [{ url: image, width: 1200, height: 630, alt: "Nivren — Code that reads like intent." }] },
  twitter: { card: "summary_large_image", images: [image] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
