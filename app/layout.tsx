import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Berlin in English — Fill Your Form | ReadyExpat",
  description:
    "Stop struggling with German bureaucracy. Convert your details into a perfect Anmeldung form for the Bürgeramt — all 54 fields filled in German. Fast, secure, and 0 storage.",
  keywords: [
    "Anmeldung Berlin English",
    "Anmeldung Berlin PDF",
    "Anmeldung Berlin English PDF",
    "Bürgeramt Berlin form help",
    "Bürgeramt form no data storage",
    "Berlin registration form English",
    "Berlin Anmeldung form fill in English",
    "expat Berlin registration",
    "expat relocation Berlin paperwork",
    "Berlin address registration help",
    "Anmeldung ausfüllen English",
    "Berlin Bürgeramt appointment form",
    "register Berlin address expat",
    "Meldeformular Berlin English",
    "relocation service Berlin",
    "Berlin relocation help",
    "expat relocation service Berlin",
    "ReadyExpat",
    "Ready Expat",
    "Ready Expat Berlin",
    "ready expat germany",
    "expat ready germany",
    "expat ready berlin",
    "ready paperwork expat germany",
    "ready paperwork berlin",
    "anmeldung ready expat",
    "berlin paperwork expat english",
    "germany registration expat ready",
  ].join(", "),
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: DOMAIN,
    languages: {
      "en": DOMAIN,
      "x-default": DOMAIN,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Anmeldung Berlin in English — Fill Your Form | ReadyExpat",
    description:
      "Stop struggling with German bureaucracy. Convert your details into a perfect Anmeldung form for the Bürgeramt — all 54 fields filled in German. Fast, secure, and 0 storage.",
    url: DOMAIN,
    siteName: "ReadyExpat Berlin",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "ReadyExpat Berlin — Anmeldung PDF in English" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anmeldung Berlin in English | ReadyExpat",
    description: "Official Berlin registration PDF, filled in English. No data stored. Expert expat relocation help.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "ReadyExpat Berlin",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Generate your official Berlin Anmeldung PDF in English. All 54 fields filled in perfect German. No data stored. Expert relocation paperwork for expats.",
        "offers": {
          "@type": "Offer",
          "price": "15",
          "priceCurrency": "EUR",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
        },
        "url": DOMAIN,
        "inLanguage": "en",
        "featureList": [
          "Official Anmeldung PDF generation",
          "All 54 form fields filled in German",
          "Personalised document checklist",
          "Zero data storage — client-side only",
          "Every nationality supported",
        ],
      },
      {
        "@type": "Organization",
        "name": "ReadyExpat Berlin",
        "alternateName": ["ReadyExpat", "Ready Expat", "Ready Expat Berlin", "ready expat germany"],
        "url": DOMAIN,
        "logo": `${DOMAIN}/favicon.svg`,
        "description": "ReadyExpat helps international expats complete Berlin's mandatory Anmeldung address registration form in English.",
        "areaServed": {
          "@type": "City",
          "name": "Berlin",
          "sameAs": "https://www.wikidata.org/wiki/Q64",
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "info@readyexpat.de",
          "contactType": "customer support",
          "availableLanguage": ["English", "German"],
        },
        "knowsAbout": [
          "Anmeldung",
          "Berlin address registration",
          "Bundesmeldegesetz",
          "Bürgeramt",
          "Wohnungsgeberbestätigung",
          "Expat relocation Germany",
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
