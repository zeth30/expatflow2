import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";

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
  robots: { index: true, follow: true },
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

// ─── Content ───────────────────────────────────────────────────────────────────

const LAST_UPDATED_DISPLAY = "May 2026";

const SECTIONS = [
  {
    id: "sec-basics",
    num: "01",
    title: "The Basics",
    headline: "What the Anmeldung",
    accent: "actually is.",
    color: "var(--blue)",
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
    id: "sec-appointment",
    num: "02",
    title: "Booking Your Appointment",
    headline: "Getting your",
    accent: "Bürgeramt slot.",
    color: "var(--green)",
    faqs: [
      {
        q: "How do I book a Bürgeramt appointment in Berlin?",
        a: "Book at service.berlin.de. Check early in the morning for the best availability — new slots are released in batches and go quickly. Outer districts like Marzahn, Lichtenberg, and Spandau typically have more slots than central offices in Mitte or Charlottenburg. You can also call 115 during business hours to ask about cancellations.",
      },
      {
        q: "What happens at the Anmeldung appointment?",
        a: "You hand over your completed form and documents. The clerk checks everything — if you are missing your Wohnungsgeberbestätigung, passport, or required translations, they will turn you away on the spot. That means booking a new appointment and waiting another 3 weeks. Berlin clerks follow the rules strictly and will not make exceptions. Show up with every document on the checklist or do not go. A correctly filled form in proper German is your best defence — clerks process hundreds of cases a day and have no patience for errors. If everything is in order, the appointment itself takes 5 to 10 minutes. You walk out with your Anmeldebestätigung/Meldebestätigung printed on the spot. Check the name spelling, address, and dates before you leave.",
      },
      {
        q: "What if there are no Bürgeramt appointments available before the 14-day deadline?",
        a: "Book the earliest available slot and keep evidence that you tried — a screenshot of the booking portal is enough. In practice, Berlin offices are well aware that wait times regularly exceed two weeks and are understanding about delays caused by the appointment system itself.",
      },
    ],
  },
  {
    id: "sec-online",
    num: "03",
    title: "Online Registration",
    headline: "Can you register",
    accent: "online?",
    color: "var(--amber)",
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
    id: "sec-after",
    num: "04",
    title: "After Registration",
    headline: "What comes",
    accent: "next.",
    color: "var(--purple)",
    faqs: [
      {
        q: "What do I get after the Anmeldung?",
        a: "You receive the Anmeldebestätigung/Meldebestätigung — your official registration certificate — printed on the spot at your appointment. Keep multiple copies. You need it to open a German bank account, enroll in health insurance, start employment, and for most other official processes in Germany.",
      },
      {
        q: "What is the Steuer-ID and when does it arrive?",
        a: "Your Steuer-Identifikationsnummer (tax ID) is a permanent 11-digit number assigned by the Bundeszentralamt für Steuern. It is mailed to your registered address 2–4 weeks after a successful Anmeldung (up to 6–8 weeks during the peak September season). Make sure your name is on your mailbox — mail is not delivered to unmarked letterboxes in Germany.",
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
    id: "sec-simplyexpat",
    num: "05",
    title: "About SimplyExpat",
    headline: "About",
    accent: "SimplyExpat.",
    color: "var(--ink)",
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

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const allFaqs = SECTIONS.flatMap((s) => s.faqs);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: "2026-05-05",
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
      { "@type": "HowToStep", position: 1, name: "Get the Wohnungsgeberbestätigung from your landlord", text: "Request the landlord confirmation form (Wohnungsgeberbestätigung) on your move-in day. Your landlord is legally required to provide it under §19 BMG. Email them in writing so you have a paper trail. Without this form the Bürgeramt cannot register you — your rental contract alone is not accepted." },
      { "@type": "HowToStep", position: 2, name: "Fill in the Anmeldung form in English", text: "Go to simplyexpat.de and answer the guided questions in plain English. SimplyExpat translates everything into correct German and generates an official PDF with all 54 fields completed. This takes about 5 minutes and costs €15." },
      { "@type": "HowToStep", position: 3, name: "Book a Bürgeramt appointment as early as possible", text: "Book at service.berlin.de. Check early in the morning for the best slot availability — new slots are released in batches and go quickly. Outer districts like Marzahn and Lichtenberg have more availability than central offices. Keep a screenshot of your booking as evidence you tried within the 14-day window." },
      { "@type": "HowToStep", position: 4, name: "Print your completed form", text: "Print the PDF on plain white paper. DM or Rossmann self-service kiosks charge approximately €0.10–0.15 per page. The Bürgeramt does not accept digital forms shown on a phone screen." },
      { "@type": "HowToStep", position: 5, name: "Attend your Bürgeramt appointment", text: "Bring your printed form, passport or ID, Wohnungsgeberbestätigung, and any additional documents. The appointment takes 5–10 minutes. Sign the form at the office after printing — do not sign before. Check your Anmeldebestätigung/Meldebestätigung for errors before leaving." },
      { "@type": "HowToStep", position: 6, name: "Collect your Anmeldebestätigung/Meldebestätigung and await your Steuer-ID", text: "Your Anmeldebestätigung/Meldebestätigung (registration certificate) is printed on the spot. Your Steuer-ID (tax identification number) arrives by post to your registered address within 2–4 weeks. Make sure your surname is on your letterbox — official mail is not delivered to unlabelled mailboxes in Germany." },
    ],
  };

  // Section color chip styles
  const chipStyle: Record<string, { bg: string; bd: string; color: string }> = {
    "var(--blue)":   { bg: "var(--blue-soft)",    bd: "#d8e1ff",          color: "var(--blue)" },
    "var(--green)":  { bg: "var(--green-tint)",    bd: "var(--green-bd)",  color: "var(--green)" },
    "var(--amber)":  { bg: "var(--amber-tint)",    bd: "#fde4a8",          color: "var(--amber)" },
    "var(--purple)": { bg: "var(--purple-tint)",   bd: "#d8b4fe",          color: "var(--purple)" },
    "var(--ink)":    { bg: "#f1f3f9",              bd: "var(--line)",      color: "var(--ink)" },
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="" />

      <main className="main">

        {/* ── Hero ── */}
        <section className="hero" style={{ backgroundImage: "url('/berlin-skyline.jpg')" }}>
          <div className="wrap">
            <div className="crumbs">
              <a href="/what-is-anmeldung">Guides</a>
              <span className="sep">→</span>
              <span className="here">FAQ</span>
            </div>
            <span className="pill"><span className="dot" />Last updated: {LAST_UPDATED_DISPLAY}</span>
            <h1 className="hero-title">
              Anmeldung in Germany:
              <span className="accent">Complete FAQ.</span>
            </h1>
            <p className="lede">Germany&apos;s Anmeldung in plain English — deadlines, documents, appointments, and what happens after.</p>

            {/* Section jump links */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="sec-jump">
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Sections ── */}
        {SECTIONS.map((section, si) => {
          const c = chipStyle[section.color];
          return (
            <section
              key={section.id}
              id={section.id}
              className="section"
              style={{ paddingTop: si === 0 ? 0 : 0 }}
            >
              <div className="wrap">
                <div className="section-head reveal">
                  <div className="eyebrow" style={{ color: section.color }}>{section.num} · {section.title}</div>
                  <h2 className="h2">
                    {section.headline} <span className="accent">{section.accent}</span>
                  </h2>
                  {/* question count chip */}
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, background: c.bg, border: `1px solid ${c.bd}`, color: c.color, fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
                    {section.faqs.length} {section.faqs.length === 1 ? "question" : "questions"}
                  </div>
                </div>

                <div className="faq reveal">
                  {section.faqs.map((faq, i) => (
                    <details key={i}>
                      <summary>{faq.q}</summary>
                      <div className="ans">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ── CTA ── */}
        <section className="final-cta">
          <div className="wrap">
            <div className="cta-box reveal">
              <div className="eye">Form ready in 5 minutes</div>
              <h2>Fill your Anmeldung in English. <span className="b">We handle the German.</span></h2>
              <p>Answer in English. We generate your completed Anmeldeformular — all 54 fields in correct German — ready to print and bring to your appointment. €15, one time.</p>
              <Link href="/#wizard/origin" className="cta-btn">
                Prepare My Anmeldung
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <div className="micro">No payment until the PDF is ready · cancel anytime</div>
            </div>
            <div className="legal">This page is for general information only. Appointment availability and slot release schedules change regularly. Always verify at <a href="https://service.berlin.de" target="_blank" rel="noopener">service.berlin.de</a> or the city you are registering at.</div>
          </div>
        </section>

      </main>
    </div>
  );
}
