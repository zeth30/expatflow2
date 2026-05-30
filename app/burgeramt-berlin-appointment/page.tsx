import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "How to Get a Bürgeramt Berlin Appointment — Hacks That Actually Work (2026)",
  description:
    "Berlin Bürgeramt appointments vanish in seconds. Here is exactly how to find a slot in 2026 — the Tuesday trick, walk-in options, the 115 hotline, and what to do when there are no slots before your 14-day deadline.",
  alternates: { canonical: `${DOMAIN}/burgeramt-berlin-appointment` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Book a Bürgeramt Appointment in Berlin (2026)",
    description: "Berlin Bürgeramt slots vanish in seconds. Here is exactly how to find one — including the Tuesday trick, walk-in options, and what to do if there are no slots before your 14-day deadline.",
    url: `${DOMAIN}/burgeramt-berlin-appointment`,
    siteName: "ReadyExpat Berlin",
    type: "article",
  },
};

export default function BurgeramtBerlinAppointment() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Book a Bürgeramt Appointment in Berlin (2026)",
        description: "Berlin Bürgeramt appointments book out 3–6 weeks in advance. Here is exactly how to find a slot, what to do if there are none, and how to prepare once you have one.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin" },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-01",
        dateModified: "2026-05-14",
        mainEntityOfPage: `${DOMAIN}/burgeramt-berlin-appointment`,
      },
      {
        "@type": "HowTo",
        name: "How to book a Bürgeramt Anmeldung appointment in Berlin",
        step: [
          { "@type": "HowToStep", position: 1, name: "Go to service.berlin.de", text: "The official Berlin appointment portal. Select 'Anmeldung einer Wohnung' from the service list." },
          { "@type": "HowToStep", position: 2, name: "Check Berlin-wide", text: "Use 'Termin berlinweit suchen' — do not restrict to your local district. An appointment in any district is legally identical." },
          { "@type": "HowToStep", position: 3, name: "Check at 8:00 AM on Tuesdays", text: "New appointment slots are released every Tuesday at 8:00 AM. They sell out within 60 seconds. Be on the portal before 8:00 AM." },
          { "@type": "HowToStep", position: 4, name: "Attend with complete documents", text: "Bring your passport, Wohnungsgeberbestätigung, and completed Anmeldeformular in German. Having all documents ready ensures the process goes smoothly." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "When are new Bürgeramt appointment slots released in Berlin?", acceptedAnswer: { "@type": "Answer", text: "New appointment slots are released every Tuesday at 8:00 AM on service.berlin.de. They sell out within 60 seconds. Be on the portal before 8:00 AM and refresh immediately at 8:00." } },
          { "@type": "Question", name: "Can I do walk-in Anmeldung in Berlin without an appointment?", acceptedAnswer: { "@type": "Answer", text: "Officially, no. service.berlin.de states 'Ohne Termin erfolgt keine Bearbeitung' — without an appointment, no service. Some expats report that individual clerks at certain offices exercise discretion in genuine emergencies, but this is not guaranteed and is not an official procedure. Book an appointment via service.berlin.de. If your 14-day deadline is genuinely about to expire, call 115 first." } },
          { "@type": "Question", name: "What if there are no Bürgeramt appointments before my 14-day deadline?", acceptedAnswer: { "@type": "Answer", text: "Book the earliest available slot — even if it is 4–5 weeks away. Take a screenshot proving you searched and found no earlier availability. Keep that screenshot. You will not be fined if you have evidence the system had no earlier slots." } },
          { "@type": "Question", name: "Which Berlin districts have the most Bürgeramt availability?", acceptedAnswer: { "@type": "Answer", text: "Outer districts — Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf — consistently have more slots available than central offices like Mitte or Charlottenburg. The appointment is legally identical regardless of district." } },
          { "@type": "Question", name: "How long does a Bürgeramt Anmeldung appointment take?", acceptedAnswer: { "@type": "Answer", text: "5–10 minutes when your documents are complete. The clerk verifies each field, confirms the address, and prints your Anmeldebestätigung/Meldebestätigung on the spot. Missing any document means you are sent home immediately." } },
          { "@type": "Question", name: "Can I do Anmeldung online as an Indian, American, or British citizen?", acceptedAnswer: { "@type": "Answer", text: "No. Online Anmeldung requires an EU/EEA eID card with the Online-Ausweis chip activated. Indian, American, British, and all other non-EU passport holders cannot obtain this card. Registration is always in person at the Bürgeramt." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "How to Book a Bürgeramt Appointment in Berlin", item: `${DOMAIN}/burgeramt-berlin-appointment` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="termin" />

      <main className="main">
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552553302-9211bf7f7053?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Bürgeramt Appointment</span>
            </div>
            <span className="pill info"><span className="dot" />Guide 05 · Bürgeramt Appointment</span>
            <h1 className="hero-title">
              How to book a Bürgeramt appointment in Berlin.
              <span className="accent">Slots vanish in 60 seconds.</span>
            </h1>
            <p className="lede">Appointments book out 3–6 weeks in advance. Here is exactly when new slots appear, where to look, and what to do when the portal shows nothing. Before booking, make sure you have your <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "none" }}>documents ready</a> — missing one means losing your slot. Non-EU citizens: <a href="/anmeldung-online-non-eu" style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "none" }}>online Anmeldung is not available to you</a>.</p>
          </div>
        </section>

        {/* Key facts */}
        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <a href="#sec-hacks" className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">01</text></svg>
                <div className="kf-num">Fact 01</div>
                <p className="kf-text">Slots on service.berlin.de appear Tuesdays at 8:00 AM and vanish in under 60 seconds.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-walkin" className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">02</text></svg>
                <div className="kf-num">Fact 02</div>
                <p className="kf-text">No appointment = no service. Walk-ins are officially not accepted.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="#sec-hacks" className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">03</text></svg>
                <div className="kf-num">Fact 03</div>
                <p className="kf-text">Call 115 at 7:00 AM for same-day cancellation slots.</p>
                <span className="kf-arrow">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 01 · Where to book */}
        <section className="section">
          <div className="wrap">
            <div style={{ margin: "0 0 24px", padding: "14px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "#15803d", fontWeight: 600 }}>New to Berlin? Start with the full registration guide.</span>
              <Link href="/moving-to-berlin-registration" style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", textDecoration: "none", whiteSpace: "nowrap" }}>Moving to Berlin guide →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">01 · Where to book</div>
              <h2 className="h2">One official portal. <span className="accent">No alternatives.</span></h2>
            </div>

            <div className="card reveal" style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--blue)", display: "grid", placeItems: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: 18, marginBottom: 4 }}><a href="https://service.berlin.de" target="_blank" rel="noopener" style={{ color: "var(--blue)", textDecoration: "none" }}>service.berlin.de</a></h4>
                  <p style={{ marginBottom: 0 }}>The official Berlin appointment portal. Select <strong>"Anmeldung einer Wohnung"</strong> from the service list. Choose how many people you are registering — one appointment covers the whole household if everyone attends together.</p>
                </div>
              </div>
            </div>

            <div className="callout warn reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">Third-party appointment services are not official</div>
                <div className="p">Various companies sell "appointment slots." These are not official — they hoard slots and resell them. Use only service.berlin.de. Call 115 if the portal shows nothing useful.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Booking hacks */}
        <section className="section" id="sec-hacks">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · The strategies that work</div>
              <h2 className="h2">Four hacks. <span className="accent">All free.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="reveal">
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>,
                  color: "var(--blue)", bg: "#eef2ff", bd: "#bfdbfe",
                  label: "HACK 01", title: "Tuesday 7:55 AM",
                  body: "New appointment slots are released every Tuesday at 8:00 AM on service.berlin.de. They sell out within 60 seconds. Open the portal before 8:00 AM, have your details ready, and refresh the moment the clock hits 8:00.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
                  color: "var(--green)", bg: "var(--green-tint)", bd: "var(--green-bd)",
                  label: "HACK 02", title: "Search Berlin-wide",
                  body: "Use \"Termin berlinweit suchen\" — do not restrict to your local district. An appointment in Spandau, Marzahn, or Reinickendorf is legally identical to one in Mitte. The Anmeldebestätigung/Meldebestätigung is the same document regardless of which office issues it.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11 19.79 19.79 0 0 1 1.61 2.4 2 2 0 0 1 3.6.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  color: "var(--amber)", bg: "var(--amber-tint)", bd: "#fde68a",
                  label: "HACK 03", title: "Call 115 at 7 AM",
                  body: "Call 115 — Berlin's unified service number — early in the morning. Operators can sometimes book same-day cancellations that do not appear in the online system. Call in German if you can, or ask a German-speaking friend to help. Have your address and ID details ready.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  color: "var(--purple)", bg: "#f3e8ff", bd: "#d8b4fe",
                  label: "HACK 04", title: "Target outer districts",
                  body: "Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf consistently have more availability than central offices. Set your district filter to these areas and check daily. The U-Bahn journey is worth it.",
                },
              ].map((h) => (
                <div key={h.label} style={{ padding: "22px 24px", borderRadius: 18, border: `1.5px solid ${h.bd}`, background: h.bg }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", flexShrink: 0, background: "white", color: h.color }}>{h.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 800, color: h.color, letterSpacing: ".14em", marginBottom: 3 }}>{h.label}</div>
                      <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 8 }}>{h.title}</div>
                      <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{h.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 · Walk-in — reality check */}
        <section className="section" id="sec-walkin">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · Walk-in — last resort</div>
              <h2 className="h2">Walk-ins are <span className="accent">not officially accepted.</span></h2>
              <p className="section-sub">service.berlin.de is explicit: <em>&ldquo;Ohne Termin erfolgt keine Bearbeitung&rdquo;</em> — without an appointment, no service. This applies to all Berlin Bürgeramt offices for Anmeldung.</p>
            </div>
            <div className="callout warn reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">Do not plan around walk-ins</div>
                <div className="p">Some expat forums list Tempelhof and Mitte as &ldquo;walk-in friendly.&rdquo; This information is outdated. The official position is that appointment-free walk-ins for Anmeldung are not processed. Showing up without a slot will most likely result in being turned away. Use the strategies in section 02 — the 115 hotline can sometimes unlock same-day cancellations in genuine deadline emergencies.</div>
              </div>
            </div>
            <div className="callout info reveal" style={{ marginTop: 14 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
              <div>
                <div className="h">Deadline about to expire?</div>
                <div className="p">Call 115 at 7 AM and explain your situation — operators occasionally have access to same-day cancellations not visible in the online system. Then book the next available online slot as a backup and take a screenshot showing you searched. That screenshot protects you if the fine question ever arises.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 14-day reality check */}
        <section className="section">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="eyebrow">No slots before your deadline?</div>
              <h3>Book the furthest slot. <span className="b">Screenshot everything.</span></h3>
              <p>This happens regularly. The appointment system often cannot accommodate demand within the legal 14-day window — the authorities know this. Book the earliest available slot even if it is 4–5 weeks away. Take a screenshot showing you searched and found nothing earlier. Keep that screenshot. You will not be fined if you have documented evidence that the system had no earlier availability.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                {[
                  "Book the earliest available slot — even if it is weeks away",
                  "Screenshot the portal showing you searched and found nothing earlier",
                  "Keep the screenshot — it is your evidence if questions arise",
                  "14-day clock runs from your move-in date, not lease signing",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center", flexShrink: 0, color: "white", fontWeight: 800, fontSize: 11 }}>{i + 1}</div>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 04 · At the appointment */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">04 · At the appointment</div>
              <h2 className="h2">Five minutes when your <span className="accent">documents are right.</span></h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="reveal">
              {[
                { n: "1", title: "Arrive on time", body: "Late arrivals lose their slot. The clerk may give it to the next person. Arrive 5 minutes early. Check the building layout — some Bürgeramt offices are multi-floor." },
                { n: "2", title: "Take a number at the terminal", body: "Most offices use an electronic queue system. Select \"Anmeldung\" and take your ticket. Wait until your number appears on the display." },
                { n: "3", title: "Hand over your documents", body: "These are the core documents: passport, Wohnungsgeberbestätigung, and your completed Anmeldeformular in German. Others may apply depending on your situation — non-EU citizens also need a visa or residence permit, married couples a marriage certificate, families with children a birth certificate per child." },
                { n: "4", title: "Clerk processes in 3–5 minutes", body: "They verify each field, confirm the address matches, and enter it into the system. Clerks focus on processing, not on helping you fill in the form — which is why arriving prepared matters." },
                { n: "5", title: "Receive your Anmeldebestätigung/Meldebestätigung", body: "They print your registration confirmation on the spot. Check your name, exact address, and move-in date before you leave. Corrections require a new appointment." },
              ].map((s) => (
                <div key={s.n} className="card" style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--ink)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <span style={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: "-0.04em" }}>{s.n}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: 18, overflowWrap: "break-word" }}>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="callout info reveal" style={{ marginTop: 24 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
              <div>
                <div className="h">Not sure which documents apply to your situation?</div>
                <div className="p" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span>The full personalised checklist — including situation-specific extras for non-EU citizens, married couples, and families — is in guide 03.</span>
                  <a href="/anmeldung-documents" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--blue)", color: "white", borderRadius: 999, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                    See full checklist →
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }} className="reveal">
              <div className="callout warn">
                <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
                <div>
                  <div className="h">Arrive with a complete, correct form</div>
                  <div className="p">Clerks are there to process registrations, not to assist with form completion. A form with errors or missing fields will need to be corrected before it can be accepted — so it pays to double-check everything at home first.</div>
                </div>
              </div>
              <div className="callout info">
                <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12h18M9 16h2"/></svg></div>
                <div>
                  <div className="h">Print your form before you leave home</div>
                  <div className="p">DM or Rossmann self-service kiosks print for ~€0.10–0.15/page. The Bürgeramt does not accept phone screens. Sign the form after printing — never before.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What they reject */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Common failures</div>
              <h2 className="h2">What the clerk will <span className="accent">not accept.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="reveal">
              {[
                "Any field left blank on the Anmeldeformular",
                "Any entry in English — every field must be in German",
                "Wrong date format — use DD.MM.YYYY, not MM/DD/YYYY",
                "Displaying the form on a phone — it must be printed on paper",
                "A missing or unsigned Wohnungsgeberbestätigung",
                "A pre-signed printed form — sign after printing, with a pen",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 18px", borderRadius: 12, border: "1.5px solid #fecdd3", background: "var(--rose-tint)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">05 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>When are new Berlin Bürgeramt appointment slots released?</summary><div className="ans">New appointment slots are released every Tuesday at 8:00 AM on service.berlin.de. They sell out within 60 seconds. Be on the portal before 8:00 AM, have the Anmeldung service pre-selected, and refresh immediately when the clock hits 8:00. You should also <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>prepare your documents</a> before booking so you are ready for any slot that appears.</div></details>
              <details><summary>Can I do walk-in Anmeldung in Berlin without an appointment?</summary><div className="ans">No. service.berlin.de is explicit: <em>&ldquo;Ohne Termin erfolgt keine Bearbeitung&rdquo;</em> — without an appointment, no service. This applies to all Berlin Bürgeramt offices. Expat forums listing Tempelhof or Mitte as walk-in friendly are outdated. If your 14-day deadline is genuinely about to expire, call 115 at 7 AM — operators can sometimes book same-day cancellations not visible online. Book the next available slot as a backup and keep a screenshot as evidence.</div></details>
              <details><summary>What if there are no Bürgeramt appointments before my 14-day deadline?</summary><div className="ans">This is common in Berlin. Book the earliest available slot — even if it is 4–5 weeks away. Take a screenshot of the booking portal showing you searched and found nothing earlier. Keep that screenshot as evidence. You will not be fined if you have documentation that the system had no earlier availability. For background on the 14-day rule, see <a href="/what-is-anmeldung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 01</a>.</div></details>
              <details><summary>How long does a Bürgeramt Anmeldung appointment take?</summary><div className="ans">5–10 minutes when your documents are complete. The clerk verifies each field, confirms the address, and prints your Anmeldebestätigung/Meldebestätigung on the spot. If anything is wrong or missing, they send you home immediately — no partial processing, no coming back later.</div></details>
              <details><summary>Which Berlin district has the most Bürgeramt appointment availability?</summary><div className="ans">Outer districts — Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf — consistently have more availability than central offices. Use "Termin berlinweit suchen" to search all districts at once. The appointment is legally identical regardless of which district processes it.</div></details>
              <details><summary>Can I do Anmeldung online as an Indian, American, or British citizen?</summary><div className="ans">No. Online Anmeldung requires an EU/EEA eID card with the Online-Ausweis chip activated. Indian, American, British, and all other non-EU passport holders cannot obtain this card. There is no workaround — registration is always in person at the Bürgeramt. <a href="/anmeldung-online-non-eu" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Guide 02</a> explains exactly why and what your in-person path looks like.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Your documents need to be perfect. The appointment is the easy part.</div>
              <h2>ReadyExpat generates your German form <span className="b">in 5 minutes.</span></h2>
              <p>Every field correct. Every date in the right format. Every entry in German. Plus a personalised checklist of exactly what to bring for your situation. Show up knowing your paperwork is right.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <GuidePageNav activeId="termin" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
