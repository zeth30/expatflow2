import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpatFlow Berlin — Anmeldung in 3 Minutes",
  description:
    "Register in Berlin in 3 minutes. We fill your official Anmeldung form — all 54 fields, perfectly in German. For every nationality. €15 one-time.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "ExpatFlow Berlin — Anmeldung in 3 Minutes",
    description:
      "Fill your Berlin Anmeldung form in plain English. 54 fields, perfect German, every nationality. €15.",
    url: process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000",
    siteName: "ExpatFlow Berlin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExpatFlow Berlin — Anmeldung Preparation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExpatFlow Berlin — Anmeldung in 3 Minutes",
    description: "Fill your Berlin registration form in English. €15.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
