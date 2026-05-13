import type { Metadata } from "next";
import { SharedNav } from "../components/SharedNav";
import { GuideSidebar } from "../components/GuideSidebar";
import { AppFooter } from "../components/AppFooter";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Wohnungsgeberbestätigung — What It Is and How to Get It | SimplyExpat",
  description: "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away. Here is exactly what it is and how to get it.",
  alternates: { canonical: `${DOMAIN}/wohnungsgeberbestaetigung` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Wohnungsgeberbestätigung — What It Is and How to Get It | SimplyExpat",
    description: "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away. Here is exactly what it is and how to get it.",
    url: `${DOMAIN}/wohnungsgeberbestaetigung`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function Wohnungsgeberbestaetigung() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wohnungsgeberbestätigung — What It Is and How to Get It",
    description: "Your landlord must sign the Wohnungsgeberbestätigung before your Anmeldung. Without it the Bürgeramt turns you away.",
    url: `${DOMAIN}/wohnungsgeberbestaetigung`,
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
          .email-template { font-size: 13px !important; padding: 18px !important; }
        }
      `}</style>

      <SharedNav currentPage="wohnungsgeberbestaetigung" />

      {/* Hero */}
      <div className="guide-hero-pad" style={{ background: "linear-gradient(140deg,#fff7ed 0%,#f8fafc 55%,#eef5ff 100%)", borderBottom: "1px solid #e8ecf4", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <span style={{ color: "#c2410c", fontSize: 11.5, fontWeight: 700 }}>Required Before Your Appointment</span>
          </div>
          <h1 className="guide-h1" style={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.03em" }}>
            No Wohnungsgeberbestätigung,<br />no Anmeldung.
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            Here is what it is, how to get it fast, and exactly what to do if your landlord is being difficult.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="guide-wrap">
      <div className="guide-main">

        {/* What it is */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What it is</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            The Wohnungsgeberbestätigung is a legally required landlord confirmation form, mandated by §19 of the Bundesmeldegesetz. Its purpose is simple: your landlord confirms in writing that you have moved into the address on a specific date.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            Without it, the Bürgeramt cannot register you. Your rental contract is not a substitute. A lease agreement, a key handover receipt, a bank statement showing rent payments — none of these replace it. The signed Wohnungsgeberbestätigung is the only document the Bürgeramt accepts.
          </p>
          <div style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: 12, border: "1.5px solid #e8ecf4" }}>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>
              <strong>What the form contains:</strong> your full name, your move-in date, the full address (street, house number, floor, flat number if applicable), and the landlord&apos;s or main tenant&apos;s signature.
            </p>
          </div>
        </div>

        {/* Who can sign */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Who can sign it</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Your landlord (Vermieter)", body: "The property owner or the property management company acting on their behalf. This is the standard case for most rental agreements." },
              { title: "The main tenant (Hauptmieter) — subletting situations", body: "If you are subletting a room or flat, the main tenant on the lease can sign — but only if the landlord has authorised the sublet. If the sublet is not authorised, the situation is legally complicated. See the section below." },
            ].map(item => (
              <div key={item.title} style={{ padding: "18px 20px", borderRadius: 14, border: "1.5px solid #e8ecf4", background: "#f8fafc" }}>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When and how to request */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>When and how to request it</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            Most landlords include this form in your move-in documents automatically — check your email and paperwork before doing anything else. If it is there, signed, you are done with this step.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            If your landlord has not provided it, email them the blank template below and ask them to sign and return it before your Bürgeramt appointment. Do this in writing — email, not a phone call or WhatsApp message. If they later delay or deny it, your email is your proof that you asked.
          </p>

          {/* Download template */}
          <div style={{ borderRadius: 14, border: "1.5px solid #fde68a", overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", background: "#fffbeb", borderBottom: "1px solid #fde68a" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e", letterSpacing: "0.06em", textTransform: "uppercase" }}>Only if your landlord has not provided it — download and send to them</span>
            </div>
            <div style={{ padding: "20px 22px", background: "white" }}>
              <a href="/wg-template.pdf" download="Wohnungsgeberbestaetigung-Vorlage.pdf"
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 10, background: "#fffbeb", border: "1.5px solid #fde68a", textDecoration: "none", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "white", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 2 }}>Download Wohnungsgeberbestätigung Template</div>
                  <div style={{ fontSize: 12, color: "#92400e" }}>Blank PDF — print, send to landlord, ask them to sign and return</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
              <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e8ecf4" }}>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: "0 0 12px" }}>
                  This is the blank template. If you would like a version with your name, address, and move-in date already filled in, SimplyExpat generates it as part of the Anmeldung preparation.
                </p>
                <a href="/#wizard/origin" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, background: "#0075FF", color: "white", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  Prepare my Anmeldung
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Landlord refuses */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What if your landlord refuses or delays?</h2>
          <div style={{ padding: "20px 24px", background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16, marginBottom: 20 }}>
            <div style={{ fontWeight: 900, color: "#991b1b", fontSize: 15, marginBottom: 8 }}>Refusal without legal reason is against the law.</div>
            <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.7, margin: 0 }}>
              §19 BMG requires landlords to provide the Wohnungsgeberbestätigung within two weeks of your move-in. Refusal without a valid legal reason is a regulatory offence — the landlord faces a fine of up to €1,000. Inform your landlord of this in writing if they are stalling.
            </p>
          </div>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
            If a landlord refuses entirely and you cannot resolve it, contact the Berliner Mieterverein (Berlin Tenants&apos; Association) or seek legal advice. In the meantime, attend the Bürgeramt and explain the situation — they may be able to advise on alternatives, though they cannot register you without the form.
          </p>
        </div>

        {/* Subletting */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Subletting situations</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            If you are renting a room in a shared flat (WG), the main tenant on the lease can provide the Wohnungsgeberbestätigung — provided the landlord has given written permission for the sublet.
          </p>
          <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12 }}>
            <p style={{ fontSize: 14.5, color: "#92400e", lineHeight: 1.7, margin: 0 }}>
              <strong>Warning:</strong> If your main tenant says they cannot provide the form, this may indicate the sublet is not authorised by the building owner. This is a legal grey area. The Bürgeramt will usually still register you if you have other documentary evidence of residence — but get specific advice for your situation.
            </p>
          </div>
        </div>

        {/* Airbnb */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Airbnb and short-term rentals</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75 }}>
            Most short-term accommodation — Airbnb, hotels, hostels — will not provide the Wohnungsgeberbestätigung. Some long-term serviced apartments (28+ days) do, but it varies. If registration timing matters to you, confirm whether the form will be provided before you book.
          </p>
        </div>

        {/* CTA */}
        <div className="guide-cta" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 20, padding: "44px 40px", textAlign: "center", marginBottom: 32 }}>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>The Wohnungsgeberbestätigung is one document.<br />The form is another.</h3>
          <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            SimplyExpat handles the Anmeldeformular — all 54 fields in German, ready to print. You focus on getting your landlord to sign.
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
          This page is for general information only and does not constitute legal advice. Requirements may change. Verify current requirements at berlin.de.
        </p>
      </div>
      <GuideSidebar currentPage="wohnungsgeberbestaetigung" />
      </div>
      <AppFooter />
    </div>
  );
}
