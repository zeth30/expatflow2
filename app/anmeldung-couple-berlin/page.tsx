import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { PeopleCounter } from "../components/guides/PeopleCounter";
import { GuideByline } from "../components/guides/GuideByline";
import { RelatedGuides } from "../components/guides/RelatedGuides";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung for Couples and Families in Berlin 2026 | ReadyExpat",
  description: "Registering as a couple or family in Berlin uses a single Anmeldung appointment but multiple form sheets — 2 people per sheet. Here's exactly how it works, what differs for couples vs families, and how to prepare.",
  alternates: { canonical: `${DOMAIN}/anmeldung-couple-berlin` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung for Couples and Families in Berlin 2026",
    description: "One appointment. Multiple people. Here's how multi-person Anmeldung works in Berlin.",
    url: `${DOMAIN}/anmeldung-couple-berlin`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungCoupleBerlin() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Do the Anmeldung as a Couple or Family in Berlin",
        description: "Multi-person Anmeldung in Berlin: one appointment, 2 people per form sheet, each person's documents required.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-31",
        mainEntityOfPage: `${DOMAIN}/anmeldung-couple-berlin`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Can a couple register together at the same Bürgeramt appointment?", acceptedAnswer: { "@type": "Answer", text: "Yes. Both people are registered at a single appointment. You submit one Anmeldeformular sheet with both people listed — two people fit on one sheet. One person can attend on behalf of both if they bring a written authorisation (Vollmacht) and both passports." } },
          { "@type": "Question", name: "How many Anmeldung forms does a family of 4 need?", acceptedAnswer: { "@type": "Answer", text: "Two sheets. The Anmeldeformular fits 2 people per sheet. A family of 4 submits 2 sheets at the same appointment. A family of 3 also needs 2 sheets — sheet 1 has 2 people, sheet 2 has 1." } },
          { "@type": "Question", name: "Does each person need their own Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "No. One Wohnungsgeberbestätigung covers everyone registering at the same address. The landlord signs once and all family members are included." } },
          { "@type": "Question", name: "Can one person register for the whole family?", acceptedAnswer: { "@type": "Answer", text: "Yes, with a Vollmacht (written power of attorney) from each absent person, plus their original passport or ID. Children under 16 can be registered by a parent without a Vollmacht." } },
          { "@type": "Question", name: "Do unmarried couples register differently to married couples?", acceptedAnswer: { "@type": "Answer", text: "The Anmeldung process is identical. Marital status affects the Familienstand field on the form but does not change the appointment process or required documents." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung for Couples", item: `${DOMAIN}/anmeldung-couple-berlin` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format')" }}>
          <div className="wrap" style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crumbs">
                <Link href="/#guides">Guides</Link>
                <span className="sep">→</span>
                <span className="here">Anmeldung for Couples</span>
              </div>
              <span className="pill"><span className="dot" />Couples · Families · Up to 6 people</span>
              <h1 className="hero-title">
                Anmeldung for Couples and Families in Berlin.
                <span className="accent">One appointment. 2 people per sheet. Here's exactly how it works.</span>
              </h1>
              <p className="lede">Moving to Berlin as a couple or family? The process is one appointment for everyone — but the form has specific rules about how many people fit on each sheet and what documents each person needs.</p>
            </div>
            <div className="hero-form-preview">
              <div style={{ position: "relative", width: 210 }}>
                <div style={{ position: "absolute", inset: 0, transform: "rotate(-3deg) translate(-7px, 6px)", borderRadius: 12, background: "white", border: "1px solid #e6ebf5", boxShadow: "0 6px 20px rgba(10,22,56,.09)" }} />
                <div style={{ position: "absolute", inset: 0, transform: "rotate(1.5deg) translate(5px, 3px)", borderRadius: 12, background: "white", border: "1px solid #e6ebf5", boxShadow: "0 6px 20px rgba(10,22,56,.06)" }} />
                <img src="/anmeldung-form.png" alt="Official Berlin Anmeldung form" style={{ width: "100%", display: "block", borderRadius: 12, border: "1px solid #e6ebf5", boxShadow: "0 10px 32px rgba(10,22,56,.15)", position: "relative" }} />
                <div style={{ position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)", background: "#16a34a", color: "white", borderRadius: 999, padding: "5px 13px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(22,163,74,.35)" }}>✓ 2 people per sheet</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">1</text></svg>
                <div className="kf-num">One appointment</div>
                <p className="kf-text">Covers everyone registering at the same address, submitted together.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">2</text></svg>
                <div className="kf-num">People per sheet</div>
                <p className="kf-text">Each Anmeldeformular sheet holds exactly 2 people. 3 people = 2 sheets.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">6</text></svg>
                <div className="kf-num">Maximum per order</div>
                <p className="kf-text">ReadyExpat supports up to 6 people in a single order — 3 sheets.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-counter">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · How Many Sheets?</div>
              <h2 className="h2">Calculate your <span className="accent">sheets.</span></h2>
              <p className="section-sub">Select how many people are registering at the same address.</p>
            </div>
            <PeopleCounter />
          </div>
        </section>

        <section className="section" id="sec-how">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="mob-2col-wide">
                <div>
                  <div className="eyebrow">02 · The Process</div>
                  <h3 style={{ marginTop: 14 }}>One appointment covers everyone.</h3>
                  <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7 }}>
                    You book one appointment for the address — not one per person. All sheets are submitted together at the same visit. The clerk processes all registrations in one go.
                  </p>
                </div>
                <div className="mob-no-border-left" style={{ paddingTop: 6, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 48 }}>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>What each person needs</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Valid passport (non-EU) or passport / national ID (EU)",
                      "Listed on the Wohnungsgeberbestätigung (one form covers all)",
                      "Their section of the Anmeldeformular filled correctly",
                      "Visa or residence permit if already issued (non-EU)",
                    ].map(item => (
                      <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg style={{ flexShrink: 0, marginTop: 2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><path d="M5 12l5 5 9-9"/></svg>
                        <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)", lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-situations">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · Common Situations</div>
              <h2 className="h2">How it works for <span className="accent">your situation.</span></h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { title: "Unmarried couple", color: "#0040ff", points: ["Same process as married couples", "Familienstand: 'ledig' for each person", "Both names on Wohnungsgeberbestätigung", "1 sheet for 2 people"] },
                { title: "Married couple", color: "#16a34a", points: ["Familienstand: 'verheiratet'", "Marriage date and place on the form", "Foreign marriage certificate may need certified translation", "1 sheet for 2 people"] },
                { title: "Family with children", color: "#d97706", points: ["Children listed on separate sheet if > 2 people total", "Children under 16: parent can register on their behalf", "No Vollmacht needed for own children", "Bring birth certificates for children born outside Germany"] },
                { title: "One person registering for all", color: "#7c3aed", points: ["Bring written Vollmacht from each absent adult", "Bring original passport/ID of each absent person", "Children under 16: no Vollmacht needed", "All sheets must be signed by the absent person before the appointment"] },
              ].map(({ title, color, points }) => (
                <div key={title} className="reveal" style={{ padding: "22px 24px", background: "white", border: "1px solid #e6ebf5", borderRadius: 16, borderTop: `3px solid ${color}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0a1638", marginBottom: 14 }}>{title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {points.map(p => (
                      <div key={p} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.55 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Couples and families — up to 6 people.</div>
              <h2>One order. All sheets. <span className="b">Everyone registered.</span></h2>
              <p>ReadyExpat generates the right number of form sheets for your household — all 54 fields filled correctly in German. €15 flat, all sheets included.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no account needed · all sheets included</div>
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
              <details><summary>Can a couple register together at the same Bürgeramt appointment?</summary><div className="ans">Yes. Both people are registered at a single appointment. You submit one Anmeldeformular sheet with both people listed. One person can attend on behalf of both with a written Vollmacht and both passports.</div></details>
              <details><summary>How many Anmeldung forms does a family of 4 need?</summary><div className="ans">Two sheets. The Anmeldeformular fits 2 people per sheet. A family of 4 submits 2 sheets at the same appointment.</div></details>
              <details><summary>Does each person need their own Wohnungsgeberbestätigung?</summary><div className="ans">No. One Wohnungsgeberbestätigung covers everyone registering at the same address.</div></details>
              <details><summary>Can one person register for the whole family?</summary><div className="ans">Yes, with a Vollmacht from each absent adult and their original passport or ID. Children under 16 can be registered by a parent without a Vollmacht.</div></details>
              <details><summary>Do unmarried couples register differently to married couples?</summary><div className="ans">The process is identical. Marital status affects the Familienstand field on the form but does not change the appointment or documents required.</div></details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/anmeldung-documents", label: "Document Checklist" },
                { href: "/wohnungsgeberbestaetigung", label: "Wohnungsgeberbestätigung" },
                { href: "/burgeramt-berlin-appointment", label: "Book an Appointment" },
                { href: "/anmeldung-mistakes-berlin", label: "Common Mistakes" },
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
            <RelatedGuides excludeId="couple" />
          </div>
        </section>
      </main>
    </div>
  );
}
