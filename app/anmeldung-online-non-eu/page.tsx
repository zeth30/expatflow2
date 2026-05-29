import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";
import { EligibilityChecker } from "./EligibilityChecker";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Online: Non-EU Citizens Berlin 2026 | ReadyExpat",
  description:
    "Non-EU citizens cannot register their address online in Germany. Online Anmeldung requires an EU/EEA eID card. Here is the in-person path that works for US, UK, Indian, and other non-EU expats.",
  alternates: { canonical: `${DOMAIN}/anmeldung-online-non-eu` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Online Anmeldung for Non-EU Citizens — Why It's Not Available",
    description: "Non-EU citizens cannot register online in Germany. The eID requirement excludes everyone without an EU/EEA passport. Here is the in-person path.",
    url: `${DOMAIN}/anmeldung-online-non-eu`,
    siteName: "ReadyExpat Berlin",
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
        author: { "@type": "Organization", name: "ReadyExpat Berlin" },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
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
          { "@type": "Question", name: "Which EU citizens can use online Anmeldung?", acceptedAnswer: { "@type": "Answer", text: "EU and EEA citizens whose home country issues a compatible national eID card with the Online-Ausweis chip activated. Compatible-issuing countries include Germany, Austria, Belgium, Estonia, Finland, Italy, Netherlands, Portugal, and Spain. However, the chip is not activated by default — an EU expat arriving in Germany for the first time will almost certainly not have it set up. The online portal is mainly relevant for Ummeldung (address changes), not first-time registration from abroad." } },
          { "@type": "Question", name: "Does a German residence permit allow online registration?", acceptedAnswer: { "@type": "Answer", text: "No. A German residence permit (Aufenthaltstitel) does not grant access to the online registration portal. The portal requires the Online-Ausweis chip in a compatible national identity card. A residence permit is a separate document and does not contain this chip. Non-EU citizens always register in person." } },
          { "@type": "Question", name: "What documents does a non-EU citizen need at the Bürgeramt?", acceptedAnswer: { "@type": "Answer", text: "Four documents: a valid passport, the completed Anmeldeformular in German (all 54 fields), the Wohnungsgeberbestätigung signed by your landlord, and your current visa or residence permit. If your visa is still being processed, bring your entry stamp and any interim document issued (Fiktionsbescheinigung or Aufenthaltsgestattung)." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Online Anmeldung — Non-EU</span>
            </div>
            <span className="pill warn"><span className="dot" />Guide 02 · Non-EU Citizens</span>
            <h1 className="hero-title">
              Online Anmeldung is not available for non-EU citizens.
              <span className="accent">Here is what to do instead.</span>
            </h1>
            <p className="lede">Online Anmeldung exists. Non-EU citizens cannot use it. Here is exactly why — and your fastest path forward.</p>
          </div>
        </section>

        {/* Key facts */}
        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <a href="#sec-why" className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">01</text></svg>
                <div className="kf-num">Fact 01</div>
                <p className="kf-text">Online registration requires an EU/EEA eID card — non-EU passports don&apos;t qualify.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-inperson" className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">02</text></svg>
                <div className="kf-num">Fact 02</div>
                <p className="kf-text">You must register in person at a Bürgeramt. There is no workaround.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-inperson" className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">03</text></svg>
                <div className="kf-num">Fact 03</div>
                <p className="kf-text">Book your appointment first, then prepare your documents.</p>
                <span className="kf-arrow">↗</span>
              </a>
            </div>
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

        {/* 02 · Why online is blocked */}
        <section className="section" id="sec-why">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · Why online is blocked</div>
              <h2 className="h2">It comes down to one piece of <span className="accent">hardware.</span></h2>
              <p className="section-sub">Germany&apos;s online portal does not use a password or email login. It authenticates via the <strong>Online-Ausweis</strong> function — an NFC chip embedded in certain national identity cards. Non-EU passport holders cannot obtain this card. There is no software workaround.</p>
            </div>
            <div className="reveal mob-2col" style={{ marginBottom: 16 }}>
              <div className="card" style={{ borderColor: "var(--green-bd)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--green-tint)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <h4>Can use the online portal</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, marginBottom: 10 }}>German citizens and some EU/EEA nationals — <strong>only if</strong> their home country issues a compatible eID card <strong>and</strong> the Online-Ausweis chip is already activated. Most EU expats arriving fresh in Germany will not have this set up.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Germany", "Austria", "Belgium", "Estonia", "Finland", "Italy", "Netherlands", "Portugal", "Spain"].map(c => <span key={c} className="tag">{c}</span>)}
                  <span className="tag">+ others (chip must be activated)</span>
                </div>
              </div>
              <div className="card" style={{ borderColor: "#fecdd3" }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--rose-tint)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
                </div>
                <h4>Cannot use the online portal</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, marginBottom: 10 }}>All non-EU/EEA passport holders — no exceptions. This includes UK citizens since Brexit. The eID card cannot be issued on a foreign passport regardless of German visa status or length of stay.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["United States", "United Kingdom", "India", "Brazil", "Canada", "Australia", "South Africa", "Turkey"].map(c => <span key={c} className="tag bad">{c}</span>)}
                  <span className="tag bad">all other non-EU countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · 4 steps */}
        <section className="section" id="sec-inperson">
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
                <div key={s.n} className="card" style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 24, alignItems: "start" }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: "var(--blue)", letterSpacing: "-0.04em", paddingTop: 4 }}>{s.n}</div>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                    {s.link && (
                      <Link href={s.link} className="tag" style={{ textDecoration: "none", marginTop: 12, display: "inline-flex" }}>{s.lt}</Link>
                    )}
                  </div>
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
              <h3>The form is entirely in German. Every field. <span className="b">Arriving prepared makes the difference.</span></h3>
              <p>Bürgeramt clerks process registrations — they don't assist with form completion at the counter. A form with errors or missing information will need to be corrected and resubmitted, which usually means booking a new appointment. Getting it right the first time saves weeks.</p>
            </div>
          </div>
        </section>

        {/* 04 · Extra documents non-EU citizens need */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">04 · Extra documents</div>
              <h2 className="h2">Non-EU citizens need one <span className="accent">extra document.</span></h2>
              <p className="section-sub">EU citizens bring three documents. Non-EU citizens bring four: passport, Wohnungsgeberbestätigung, completed German form — plus their current visa or residence permit.</p>
            </div>
            <div className="reveal mob-2col" style={{ marginBottom: 16 }}>
              <div className="card" style={{ borderColor: "var(--green-bd)" }}>
                <div className="iconbox green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <h4>You already have a visa</h4>
                <p>Bring your passport with your valid national visa (D-Visum) or residence permit (Aufenthaltstitel). The clerk will check your visa status to confirm your right to reside in Germany.</p>
                <span className="tag" style={{ marginTop: 8, display: "inline-flex" }}>Straightforward</span>
              </div>
              <div className="card" style={{ borderColor: "#fde68a" }}>
                <div className="iconbox amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg></div>
                <h4>Your visa is being processed</h4>
                <p>If your residence permit is still being issued, bring your passport with entry stamp and any Fiktionsbescheinigung or Aufenthaltsgestattung issued to you. The Bürgeramt can still register you.</p>
                <span className="tag warn" style={{ marginTop: 8, display: "inline-flex" }}>Bring all paperwork</span>
              </div>
            </div>
            <div className="callout info reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
              <div>
                <div className="h">Just arrived — no German visa yet?</div>
                <div className="p">If you entered on a short-stay visa and your work or study visa application is pending, bring all paperwork you have and explain your situation. Berlin Bürgeramt clerks handle this regularly — they will advise on what is needed for your specific case.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 · Citizenship in German */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">05 · The form in German</div>
              <h2 className="h2">Citizenship must be in <span className="accent">German adjective form.</span></h2>
              <p className="section-sub">The Anmeldeformular requires a German citizenship adjective in the Staatsangehörigkeiten field — not your country name in English. Most non-EU nationalities have adjective forms that are not obvious to a non-German speaker.</p>
            </div>
            <div className="reveal" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ background: "var(--ink)", padding: "12px 20px" }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: 15 }}>Staatsangehörigkeiten — examples</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>German adjective form — not the country name</div>
              </div>
              <div className="citizen-table-grid" style={{ padding: "20px 20px 8px" }}>
                {[
                  { country: "United States", de: "amerikanisch" },
                  { country: "United Kingdom", de: "britisch" },
                  { country: "India", de: "indisch" },
                  { country: "Brazil", de: "brasilianisch" },
                  { country: "Canada", de: "kanadisch" },
                  { country: "Australia", de: "australisch" },
                  { country: "South Africa", de: "südafrikanisch" },
                  { country: "Turkey", de: "türkisch" },
                  { country: "China", de: "chinesisch" },
                ].map(r => (
                  <div key={r.country} style={{ paddingBottom: 12, borderBottom: "1px dashed var(--line)" }}>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, marginBottom: 3 }}>{r.country}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{r.de}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 20px 16px", fontSize: 13, color: "var(--ink-2)" }}>ReadyExpat translates your citizenship into the correct German adjective automatically. You answer in English — we handle every translation.</div>
            </div>
          </div>
        </section>

        {/* 06 · FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">06 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>Can any non-EU citizen do the Anmeldung online?</summary><div className="ans">No. The online portal requires an EU/EEA eID card (elektronischer Personalausweis) with the Online-Ausweis chip activated. Non-EU and non-EEA passport holders — including US, UK, Indian, Brazilian, Australian, Canadian — cannot obtain this card. There is no workaround.</div></details>
              <details><summary>What exactly is the eID card?</summary><div className="ans">Germany's online Anmeldung portal authenticates via the <em>Online-Ausweis</em> function — an NFC chip built into the German Personalausweis (issued to German citizens) and some EU/EEA national identity cards. The chip must be specifically activated; it is not enabled by default on all cards. Most EU expats arriving in Germany for the first time will not have this activated, even if their home country issues a compatible eID. Non-EU citizens cannot obtain this card at all.</div></details>
              <details><summary>Can I register online as a UK citizen?</summary><div className="ans">No. Following Brexit, the UK is not an EU or EEA member state and UK citizens are not eligible for the eID card. UK passport holders register in person at a Bürgeramt — same process as US, Indian, Brazilian, and other non-EU expats.</div></details>
              <details><summary>I already have a German address — can I change it online?</summary><div className="ans">Only if you hold a compatible eID card with the Online-Ausweis chip activated. This means the German Personalausweis (German citizens only) or a compatible EU/EEA national eID with the chip activated. If you are a non-EU citizen, you will never have this card. If you are an EU citizen but have not activated the Online-Ausweis function on your home-country eID, you cannot use the online portal either — registration in person applies to you too.</div></details>
              <details><summary>Which EU citizens can actually use the online Anmeldung?</summary><div className="ans">EU and EEA citizens whose home country issues a compatible national eID card — and only if the Online-Ausweis chip is specifically activated on that card. Compatible-issuing countries include Germany, Austria, Belgium, Estonia, Finland, Italy, Netherlands, Portugal, and Spain, among others. However, even for eligible EU citizens, the chip is not activated by default. An EU expat arriving in Germany for the first time will almost certainly not have this set up. The online portal is relevant for EU citizens doing an address change (Ummeldung) from an existing German address — not for first-time registration from abroad.</div></details>
              <details><summary>Does having a German residence permit let me register online?</summary><div className="ans">No. A German residence permit (Aufenthaltstitel) — whether a work visa, family reunion visa, Blue Card, or any other category — does not grant access to the online registration portal. The online portal requires a compatible eID card (the Online-Ausweis chip in a national identity card). A residence permit is a separate document and does not contain this chip.</div></details>
              <details><summary>What documents does a non-EU citizen need at the Bürgeramt?</summary><div className="ans">Four documents: (1) valid passport, (2) the completed Anmeldeformular in German — all 54 fields, (3) the Wohnungsgeberbestätigung signed by your landlord, and (4) your current visa or residence permit. If your visa is being processed, bring your entry stamp and any interim document you were issued (Fiktionsbescheinigung or Aufenthaltsgestattung). See the <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>full document checklist in guide 03</a> for a personalised list.</div></details>
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
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <GuidePageNav activeId="noneu" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
