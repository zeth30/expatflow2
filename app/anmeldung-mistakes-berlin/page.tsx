import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { MistakeChecker } from "../components/guides/MistakeChecker";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "6 Anmeldung Mistakes That Get You Turned Away in Berlin | ReadyExpat",
  description: "Getting turned away at the Bürgeramt means losing your appointment slot and waiting weeks for another one. Here are the 6 most common Anmeldung mistakes expats make — and how to avoid every one of them.",
  alternates: { canonical: `${DOMAIN}/anmeldung-mistakes-berlin` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "6 Anmeldung Mistakes That Get You Turned Away in Berlin",
    description: "Missing a document or filling the form wrong wastes your appointment. Here's what goes wrong and how to avoid it.",
    url: `${DOMAIN}/anmeldung-mistakes-berlin`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungMistakesBerlin() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "6 Anmeldung Mistakes That Get You Turned Away at the Bürgeramt",
        description: "The 6 most common Anmeldung mistakes expats make in Berlin — and how to avoid every one.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/anmeldung-mistakes-berlin`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the most common reason for Anmeldung rejection at the Bürgeramt?", acceptedAnswer: { "@type": "Answer", text: "Missing or incorrect Wohnungsgeberbestätigung. The landlord confirmation form is mandatory under §19 BMG. Without it the clerk cannot process your registration. A rental contract alone is not accepted as a substitute." } },
          { "@type": "Question", name: "Can I use a different name than my passport on the Anmeldung form?", acceptedAnswer: { "@type": "Answer", text: "No. The name on the Anmeldeformular must match your passport exactly, including middle names, hyphens, and diacritics. Nicknames, shortened names, or anglicised spellings will cause problems." } },
          { "@type": "Question", name: "What date format does the Anmeldung form use?", acceptedAnswer: { "@type": "Answer", text: "DD.MM.YYYY. All dates — date of birth, move-in date, document dates — must use this format. The US format MM/DD/YYYY is one of the most common errors made by American expats." } },
          { "@type": "Question", name: "What happens if I get turned away at the Bürgeramt?", acceptedAnswer: { "@type": "Answer", text: "You lose the appointment slot and must rebook — which in Berlin can mean waiting 3–6 more weeks. This is particularly serious if you are close to or past the 14-day registration deadline." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung Mistakes", item: `${DOMAIN}/anmeldung-mistakes-berlin` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="" />

      <main className="main">
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Anmeldung Mistakes</span>
            </div>
            <span className="pill"><span className="dot" />Common Errors · Bürgeramt · Rejection Reasons</span>
            <h1 className="hero-title">
              6 Anmeldung Mistakes That Get You Turned Away.
              <span className="accent">Losing your appointment slot means waiting weeks for another one.</span>
            </h1>
            <p className="lede">Berlin Bürgeramt appointments are scarce. Getting turned away at the counter wastes one and restarts your 14-day deadline clock. Don't let a fixable mistake cost you weeks.</p>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">6</text></svg>
                <div className="kf-num">Common mistakes</div>
                <p className="kf-text">Any one of them is enough to get turned away at the counter.</p>
              </div>
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">54</text></svg>
                <div className="kf-num">Form fields</div>
                <p className="kf-text">All in German. All must be correct. One wrong field can void the form.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">6w</text></svg>
                <div className="kf-num">Average wait</div>
                <p className="kf-text">For a new appointment after being turned away in peak season.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-checker">
          <div className="wrap">
            <div className="eyebrow">01 · Mistake Checker</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>Check each one before your appointment</h2>
            <p style={{ color: "#6b7693", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>Tick each mistake you've verified you haven't made.</p>
            <MistakeChecker />
          </div>
        </section>

        <section className="section" id="sec-detail">
          <div className="wrap">
            <div className="eyebrow">02 · In Detail</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>Why each mistake matters</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              {[
                { n: "01", title: "Missing Wohnungsgeberbestätigung", color: "#e11d48", content: "The landlord confirmation form (Wohnungsgeberbestätigung) is legally required under §19 BMG. Without it, registration is impossible — the clerk has no authority to proceed. A rental contract, email from your landlord, or keys receipt does not substitute. The form has a specific format. Download the official blank from the Berlin Senate or use the ReadyExpat pre-filled version." },
                { n: "02", title: "Name doesn't match passport exactly", color: "#d97706", content: "Your name on the form must match your passport precisely. If your passport says 'María José García-López', that is exactly what goes on the form. 'Maria Garcia' will cause a mismatch. Middle names, hyphens, accents, and apostrophes all matter." },
                { n: "03", title: "Leaving required fields blank", color: "#7c3aed", content: "Geschlecht (gender), Staatsangehörigkeit (citizenship), and Tag des Einzugs (move-in date) are the most commonly skipped. Every field with a red asterisk on the official form is mandatory. The clerk checks for completeness before processing." },
                { n: "04", title: "Wrong address format", color: "#0040ff", content: "The street name and house number go in separate fields. The Postleitzahl (postal code) and city are separate fields too. Putting '12 Hauptstraße, 10115 Berlin' into a single field is wrong. Each element belongs in its designated field." },
                { n: "05", title: "Wrong date format", color: "#0891b2", content: "Every date on the Anmeldeformular must be DD.MM.YYYY — zero-padded. Born on March 5, 1990? Write 05.03.1990. The US format (03/05/1990) or ISO format (1990-03-05) are both wrong and cause rejection." },
                { n: "06", title: "Expired or wrong type of identity document", color: "#16a34a", content: "Non-EU citizens must present a passport — not a national ID card. EU/EEA citizens may use a national identity card. All documents must be valid on the day of the appointment. An expired document cannot be accepted regardless of nationality." },
              ].map(({ n, title, color, content }) => (
                <div key={n} className="reveal" style={{ padding: "24px 28px", background: "white", border: "1px solid #e6ebf5", borderRadius: 16, borderLeft: `4px solid ${color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>Mistake {n}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0a1638", marginBottom: 10, letterSpacing: "-0.01em" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7693", lineHeight: 1.7 }}>{content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div style={{ background: "#0a1638", borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  ReadyExpat eliminates all 6 mistakes automatically.
                </div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,.6)" }}>Correct German throughout. All 54 fields. €15 one-time.</div>
              </div>
              <a href="/" style={{ background: "#0040ff", color: "white", fontWeight: 800, fontSize: 15, padding: "16px 28px", borderRadius: 12, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                Prepare My Anmeldung →
              </a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="faq-list">
              <details><summary>What is the most common reason for Anmeldung rejection at the Bürgeramt?</summary><div className="ans">Missing or incorrect Wohnungsgeberbestätigung. The landlord confirmation form is mandatory under §19 BMG. Without it the clerk cannot process your registration. A rental contract alone is not accepted.</div></details>
              <details><summary>Can I use a different name than my passport on the Anmeldung form?</summary><div className="ans">No. The name must match your passport exactly, including middle names, hyphens, and diacritics.</div></details>
              <details><summary>What date format does the Anmeldung form use?</summary><div className="ans">DD.MM.YYYY. All dates must use this format. The US format MM/DD/YYYY is one of the most common errors made by American expats.</div></details>
              <details><summary>What happens if I get turned away at the Bürgeramt?</summary><div className="ans">You lose the appointment slot and must rebook — which in Berlin can mean waiting 3–6 more weeks. See our <Link href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>appointment guide</Link> for how to find slots faster.</div></details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/anmeldung-documents", label: "Document Checklist" },
                { href: "/wohnungsgeberbestaetigung", label: "Wohnungsgeberbestätigung" },
                { href: "/anmeldung-deadline-berlin", label: "The 14-Day Deadline" },
                { href: "/burgeramt-berlin-appointment", label: "Book an Appointment" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e6ebf5", background: "white", color: "#0a1638", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
