import type { Metadata } from "next";
import { GuideNav } from "../components/GuideNav";
import { GuideSidebar } from "../components/GuideSidebar";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "How to Book a Bürgeramt Appointment in Berlin — 2026 Guide | SimplyExpat",
  description: "Berlin Bürgeramt appointments book out 3–6 weeks in advance. Here is exactly how to find a slot, what to do if there are none, and how to prepare once you have one.",
  alternates: { canonical: `${DOMAIN}/burgeramt-berlin-appointment` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Book a Bürgeramt Appointment in Berlin — 2026 Guide | SimplyExpat",
    description: "Berlin Bürgeramt appointments book out 3–6 weeks in advance. Here is exactly how to find a slot, what to do if there are none, and how to prepare once you have one.",
    url: `${DOMAIN}/burgeramt-berlin-appointment`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function BurgeramtBerlinAppointment() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Book a Bürgeramt Appointment in Berlin — 2026 Guide",
    description: "Berlin Bürgeramt appointments book out 3–6 weeks in advance. Here is exactly how to find a slot and prepare once you have one.",
    url: `${DOMAIN}/burgeramt-berlin-appointment`,
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

      <GuideNav currentPage="burgeramt-berlin-appointment" />

      {/* Hero */}
      <div className="guide-hero-pad" style={{ background: "linear-gradient(140deg,#eef5ff 0%,#f8fafc 55%,#f0fdf4 100%)", borderBottom: "1px solid #e8ecf4", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <span style={{ color: "#1d4ed8", fontSize: 11.5, fontWeight: 700 }}>2026 Appointment Guide</span>
          </div>
          <h1 className="guide-h1" style={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Berlin Bürgeramt slots<br />vanish in seconds.<br />Here is how to find one.
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            Appointments in central districts book out 3–6 weeks in advance. Here is exactly how to find a slot — and what to do when you cannot find one before your 14-day deadline.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="guide-wrap">
      <div className="guide-main">

        {/* Where to book */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Where to book</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            Book at <strong>service.berlin.de</strong> — the official Berlin appointment portal. There is no other authorised booking system. Third-party &quot;appointment services&quot; are not official and often resell slots they have hoarded.
          </p>
          <div style={{ padding: "16px 20px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12 }}>
            <p style={{ fontSize: 14.5, color: "#1d4ed8", lineHeight: 1.65, margin: 0 }}>
              Select <strong>&quot;Anmeldung einer Wohnung&quot;</strong> from the service list. Then choose how many people you are registering — one appointment covers the whole household if they all attend together.
            </p>
          </div>
        </div>

        {/* 3 strategies */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 20, letterSpacing: "-0.02em" }}>3 strategies that actually work</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                n: "1",
                title: "Search Berlin-wide",
                body: "Use the \"Termin berlinweit suchen\" option — do not restrict to your local district. An appointment in Spandau, Marzahn, or Reinickendorf is legally identical to one in Mitte or Charlottenburg. The Anmeldebestätigung is the same document regardless of which office issues it.",
                color: "#0075FF",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                n: "2",
                title: "Check early in the morning",
                body: "New slots are released in batches. Early morning checks consistently yield better availability than searching during the day. Check service.berlin.de directly for the current slot release schedule — these times have changed in 2026 and may change again.",
                color: "#16a34a",
                bg: "#f0fdf4",
                border: "#86efac",
              },
              {
                n: "3",
                title: "Target outer districts",
                body: "Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf consistently have more slots available than central offices. The U-Bahn journey is worth it. Set your district filter to these areas and check daily.",
                color: "#d97706",
                bg: "#fffbeb",
                border: "#fde68a",
              },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 16, padding: "20px 22px", borderRadius: 16, border: `1.5px solid ${s.border}`, background: s.bg }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>{s.n}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 900, color: "#0f172a", fontSize: 15.5, marginBottom: 6 }}>{s.title}</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 115 hotline */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>The 115 hotline</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            Call <strong>115</strong> — Berlin&apos;s unified service number — during business hours. Operators can sometimes book appointments that do not appear in the online system, particularly same-day cancellations. It is worth trying if the portal shows nothing useful.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75 }}>
            Call in the morning. Have your address and identification details ready. The call is in German — if you are not confident, ask a German-speaking friend to help.
          </p>
        </div>

        {/* Deadline warning */}
        <div style={{ marginBottom: 52, padding: "20px 24px", background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 18 }}>
          <div style={{ fontWeight: 900, color: "#92400e", fontSize: 16, marginBottom: 8 }}>The 14-day clock starts on your move-in date — not when you sign the lease.</div>
          <p style={{ fontSize: 14.5, color: "#78350f", lineHeight: 1.7, margin: 0 }}>
            Many expats confuse the lease signing date with the move-in date. The Bundesmeldegesetz counts from when you physically move in. If you moved in on the 1st but signed the lease on the 15th of the previous month, your 14 days started on the 1st.
          </p>
        </div>

        {/* No slots */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>If there are no slots before your deadline</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            This happens regularly in Berlin. The appointment system itself regularly cannot accommodate demand within the legal 14-day window. The authorities know this.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Book the earliest available slot — even if it is 4 or 5 weeks away.",
              "Take a screenshot of the booking portal showing you searched and found no earlier availability.",
              "Keep that screenshot. It is your evidence that you tried within the 14-day window.",
              "Attend your appointment when it comes. You will not be fined if you have documentation that the system had no earlier slots.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 18px", borderRadius: 12, border: "1.5px solid #e8ecf4", background: "#f8fafc" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* At the appointment */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>At the appointment</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            Arrive on time. If you are late, your slot may be given to the next person. Arrive with everything: your ID, your Wohnungsgeberbestätigung, and your completed Anmeldeformular in German — prepared and printed before you leave home.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            The appointment takes 5–10 minutes when your documents are complete. The clerk processes your form, confirms your address, and prints your Anmeldebestätigung.
          </p>
          <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, marginBottom: 14 }}>
            <p style={{ fontSize: 14.5, color: "#92400e", lineHeight: 1.65, margin: 0 }}>
              <strong>Before you leave:</strong> Check your name spelling, your exact address, and your move-in date on the Anmeldebestätigung. Corrections require a new appointment.
            </p>
          </div>
        </div>

        {/* What they won&apos;t accept */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What the clerk will not accept</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "An incomplete form — all 54 fields are required, no exceptions",
              "A form with any entry in English — every field must be in German",
              "A phone screen — the form must be printed on paper",
              "A missing or unsigned Wohnungsgeberbestätigung",
              "Arriving late for your appointment slot",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fef2f2" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="8" cy="8" r="7.5" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M5 5l6 6M11 5l-6 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 14, color: "#7f1d1d", fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="guide-cta" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 20, padding: "44px 40px", textAlign: "center", marginBottom: 32 }}>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>Your documents need to be perfect.<br />The appointment is the easy part.</h3>
          <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            SimplyExpat generates your completed German form in 5 minutes — every field correct, every date in the right format. Show up knowing your paperwork is right.
          </p>
          <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.9)", marginBottom: 24, fontStyle: "italic" }}>That anxiety? With SimplyExpat, it disappears.</p>
          <a href="/#wizard/origin" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "#0075FF", color: "white", fontWeight: 800, fontSize: 15, textDecoration: "none", letterSpacing: "-0.01em" }}>
            Prepare My Anmeldung
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, textAlign: "center" }}>
          This page is for general information only. Appointment availability and slot release schedules change regularly. Always check service.berlin.de directly for current information.
        </p>
      </div>
      <GuideSidebar currentPage="burgeramt-berlin-appointment" />
      </div>
    </div>
  );
}
