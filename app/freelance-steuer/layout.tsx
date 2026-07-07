import type { Metadata } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Fragebogen zur steuerlichen Erfassung in English — ELSTER Tax Registration for Expat Freelancers, No German Required",
  description:
    "Register as a freelancer in Germany without speaking German. The ELSTER Fragebogen zur steuerlichen Erfassung explained field by field in English — copy-ready German answers, free ELSTER account guide, your data stays in your browser.",
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: "/freelance-steuer",
    languages: { en: `${DOMAIN}/freelance-steuer`, "x-default": `${DOMAIN}/freelance-steuer` },
  },
  openGraph: {
    title: "The German Freelancer Tax Form, in English — ReadyExpat",
    description:
      "Every field of the ELSTER Fragebogen zur steuerlichen Erfassung explained in plain English. Answer in English, get every German entry ready to copy. For expats — no German required.",
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
