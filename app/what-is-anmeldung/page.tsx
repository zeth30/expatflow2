import type { Metadata } from "next";
import { GuideNav } from "../components/GuideNav";
import { GuideCards } from "../components/GuideCards";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "What is the Anmeldung in Germany? — Complete Guide for Expats | SimplyExpat",
  description: "The Anmeldung is Germany's mandatory address registration. Every resident must do it within 14 days. Here is what it is, why it matters, and exactly how to do it.",
  alternates: { canonical: `${DOMAIN}/what-is-anmeldung` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What is the Anmeldung in Germany? — Complete Guide for Expats | SimplyExpat",
    description: "The Anmeldung is Germany's mandatory address registration. Every resident must do it within 14 days. Here is what it is, why it matters, and exactly how to do it.",
    url: `${DOMAIN}/what-is-anmeldung`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function WhatIsAnmeldung() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is the Anmeldung in Germany? — Complete Guide for Expats",
    description: "The Anmeldung is Germany's mandatory address registration. Every resident must do it within 14 days.",
    url: `${DOMAIN}/what-is-anmeldung`,
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
        }
      `}</style>

      <GuideNav currentPage="what-is-anmeldung" />

      {/* Hero */}
      <div className="guide-hero-pad" style={{ background: "linear-gradient(140deg,#eef5ff 0%,#f8fafc 55%,#f0fdf4 100%)", borderBottom: "1px solid #e8ecf4", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <span style={{ color: "#15803d", fontSize: 11.5, fontWeight: 700 }}>The Basics — Start Here</span>
          </div>
          <h1 className="guide-h1" style={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Germany requires you to<br />register your address.<br />Here is what that means.
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            The Anmeldung is not optional. It is not just for citizens. And the consequences of getting it wrong — or skipping it — follow you for months. Here is everything you need to know.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="guide-content" style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Section 1 */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What the Anmeldung is</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            The Anmeldung (literally &quot;registration&quot;) is Germany&apos;s mandatory address registration system, governed by the Bundesmeldegesetz — specifically §17 BMG. Every person who takes up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in.
          </p>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75 }}>
            This applies to everyone: EU citizens, non-EU nationals, employees, students, freelancers. If you live in Germany, you register. No exceptions based on nationality or intended length of stay.
          </p>
        </div>

        {/* What you cannot do without it */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Why it matters — what you cannot do without it</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
            The Anmeldung is the foundation of life in Germany. Without it, basic services are locked.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "Bank account", body: "German banks require proof of address. The Anmeldebestätigung is the standard document they ask for." },
              { title: "Tax ID (Steueridentifikationsnummer)", body: "Arrives by post 2–4 weeks after registration. Your employer needs it to calculate your salary tax correctly. Without it you are taxed at Steuerklasse 6 — Germany's emergency tax rate — until it arrives." },
              { title: "Health insurance", body: "Public and most private insurers require your registration address for enrolment." },
              { title: "Residence permit", body: "Non-EU nationals applying for a residence permit must be registered. The Ausländerbehörde requires it." },
              { title: "Employment contracts", body: "Many employers need your registered address on file before you can start." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px", borderRadius: 12, border: "1.5px solid #e8ecf4", background: "#f8fafc" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0075FF", flexShrink: 0, marginTop: 8 }} />
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14.5, marginBottom: 3 }}>{item.title}</div>
                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>What you get at the appointment</h2>
          <p style={{ fontSize: 15.5, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>
            After the clerk processes your form, you receive the <strong>Anmeldebestätigung</strong> (also called Meldebescheinigung) — your official proof of registration, printed on the spot.
          </p>
          <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12 }}>
            <p style={{ fontSize: 14.5, color: "#92400e", lineHeight: 1.65, margin: 0 }}>
              <strong>Before you leave the counter:</strong> Check your name spelling, your registered address, and your move-in date on the Anmeldebestätigung. Corrections are much harder after you leave.
            </p>
          </div>
        </div>

        {/* After registration */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>After registration — what to expect</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: "18px 20px", borderRadius: 14, border: "1.5px solid #e8ecf4", background: "white" }}>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 6 }}>Steuer-ID arrives by post</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>Your tax identification number arrives within 2–4 weeks. Make sure your surname is on your letterbox (Briefkasten). Official mail is not delivered to unlabelled mailboxes in Germany.</p>
            </div>
            <div style={{ padding: "18px 20px", borderRadius: 14, border: "1.5px solid #fecaca", background: "#fef2f2" }}>
              <div style={{ fontWeight: 800, color: "#991b1b", fontSize: 15, marginBottom: 6 }}>Rundfunkbeitrag letter will arrive</div>
              <p style={{ fontSize: 14, color: "#7f1d1d", lineHeight: 1.65, margin: 0 }}>Germany&apos;s mandatory public broadcasting fee — €18.36 per household per month. It is not optional. One payment covers everyone in the household.</p>
            </div>
          </div>
        </div>

        {/* Religion field */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>The religion field — read this before you fill in the form</h2>
          <div style={{ padding: "20px 24px", background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16 }}>
            <div style={{ fontWeight: 900, color: "#991b1b", fontSize: 15.5, marginBottom: 10 }}>Declaring a religion adds approximately 8–9% to your income tax bill.</div>
            <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.7, margin: 0 }}>
              The Religionsgesellschaft field on the Anmeldeformular triggers Kirchensteuer (church tax) if you declare a recognised denomination. Leave the field blank or write &quot;OA&quot; (Ohne Angabe — no statement) to avoid it. This has zero negative consequences. If you are already a member and want to leave, that requires a separate process at the Standesamt — it is not done on this form.
            </p>
          </div>
        </div>

        {/* Tourists + Ummeldung */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.02em" }}>Tourists, Ummeldung, and Abmeldung</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Tourists (under 3 months)", body: "Exempt. No registration required for stays shorter than 3 months." },
              { title: "Ummeldung — changing address within Germany", body: "Every time you move to a new address in Germany you must re-register within 14 days. Same process, same Bürgeramt appointment, same 14-day deadline." },
              { title: "Abmeldung — leaving Germany", body: "When leaving Germany permanently, you must deregister within 2 weeks of departure. Failure to do so can affect your tax situation." },
            ].map(item => (
              <div key={item.title} style={{ padding: "16px 20px", borderRadius: 12, border: "1.5px solid #e8ecf4", background: "#f8fafc" }}>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14.5, marginBottom: 4 }}>{item.title}</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More guides */}
        <GuideCards currentPage="what-is-anmeldung" />

        {/* CTA */}
        <div className="guide-cta" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 20, padding: "44px 40px", textAlign: "center", marginBottom: 32 }}>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>The form is in German. All 54 fields.</h3>
          <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            Answer in English. We generate the correct German PDF — every field, every translation, every date in the right format. Ready to print in 5 minutes.
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
          This page is for general information only. Legal requirements may change. Verify current rules at berlin.de or with a qualified legal adviser.
        </p>
      </div>
    </div>
  );
}
