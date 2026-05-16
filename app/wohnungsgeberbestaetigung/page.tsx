import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuidePageNav } from "../components/guides/GuidePageNav";
import { GuideReveal } from "../components/guides/GuideReveal";
import { EmailTemplateClient } from "./EmailTemplateClient";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Wohnungsgeberbestätigung — What It Is and How to Get It (2026) · SimplyExpat Berlin",
  description:
    "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away. Here is exactly what it is, who can sign it, and how to get it fast.",
  alternates: { canonical: `${DOMAIN}/wohnungsgeberbestaetigung` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Wohnungsgeberbestätigung — What It Is and How to Get It",
    description: "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away.",
    url: `${DOMAIN}/wohnungsgeberbestaetigung`,
    siteName: "SimplyExpat Berlin",
    type: "article",
  },
};

export default function Wohnungsgeberbestaetigung() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Wohnungsgeberbestätigung — What It Is and How to Get It",
        description: "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away.",
        author: { "@type": "Organization", name: "SimplyExpat Berlin" },
        publisher: { "@type": "Organization", name: "SimplyExpat Berlin" },
        datePublished: "2026-05-01",
        dateModified: "2026-05-14",
        mainEntityOfPage: `${DOMAIN}/wohnungsgeberbestaetigung`,
      },
      {
        "@type": "HowTo",
        name: "How to get your Wohnungsgeberbestätigung",
        step: [
          { "@type": "HowToStep", position: 1, name: "Check your move-in documents", text: "Most landlords include a signed Wohnungsgeberbestätigung with your move-in paperwork. Check your email and any physical documents first." },
          { "@type": "HowToStep", position: 2, name: "Download the blank template", text: "If not provided, download the official blank Wohnungsgeberbestätigung template and send it to your landlord with a written request." },
          { "@type": "HowToStep", position: 3, name: "Email your landlord", text: "Send a written email requesting the signed form. Keep the email — it is your evidence that you asked if they later delay." },
          { "@type": "HowToStep", position: 4, name: "Bring the signed form to the Bürgeramt", text: "Present the signed Wohnungsgeberbestätigung at your Anmeldung appointment. If your landlord is still delaying, you can attend with your rental contract and send the Wohnungsgeberbestätigung by email afterwards — confirmed via the official 030 115 hotline." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Can my rental contract replace the Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "Normally no. However, if your landlord is delaying and you urgently need your Steuer-ID to start work, the official Berlin hotline (030 115) has confirmed that you can bring your rental contract to the Bürgeramt instead — and send the Wohnungsgeberbestätigung afterwards by email once your landlord provides it." } },
          { "@type": "Question", name: "What happens if my landlord refuses to sign it?", acceptedAnswer: { "@type": "Answer", text: "Attend your Bürgeramt appointment anyway with your rental contract — the office can register you provisionally and accept the Wohnungsgeberbestätigung by email afterwards. Then report the refusal: it is a regulatory offence under §19 BMG and the landlord faces a fine of up to €1,000. For further action contact the Berliner Mieterverein (Berlin Tenants' Association)." } },
          { "@type": "Question", name: "Can my flatmate sign the Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "If you are subletting, the main tenant on the lease can sign — but only if the landlord has authorised the sublet in writing. If the sublet is unauthorised, the situation is legally complicated." } },
          { "@type": "Question", name: "What if I need my Steuer-ID urgently to start work but my landlord is delaying the Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "According to the official Berlin hotline 030 115, you can attend your Bürgeramt appointment with your rental contract (Mietvertrag) instead, and send the Wohnungsgeberbestätigung by email afterwards once your landlord provides it. This is the official pragmatic solution for this situation." } },
          { "@type": "Question", name: "Will Airbnb or my hotel provide a Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "No. Short-term accommodation — Airbnb, hotels, hostels — will not provide the Wohnungsgeberbestätigung. Some long-term serviced apartments (28+ days) do, but you must confirm explicitly before booking. You cannot register at the Bürgeramt from a short-term address." } },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="wgb" />

      <main className="main">
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('/hero-wohnung.jpg')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">Wohnungsgeberbestätigung</span>
            </div>
            <span className="pill warn"><span className="dot" />Guide 04 · Landlord Confirmation</span>
            <h1 className="hero-title">
              The one form your landlord must provide.
              <span className="accent">Without it, no registration.</span>
            </h1>
            <p className="lede">What it is, who can sign it, how to request it — and exactly what to do if your landlord is difficult.</p>
          </div>
        </section>

        {/* 01 · What it looks like */}
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">01 · What it is</div>
              <h2 className="h2">A one-page form. <span className="accent">Legally required.</span></h2>
              <p className="section-sub">The Wohnungsgeberbestätigung is mandated by §19 Bundesmeldegesetz. Your landlord confirms in writing that you moved in on a specific date. Without it, the Bürgeramt cannot process your <a href="/what-is-anmeldung" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Anmeldung</a>. It is one of three core documents on the <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>full document checklist</a> — the other two being your passport and the completed German-language form.</p>
            </div>

            {/* Mock form preview */}
            <div className="reveal" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 22, padding: 32, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Form preview — Wohnungsgeberbestätigung · not the complete document</div>
              <div style={{ border: "1.5px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ background: "var(--ink)", padding: "12px 20px" }}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: 15 }}>Wohnungsgeberbestätigung</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>gemäß §19 Bundesmeldegesetz (BMG)</div>
                </div>
                <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Name des Wohnungsgebers (Vermieter)", value: "Your landlord's full name" },
                    { label: "Anschrift der Wohnung", value: "Musterstraße 12, 2. OG, 10115 Berlin" },
                    { label: "Einzugsdatum des Wohnungsnehmers", value: "01.06.2026" },
                    { label: "Name des Wohnungsnehmers (Mieter)", value: "Your full name" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12, paddingBottom: 14, borderBottom: "1px dashed var(--line)", alignItems: "center" }}>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>{row.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", background: "var(--bg)", borderRadius: 8, padding: "6px 10px" }}>{row.value}</div>
                    </div>
                  ))}
                  <div style={{ padding: "14px 0 6px", display: "flex", gap: 32 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>Datum</div>
                      <div style={{ width: 120, height: 1, background: "var(--ink)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>Unterschrift des Wohnungsgebers</div>
                      <div style={{ height: 1, background: "var(--ink)" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                <strong>The form contains:</strong> your full name, move-in date, full address, and the landlord&apos;s signature. But without that signature, you cannot register.
              </div>
            </div>

          </div>
        </section>

        {/* 02 · How to request it */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">02 · How to request it</div>
              <h2 className="h2">Check your move-in documents <span className="accent">first.</span></h2>
              <p className="section-sub">Most landlords include a signed Wohnungsgeberbestätigung in your move-in paperwork automatically. Check your email and any physical documents before doing anything else.</p>
            </div>

            {/* PDF download card */}
            <div className="reveal" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 22, padding: 28, marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Only if your landlord has not provided it</div>
              <a
                href="/wg-template.pdf"
                download="Wohnungsgeberbestaetigung-Vorlage.pdf"
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, border: "1.5px solid var(--line)", background: "var(--bg)", textDecoration: "none", cursor: "pointer", transition: "border-color .15s" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "white", border: "1px solid var(--line)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", marginBottom: 3 }}>Download blank template (PDF)</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Print · send to landlord · ask them to sign and return</div>
                </div>
                <div className="tag">Download →</div>
              </a>
              <div style={{ marginTop: 14, padding: "16px 18px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--line)", fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                <div style={{ marginBottom: 12 }}>This is the blank template. SimplyExpat generates a <strong>pre-filled version</strong> with your name, address, and move-in date as part of the Anmeldung preparation.</div>
                <Link href="/#wizard/origin" className="cta-btn" style={{ fontSize: 15, padding: "14px 22px", display: "inline-flex", boxShadow: "0 8px 20px rgba(0,64,255,.28)" }}>
                  Prepare My Anmeldung
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            {/* Email template */}
            <div className="reveal">
              <EmailTemplateClient />
            </div>
          </div>
        </section>


        {/* 03 · Who can sign */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">03 · Who can sign it</div>
              <h2 className="h2">Not everyone can be your <span className="accent">Wohnungsgeber.</span></h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="reveal">
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                  status: "ok", label: "Your landlord (Vermieter)",
                  body: "The property owner or property management company acting on their behalf. This is the standard case for most rental agreements.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                  status: "ok", label: "Main tenant in a WG (Hauptmieter)",
                  body: "If you are subletting a room, the main tenant on the lease can sign — but only if the landlord has authorised the sublet in writing.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
                  status: "warn", label: "Friends or family (owner)",
                  body: "If you are staying with someone who owns the property, they can sign as Wohnungsgeber. They must be the owner — not another tenant.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>,
                  status: "bad", label: "Airbnb host / short-term rental",
                  body: "Most short-term accommodation will not provide this form. Some long-term serviced apartments (28+ days) do — confirm before you book if registration timing matters.",
                },
              ].map((c) => (
                <div key={c.label} className="card" style={{ borderColor: c.status === "bad" ? "#fecdd3" : c.status === "warn" ? "#fde68a" : undefined }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, background: c.status === "ok" ? "var(--green-tint)" : c.status === "warn" ? "var(--amber-tint)" : "var(--rose-tint)", color: c.status === "ok" ? "var(--green)" : c.status === "warn" ? "var(--amber)" : "var(--rose)" }}>{c.icon}</div>
                    <div>
                      <h4 style={{ marginBottom: 6 }}>{c.label}</h4>
                      <p style={{ marginBottom: 0 }}>{c.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 · Risk scenarios */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">04 · If your landlord is difficult</div>
              <h2 className="h2">Three scenarios. <span className="accent">Three responses.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="reveal">
              {[
                {
                  status: "bad",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>,
                  title: "Landlord refuses outright",
                  body: "Attend your Bürgeramt appointment anyway with your rental contract — the office can register you provisionally and accept the Wohnungsgeberbestätigung by email afterwards. Then report the refusal: it is a regulatory offence under §19 BMG and the landlord faces a fine of up to €1,000. For further action contact the Berliner Mieterverein (Berlin Tenants' Association).",
                },
                {
                  status: "warn",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
                  title: "Landlord goes silent",
                  body: "Send a follow-up email citing §19 BMG and the 14-day registration deadline. Keep every message. If your appointment arrives without the form, attend anyway with your rental contract — the Bürgeramt can register you and accept the Wohnungsgeberbestätigung by email afterwards. See section 06 for the full emergency procedure.",
                },
                {
                  status: "ok",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg>,
                  title: "Landlord provides it immediately",
                  body: "Most professional landlords and property management companies send the form with your move-in documents. Check your email first — it is often already there. If signed, you are done with this step.",
                },
              ].map((s) => (
                <div key={s.title} style={{ padding: "22px 24px", borderRadius: 18, border: `1.5px solid ${s.status === "bad" ? "#fecdd3" : s.status === "warn" ? "#fde68a" : "var(--green-bd)"}`, background: s.status === "bad" ? "var(--rose-tint)" : s.status === "warn" ? "var(--amber-tint)" : "var(--green-tint)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", background: "white", color: s.status === "bad" ? "var(--rose)" : s.status === "warn" ? "var(--amber)" : "var(--green)" }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>{s.title}</div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 · Quick rules */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">05 · Quick rules</div>
              <h2 className="h2">Four things worth <span className="accent">knowing.</span></h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="reveal">
              {[
                {
                  color: "var(--blue)", bg: "var(--blue-soft)", bd: "#d8e1ff",
                  label: "LEGAL DEADLINE",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>,
                  title: "Landlord has 2 weeks — not longer",
                  body: "The landlord must provide the form within two weeks of your move-in date. This is a legal obligation under §19 BMG — not a favour.",
                },
                {
                  color: "var(--green)", bg: "var(--green-tint)", bd: "var(--green-bd)",
                  label: "WG / SUBLETS",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                  title: "Main tenant can sign — if authorised",
                  body: "For WG sublets, the main tenant can sign only if the landlord has authorised the sublet in writing. An unauthorised sublet puts both parties at legal risk.",
                },
                {
                  color: "var(--amber)", bg: "var(--amber-tint)", bd: "#fde4a8",
                  label: "RED FLAG",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
                  title: "\"I can't sign\" may mean unauthorised sublet",
                  body: "If your main tenant says they cannot provide the form, this may indicate the sublet is not officially authorised by the building owner. Get advice for your specific situation.",
                },
                {
                  color: "var(--blue)", bg: "var(--blue-soft)", bd: "#d8e1ff",
                  label: "PROTECT YOURSELF",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 4h16v16H4z" rx="2"/><path d="M9 12l2 2 4-4"/></svg>,
                  title: "Request in writing — email only",
                  body: "Request the form in writing — email, not WhatsApp or a phone call. If they later delay or deny, your email is your evidence that you asked.",
                },
              ].map((r) => (
                <div key={r.label} style={{ background: r.bg, border: `1.5px solid ${r.bd}`, borderRadius: 20, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "white", display: "grid", placeItems: "center", flexShrink: 0, color: r.color, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>{r.icon}</div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 800, color: r.color, letterSpacing: ".12em" }}>{r.label}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: "var(--ink)", lineHeight: 1.25 }}>{r.title}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 · Emergency: landlord delaying, you need your Steuer-ID */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">06 · Emergency situation</div>
              <h2 className="h2">Landlord delaying. You need to <span className="accent">work now.</span></h2>
              <p className="section-sub">If you are a new expat in Germany, your employer may require a Steuer-ID before letting you start work — and you only get a Steuer-ID through Anmeldung. A delayed landlord can therefore block your entire income. Here is the official answer.</p>
            </div>

            <div className="reveal" style={{ background: "var(--ink)", borderRadius: 28, padding: 40, position: "relative", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ position: "absolute", right: -80, top: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, var(--green) 0%, transparent 70%)", opacity: 0.15, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--green-tint)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11 19.79 19.79 0 0 1 1.61 2.4 2 2 0 0 1 3.6.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--green)", letterSpacing: ".14em", textTransform: "uppercase" }}>Confirmed via 030 115 official hotline</div>
                    <div style={{ fontWeight: 800, fontSize: 19, color: "white", letterSpacing: "-0.015em", marginTop: 2 }}>The Bürgeramt has a pragmatic solution</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { n: "1", text: "Bring your rental contract (Mietvertrag) to the Bürgeramt appointment instead. They will understand the situation and process your Anmeldung." },
                    { n: "2", text: "Send the signed Wohnungsgeberbestätigung to the Bürgeramt afterwards via email once your landlord finally provides it." },
                  ].map((s) => (
                    <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 800, fontSize: 13, color: "white" }}>{s.n}</div>
                      <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{s.text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
                  This tip came directly from the official Berlin service hotline <strong style={{ color: "white" }}>030 115</strong>. German bureaucracy can be pragmatic when circumstances demand it — especially for a situation clearly outside your control.
                </div>
              </div>
            </div>

            <div className="callout warn reveal">
              <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
              <div>
                <div className="h">Why this matters more than it seems</div>
                <div className="p">Many German employers only allow new staff to start work once they have a Steuer-ID — which you only receive through Anmeldung. A landlord dragging their feet on a single form can delay your entire income. If you are in this situation: call 030 115, explain it, and get your appointment booked immediately.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 · Subletting situations */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">07 · Subletting situations</div>
              <h2 className="h2">Renting a room in a <span className="accent">shared flat (WG)?</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="reveal">
              <div className="card">
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-tint)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: 8 }}>The main tenant can sign — with conditions</h4>
                    <p>If you are renting a room in a shared flat (WG), the main tenant on the lease can provide the Wohnungsgeberbestätigung. This is the standard situation for WG sublets. However, there is one hard requirement: the landlord must have given written permission for the sublet. Without that authorisation, the main tenant is not legally in a position to act as Wohnungsgeber.</p>
                  </div>
                </div>
              </div>
              <div className="callout warn">
                <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg></div>
                <div>
                  <div className="h">If your main tenant says they cannot provide the form</div>
                  <div className="p">This may indicate the sublet is not authorised by the building owner — a legal grey area that puts both you and your flatmate at risk. The Bürgeramt will usually still register you if you have other documentary evidence of residence, but this varies by office. Get specific advice for your situation from the Berliner Mieterverein.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 08 · Airbnb and short-term rentals */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">08 · Airbnb and short-term rentals</div>
              <h2 className="h2">Most short-term hosts <span className="accent">will not sign it.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="reveal">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card" style={{ borderColor: "#fecdd3" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--rose-tint)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
                  </div>
                  <h4 style={{ marginBottom: 8 }}>Airbnb · Hotels · Hostels</h4>
                  <p>These hosts will not provide the Wohnungsgeberbestätigung. Short-term tourist accommodation is not designed for official registration — most hosts are not equipped or willing to fulfil this legal role.</p>
                </div>
                <div className="card" style={{ borderColor: "var(--green-bd)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--green-tint)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                  </div>
                  <h4 style={{ marginBottom: 8 }}>Serviced apartments (28+ days)</h4>
                  <p>Some long-term serviced apartments do provide the form — but it varies. If registration timing matters to you, ask explicitly before booking: <em>"Können Sie mir eine Wohnungsgeberbestätigung ausstellen?"</em></p>
                </div>
              </div>
              <div className="callout info">
                <div className="glyph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
                <div>
                  <div className="h">Moving from short-term to permanent accommodation?</div>
                  <div className="p">If you are using short-term accommodation while searching for a flat, you cannot register until you have a permanent address with a landlord who will sign. Plan your Anmeldung timing around your permanent move-in date — not your Airbnb check-in.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">09 · Common questions</div>
              <h2 className="h2">Quick answers.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>What is the Wohnungsgeberbestätigung?</summary><div className="ans">The Wohnungsgeberbestätigung is a one-page form your landlord must sign confirming your move-in date and address. It is legally required under §19 Bundesmeldegesetz and must be presented at your <a href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Bürgeramt appointment</a> for the Anmeldung. Without it, the Bürgeramt cannot register you.</div></details>
              <details><summary>Can my rental contract replace the Wohnungsgeberbestätigung?</summary><div className="ans">In normal circumstances, no — the Bürgeramt requires the signed Wohnungsgeberbestätigung specifically. However, if your landlord is deliberately delaying and you urgently need your Anmeldung (for example to get a Steuer-ID to start work), the official 030 115 hotline confirmed you can attend with your rental contract and send the Wohnungsgeberbestätigung by email afterwards. See section 06 on this page for the full procedure.</div></details>
              <details><summary>What if my landlord refuses to sign the Wohnungsgeberbestätigung?</summary><div className="ans">Attend your Bürgeramt appointment anyway with your rental contract — the office can register you provisionally and accept the Wohnungsgeberbestätigung by email afterwards. Then report the refusal: it is a regulatory offence under §19 BMG and the landlord faces a fine of up to €1,000. For further action contact the Berliner Mieterverein (Berlin Tenants' Association).</div></details>
              <details><summary>Can my flatmate sign the Wohnungsgeberbestätigung in a WG?</summary><div className="ans">Yes, if they are the main tenant on the lease and the landlord has given written permission for the sublet. Without that written authorisation, the main tenant cannot legally act as Wohnungsgeber. If your flatmate says they cannot provide the form, this may indicate the sublet is unauthorised — a legal grey area for both parties.</div></details>
              <details><summary>How long does the landlord have to provide the Wohnungsgeberbestätigung?</summary><div className="ans">Under §19 BMG, your landlord must provide the form promptly after your move-in. Since your own registration deadline is 14 days, in practice you need the form within the same window. If your landlord is slow, request it in writing immediately — your email is evidence that you asked. See the <a href="/anmeldung-documents" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>full document checklist</a> for what else to prepare at the same time.</div></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">The Wohnungsgeberbestätigung is one document. The form is another.</div>
              <h2>SimplyExpat handles the Anmeldeformular <span className="b">for you.</span></h2>
              <p>All 54 fields in correct German — dates, translations, format. You focus on getting your landlord to sign. We handle the rest.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">No payment until the PDF is ready · cancel anytime</div>
            </div>
            <GuidePageNav activeId="wgb" />
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
