import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { GuideByline } from "../components/guides/GuideByline";
import { RelatedGuides } from "../components/guides/RelatedGuides";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "The Complete Anmeldung Berlin Guide (2026) | ReadyExpat",
  description:
    "Everything you need to complete your Berlin Anmeldung in 2026. What it is, required documents, landlord confirmation, how to book a Bürgeramt appointment, and how to fill all 54 fields correctly in English.",
  alternates: { canonical: `${DOMAIN}/anmeldung-berlin-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "The Complete Anmeldung Berlin Guide (2026)",
    description:
      "Everything expats need to complete their Berlin Anmeldung in 2026 — documents, appointment hacks, the landlord form, and a pre-filled PDF tool.",
    url: `${DOMAIN}/anmeldung-berlin-guide`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungBerlinGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The Complete Anmeldung Berlin Guide (2026)",
        description:
          "Step-by-step guide to completing Berlin address registration in 2026. Covers what the Anmeldung is, required documents, the Wohnungsgeberbestätigung, how to book a Bürgeramt appointment, and how to fill all 54 form fields correctly in English.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-31",
        dateModified: "2026-05-31",
        mainEntityOfPage: `${DOMAIN}/anmeldung-berlin-guide`,
        about: { "@type": "Thing", name: "Anmeldung", description: "German mandatory address registration" },
      },
      {
        "@type": "HowTo",
        name: "How to complete the Anmeldung in Berlin (2026)",
        description: "Complete your Berlin address registration in 5 steps",
        estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
        totalTime: "PT30M",
        supply: [
          { "@type": "HowToSupply", name: "Valid passport or EU national ID card" },
          { "@type": "HowToSupply", name: "Wohnungsgeberbestätigung signed by landlord" },
          { "@type": "HowToSupply", name: "Completed Anmeldeformular (all 54 fields in German)" },
        ],
        step: [
          { "@type": "HowToStep", position: 1, name: "Get your Wohnungsgeberbestätigung", text: "Ask your landlord to sign the landlord confirmation form (Wohnungsgeberbestätigung) the day you move in. Without it the Bürgeramt will send you home. Many landlords include it in the move-in pack — if not, hand them the template from our guide." },
          { "@type": "HowToStep", position: 2, name: "Fill the Anmeldeformular", text: "Download the official form from service.berlin.de and complete all 54 fields in German. Name fields use your passport spelling. The Staatsangehörigkeit field requires the German adjective form of your nationality (e.g. amerikanisch, britisch, indisch). For Religionsgesellschaft write OA to make no church tax declaration." },
          { "@type": "HowToStep", position: 3, name: "Book a Bürgeramt appointment", text: "Go to service.berlin.de and select 'Anmeldung einer Wohnung'. Use 'Termin berlinweit suchen' to search all districts. New slots appear every Tuesday at 8:00 AM and sell out within 60 seconds — be on the portal before 8:00 and refresh immediately at 8:00." },
          { "@type": "HowToStep", position: 4, name: "Attend your appointment", text: "Bring: passport, completed Anmeldeformular, and Wohnungsgeberbestätigung. Non-EU citizens bring their current visa too. The appointment takes 5–10 minutes if your documents are complete." },
          { "@type": "HowToStep", position: 5, name: "Receive your Anmeldebestätigung", text: "The clerk prints your Anmeldebestätigung (registration certificate) on the spot. Use it to open a bank account, register for health insurance, and receive your Steuer-ID by post within 2–4 weeks." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Anmeldung in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "The Anmeldung is Germany's mandatory address registration. Under §17 Bundesmeldegesetz, every person taking up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in. In Berlin this means booking an appointment at any of the city's Bürgerämter and attending in person with your passport, completed Anmeldeformular, and the signed Wohnungsgeberbestätigung from your landlord." },
          },
          {
            "@type": "Question",
            name: "How long do I have to do the Anmeldung in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "You have 14 days from the day you move in. However, Bürgeramt appointments in Berlin routinely take 3–6 weeks to become available — well beyond the 14-day window. Book the earliest available slot immediately on arrival, take a screenshot showing you searched, and you will not be fined. The city is aware of the appointment shortage." },
          },
          {
            "@type": "Question",
            name: "What documents do I need for the Berlin Anmeldung?",
            acceptedAnswer: { "@type": "Answer", text: "Three documents are required: (1) a valid passport or EU national ID card, (2) the completed Anmeldeformular with all 54 fields filled in German, and (3) the Wohnungsgeberbestätigung — the landlord confirmation form signed by your landlord or sublessor. Non-EU citizens should also bring their current visa or residence permit. Missing any single document means you will be sent home to rebook." },
          },
          {
            "@type": "Question",
            name: "Do I need an appointment for the Bürgeramt in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "Yes. service.berlin.de states 'Ohne Termin erfolgt keine Bearbeitung' — without an appointment, no service. Walk-ins are not officially accepted. Book via service.berlin.de, search all districts with 'Termin berlinweit suchen', and check on Tuesdays at 8:00 AM when new slots are released." },
          },
          {
            "@type": "Question",
            name: "What happens after the Anmeldung?",
            acceptedAnswer: { "@type": "Answer", text: "You receive the Anmeldebestätigung (registration certificate) on the spot. Your Steuer-ID (tax identification number) arrives by post within 2–4 weeks. You will also receive a Rundfunkbeitrag letter (€18.36/month public broadcasting fee) — this is mandatory and not optional. You can now open a German bank account, register for health insurance, and set up utilities." },
          },
          {
            "@type": "Question",
            name: "Can I fill the Anmeldung form in English?",
            acceptedAnswer: { "@type": "Answer", text: "No. The Bürgeramt only accepts the German form. Your name fields use your passport spelling, but all other fields — marital status, gender, religion, citizenship — must use the correct German terms. Staatsangehörigkeit requires the German adjective form of your nationality: amerikanisch for American, britisch for British, indisch for Indian." },
          },
          {
            "@type": "Question",
            name: "What is the Wohnungsgeberbestätigung?",
            acceptedAnswer: { "@type": "Answer", text: "The Wohnungsgeberbestätigung is the landlord confirmation form required by §19 Bundesmeldegesetz. Your landlord or sublessor must sign it confirming that you have moved into the property. It must include: landlord name and address, tenant name, property address, and move-in date. Without it the Bürgeramt cannot register you. A landlord who refuses to provide it faces a fine of up to €1,000." },
          },
          {
            "@type": "Question",
            name: "How much does the Anmeldung cost?",
            acceptedAnswer: { "@type": "Answer", text: "The Anmeldung itself is completely free. The only costs are optional: printing the form (€0.10–0.15 per page at DM or Rossmann) and, if you choose to use a form-filling service, that service fee." },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung Berlin Guide", item: `${DOMAIN}/anmeldung-berlin-guide` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="anmeldung" />

      <main className="main">
        {/* Hero */}
        <section
          className="hero"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1920&q=80&auto=format')" }}
        >
          <div className="wrap">
            <div className="crumbs">
              <a href="/">ReadyExpat</a>
              <span className="sep">→</span>
              <span className="here">Anmeldung Berlin Guide</span>
            </div>
            <span className="pill"><span className="dot" />Complete Guide · 2026</span>
            <h1 className="hero-title">
              The Complete Anmeldung Berlin Guide
              <span className="accent">Everything you need to register your address in 2026.</span>
            </h1>
            <GuideByline updated="May 2026" />
          </div>
        </section>

        {/* Key facts */}
        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <a href="#sec-what" className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">01</text></svg>
                <div className="kf-num">Fact 01</div>
                <p className="kf-text">Register within 14 days of moving in (§17 BMG). Fine up to €1,000.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-docs" className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">02</text></svg>
                <div className="kf-num">Fact 02</div>
                <p className="kf-text">3 documents required. Missing one means you are sent home to rebook.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-appt" className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">03</text></svg>
                <div className="kf-num">Fact 03</div>
                <p className="kf-text">New Bürgeramt slots drop every Tuesday at 8:00 AM — gone in 60 seconds.</p>
                <span className="kf-arrow">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 01 · What is it */}
        <section className="section" id="sec-what">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/what-is-anmeldung" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Full explainer →</Link>
              <Link href="/anmeldung-deadline-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>14-Day Deadline →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">01 · What is it</div>
              <h2 className="h2">Germany&apos;s mandatory address <span className="accent">registration.</span></h2>
              <p className="section-sub">The Anmeldung is not optional. Every person taking up residence in Germany must register at the local Bürgeramt within 14 days of moving in — required by §17 Bundesmeldegesetz.</p>
            </div>
            <div className="darkbox reveal">
              <div className="mob-2col-wide">
                <div>
                  <div className="eyebrow">What you get</div>
                  <h3 style={{ marginTop: 14 }}>The <span className="b">Anmeldebestätigung</span> — printed on the spot at the counter.</h3>
                  <p style={{ marginTop: 16 }}>This one-page stamped certificate unlocks everything you need to live and work in Berlin legally.</p>
                </div>
                <div className="mob-no-border-left" style={{ paddingTop: 6, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 48 }}>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Unlocks</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {["Bank account", "Steuer-ID", "Health insurance", "Residence permit", "Payroll"].map((w) => (
                      <span key={w} style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(0,117,255,.18)", border: "1px solid rgba(0,117,255,.35)", color: "#c5cee5", fontSize: 13, fontWeight: 700 }}>{w}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
                    <svg style={{ flexShrink: 0, marginTop: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span style={{ color: "#8e9bbe", fontSize: 13.5, lineHeight: 1.55 }}>No exemptions based on nationality or visa type. Everyone registers.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="callout warn reveal" style={{ marginTop: 18 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">No Anmeldung → no Steuer-ID → Steuerklasse 6 on your payslip.</div>
                <div className="p">The Steuer-ID arrives 2–4 weeks <em>after</em> registration. Without it, payroll defaults to Germany&apos;s emergency tax bracket — roughly €600/month extra deducted on a €4,500 salary. You get it back via your tax return, but not until the following year.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Documents */}
        <section className="section" id="sec-docs">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/anmeldung-documents" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Full checklist →</Link>
              <Link href="/wohnungsgeberbestaetigung" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Landlord form →</Link>
              <Link href="/anmeldung-mistakes-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Common mistakes →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">02 · Documents</div>
              <h2 className="h2">Three documents. <span className="accent">All mandatory.</span></h2>
              <p className="section-sub">Prepare everything before booking your appointment. Missing a single document means the clerk sends you home — and your next slot could be weeks away.</p>
            </div>
            <div className="reveal mob-3col" style={{ marginBottom: 16 }}>
              {[
                { num: "1", title: "Passport / national ID", body: "EU/EEA citizens may use a national ID card. Non-EU citizens must bring their passport. Bring your current visa or residence permit too if you have one.", tag: "Identity", color: "blue", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10h.01M8 14h8M8 17h5"/></svg> },
                { num: "2", title: "Wohnungsgeberbestätigung", body: "Landlord confirmation form signed by your landlord. Required by §19 BMG. Many landlords include it in the move-in pack — if not, download the template.", tag: "Landlord signs", color: "amber", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg> },
                { num: "3", title: "Completed Anmeldeformular", body: "54 fields, all in German. Download from service.berlin.de or use ReadyExpat to fill it in English and get a correct German PDF in 5 minutes.", tag: "54 fields · German only", color: "green", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              ].map((c) => (
                <div key={c.num} className="wi-card" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className={`ib iconbox ${c.color}`}>{c.icon}</div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{c.title}</h4>
                  <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{c.body}</p>
                  <span className="tag" style={{ alignSelf: "flex-start", marginTop: "auto" }}>{c.tag}</span>
                </div>
              ))}
            </div>
            <div className="callout bad reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">A rental contract does not substitute for the Wohnungsgeberbestätigung.</div>
                <div className="p">The Bürgeramt will not accept an email, a key receipt, or a signed lease as a substitute. The <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Wohnungsgeberbestätigung</a> is a specific form with specific fields. If your landlord refuses to sign it, they face a fine of up to €1,000 — tell them that.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · Form fields */}
        <section className="section" id="sec-form">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/anmeldung-berlin-english" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>All 54 fields in English →</Link>
              <Link href="/anmeldung-mistakes-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Mistakes to avoid →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">03 · The form</div>
              <h2 className="h2">54 fields. <span className="accent">All in German.</span></h2>
              <p className="section-sub">The official Anmeldeformular is only available in German. The Bürgeramt will not accept an English version. These are the fields that catch most expats out.</p>
            </div>
            <div className="timeline reveal">
              {[
                { n: "!", h: "Staatsangehörigkeiten — citizenship", p: "Must be the German adjective form: amerikanisch, britisch, indisch. Writing 'American', 'USA', or 'US' is wrong and may be rejected." },
                { n: "!", h: "Religionsgesellschaft — church tax trap", p: "Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — 8–9% of your income tax added automatically. Write OA (Ohne Angabe) to opt out. See Guide 01 for the full explanation." },
                { n: "!", h: "Familienstand — marital status", p: "Must be German: ledig (single), verheiratet (married), geschieden (divorced), verwitwet (widowed). English values are rejected." },
                { n: "!", h: "Tag des Einzugs — move-in date", p: "Format: DD.MM.YYYY only. American MM/DD/YYYY causes errors. Always zero-pad: 01.06.2026 not 1.6.2026." },
              ].map((s) => (
                <div key={s.h} className="step"><div className="num">{s.n}</div><h5>{s.h}</h5><p>{s.p}</p></div>
              ))}
            </div>
            <div className="callout ok reveal" style={{ marginTop: 24 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div>
              <div>
                <div className="h">ReadyExpat fills all 54 fields correctly in German.</div>
                <div className="p">Answer 7 questions in English. We handle every translation — citizenship adjectives, date format, marital status — and generate a ready-to-print PDF. €15 one-time. <a href="/" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Prepare My Anmeldung →</a></div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 · Appointment */}
        <section className="section" id="sec-appt">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/burgeramt-berlin-appointment" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Full appointment guide →</Link>
              <Link href="/anmeldung-deadline-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>14-Day Deadline →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">04 · Booking the appointment</div>
              <h2 className="h2">Slots vanish in <span className="accent">60 seconds.</span></h2>
              <p className="section-sub">Walk-ins are not accepted — service.berlin.de is explicit: <em>&ldquo;Ohne Termin erfolgt keine Bearbeitung.&rdquo;</em> Here is exactly how to get a slot.</p>
            </div>
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { color: "var(--blue)", bg: "#eef2ff", bd: "#bfdbfe", label: "HACK 01", title: "Tuesday 8:00 AM", body: "New slots release every Tuesday at 8:00 AM on service.berlin.de. Be on the portal before 8:00 and refresh the moment the clock hits 8:00. Gone in under 60 seconds." },
                { color: "var(--green)", bg: "var(--green-tint)", bd: "var(--green-bd)", label: "HACK 02", title: "Search Berlin-wide", body: "Use 'Termin berlinweit suchen' — do not restrict to your local district. An appointment in Spandau or Marzahn is legally identical to one in Mitte." },
                { color: "var(--amber)", bg: "var(--amber-tint)", bd: "#fde68a", label: "HACK 03", title: "Call 115 at 7:00 AM", body: "Operators can sometimes book same-day cancellations not visible in the online portal. Call early, have your address and ID details ready." },
                { color: "var(--purple)", bg: "#f3e8ff", bd: "#d8b4fe", label: "HACK 04", title: "Outer districts", body: "Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf consistently have more availability than central offices. Worth the U-Bahn journey." },
              ].map((h) => (
                <div key={h.label} style={{ padding: "22px 24px", borderRadius: 18, border: `1.5px solid ${h.bd}`, background: h.bg }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 800, color: h.color, letterSpacing: ".14em", marginBottom: 3 }}>{h.label}</div>
                  <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 8 }}>{h.title}</div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{h.body}</p>
                </div>
              ))}
            </div>
            <div className="callout info reveal" style={{ marginTop: 18 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
              <div>
                <div className="h">No slots before your 14-day deadline?</div>
                <div className="p">Book the earliest available slot — even 4–5 weeks out. Take a screenshot of the portal showing no earlier availability. Keep it. You will not be fined if you have that screenshot. See <a href="/anmeldung-deadline-berlin" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>the full deadline guide</a> for what actually happens.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 · At the appointment */}
        <section className="section" id="sec-counter">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/anmeldung-couple-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Couples &amp; families →</Link>
              <Link href="/anmeldung-online-non-eu" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Online Anmeldung →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">05 · At the counter</div>
              <h2 className="h2">5–10 minutes. <span className="accent">If your documents are complete.</span></h2>
              <p className="section-sub">The appointment is fast when everything is in order. The Anmeldebestätigung prints on the spot. One appointment covers the entire household if everyone attends together.</p>
            </div>
            <div className="timeline reveal">
              {[
                { n: "1", h: "Hand over all documents", p: "Passport, Wohnungsgeberbestätigung, completed Anmeldeformular. Non-EU citizens: bring current visa too. The clerk checks everything before touching the keyboard." },
                { n: "2", h: "Clerk enters your data", p: "The Meldebehörde records you as resident at this address from the move-in date on your form." },
                { n: "3", h: "Anmeldebestätigung prints", p: "Official proof of registration. Stamped and signed on the spot. This is what you need for your bank account and health insurance." },
                { n: "4", h: "Check before you leave", p: "Verify your name spelling, registered address, and move-in date before walking out. Corrections are much harder after the fact." },
              ].map((s) => (
                <div key={s.n} className="step"><div className="num">{s.n}</div><h5>{s.h}</h5><p>{s.p}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 · After */}
        <section className="section" id="sec-after">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">06 · After registration</div>
              <h2 className="h2">What arrives in the <span className="accent">weeks after.</span></h2>
            </div>
            <div className="reveal wi-card mob-2col-feat" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, padding: 24, marginBottom: 16 }}>
              <div>
                <div className="ib iconbox blue" style={{ marginBottom: 14 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <h4 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Steuer-ID · Tax number</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>Arrives by post 2–4 weeks after registration. Up to 8 weeks during the peak September relocation season. Without it, your employer taxes you at Steuerklasse 6 — the emergency bracket.</p>
                <span className="tag warn" style={{ marginTop: 10, display: "inline-flex" }}>Arrives by post only</span>
              </div>
              <div>
                <div className="ib iconbox amber" style={{ marginBottom: 14 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11 19.79 19.79 0 0 1 1.61 2.4 2 2 0 0 1 3.6.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <h4 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Rundfunkbeitrag letter</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>€18.36 per month per household — Germany&apos;s public broadcasting fee. Not optional. One letter covers all devices. Arrives within weeks of registration from ARD ZDF Deutschlandradio Beitragsservice.</p>
                <span className="tag bad" style={{ marginTop: 10, display: "inline-flex" }}>Mandatory · €18.36/month</span>
              </div>
            </div>
            <div className="callout ok reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></div>
              <div>
                <div className="h">Label your letterbox (Briefkasten) on day one.</div>
                <div className="p">Your Steuer-ID arrives by post. Official German mail is not delivered to unlabelled mailboxes. If your surname isn&apos;t on the box, letters get returned — including your Steuer-ID.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 · Online */}
        <section className="section" id="sec-online">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/anmeldung-online-non-eu" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>Online eligibility guide →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">07 · Online Anmeldung</div>
              <h2 className="h2">Only for EU eID holders <span className="accent">changing address.</span></h2>
              <p className="section-sub">Online registration is only available under very specific conditions — and first-time registrations are never eligible.</p>
            </div>
            <div className="reveal mob-2col-feat" style={{ gap: 14, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 24, borderRadius: 18, background: "var(--green-tint)", border: "1.5px solid var(--green-bd)" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--green)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>Eligible</div>
                {["Already registered at a German address", "EU/EEA national ID with chip activated", "Compatible NFC card reader available", "Changing address (Ummeldung only)"].map(i => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 14, color: "var(--ink-2)" }}><span style={{ color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>✓</span>{i}</div>
                ))}
              </div>
              <div style={{ padding: 24, borderRadius: 18, background: "var(--rose-tint)", border: "1.5px solid #fecdd3" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--rose)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>Not eligible</div>
                {["First-time registration in Germany", "US, UK, Indian, Brazilian passport holders", "Any non-EU/EEA nationality", "No eID chip or no card reader"].map(i => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 14, color: "var(--ink-2)" }}><span style={{ color: "var(--rose)", fontWeight: 700, flexShrink: 0 }}>✗</span>{i}</div>
                ))}
              </div>
            </div>
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
              {[
                { q: "What fine do I get for late Anmeldung?", a: "Technically up to €1,000 under §54 BMG. In practice, fines are extremely rare for first-time registrants who book an appointment promptly — the appointment backlog is well known to city authorities. Book as soon as you arrive and keep your booking screenshot." },
                { q: "Do I need a permanent address to do the Anmeldung?", a: "Yes — you need a fixed address with a landlord willing to sign the Wohnungsgeberbestätigung. You cannot register at a hotel or Airbnb. Some expats register at a friend's address temporarily while apartment hunting — legally permissible with the friend's permission." },
                { q: "Can my partner register me by proxy?", a: "Yes, with a written Vollmacht (power of attorney) and a copy of your passport. The person attending must also bring their own ID. Children do not need to attend — a parent registers them at the same appointment." },
                { q: "What is the Rundfunkbeitrag?", a: "Germany's public broadcasting fee — €18.36 per month per household. Not optional. You receive a letter from ARD ZDF Deutschlandradio Beitragsservice within weeks of registering. One fee covers all devices in your household." },
                { q: "Do I need to de-register (Abmeldung) when I leave Berlin?", a: "Yes, if leaving Germany entirely — file an Abmeldung at the Bürgeramt one to two weeks before departure. Moving to a different German address means filing a new Anmeldung at your new address instead; no separate Abmeldung needed." },
                { q: "Can I register if I'm in a shared flat (WG)?", a: "Yes. Your Hauptmieter (the primary tenant) acts as your Wohnungsgeber and signs the confirmation form. You register at the shared apartment address. This is the standard situation for WG residents." },
              ].map(({ q, a }) => (
                <details key={q}><summary>{q}</summary><div className="ans">{a}</div></details>
              ))}
            </div>
            <div className="callout info reveal" style={{ marginTop: 24 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
              <div>
                <div className="h">20 more questions answered in the ReadyExpat FAQ.</div>
                <div className="p"><a href="/faq" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>See all 20 questions →</a> — covering couples, children, subletting, religion field, Kirchensteuer, and more.</div>
              </div>
            </div>
            <div style={{ marginTop: 32, padding: "24px 28px", borderRadius: 18, background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", color: "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 8 }}>Skip the translation headache</div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 14px" }}>Answer 7 questions in English. ReadyExpat fills all 54 fields correctly in German and generates a ready-to-print PDF. Takes 5 minutes. €15 one-time — no subscription, no account needed.</p>
              <a href="/" style={{ display: "inline-block", background: "#0075FF", color: "#fff", fontWeight: 700, padding: "0.6rem 1.3rem", borderRadius: 8, textDecoration: "none", fontSize: "0.9rem" }}>Prepare My Anmeldung →</a>
            </div>
            <div className="legal">This guide is for general information only. Always verify current requirements at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a>.</div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <RelatedGuides excludeId="anmeldung" />
          </div>
        </section>
      </main>
    </div>
  );
}
