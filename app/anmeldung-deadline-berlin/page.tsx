import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { DeadlineCalculator } from "../components/guides/DeadlineCalculator";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Deadline Berlin: The 14-Day Rule Explained | ReadyExpat",
  description: "You have 14 days to register your address in Berlin after moving in. Miss it and face a fine up to €1,000. Here's what the law says, what actually happens, and what to do if you've already missed it.",
  alternates: { canonical: `${DOMAIN}/anmeldung-deadline-berlin` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Deadline Berlin: The 14-Day Rule Explained",
    description: "14 days to register. Fine up to €1,000. Here's the full breakdown plus a deadline calculator.",
    url: `${DOMAIN}/anmeldung-deadline-berlin`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungDeadlineBerlin() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The 14-Day Anmeldung Deadline in Berlin Explained",
        description: "You have 14 days to register your address in Berlin after moving in. Miss it and face a fine up to €1,000.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/anmeldung-deadline-berlin`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How many days do I have to register after moving to Berlin?", acceptedAnswer: { "@type": "Answer", text: "14 calendar days from the day you move in, as required by §17 Bundesmeldegesetz (BMG). The clock starts on your move-in date — not when you sign the lease." } },
          { "@type": "Question", name: "What is the fine for missing the Anmeldung deadline in Berlin?", acceptedAnswer: { "@type": "Answer", text: "Up to €1,000 under §54 BMG. In practice the fine is rarely enforced if you register as soon as possible and can show you were trying — for example by showing an appointment booking screenshot." } },
          { "@type": "Question", name: "What if there are no Bürgeramt appointments before my 14-day deadline?", acceptedAnswer: { "@type": "Answer", text: "Book the earliest available appointment and take a screenshot showing you searched. Authorities are aware that Berlin appointments are hard to get. Showing documented intent is almost always sufficient to avoid a fine." } },
          { "@type": "Question", name: "Does the 14-day deadline count calendar days or working days?", acceptedAnswer: { "@type": "Answer", text: "Calendar days. Weekends and public holidays count. Move in on a Friday and your deadline is the following Thursday." } },
          { "@type": "Question", name: "What happens if I already missed the Anmeldung deadline?", acceptedAnswer: { "@type": "Answer", text: "Register as soon as you can. The Bürgeramt clerk may note the late registration, but fines for first-time late registrations are uncommon in Berlin, especially when the delay is short. Do not wait further." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung Deadline", item: `${DOMAIN}/anmeldung-deadline-berlin` },
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
        {/* Hero */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Anmeldung Deadline</span>
            </div>
            <span className="pill"><span className="dot" />Legal · §17 BMG · Fine up to €1,000</span>
            <h1 className="hero-title">
              The 14-Day Anmeldung Deadline.
              <span className="accent">What the law says. What actually happens. What to do.</span>
            </h1>
            <p className="lede">§17 Bundesmeldegesetz gives you 14 calendar days after moving in. The fine is real. The leniency is also real — but only if you act.</p>
          </div>
        </section>

        {/* Key facts */}
        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">14</text></svg>
                <div className="kf-num">Calendar days</div>
                <p className="kf-text">From move-in day. Not working days. Weekends count.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">€1k</text></svg>
                <div className="kf-num">Maximum fine</div>
                <p className="kf-text">Rarely enforced for first offence when you register promptly.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">§17</text></svg>
                <div className="kf-num">The law</div>
                <p className="kf-text">Bundesmeldegesetz §17. Applies to every person, every nationality.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="section" id="sec-calc">
          <div className="wrap">
            <div className="eyebrow">01 · Your Deadline</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>Calculate your deadline</h2>
            <DeadlineCalculator />
          </div>
        </section>

        {/* The law */}
        <section className="section" id="sec-law">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="mob-2col-wide">
                <div>
                  <div className="eyebrow">02 · The Law</div>
                  <h3 style={{ marginTop: 14 }}>§17 BMG — word for word</h3>
                  <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7, fontStyle: "italic" }}>
                    "Wer eine Wohnung bezieht, hat sich innerhalb von zwei Wochen nach dem Einzug bei der Meldebehörde anzumelden."
                  </p>
                  <p style={{ marginTop: 12, fontSize: 14, color: "rgba(255,255,255,.55)" }}>
                    "Anyone who moves into a dwelling must register with the registration authority within two weeks of moving in."
                  </p>
                </div>
                <div className="mob-no-border-left" style={{ paddingTop: 6, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 48 }}>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>The fine (§54 BMG)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Late registration", amount: "up to €1,000" },
                      { label: "False information on form", amount: "up to €5,000" },
                      { label: "No registration at all", amount: "up to €1,000" },
                    ].map(({ label, amount }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,.06)", borderRadius: 10 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#f87171" }}>{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Already missed it */}
        <section className="section" id="sec-missed">
          <div className="wrap">
            <div className="eyebrow">03 · Already Missed It?</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>What to do now</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
              {[
                { n: "1", t: "Don't wait any longer", d: "Every extra day increases your exposure. Register this week regardless of how late you are." },
                { n: "2", t: "Book any available appointment", d: "Go to service.berlin.de right now. Take the first slot available, even if it's in 3 weeks." },
                { n: "3", t: "Screenshot your booking attempt", d: "Screenshot the appointment search showing limited availability. This is your evidence of intent." },
                { n: "4", t: "Prepare your form", d: "Have a complete, correct Anmeldeformular ready. A complete form shows you came prepared." },
                { n: "5", t: "Attend and register", d: "The clerk may note the late registration. In most cases no further action follows for first-time registrants." },
              ].map(({ n, t, d }) => (
                <div key={n} className="reveal" style={{ display: "flex", gap: 16, padding: "16px 20px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#eff6ff", color: "#0040ff", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#0a1638", marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.55 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="wrap">
            <div style={{ background: "#0a1638", borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  Don't let a wrong form waste your appointment slot.
                </div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,.6)" }}>ReadyExpat fills all 54 fields correctly in German. 5 minutes. €15.</div>
              </div>
              <a href="/" style={{ background: "#0040ff", color: "white", fontWeight: 800, fontSize: 15, padding: "16px 28px", borderRadius: 12, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                Prepare My Anmeldung →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">FAQ</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>Common questions</h2>
            <div className="faq-list">
              <details><summary>How many days do I have to register after moving to Berlin?</summary><div className="ans">14 calendar days from the day you move in, as required by §17 Bundesmeldegesetz (BMG). The clock starts on your move-in date — not when you sign the lease.</div></details>
              <details><summary>What is the fine for missing the Anmeldung deadline?</summary><div className="ans">Up to €1,000 under §54 BMG. In practice the fine is rarely enforced if you register as soon as possible and can show you were trying — for example with an appointment booking screenshot.</div></details>
              <details><summary>What if there are no Bürgeramt appointments before my deadline?</summary><div className="ans">Book the earliest available appointment and take a screenshot showing you searched. Authorities are aware that Berlin appointments are hard to get. Documented intent is almost always sufficient to avoid a fine. See our <Link href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>appointment guide</Link> for hacks to find slots faster.</div></details>
              <details><summary>Does the 14-day deadline count calendar days or working days?</summary><div className="ans">Calendar days. Weekends and public holidays count. Move in on a Friday and your deadline is the following Thursday.</div></details>
              <details><summary>What happens if I already missed the Anmeldung deadline?</summary><div className="ans">Register as soon as you can. Fines for first-time late registrations are uncommon in Berlin, especially when the delay is short. Do not wait further.</div></details>
            </div>
          </div>
        </section>

        {/* Related links */}
        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/what-is-anmeldung", label: "What is Anmeldung?" },
                { href: "/anmeldung-documents", label: "Document Checklist" },
                { href: "/burgeramt-berlin-appointment", label: "Book an Appointment" },
                { href: "/anmeldung-mistakes-berlin", label: "Common Mistakes" },
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
