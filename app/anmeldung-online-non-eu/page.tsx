import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";
import { EligibilityChecker } from "./EligibilityChecker";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Online Anmeldung for Non-EU Citizens — Why It's Not Available (2026) · SimplyExpat Berlin",
  description:
    "Non-EU citizens cannot register their address online in Germany. Online Anmeldung requires an EU/EEA eID card. Here is the in-person path that works for US, UK, Indian, and other non-EU expats.",
  alternates: { canonical: `${DOMAIN}/anmeldung-online-non-eu` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Online Anmeldung for Non-EU Citizens — Why It's Not Available",
    description: "Non-EU citizens cannot register online in Germany. The eID requirement excludes everyone without an EU/EEA passport. Here is the in-person path.",
    url: `${DOMAIN}/anmeldung-online-non-eu`,
    siteName: "SimplyExpat Berlin",
    type: "article",
  },
};

export default function OnlineNonEU() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Online Anmeldung for Non-EU Citizens — Why It's Not Available",
        description: "Germany's online Anmeldung portal requires an EU/EEA eID card. Non-EU citizens including US, UK, Indian, Brazilian, Canadian and Australian passport holders must register in person.",
        author: { "@type": "Organization", name: "SimplyExpat Berlin" },
        publisher: { "@type": "Organization", name: "SimplyExpat Berlin" },
        datePublished: "2026-05-01",
        dateModified: "2026-05-14",
        mainEntityOfPage: `${DOMAIN}/anmeldung-online-non-eu`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Can non-EU citizens register online in Germany?", acceptedAnswer: { "@type": "Answer", text: "No. The online portal requires an EU/EEA eID card with the Online-Ausweis chip activated. Non-EU and non-EEA passport holders — including US, UK, Indian, Brazilian, Australian, Canadian — cannot obtain this card. There is no workaround." } },
          { "@type": "Question", name: "Can UK citizens use online Anmeldung post-Brexit?", acceptedAnswer: { "@type": "Answer", text: "No. Following Brexit, the UK is not an EU or EEA member state. UK passport holders register in person at a Bürgeramt — same as US, Indian, Brazilian, and other non-EU expats." } },
          { "@type": "Question", name: "Can I change my German address online?", acceptedAnswer: { "@type": "Answer", text: "Only if you hold a compatible eID card (German Personalausweis or a compatible EU/EEA national eID) with the Online-Ausweis chip activated. Non-EU citizens cannot obtain this card. EU citizens may have a compatible card from their home country, but the chip must be specifically activated — most EU expats arriving fresh will not have this set up." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "SimplyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Online Anmeldung for Non-EU Citizens", item: `${DOMAIN}/anmeldung-online-non-eu` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="noneu" />

      <main className="main">
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540646794357-6cbbd6f3501e?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Online Anmeldung — Non-EU</span>
            </div>
            <span className="pill warn"><span className="dot" />Guide 02 · Non-EU Citizens</span>
            <h1 className="hero-title">
              You just found out you can&apos;t register online.
              <span className="accent">Here is what to do instead.</span>
            </h1>
            <p className="lede">Online Anmeldung exists. Non-EU citizens cannot use it. Here is exactly why — and your fastest path forward.</p>
          </div>
        </section>

        {/* 01 · Eligibility checker */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · Eligibility checker</div>
              <h2 className="h2">Can you register <span className="accent">online?</span></h2>
              <p className="section-sub">Toggle each row. The verdict updates live. To register online you need every box green.</p>
            </div>
            <div className="reveal">
              <EligibilityChecker />
            </div>
          </div>
        </section>

        {/* EU note */}
        <section className="section">
          <div className="wrap">
            <div className="callout info reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
              <div>
                <div className="h">Even EU citizens arriving for the first time must register in person.</div>
                <div className="p">Online registration only works for Ummeldung — changing an existing German address. Your initial registration from abroad is always at the Bürgeramt, regardless of nationality. And even for Ummeldung, you need a compatible eID card with the Online-Ausweis chip already activated — most EU expats arriving fresh will not have this set up.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · 4 steps */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · What you must do instead</div>
              <h2 className="h2">In-person, in <span className="accent">four steps.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="reveal">
              {[
                { n: "1", title: "Get your Wohnungsgeberbestätigung", body: "Your landlord or main tenant must sign this form confirming your move-in date and address. Request it in writing the moment you know your move-in date. Without it, the Bürgeramt will not register you — your rental contract is not a substitute.", link: "/wohnungsgeberbestaetigung", lt: "See guide 04 →" },
                { n: "2", title: "Complete the Anmeldeformular in German", body: "54 fields, all in German. Wrong date formats, untranslated entries, missed fields — this is where most expats get turned away. English-language form preparation services exist specifically for this step.", link: "/anmeldung-documents", lt: "See guide 03 →" },
                { n: "3", title: "Book a Bürgeramt appointment", body: "Every city runs its own booking portal. Wait times, slot-drop times, and which districts are fastest vary completely between Berlin, Hamburg, Munich and the rest. Pick your city in guide 05 for the specific playbook.", link: "/burgeramt-berlin-appointment", lt: "See guide 05 →" },
                { n: "4", title: "Attend in person", body: "Bring your passport, your completed German-language form, and your Wohnungsgeberbestätigung. Non-EU: also bring your visa or residence permit. Done in 5–10 minutes when documents are complete.", link: null, lt: null },
              ].map((s) => (
                <div key={s.n} className="card" style={{ display: "grid", gridTemplateColumns: s.link ? "64px 1fr auto" : "64px 1fr", gap: 24, alignItems: "center" }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: "var(--blue)", letterSpacing: "-0.04em" }}>{s.n}</div>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                  {s.link && (
                    <Link href={s.link} className="tag" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>{s.lt}</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reality check dark box */}
        <section className="section">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="eyebrow">Reality check</div>
              <h3>The form is entirely in German. Every field. <span className="b">One mistake and you go home.</span></h3>
              <p>One wrong entry, one date in the wrong format, one field left blank — and the clerk turns you away on the spot. That means another long wait for a new appointment. Bürgeramt clerks follow the rules strictly. They will not help you complete the form at the counter.</p>
            </div>
          </div>
        </section>

        {/* 04 · FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">04 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>Can any non-EU citizen do the Anmeldung online?</summary><div className="ans">No. The online portal requires an EU/EEA eID card (elektronischer Personalausweis) with the Online-Ausweis chip activated. Non-EU and non-EEA passport holders — including US, UK, Indian, Brazilian, Australian, Canadian — cannot obtain this card. There is no workaround.</div></details>
              <details><summary>What exactly is the eID card?</summary><div className="ans">Germany's online Anmeldung portal authenticates via the <em>Online-Ausweis</em> function — an NFC chip built into the German Personalausweis (issued to German citizens) and some EU/EEA national identity cards. The chip must be specifically activated; it is not enabled by default on all cards. Most EU expats arriving in Germany for the first time will not have this activated, even if their home country issues a compatible eID. Non-EU citizens cannot obtain this card at all.</div></details>
              <details><summary>Can I register online as a UK citizen?</summary><div className="ans">No. Following Brexit, the UK is not an EU or EEA member state and UK citizens are not eligible for the eID card. UK passport holders register in person at a Bürgeramt — same process as US, Indian, Brazilian, and other non-EU expats.</div></details>
              <details><summary>I already have a German address — can I change it online?</summary><div className="ans">Only if you hold a compatible eID card with the Online-Ausweis chip activated. This means the German Personalausweis (German citizens only) or a compatible EU/EEA national eID with the chip activated. If you are a non-EU citizen, you will never have this card. If you are an EU citizen but have not activated the Online-Ausweis function on your home-country eID, you cannot use the online portal either — registration in person applies to you too.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">For expats moving to Germany</div>
              <h2>We handle the German form <span className="b">for you.</span></h2>
              <p>Answer in English. We generate your completed Anmeldeformular — all 54 fields in correct German — ready to print and bring to your appointment. €15, one time.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">No payment until the PDF is ready · cancel anytime</div>
            </div>
            <GuidePageNav activeId="noneu" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
