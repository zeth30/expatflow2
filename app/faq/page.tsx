// Submit sitemap to bing.com/webmaster to enable ChatGPT Search indexing
import type { Metadata } from "next";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Germany FAQ — Complete Registration Guide | SimplyExpat",
  description:
    "Every question answered about Germany's mandatory Anmeldung registration. 14-day deadline, required documents, Bürgeramt appointments, online registration, and what happens after.",
  keywords: [
    "Anmeldung Germany FAQ",
    "how to register in Germany",
    "Bürgeramt appointment Berlin",
    "Wohnungsgeberbestätigung",
    "Anmeldung documents needed",
    "Germany residence registration expat",
    "Anmeldung online Germany",
  ].join(", "),
  alternates: { canonical: `${DOMAIN}/faq` },
  openGraph: {
    title: "Anmeldung FAQ — Complete Germany Registration Guide",
    description:
      "Every question expats ask about Germany's mandatory address registration. Deadlines, documents, Bürgeramt tips, and more.",
    url: `${DOMAIN}/faq`,
    siteName: "SimplyExpat Berlin",
    locale: "en_US",
    type: "article",
    modifiedTime: "2026-05-05T00:00:00.000Z",
    publishedTime: "2026-04-28T00:00:00.000Z",
  },
};

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "basics",
    title: "The Basics",
    color: "#0075FF",
    bg: "#eff6ff",
    border: "#bfdbfe",
    faqs: [
      {
        q: "What is the Anmeldung in Germany?",
        a: "The Anmeldung is Germany's mandatory address registration. Everyone living in Germany — regardless of nationality — must register their address at the local Bürgeramt (citizens' office). It is required by law under the Bundesmeldegesetz. You need it to open a bank account, get health insurance, receive your tax ID, and start a job.",
      },
      {
        q: "Who needs to do the Anmeldung?",
        a: "Everyone who lives in Germany needs to register — EU citizens, non-EU nationals, students, employees, and long-term renters alike. Tourists and visitors staying less than 3 months are exempt. If you are renting an apartment, working, or studying in Germany, you need the Anmeldung.",
      },
      {
        q: "When do you have to do Anmeldung?",
        a: "You have 14 days from your move-in date (§17 BMG). The law allows fines up to €1,000 for late registration — but in practice this is extremely rare. In cities like Berlin, Bürgeramt appointments are often booked out 3–4 weeks in advance, so most people end up registering late through no fault of their own. Book the earliest available slot and keep a screenshot as evidence. Offices understand this.",
      },
      {
        q: "What documents do I need for Anmeldung?",
        a: "Three things: (1) A valid passport or national ID. (2) The Wohnungsgeberbestätigung — a form signed by your landlord confirming your move-in date and address. (3) The completed Anmeldeformular (registration form). Non-EU nationals should also bring their visa or residence permit. If married, bring a certified German translation of your marriage certificate.",
      },
      {
        q: "What is the Wohnungsgeberbestätigung?",
        a: "It is a mandatory landlord confirmation form required by §19 of the Bundesmeldegesetz. Your landlord signs it to confirm you live at the address. Without it the Bürgeramt cannot register you — your rental contract alone is not accepted. Request it the moment you sign your lease. Email your landlord in writing so you have a paper trail if they are slow.",
      },
      {
        q: "Can I register from an Airbnb or hotel?",
        a: "Generally no. Hotels, hostels, and most Airbnbs will not provide the Wohnungsgeberbestätigung needed to register. Some long-term serviced apartments (28+ days) may provide it — always confirm before booking if registration matters to your timeline.",
      },
    ],
  },
  {
    id: "appointment",
    title: "Booking Your Appointment",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
    faqs: [
      {
        q: "How do I book a Bürgeramt appointment in Berlin?",
        a: "Book at service.berlin.de. Check early in the morning for the best availability — new slots are released in batches and go quickly. Outer districts like Marzahn, Lichtenberg, and Spandau typically have more slots than central offices in Mitte or Charlottenburg. You can also call 115 during business hours to ask about cancellations.",
      },
      {
        q: "What happens at the Anmeldung appointment?",
        a: "You hand over your completed form and documents. The clerk checks everything — if you are missing your Wohnungsgeberbestätigung, passport, or required translations, they will turn you away on the spot. That means booking a new appointment and waiting another 3 weeks. Berlin clerks follow the rules strictly and will not make exceptions. Show up with every document on the checklist or do not go. A correctly filled form in proper German is your best defence — clerks process hundreds of cases a day and have no patience for errors. If everything is in order, the appointment itself takes 5 to 10 minutes. You walk out with your Anmeldebestätigung printed on the spot. Check the name spelling, address, and dates before you leave.",
      },
      {
        q: "What if there are no Bürgeramt appointments available before the 14-day deadline?",
        a: "Book the earliest available slot and keep evidence that you tried — a screenshot of the booking portal is enough. In practice, Berlin offices are well aware that wait times regularly exceed two weeks and are understanding about delays caused by the appointment system itself.",
      },
    ],
  },
  {
    id: "online",
    title: "Online Registration",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    faqs: [
      {
        q: "Can I do the Anmeldung online?",
        a: "Online registration exists but only works for a very small group. You can only register online if you are an EU or EEA citizen with a German or EU eID card with the Online-Ausweis chip activated, are already registered in Germany, and are moving within Germany — not arriving from abroad for the first time. Cities currently offering it include Berlin, Hamburg, and Bremen. Available since October 2024.",
      },
      {
        q: "I am not an EU citizen — can I register online?",
        a: "No. Online registration requires a German or EU eID card, which only EU and EEA citizens can obtain. If you are from the US, UK, India, Brazil, or any non-EU country, you must register in person at your local Bürgeramt. This affects the vast majority of international expats moving to Germany.",
      },
    ],
  },
  {
    id: "after",
    title: "After Registration",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    faqs: [
      {
        q: "What do I get after the Anmeldung?",
        a: "You receive the Anmeldebestätigung (also called Meldebescheinigung) — your official registration certificate — printed on the spot at your appointment. Keep multiple copies. You need it to open a German bank account, enroll in health insurance, start employment, and for most other official processes in Germany.",
      },
      {
        q: "What is the Steuer-ID and when does it arrive?",
        a: "Your Steuer-Identifikationsnummer (tax ID) is a permanent 11-digit number assigned by the Bundeszentralamt für Steuern. It is mailed to your registered address 2–4 weeks after a successful Anmeldung. Make sure your name is on your mailbox — mail is not delivered to unmarked letterboxes in Germany.",
      },
      {
        q: "What is the Rundfunkbeitrag letter I received?",
        a: "It is Germany's public broadcasting fee — €18.36 per household per month in 2025, regardless of how many people live there. You automatically receive this letter after registering. It is not optional. SimplyExpat does not cover this process — it is a separate registration.",
      },
      {
        q: "Do I need to re-register when I move to a new address in Germany?",
        a: "Yes. Every address change requires a new Ummeldung (re-registration) within 14 days, using the same process. When leaving Germany permanently, complete an Abmeldung (de-registration) within two weeks of departure.",
      },
    ],
  },
  {
    id: "simplyexpat",
    title: "About SimplyExpat",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#e2e8f0",
    faqs: [
      {
        q: "Why would I pay €15 to fill out a form?",
        a: "The Anmeldung form is in German with no official English version. One wrong field — wrong date format, wrong marital status code, wrong religion entry — means your appointment fails and you start over, sometimes weeks later. SimplyExpat guides you through every field in plain English, formats everything correctly for German authorities, and generates a print-ready PDF in 5 minutes. The €15 buys you certainty and saves you weeks of potential delay.",
      },
      {
        q: "What exactly does SimplyExpat do?",
        a: "SimplyExpat guides you through your Anmeldung form in English. You answer simple questions in your language, we translate and format everything correctly, and you download a completed PDF ready to bring to your Bürgeramt appointment. The in-person appointment is still required — we make sure your paperwork is perfect before you walk in.",
      },
      {
        q: "How much does SimplyExpat cost?",
        a: "A one-time fee of €15. No subscription, no account required, no hidden costs. Pay once and download your completed Anmeldung PDF immediately.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes. SimplyExpat operates a strict Zero Storage policy. Your data exists only in your browser during your active session. Nothing is sent to or stored on our servers — no database, no logs, no personal data retention of any kind. When you close the tab, your data is permanently gone.",
      },
      {
        q: "Is SimplyExpat an official German government service?",
        a: "No. SimplyExpat is an independent service, not affiliated with any German government authority. Always use your city's official website to book your Bürgeramt appointment and verify current requirements.",
      },
    ],
  },
];

