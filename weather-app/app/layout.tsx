import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import PwaRegister from "../components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Počasí LKFR",
  description: "Predpoved pocasi pro LKFR a hodnoceni podminek pro plachtare SPL.",
  applicationName: "Počasí LKFR",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Počasí LKFR",
    statusBarStyle: "black-translucent",
  },
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
    <html lang="cs" className={GeistSans.className}>
      <body>
        <PwaRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
