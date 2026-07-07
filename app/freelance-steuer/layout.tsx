import type { Metadata } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Fragebogen zur steuerlichen Erfassung in English — Freelancer Tax Registration Help",
  description:
    "Fill Germany's freelancer tax registration (Fragebogen zur steuerlichen Erfassung) via ELSTER with confidence. Every field explained in English. Your answers stay in your browser — nothing stored on our servers. Not tax advice.",
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: "/freelance-steuer",
    languages: { en: `${DOMAIN}/freelance-steuer`, "x-default": `${DOMAIN}/freelance-steuer` },
  },
  openGraph: {
    title: "The German Freelancer Tax Form, in English — ReadyExpat",
    description:
      "Every field of the ELSTER Fragebogen zur steuerlichen Erfassung explained in plain English. Answer in English, get every German entry ready to copy. Not tax advice.",
    url: `${DOMAIN}/freelance-steuer`,
    siteName: "ReadyExpat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "German Freelancer Tax Registration in English",
    description: "The ELSTER Fragebogen zur steuerlichen Erfassung, explained field by field in English.",
  },
};

export default function FreelanceSteuerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
