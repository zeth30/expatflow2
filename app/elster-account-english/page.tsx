import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { GuideByline } from "../components/guides/GuideByline";
import { RelatedGuides } from "../components/guides/RelatedGuides";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "How to Create an ELSTER Account in English 2026 — Expat Guide, No German Required",
  description:
    "Step-by-step ELSTER registration guide for expats and freelancers in Germany. Certificate file, activation letter timing, Steuer-ID — every German screen explained in English. Free.",
  alternates: { canonical: `${DOMAIN}/elster-account-english` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Create an ELSTER Account in English (2026)",
    description:
      "ELSTER is German-only. This free expat guide walks you through registration screen by screen — certificate file, activation letter, Steuer-ID.",
    url: `${DOMAIN}/elster-account-english`,
    siteName: "ReadyExpat",
    locale: "en_US",
    type: "article",
  },
};

export default function ElsterAccountEnglish() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Create an ELSTER Account in English — the Expat Guide",
        description:
          "Germany's tax portal ELSTER runs in German only. This guide walks expats through the registration step by step in English: Steuer-ID, certificate file, activation letter.",
        author: { "@type": "Organization", name: "ReadyExpat", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat" },
        datePublished: "2026-07-07",
        dateModified: "2026-07-07",
        mainEntityOfPage: `${DOMAIN}/elster-account-english`,
      },
      {
        "@type": "HowTo",
        name: "Create an ELSTER account (Mein ELSTER) as a new arrival in Germany",
        description: "Register for Germany's official tax portal with a certificate file — in 5 steps, no German required.",
        totalTime: "P14D",
        estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
        supply: [{ "@type": "HowToSupply", name: "Steuer-ID (11-digit tax identification number)" }],
        step: [
          { "@type": "HowToStep", name: "Have your Steuer-ID ready", text: "Your 11-digit tax ID arrives by post 2–4 weeks after your Anmeldung (up to 6–8 weeks in peak season). You need it to register. Lost it? Request it again at bzst.de." },
          { "@type": "HowToStep", name: "Start the registration at elster.de", text: "Choose 'Benutzerkonto erstellen' (create account), pick the login method 'Zertifikatsdatei' (certificate file), select 'Für mich' (for yourself), and identify with your Steuer-ID." },
          { "@type": "HowToStep", name: "Wait for two activation codes", text: "ELSTER sends an activation ID by email immediately and an activation code by post — the letter typically takes a few days up to two weeks." },
          { "@type": "HowToStep", name: "Activate and download your certificate file", text: "Enter both codes via the link in the email. ELSTER generates your .pfx certificate file — this file plus your password is your login. Back it up." },
          { "@type": "HowToStep", name: "Log in and open your form", text: "Log in to Mein ELSTER with the certificate file. Under 'Alle Formulare' you can now open any tax form, including the Fragebogen zur steuerlichen Erfassung for freelancers." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is there an English version of ELSTER?", acceptedAnswer: { "@type": "Answer", text: "No. The Mein ELSTER portal runs in German only — there is no official English interface. That's why expats use English walkthroughs like this one, and English form copilots for the forms themselves." } },
          { "@type": "Question", name: "How long does ELSTER registration take?", acceptedAnswer: { "@type": "Answer", text: "The online part takes about 10 minutes. The activation code letter arrives by post and typically takes a few days up to two weeks — that letter is the bottleneck, so register early." } },
          { "@type": "Question", name: "Is an ELSTER account free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Registration and use of Mein ELSTER are completely free — it is the official portal of the German tax administration." } },
          { "@type": "Question", name: "What is the ELSTER certificate file (Zertifikatsdatei)?", acceptedAnswer: { "@type": "Answer", text: "A .pfx file that ELSTER generates when you activate your account. Together with your password, it IS your login — there is no username. Store it safely and make a backup; losing it means going through a recovery process." } },
          { "@type": "Question", name: "Do I need a Steuernummer to create an ELSTER account?", acceptedAnswer: { "@type": "Answer", text: "No — you register with your Steuer-ID (the 11-digit number every resident receives after Anmeldung). The Steuernummer is a different number that freelancers receive AFTER submitting the Fragebogen zur steuerlichen Erfassung through ELSTER." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "ELSTER Account in English", item: `${DOMAIN}/elster-account-english` },
        ],
      },
    ],
  };

  const steps = [
    { n: "1", t: "Have your Steuer-ID ready", d: "Your 11-digit steuerliche Identifikationsnummer arrives by post 2–4 weeks after your Anmeldung (up to 6–8 weeks in the peak September season). It's on the letter from the Bundeszentralamt für Steuern. You cannot register without it — if it never arrived, request it again at bzst.de." },
    { n: "2", t: "Start the registration at elster.de", d: "Click “Benutzerkonto erstellen” (create account). Choose the standard login method “Zertifikatsdatei” (certificate file). When asked for whom: “Für mich (und gemeinsam veranlagte Partner)” — for yourself. Identify with “Mit steuerlicher Identifikationsnummer” and enter your Steuer-ID, birth date and email." },
    { n: "3", t: "Wait for two activation codes", d: "ELSTER sends an Aktivierungs-ID by email immediately — and an Aktivierungs-Code by post. The letter typically takes a few days up to two weeks. This letter is the single slowest step of your entire tax registration, which is why you start it first." },
    { n: "4", t: "Activate and save your certificate file", d: "Open the link from the email, enter both codes. ELSTER now generates your personal .pfx certificate file and asks you to set a password. This file + password IS your login — there is no username. Download it, back it up (cloud and/or USB), and never share it." },
    { n: "5", t: "Log in and open your form", d: "At elster.de choose “Login mit Zertifikatsdatei”, upload the .pfx, enter your password. Under “Alle Formulare” search for the form you need — freelancers: “Fragebogen zur steuerlichen Erfassung” → Einzelunternehmen." },
  ];

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="" />

      <main className="main">
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">ELSTER Account in English</span>
            </div>
            <span className="pill"><span className="dot" />Free guide · Germany&apos;s tax portal · No German required</span>
            <h1 className="hero-title">
              How to create an ELSTER account.
              <span className="accent">In English. Screen by screen.</span>
            </h1>
            <GuideByline updated="July 2026" />
            <p className="lede">ELSTER is Germany&apos;s official tax portal — and it runs in German only. Every freelancer, and eventually almost every resident, needs an account. Here&apos;s the full registration walkthrough for expats, including the one step that takes two weeks.</p>
          </div>
        </section>

        {/* Key facts */}
        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">€0</text></svg>
                <div className="kf-num">Completely free</div>
                <p className="kf-text">ELSTER is the official portal of the German tax administration. No fees, ever.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">2w</text></svg>
                <div className="kf-num">The postal wait</div>
                <p className="kf-text">The activation letter takes a few days up to two weeks. Start before you need it.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">.pfx</text></svg>
                <div className="kf-num">Your login is a file</div>
                <p className="kf-text">No username. A certificate file + password. Lose the file and you start over.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="section" id="sec-steps">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · The 5 Steps</div>
              <h2 className="h2">From nothing to logged in — <span className="accent">in five steps.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
              {steps.map(({ n, t, d }) => (
                <div key={n} className="reveal" style={{ display: "flex", gap: 16, padding: "18px 22px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#eff6ff", color: "#0040ff", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: "#0a1638", marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 13.5, color: "#6b7693", lineHeight: 1.6 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why you need this */}
        <section className="section" id="sec-why">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="eyebrow">02 · Why This Matters</div>
              <h3 style={{ marginTop: 14 }}>Paper is gone. ELSTER is the only way in.</h3>
              <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7 }}>
                Since 2021, the Fragebogen zur steuerlichen Erfassung — the tax registration every new freelancer must submit — is accepted electronically only (§138 Abs. 1b AO; paper is reserved for rare hardship cases). And the deadline is tight: within one month of starting your activity (§138 AO). Since the ELSTER activation letter alone can take up to two weeks, creating the account is the first thing to do — not the last.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Account ready? The form is the hard part.</div>
              <h2>The Fragebogen zur steuerlichen Erfassung. <span className="b">In English.</span></h2>
              <p>Our copilot asks every question of the real ELSTER form in plain English and hands you every German entry — on screen with copy buttons, matched to ELSTER&apos;s field numbers, plus a PDF to keep. €15, one-time. Not tax advice — you decide every entry.</p>
              <Link href="/freelance-steuer" className="cta-btn">
                Fill It in English
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · your data stays in your browser · free ELSTER guide included</div>
            </div>
            <div className="legal">This guide is for general information only. Registration steps can change — verify at <a href="https://www.elster.de" target="_blank" rel="noopener">elster.de</a>.</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">FAQ</div>
              <h2 className="h2">Common questions.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>Is there an English version of ELSTER?</summary><div className="ans">No. The Mein ELSTER portal runs in German only — there is no official English interface. That&apos;s why expats use English walkthroughs like this one, and an <Link href="/freelance-steuer" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>English copilot</Link> for the forms themselves.</div></details>
              <details><summary>How long does ELSTER registration take?</summary><div className="ans">The online part takes about 10 minutes. The activation code letter arrives by post and typically takes a few days up to two weeks — that letter is the bottleneck, so register early.</div></details>
              <details><summary>Is an ELSTER account free?</summary><div className="ans">Yes. Registration and use of Mein ELSTER are completely free — it is the official portal of the German tax administration.</div></details>
              <details><summary>What is the certificate file (Zertifikatsdatei)?</summary><div className="ans">A .pfx file that ELSTER generates when you activate your account. Together with your password, it IS your login — there is no username. Store it safely and back it up; losing it means going through a recovery process.</div></details>
              <details><summary>Do I need a Steuernummer to create the account?</summary><div className="ans">No — you register with your Steuer-ID (the 11-digit number every resident receives by post after Anmeldung). The Steuernummer is a different number that freelancers receive AFTER submitting the Fragebogen zur steuerlichen Erfassung through ELSTER.</div></details>
            </div>
          </div>
        </section>

        {/* Related links */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/freelance-steuer", label: "Freelancer Tax Registration in English" },
                { href: "/what-is-anmeldung", label: "What is Anmeldung?" },
                { href: "/moving-to-berlin-registration", label: "Moving to Berlin" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e6ebf5", background: "white", color: "#0a1638", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <RelatedGuides excludeId="" />
          </div>
        </section>
      </main>
    </div>
  );
}
