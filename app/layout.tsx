import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const candidate = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost";
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(candidate) ? candidate : "localhost";
  const forwarded = incoming.get("x-forwarded-proto");
  const protocol = forwarded === "http" || host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const image = new URL("/og.png", origin).toString();
  return {
    metadataBase: new URL(origin),
    title: { default: "Nivren — Code that reads like intent", template: "%s · Nivren" },
    description: "A safe, expressive application programming language with a coherent core, predictable performance, and first-party tooling.",
    keywords: ["Nivren", "programming language", "compiler", "bytecode", "JIT"],
    openGraph: { title: "Nivren — Code that reads like intent", description: "A safe, expressive application language. Edition 1 compatibility beta.", type: "website", images: [{ url: image, width: 1200, height: 630, alt: "Nivren — Code that reads like intent." }] },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

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
