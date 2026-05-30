# SEO Cluster Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 SEO cluster pages targeting high-intent Anmeldung queries, each with a unique interactive component, all using the existing guide design system.

**Architecture:** Each page is a Next.js App Router static page using `guides.css` + `GuideReveal` + `GuideSidebar` (no active id — these are not in the sidebar guide list). Three new client components handle the interactives. Pages are added to `sitemap.ts` and linked from the closest existing guide page. None appear in the nav dropdown.

**Tech Stack:** Next.js 15 App Router, TypeScript, `guides.css` design system, `GuideReveal` / `GuideSidebar` / `GuidePageNav` components, React `useState` for interactives, Article + FAQPage + BreadcrumbList JSON-LD on every page.

---

## File Map

**Create:**
- `app/anmeldung-berlin-english/page.tsx` — static guide page, no new component
- `app/anmeldung-mistakes-berlin/page.tsx` — uses `MistakeChecker`
- `app/anmeldung-deadline-berlin/page.tsx` — uses `DeadlineCalculator`
- `app/anmeldung-couple-berlin/page.tsx` — uses `PeopleCounter`
- `app/moving-to-berlin-registration/page.tsx` — static guide page, no new component
- `app/components/guides/MistakeChecker.tsx` — interactive checklist
- `app/components/guides/DeadlineCalculator.tsx` — date → days remaining calculator
- `app/components/guides/PeopleCounter.tsx` — +/- people counter → sheets needed

**Modify:**
- `app/sitemap.ts` — add 5 new entries
- `app/what-is-anmeldung/page.tsx` — add link to `/anmeldung-deadline-berlin`
- `app/anmeldung-documents/page.tsx` — add link to `/anmeldung-mistakes-berlin`
- `app/wohnungsgeberbestaetigung/page.tsx` — add link to `/anmeldung-couple-berlin`
- `app/burgeramt-berlin-appointment/page.tsx` — add link to `/moving-to-berlin-registration`

---

## Task 1: DeadlineCalculator component

**Files:**
- Create: `app/components/guides/DeadlineCalculator.tsx`

- [ ] **Create the component**

