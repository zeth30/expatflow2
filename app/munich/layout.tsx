import type { Metadata } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung München in English — Expat Form Filler, No German Required",
  description:
    "Fill Munich's official Anmeldung (residence registration) form in English. Auto-fills all fields in German. Ready to print and submit at the Bürgerbüro. For expats and foreigners in München.",
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: "/munich",
    languages: { en: `${DOMAIN}/munich`, "x-default": `${DOMAIN}/munich` },
  },
  openGraph: {
    title: "Anmeldung München in English — Expat Form Filler",
    description:
      "Munich residence registration for expats. Fill in English, get a perfect German PDF in 5 minutes. No German required.",
    url: `${DOMAIN}/munich`,
    siteName: "ReadyExpat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anmeldung München in English",
    description: "Munich Anmeldung for expats and foreigners. No German required.",
  },
  robots: { index: false, follow: false },
};

export default function MunichLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
