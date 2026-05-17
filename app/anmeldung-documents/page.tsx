import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";
import { ChecklistClient } from "./ChecklistClient";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Document Checklist — What to Bring to the Bürgeramt (2026) · SimplyExpat Berlin",
  description:
    "The complete document checklist for your Anmeldung in Germany. Passport, Wohnungsgeberbestätigung, and the German-language form are all required — missing one means a failed appointment.",
  alternates: { canonical: `${DOMAIN}/anmeldung-documents` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Document Checklist — What to Bring to the Bürgeramt",
    description: "Personalised document checklist for your Anmeldung appointment in Germany. Don't get turned away.",
    url: `${DOMAIN}/anmeldung-documents`,
    siteName: "SimplyExpat Berlin",
    type: "article",
  },
};

export default function AnmeldungDocuments() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Anmeldung Document Checklist — What to Bring to the Bürgeramt",
        description: "The complete document checklist for the Anmeldung in Germany, with situation-specific additions for non-EU citizens, married couples, and families.",
        author: { "@type": "Organization", name: "SimplyExpat Berlin" },
        publisher: { "@type": "Organization", name: "SimplyExpat Berlin" },
        datePublished: "2026-05-01",
        dateModified: "2026-05-14",
        mainEntityOfPage: `${DOMAIN}/anmeldung-documents`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What documents do I need for the Anmeldung in Germany?", acceptedAnswer: { "@type": "Answer", text: "Three documents are always required: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the Wohnungsgeberbestätigung signed by your landlord. Non-EU citizens must also bring a current visa or residence permit. Married couples need a marriage certificate; families registering children need a birth certificate for each child." } },
          { "@type": "Question", name: "Does the Anmeldung form need to be in German?", acceptedAnswer: { "@type": "Answer", text: "Yes. All 54 fields of the Anmeldeformular must be completed in German. Country names, occupations, and titles must be translated. The clerk will not translate for you at the counter — any English entries are grounds for rejection." } },
          { "@type": "Question", name: "Can I submit the Anmeldeformular digitally or on my phone?", acceptedAnswer: { "@type": "Answer", text: "No. The Anmeldeformular must be printed on paper and signed by hand (wet ink) after printing. Showing the form on a phone screen is not accepted. Sign the form as the last step before you leave home — signing before printing is also rejected." } },
          { "@type": "Question", name: "What happens if I bring the wrong documents to my Bürgeramt appointment?", acceptedAnswer: { "@type": "Answer", text: "The clerk will turn you away on the spot. You lose your appointment slot and must re-book — which in most German cities means waiting weeks. There are no exceptions and no coming back in an hour. Check your documents the night before and again in the morning." } },
          { "@type": "Question", name: "Is the Wohnungsgeberbestätigung the same as my rental contract?", acceptedAnswer: { "@type": "Answer", text: "No. The Wohnungsgeberbestätigung is a separate one-page form that your landlord or main tenant must sign, confirming your move-in date. In normal circumstances, a rental contract alone is not accepted as a substitute. Your landlord is legally required to provide it under §19 Bundesmeldegesetz." } },
        ],
      },
      {
        "@type": "ItemList",
        name: "Documents required for the Anmeldung in Germany",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Valid passport or EU national ID" },
          { "@type": "ListItem", position: 2, name: "Wohnungsgeberbestätigung (landlord confirmation form)" },
          { "@type": "ListItem", position: 3, name: "Completed Anmeldeformular in German" },
          { "@type": "ListItem", position: 4, name: "Current visa or residence permit (non-EU only)" },
          { "@type": "ListItem", position: 5, name: "Marriage certificate (if married)" },
          { "@type": "ListItem", position: 6, name: "Birth certificate for each child (if registering children)" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "SimplyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung Document Checklist", item: `${DOMAIN}/anmeldung-documents` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="checklist" />

      <main className="main">
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540646794357-6cbbd6f3501e?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Document Checklist</span>
            </div>
            <span className="pill warn"><span className="dot" />Guide 03 · Document Checklist</span>
            <h1 className="hero-title">
              Show up missing one document and they send you home.
              <span className="accent">Here is the exact list.</span>
            </h1>
            <p className="lede">The complete checklist of what to bring to your <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "none" }}>Bürgeramt appointment</a>. Tick them off as you prepare. New to this? Start with <a href="/what-is-anmeldung" style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "none" }}>guide 01 — What is Anmeldung</a>.</p>
          </div>
        </section>

        {/* 01 · Personalised checklist */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · Personalised checklist</div>
              <h2 className="h2">Tell us your <span className="accent">situation.</span></h2>
              <p className="section-sub">Select every chip that applies and the checklist updates instantly. Tick each item as you prepare.</p>
            </div>
            <div className="reveal">
              <ChecklistClient />
            </div>
          </div>
        </section>

        {/* Dark warning */}
        <section className="section">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="eyebrow">No exceptions</div>
              <h3>If you are missing any document, the clerk will <span className="b">turn you away.</span></h3>
              <p>No exceptions. No coming back in an hour. You lose your appointment and you start the booking process again — which in most German cities means waiting <strong>weeks</strong> for a new slot. Check your checklist the night before. Check it again in the morning.</p>
            </div>
          </div>
        </section>

        {/* 02 · Form pitfalls */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · Why the form is so easy to get wrong</div>
              <h2 className="h2">The three things that fail <span className="accent">99% of attempts.</span></h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="reveal">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>,
                  label: "PITFALL 01", title: "Date format",
                  bad:  { lbl: "✗ US-STYLE — REJECTED",  val: "03/14/1992", note: "MM/DD/YYYY is rejected on the spot. US expats get this wrong more than any other group." },
                  good: { lbl: "✓ GERMAN — ACCEPTED",    val: "14.03.1992", note: "DD.MM.YYYY with periods. Move-in date, date of birth, document expiries — all of them." },
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
                  label: "PITFALL 02", title: "Language — every entry in German",
                  bad:  { lbl: "✗ ENGLISH — REJECTED",   val: "United States",      note: "Country names, titles, occupations — all must be in German. The clerk will not translate for you." },
                  good: { lbl: "✓ GERMAN — ACCEPTED",    val: "Vereinigte Staaten", note: "USA · Vereinigte Staaten · Vereinigtes Königreich · Indien · Brasilien · Australien · Kanada" },
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 21l3-9 11-11 4 4-11 11z"/></svg>,
                  label: "PITFALL 03", title: "Signature timing",
                  bad:  { lbl: "✗ PRE-SIGNED PRINT — REJECTED", val: "Sign → print → bring", note: "Do not sign on screen, then print. The clerk will reject any pre-signed printed form. They want a wet ink signature on paper." },
                  good: { lbl: "✓ PRINT FIRST — ACCEPTED",       val: "Print → sign → bring", note: "Print the form, then sign with a pen at the Datum / Unterschrift field. Wet ink, last step before you leave the house." },
                },
              ].map((p) => (
                <div key={p.label}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--rose-tint)", color: "var(--rose)", display: "grid", placeItems: "center" }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--rose)", letterSpacing: ".14em" }}>{p.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.015em" }}>{p.title}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ padding: 22, borderRadius: 16, border: "1.5px solid #fecdd3", background: "var(--rose-tint)" }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--rose)", letterSpacing: ".14em" }}>{p.bad.lbl}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, marginTop: 8, color: "var(--ink)" }}>{p.bad.val}</div>
                      <div style={{ color: "var(--ink-2)", fontSize: 13.5, marginTop: 10, lineHeight: 1.5 }}>{p.bad.note}</div>
                    </div>
                    <div style={{ padding: 22, borderRadius: 16, border: "1.5px solid var(--green-bd)", background: "var(--green-tint)" }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--green)", letterSpacing: ".14em" }}>{p.good.lbl}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, marginTop: 8, color: "var(--ink)" }}>{p.good.val}</div>
                      <div style={{ color: "var(--ink-2)", fontSize: 13.5, marginTop: 10, lineHeight: 1.5 }}>{p.good.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Callouts */}
        <section className="section">
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="callout warn reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">The religion field — Religionsgesellschaft</div>
                <div className="p">Triggers Kirchensteuer (~8–9% of income tax) if you declare a recognised denomination. Leave it blank or write <strong>OA</strong> (Ohne Angabe) to opt out — no negative consequences. <a href="/what-is-anmeldung#sec-religion" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Full explainer in guide 01 →</a> Non-EU citizens: also see <a href="/anmeldung-online-non-eu" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 02</a> for why online Anmeldung is not available to you and what to do instead.</div>
              </div>
            </div>
            <div className="callout info reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12h18M9 16h2"/></svg></div>
              <div>
                <div className="h">Before your appointment: label your letterbox</div>
                <div className="p">Add your surname to your <strong>Briefkasten</strong> (letterbox) before your appointment. Your Steuer-ID and all official mail will be sent to your registered address — in Germany, mail is not delivered to unlabelled letterboxes.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>What documents do I need for the Anmeldung in Germany?</summary><div className="ans">Three documents are always required: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Wohnungsgeberbestätigung</a> signed by your landlord. Non-EU citizens must also bring a current visa or residence permit. Married couples need a marriage certificate; families registering children need a birth certificate per child. Use the checklist above to personalise this for your situation.</div></details>
              <details><summary>Does the Anmeldung form need to be in German?</summary><div className="ans">Yes. All 54 fields of the Anmeldeformular must be completed in German. Country names, occupations, and titles must all be translated. The clerk will not translate for you at the counter — any English entries are grounds for rejection on the spot.</div></details>
              <details><summary>Can I show the form on my phone at the Bürgeramt?</summary><div className="ans">No. The Anmeldeformular must be printed on paper and signed by hand (wet ink) after printing. Showing the form on a phone screen is not accepted. Sign the form as the last step before you leave home — signing before printing is also rejected by the clerk.</div></details>
              <details><summary>What happens if I bring the wrong documents?</summary><div className="ans">The clerk turns you away on the spot. You lose your appointment slot and must re-book — which in most German cities means waiting weeks. There are no exceptions and no coming back later. Check the night before. Check again in the morning. See <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 05</a> for how to re-book efficiently.</div></details>
              <details><summary>Is the Wohnungsgeberbestätigung the same as my rental contract?</summary><div className="ans">No. The Wohnungsgeberbestätigung is a separate one-page form your landlord must sign confirming your move-in date. In normal circumstances, a rental contract alone is not accepted. Your landlord is legally required to provide it under §19 Bundesmeldegesetz. <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Guide 04</a> explains what to do if your landlord is slow or refuses.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">One wrong field means a failed appointment</div>
              <h2>SimplyExpat fills every field correctly <span className="b">in German.</span></h2>
              <p>Dates, translations, format — handled. You answer in English. We generate the print-ready PDF in 5 minutes.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">No payment until the PDF is ready · cancel anytime</div>
            </div>
            <GuidePageNav activeId="checklist" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
