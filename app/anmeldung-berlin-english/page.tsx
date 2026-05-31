import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Berlin in English: Complete Guide for Expats 2026 | ReadyExpat",
  description: "How to complete the Berlin Anmeldung form if you don't speak German. Every field explained in English, common translation mistakes flagged, and how to get a pre-filled correct PDF without touching a German dictionary.",
  alternates: { canonical: `${DOMAIN}/anmeldung-berlin-english` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Berlin in English: Complete Guide for Expats 2026",
    description: "Every field on the Berlin Anmeldung form explained in English. Mistakes flagged. Pre-filled PDF available.",
    url: `${DOMAIN}/anmeldung-berlin-english`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

const FIELDS = [
  { de: "Familienstand", en: "Marital status", values: "ledig = single · verheiratet = married · geschieden = divorced · verwitwet = widowed", risk: "high" },
  { de: "Staatsangehörigkeiten", en: "Citizenship(s)", values: "Must be the German adjective form — 'amerikanisch' not 'American' or 'USA'", risk: "high" },
  { de: "Geschlecht", en: "Gender", values: "männlich = male · weiblich = female · divers = non-binary", risk: "medium" },
  { de: "Religionsgesellschaft", en: "Religion / church tax", values: "OA = no declaration (safe default). RK/EV triggers 8–9% church tax.", risk: "high" },
  { de: "Tag des Einzugs", en: "Move-in date", values: "DD.MM.YYYY only. Not MM/DD/YYYY.", risk: "high" },
  { de: "Geburtsname", en: "Birth name", values: "Name at birth if different from current surname. Leave blank if same.", risk: "low" },
  { de: "Ordens-/Künstlername", en: "Religious / stage name", values: "Leave blank if not applicable. Most expats skip this.", risk: "low" },
  { de: "Wohnungsgeberbestätigung", en: "Landlord confirmation", values: "Separate mandatory form — not part of the Anmeldeformular itself.", risk: "high" },
];

export default function AnmeldungBerlinEnglish() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Complete the Berlin Anmeldung Form in English",
        description: "Every field on the official Berlin Anmeldung form explained in English. Covers translation traps, common errors, and how to get a pre-filled correct PDF.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/anmeldung-berlin-english`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is there an official English version of the Berlin Anmeldung form?", acceptedAnswer: { "@type": "Answer", text: "No. The official Anmeldeformular is only available in German. The Bürgeramt will only accept the German form — an English translation is not accepted as a substitute. You must submit a form with all 54 fields filled correctly in German." } },
          { "@type": "Question", name: "Can I fill the Anmeldung form in English?", acceptedAnswer: { "@type": "Answer", text: "No — the form must be submitted in German. Names should be written as they appear in your passport, but all other fields (marital status, gender, religion, citizenship) must use the correct German terms." } },
          { "@type": "Question", name: "What does Staatsangehörigkeit mean on the Anmeldung?", acceptedAnswer: { "@type": "Answer", text: "Staatsangehörigkeit means citizenship or nationality. It must be filled using the German adjective form — 'amerikanisch' for American, 'britisch' for British, 'indisch' for Indian. Writing 'USA', 'USA citizen', or 'American' in English is incorrect." } },
          { "@type": "Question", name: "What is Religionsgesellschaft on the Anmeldung form?", acceptedAnswer: { "@type": "Answer", text: "Religionsgesellschaft is the religion field. Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — church tax of 8–9% of your income tax. Write OA (Ohne Angabe) to make no declaration. Most expats write OA." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung in English", item: `${DOMAIN}/anmeldung-berlin-english` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1920&q=80&auto=format')" }}>
          <div className="wrap" style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crumbs">
                <Link href="/#guides">Guides</Link>
                <span className="sep">→</span>
                <span className="here">Anmeldung in English</span>
              </div>
              <span className="pill"><span className="dot" />English Guide · All 54 Fields · Translation Traps</span>
              <h1 className="hero-title">
                The Berlin Anmeldung Form — Explained in English.
                <span className="accent">No official English version exists. Here's what every field actually means.</span>
              </h1>
              <p className="lede">The official Anmeldeformular is German-only. Every field must be completed in German or you risk rejection. Here's the complete field-by-field breakdown — and the translation traps that catch most expats.</p>
            </div>
            <div className="hero-form-preview">
              <div style={{ position: "relative", width: 210 }}>
                <div style={{ position: "absolute", inset: 0, transform: "rotate(-3deg) translate(-7px, 6px)", borderRadius: 12, background: "white", border: "1px solid #e6ebf5", boxShadow: "0 6px 20px rgba(10,22,56,.09)" }} />
                <div style={{ position: "absolute", inset: 0, transform: "rotate(1.5deg) translate(5px, 3px)", borderRadius: 12, background: "white", border: "1px solid #e6ebf5", boxShadow: "0 6px 20px rgba(10,22,56,.06)" }} />
                <img src="/anmeldung-form.png" alt="Official Berlin Anmeldung form" style={{ width: "100%", display: "block", borderRadius: 12, border: "1px solid #e6ebf5", boxShadow: "0 10px 32px rgba(10,22,56,.15)", position: "relative" }} />
                <div style={{ position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)", background: "#16a34a", color: "white", borderRadius: 999, padding: "5px 13px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(22,163,74,.35)" }}>✓ 54 fields · Correct German</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">54</text></svg>
                <div className="kf-num">Fields on the form</div>
                <p className="kf-text">All in German. All must be correct to avoid rejection at the counter.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">0</text></svg>
                <div className="kf-num">Official English versions</div>
                <p className="kf-text">There is no English Anmeldeformular. The German form is the only accepted version.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">5m</text></svg>
                <div className="kf-num">With ReadyExpat</div>
                <p className="kf-text">Answer in English. Get a perfectly filled German PDF in 5 minutes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-fields">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · The Tricky Fields</div>
              <h2 className="h2">Fields that catch <span className="accent">expats out.</span></h2>
              <p className="section-sub">These are the fields most commonly filled incorrectly by English-speaking expats.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, border: "1px solid #e6ebf5", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 160px 1fr 80px", gap: 0, padding: "10px 20px", background: "#f8fafc", fontSize: 11, fontWeight: 800, color: "#6b7693", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <span>German field</span><span>Means</span><span>What to write</span><span>Risk</span>
              </div>
              {FIELDS.map(({ de, en, values, risk }) => (
                <div key={de} className="reveal" style={{ display: "grid", gridTemplateColumns: "180px 160px 1fr 80px", gap: 0, padding: "14px 20px", background: "white", borderTop: "1px solid #f1f5f9", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#0040ff", fontWeight: 600 }}>{de}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0a1638" }}>{en}</span>
                  <span style={{ fontSize: 12.5, color: "#6b7693", lineHeight: 1.55, paddingRight: 20 }}>{values}</span>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                    background: risk === "high" ? "#fff1f2" : risk === "medium" ? "#fff7ed" : "#f0fdf4",
                    color: risk === "high" ? "#e11d48" : risk === "medium" ? "#d97706" : "#16a34a" }}>
                    {risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Answer in English. Get a correct German PDF.</div>
              <h2>No German required. <span className="b">No mistakes.</span></h2>
              <p>ReadyExpat handles all 54 fields — Staatsangehörigkeit, Familienstand, Religionsgesellschaft, date formats — all correct German values throughout. 5 minutes. €15.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Start My Anmeldung
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
              <details><summary>Is there an official English version of the Berlin Anmeldung form?</summary><div className="ans">No. The official form is German-only. The Bürgeramt only accepts the German Anmeldeformular — all 54 fields must be completed in German.</div></details>
              <details><summary>Can I fill the Anmeldung form in English?</summary><div className="ans">No — the form must be in German. Names go as printed in your passport, but all other fields (marital status, gender, religion, citizenship) must use correct German terms.</div></details>
              <details><summary>What does Staatsangehörigkeit mean?</summary><div className="ans">Citizenship. It must be the German adjective form: 'amerikanisch' for American, 'britisch' for British, 'indisch' for Indian. Writing 'USA' or 'American' is incorrect.</div></details>
              <details><summary>What is Religionsgesellschaft and should I fill it in?</summary><div className="ans">The religion field. Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — church tax of 8–9% of income tax. Write OA (Ohne Angabe) to opt out. Most expats write OA.</div></details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/what-is-anmeldung", label: "What is Anmeldung?" },
                { href: "/anmeldung-documents", label: "Document Checklist" },
                { href: "/wohnungsgeberbestaetigung", label: "Landlord Confirmation" },
                { href: "/burgeramt-berlin-appointment", label: "Book an Appointment" },
                { href: "/anmeldung-online-non-eu", label: "Online Anmeldung" },
                { href: "/anmeldung-mistakes-berlin", label: "Common Mistakes" },
                { href: "/anmeldung-deadline-berlin", label: "The 14-Day Deadline" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e6ebf5", background: "white", color: "#0a1638", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}