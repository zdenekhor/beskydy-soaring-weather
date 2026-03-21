import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPL Weather LKFR– Beskydy",
  description: "Gliding weather briefing for Beskydy",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071a34",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
