import type { Metadata } from "next";
import "./globals.css";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "SimplyExpat | Berlin Registration PDF in 2 Minutes",
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
    "expert relocation Berlin paperwork",
    "Berlin address registration help",
    "Anmeldung ausfüllen English",
    "Berlin Bürgeramt appointment form",
    "register Berlin address expat",
    "Meldeformular Berlin English",
    "relocation service Berlin",
    "Berlin relocation help",
    "expat relocation service Berlin",
  ].join(", "),
  metadataBase: new URL(DOMAIN),
  alternates: { canonical: DOMAIN },
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
    title: "SimplyExpat | Berlin Registration PDF in 2 Minutes",
    description:
      "Stop struggling with German bureaucracy. Convert your details into a perfect Anmeldung form for the Bürgeramt — all 54 fields filled in German. Fast, secure, and 0 storage.",
    url: DOMAIN,
    siteName: "SimplyExpat Berlin",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SimplyExpat Berlin — Anmeldung PDF in English" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anmeldung Berlin in English | SimplyExpat",
    description: "Official Berlin registration PDF, filled in English. No data stored. Expert expat relocation help.",
    images: ["/og-image.png"],
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
        "name": "SimplyExpat Berlin",
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
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I fill in the Anmeldung form in English?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SimplyExpat lets you fill in your Berlin Anmeldung form in English. You answer questions in plain English and we generate the official German PDF automatically — all 54 fields correctly filled.",
            },
          },
          {
            "@type": "Question",
            "name": "Is my data stored when I use SimplyExpat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. All form data is stored exclusively in your browser's localStorage. It never reaches our servers. Once your PDF is generated, the data is deleted from your device.",
            },
          },
          {
            "@type": "Question",
            "name": "What documents do I need for the Berlin Bürgeramt Anmeldung?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You need a valid passport or national ID (EU citizens), your rental contract or landlord confirmation (Wohnungsgeberbestätigung), and your completed Anmeldung form. SimplyExpat generates a personalised checklist based on your exact situation.",
            },
          },
          {
            "@type": "Question",
            "name": "How long does the Berlin Anmeldung take with SimplyExpat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Filling in the form takes about 3 minutes. SimplyExpat generates your official PDF and personalised checklist instantly.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="de-DE">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
