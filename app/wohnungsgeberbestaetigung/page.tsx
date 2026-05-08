import type { Metadata } from "next";
import { GuideNav } from "../components/GuideNav";
import { GuideCards } from "../components/GuideCards";

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
        .guide-content { padding: 56px 40px 80px; }
        @media(max-width:640px){
          .guide-h1 { font-size: 28px !important; }
          .guide-content { padding: 36px 18px 60px !important; }
          .guide-hero-pad { padding: 48px 18px 44px !important; }
          .guide-cta { padding: 36px 22px !important; }
          .email-template { font-size: 13px !important; padding: 18px !important; }
        }
      `}</style>

      <GuideNav currentPage="wohnungsgeberbestaetigung" />

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
      <div className="guide-content" style={{ maxWidth: 760, margin: "0 auto" }}>

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
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            Request it the moment you confirm your move-in date — ideally at the same time you sign your lease. The blank form is available to download from berlin.de. Email it to your landlord and ask them to sign and return it before your move-in date.
          </p>
          <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 14.5, color: "#92400e", lineHeight: 1.65, margin: 0 }}>
              <strong>Always request in writing.</strong> Email your landlord — not a phone call, not WhatsApp. If they delay or later deny providing the form, your email is your proof that you asked. This matters if the situation escalates.
            </p>
          </div>

          {/* Email template */}
          <div style={{ borderRadius: 14, border: "1.5px solid #e8ecf4", overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e8ecf4" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Template email — copy and send to your landlord</span>
            </div>
            <div className="email-template" style={{ padding: "22px 24px", background: "white", fontFamily: "monospace", fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{`Betreff: Wohnungsgeberbestätigung — [Ihre Adresse]

Sehr geehrte Damen und Herren,

hiermit bitte ich Sie, mir die Wohnungsgeberbestätigung gemäß § 19 Bundesmeldegesetz auszustellen.

Mein Einzugsdatum: [DATUM]
Adresse: [STRASSE, HAUSNUMMER, ETAGE, ORT]

Ich benötige das Dokument für meine Anmeldung beim Bürgeramt.

Bitte senden Sie das ausgefüllte und unterschriebene Formular an diese E-Mail-Adresse zurück.

Mit freundlichen Grüßen,
[IHR NAME]`}</div>
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

        {/* More guides */}
        <GuideCards currentPage="wohnungsgeberbestaetigung" />

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
    </div>
  );
}
