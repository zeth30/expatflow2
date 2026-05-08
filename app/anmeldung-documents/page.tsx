import type { Metadata } from "next";
import { GuideNav } from "../components/GuideNav";
import { GuideSidebar } from "../components/GuideSidebar";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Documents Checklist — What to Bring to Your Bürgeramt | SimplyExpat",
  description: "Missing one document means your Bürgeramt appointment fails and you wait weeks for a new one. Here is the exact checklist of what to bring to your Anmeldung.",
  alternates: { canonical: `${DOMAIN}/anmeldung-documents` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Documents Checklist — What to Bring to Your Bürgeramt | SimplyExpat",
    description: "Missing one document means your Bürgeramt appointment fails and you wait weeks for a new one. Here is the exact checklist of what to bring to your Anmeldung.",
    url: `${DOMAIN}/anmeldung-documents`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

function CheckIcon() {
  return (
    <div style={{ width: 24, height: 24, borderRadius: 7, background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l2.8 2.8 5.2-5.2" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function AnmeldungDocuments() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Anmeldung Documents Checklist — What to Bring to Your Bürgeramt",
    description: "Missing one document means your Bürgeramt appointment fails and you wait weeks for a new one.",
    url: `${DOMAIN}/anmeldung-documents`,
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

      <GuideNav currentPage="anmeldung-documents" />

      {/* Hero */}
      <div className="guide-hero-pad" style={{ background: "linear-gradient(140deg,#f0fdf4 0%,#f8fafc 55%,#eef5ff 100%)", borderBottom: "1px solid #e8ecf4", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <span style={{ color: "#dc2626", fontSize: 11.5, fontWeight: 700 }}>Do Not Miss a Single Item</span>
          </div>
          <h1 className="guide-h1" style={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Show up missing one<br />document and they send<br />you home.
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            Here is the exact checklist of what to bring to your Bürgeramt appointment — and what happens if you arrive without it.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="guide-wrap">
      <div className="guide-main">

        {/* Required for everyone */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "4px 12px", marginBottom: 16 }}>
            <span style={{ color: "#dc2626", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Required — Everyone</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 18, letterSpacing: "-0.02em" }}>Documents every person must bring</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Valid passport or national ID", body: "EU citizens may use their national identity card. Non-EU citizens must bring their passport — national IDs from outside the EU are not accepted at the Bürgeramt for Anmeldung purposes." },
              { title: "Wohnungsgeberbestätigung", body: "Your landlord's signed confirmation that you have moved into the address. This is a legally required separate form — your rental contract alone is not accepted. Without it, the appointment ends before it begins." },
              { title: "Completed Anmeldeformular", body: "The official registration form, filled in German. All fields. Every date in DD.MM.YYYY format. Every field label is in German. The clerk will not help you fill it in at the counter." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", borderRadius: 14, border: "1.5px solid #fecaca", background: "#fef2f2" }}>
                <CheckIcon />
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Situation-specific */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "4px 12px", marginBottom: 16 }}>
            <span style={{ color: "#92400e", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Required — Situation Dependent</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 18, letterSpacing: "-0.02em" }}>Additional documents by situation</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { situation: "Non-EU citizens", title: "Current visa or residence permit (Aufenthaltstitel)", body: "Bring your passport plus your current visa or residence permit. If you do not yet have a residence permit, bring your entry visa. Register as early as possible — your Anmeldebestätigung is required for the residence permit application." },
              { situation: "Married", title: "Marriage certificate", body: "A certified German translation is ideal. In practice, Berlin Bürgerämter often accept English-language certificates — but this varies by office. Call your specific Bürgeramt to confirm before your appointment." },
              { situation: "Registering children", title: "Birth certificate for each child", body: "Original or certified copy. If the document is not in German, bring a certified translation." },
              { situation: "Registering multiple people", title: "One Anmeldeformular per two people", body: "The form allows up to two people per sheet. If you are registering three or more people, you need multiple completed forms. Bring one form per pair." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", borderRadius: 14, border: "1.5px solid #fde68a", background: "#fffbeb" }}>
                <CheckIcon />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{item.situation}</div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div style={{ marginBottom: 48, padding: "22px 26px", background: "#fef2f2", border: "2px solid #ef4444", borderRadius: 18 }}>
          <div style={{ fontWeight: 900, color: "#b91c1c", fontSize: 17, marginBottom: 10 }}>If you are missing any document, the clerk will turn you away.</div>
          <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.7, margin: "0 0 10px" }}>
            No exceptions. No coming back in an hour. You lose your appointment and you start the booking process again — which in Berlin means waiting another 3 to 4 weeks for a new slot.
          </p>
          <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.7, margin: 0 }}>
            Check your checklist the night before. Check it again in the morning.
          </p>
        </div>

        {/* Form notes */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Critical form requirements</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Date format", body: "DD.MM.YYYY — not MM/DD/YYYY. Your move-in date, date of birth, and document dates must all use this format. US expats: this trips up almost everyone." },
              { label: "Language", body: "Every field on the Anmeldeformular is in German. Every entry must be in German. The religion field (Religionsgesellschaft) should be left blank or written as \"OA\" (Ohne Angabe) unless you want to pay church tax — approximately 8–9% of your income tax." },
              { label: "Signature", body: "Sign the form after printing. Not before. The signature goes at the bottom of the form (Datum, Unterschrift). Signing before printing and then printing on top of the signature is not accepted." },
            ].map(item => (
              <div key={item.label} style={{ padding: "16px 20px", borderRadius: 12, border: "1.5px solid #e8ecf4", background: "#f8fafc" }}>
                <div style={{ fontWeight: 800, color: "#0075FF", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Letterbox tip */}
        <div style={{ marginBottom: 48, padding: "18px 22px", background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#14532d", fontSize: 14.5, marginBottom: 5 }}>Before your appointment: check your letterbox</div>
            <p style={{ fontSize: 13.5, color: "#166534", lineHeight: 1.65, margin: 0 }}>
              Add your surname to your Briefkasten (letterbox) if it is not already there. Your Steuer-ID and all official mail will be sent to your registered address. In Germany, mail is not delivered to unlabelled letterboxes.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="guide-cta" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 20, padding: "44px 40px", textAlign: "center", marginBottom: 32 }}>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>One wrong field means a failed appointment.</h3>
          <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            SimplyExpat fills every field correctly in German — dates, translations, format. You answer in English. We handle the rest.
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
          This page is for general information only. Document requirements may vary by Bürgeramt location. Verify current requirements at berlin.de before your appointment.
        </p>
      </div>
      <GuideSidebar currentPage="anmeldung-documents" />
      </div>
    </div>
  );
}