```tsx
"use client";
import { useState } from "react";

export function DeadlineCalculator() {
  const [moveIn, setMoveIn] = useState("");

  const deadline = moveIn
    ? (() => {
        const d = new Date(moveIn + "T12:00:00");
        d.setDate(d.getDate() + 14);
        return d;
      })()
    : null;

  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / 86400000)
    : null;

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const status =
    daysLeft === null ? null
    : daysLeft < 0    ? "overdue"
    : daysLeft <= 3   ? "urgent"
    : daysLeft <= 7   ? "soon"
    : "ok";

  const colors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    overdue: { bg: "#fff1f2", border: "#fecdd3", text: "#e11d48", label: "Overdue — register immediately" },
    urgent:  { bg: "#fff7ed", border: "#fed7aa", text: "#d97706", label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left — act now` },
    soon:    { bg: "#fefce8", border: "#fde68a", text: "#ca8a04", label: `${daysLeft} days left — book this week` },
    ok:      { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", label: `${daysLeft} days left — you have time` },
  };

  const c = status ? colors[status] : null;

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px", maxWidth: 520 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        Deadline Calculator
      </div>
      <p style={{ fontSize: 15, color: "#2a3656", marginBottom: 20, lineHeight: 1.6 }}>
        Enter your move-in date — we'll show your Anmeldung deadline.
      </p>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2a3656", marginBottom: 6 }}>
        Move-in date
      </label>
      <input
        type="date"
        value={moveIn}
        onChange={e => setMoveIn(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e6ebf5", fontSize: 15, fontFamily: "inherit", color: "#0a1638", outline: "none", marginBottom: 16 }}
      />
      {deadline && c && (
        <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#0a1638", letterSpacing: "-0.02em" }}>
            Deadline: {fmt(deadline)}
          </div>
          {status === "overdue" && (
            <p style={{ fontSize: 13, color: "#6b7693", marginTop: 8, lineHeight: 1.55 }}>
              Don't panic — register as soon as possible. Bring your earliest appointment screenshot. Fines are rarely enforced when you show you tried.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/components/guides/DeadlineCalculator.tsx
git commit -m "feat: add DeadlineCalculator interactive component"
```

---

## Task 2: MistakeChecker component

**Files:**
- Create: `app/components/guides/MistakeChecker.tsx`

- [ ] **Create the component**

```tsx
"use client";
import { useState } from "react";

const MISTAKES = [
  { id: "wgb",    label: "Missing Wohnungsgeberbestätigung", detail: "The landlord confirmation form is mandatory. Without it, the clerk turns you away on the spot. Rental contract alone is not accepted." },
  { id: "name",   label: "Name doesn't match passport exactly", detail: "The form must use your name exactly as printed in your passport — including middle names, hyphens, and accents. No nicknames." },
  { id: "fields", label: "Leaving required fields blank", detail: "All marked fields must be filled. Geschlecht (gender) and Staatsangehörigkeit (citizenship) are the most commonly missed." },
  { id: "addr",   label: "Wrong address format", detail: "Street name and house number must be split into separate fields. '12 Hauptstraße' written as a single block is rejected." },
  { id: "date",   label: "Wrong date format", detail: "All dates must be DD.MM.YYYY — not MM/DD/YYYY. US expats get this wrong almost every time." },
  { id: "docs",   label: "Expired or wrong identity document", detail: "Non-EU citizens must bring a passport, not an ID card. EU citizens may use a national ID. All documents must be valid on the day of the appointment." },
];

export function MistakeChecker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const score = checked.size;
  const all = MISTAKES.length;

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Mistake Checker
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: score === all ? "#16a34a" : "#6b7693" }}>
          {score}/{all} checked
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MISTAKES.map(m => {
          const done = checked.has(m.id);
          return (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                borderRadius: 12, border: `1.5px solid ${done ? "#bbf7d0" : "#e6ebf5"}`,
                background: done ? "#f0fdf4" : "#fbfcff", cursor: "pointer", textAlign: "left",
                fontFamily: "inherit", transition: "all .15s",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#16a34a" : "#d1d5db"}`,
                background: done ? "#16a34a" : "white", flexShrink: 0, marginTop: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M5 12l5 5 9-9"/></svg>}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: done ? "#15803d" : "#0a1638", marginBottom: 3 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.55 }}>{m.detail}</div>
              </div>
            </button>
          );
        })}
      </div>
      {score === all && (
        <div style={{ marginTop: 16, padding: "14px 18px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d" }}>
            ✓ You've reviewed all 6 mistakes — or let ReadyExpat handle them automatically.
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/components/guides/MistakeChecker.tsx
git commit -m "feat: add MistakeChecker interactive component"
```

---

## Task 3: PeopleCounter component

**Files:**
- Create: `app/components/guides/PeopleCounter.tsx`

- [ ] **Create the component**

```tsx
"use client";
import { useState } from "react";

export function PeopleCounter() {
  const [count, setCount] = useState(2);
  const sheets = Math.ceil(count / 2);

  const change = (n: number) => setCount(c => Math.max(1, Math.min(6, c + n)));

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px", maxWidth: 480 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        How Many People Are Registering?
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <button onClick={() => change(-1)} style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid #e6ebf5", background: "#f8fafc", fontSize: 22, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#0a1638" }}>−</button>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#0a1638", letterSpacing: "-0.04em", minWidth: 60, textAlign: "center" }}>{count}</div>
        <button onClick={() => change(1)} style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid #e6ebf5", background: "#f8fafc", fontSize: 22, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#0a1638" }}>+</button>
        <div style={{ fontSize: 15, color: "#6b7693", fontWeight: 600 }}>
          {count === 1 ? "person" : "people"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 18px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e40af" }}>Anmeldung sheets needed</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0040ff" }}>{sheets}</span>
        </div>
        <div style={{ padding: "14px 18px", background: "#fbfcff", border: "1px solid #e6ebf5", borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.6 }}>
            {count === 1 && "One person — one sheet. Straightforward."}
            {count === 2 && "Two people fit on one sheet. One form, submitted together."}
            {count === 3 && "Three people require two sheets — two on sheet 1, one on sheet 2."}
            {count === 4 && "Four people, two sheets. Two people per sheet."}
            {count === 5 && "Five people, three sheets. Sheet 3 will have one person on it."}
            {count === 6 && "Six people, three sheets — the maximum ReadyExpat supports per order."}
          </div>
        </div>
        {count > 2 && (
          <div style={{ padding: "12px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, fontSize: 13, color: "#92400e", lineHeight: 1.55 }}>
            Each sheet must be printed separately and signed. Bring all {sheets} sheets to your appointment.
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/components/guides/PeopleCounter.tsx
git commit -m "feat: add PeopleCounter interactive component"
```

---

## Task 4: /anmeldung-deadline-berlin page

**Files:**
- Create: `app/anmeldung-deadline-berlin/page.tsx`

- [ ] **Create the page**

```tsx
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
```

- [ ] **Commit**

```bash
git add app/anmeldung-deadline-berlin/page.tsx
git commit -m "feat: add /anmeldung-deadline-berlin SEO cluster page"
```

---

## Task 5: /anmeldung-mistakes-berlin page

**Files:**
- Create: `app/anmeldung-mistakes-berlin/page.tsx`

- [ ] **Create the page**

```tsx
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
```

- [ ] **Commit**

```bash
git add app/anmeldung-mistakes-berlin/page.tsx
git commit -m "feat: add /anmeldung-mistakes-berlin SEO cluster page"
```

---

## Task 6: /anmeldung-couple-berlin page

**Files:**
- Create: `app/anmeldung-couple-berlin/page.tsx`

- [ ] **Create the page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";
import { PeopleCounter } from "../components/guides/PeopleCounter";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung for Couples and Families in Berlin 2026 | ReadyExpat",
  description: "Registering as a couple or family in Berlin uses a single Anmeldung appointment but multiple form sheets — 2 people per sheet. Here's exactly how it works, what differs for couples vs families, and how to prepare.",
  alternates: { canonical: `${DOMAIN}/anmeldung-couple-berlin` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung for Couples and Families in Berlin 2026",
    description: "One appointment. Multiple people. Here's how multi-person Anmeldung works in Berlin.",
    url: `${DOMAIN}/anmeldung-couple-berlin`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

export default function AnmeldungCoupleBerlin() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Do the Anmeldung as a Couple or Family in Berlin",
        description: "Multi-person Anmeldung in Berlin: one appointment, 2 people per form sheet, each person's documents required.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/anmeldung-couple-berlin`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Can a couple register together at the same Bürgeramt appointment?", acceptedAnswer: { "@type": "Answer", text: "Yes. Both people are registered at a single appointment. You submit one Anmeldeformular sheet with both people listed — two people fit on one sheet. One person can attend on behalf of both if they bring a written authorisation (Vollmacht) and both passports." } },
          { "@type": "Question", name: "How many Anmeldung forms does a family of 4 need?", acceptedAnswer: { "@type": "Answer", text: "Two sheets. The Anmeldeformular fits 2 people per sheet. A family of 4 submits 2 sheets at the same appointment. A family of 3 also needs 2 sheets — sheet 1 has 2 people, sheet 2 has 1." } },
          { "@type": "Question", name: "Does each person need their own Wohnungsgeberbestätigung?", acceptedAnswer: { "@type": "Answer", text: "No. One Wohnungsgeberbestätigung covers everyone registering at the same address. The landlord signs once and all family members are included." } },
          { "@type": "Question", name: "Can one person register for the whole family?", acceptedAnswer: { "@type": "Answer", text: "Yes, with a Vollmacht (written power of attorney) from each absent person, plus their original passport or ID. Children under 16 can be registered by a parent without a Vollmacht." } },
          { "@type": "Question", name: "Do unmarried couples register differently to married couples?", acceptedAnswer: { "@type": "Answer", text: "The Anmeldung process is identical. Marital status affects the Familienstand field on the form but does not change the appointment process or required documents." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung for Couples", item: `${DOMAIN}/anmeldung-couple-berlin` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Anmeldung for Couples</span>
            </div>
            <span className="pill"><span className="dot" />Couples · Families · Up to 6 people</span>
            <h1 className="hero-title">
              Anmeldung for Couples and Families in Berlin.
              <span className="accent">One appointment. 2 people per sheet. Here's exactly how it works.</span>
            </h1>
            <p className="lede">Moving to Berlin as a couple or family? The process is one appointment for everyone — but the form has specific rules about how many people fit on each sheet and what documents each person needs.</p>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">1</text></svg>
                <div className="kf-num">One appointment</div>
                <p className="kf-text">Covers everyone registering at the same address, submitted together.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">2</text></svg>
                <div className="kf-num">People per sheet</div>
                <p className="kf-text">Each Anmeldeformular sheet holds exactly 2 people. 3 people = 2 sheets.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">6</text></svg>
                <div className="kf-num">Maximum per order</div>
                <p className="kf-text">ReadyExpat supports up to 6 people in a single order — 3 sheets.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-counter">
          <div className="wrap">
            <div className="eyebrow">01 · How Many Sheets?</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>Calculate your sheets</h2>
            <p style={{ color: "#6b7693", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>Select how many people are registering at the same address.</p>
            <PeopleCounter />
          </div>
        </section>

        <section className="section" id="sec-how">
          <div className="wrap">
            <div className="darkbox reveal">
              <div className="mob-2col-wide">
                <div>
                  <div className="eyebrow">02 · The Process</div>
                  <h3 style={{ marginTop: 14 }}>One appointment covers everyone.</h3>
                  <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7 }}>
                    You book one appointment for the address — not one per person. All sheets are submitted together at the same visit. The clerk processes all registrations in one go.
                  </p>
                </div>
                <div className="mob-no-border-left" style={{ paddingTop: 6, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 48 }}>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>What each person needs</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Valid passport (non-EU) or passport / national ID (EU)",
                      "Listed on the Wohnungsgeberbestätigung (one form covers all)",
                      "Their section of the Anmeldeformular filled correctly",
                      "Visa or residence permit if already issued (non-EU)",
                    ].map(item => (
                      <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg style={{ flexShrink: 0, marginTop: 2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><path d="M5 12l5 5 9-9"/></svg>
                        <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)", lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-situations">
          <div className="wrap">
            <div className="eyebrow">03 · Common Situations</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>How it works for your situation</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { title: "Unmarried couple", color: "#0040ff", points: ["Same process as married couples", "Familienstand: 'ledig' for each person", "Both names on Wohnungsgeberbestätigung", "1 sheet for 2 people"] },
                { title: "Married couple", color: "#16a34a", points: ["Familienstand: 'verheiratet'", "Marriage date and place on the form", "Foreign marriage certificate may need certified translation", "1 sheet for 2 people"] },
                { title: "Family with children", color: "#d97706", points: ["Children listed on separate sheet if > 2 people total", "Children under 16: parent can register on their behalf", "No Vollmacht needed for own children", "Bring birth certificates for children born outside Germany"] },
                { title: "One person registering for all", color: "#7c3aed", points: ["Bring written Vollmacht from each absent adult", "Bring original passport/ID of each absent person", "Children under 16: no Vollmacht needed", "All sheets must be signed by the absent person before the appointment"] },
              ].map(({ title, color, points }) => (
                <div key={title} className="reveal" style={{ padding: "22px 24px", background: "white", border: "1px solid #e6ebf5", borderRadius: 16, borderTop: `3px solid ${color}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0a1638", marginBottom: 14 }}>{title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {points.map(p => (
                      <div key={p} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.55 }}>{p}</span>
                      </div>
                    ))}
                  </div>
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
                  ReadyExpat handles couples and families — up to 6 people.
                </div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,.6)" }}>One order. All sheets generated. All fields correct. €15 flat.</div>
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
              <details><summary>Can a couple register together at the same Bürgeramt appointment?</summary><div className="ans">Yes. Both people are registered at a single appointment. You submit one Anmeldeformular sheet with both people listed. One person can attend on behalf of both with a written Vollmacht and both passports.</div></details>
              <details><summary>How many Anmeldung forms does a family of 4 need?</summary><div className="ans">Two sheets. The Anmeldeformular fits 2 people per sheet. A family of 4 submits 2 sheets at the same appointment.</div></details>
              <details><summary>Does each person need their own Wohnungsgeberbestätigung?</summary><div className="ans">No. One Wohnungsgeberbestätigung covers everyone registering at the same address.</div></details>
              <details><summary>Can one person register for the whole family?</summary><div className="ans">Yes, with a Vollmacht from each absent adult and their original passport or ID. Children under 16 can be registered by a parent without a Vollmacht.</div></details>
              <details><summary>Do unmarried couples register differently to married couples?</summary><div className="ans">The process is identical. Marital status affects the Familienstand field on the form but does not change the appointment or documents required.</div></details>
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
```

- [ ] **Commit**

```bash
git add app/anmeldung-couple-berlin/page.tsx
git commit -m "feat: add /anmeldung-couple-berlin SEO cluster page"
```

---

## Task 7: /anmeldung-berlin-english page

**Files:**
- Create: `app/anmeldung-berlin-english/page.tsx`

- [ ] **Create the page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung Berlin in English: Complete Guide for Expats 2026 | ReadyExpat",
  description: "How to complete the Berlin Anmeldung form if you don't speak German. Every field explained in English, common translation mistakes flagged, and how to get a pre-filled correct PDF without touching a German dictionary.",
  alternates: { canonical: `${DOMAIN}/anmeldung-berlin-english` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anmeldung Berlin in English: Complete Guide for Expats 2026",
    description: "Every field on the Berlin Anmeldung form explained in English. Mistakes flagged. Pre-filled PDF available.",
    url: `${DOMAIN}/anmeldung-berlin-english`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

const FIELDS = [
  { de: "Familienstand", en: "Marital status", values: "ledig = single · verheiratet = married · geschieden = divorced · verwitwet = widowed", risk: "high" },
  { de: "Staatsangehörigkeiten", en: "Citizenship(s)", values: "Must be the German adjective form — 'amerikanisch' not 'American' or 'USA'", risk: "high" },
  { de: "Geschlecht", en: "Gender", values: "männlich = male · weiblich = female · divers = non-binary", risk: "medium" },
  { de: "Religionsgesellschaft", en: "Religion / church tax", values: "OA = no declaration (safe default). RK/EV triggers 8–9% church tax.", risk: "high" },
  { de: "Tag des Einzugs", en: "Move-in date", values: "DD.MM.YYYY only. Not MM/DD/YYYY.", risk: "high" },
  { de: "Geburtsname", en: "Birth name", values: "Name at birth if different from current surname. Leave blank if same.", risk: "low" },
  { de: "Ordens-/Künstlername", en: "Religious / stage name", values: "Leave blank if not applicable. Most expats skip this.", risk: "low" },
  { de: "Wohnungsgeberbestätigung", en: "Landlord confirmation", values: "Separate mandatory form — not part of the Anmeldeformular itself.", risk: "high" },
];

export default function AnmeldungBerlinEnglish() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Complete the Berlin Anmeldung Form in English",
        description: "Every field on the official Berlin Anmeldung form explained in English. Covers translation traps, common errors, and how to get a pre-filled correct PDF.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/anmeldung-berlin-english`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is there an official English version of the Berlin Anmeldung form?", acceptedAnswer: { "@type": "Answer", text: "No. The official Anmeldeformular is only available in German. The Bürgeramt will only accept the German form — an English translation is not accepted as a substitute. You must submit a form with all 54 fields filled correctly in German." } },
          { "@type": "Question", name: "Can I fill the Anmeldung form in English?", acceptedAnswer: { "@type": "Answer", text: "No — the form must be submitted in German. Names should be written as they appear in your passport, but all other fields (marital status, gender, religion, citizenship) must use the correct German terms." } },
          { "@type": "Question", name: "What does Staatsangehörigkeit mean on the Anmeldung?", acceptedAnswer: { "@type": "Answer", text: "Staatsangehörigkeit means citizenship or nationality. It must be filled using the German adjective form — 'amerikanisch' for American, 'britisch' for British, 'indisch' for Indian. Writing 'USA', 'USA citizen', or 'American' in English is incorrect." } },
          { "@type": "Question", name: "What is Religionsgesellschaft on the Anmeldung form?", acceptedAnswer: { "@type": "Answer", text: "Religionsgesellschaft is the religion field. Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — church tax of 8–9% of your income tax. Write OA (Ohne Angabe) to make no declaration. Most expats write OA." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Anmeldung in English", item: `${DOMAIN}/anmeldung-berlin-english` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Anmeldung in English</span>
            </div>
            <span className="pill"><span className="dot" />English Guide · All 54 Fields · Translation Traps</span>
            <h1 className="hero-title">
              The Berlin Anmeldung Form — Explained in English.
              <span className="accent">No official English version exists. Here's what every field actually means.</span>
            </h1>
            <p className="lede">The official Anmeldeformular is German-only. Every field must be completed in German or you risk rejection. Here's the complete field-by-field breakdown — and the translation traps that catch most expats.</p>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">54</text></svg>
                <div className="kf-num">Fields on the form</div>
                <p className="kf-text">All in German. All must be correct to avoid rejection at the counter.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">0</text></svg>
                <div className="kf-num">Official English versions</div>
                <p className="kf-text">There is no English Anmeldeformular. The German form is the only accepted version.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">5m</text></svg>
                <div className="kf-num">With ReadyExpat</div>
                <p className="kf-text">Answer in English. Get a perfectly filled German PDF in 5 minutes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-fields">
          <div className="wrap">
            <div className="eyebrow">01 · The Tricky Fields</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>Fields that catch expats out</h2>
            <p style={{ color: "#6b7693", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>These are the fields most commonly filled incorrectly by English-speaking expats.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, border: "1px solid #e6ebf5", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 160px 1fr 80px", gap: 0, padding: "10px 20px", background: "#f8fafc", fontSize: 11, fontWeight: 800, color: "#6b7693", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <span>German field</span><span>Means</span><span>What to write</span><span>Risk</span>
              </div>
              {FIELDS.map(({ de, en, values, risk }) => (
                <div key={de} className="reveal" style={{ display: "grid", gridTemplateColumns: "180px 160px 1fr 80px", gap: 0, padding: "14px 20px", background: "white", borderTop: "1px solid #f1f5f9", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#0040ff", fontWeight: 600 }}>{de}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0a1638" }}>{en}</span>
                  <span style={{ fontSize: 12.5, color: "#6b7693", lineHeight: 1.55, paddingRight: 20 }}>{values}</span>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                    background: risk === "high" ? "#fff1f2" : risk === "medium" ? "#fff7ed" : "#f0fdf4",
                    color: risk === "high" ? "#e11d48" : risk === "medium" ? "#d97706" : "#16a34a" }}>
                    {risk}
                  </span>
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
                  Answer in English. Get a correct German PDF.
                </div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,.6)" }}>ReadyExpat handles all 54 fields including the tricky ones above. 5 minutes. €15.</div>
              </div>
              <a href="/" style={{ background: "#0040ff", color: "white", fontWeight: 800, fontSize: 15, padding: "16px 28px", borderRadius: 12, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                Start Now →
              </a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="faq-list">
              <details><summary>Is there an official English version of the Berlin Anmeldung form?</summary><div className="ans">No. The official form is German-only. The Bürgeramt only accepts the German Anmeldeformular — all 54 fields must be completed in German.</div></details>
              <details><summary>Can I fill the Anmeldung form in English?</summary><div className="ans">No — the form must be in German. Names go as printed in your passport, but all other fields (marital status, gender, religion, citizenship) must use correct German terms.</div></details>
              <details><summary>What does Staatsangehörigkeit mean?</summary><div className="ans">Citizenship. It must be the German adjective form: 'amerikanisch' for American, 'britisch' for British, 'indisch' for Indian. Writing 'USA' or 'American' is incorrect.</div></details>
              <details><summary>What is Religionsgesellschaft and should I fill it in?</summary><div className="ans">The religion field. Declaring RK (Catholic) or EV (Protestant) triggers Kirchensteuer — church tax of 8–9% of income tax. Write OA (Ohne Angabe) to opt out. Most expats write OA.</div></details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="eyebrow">Related guides</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              {[
                { href: "/what-is-anmeldung", label: "What is Anmeldung?" },
                { href: "/anmeldung-documents", label: "Document Checklist" },
                { href: "/anmeldung-mistakes-berlin", label: "Common Mistakes" },
                { href: "/anmeldung-deadline-berlin", label: "The 14-Day Deadline" },
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
```

- [ ] **Commit**

```bash
git add app/anmeldung-berlin-english/page.tsx
git commit -m "feat: add /anmeldung-berlin-english SEO cluster page"
```

---

## Task 8: /moving-to-berlin-registration page

**Files:**
- Create: `app/moving-to-berlin-registration/page.tsx`

- [ ] **Create the page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { GuideSidebar } from "../components/guides/GuideSidebar";
import { GuideReveal } from "../components/guides/GuideReveal";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export const metadata: Metadata = {
  title: "Moving to Berlin? Your Complete Registration Guide 2026 | ReadyExpat",
  description: "Just moved to Berlin? Here's exactly what to do about address registration — what the Anmeldung is, what you need, in what order, and how to avoid the most common expat mistakes.",
  alternates: { canonical: `${DOMAIN}/moving-to-berlin-registration` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Moving to Berlin? Your Complete Registration Guide 2026",
    description: "What to do about address registration when you move to Berlin. Step by step, in English.",
    url: `${DOMAIN}/moving-to-berlin-registration`,
    siteName: "ReadyExpat Berlin",
    locale: "en_US",
    type: "article",
  },
};

const STEPS = [
  { n: "01", label: "Move in", time: "Day 0", desc: "Your 14-day clock starts the moment you move in — not when you sign the lease, not when you arrive in Germany.", color: "#0040ff" },
  { n: "02", label: "Get your Wohnungsgeberbestätigung", time: "Days 1–3", desc: "Ask your landlord to sign this mandatory form immediately. Without it you cannot register. Most landlords have it ready — if yours doesn't, send them our guide.", color: "#7c3aed", link: "/wohnungsgeberbestaetigung" },
  { n: "03", label: "Prepare your Anmeldung form", time: "Days 1–5", desc: "All 54 fields in German. Use ReadyExpat to fill it in 5 minutes in English — or fill it manually using the field guide below.", color: "#0891b2" },
  { n: "04", label: "Book a Bürgeramt appointment", time: "Days 1–7", desc: "Go to service.berlin.de and book the earliest slot. Tuesdays at 8:00 AM new slots appear — gone in seconds. Book now, even before you have all documents.", color: "#d97706", link: "/burgeramt-berlin-appointment" },
  { n: "05", label: "Gather your documents", time: "Before appointment", desc: "Passport (non-EU) or passport/national ID (EU), completed form, signed Wohnungsgeberbestätigung, visa or residence permit if you have one.", color: "#16a34a", link: "/anmeldung-documents" },
  { n: "06", label: "Attend your appointment", time: "Appointment day", desc: "Bring everything. The clerk processes your registration on the spot — takes 5–10 minutes. You receive the Anmeldebestätigung immediately.", color: "#e11d48" },
];

export default function MovingToBerlinRegistration() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Moving to Berlin: Your Complete Address Registration Guide 2026",
        description: "Step-by-step guide to the Anmeldung for people moving to Berlin — what it is, what order to do things, and how to avoid the most common mistakes.",
        author: { "@type": "Organization", name: "ReadyExpat Berlin", url: DOMAIN },
        publisher: { "@type": "Organization", name: "ReadyExpat Berlin" },
        datePublished: "2026-05-30",
        dateModified: "2026-05-30",
        mainEntityOfPage: `${DOMAIN}/moving-to-berlin-registration`,
      },
      {
        "@type": "HowTo",
        name: "How to Register Your Address in Berlin (Anmeldung)",
        description: "Step-by-step guide to completing the Berlin Anmeldung as a new expat.",
        totalTime: "PT14D",
        step: STEPS.map(s => ({ "@type": "HowToStep", name: s.label, text: s.desc })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the first thing I need to do after moving to Berlin?", acceptedAnswer: { "@type": "Answer", text: "Register your address (Anmeldung) within 14 days of moving in. You need a signed Wohnungsgeberbestätigung from your landlord, a completed Anmeldeformular, and a Bürgeramt appointment. Start all three on day one." } },
          { "@type": "Question", name: "How long does the Anmeldung process take in Berlin?", acceptedAnswer: { "@type": "Answer", text: "The appointment itself takes 5–10 minutes. Getting an appointment in Berlin can take days to weeks depending on availability. The form preparation takes 5 minutes with ReadyExpat. Start as early as possible." } },
          { "@type": "Question", name: "Do I need to register if I'm staying in Berlin temporarily?", acceptedAnswer: { "@type": "Answer", text: "If you stay more than 3 months, yes — registration is mandatory. Under 3 months, tourists and short-term visitors are exempt. Remote workers and digital nomads staying 3+ months must register regardless of their employment situation." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReadyExpat Berlin", item: DOMAIN },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${DOMAIN}/#guides` },
          { "@type": "ListItem", position: 3, name: "Moving to Berlin Registration", item: `${DOMAIN}/moving-to-berlin-registration` },
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
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80&auto=format')" }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/#guides">Guides</Link>
              <span className="sep">→</span>
              <span className="here">Moving to Berlin</span>
            </div>
            <span className="pill"><span className="dot" />New to Berlin · Step-by-step · 2026</span>
            <h1 className="hero-title">
              Just moved to Berlin?
              <span className="accent">Here's your complete address registration guide — step by step, in English.</span>
            </h1>
            <p className="lede">The Anmeldung is mandatory within 14 days. The form is in German. The process has traps. This guide gets you through it without surprises.</p>
          </div>
        </section>

        <section className="section kf-section">
          <div className="wrap">
            <div className="kf-grid">
              <div className="kf-card kf-slate reveal" style={{ transitionDelay: "0ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">14</text></svg>
                <div className="kf-num">Days to register</div>
                <p className="kf-text">Calendar days from move-in. Fine up to €1,000 if missed.</p>
              </div>
              <div className="kf-card kf-gold reveal" style={{ transitionDelay: "80ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">3</text></svg>
                <div className="kf-num">Things to prepare</div>
                <p className="kf-text">Form, Wohnungsgeberbestätigung, appointment. All three at once.</p>
              </div>
              <div className="kf-card kf-crimson reveal" style={{ transitionDelay: "160ms" }}>
                <svg className="kf-bg" width="88" height="72" viewBox="0 0 88 72" aria-hidden="true"><text x="44" y="68" fontSize="80" textAnchor="middle">5m</text></svg>
                <div className="kf-num">At the counter</div>
                <p className="kf-text">The appointment itself takes 5–10 minutes when you have everything ready.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sec-steps">
          <div className="wrap">
            <div className="eyebrow">01 · The Process</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>6 steps — in this order</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {STEPS.map(({ n, label, time, desc, color, link }) => (
                <div key={n} className="reveal" style={{ display: "flex", gap: 0, padding: "20px 24px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14, borderLeft: `4px solid ${color}`, position: "relative" }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", width: "100%" }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Step {n}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{time}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0a1638", marginBottom: 6 }}>
                        {link ? <Link href={link} style={{ color: "#0a1638", textDecoration: "none" }}>{label} →</Link> : label}
                      </div>
                      <div style={{ fontSize: 13.5, color: "#6b7693", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="sec-guides">
          <div className="wrap">
            <div className="eyebrow">02 · Go Deeper</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a1638", margin: "12px 0 24px", letterSpacing: "-0.02em" }}>Complete guides for each step</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {[
                { href: "/what-is-anmeldung", n: "01", title: "What is Anmeldung?", sub: "The law, who must register, consequences" },
                { href: "/anmeldung-online-non-eu", n: "02", title: "Online Anmeldung", sub: "Why non-EU citizens can't register online" },
                { href: "/anmeldung-documents", n: "03", title: "Document Checklist", sub: "Everything to bring to your appointment" },
                { href: "/wohnungsgeberbestaetigung", n: "04", title: "Landlord Form", sub: "What it is and how to get it signed" },
                { href: "/burgeramt-berlin-appointment", n: "05", title: "Book an Appointment", sub: "Hacks to find slots in Berlin" },
              ].map(({ href, n, title, sub }) => (
                <Link key={href} href={href} style={{ padding: "18px 20px", background: "white", border: "1px solid #e6ebf5", borderRadius: 14, textDecoration: "none", display: "block", transition: "box-shadow .15s" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Guide {n}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0a1638", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7693" }}>{sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div style={{ background: "#0a1638", borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  The form — done in 5 minutes.
                </div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,.6)" }}>Answer in English. Get a correct German PDF. €15 once.</div>
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
              <details><summary>What is the first thing I need to do after moving to Berlin?</summary><div className="ans">Register your address (Anmeldung) within 14 days. You need a signed Wohnungsgeberbestätigung from your landlord, a completed Anmeldeformular, and a Bürgeramt appointment. Start all three on day one.</div></details>
              <details><summary>How long does the Anmeldung process take in Berlin?</summary><div className="ans">The appointment itself takes 5–10 minutes. Getting an appointment can take days to weeks. The form takes 5 minutes with ReadyExpat.</div></details>
              <details><summary>Do I need to register if I'm staying in Berlin temporarily?</summary><div className="ans">If you stay more than 3 months, yes — mandatory. Under 3 months, tourists are exempt. Remote workers staying 3+ months must register regardless of employment situation.</div></details>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/moving-to-berlin-registration/page.tsx
git commit -m "feat: add /moving-to-berlin-registration SEO cluster page"
```

---

## Task 9: Update sitemap.ts

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Add 5 new entries** — replace the existing file content:

```ts
import { MetadataRoute } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://readyexpat.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: DOMAIN,                                              lastModified: new Date("2026-05-30"), changeFrequency: "weekly",  priority: 1   },
    { url: `${DOMAIN}/faq`,                                    lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/what-is-anmeldung`,                      lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/anmeldung-online-non-eu`,                lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/anmeldung-documents`,                    lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/wohnungsgeberbestaetigung`,              lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/burgeramt-berlin-appointment`,           lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/anmeldung-deadline-berlin`,              lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/anmeldung-mistakes-berlin`,              lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/anmeldung-couple-berlin`,                lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/anmeldung-berlin-english`,               lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/moving-to-berlin-registration`,          lastModified: new Date("2026-05-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/barrierefreiheit`,                       lastModified: new Date("2026-05-17"), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
```

- [ ] **Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add 5 cluster pages to sitemap"
```

---

## Task 10: Add internal links from existing guides

**Files:**
- Modify: `app/what-is-anmeldung/page.tsx` — link to `/anmeldung-deadline-berlin`
- Modify: `app/anmeldung-documents/page.tsx` — link to `/anmeldung-mistakes-berlin`
- Modify: `app/wohnungsgeberbestaetigung/page.tsx` — link to `/anmeldung-couple-berlin`
- Modify: `app/burgeramt-berlin-appointment/page.tsx` — link to `/moving-to-berlin-registration`

- [ ] **In `what-is-anmeldung/page.tsx`** — find the section that mentions the 14-day deadline (search for `14 days` or `deadline`). Add this callout box directly after the mention:

```tsx
<div style={{ margin: "16px 0", padding: "14px 18px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
  <span style={{ fontSize: 14, color: "#1e40af", fontWeight: 600 }}>Calculate your exact deadline →</span>
  <Link href="/anmeldung-deadline-berlin" style={{ fontSize: 13, fontWeight: 800, color: "#0040ff", textDecoration: "none", whiteSpace: "nowrap" }}>Deadline guide →</Link>
</div>
```

- [ ] **In `anmeldung-documents/page.tsx`** — find the intro or summary section. Add this callout:

```tsx
<div style={{ margin: "16px 0", padding: "14px 18px", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
  <span style={{ fontSize: 14, color: "#9f1239", fontWeight: 600 }}>Wrong documents = lost appointment slot</span>
  <Link href="/anmeldung-mistakes-berlin" style={{ fontSize: 13, fontWeight: 800, color: "#e11d48", textDecoration: "none", whiteSpace: "nowrap" }}>See the 6 mistakes →</Link>
</div>
```

- [ ] **In `wohnungsgeberbestaetigung/page.tsx`** — find any mention of couples or families. Add this callout:

```tsx
<div style={{ margin: "16px 0", padding: "14px 18px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
  <span style={{ fontSize: 14, color: "#5b21b6", fontWeight: 600 }}>Registering as a couple or family?</span>
  <Link href="/anmeldung-couple-berlin" style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", textDecoration: "none", whiteSpace: "nowrap" }}>Couple & family guide →</Link>
</div>
```

- [ ] **In `burgeramt-berlin-appointment/page.tsx`** — near the intro or first section. Add this callout:

```tsx
<div style={{ margin: "16px 0", padding: "14px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
  <span style={{ fontSize: 14, color: "#15803d", fontWeight: 600 }}>New to Berlin? Start with the full registration guide.</span>
  <Link href="/moving-to-berlin-registration" style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", textDecoration: "none", whiteSpace: "nowrap" }}>Moving to Berlin guide →</Link>
</div>
```

- [ ] **Commit**

```bash
git add app/what-is-anmeldung/page.tsx app/anmeldung-documents/page.tsx app/wohnungsgeberbestaetigung/page.tsx app/burgeramt-berlin-appointment/page.tsx
git commit -m "feat: add internal links from existing guides to cluster pages"
```

---

## Task 11: Build check + deploy

- [ ] **Run build locally**

```bash
npm run build
```

Expected: no errors (TypeScript errors are suppressed per `next.config.ts`, but watch for import errors or missing component references)

- [ ] **Deploy to Vercel**

```bash
git push origin main
```

- [ ] **Verify all 5 pages load**

Visit each URL and confirm it renders:
- `http://localhost:3000/anmeldung-deadline-berlin`
- `http://localhost:3000/anmeldung-mistakes-berlin`
- `http://localhost:3000/anmeldung-couple-berlin`
- `http://localhost:3000/anmeldung-berlin-english`
- `http://localhost:3000/moving-to-berlin-registration`

- [ ] **Submit to Google Search Console**

In Search Console → URL inspection → paste each URL → Request Indexing. Do all 5.

- [ ] **Submit to Bing Webmaster Tools**

Bing Webmaster → URL Inspection → submit each URL.
