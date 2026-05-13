import type { Metadata } from "next";
import { SharedNav } from "../components/SharedNav";
import { GuideSidebar } from "../components/GuideSidebar";
import { AppFooter } from "../components/AppFooter";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Can I Do the Anmeldung Online? — Non-EU Citizens Explained | SimplyExpat",
  description: "Online Anmeldung exists in Germany but non-EU citizens cannot use it. Here is exactly why, what you need instead, and how to get your form right first time.",
  alternates: { canonical: `${DOMAIN}/anmeldung-online-non-eu` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Can I Do the Anmeldung Online? — Non-EU Citizens Explained | SimplyExpat",
    description: "Online Anmeldung exists in Germany but non-EU citizens cannot use it. Here is exactly why, what you need instead, and how to get your form right first time.",
    url: `${DOMAIN}/anmeldung-online-non-eu`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungOnlineNonEU() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Can I Do the Anmeldung Online? — Non-EU Citizens Explained",
    description: "Online Anmeldung exists in Germany but non-EU citizens cannot use it. Here is exactly why and what to do instead.",
    url: `${DOMAIN}/anmeldung-online-non-eu`,
    publisher: { "@type": "Organization", name: "SimplyExpat Berlin", url: DOMAIN },
    inLanguage: "en",
    datePublished: "2026-05-08",
    dateModified: "2026-05-08",
  };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: 0, background: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .guide-h1 { font-size: 44px; }
        .guide-wrap { display: flex; gap: 40px; align-items: flex-start; max-width: 1060px; margin: 0 auto; padding: 56px 40px 80px; }
        .guide-main { flex: 1; min-width: 0; }
        .guide-sidebar-el { display: block; }
        @media(max-width:860px){ .guide-sidebar-el { display: none !important; } }
        @media(max-width:640px){
          .guide-h1 { font-size: 28px !important; }
          .guide-wrap { padding: 36px 18px 60px !important; }
          .guide-hero-pad { padding: 48px 18px 44px !important; }
          .guide-cta { padding: 36px 22px !important; }
        }
      `}</style>

      <SharedNav currentPage="anmeldung-online-non-eu" />

      {/* Hero */}
      <div className="guide-hero-pad" style={{ background: "linear-gradient(140deg,#eef5ff 0%,#f8fafc 55%,#fff7ed 100%)", borderBottom: "1px solid #e8ecf4", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <span style={{ color: "#c2410c", fontSize: 11.5, fontWeight: 700 }}>Non-EU Citizens</span>
          </div>
          <h1 className="guide-h1" style={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.03em" }}>
            You just found out you<br />can&apos;t register online.<br />Here is what to do instead.
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            Online Anmeldung exists. Non-EU citizens cannot use it. Here is exactly why — and your fastest path forward.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="guide-wrap">
      <div className="guide-main">

        {/* Section 1 */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Online Anmeldung exists — but not for you</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            Germany introduced online address registration in October 2024. It is available in Berlin, Hamburg, Bremen, and parts of Bavaria, Baden-Württemberg, and Hesse. But it comes with a list of requirements that immediately excludes most expats.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>To register online you need all of the following:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "An EU or EEA eID card with the Online-Ausweis chip activated",
              "The AusweisApp installed on an NFC-capable smartphone",
              "A BundID account",
              "An existing German registration — online registration is for address changes within Germany, not first-time arrivals",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#eff6ff", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="#0075FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 15, color: "#374151", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px 18px", background: "#fef9c3", border: "1.5px solid #fde047", borderRadius: 12 }}>
            <p style={{ fontSize: 13.5, color: "#713f12", lineHeight: 1.65, margin: 0 }}>
              <strong>Also:</strong> Even EU citizens arriving in Germany for the first time must register in person. Online registration only works for moving between German addresses — not for your initial registration from abroad.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Why non-EU citizens are excluded</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            The eID card (elektronischer Personalausweis) is only issued to German citizens and EU/EEA nationals residing in Germany. US citizens, UK citizens, Indian nationals, Brazilian nationals — and all other non-EU/EEA passport holders — cannot obtain one.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            No eID card means no Online-Ausweis chip. No chip means no online registration. There is no workaround. The system requires it.
          </p>
          <div style={{ padding: "18px 22px", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 14 }}>
            <p style={{ fontSize: 15, color: "#991b1b", fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
              UK citizens: post-Brexit, the UK is not an EU or EEA member state. This applies to you too. In-person registration only.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What you must do instead</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 22 }}>
            You register in person at a Bürgeramt. Here is the exact process.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { n: "1", title: "Get your Wohnungsgeberbestätigung", body: "Your landlord or main tenant must sign this form confirming your move-in date and address. Request it in writing the moment you know your move-in date. Without it, the Bürgeramt will not register you — your rental contract is not a substitute." },
              { n: "2", title: "Complete the Anmeldeformular in German", body: "The official registration form has 54 fields, all in German. Wrong date formats, untranslated entries, missed fields — this is where most expats get turned away. English-language form preparation services exist specifically for this step: you answer in English and receive a print-ready German PDF." },
              { n: "3", title: "Book a Bürgeramt appointment", body: "Book at service.berlin.de. Appointments in central districts book out 3–6 weeks in advance. Search Berlin-wide for faster availability. Outer districts like Marzahn and Spandau consistently have more slots." },
              { n: "4", title: "Attend in person", body: "Bring your passport, your completed German-language form, and your Wohnungsgeberbestätigung. If non-EU, bring your visa or residence permit. The appointment takes 5–10 minutes when your documents are complete." },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", background: "#f8fafc", borderRadius: 14, border: "1.5px solid #e8ecf4" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>{step.n}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>{step.title}</div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div style={{ marginBottom: 52, padding: "20px 24px", background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16 }}>
          <div style={{ fontWeight: 900, color: "#991b1b", fontSize: 16, marginBottom: 8 }}>The form is entirely in German. Every field. One mistake and you go home.</div>
          <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.7, margin: 0 }}>
            One wrong entry, one date in the wrong format, one field left blank — and the clerk turns you away on the spot. That means another 3-week wait for a new appointment. Berlin clerks follow the rules strictly. They will not help you complete the form at the counter.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 18, letterSpacing: "-0.02em" }}>Common questions</h2>
          <style>{`
            .guide-faq details summary{list-style:none;cursor:pointer;user-select:none}
            .guide-faq details summary::-webkit-details-marker{display:none}
            .guide-faq details[open]{background:#fafcff!important}
            .guide-faq details[open]>summary{color:#0075FF!important}
            .guide-faq details>div{animation:gfaq-in 0.16s ease}
            @keyframes gfaq-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
          `}</style>
          <div className="guide-faq" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "Can any non-EU citizen do the Anmeldung online?", a: "No. Online registration requires an EU or EEA eID card, which is not available to non-EU nationals. You must register in person at a Bürgeramt." },
              { q: "What exactly is the eID card?", a: "The eID card (elektronischer Personalausweis) is a German identity document with an embedded chip that enables secure online authentication. It is issued to German citizens and EU/EEA nationals residing in Germany. Non-EU nationals receive different residency documents that do not include this function." },
              { q: "Can I register online as a UK citizen?", a: "No. Since Brexit, UK citizens are non-EU nationals and cannot obtain the eID card. You must register in person, the same as any other non-EU national." },
              { q: "I already have a German address registered — can I change it online?", a: "Only if you hold an EU/EEA eID card with Online-Ausweis activated. Non-EU nationals must appear in person at a Bürgeramt for every registration — first registration and every subsequent address change." },
            ].map(({ q, a }) => (
              <details key={q} style={{ borderRadius: 12, border: "1.5px solid #e8ecf4", background: "white", overflow: "hidden" }}>
                <summary style={{ padding: "14px 18px", fontSize: 14.5, fontWeight: 700, color: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  {q}
                  <svg style={{ flexShrink: 0, transition: "transform 0.2s" }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="guide-cta" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 20, padding: "44px 40px", textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(191,219,254,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>For non-EU expats in Berlin</div>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>We handle the German form for you.</h3>
          <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            Answer in English. We generate your completed Anmeldeformular — all 54 fields in correct German — ready to print and bring to your appointment. €15, one time.
          </p>
          <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.9)", marginBottom: 24, fontStyle: "italic" }}>That anxiety? With SimplyExpat, it disappears.</p>
          <a href="/#wizard/origin" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "#0075FF", color: "white", fontWeight: 800, fontSize: 15, textDecoration: "none", letterSpacing: "-0.01em" }}>
            Prepare My Anmeldung
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, textAlign: "center" }}>
          This page is for general information only. Registration requirements may change. Verify current requirements at berlin.de before your appointment.
        </p>
      </div>
      <GuideSidebar currentPage="anmeldung-online-non-eu" />
      </div>
      <AppFooter />
    </div>
  );
}
