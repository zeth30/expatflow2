import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { GuideByline } from "../components/guides/GuideByline";
import { RelatedGuides } from "../components/guides/RelatedGuides";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Moving to Berlin? Your Complete Registration Guide 2026 | ReadyExpat",
  description: "Just moved to Berlin? Expat guide to address registration in English — no German required. What the Anmeldung is, what foreigners and new residents need, step by step, in the right order.",
  alternates: { canonical: `${DOMAIN}/moving-to-berlin-registration` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Moving to Berlin? Your Complete Registration Guide 2026",
    description: "What to do about address registration when you move to Berlin. Step by step, in English.",
    url: `${DOMAIN}/moving-to-berlin-registration`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

const STEPS = [
  { n: "01", label: "Move in", time: "Day 0", desc: "Your 14-day clock starts the moment you move in — not when you sign the lease, not when you arrive in Germany.", color: "#0040ff" },
  { n: "02", label: "Get your Wohnungsgeberbestätigung", time: "Days 1–3", desc: "Ask your landlord to sign this mandatory form immediately. Without it you cannot register. Most landlords have it ready — if yours doesn't, send them our guide.", color: "#7c3aed", link: "/wohnungsgeberbestaetigung" },
  { n: "03", label: "Prepare your Anmeldung form", time: "Days 1–5", desc: "All 54 fields in German. Use ReadyExpat to fill it in 5 minutes in English — or fill it manually using the field guide below.", color: "#0891b2" },
  { n: "04", label: "Book a Bürgeramt appointment", time: "Days 1–7", desc: "Go to service.berlin.de and book the earliest slot. Tuesdays at 8:00 AM new slots appear — gone in seconds. Book now, even before you have all documents.", color: "#d97706", link: "/burgeramt-berlin-appointment" },
  { n: "05", label: "Gather your documents", time: "Before appointment", desc: "Passport (non-EU) or passport/national ID (EU), completed form, signed Wohnungsgeberbestätigung, visa or residence permit if you have one.", color: "#16a34a", link: "/anmeldung-documents" },
  { n: "06", label: "Attend your appointment", time: "Appointment day", desc: "Bring everything. The clerk processes your registration on the spot — takes 5–10 minutes. You receive the Anmeldebestätigung immediately.", color: "#e11d48" },
];

export default function MovingToBerlinRegistration() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Moving to Berlin: Your Complete Address Registration Guide 2026",
        description: "Step-by-step guide to the Anmeldung for people moving to Berlin — what it is, what order to do things, and how to avoid the most common mistakes.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-31",
        mainEntityOfPage: `${DOMAIN}/moving-to-berlin-registration`,
      },
      {
        "@type": "HowTo",
        name: "How to Register Your Address in Berlin (Anmeldung)",
        description: "Step-by-step guide to completing the Berlin Anmeldung as a new expat.",
        totalTime: "PT14D",
        step: STEPS.map(s => ({ "@type": "HowToStep", name: s.label, text: s.desc })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the first thing I need to do after moving to Berlin?", acceptedAnswer: { "@type": "Answer", text: "Register your address (Anmeldung) within 14 days of moving in. You need a signed Wohnungsgeberbestätigung from your landlord, a completed Anmeldeformular, and a Bürgeramt appointment. Start all three on day one." } },
          { "@type": "Question", name: "How long does the Anmeldung process take in Berlin?", acceptedAnswer: { "@type": "Answer", text: "The appointment itself takes 5–10 minutes. Getting an appointment in Berlin typically takes 3–6 weeks — often beyond the 14-day legal window. Book immediately and keep a screenshot showing when you first searched. The form preparation takes 5 minutes with ReadyExpat." } },
          { "@type": "Question", name: "Do I need to register if I'm staying in Berlin temporarily?", acceptedAnswer: { "@type": "Answer", text: "If you stay more than 3 months, yes — registration is mandatory. Under 3 months, tourists and short-term visitors are exempt. Remote workers and digital nomads staying 3+ months must register regardless of their employment situation." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Moving to Berlin Registration", item: `${DOMAIN}/moving-to-berlin-registration` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="" />

      <main className="main">
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Moving to Berlin</span>
            </div>
            <span className="pill"><span className="dot" />New to Berlin · Step-by-step · 2026</span>
            <h1 className="hero-title">
              Just moved to Berlin?
              <span className="accent">Here's your complete address registration guide — step by step, in English.</span>
            </h1>
            <GuideByline updated="May 2026" />
            <p className="lede">The Anmeldung is mandatory within 14 days. The form is in German. The process has traps. This guide gets you through it without surprises.</p>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">14</text></svg>
                <div className="kf-num">Days to register</div>
                <p className="kf-text">Calendar days from move-in. Screenshot your search — fines essentially never happen.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">3</text></svg>
                <div className="kf-num">Things to prepare</div>
                <p className="kf-text">Form, Wohnungsgeberbestätigung, appointment. All three at once.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">5m</text></svg>
                <div className="kf-num">At the counter</div>
                <p className="kf-text">The appointment itself takes 5–10 minutes when you have everything ready.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-steps">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · The Process</div>
              <h2 className="h2">6 steps — <span className="accent">in this order.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {STEPS.map(({ n, label, time, desc, color, link }) => (
                <div key={n} className="reveal" style={{ display: "flex", gap: 0, padding: "20px 24px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14, borderLeft: `4px solid ${color}`, position: "relative" }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", width: "100%" }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Step {n}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{time}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0a1638", marginBottom: 6 }}>
                        {link ? <Link href={link} style={{ color: "#0a1638", textDecoration: "none" }}>{label} →</Link> : label}
                      </div>
                      <div style={{ fontSize: 13.5, color: "#6b7693", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="sec-guides">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · Go Deeper</div>
              <h2 className="h2">Complete guides for <span className="accent">each step.</span></h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {[
                { href: "/what-is-anmeldung", n: "01", title: "What is Anmeldung?", sub: "The law, who must register, consequences" },
                { href: "/anmeldung-online-non-eu", n: "02", title: "Online Anmeldung", sub: "Why non-EU citizens can't register online" },
                { href: "/anmeldung-documents", n: "03", title: "Document Checklist", sub: "Everything to bring to your appointment" },
                { href: "/wohnungsgeberbestaetigung", n: "04", title: "Landlord Form", sub: "What it is and how to get it signed" },
                { href: "/burgeramt-berlin-appointment", n: "05", title: "Book an Appointment", sub: "Hacks to find slots in Berlin" },
              ].map(({ href, n, title, sub }) => (
                <Link key={href} href={href} style={{ padding: "18px 20px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14, textDecoration: "none", display: "block", transition: "box-shadow .15s" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Guide {n}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0a1638", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7693" }}>{sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">The Anmeldung form — done in 5 minutes.</div>
              <h2>Answer in English. <span className="b">Get a correct German PDF.</span></h2>
              <p>ReadyExpat fills all 54 Anmeldeformular fields correctly in German. All translations, dates, and formats handled. €15 once.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <div className="legal">This guide is for general information only. Always verify current requirements at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a>.</div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">FAQ</div>
              <h2 className="h2">Common questions.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>What is the first thing I need to do after moving to Berlin?</summary><div className="ans">Register your address (Anmeldung) within 14 days. You need a signed Wohnungsgeberbestätigung from your landlord, a completed Anmeldeformular, and a Bürgeramt appointment. Start all three on day one.</div></details>
              <details><summary>How long does the Anmeldung process take in Berlin?</summary><div className="ans">The appointment itself takes 5–10 minutes. Getting an appointment in Berlin typically takes 3–6 weeks — often beyond the 14-day legal window. Book immediately and screenshot your first search attempt. That screenshot protects you if questions arise about the delay. The form takes 5 minutes with ReadyExpat.</div></details>
              <details><summary>Do I need to register if I'm staying in Berlin temporarily?</summary><div className="ans">If you stay more than 3 months, yes — mandatory. Under 3 months, tourists are exempt. Remote workers staying 3+ months must register regardless of employment situation.</div></details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <RelatedGuides excludeId="moving" />
          </div>
        </section>
      </main>
    </div>
  );
}
