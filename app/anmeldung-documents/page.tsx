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
    "The complete document checklist for your Anmeldung in Germany. Personalised for your situation — missing a required document means a failed appointment; minor form errors are usually corrected at the counter.",
  alternates: { canonical: `${DOMAIN}/anmeldung-documents` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Document Checklist — What to Bring to the Bürgeramt",
    description: "Personalised document checklist for your Anmeldung appointment. Know exactly what to bring for your situation — missing a document costs you the appointment slot.",
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
          { "@type": "Question", name: "What documents do I need for the Anmeldung in Germany?", acceptedAnswer: { "@type": "Answer", text: "Three documents are always required: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the Wohnungsgeberbestätigung signed by your landlord. Most people should also bring their own birth certificate — particularly if born outside Germany. Non-EU citizens should bring their visa or residence permit if they already have one. Married couples need a marriage certificate; families registering children need a birth certificate per child." } },
          { "@type": "Question", name: "Does the Anmeldung form need to be in German?", acceptedAnswer: { "@type": "Answer", text: "Yes. All 54 fields of the Anmeldeformular must be completed in German. Country names, occupations, and titles must be translated. The clerk will not translate for you at the counter — any English entries are grounds for rejection." } },
          { "@type": "Question", name: "Can I submit the Anmeldeformular digitally or on my phone?", acceptedAnswer: { "@type": "Answer", text: "No. The Anmeldeformular must be printed on paper and signed by hand (wet ink) after printing. Showing the form on a phone screen is not accepted. Sign the form as the last step before you leave home — signing before printing is also rejected." } },
          { "@type": "Question", name: "What happens if I bring the wrong documents to my Bürgeramt appointment?", acceptedAnswer: { "@type": "Answer", text: "If you are missing a required document — particularly the Wohnungsgeberbestätigung or a valid ID — the clerk will turn you away. You lose your appointment slot and must re-book, which in most German cities means waiting weeks. For minor form issues, some clerks will help you fix them at the counter. Check your documents the night before and again in the morning." } },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Document Checklist</span>
            </div>
            <span className="pill warn"><span className="dot" />Guide 03 · Document Checklist</span>
            <h1 className="hero-title">
              Show up missing a document and they send you home.
              <span className="accent">Here is everything you need.</span>
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
              <div className="eyebrow">Missing a document</div>
              <h3>Show up without the Wohnungsgeberbestätigung or your ID and <span className="b">the appointment is over.</span></h3>
              <p>Missing a required document means no appointment. You lose your slot and start the booking process again — which in most German cities means waiting <strong>weeks</strong>. Check your checklist the night before. Check again in the morning.</p>
              <p style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.65)", fontSize: 14 }}>A small error on the form — a typo, a date format issue — is a different story. Clerks handle minor corrections at the counter all the time. <strong style={{ color: "rgba(255,255,255,.85)" }}>The documents are the real risk.</strong></p>
            </div>
          </div>
        </section>

        {/* 02 · Translations & apostilles */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · Translations &amp; apostilles</div>
              <h2 className="h2">Foreign documents need more than <span className="accent">a photocopy.</span></h2>
              <p className="section-sub">If you are presenting documents from outside Germany — birth certificates, marriage certificates — you usually need both a certified translation and an apostille. Here is what each one means and where to get them.</p>
            </div>

            <div className="reveal mob-2col" style={{ marginBottom: 24 }}>
              <div className="card">
                <div className="iconbox blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                <h4>Certified translation</h4>
                <p>Any document not in German must be translated by a <strong>sworn translator</strong> (vereidigter Übersetzer / vereidigte Übersetzerin). A bilingual friend or machine translation is not accepted by German authorities.</p>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55 }}>Which documents need it: birth certificates from non-German-speaking countries, foreign marriage certificates, name change documents.</p>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55 }}>Where to find one: <strong>bdue.de</strong> (Bundesverband der Dolmetscher und Übersetzer) or <strong>justizportal.de</strong>. Typical cost: €50–150 per document.</p>
              </div>
              <div className="card">
                <div className="iconbox ink"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/><path d="M20 12a8 8 0 1 1-4-6.93"/></svg></div>
                <h4>Apostille</h4>
                <p>An apostille is an official certification under the <strong>1961 Hague Convention</strong> that authenticates the origin of a public document for use abroad. It is separate from translation — you may need both.</p>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55 }}>Get it in your home country from the authority that issued the document — usually the Ministry of Foreign Affairs, a notary, or the court that issued the original.</p>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55 }}>If your country is not a Hague Convention signatory, you need full <strong>legalisation</strong> via the German embassy instead.</p>
              </div>
            </div>

            <div className="callout info reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">Not every Bürgeramt will ask for an apostille</div>
                <div className="p">Some clerks accept English-language documents as-is; others request an apostille and a certified translation. If you are short on time, bring what you have. If the clerk needs more, they will tell you exactly what to get before rescheduling.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · Form pitfalls */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · Why the form is so easy to get wrong</div>
              <h2 className="h2">Three form details that <span className="accent">catch most expats off guard.</span></h2>
              <p className="section-sub" style={{ fontSize: 14.5, color: "var(--ink-2)" }}>Clerks occasionally correct minor errors at the counter — but it is better not to rely on a lenient clerk.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="reveal">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>,
                  label: "PITFALL 01", title: "Date format",
                  bad:  { lbl: "✗ US-STYLE — GETS FLAGGED",  val: "03/14/1992", note: "MM/DD/YYYY gets flagged immediately. US expats get this wrong more than any other group." },
                  good: { lbl: "✓ GERMAN — CORRECT",         val: "14.03.1992", note: "DD.MM.YYYY with periods. Move-in date, date of birth, document expiries — all of them." },
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
                  label: "PITFALL 02", title: "Language — every entry in German",
                  bad:  { lbl: "✗ ENGLISH — GETS FLAGGED",  val: "United States",      note: "Country names, titles, occupations — all must be in German. The clerk cannot verify on-the-spot translations and will usually ask you to redo the form." },
                  good: { lbl: "✓ GERMAN — CORRECT",        val: "Vereinigte Staaten", note: "USA · Vereinigte Staaten · Vereinigtes Königreich · Indien · Brasilien · Australien · Kanada" },
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 21l3-9 11-11 4 4-11 11z"/></svg>,
                  label: "PITFALL 03", title: "Signature timing",
                  bad:  { lbl: "✗ PRE-SIGNED — RISKY",    val: "Sign → print → bring", note: "Do not sign on screen, then print. Many clerks will ask for a fresh signature at the counter if they notice." },
                  good: { lbl: "✓ PRINT FIRST — CORRECT", val: "Print → sign → bring", note: "Print the form, then sign with a pen at the Datum / Unterschrift field. Wet ink, last step before you leave the house." },
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
                  <div className="mob-2col">
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
            <div className="callout info reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div>
                <div className="h">Local hack: print at DM or Rossmann for €0.10 per page</div>
                <div className="p">No home printer? DM and Rossmann have self-service print kiosks in every neighbourhood. Upload your PDF via USB or the in-store terminal and print for <strong>€0.10–0.15 per page</strong>. No registration required, no email needed. Every German knows this — most expats have never heard of it.</div>
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
              <div className="eyebrow">04 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>What documents do I need for the Anmeldung in Germany?</summary><div className="ans">Three documents are always required: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Wohnungsgeberbestätigung</a> signed by your landlord. Most people should also bring their own birth certificate — particularly if born outside Germany. Non-EU citizens should bring their visa or residence permit if they already have one. Married couples need a marriage certificate; families registering children need a birth certificate per child. Use the checklist above to personalise this for your situation.</div></details>
              <details><summary>Does the Anmeldung form need to be in German?</summary><div className="ans">Yes. All 54 fields of the Anmeldeformular must be completed in German. Country names, occupations, and titles must all be translated. The clerk will not translate for you at the counter — any English entries are grounds for rejection on the spot.</div></details>
              <details><summary>Can I show the form on my phone at the Bürgeramt?</summary><div className="ans">No. The Anmeldeformular must be printed on paper and signed by hand (wet ink) after printing. Showing the form on a phone screen is not accepted. Sign the form as the last step before you leave home — signing before printing is also rejected by the clerk.</div></details>
              <details><summary>What happens if I bring the wrong documents?</summary><div className="ans">If you are missing a required document — especially the Wohnungsgeberbestätigung or a valid ID — the clerk will turn you away. You lose your appointment slot and must re-book, which in most German cities means waiting weeks. For minor form issues (a small error on the form), some clerks will help you correct it at the counter. Check the night before. Check again in the morning. See <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 05</a> for how to re-book efficiently.</div></details>
              <details><summary>Is the Wohnungsgeberbestätigung the same as my rental contract?</summary><div className="ans">No. The Wohnungsgeberbestätigung is a separate one-page form your landlord must sign confirming your move-in date. In normal circumstances, a rental contract alone is not accepted. Your landlord is legally required to provide it under §19 Bundesmeldegesetz. <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Guide 04</a> explains what to do if your landlord is slow or refuses.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Personalised checklist + correct German PDF — nothing left to chance.</div>
              <h2>Know exactly what to bring. <span className="b">Arrive ready.</span></h2>
              <p>SimplyExpat builds your personalised document checklist based on your situation, then fills all 54 form fields correctly in German — translations, dates, format. Done in 5 minutes.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <GuidePageNav activeId="checklist" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
