import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";
import { ReligionPicker } from "./ReligionPicker";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "What is the Anmeldung? Berlin Address Registration Explained",
  description:
    "The Anmeldung is Germany's mandatory address registration. Register at your Bürgeramt within 14 days of moving in or face fines up to €1,000. Required for your tax ID, bank account, health insurance, and residence permit.",
  alternates: { canonical: `${DOMAIN}/what-is-anmeldung` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What is Anmeldung? Germany Address Registration Guide (2026)",
    description: "The Anmeldung is Germany's mandatory address registration. Register within 14 days of moving in. Here's everything expats need to know.",
    url: `${DOMAIN}/what-is-anmeldung`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function WhatIsAnmeldung() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "What is Anmeldung? Germany's Address Registration Explained",
        description: "Comprehensive guide to the Anmeldung — Germany's mandatory address registration system. Required within 14 days of moving in under §17 Bundesmeldegesetz.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-01",
        dateModified: "2026-05-14",
        mainEntityOfPage: `${DOMAIN}/what-is-anmeldung`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the Anmeldung in Germany?", acceptedAnswer: { "@type": "Answer", text: "The Anmeldung is Germany's mandatory address registration. Every person taking up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in, as required by §17 Bundesmeldegesetz. You receive the Anmeldebestätigung/Meldebestätigung on the spot — required for your bank account, Steuer-ID, health insurance, and residence permit." } },
          { "@type": "Question", name: "What happens if I miss the 14-day Anmeldung deadline?", acceptedAnswer: { "@type": "Answer", text: "Missing the deadline can result in a fine of up to €1,000. In practice, authorities are often lenient if you register as soon as possible — especially in cities where appointment availability makes the 14-day window hard to meet. Book the earliest available slot and keep a screenshot showing you searched." } },
          { "@type": "Question", name: "Can I do the Anmeldung online?", acceptedAnswer: { "@type": "Answer", text: "Only if you hold a compatible EU/EEA eID card with the Online-Ausweis chip activated — and only for Ummeldung (changing an existing German address). First-time registrations are always in person. Non-EU citizens including US, UK, Indian, and Brazilian passport holders cannot use the online portal." } },
          { "@type": "Question", name: "Do I need to register if I'm only working remotely from Germany?", acceptedAnswer: { "@type": "Answer", text: "Yes, if you are staying for more than 3 months. The Anmeldung requirement is based on length of stay, not employment type. Remote workers, freelancers, and digital nomads staying 3+ months must register." } },
          { "@type": "Question", name: "What is the Religionsgesellschaft field and do I have to fill it in?", acceptedAnswer: { "@type": "Answer", text: "The Religionsgesellschaft field is the religion declaration on the Anmeldeformular. Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — 8–9% of your income tax. Write OA (Ohne Angabe) to opt out. No negative consequences for leaving it blank." } },
          { "@type": "Question", name: "What documents do I need for the Anmeldung?", acceptedAnswer: { "@type": "Answer", text: "Three core documents: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the Wohnungsgeberbestätigung signed by your landlord. Non-EU citizens should also bring their current visa or residence permit if they already have one." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "What is the Anmeldung?", item: `${DOMAIN}/what-is-anmeldung` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540646794357-6cbbd6f3501e?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">What is Anmeldung</span>
            </div>
            <span className="pill"><span className="dot" />Guide 01 · Main Guide · Start Here</span>
            <h1 className="hero-title">
              What is the Anmeldung?
              <span className="accent">Germany&apos;s mandatory address registration, explained.</span>
            </h1>
            <p className="lede">The Anmeldung is not optional. It is not just for citizens. The consequences of getting it wrong follow you for months.</p>
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
              <a href="#sec-appt" className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">02</text></svg>
                <div className="kf-num">Fact 02</div>
                <p className="kf-text">The fine is rarely imposed if you have an appointment booked and documented.</p>
                <span className="kf-arrow">↗</span>
              </a>
              <a href="/wohnungsgeberbestaetigung" className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">03</text></svg>
                <div className="kf-num">Fact 03</div>
                <p className="kf-text">You need your landlord&apos;s signed Wohnungsgeberbestätigung to register.</p>
                <span className="kf-arrow">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 01 · Definition */}
        <section className="section" id="sec-what">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="mob-2col-wide">
                {/* Left — definition */}
                <div>
                  <div className="eyebrow">01 · Definition</div>
                  <h3 style={{ marginTop: 14 }}>The <span className="b">Anmeldung</span> is Germany&apos;s mandatory address registration system.</h3>
                  <p style={{ marginTop: 20 }}>Literally &ldquo;registration.&rdquo; Every person taking up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in.</p>
                </div>

                {/* Right — who registers */}
                <div className="mob-no-border-left" style={{ paddingTop: 6, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 48 }}>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Who registers</div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.015em", lineHeight: 1.2, color: "white", marginBottom: 20 }}>
                    Anyone moving to <span style={{ color: "#60a5fa" }}>Germany</span> for <span style={{ color: "#60a5fa" }}>3+ months.</span>
                  </div>

                  {/* Who chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {["EU citizens", "Non-EU nationals", "Employees", "Students", "Freelancers"].map((w) => (
                      <span key={w} style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(0,117,255,.18)", border: "1px solid rgba(0,117,255,.35)", color: "#c5cee5", fontSize: 13, fontWeight: 700 }}>{w}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
                    <svg style={{ flexShrink: 0, marginTop: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span style={{ color: "#8e9bbe", fontSize: 13.5, lineHeight: 1.55 }}>No exemptions based on nationality or visa type.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · Why it matters */}
        <section className="section">
          <div className="wrap">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 20px" }}>
              <Link href="/anmeldung-deadline-berlin" style={{ padding: "6px 13px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}>The 14-Day Deadline →</Link>
            </div>
            <div className="section-head reveal">
              <div className="eyebrow">02 · Why it matters</div>
              <h2 className="h2">Without it, basic life in Germany is <span className="accent">locked.</span></h2>
              <p className="section-sub">The Anmeldung is the foundation. Five things you cannot do — or pay properly for — until it is done.</p>
            </div>

            <div className="reveal mob-3col" style={{ marginBottom: 16 }}>
              {[
                { title: "German bank account", body: "Banks require proof of address. The Anmeldebestätigung/Meldebestätigung is the standard document.", tag: "Sparkasse · N26 · Commerzbank", tc: "", color: "blue", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M6 16h4"/></svg> },
                { title: "Steuer-ID · Tax number", body: "Arrives by post 2–4 weeks after registration. Without it, employer taxes you at Steuerklasse 6.", tag: "11 digits · BMF · auto-issued", tc: " warn", color: "amber", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                { title: "Health insurance", body: "Public (TK, AOK, Barmer) and most private insurers require your registration address.", tag: "Krankenversicherung", tc: " ok", color: "green", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg> },
              ].map((c) => (
                <div key={c.title} className="wi-card" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, padding: 24, position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="wi-lock" style={{ position: "absolute", right: 20, top: 20, width: 30, height: 30, borderRadius: 9, background: "var(--rose-tint)", color: "var(--rose)", display: "grid", placeItems: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                  </div>
                  <div className={`ib iconbox ${c.color}`}>{c.icon}</div>
                  <h4 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{c.title}</h4>
                  <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{c.body}</p>
                  <span className={`tag${c.tc}`} style={{ alignSelf: "flex-start", marginTop: "auto" }}>{c.tag}</span>
                </div>
              ))}
            </div>

            {/* Wide: residence + employment */}
            <div className="reveal wi-card mob-2col-feat" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, padding: 24, marginBottom: 40 }}>
              <div>
                <div className="ib iconbox ink" style={{ marginBottom: 14 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="9" r="3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17a5 5 0 0 1 10 0"/></svg></div>
                <h4 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Residence permit · Aufenthaltstitel</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>Non-EU nationals applying for a residence permit must be registered. The <strong>Ausländerbehörde</strong> requires it before they will process your application.</p>
                <span className="tag bad" style={{ marginTop: 10, display: "inline-flex" }}>Mandatory for ABH</span>
              </div>
              <div>
                <div className="ib iconbox blue" style={{ marginBottom: 14 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                <h4 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Employment &amp; payroll</h4>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>Most employers need your registered address before they can add you to payroll. No address, no contract start.</p>
                <span className="tag" style={{ marginTop: 10, display: "inline-flex" }}>HR · Lohnabrechnung</span>
              </div>
            </div>

            {/* Steuerklasse bars */}
            <div className="reveal explainer-box" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%)", border: "1px solid #fde4a8", borderRadius: 22, padding: 32 }}>
              <div className="mob-2col-feat">
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--amber)", fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
                    Why Anmeldung delay costs you money
                  </span>
                  <h4 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 10px", lineHeight: 1.05, color: "var(--ink)" }}>No Anmeldung → no Steuer-ID → emergency Steuerklasse 6 on payroll.</h4>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55, margin: "0 0 22px" }}>Your employer cannot tax you correctly without a Steuer-ID, and the Steuer-ID only arrives 2–4 weeks <em>after</em> your Anmeldung. Until then, payroll defaults to <strong>Steuerklasse 6</strong> — Germany&apos;s highest emergency bracket. On a €4,500/month salary that is roughly €600 less in your account every month. Yes, you get it back via your tax return. Eventually.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Steuerklasse 1", sub: "Once Steuer-ID arrives", w: "36%", fill: "linear-gradient(90deg,var(--green) 0%,#059669 100%)", amt: "≈ €3,030" },
                    { label: "Steuerklasse 6", sub: "Emergency rate", w: "65%", fill: "repeating-linear-gradient(45deg,var(--rose),var(--rose) 8px,#be123c 8px,#be123c 16px)", amt: "≈ €2,420" },
                  ].map((b) => (
                    <div key={b.label} className="sk-bar-row" style={{ display: "grid", gridTemplateColumns: "110px 1fr 84px", alignItems: "center", gap: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.label}<small style={{ display: "block", color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>{b.sub}</small></div>
                      <div style={{ height: 16, borderRadius: 5, background: "rgba(255,255,255,.7)", border: "1px solid rgba(0,0,0,.05)", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 5, background: b.fill, width: b.w }} /></div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, textAlign: "right", fontSize: 13 }}>{b.amt}</div>
                    </div>
                  ))}
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>Net for €4,500 gross · illustrative</div>
                </div>
              </div>
            </div>

            <div className="callout bad reveal" style={{ marginTop: 18 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">Many German employers won&apos;t let you start working without Anmeldung and Steuer-ID.</div>
                <div className="p">In the unlikely event they proceed anyway, your payroll defaults to <strong>Steuerklasse 6</strong> — Germany&apos;s emergency tax bracket, the highest rate. Register as soon as you move in.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 · At the Bürgeramt */}
        <section className="section" id="sec-appt">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · At the Bürgeramt</div>
              <h2 className="h2">What you get at the <span className="accent">appointment.</span></h2>
              <p className="section-sub">After the clerk processes your form, you receive the <strong>Anmeldebestätigung/Meldebestätigung</strong> — printed on the spot. You need to arrive with the right documents: your passport, a completed German-language form, and the <a href="/wohnungsgeberbestaetigung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Wohnungsgeberbestätigung</a> signed by your landlord. <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Booking your Bürgeramt appointment</a> is a separate step covered in guide 05.</p>
            </div>
            <div className="timeline reveal">
              {[
                { n: "1", h: "You hand over the form", p: "54 fields, all in German. The clerk checks for missing or contradictory entries." },
                { n: "2", h: "Clerk types it in", p: "The Meldebehörde records you as resident at this address from this date." },
                { n: "3", h: "(An)meldebestätigung prints", p: "Official proof of registration. Stamped, signed, on the spot." },
                { n: "4", h: "Check before you leave", p: "Name spelling, address, move-in date. Corrections are harder once you walk out." },
              ].map((s) => (
                <div key={s.n} className="step"><div className="num">{s.n}</div><h5>{s.h}</h5><p>{s.p}</p></div>
              ))}
            </div>
            <div className="callout info reveal" style={{ marginTop: 36 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div>
              <div>
                <div className="h">Before you leave the counter:</div>
                <div className="p">Verify your <strong>name spelling</strong>, your <strong>registered address</strong>, and your <strong>move-in date</strong> on the printed Anmeldebestätigung/Meldebestätigung. The clerk will fix it now. They will not fix it next week. See <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 03</a> for the full document checklist and the most common form mistakes and how to avoid them.</div>
              </div>
            </div>

            <div className="callout ok reveal" style={{ marginTop: 12 }}>
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></div>
              <div>
                <div className="h">The Ausländerbehörde needs your Anmeldung — not the other way around.</div>
                <div className="p">When you apply for a residence permit, the Berlin immigration office (Landesamt für Einwanderung) asks for proof of your registered address. Register first, then book your permit appointment with the Anmeldebestätigung in hand.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 · The 8% trap */}
        <section className="section" id="sec-religion">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow" style={{ color: "var(--purple)" }}>04 · The 8% trap</div>
              <h2 className="h2">The religion field most expats <span className="accent">don&apos;t know about.</span></h2>
              <p className="section-sub">One field on the Anmeldeformular — <strong>Religionsgesellschaft</strong> — quietly adds Kirchensteuer to your income tax bill. Try it. Watch what happens.</p>
            </div>
            <div className="reveal"><ReligionPicker /></div>

            <div className="reveal explainer-box" style={{ marginTop: 32, background: "linear-gradient(135deg,#faf5ff 0%,#ede9fe 100%)", border: "1px solid #c4b5fd", borderRadius: 24, padding: 36 }}>
              <div className="mob-2col-feat">
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#7c3aed", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    What is Kirchensteuer — and why does it exist?
                  </span>
                  <h4 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.1, color: "var(--ink)" }}>The German state collects taxes on behalf of Catholic and Protestant churches. It has done so since 1919.</h4>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6 }}>
                    Kirchensteuer (church tax) dates back to the <strong>Weimar Republic constitution of 1919</strong>, which granted churches the right to levy taxes — with the state acting as collector. This arrangement was carried forward into the <strong>Grundgesetz</strong> (Germany&apos;s Basic Law, Art. 140) after World War II and has been in place ever since.
                  </p>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6, marginTop: 12 }}>
                    The Catholic and Protestant churches together collect roughly <strong>€12 billion per year</strong> through this system — funding schools, hospitals, social services, and clergy salaries.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Rate", val: "8–9% of your income tax", note: "Not 8–9% of your salary. If you pay €10,000 in income tax, you pay ~€900 in Kirchensteuer on top." },
                    { label: "Who pays", val: "Registered members earning income", note: "Declaring RK (Catholic) or EV (Evangelical/Protestant) on the Anmeldung triggers it automatically. OA (Ohne Angabe) = no declaration = no charge." },
                    { label: "Leave the church", val: "Kirchenaustritt at Amtsgericht", note: "Formal resignation from a church requires an in-person visit to the Amtsgericht (district court). Costs ~€30–40. Not free, not at the Finanzamt." },
                  ].map((r) => (
                    <div key={r.label} style={{ background: "rgba(255,255,255,.7)", borderRadius: 14, padding: "14px 18px", border: "1px solid #c4b5fd" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{r.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>{r.val}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 · After registration */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow" style={{ color: "var(--amber)" }}>05 · The next 4 weeks</div>
              <h2 className="h2">After registration — <span className="accent">what to expect.</span></h2>
              <p className="section-sub">Two letters arrive by post. One is essential. The other is mandatory whether you want it or not.</p>
            </div>
            <div className="reveal mob-2col">
              <div className="card" style={{ background: "linear-gradient(180deg,white,var(--blue-soft))" }}>
                <div className="iconbox blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg></div>
                <h4>Steuer-ID arrives by post</h4>
                <p>Your tax identification number arrives within <strong>2–4 weeks</strong> (up to 6–8 weeks during the peak September relocation season). Add your surname to the letterbox (Briefkasten) — official mail is not delivered to unlabelled boxes.</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}><span className="tag">11-digit number</span><span className="tag">Bundeszentralamt für Steuern</span></div>
              </div>
              <div className="card" style={{ background: "linear-gradient(180deg,white,#fff7ed)" }}>
                <div className="iconbox amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="14" r="6"/><path d="M9 14l2 2 4-4M12 6V2M5 12H2M22 12h-3"/></svg></div>
                <h4>Rundfunkbeitrag letter</h4>
                <p>Germany&apos;s mandatory public broadcasting fee. <strong>€18.36/month per household</strong> — not optional, even if you don&apos;t own a TV. Flatmates split it.</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}><span className="tag warn">€220.32 / year</span><span className="tag">ARD · ZDF · DLR</span></div>
              </div>
            </div>

            <div className="reveal explainer-box" style={{ marginTop: 32, background: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%)", border: "1px solid #fde4a8", borderRadius: 24, padding: 32 }}>
              <div className="mob-2col-feat">
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--amber)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    What is the Rundfunkbeitrag?
                  </span>
                  <h4 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.1, color: "var(--ink)" }}>A mandatory household fee for public radio and TV — whether you watch or not.</h4>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6 }}>
                    The Rundfunkbeitrag is Germany&apos;s public broadcasting contribution, set by state law. Every household pays <strong>€18.36/month</strong> — it is not a subscription and not tied to owning a TV or radio. It funds ARD, ZDF, and Deutschlandfunk.
                  </p>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6, marginTop: 10 }}>
                    A letter from the <strong>ARD ZDF Deutschlandradio Beitragsservice</strong> (formerly GEZ) arrives a few weeks after your Anmeldung. You register online at <strong>rundfunkbeitrag.de</strong> and set up a direct debit. If you share a flat, only one person per household pays — split it among flatmates as you like.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Amount", val: "€18.36 / month", note: "€220.32 per year. Set by interstate treaty (Rundfunkstaatsvertrag), not by the broadcaster." },
                    { label: "Who pays", val: "One person per household", note: "One flat = one fee, regardless of how many people live there or how many devices you own." },
                    { label: "Can I opt out?", val: "No — with rare exceptions", note: "Exemptions exist for recipients of certain social benefits (Bürgergeld, BAföG, etc.). Apply at rundfunkbeitrag.de." },
                  ].map((r) => (
                    <div key={r.label} style={{ background: "rgba(255,255,255,.7)", borderRadius: 14, padding: "14px 18px", border: "1px solid #fde4a8" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--amber)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{r.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>{r.val}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 · Special situations */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">06 · Special situations</div>
              <h2 className="h2">Tourists, <span className="accent">Ummeldung</span>, and <span className="accent">Abmeldung</span>.</h2>
              <p className="section-sub">When you don&apos;t need to register at all, when you have to re-register, and when you have to deregister. Non-EU citizens wondering whether <a href="/anmeldung-online-non-eu" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>online Anmeldung is possible</a> — it is not, for reasons explained in guide 02.</p>
            </div>
            <div className="reveal mob-3col">
              {[
                { r: "EXEMPT", rc: "ok", color: "var(--blue-soft)", ic: "var(--blue)", title: "Tourists", de: "stays under 3 months", body: "No registration required. Visit the museums, eat the döner, leave. The Anmeldung is for residents — not visitors.", dl: "— · none" },
                { r: "RE-REGISTER", rc: "warn", color: "#fff7ed", ic: "var(--amber)", title: "Ummeldung", de: "moving within Germany", body: "Every time you change address inside Germany you re-register. Same form, same Bürgeramt — even moving across the street.", dl: "14 days from move-in" },
                { r: "DEREGISTER", rc: "alert", color: "#fff1f2", ic: "var(--rose)", title: "Abmeldung", de: "leaving Germany permanently", body: "Deregister within 2 weeks of departure. Skipping it can leave you on the books — affecting tax, mail, and any future return.", dl: "14 days before/after" },
              ].map((c) => (
                <div key={c.title} style={{ background: "white", border: "1px solid var(--line)", borderRadius: 20, padding: 26, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: 20, right: 20, padding: "4px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", background: c.rc === "ok" ? "var(--green-tint)" : c.rc === "warn" ? "var(--amber-tint)" : "var(--rose-tint)", color: c.rc === "ok" ? "var(--green)" : c.rc === "warn" ? "var(--amber)" : "var(--rose)" }}>{c.r}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: c.color, color: c.ic, display: "grid", placeItems: "center" }}>
                    {c.rc === "ok" && <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
                    {c.rc === "warn" && <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>}
                    {c.rc === "alert" && <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>}
                  </div>
                  <h5 style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>{c.title}</h5>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{c.de}</div>
                  <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, margin: "4px 0 0" }}>{c.body}</p>
                  <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>Deadline</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{c.dl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">07 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>What is the Anmeldung in Germany?</summary><div className="ans">The Anmeldung is Germany's mandatory address registration system. Every person taking up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in, as required by §17 Bundesmeldegesetz. You receive the Anmeldebestätigung/Meldebestätigung on the spot — a document required for your bank account, Steuer-ID, health insurance, and residence permit.</div></details>
              <details><summary>What happens if I miss the 14-day Anmeldung deadline?</summary><div className="ans">Missing the deadline can result in a fine of up to €1,000. In practice, authorities are often lenient if you register as soon as possible — especially in cities like Berlin where appointment availability makes the 14-day window nearly impossible to meet. Book the earliest available appointment, take a screenshot showing you searched, and attend as soon as you can. See <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>guide 05</a> for the full strategy.</div></details>
              <details><summary>Can I do the Anmeldung online?</summary><div className="ans">Only if you hold a compatible EU/EEA eID card with the Online-Ausweis chip activated — and only for Ummeldung (changing an existing German address). First-time registrations from abroad are always in person at the Bürgeramt. Non-EU citizens — including US, UK, Indian, and Brazilian passport holders — cannot use the online portal at all. <a href="/anmeldung-online-non-eu" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Guide 02 covers this in full.</a></div></details>
              <details><summary>Do I need to register if I'm only working remotely from Germany?</summary><div className="ans">Yes, if you are staying for more than 3 months. The Anmeldung requirement is based on length of stay, not your employment type or contract location. Remote workers, freelancers, and digital nomads staying 3+ months must register. There are no exemptions based on having a foreign employer or working for a non-German company.</div></details>
              <details><summary>What is the Religionsgesellschaft field and do I have to fill it in?</summary><div className="ans">The Religionsgesellschaft field is the religion declaration on the Anmeldeformular. Declaring a recognised denomination — RK (Catholic) or EV (Protestant) — triggers Kirchensteuer, church tax of 8–9% of your income tax. Write OA (Ohne Angabe — no declaration) to opt out. There are no negative consequences for leaving it blank or writing OA.</div></details>
              <details><summary>What documents do I need for the Anmeldung?</summary><div className="ans">You need three core documents: a valid passport or EU national ID, the completed Anmeldeformular (all 54 fields in German), and the Wohnungsgeberbestätigung signed by your landlord. Non-EU citizens should also bring their current visa or residence permit if they already have one. See the <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>full personalised document checklist in guide 03.</a></div></details>
              <details><summary>Do I need a visa or residence permit before I can register my address?</summary><div className="ans">No. The Bürgeramt registers your address — not your immigration status. You do not need a residence permit to complete the Anmeldung. In fact, most non-EU residents do the Anmeldung first, then use the Anmeldebestätigung as proof of address when applying for their residence permit at the Ausländerbehörde (Landesamt für Einwanderung in Berlin). If you already have a permit, bring it — the clerk will note your address for their records.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">The form is in German. All 54 fields.</div>
              <h2>Answer in English. <span className="b">We generate the correct German PDF.</span></h2>
              <p>Every field. Every translation. Every date in the right format. Ready to print in 5 minutes.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <GuidePageNav activeId="anmeldung" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 0" }}>
              <Link href="/anmeldung-deadline-berlin" style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "white", color: "var(--ink)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>The 14-Day Deadline →</Link>
            </div>
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
