import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { GuideByline } from "../components/guides/GuideByline";
import { RelatedGuides } from "../components/guides/RelatedGuides";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "The Complete Anmeldung Berlin Guide (2026) | ReadyExpat",
  description:
    "Everything you need to complete your Berlin Anmeldung in 2026. What it is, required documents, landlord confirmation, how to book a Bürgeramt appointment, and how to fill all 54 fields correctly in English.",
  alternates: { canonical: `${DOMAIN}/anmeldung-berlin-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "The Complete Anmeldung Berlin Guide (2026)",
    description:
      "Everything expats need to complete their Berlin Anmeldung in 2026 — documents, appointment hacks, the landlord form, and a pre-filled PDF tool.",
    url: `${DOMAIN}/anmeldung-berlin-guide`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungBerlinGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The Complete Anmeldung Berlin Guide (2026)",
        description:
          "Step-by-step guide to completing Berlin address registration in 2026. Covers what the Anmeldung is, required documents, the Wohnungsgeberbestätigung, how to book a Bürgeramt appointment, and how to fill all 54 form fields correctly in English.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-31",
        dateModified: "2026-05-31",
        mainEntityOfPage: `${DOMAIN}/anmeldung-berlin-guide`,
        about: { "@type": "Thing", name: "Anmeldung", description: "German mandatory address registration" },
      },
      {
        "@type": "HowTo",
        name: "How to complete the Anmeldung in Berlin (2026)",
        description: "Complete your Berlin address registration in 5 steps",
        estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
        totalTime: "PT30M",
        supply: [
          { "@type": "HowToSupply", name: "Valid passport or EU national ID card" },
          { "@type": "HowToSupply", name: "Wohnungsgeberbestätigung signed by landlord" },
          { "@type": "HowToSupply", name: "Completed Anmeldeformular (all 54 fields in German)" },
        ],
        step: [
          { "@type": "HowToStep", position: 1, name: "Get your Wohnungsgeberbestätigung", text: "Ask your landlord to sign the landlord confirmation form (Wohnungsgeberbestätigung) the day you move in. Without it the Bürgeramt will send you home. Many landlords include it in the move-in pack — if not, hand them the template from our guide." },
          { "@type": "HowToStep", position: 2, name: "Fill the Anmeldeformular", text: "Download the official form from service.berlin.de and complete all 54 fields in German. Name fields use your passport spelling. The Staatsangehörigkeit field requires the German adjective form of your nationality (e.g. amerikanisch, britisch, indisch). For Religionsgesellschaft write OA to make no church tax declaration." },
          { "@type": "HowToStep", position: 3, name: "Book a Bürgeramt appointment", text: "Go to service.berlin.de and select 'Anmeldung einer Wohnung'. Use 'Termin berlinweit suchen' to search all districts. New slots appear every Tuesday at 8:00 AM and sell out within 60 seconds — be on the portal before 8:00 and refresh immediately at 8:00." },
          { "@type": "HowToStep", position: 4, name: "Attend your appointment", text: "Bring: passport, completed Anmeldeformular, and Wohnungsgeberbestätigung. Non-EU citizens bring their current visa too. The appointment takes 5–10 minutes if your documents are complete." },
          { "@type": "HowToStep", position: 5, name: "Receive your Anmeldebestätigung", text: "The clerk prints your Anmeldebestätigung (registration certificate) on the spot. Use it to open a bank account, register for health insurance, and receive your Steuer-ID by post within 2–4 weeks." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Anmeldung in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "The Anmeldung is Germany's mandatory address registration. Under §17 Bundesmeldegesetz, every person taking up residence in Germany must register their address at the local Bürgeramt within 14 days of moving in. In Berlin this means booking an appointment at any of the city's Bürgerämter and attending in person with your passport, completed Anmeldeformular, and the signed Wohnungsgeberbestätigung from your landlord." },
          },
          {
            "@type": "Question",
            name: "How long do I have to do the Anmeldung in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "You have 14 days from the day you move in. However, Bürgeramt appointments in Berlin routinely take 3–6 weeks to become available — well beyond the 14-day window. Book the earliest available slot immediately on arrival, take a screenshot showing you searched, and you will not be fined. The city is aware of the appointment shortage." },
          },
          {
            "@type": "Question",
            name: "What documents do I need for the Berlin Anmeldung?",
            acceptedAnswer: { "@type": "Answer", text: "Three documents are required: (1) a valid passport or EU national ID card, (2) the completed Anmeldeformular with all 54 fields filled in German, and (3) the Wohnungsgeberbestätigung — the landlord confirmation form signed by your landlord or sublessor. Non-EU citizens should also bring their current visa or residence permit. Missing any single document means you will be sent home to rebook." },
          },
          {
            "@type": "Question",
            name: "Do I need an appointment for the Bürgeramt in Berlin?",
            acceptedAnswer: { "@type": "Answer", text: "Yes. service.berlin.de states 'Ohne Termin erfolgt keine Bearbeitung' — without an appointment, no service. Walk-ins are not officially accepted. Book via service.berlin.de, search all districts with 'Termin berlinweit suchen', and check on Tuesdays at 8:00 AM when new slots are released." },
          },
          {
            "@type": "Question",
            name: "What happens after the Anmeldung?",
            acceptedAnswer: { "@type": "Answer", text: "You receive the Anmeldebestätigung (registration certificate) on the spot. Your Steuer-ID (tax identification number) arrives by post within 2–4 weeks. You will also receive a Rundfunkbeitrag letter (€18.36/month public broadcasting fee) — this is mandatory and not optional. You can now open a German bank account, register for health insurance, and set up utilities." },
          },
          {
            "@type": "Question",
            name: "Can I fill the Anmeldung form in English?",
            acceptedAnswer: { "@type": "Answer", text: "No. The Bürgeramt only accepts the German form. Your name fields use your passport spelling, but all other fields — marital status, gender, religion, citizenship — must use the correct German terms. Staatsangehörigkeit requires the German adjective form of your nationality: amerikanisch for American, britisch for British, indisch for Indian." },
          },
          {
            "@type": "Question",
            name: "What is the Wohnungsgeberbestätigung?",
            acceptedAnswer: { "@type": "Answer", text: "The Wohnungsgeberbestätigung is the landlord confirmation form required by §19 Bundesmeldegesetz. Your landlord or sublessor must sign it confirming that you have moved into the property. It must include: landlord name and address, tenant name, property address, and move-in date. Without it the Bürgeramt cannot register you. A landlord who refuses to provide it faces a fine of up to €1,000." },
          },
          {
            "@type": "Question",
            name: "How much does the Anmeldung cost?",
            acceptedAnswer: { "@type": "Answer", text: "The Anmeldung itself is completely free. The only costs are optional: printing the form (€0.10–0.15 per page at DM or Rossmann) and, if you choose to use a form-filling service, that service fee." },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung Berlin Guide", item: `${DOMAIN}/anmeldung-berlin-guide` },
        ],
      },
    ],
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuideReveal />
      <GuideSidebar activeId="anmeldung" />

      <main className="main">
        {/* Hero */}
        <section
          className="hero"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1920&q=80&auto=format')" }}
        >
          <div className="wrap">
            <div className="crumbs">
              <a href="/">ReadyExpat</a>
              <span className="sep">→</span>
              <span className="here">Anmeldung Berlin Guide</span>
            </div>
            <span className="pill"><span className="dot" />Complete Guide · 2026</span>
            <h1 className="hero-title">
              The Complete Anmeldung Berlin Guide
              <span className="accent">Everything you need to register your address in 2026.</span>
            </h1>
            <GuideByline updated="May 2026" />
          </div>
        </section>

        <div className="wrap content-wrap">

          {/* Intro */}
          <section className="sect">
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#334155", marginBottom: "1rem" }}>
              The <strong>Anmeldung</strong> is Germany&apos;s mandatory address registration. Every person moving to Berlin must register their address at a <strong>Bürgeramt</strong> within 14 days of moving in — by law (§17 Bundesmeldegesetz). Without it, you cannot open a German bank account, receive your Steuer-ID, start a phone contract, or access health insurance.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#334155" }}>
              The good news: the appointment takes 5–10 minutes. The bad news: booking it takes patience. This guide walks you through every step — from documents to appointment hacks to filling all 54 form fields correctly in English.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
              {[
                { val: "14 days", lbl: "to register after moving in" },
                { val: "54 fields", lbl: "on the German form" },
                { val: "5–10 min", lbl: "appointment length" },
                { val: "Free", lbl: "Anmeldung costs nothing" },
              ].map(s => (
                <div key={s.val} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "0.75rem 1rem", flex: "1 1 140px" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0075FF" }}>{s.val}</div>
                  <div style={{ fontSize: "0.78rem", color: "#475569" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 01 — What is it */}
          <section className="sect">
            <h2 className="s-title">01 · What is the Anmeldung?</h2>
            <p>
              The Anmeldung (<em>Anmeldung einer Wohnung</em> — registration of a residence) is the process of officially informing the German state of your current address. It is not optional. The <strong>Bundesmeldegesetz (BMG)</strong> — Germany&apos;s federal registration law — requires every person residing in Germany to register within 14 days of moving into a new address.
            </p>
            <p>
              Once registered, you receive the <strong>Anmeldebestätigung</strong> (registration certificate) — a one-page document stamped by the Bürgeramt. This document unlocks almost everything you need to settle in Berlin:
            </p>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: 2 }}>
              <li><strong>Bank account</strong> — most German banks require the Anmeldebestätigung to open an account</li>
              <li><strong>Steuer-ID</strong> — your tax identification number arrives by post 2–4 weeks after registration</li>
              <li><strong>Health insurance</strong> — statutory health insurers need proof of registered address</li>
              <li><strong>Residence permit (Aufenthaltstitel)</strong> — non-EU citizens cannot apply without it</li>
              <li><strong>Employment</strong> — employers need your address for payroll and tax reporting</li>
            </ul>
            <p>
              <Link href="/what-is-anmeldung" style={{ color: "#0075FF" }}>Read the full explainer: What is the Anmeldung? →</Link>
            </p>
          </section>

          {/* 02 — Documents */}
          <section className="sect">
            <h2 className="s-title">02 · Documents you need</h2>
            <p>
              The Bürgeramt will check every document on arrival. Missing any single item means you are sent home and must rebook — potentially weeks later. Prepare all three before booking your appointment.
            </p>

            <div style={{ display: "grid", gap: "1rem", margin: "1.25rem 0" }}>
              {[
                {
                  num: "1",
                  ttl: "Valid passport or national ID card",
                  desc: "EU/EEA citizens can use a national ID card. Non-EU citizens must bring their passport. If you already have a German visa or residence permit, bring that too.",
                },
                {
                  num: "2",
                  ttl: "Wohnungsgeberbestätigung (landlord confirmation)",
                  desc: "A signed form from your landlord confirming your move-in. Required by §19 BMG. Your landlord must provide it — refusal is a fine of up to €1,000 for them. Many include it in the move-in pack.",
                },
                {
                  num: "3",
                  ttl: "Completed Anmeldeformular",
                  desc: "The official registration form — 54 fields, all in German. Download from service.berlin.de or use ReadyExpat to fill it in English and get a correct German PDF.",
                },
              ].map(d => (
                <div key={d.num} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", background: "#0075FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>{d.num}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: "0.25rem" }}>{d.ttl}</div>
                    <div style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <Link href="/anmeldung-documents" style={{ color: "#0075FF" }}>Full document checklist with edge cases →</Link>
            </p>
          </section>

          {/* 03 — Landlord form */}
          <section className="sect">
            <h2 className="s-title">03 · The Wohnungsgeberbestätigung (landlord confirmation)</h2>
            <p>
              This is the document that trips most expats up. The <strong>Wohnungsgeberbestätigung</strong> is a separate form your landlord must sign. It is not the same as the Anmeldeformular. It must include:
            </p>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: 2 }}>
              <li>Landlord&apos;s full name and address</li>
              <li>Property address</li>
              <li>Your full name as tenant</li>
              <li>Move-in date</li>
              <li>Landlord&apos;s signature</li>
            </ul>
            <p>
              If you are subletting (renting a room from another tenant), the <em>Hauptmieter</em> (primary tenant) signs as your Wohnungsgeber — not the building owner.
            </p>
            <p>
              <strong>Timing:</strong> Ask for the form on the day you move in. Many landlords include it in the move-in documentation automatically.
            </p>
            <p>
              <Link href="/wohnungsgeberbestaetigung" style={{ color: "#0075FF" }}>Download the official template + full guide →</Link>
            </p>
          </section>

          {/* 04 — Form fields */}
          <section className="sect">
            <h2 className="s-title">04 · Filling the Anmeldeformular (all 54 fields)</h2>
            <p>
              The official Anmeldeformular is only available in German. The Bürgeramt will not accept an English form. Every field must be completed correctly — clerks check for errors and will reject incomplete forms on the spot.
            </p>
            <p>The fields that cause most errors:</p>
            <div style={{ overflowX: "auto", margin: "1rem 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#0f172a", color: "#fff" }}>
                    <th style={{ padding: "0.6rem 0.75rem", textAlign: "left" }}>German field</th>
                    <th style={{ padding: "0.6rem 0.75rem", textAlign: "left" }}>English meaning</th>
                    <th style={{ padding: "0.6rem 0.75rem", textAlign: "left" }}>Common mistake</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Staatsangehörigkeiten", "Citizenship(s)", "Writing 'American' or 'USA' instead of 'amerikanisch'"],
                    ["Religionsgesellschaft", "Religion / church tax", "Leaving blank or writing 'none' — write OA to opt out"],
                    ["Familienstand", "Marital status", "Must be German: ledig / verheiratet / geschieden / verwitwet"],
                    ["Tag des Einzugs", "Move-in date", "Must be DD.MM.YYYY — not MM/DD/YYYY"],
                    ["Geburtsname", "Birth name", "Leave blank if surname has not changed"],
                    ["Geschlecht", "Gender", "männlich / weiblich / divers — not M/F/X"],
                  ].map(([de, en, err], i) => (
                    <tr key={de} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "#0f172a" }}>{de}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "#475569" }}>{en}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "#dc2626", fontSize: "0.82rem" }}>{err}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              <Link href="/anmeldung-berlin-english" style={{ color: "#0075FF" }}>All 54 fields explained in English →</Link>
            </p>

            {/* Product CTA */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: "12px", padding: "1.75rem", marginTop: "1.5rem", color: "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>Skip the translation headache</div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
                Answer 7 questions in English. ReadyExpat fills all 54 fields correctly in German and generates a ready-to-print PDF. Takes 5 minutes. €15 one-time.
              </p>
              <a
                href="/"
                style={{ display: "inline-block", background: "#0075FF", color: "#fff", fontWeight: 700, padding: "0.65rem 1.4rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Prepare My Anmeldung →
              </a>
            </div>
          </section>

          {/* 05 — Appointment */}
          <section className="sect">
            <h2 className="s-title">05 · Booking your Bürgeramt appointment</h2>
            <p>
              Berlin Bürgerämter require appointments. Walk-ins are not officially accepted — service.berlin.de is explicit: <em>&ldquo;Ohne Termin erfolgt keine Bearbeitung.&rdquo;</em> Appointments are released in batches and disappear within seconds. Here is exactly how to get one.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1rem 0" }}>
              {[
                { step: "1", title: "Go to service.berlin.de", detail: "Select 'Anmeldung einer Wohnung' from the service list." },
                { step: "2", title: "Search all districts", detail: "Click 'Termin berlinweit suchen' — do not restrict to your local Bezirk. An appointment in any district is legally identical." },
                { step: "3", title: "Tuesday 8:00 AM", detail: "New slots are released every Tuesday at 8:00 AM. They sell out in under 60 seconds. Be on the portal before 8:00 and refresh at exactly 8:00." },
                { step: "4", title: "Outer districts have more slots", detail: "Marzahn-Hellersdorf, Lichtenberg, Spandau, and Reinickendorf consistently have more availability than central offices." },
                { step: "5", title: "Call 115 at 7:00 AM", detail: "Operators can sometimes book same-day cancellations not visible in the online portal. Call in German if you can, or ask a German-speaking friend to help." },
                { step: "6", title: "Screenshot if no slots available", detail: "If no appointment is available before your 14-day deadline, take a screenshot. You will not be fined if you have proof the system had no slots." },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%", background: "#0075FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, marginTop: "2px" }}>{s.step}</div>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{s.title}</strong>
                    <span style={{ color: "#475569", fontSize: "0.9rem" }}> — {s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <Link href="/burgeramt-berlin-appointment" style={{ color: "#0075FF" }}>Full appointment guide with all hacks →</Link>
            </p>
          </section>

          {/* 06 — After */}
          <section className="sect">
            <h2 className="s-title">06 · After your appointment — what to expect</h2>
            <p>The Bürgeramt clerk gives you the <strong>Anmeldebestätigung</strong> (registration certificate) on the spot. This is the document you&apos;ll use for the next several months.</p>

            <div style={{ display: "grid", gap: "0.75rem", margin: "1rem 0" }}>
              {[
                { timing: "Same day", event: "Anmeldebestätigung issued at the Bürgeramt counter" },
                { timing: "2–4 weeks", event: "Steuer-ID arrives by post (up to 8 weeks during peak September season)" },
                { timing: "Within weeks", event: "Rundfunkbeitrag letter arrives (€18.36/month — mandatory public broadcasting fee)" },
                { timing: "Immediately", event: "You can open a German bank account and register for health insurance" },
              ].map(r => (
                <div key={r.timing} style={{ display: "flex", gap: "1rem", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "#0075FF", minWidth: "80px" }}>{r.timing}</div>
                  <div style={{ fontSize: "0.9rem", color: "#334155" }}>{r.event}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: "8px", padding: "1rem", marginTop: "1rem", fontSize: "0.88rem", color: "#713f12" }}>
              <strong>Mailbox:</strong> Add your surname to your letterbox (Briefkasten) on arrival. Official German mail — including your Steuer-ID — is not delivered to unlabelled mailboxes. If your surname isn&apos;t there, letters get returned.
            </div>
          </section>

          {/* 07 — Online */}
          <section className="sect">
            <h2 className="s-title">07 · Can I do the Anmeldung online?</h2>
            <p>
              Only under very specific conditions. Online Anmeldung (<em>Online-Ummeldung</em>) is only available if:
            </p>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: 2 }}>
              <li>You already have a registered German address (it&apos;s a change of address, not a first registration)</li>
              <li>You hold an EU/EEA national ID card with the <strong>Online-Ausweis chip activated</strong></li>
              <li>You have a compatible NFC card reader</li>
            </ul>
            <p>
              <strong>Non-EU citizens</strong> — including US, UK, Indian, Brazilian, and Australian passport holders — cannot use the online portal. All first-time registrations in Berlin are in person at the Bürgeramt.
            </p>
            <p>
              <Link href="/anmeldung-online-non-eu" style={{ color: "#0075FF" }}>Online Anmeldung — who qualifies and who doesn&apos;t →</Link>
            </p>
          </section>

          {/* FAQ */}
          <section className="sect">
            <h2 className="s-title">Common questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  q: "What fine do I get for late Anmeldung?",
                  a: "Technically up to €1,000 under §54 BMG. In practice, fines are extremely rare for first-time registrants who book an appointment promptly — the appointment backlog is well known to city authorities. Book as soon as you arrive, keep your booking screenshot.",
                },
                {
                  q: "Do I need a permanent address to do the Anmeldung?",
                  a: "Yes — you need a fixed address. You cannot register at a hotel or Airbnb. You need a landlord willing to sign the Wohnungsgeberbestätigung. Some expats register at a friend's address temporarily while apartment hunting — this is legally permissible with the friend's permission.",
                },
                {
                  q: "Can my partner or family member do the Anmeldung for me?",
                  a: "Yes, with a written power of attorney (Vollmacht) and a copy of your passport. The person attending must also bring their own ID. Children do not need to attend — a parent registers them.",
                },
                {
                  q: "What is the Rundfunkbeitrag?",
                  a: "The Rundfunkbeitrag is Germany's public broadcasting fee — €18.36 per month per household. You will receive a letter from ARD ZDF Deutschlandradio Beitragsservice within weeks of registering. It is not optional. One fee covers all devices in your household.",
                },
                {
                  q: "Do I need to de-register (Abmeldung) when I leave Berlin?",
                  a: "Yes, if you are leaving Germany entirely. You must file an Abmeldung (de-registration) at the Bürgeramt one to two weeks before departure. Moving to a different address within Germany means filing a new Anmeldung at your new address — no separate Abmeldung required.",
                },
              ].map(({ q, a }) => (
                <details key={q} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem" }}>
                  <summary style={{ fontWeight: 600, color: "#0f172a", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {q}
                    <span style={{ fontSize: "1.2rem", color: "#94a3b8", flexShrink: 0, marginLeft: "0.5rem" }}>+</span>
                  </summary>
                  <p style={{ marginTop: "0.75rem", color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedGuides excludeId="anmeldung" />

        </div>
      </main>
    </div>
  );
}
