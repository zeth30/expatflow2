import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { DeadlineCalculator } from "../components/guides/DeadlineCalculator";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Deadline Berlin: The 14-Day Rule Explained | ReadyExpat",
  description: "You have 14 calendar days to register your address in Berlin. Berlin appointments often take 3–6 weeks. Here's what the law says, what actually happens in practice, and what a screenshot does for you.",
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
        description: "You have 14 calendar days to register your address in Berlin. In practice, Berlin appointments take 3–6 weeks. Here's what the law says and what actually happens.",
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
          { "@type": "Question", name: "What is the fine for missing the Anmeldung deadline in Berlin?", acceptedAnswer: { "@type": "Answer", text: "Up to €1,000 under §54 BMG — but in practice, fines for first-time late registrations in Berlin are extremely rare. Berlin Bürgeramt appointments regularly take 3–6 weeks, well beyond the 14-day window. The city is aware of this. Book the earliest slot, take a screenshot showing you searched, and you will not be fined." } },
          { "@type": "Question", name: "What if there are no Bürgeramt appointments before my 14-day deadline?", acceptedAnswer: { "@type": "Answer", text: "This is the normal situation in Berlin — not an exception. Book the earliest available slot even if it is 4–5 weeks away. Take a screenshot of the booking portal showing no earlier availability. Keep it. That screenshot is your protection. Berlin offices are well aware that appointment wait times routinely exceed the legal deadline." } },
          { "@type": "Question", name: "Does the 14-day deadline count calendar days or working days?", acceptedAnswer: { "@type": "Answer", text: "Calendar days. Weekends and public holidays count. Move in on a Friday and your deadline is the following Thursday." } },
          { "@type": "Question", name: "What happens if I already missed the Anmeldung deadline?", acceptedAnswer: { "@type": "Answer", text: "Register as soon as you can — don't let it drift further. Book the next available Bürgeramt slot and show up with a complete form. In practice, clerks note the late registration and process you without further action. Fines are not issued to first-time registrants who turn up and complete the process." } },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Anmeldung Deadline</span>
            </div>
            <span className="pill"><span className="dot" />Legal · §17 BMG · Berlin reality check</span>
            <h1 className="hero-title">
              The 14-Day Anmeldung Deadline.
              <span className="accent">What the law says. What actually happens in Berlin.</span>
            </h1>
            <p className="lede">§17 BMG gives you 14 calendar days. Berlin Bürgeramt appointments regularly take 3–6 weeks. The city knows this. A screenshot of your booking attempt is all the protection you need.</p>
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
                <div className="kf-num">Theoretical fine</div>
                <p className="kf-text">Essentially never issued to first-timers with a booked appointment and a screenshot.</p>
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
            <div className="section-head reveal">
              <div className="eyebrow">01 · Your Deadline</div>
              <h2 className="h2">Calculate your <span className="accent">deadline.</span></h2>
            </div>
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
            <div className="section-head reveal">
              <div className="eyebrow">03 · Already Past the Deadline?</div>
              <h2 className="h2">You're not alone. <span className="accent">Here's what to do.</span></h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
              {[
                { n: "1", t: "Stop worrying, start booking", d: "Late registration in Berlin is common — appointments routinely push beyond 14 days. Book the earliest available slot right now at service.berlin.de." },
                { n: "2", t: "Take a screenshot", d: "Screenshot the search results showing no earlier availability. This is your protection. Keep it on your phone until after the appointment." },
                { n: "3", t: "Prepare a complete form", d: "Show up with a correctly filled Anmeldeformular. A complete form signals you came in good faith — important if the clerk mentions the late date." },
                { n: "4", t: "Attend and register", d: "The clerk processes you. In practice, no fine is issued to first-time registrants who show up with documents and a booking screenshot." },
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
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Don't let a wrong form waste your appointment slot.</div>
              <h2>Ready for your appointment. <span className="b">Nothing left to chance.</span></h2>
              <p>ReadyExpat fills all 54 Anmeldeformular fields correctly in German — translations, dates, format. Done in 5 minutes. €15.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">€15 one-time · no subscription · no account needed</div>
            </div>
            <div className="legal">This guide is for general information only. Always verify current requirements at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a>.</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">FAQ</div>
              <h2 className="h2">Common questions.</h2>
            </div>
            <div className="faq reveal">
              <details><summary>How many days do I have to register after moving to Berlin?</summary><div className="ans">14 calendar days from the day you move in, as required by §17 Bundesmeldegesetz (BMG). The clock starts on your move-in date — not when you sign the lease.</div></details>
              <details><summary>What is the fine for missing the Anmeldung deadline?</summary><div className="ans">Up to €1,000 under §54 BMG — but in practice, fines for first-time late registrants in Berlin are extremely rare. Berlin Bürgeramt appointments regularly take 3–6 weeks. The city is aware. Book the earliest slot, keep a screenshot showing you searched, and you will not be fined.</div></details>
              <details><summary>What if there are no Bürgeramt appointments before my deadline?</summary><div className="ans">This is the normal situation in Berlin — not an exception. Book the earliest available slot even if it's 4–5 weeks away. Screenshot the search results showing no earlier availability and keep it. Berlin offices are well aware that wait times routinely exceed the 14-day window. See our <Link href="/burgeramt-berlin-appointment" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>appointment guide</Link> for hacks to find slots faster.</div></details>
              <details><summary>Does the 14-day deadline count calendar days or working days?</summary><div className="ans">Calendar days. Weekends and public holidays count. Move in on a Friday and your deadline is the following Thursday.</div></details>
              <details><summary>What happens if I already missed the Anmeldung deadline?</summary><div className="ans">Book the next available slot and show up with a complete form. In practice, clerks note the late registration and process you without further action. Fines are not issued to first-time registrants who turn up and complete the process.</div></details>
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