const TOTAL_QUESTIONS = SECTIONS.reduce((n, s) => n + s.faqs.length, 0);

const LAST_UPDATED = "2026-05-05";
const LAST_UPDATED_DISPLAY = "May 2026";

export default function FAQPage() {
  const allFaqs = SECTIONS.flatMap((s) => s.faqs);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: LAST_UPDATED,
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to complete the Anmeldung in Berlin (address registration)",
    description: "Step-by-step guide to registering your address at a Berlin Bürgeramt. Required by law within 14 days of moving in (§17 BMG).",
    totalTime: "P14D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "15" },
    supply: [
      { "@type": "HowToSupply", name: "Valid passport or national ID card" },
      { "@type": "HowToSupply", name: "Wohnungsgeberbestätigung (landlord confirmation form, signed)" },
      { "@type": "HowToSupply", name: "Completed Anmeldung form" },
      { "@type": "HowToSupply", name: "Visa or residence permit (non-EU nationals only)" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Get the Wohnungsgeberbestätigung from your landlord",
        text: "Request the landlord confirmation form (Wohnungsgeberbestätigung) on your move-in day. Your landlord is legally required to provide it under §19 BMG. Email them in writing so you have a paper trail. Without this form the Bürgeramt cannot register you — your rental contract alone is not accepted.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Fill in the Anmeldung form in English",
        text: "Go to simplyexpat.de and answer the guided questions in plain English. SimplyExpat translates everything into correct German and generates an official PDF with all 54 fields completed. This takes about 5 minutes and costs €15.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Book a Bürgeramt appointment as early as possible",
        text: "Book at service.berlin.de. Check early in the morning for the best slot availability — new slots are released in batches and go quickly. Outer districts like Marzahn and Lichtenberg have more availability than central offices. Keep a screenshot of your booking as evidence you tried within the 14-day window.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Print your completed form",
        text: "Print the PDF on plain white paper. DM or Rossmann self-service kiosks charge approximately €0.10–0.15 per page. The Bürgeramt does not accept digital forms shown on a phone screen.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Attend your Bürgeramt appointment",
        text: "Bring your printed form, passport or ID, Wohnungsgeberbestätigung, and any additional documents. The appointment takes 5–10 minutes. Sign the form at the office after printing — do not sign before. Check your Anmeldebestätigung for errors before leaving.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Collect your Anmeldebestätigung and await your Steuer-ID",
        text: "Your Anmeldebestätigung (registration certificate) is printed on the spot. Your Steuer-ID (tax identification number) arrives by post to your registered address within 2–4 weeks. Make sure your surname is on your letterbox — official mail is not delivered to unlabelled mailboxes in Germany.",
      },
    ],
  };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: 0, background: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <style>{`
        details summary { list-style: none; cursor: pointer; user-select: none; }
        details summary::-webkit-details-marker { display: none; }
        details summary::marker { display: none; }
        .faq-chevron { transition: transform 0.22s ease; flex-shrink: 0; color: #94a3b8; }
        details[open] .faq-chevron { transform: rotate(180deg); color: #0075FF; }
        details[open] { background: #fafcff !important; }
        details[open] > summary { color: #0075FF !important; }
        details > div { animation: faqSlide 0.18s ease; }
        @keyframes faqSlide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .faq-item { transition: border-color 0.15s, box-shadow 0.15s; }
        .faq-item:hover { border-color: #bfdbfe !important; box-shadow: 0 2px 12px rgba(0,117,255,0.07); }
        .section-jump:hover { background: #eff6ff !important; color: #0075FF !important; }
        @media (max-width: 640px) {
          .faq-h1 { font-size: 30px !important; }
          .faq-nav-wrap { padding: 0 16px !important; }
          .faq-content { padding: 32px 16px 64px !important; }
          .faq-cta { padding: 36px 22px !important; }
          .faq-stats { gap: 20px !important; }
          .faq-hero-pad { padding: 40px 16px 36px !important; }
          .section-jumps { display: none !important; }
          .faq-badge { display: none !important; }
          .faq-brand-text { font-size: 12px !important; }
          .faq-cta-btn { padding: 8px 12px !important; font-size: 12px !important; white-space: nowrap !important; gap: 4px !important; }
        }
      `}</style>

      {/* ── Sticky Nav ─────────────────────────────────────────────── */}
      <SharedNav currentPage="faq" />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div
        className="faq-hero-pad"
        style={{ background: "linear-gradient(140deg,#eef5ff 0%,#f8fafc 55%,#f0fdf4 100%)", borderBottom: "1px solid #e8ecf4", padding: "60px 20px 52px", position: "relative", overflow: "hidden" }}
      >
        {/* Decorative background number */}
        <div style={{ position: "absolute", right: -20, top: -30, fontSize: 260, fontWeight: 900, color: "rgba(0,117,255,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>?</div>

        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative" }}>
          {/* Updated badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "4px 13px", marginBottom: 22 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4.5" fill="#16a34a"/>
              <path d="M3 5l1.3 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: "#15803d", fontSize: 11.5, fontWeight: 700 }}>Last updated: {LAST_UPDATED_DISPLAY}</span>
          </div>

          <h1
            className="faq-h1"
            style={{ fontSize: 46, fontWeight: 900, color: "#0f172a", lineHeight: 1.07, marginBottom: 16, letterSpacing: "-0.035em" }}
          >
            Anmeldung in Germany:<br />
            <span style={{ color: "#0075FF" }}>Complete FAQ</span>
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, maxWidth: 580, marginBottom: 36 }}>
            Every question expats ask about Germany's mandatory address registration — answered in plain English, with specific facts and deadlines.
          </p>

          {/* Stats strip */}
          <div className="faq-stats" style={{ display: "flex", gap: 36, marginBottom: 32 }}>
            {[
              { v: String(TOTAL_QUESTIONS), l: "questions answered" },
              { v: "5", l: "topic sections" },
              { v: "14", l: "days to register" },
            ].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#0075FF", letterSpacing: "-0.04em", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Section jump links */}
          <div className="section-jumps" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="section-jump"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 8, border: "1.5px solid #e8ecf4", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main>
        <div className="faq-content" style={{ maxWidth: 840, margin: "0 auto", padding: "52px 20px 80px" }}>

          {/* Legal disclaimer */}
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 56, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="8" cy="8" r="7" stroke="#0075FF" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5.5v.5" stroke="#0075FF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ color: "#1e40af", fontSize: 13, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>
              <strong>Legal notice:</strong> This information is for general guidance only and does not constitute legal advice. German registration rules change frequently — always verify current requirements with official German authorities or a qualified legal professional.
            </p>
          </div>

          {/* FAQ Sections */}
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} style={{ marginBottom: 60 }}>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: `2px solid ${section.border}` }}>
                <div style={{ width: 4, height: 28, borderRadius: 99, background: section.color, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>
                    {section.title}
                  </h2>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: section.color, background: section.bg, border: `1px solid ${section.border}`, padding: "2px 9px", borderRadius: 999 }}>
                    {section.faqs.length} {section.faqs.length === 1 ? "question" : "questions"}
                  </span>
                </div>
              </div>

              {/* Accordion items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {section.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="faq-item"
                    style={{ borderRadius: 13, border: "1.5px solid #e2e8f0", overflow: "hidden", background: "white" }}
                  >
                    <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", fontWeight: 700, color: "#0f172a", fontSize: 15, lineHeight: 1.45, gap: 16 }}>
                      <span>{faq.q}</span>
                      <svg className="faq-chevron" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4.5 6.75l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </summary>
                    <div style={{ padding: "0 22px 20px", borderTop: `1px solid ${section.border}` }}>
                      <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.8, margin: "16px 0 0" }}>
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="faq-cta" style={{ background: "#0f172a", borderRadius: 22, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* Decorative blue glow */}
            <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: 320, height: 120, background: "radial-gradient(ellipse,rgba(0,117,255,0.35) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
                <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Form ready in 5 minutes</span>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "white", marginBottom: 12, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                Ready to fill your form in 5 minutes?
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 30, lineHeight: 1.7 }}>
                Perfect German form. Personalised checklist. Zero data stored. €15, one time.
              </p>
              <a
                href="/#wizard/origin"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "15px 34px", borderRadius: 12, background: "#0075FF", color: "white", fontWeight: 800, fontSize: 15, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 8px 28px rgba(0,117,255,0.45)" }}
              >
                Get started
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 3l4.5 4.5L8 12" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
