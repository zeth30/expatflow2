# Easy Fragebogen zur steuerlichen Erfassung — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship ReadyExpat's second paid product: an English-language copilot for the ELSTER "Fragebogen zur steuerlichen Erfassung" (FsE EUn, solo freelancers) at `/freelance-steuer` — free ELSTER guide + €15 wizard producing an on-screen answer sheet with copy buttons and a downloadable PDF, mapped 1:1 to ELSTER's field numbers.

**Architecture:** Self-contained staging page following the Munich pattern (`app/munich/page.tsx`): phase state machine `landing → wizard → payment → generating → done`, localStorage-only data (`simplyexpat-steuer-v1`), Stripe checkout via existing `/api/checkout` extended with a `product` param, answer-sheet PDF drawn from scratch with pdf-lib (like the existing checklist/guide PDFs — no AcroForm). Field definitions live as **data** in `steuer-data.ts`; the wizard and both answer-sheet renderings (screen + PDF) are driven from that single source of truth.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, inline styles (no Tailwind), pdf-lib via CDN `loadPdfLib()`, Stripe Checkout, lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-07-06-easy-fragebogen-steuerliche-erfassung-design.md` — READ IT FIRST. The legal constraints in spec §2 are hard requirements: neutral explanations only, never a recommendation, privacy/no-storage emphasized everywhere.

**Codebase rules that apply (from CLAUDE.md / user memory):**
- No tests exist in this repo; verification = `npm run build` + manual walkthrough. Never start a local dev server; deploy via `git commit` + `git push` (Vercel auto-deploys).
- `git add` specific files only — the working tree contains unrelated changes (`app/layout.tsx`, untracked files). Never `git add -A`.
- No emojis in PDFs. No `backdropFilter` on sticky elements. Inline styles only.
- Read `CONTENT_RULES.md` before writing user-facing copy (Kirchensteuer facts apply to the Religion field!).

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Modify | `app/api/checkout/route.ts` | Add `product` param (steuer vs anmeldung line item) |
| Create | `app/freelance-steuer/steuer-data.ts` | Types, ELSTER field map w/ numbers, all English field explanations, lookups, validation |
| Create | `app/freelance-steuer/steuer-pdf.ts` | Answer-sheet PDF builder (pdf-lib, from scratch) |
| Create | `app/freelance-steuer/page.tsx` | Landing (free guide) + wizard + payment + done (client component) |
| Create | `app/freelance-steuer/layout.tsx` | Metadata (indexable, NOT in sitemap/nav — Munich pattern minus noindex) |
| Modify | `app/terms/page.tsx` | Add "Tax form assistant" disclaimer section (original wording) |

---

## Task 0: Verify legal facts before any copy ships

**Files:** none (research task — findings go into Task 2's copy)

- [ ] **Step 1: Verify §19 UStG Kleinunternehmer thresholds (2026)**

Run WebFetch on `https://www.gesetze-im-internet.de/ustg_1980/__19.html` with prompt: "What are the exact revenue thresholds for the Kleinunternehmer-Regelung — previous calendar year and current calendar year? Quote the numbers." Expected (as of 2025 reform): previous year ≤ €25,000, current year ≤ €100,000. **If the fetched numbers differ, use the fetched numbers everywhere.**

- [ ] **Step 2: Verify the filing deadline**

Run WebFetch on `https://www.gesetze-im-internet.de/ao_1977/__138.html` with prompt: "Within what deadline must a taxpayer who starts a self-employed/business activity submit the Fragebogen zur steuerlichen Erfassung (Auskünfte über die für die Besteuerung erheblichen rechtlichen und tatsächlichen Verhältnisse)? Quote the timeframe." Expected: within one month of the opening/founding event (§138 Abs. 1b/4 AO). Use the verified wording.

- [ ] **Step 3: Verify ELSTER registration lead time**

Run WebFetch on `https://www.elster.de/eportal/registrierung-auswahl` (or `https://www.elster.de/eportal/infoseite/registrierung`) with prompt: "How does a private person register for Mein ELSTER, what are the steps, and how long does the activation code by post take?" Record the official steps + stated lead time for the guide copy in Task 4. If the page is unreachable, use `https://www.elster.de/eportal/start` and navigate from search results.

- [ ] **Step 4: Record findings**

Write the three verified facts (thresholds, deadline, ELSTER lead time + steps) into a comment block at the top of `steuer-data.ts` when created in Task 2, with source URLs and today's date, so every future copy edit can cite them.

---

## Task 1: Extend checkout API with `product` param

**Files:**
- Modify: `app/api/checkout/route.ts`

- [ ] **Step 1: Add product catalog and use it**

Replace the body-parsing and `line_items` section (lines 24–53) so the route selects product copy by a `product` key. Keep everything else (consent_collection, custom_text, promo codes) identical:

```typescript
    const body = await req.json().catch(() => ({}));
    const returnPath: string = body.returnPath ?? "/";
    const productKey: string = body.product === "steuer" ? "steuer" : "anmeldung";

    const PRODUCTS = {
      anmeldung: {
        name: "ReadyExpat Berlin — Anmeldung Preparation",
        description:
          "Official Anmeldung form (all 54 fields filled), personalised checklist, and expert appointment guide. One-time digital service.",
        service: "anmeldung-preparation",
      },
      steuer: {
        name: "ReadyExpat — Easy Fragebogen zur steuerlichen Erfassung",
        description:
          "English field-by-field answer sheet for the ELSTER tax registration questionnaire (solo freelancers), on screen and as PDF. One-time digital service. Not tax advice.",
        service: "steuer-fragebogen-copilot",
      },
    } as const;
    const product = PRODUCTS[productKey];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 1500, // €15.00 in cents
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${domain}/og-image.png`],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}${returnPath === "/" ? "/#payment" : returnPath}`,
      metadata: {
        service: product.service,
        version: "1.0",
        returnPath,
      },
```

(`/api/verify-session` already returns `metadata.returnPath` and `/success` already redirects to `${returnPath}?paid=verified` — no changes needed there.)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build completes (TS errors are ignored by config, but check the route compiles — no syntax errors in output).

- [ ] **Step 3: Commit**

```bash
git add app/api/checkout/route.ts
git commit -m "feat(checkout): product param for steuer copilot line item"
```

---

## Task 2: `steuer-data.ts` — single source of truth

**Files:**
- Create: `app/freelance-steuer/steuer-data.ts`

This file holds: verified-facts comment block (Task 0), the `SteuerForm` type, defaults, lookups, validation helpers, and the **answer-sheet builder** `buildAnswerRows(form)` that maps form state → ELSTER sections/fields. Wizard UI and PDF both consume `buildAnswerRows`.

- [ ] **Step 1: Create the file with types and constants**

```typescript
// app/freelance-steuer/steuer-data.ts
// ═══════════════════════════════════════════════════════════════════
//  EASY FRAGEBOGEN ZUR STEUERLICHEN ERFASSUNG · data layer
//  Single source of truth for the FsE EUn (solo freelancer) copilot.
//  ELSTER field numbers verified against a real fseeun-202401
//  submission summary captured 2026-03 (see design spec §3).
//
//  VERIFIED LEGAL FACTS (Task 0 — update date + source when re-verified):
//  - §19 UStG Kleinunternehmer: prev. year ≤ €25,000 / current ≤ €100,000
//    Source: gesetze-im-internet.de/ustg_1980/__19.html, verified 2026-07-06
//    [REPLACE with actual verified values from Task 0 if they differ]
//  - Filing deadline: within ONE MONTH of starting the activity (§138 AO)
//    Source: gesetze-im-internet.de/ao_1977/__138.html, verified 2026-07-06
//  - ELSTER activation letter: arrives by post, officially "up to 2 weeks"
//    Source: elster.de registration pages, verified 2026-07-06
//
//  LEGAL DESIGN RULE (spec §2): every enHint explains, NEVER recommends.
//  Words like "should", "we recommend", "better", "most people pick"
//  are FORBIDDEN in field copy. Discretionary fields carry `decision: true`
//  which renders the neutral-decision banner in the wizard.
// ═══════════════════════════════════════════════════════════════════

export type SteuerForm = {
  // ── Allgemeine Angaben ──
  anrede: "" | "Frau" | "Herr" | "keine Angabe";
  firstName: string;
  lastName: string;
  birthDate: string;            // ISO yyyy-mm-dd
  profession: string;           // Ausgeübter Beruf (field 4)
  steuerId: string;             // 11-digit Identifikationsnummer (field 5)
  hasIncomeTaxNumber: boolean;  // had a German income-tax Steuernummer before?
  incomeTaxNumber: string;      // if yes (field 5) — else sheet prints "wird neu beantragt"
  religion: "none" | "rk" | "ev" | "other";  // field 5 — see CONTENT_RULES Kirchensteuer
  // ── Familienstand / Ehegatte (conditional subsection of Allgemeine Angaben) ──
  married: boolean;             // marital status gate for the Ehegatte subsection
  spouseFirstName: string; spouseLastName: string;
  spouseBirthDate: string;      // ISO
  spouseProfession: string;
  spouseSteuerId: string;       // spouse's 11-digit Identifikationsnummer
  spouseReligion: "none" | "rk" | "ev" | "other";
  // ── Adresse im Inland ──
  street: string; houseNo: string; houseNoSuffix: string;
  plz: string; city: string;
  // ── Bisherige persönliche Verhältnisse ──
  movedWithin12Months: boolean;
  movedDate: string;            // ISO (field 47)
  prevStreet: string; prevHouseNo: string; prevPlz: string; prevCity: string; // 48–50
  taxRegisteredBefore: boolean; // registered for income tax in last 3 years?
  prevTaxNumber: string;        // field 52
  // ── Tätigkeit ──
  activityDesc: string;         // field 21 — genaue Bezeichnung
  businessAddrIsHome: boolean;  // field 56
  bizStreet: string; bizHouseNo: string; bizPlz: string; bizCity: string; // only if !businessAddrIsHome
  activityStart: string;        // ISO (field 69, incl. Vorbereitungshandlungen)
  foundingDate: string;         // ISO (field 85; Gründungsart fixed "Neugründung" in v1)
  priorBusiness: boolean;       // field 93 (5-year lookback)
  // ── Bankverbindung ──
  iban: string;                 // field 22 (inländisches Geldinstitut)
  accountHolderIsSelf: boolean; // field 25
  accountHolderName: string;    // only if !accountHolderIsSelf
  // ── Vorauszahlungen (all plain-integer € strings, German-formatted on sheet) ──
  profitY1: string; profitY2: string;             // field 107 selbständige Arbeit
  employmentY1: string; employmentY2: string;     // field 108 nichtselbständige
  sonderausgabenY1: string; sonderausgabenY2: string; // field 112
  // ── Gewinnermittlung ──
  deviatingFiscalYear: boolean; // field 116 (Gewinnermittlungsart fixed EÜR in v1 — field 114)
  // ── Umsatzsteuer ──
  currentlyVatRegistered: boolean; // field 128
  revenueY1: string; revenueY2: string;           // field 130 geschätzte Umsätze
  kleinunternehmer: null | boolean; // field 131 — NO DEFAULT. User must actively choose.
  vatBalance: string;           // field 133 geschätzte Zahllast (only if kleinunternehmer === false)
};

export const EMPTY_STEUER: SteuerForm = {
  anrede: "", firstName: "", lastName: "", birthDate: "", profession: "",
  steuerId: "", hasIncomeTaxNumber: false, incomeTaxNumber: "", religion: "none",
  married: false, spouseFirstName: "", spouseLastName: "", spouseBirthDate: "",
  spouseProfession: "", spouseSteuerId: "", spouseReligion: "none",
  street: "", houseNo: "", houseNoSuffix: "", plz: "", city: "",
  movedWithin12Months: false, movedDate: "",
  prevStreet: "", prevHouseNo: "", prevPlz: "", prevCity: "",
  taxRegisteredBefore: false, prevTaxNumber: "",
  activityDesc: "", businessAddrIsHome: true,
  bizStreet: "", bizHouseNo: "", bizPlz: "", bizCity: "",
  activityStart: "", foundingDate: "", priorBusiness: false,
  iban: "", accountHolderIsSelf: true, accountHolderName: "",
  profitY1: "", profitY2: "", employmentY1: "", employmentY2: "",
  sonderausgabenY1: "", sonderausgabenY2: "",
  deviatingFiscalYear: false,
  currentlyVatRegistered: false, revenueY1: "", revenueY2: "",
  kleinunternehmer: null, vatBalance: "",
};

export const STORAGE_KEY = "simplyexpat-steuer-v1";
export const DONE_KEY    = "simplyexpat-steuer-done-v1";

// German religion values as ELSTER expects them in the dropdown
export const RELIGION_STEUER: Record<SteuerForm["religion"], string> = {
  none:  "nicht kirchensteuerpflichtig",
  rk:    "römisch-katholisch",
  ev:    "evangelisch",
  other: "nicht kirchensteuerpflichtig", // other faiths without church-tax status
};

// DD.MM.YYYY, locale-independent (same approach as main app fmtDate)
export const fmtDateDE = (iso: string): string => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : "";
};

// German thousands format: "4800" -> "4.800"
export const fmtEuro = (raw: string): string => {
  const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
  return isNaN(n) ? "" : n.toLocaleString("de-DE");
};

// IBAN: strip spaces, uppercase, mod-97 check (ISO 13616)
export const validateIBAN = (raw: string): boolean => {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, c => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of numeric) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
};

// Steuer-ID: exactly 11 digits (checksum omitted — ELSTER validates anyway)
export const validateSteuerId = (raw: string): boolean =>
  /^\d{11}$/.test(raw.replace(/\s/g, ""));
```

- [ ] **Step 2: Add the answer-row builder to the same file**

```typescript
// ── Answer sheet ────────────────────────────────────────────────────
// One row = one ELSTER field the user will fill. `nr` matches the small
// number printed next to the field in Mein ELSTER so users can track
// exactly where they are. `de` = the value to type/select (in German).
// `enHint` = short English reminder of what the field is.

export type AnswerRow = { nr: string; label: string; de: string; enHint: string };
export type AnswerSection = { title: string; titleEn: string; rows: AnswerRow[] };

export function buildAnswerRows(f: SteuerForm): AnswerSection[] {
  const sections: AnswerSection[] = [];

  sections.push({
    title: "Allgemeine Angaben — Steuerpflichtige(r)",
    titleEn: "General information — taxpayer",
    rows: [
      { nr: "2", label: "Anrede", de: f.anrede || "keine Angabe", enHint: "Salutation" },
      { nr: "2", label: "Vorname", de: f.firstName, enHint: "First name" },
      { nr: "2", label: "Name", de: f.lastName, enHint: "Last name" },
      { nr: "3", label: "Geburtsdatum", de: fmtDateDE(f.birthDate), enHint: "Date of birth" },
      { nr: "4", label: "Ausgeübter Beruf", de: f.profession, enHint: "Your occupation/activity" },
      { nr: "5", label: "Identifikationsnummer", de: f.steuerId, enHint: "Your 11-digit tax ID" },
      { nr: "5", label: "gegebenenfalls Einkommensteuernummer",
        de: f.hasIncomeTaxNumber ? f.incomeTaxNumber : "wird neu beantragt",
        enHint: f.hasIncomeTaxNumber ? "Your existing income-tax number" : "= “will be newly requested”" },
      { nr: "5", label: "Religion", de: RELIGION_STEUER[f.religion],
        enHint: "Church-tax status — see explanation in the wizard" },
      ...(f.married ? [
        { nr: "—", label: "Ehegatte/Lebenspartner(in): Vorname", de: f.spouseFirstName, enHint: "Spouse subsection (ELSTER shows it inside Allgemeine Angaben when married)" },
        { nr: "—", label: "Ehegatte: Name", de: f.spouseLastName, enHint: "Spouse's last name" },
        { nr: "—", label: "Ehegatte: Geburtsdatum", de: fmtDateDE(f.spouseBirthDate), enHint: "Spouse's date of birth" },
        { nr: "—", label: "Ehegatte: Ausgeübter Beruf", de: f.spouseProfession, enHint: "Spouse's occupation" },
        { nr: "—", label: "Ehegatte: Identifikationsnummer", de: f.spouseSteuerId, enHint: "Spouse's 11-digit tax ID" },
        { nr: "—", label: "Ehegatte: Religion", de: RELIGION_STEUER[f.spouseReligion], enHint: "Spouse's church-tax status" },
      ] : []),
    ],
  });

  sections.push({
    title: "Adresse im Inland",
    titleEn: "Address in Germany",
    rows: [
      { nr: "7", label: "Straße", de: f.street, enHint: "Street" },
      { nr: "8", label: "Hausnummer", de: f.houseNo, enHint: "House number" },
      ...(f.houseNoSuffix ? [{ nr: "8", label: "Hausnummerzusatz", de: f.houseNoSuffix, enHint: "Suffix (a, b, …)" }] : []),
      { nr: "9", label: "Postleitzahl", de: f.plz, enHint: "Postal code" },
      { nr: "9", label: "Wohnort", de: f.city, enHint: "City" },
    ],
  });

  sections.push({
    title: "Art der Tätigkeit",
    titleEn: "Type of activity",
    rows: [
      { nr: "21", label: "Art der Tätigkeit (genaue Bezeichnung)", de: f.activityDesc,
        enHint: "Precise description of your freelance activity, in German" },
    ],
  });

  sections.push({
    title: "Bankverbindung(en) für Steuererstattungen",
    titleEn: "Bank account for tax refunds",
    rows: [
      { nr: "22", label: "IBAN (inländisches Geldinstitut)", de: f.iban.replace(/\s/g, "").toUpperCase(), enHint: "Your German IBAN" },
      { nr: "24", label: "Bankkonto ist gültig für die Steuerarten", de: "alle Steuerarten", enHint: "= “all tax types”" },
      { nr: "25", label: "Kontoinhaber(in) ist",
        de: f.accountHolderIsSelf ? "der/die Steuerpflichtige" : f.accountHolderName,
        enHint: f.accountHolderIsSelf ? "= “the taxpayer” (you)" : "Name of the account holder" },
    ],
  });

  const prevRows: AnswerRow[] = [];
  if (f.movedWithin12Months) {
    prevRows.push(
      { nr: "47", label: "Innerhalb der letzten 12 Monate zugezogen am", de: fmtDateDE(f.movedDate), enHint: "Date you moved (within last 12 months)" },
      { nr: "48", label: "Straße (bisherige Adresse)", de: f.prevStreet, enHint: "Previous street" },
      { nr: "49", label: "Hausnummer", de: f.prevHouseNo, enHint: "Previous house number" },
      { nr: "50", label: "Postleitzahl", de: f.prevPlz, enHint: "Previous postal code" },
      { nr: "50", label: "Wohnort", de: f.prevCity, enHint: "Previous city" },
    );
  }
  if (f.taxRegisteredBefore) {
    prevRows.push({ nr: "52", label: "Steuernummer (falls in den letzten 3 Jahren steuerlich erfasst)", de: f.prevTaxNumber, enHint: "Your previous German tax number" });
  }
  if (prevRows.length) {
    sections.push({ title: "Bisherige persönliche Verhältnisse", titleEn: "Previous circumstances", rows: prevRows });
  }

  sections.push({
    title: "Angaben zur Tätigkeit — Unternehmen",
    titleEn: "Business details",
    rows: [
      f.businessAddrIsHome
        ? { nr: "56", label: "Anschrift des Unternehmens", de: "Die Anschrift des Unternehmens entspricht meiner Wohnanschrift. (Häkchen setzen)", enHint: "Tick: business address = home address" }
        : { nr: "56", label: "Anschrift des Unternehmens", de: `${f.bizStreet} ${f.bizHouseNo}, ${f.bizPlz} ${f.bizCity}`, enHint: "Separate business address" },
      { nr: "69", label: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", de: fmtDateDE(f.activityStart), enHint: "Start date, incl. preparation (e.g. buying equipment)" },
      { nr: "85", label: "Gründungsart", de: "Neugründung", enHint: "= “new founding” (v1 covers new foundings only)" },
      { nr: "85", label: "Gründungsdatum", de: fmtDateDE(f.foundingDate || f.activityStart), enHint: "Founding date" },
      { nr: "93", label: "Frühere Selbständigkeit / Beteiligungen (letzte 5 Jahre)", de: f.priorBusiness ? "Ja" : "Nein", enHint: "Any self-employment or company shares (≥1%) in the last 5 years?" },
    ],
  });

  sections.push({
    title: "Festsetzung der Vorauszahlungen",
    titleEn: "Advance tax payments — your estimates",
    rows: [
      { nr: "107", label: "Einkünfte aus selbständiger Arbeit — Jahr der Betriebseröffnung", de: fmtEuro(f.profitY1), enHint: "Estimated freelance PROFIT (income minus expenses), year 1" },
      { nr: "107", label: "Einkünfte aus selbständiger Arbeit — Folgejahr", de: fmtEuro(f.profitY2), enHint: "Estimated freelance profit, year 2" },
      { nr: "108", label: "Einkünfte aus nichtselbständiger Arbeit — Jahr der Betriebseröffnung", de: fmtEuro(f.employmentY1) || "0", enHint: "Estimated gross employment income (if you also have a job), year 1" },
      { nr: "108", label: "Einkünfte aus nichtselbständiger Arbeit — Folgejahr", de: fmtEuro(f.employmentY2) || "0", enHint: "Employment income, year 2" },
      { nr: "112", label: "Sonderausgaben — Jahr der Betriebseröffnung", de: fmtEuro(f.sonderausgabenY1) || "0", enHint: "Special expenses (e.g. health insurance contributions), year 1" },
      { nr: "112", label: "Sonderausgaben — Folgejahr", de: fmtEuro(f.sonderausgabenY2) || "0", enHint: "Special expenses, year 2" },
    ],
  });

  sections.push({
    title: "Gewinnermittlung",
    titleEn: "Profit determination method",
    rows: [
      { nr: "114", label: "Gewinnermittlungsart", de: "Einnahmenüberschussrechnung", enHint: "= cash-basis accounting (EÜR) — the method for solo freelancers without commercial bookkeeping duties" },
      { nr: "116", label: "Vom Kalenderjahr abweichendes Wirtschaftsjahr?", de: f.deviatingFiscalYear ? "Ja" : "Nein", enHint: "Fiscal year different from calendar year? (almost always No for freelancers)" },
    ],
  });

  const vatRows: AnswerRow[] = [
    { nr: "128", label: "Ich werde aktuell bei einem Finanzamt umsatzsteuerlich geführt", de: f.currentlyVatRegistered ? "Ja" : "Nein", enHint: "Currently VAT-registered at a German tax office?" },
    { nr: "130", label: "Summe der Umsätze (geschätzt) — Jahr der Betriebseröffnung", de: fmtEuro(f.revenueY1), enHint: "Estimated total REVENUE (before expenses), year 1" },
    { nr: "130", label: "Summe der Umsätze (geschätzt) — Folgejahr", de: fmtEuro(f.revenueY2), enHint: "Estimated revenue, year 2" },
  ];
  if (f.kleinunternehmer === true) {
    vatRows.push({ nr: "131", label: "Kleinunternehmer-Regelung", de: "Häkchen setzen (Kleinunternehmer-Regelung nach § 19 UStG in Anspruch nehmen)", enHint: "Tick the box — YOUR choice from the wizard" });
  } else if (f.kleinunternehmer === false) {
    vatRows.push(
      { nr: "131", label: "Kleinunternehmer-Regelung", de: "Häkchen NICHT setzen", enHint: "Leave unticked — YOUR choice from the wizard" },
      { nr: "133", label: "Voraussichtliche Umsatzsteuer-Zahllast (geschätzt)", de: fmtEuro(f.vatBalance) || "0", enHint: "Estimated VAT payable (VAT charged minus input VAT)" },
    );
  }
  sections.push({ title: "Anmeldung und Abführung der Umsatzsteuer", titleEn: "VAT registration", rows: vatRows });

  return sections;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build` — expected: compiles.

- [ ] **Step 4: Commit**

```bash
git add app/freelance-steuer/steuer-data.ts
git commit -m "feat(steuer): data layer — types, ELSTER field map, answer-row builder"
```

---

## Task 3: Wizard step definitions with full field copy (same file)

**Files:**
- Modify: `app/freelance-steuer/steuer-data.ts` (append)

The wizard is data-driven: each step declares its fields; `page.tsx` renders them generically. **This copy is the legally sensitive part — reproduce it exactly.** Every `explain` is neutral; `decision: true` fields additionally render the fixed decision banner (Task 5).

- [ ] **Step 1: Append step definitions**

```typescript
// ── Wizard step definitions ─────────────────────────────────────────
export type FieldDef = {
  key: keyof SteuerForm;
  label: string;              // English label shown in wizard
  deLabel: string;            // German original (shown small, builds recognition for ELSTER)
  type: "text" | "date" | "select" | "boolean" | "euro";
  options?: { value: string; label: string }[]; // for select
  placeholder?: string;
  explain: string;            // neutral English explanation (1–3 sentences)
  decision?: boolean;         // renders the your-decision banner
  showIf?: (f: SteuerForm) => boolean;
  required?: boolean | ((f: SteuerForm) => boolean);
};

export type StepDef = { id: string; title: string; sub: string; fields: FieldDef[] };

export const STEUER_STEPS: StepDef[] = [
  {
    id: "personal", title: "About you", sub: "Exactly as in your passport and Anmeldung.",
    fields: [
      { key: "anrede", label: "Salutation", deLabel: "Anrede", type: "select", required: true,
        options: [ { value: "Frau", label: "Frau (Ms)" }, { value: "Herr", label: "Herr (Mr)" }, { value: "keine Angabe", label: "No salutation (keine Angabe)" } ],
        explain: "ELSTER asks for a salutation. “Keine Angabe” means “no statement” and is a normal option." },
      { key: "firstName", label: "First name", deLabel: "Vorname", type: "text", required: true,
        explain: "As written in your passport." },
      { key: "lastName", label: "Last name", deLabel: "Name", type: "text", required: true,
        explain: "As written in your passport." },
      { key: "birthDate", label: "Date of birth", deLabel: "Geburtsdatum", type: "date", required: true,
        explain: "ELSTER displays dates as DD.MM.YYYY — your answer sheet already formats it that way." },
      { key: "profession", label: "Your occupation", deLabel: "Ausgeübter Beruf", type: "text", required: true, placeholder: "e.g. Softwareentwickler, Grafikdesignerin",
        explain: "Your job title, in German if possible. Short and factual — e.g. “Softwareentwickler”, “Fotografin”, “Übersetzer”. If you do several things, name the main one or write “mehrere” (several)." },
      { key: "steuerId", label: "Tax ID (Steuerliche Identifikationsnummer)", deLabel: "Identifikationsnummer", type: "text", required: true, placeholder: "11 digits, e.g. 12345678995",
        explain: "The 11-digit number you received by post a few weeks after your Anmeldung. It is on the letter from the Bundeszentralamt für Steuern and on every income-tax document. It is NOT the same as a Steuernummer. If you never received it, you can request it at bzst.de — you cannot submit the Fragebogen without it." },
      { key: "hasIncomeTaxNumber", label: "Have you ever had a German income-tax number (Steuernummer)?", deLabel: "Einkommensteuernummer", type: "boolean", required: true,
        explain: "Most people new to Germany have not. If you answer no, the form entry is “wird neu beantragt” (will be newly requested) — the Finanzamt then assigns you one after processing." },
      { key: "incomeTaxNumber", label: "Your existing Steuernummer", deLabel: "Einkommensteuernummer", type: "text", showIf: f => f.hasIncomeTaxNumber, required: f => f.hasIncomeTaxNumber, placeholder: "e.g. 49/099/01230",
        explain: "The format looks like 12/345/67890 and is on previous letters from a Finanzamt." },
      { key: "religion", label: "Church tax status", deLabel: "Religion", type: "select", required: true,
        options: [
          { value: "none", label: "Not church-tax liable (nicht kirchensteuerpflichtig)" },
          { value: "rk", label: "Roman Catholic (römisch-katholisch)" },
          { value: "ev", label: "Protestant (evangelisch)" },
          { value: "other", label: "Other / none of these" },
        ],
        explain: "Only membership in a church that collects church tax in Germany (mainly Catholic and Protestant churches) triggers church tax of 8–9% of your income tax. Other religions and no religion mean: not church-tax liable. This field states a fact about your membership — it does not change your faith." },
      { key: "married", label: "Are you married or in a registered partnership?", deLabel: "Familienstand", type: "boolean", required: true,
        explain: "If yes, ELSTER shows an additional subsection asking for your spouse's/partner's basic data inside “Allgemeine Angaben”. These spouse fields carry no printed field numbers in the summary — your answer sheet marks them clearly so you recognise the subsection." },
      { key: "spouseFirstName", label: "Spouse: first name", deLabel: "Ehegatte — Vorname", type: "text", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseLastName", label: "Spouse: last name", deLabel: "Ehegatte — Name", type: "text", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseBirthDate", label: "Spouse: date of birth", deLabel: "Ehegatte — Geburtsdatum", type: "date", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseProfession", label: "Spouse: occupation", deLabel: "Ehegatte — Ausgeübter Beruf", type: "text", showIf: f => f.married, explain: "In German if possible, e.g. “Lehrerin”, “angestellt”, “ohne Beschäftigung”." },
      { key: "spouseSteuerId", label: "Spouse: tax ID (11 digits)", deLabel: "Ehegatte — Identifikationsnummer", type: "text", showIf: f => f.married, explain: "On your spouse's letter from the Bundeszentralamt für Steuern. Leave empty if your spouse has none yet (e.g. just arrived) — ELSTER accepts it later by mail to the Finanzamt." },
      { key: "spouseReligion", label: "Spouse: church tax status", deLabel: "Ehegatte — Religion", type: "select", showIf: f => f.married, required: f => f.married,
        options: [
          { value: "none", label: "Not church-tax liable" },
          { value: "rk", label: "Roman Catholic (römisch-katholisch)" },
          { value: "ev", label: "Protestant (evangelisch)" },
          { value: "other", label: "Other / none of these" },
        ],
        explain: "Same logic as your own church-tax field." },
    ],
  },
  {
    id: "address", title: "Your address", sub: "Your registered German address (from your Anmeldung).",
    fields: [
      { key: "street", label: "Street", deLabel: "Straße", type: "text", required: true, explain: "Without the house number." },
      { key: "houseNo", label: "House number", deLabel: "Hausnummer", type: "text", required: true, explain: "" },
      { key: "houseNoSuffix", label: "Suffix (optional)", deLabel: "Hausnummerzusatz", type: "text", placeholder: "a, b, …", explain: "Only if your address has one, e.g. 31a." },
      { key: "plz", label: "Postal code", deLabel: "Postleitzahl", type: "text", required: true, explain: "" },
      { key: "city", label: "City", deLabel: "Wohnort", type: "text", required: true, explain: "" },
      { key: "movedWithin12Months", label: "Did you move to this address within the last 12 months?", deLabel: "Zugezogen innerhalb der letzten 12 Monate", type: "boolean", required: true,
        explain: "If yes, ELSTER asks for the move-in date and your previous address. For most people who just arrived in Germany, the previous address is abroad — enter it as it was." },
      { key: "movedDate", label: "Move-in date", deLabel: "Zugezogen am", type: "date", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months, explain: "The date on your Anmeldung confirmation (Anmeldebestätigung)." },
      { key: "prevStreet", label: "Previous street", deLabel: "Straße (bisherige Adresse)", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months, explain: "" },
      { key: "prevHouseNo", label: "Previous house number", deLabel: "Hausnummer", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevPlz", label: "Previous postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevCity", label: "Previous city (and country if abroad)", deLabel: "Wohnort", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months, explain: "e.g. “London, Vereinigtes Königreich”." },
      { key: "taxRegisteredBefore", label: "Were you registered for German income tax in the last 3 years?", deLabel: "Steuerlich erfasst in den letzten 3 Jahren", type: "boolean", required: true,
        explain: "Only yes if a German Finanzamt has processed your income tax before (e.g. you were employed here in a previous stay and filed a return)." },
      { key: "prevTaxNumber", label: "That previous tax number", deLabel: "Steuernummer", type: "text", showIf: f => f.taxRegisteredBefore, required: f => f.taxRegisteredBefore, explain: "" },
    ],
  },
  {
    id: "activity", title: "Your freelance activity", sub: "What you do, from when, and from where.",
    fields: [
      { key: "activityDesc", label: "Describe your activity (in German)", deLabel: "Art der Tätigkeit — genaue Bezeichnung", type: "text", required: true, placeholder: "e.g. Softwareentwicklung für Webanwendungen",
        explain: "One precise line. The Finanzamt uses this to classify your activity, which can affect whether it counts as freiberuflich (liberal profession) or gewerblich (trade) — that classification is made by the Finanzamt based on your description of the actual work. Describe what you really do, specifically: “Entwicklung von Websoftware” is better than “IT”." },
      { key: "businessAddrIsHome", label: "Do you work from your home address?", deLabel: "Anschrift des Unternehmens entspricht Wohnanschrift", type: "boolean", required: true,
        explain: "If yes, ELSTER has a checkbox for “business address equals home address” — no extra typing." },
      { key: "bizStreet", label: "Business street", deLabel: "Straße", type: "text", showIf: f => !f.businessAddrIsHome, required: f => !f.businessAddrIsHome, explain: "" },
      { key: "bizHouseNo", label: "Business house number", deLabel: "Hausnummer", type: "text", showIf: f => !f.businessAddrIsHome, explain: "" },
      { key: "bizPlz", label: "Business postal code", deLabel: "Postleitzahl", type: "text", showIf: f => !f.businessAddrIsHome, explain: "" },
      { key: "bizCity", label: "Business city", deLabel: "Ort", type: "text", showIf: f => !f.businessAddrIsHome, explain: "" },
      { key: "activityStart", label: "When did/will your activity start?", deLabel: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", type: "date", required: true,
        explain: "Including preparation: the day you started setting things up (buying equipment, signing contracts, building your website for clients) counts, not just your first invoice. You must submit this Fragebogen within ONE MONTH of this date (§138 AO)." },
      { key: "foundingDate", label: "Founding date (usually the same)", deLabel: "Gründungsdatum", type: "date",
        explain: "For a simple solo start this is normally the same date as above. If you leave it empty, your answer sheet repeats the start date." },
      { key: "priorBusiness", label: "In the last 5 years: any business, freelance work, or ≥1% company shareholding — in Germany or abroad?", deLabel: "Bisherige betriebliche Verhältnisse", type: "boolean", required: true,
        explain: "A factual yes/no. Yes does not block anything — the Finanzamt just wants the history." },
    ],
  },
  {
    id: "bank", title: "Bank account", sub: "Where tax refunds go.",
    fields: [
      { key: "iban", label: "Your IBAN (German bank account)", deLabel: "IBAN (inländisches Geldinstitut)", type: "text", required: true, placeholder: "DE00 0000 0000 0000 0000 00",
        explain: "This field of the form expects a German (DE) IBAN for refunds. We validate the checksum locally in your browser — the number is never sent to us." },
      { key: "accountHolderIsSelf", label: "Is the account in your name?", deLabel: "Kontoinhaber(in)", type: "boolean", required: true,
        explain: "If yes, ELSTER's option “der/die Steuerpflichtige” (the taxpayer) applies." },
      { key: "accountHolderName", label: "Account holder's name", deLabel: "Kontoinhaber(in)", type: "text", showIf: f => !f.accountHolderIsSelf, required: f => !f.accountHolderIsSelf, explain: "" },
    ],
  },
  {
    id: "estimates", title: "Income estimates", sub: "Honest guesses are expected — nobody can predict a first year exactly.",
    fields: [
      { key: "profitY1", label: "Estimated freelance PROFIT — this year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Profit = income minus business expenses, NOT your revenue. The Finanzamt uses these estimates to set your quarterly advance income-tax payments (Vorauszahlungen): a higher estimate means higher advance payments now (refunded later if you earn less), a lower estimate means lower advance payments now (with a back-payment later if you earn more). Estimates can be corrected later by writing to your Finanzamt. What to enter is your own honest estimate — we cannot advise you on the amount." },
      { key: "profitY2", label: "Estimated profit — next year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Folgejahr", type: "euro", required: true, decision: true,
        explain: "Same logic for the first full calendar year." },
      { key: "employmentY1", label: "Employment income this year, if any (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit", type: "euro",
        explain: "Only if you also have (or had) a salaried job this calendar year. 0 if none." },
      { key: "employmentY2", label: "Employment income next year (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit, Folgejahr", type: "euro", explain: "0 if none." },
      { key: "sonderausgabenY1", label: "Special expenses this year (€) — e.g. health insurance", deLabel: "Sonderausgaben", type: "euro",
        explain: "Mainly your own health and pension insurance contributions. This reduces the income the advance payments are based on. If you don't know, 0 is acceptable — it only affects the advance-payment estimate, not your final tax." },
      { key: "sonderausgabenY2", label: "Special expenses next year (€)", deLabel: "Sonderausgaben, Folgejahr", type: "euro", explain: "" },
      { key: "deviatingFiscalYear", label: "Does your business year differ from the calendar year?", deLabel: "Abweichendes Wirtschaftsjahr", type: "boolean", required: true,
        explain: "For solo freelancers this is virtually always “no” — a deviating fiscal year is a special construct that requires Finanzamt approval." },
    ],
  },
  {
    id: "vat", title: "VAT (Umsatzsteuer)", sub: "The most consequential section — read the explanations carefully. We explain, you decide.",
    fields: [
      { key: "currentlyVatRegistered", label: "Are you currently VAT-registered at a German Finanzamt?", deLabel: "Aktuell umsatzsteuerlich geführt", type: "boolean", required: true,
        explain: "Almost always no for a first-time founder." },
      { key: "revenueY1", label: "Estimated total REVENUE this year (€)", deLabel: "Summe der Umsätze, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Revenue = everything you invoice, before any expenses. This is a different number from the profit you entered earlier. Your revenue estimate also determines whether you are ELIGIBLE for the Kleinunternehmer option below." },
      { key: "revenueY2", label: "Estimated revenue next year (€)", deLabel: "Summe der Umsätze, Folgejahr", type: "euro", required: true, decision: true, explain: "" },
      { key: "kleinunternehmer", label: "Kleinunternehmer-Regelung (§ 19 UStG) — use it or not?", deLabel: "Kleinunternehmer-Regelung", type: "select", required: true, decision: true,
        options: [
          { value: "yes", label: "Use it — I will NOT charge VAT" },
          { value: "no",  label: "Don't use it — I WILL charge VAT" },
        ],
        explain: "The small-business scheme. IF your revenue stays under the legal limits (previous calendar year ≤ €25,000; current year ≤ €100,000 — in your founding year the €25,000 limit applies to your estimated founding-year revenue), you may choose it. Using it means: no VAT on your invoices, no VAT returns for these sales — and no reclaiming the VAT you pay on business purchases. Not using it means: you add VAT (usually 19%) to invoices, file VAT returns, and reclaim input VAT. Which is better depends on who your clients are, your costs, and your plans — that judgement is exactly what we are not allowed to make for you, and we don't. If you are unsure, read ELSTER's help text for field 131 or ask a Steuerberater. Whatever you choose here, your answer sheet shows the exact entry." },
      { key: "vatBalance", label: "Estimated VAT payable this year (€)", deLabel: "Voraussichtliche Umsatzsteuer-Zahllast", type: "euro", showIf: f => f.kleinunternehmer === false, required: f => f.kleinunternehmer === false,
        explain: "Rough estimate: the VAT you will charge minus the VAT you will pay on purchases. 0 is acceptable if you expect them to balance out." },
    ],
  },
];

// ── Validation ──────────────────────────────────────────────────────
export function stepError(stepId: string, f: SteuerForm): string {
  const step = STEUER_STEPS.find(s => s.id === stepId);
  if (!step) return "";
  for (const fd of step.fields) {
    if (fd.showIf && !fd.showIf(f)) continue;
    const req = typeof fd.required === "function" ? fd.required(f) : fd.required;
    const val = f[fd.key];
    if (req && (val === "" || val === null || val === undefined)) {
      return `Please fill in “${fd.label}”.`;
    }
  }
  if (stepId === "personal" && f.steuerId && !validateSteuerId(f.steuerId)) {
    return "The tax ID (Identifikationsnummer) must be exactly 11 digits.";
  }
  if (stepId === "bank" && f.iban && !validateIBAN(f.iban)) {
    return "This IBAN doesn't pass the checksum — please double-check it.";
  }
  if (stepId === "bank" && f.iban && !f.iban.replace(/\s/g, "").toUpperCase().startsWith("DE")) {
    return "This form field expects a German IBAN (starting with DE).";
  }
  return "";
}
```

Note: `kleinunternehmer` is `null | boolean` in state but rendered as a select with values "yes"/"no" — `page.tsx` maps select value → boolean (Task 5 shows this). `null` = untouched = fails required check, which is intentional (no default).

- [ ] **Step 2: Cross-check field copy against Task 0 findings**

Confirm the thresholds/deadline embedded in `explain` strings match the verified values from Task 0. Fix if not.

- [ ] **Step 3: Verify build, then commit**

```bash
npm run build
git add app/freelance-steuer/steuer-data.ts
git commit -m "feat(steuer): wizard step definitions with neutral field explanations"
```

---

## Task 4: Answer-sheet PDF builder

**Files:**
- Create: `app/freelance-steuer/steuer-pdf.ts`

- [ ] **Step 1: Create the PDF builder**

Reuse the CDN loader pattern (copy the `loadPdfLib` function verbatim from `app/munich/page.tsx:341-352`). Then:

```typescript
// app/freelance-steuer/steuer-pdf.ts
// Branded answer-sheet PDF. Drawn from scratch (no AcroForm).
// A4 = 595.28 x 841.89 pt. Bottom-left origin.

import { buildAnswerRows, type SteuerForm } from "./steuer-data";

async function loadPdfLib(): Promise<any> {
  if ((window as any).PDFLib) return (window as any).PDFLib;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload = () => resolve((window as any).PDFLib);
    s.onerror = () => reject(new Error("Could not load PDF library"));
    document.head.appendChild(s);
  });
}

const fmtToday = (): string => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

export async function buildSteuerPDF(form: SteuerForm): Promise<{ bytes: Uint8Array; name: string }> {
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const NAVY = rgb(0.06, 0.09, 0.16);
  const BLUE = rgb(0, 0.46, 1);
  const MUTED = rgb(0.39, 0.45, 0.55);
  const LINE = rgb(0.91, 0.93, 0.96);
  const PW = 595.28, PH = 841.89, ML = 48, CW = PW - ML * 2;

  const doc = await PDFDocument.create();
  const HB = await doc.embedFont(StandardFonts.HelveticaBold);
  const HR = await doc.embedFont(StandardFonts.Helvetica);
  const HO = await doc.embedFont(StandardFonts.HelveticaOblique);

  let page = doc.addPage([PW, PH]);
  let y = PH - 100;

  const drawHeader = (pg: any, first: boolean) => {
    pg.drawRectangle({ x: 0, y: PH - (first ? 74 : 40), width: PW, height: first ? 74 : 40, color: NAVY });
    pg.drawText("ReadyExpat", { x: ML, y: PH - (first ? 34 : 26), size: 13, font: HB, color: rgb(1, 1, 1) });
    if (first) {
      pg.drawText("Fragebogen zur steuerlichen Erfassung — Your ELSTER answer sheet", { x: ML, y: PH - 54, size: 10.5, font: HR, color: rgb(0.75, 0.85, 1) });
      pg.drawText(fmtToday(), { x: PW - ML - 60, y: PH - 34, size: 9, font: HR, color: rgb(0.75, 0.85, 1) });
    }
  };
  const drawFooter = (pg: any, n: number) => {
    pg.drawText(
      "Not tax advice. You entered every value yourself; ReadyExpat translated and formatted your own answers (mechanical assistance, §6 Nr. 3 StBerG). Generated locally in your browser — readyexpat.de",
      { x: ML, y: 26, size: 7, font: HO, color: MUTED, maxWidth: CW - 40 }
    );
    pg.drawText(`Page ${n}`, { x: PW - ML - 30, y: 26, size: 8, font: HR, color: MUTED });
  };

  drawHeader(page, true);
  let pageNo = 1;
  drawFooter(page, pageNo);

  const newPageIfNeeded = (needed: number) => {
    if (y - needed < 60) {
      page = doc.addPage([PW, PH]);
      pageNo += 1;
      drawHeader(page, false);
      drawFooter(page, pageNo);
      y = PH - 64;
    }
  };

  // Intro box
  const intro = "How to use this sheet: open Mein ELSTER (elster.de) in one window and this sheet next to it. The small numbers match the field numbers ELSTER shows next to each input. Work top to bottom — every value below is one of YOUR answers, formatted in German.";
  page.drawRectangle({ x: ML, y: y - 46, width: CW, height: 54, color: rgb(0.94, 0.97, 1), borderColor: rgb(0.73, 0.9, 1), borderWidth: 1 });
  page.drawText(intro, { x: ML + 10, y: y - 6, size: 8.5, font: HR, color: NAVY, maxWidth: CW - 20, lineHeight: 11 });
  y -= 66;

  for (const section of buildAnswerRows(form)) {
    newPageIfNeeded(46);
    page.drawRectangle({ x: ML, y: y - 6, width: CW, height: 22, color: NAVY });
    page.drawText(section.title, { x: ML + 8, y: y, size: 9.5, font: HB, color: rgb(1, 1, 1) });
    page.drawText(section.titleEn, { x: ML + 8, y: y - 26, size: 8, font: HO, color: MUTED });
    y -= 42;
    for (const row of section.rows) {
      newPageIfNeeded(34);
      page.drawText(row.nr, { x: ML, y, size: 8, font: HB, color: BLUE });
      page.drawText(row.label, { x: ML + 22, y, size: 8.5, font: HR, color: MUTED, maxWidth: 250 });
      page.drawText(row.de || "—", { x: ML + 285, y, size: 9.5, font: HB, color: NAVY, maxWidth: CW - 290 });
      if (row.enHint) {
        page.drawText(row.enHint, { x: ML + 22, y: y - 11, size: 7, font: HO, color: MUTED, maxWidth: CW - 30 });
      }
      page.drawLine({ start: { x: ML, y: y - 17 }, end: { x: ML + CW, y: y - 17 }, thickness: 0.5, color: LINE });
      y -= 26;
    }
    y -= 10;
  }

  // Closing note
  newPageIfNeeded(60);
  page.drawText("Before you submit in ELSTER:", { x: ML, y, size: 9.5, font: HB, color: NAVY });
  y -= 14;
  for (const line of [
    "Review every value on the ELSTER summary screen — you are responsible for your entries.",
    "ELSTER will show a transmission protocol after submitting. Save it.",
    "Your Steuernummer arrives by post, typically within a few weeks.",
  ]) {
    page.drawText("•  " + line, { x: ML + 6, y, size: 8.5, font: HR, color: MUTED, maxWidth: CW - 12 });
    y -= 13;
  }

  const bytes = await doc.save();
  return { bytes, name: "readyexpat-steuer-answer-sheet.pdf" };
}
```

- [ ] **Step 2: Verify build, then commit**

```bash
npm run build
git add app/freelance-steuer/steuer-pdf.ts
git commit -m "feat(steuer): answer-sheet PDF builder"
```

---

## Task 5: The page — phases, landing guide, wizard, payment, done

**Files:**
- Create: `app/freelance-steuer/page.tsx`
- Create: `app/freelance-steuer/layout.tsx`

This is the largest task. Follow the Munich component structure (`app/munich/page.tsx:2374-2572`) — same phase machine, same localStorage/devtest/back-lock effects (adapt STORAGE_KEY/DONE_KEY imports from `steuer-data.ts`, route string `/freelance-steuer`), same restart modal. Reuse `SharedNav`, `AppFooter`, `CookieBanner` imports. Colors: `NAVY = "#0f172a"`, `BLUE = "#0075FF"`, `MUTED = "#64748b"`.

- [ ] **Step 1: Create `layout.tsx`**

Copy `app/munich/layout.tsx` structure. Title: `"Fragebogen zur steuerlichen Erfassung in English — Freelancer Tax Registration Help"`. Description: `"Fill Germany's freelancer tax registration (Fragebogen zur steuerlichen Erfassung) via ELSTER with confidence. Every field explained in English. Your answers stay in your browser — nothing stored on our servers. Not tax advice."`. Canonical `/freelance-steuer`. **Do NOT set `robots: { index: false }`** (spec: indexable, just not promoted).

- [ ] **Step 2: Landing phase component**

Structure (all inline styles, Anmeldung design language — navy hero, white cards):
1. **Hero:** badge "New · Beta", H1 "The German freelancer tax form, in English.", sub: "Every new freelancer in Germany must submit the Fragebogen zur steuerlichen Erfassung — online, via ELSTER, in German, within one month of starting. We translate every field into plain English. You answer in English, we hand you every German entry."
2. **Privacy trust block (prominent, directly under hero CTA):** shield icon + "**Your data never touches our servers.** Everything you type — your tax ID, IBAN, income estimates — stays in your browser (localStorage) and is processed there. We receive only your Stripe payment confirmation. Close the tab and it's still yours; clear it anytime with one click."
3. **"What is this form?" section** — 3 cards: Who must file (anyone starting self-employment), Deadline (one month from start, §138 AO — verified value from Task 0), What happens after (Steuernummer by post, then you can invoice properly).
4. **Free ELSTER account guide** (this is the free content, fully visible without paying, `id="elster-guide"`): numbered steps from Task 0's verified findings — (1) Get your Steuer-ID (arrives by post 2–4 weeks after Anmeldung; up to 6–8 weeks in peak season — consistent with existing site copy), (2) Register at elster.de with "Zertifikatsdatei" option using your Steuer-ID, (3) Wait for the activation letter by post (officially up to 2 weeks), (4) Enter activation code + download your certificate file, keep it safe — it's your login, (5) Open the form: Alle Formulare → "Fragebogen zur steuerlichen Erfassung" → Einzelunternehmen. Each step in English with the German UI labels quoted so users recognize them.
5. **How the paid product works** — 3 steps with the two-tabs illustration described in text: "Answer in English (10–15 min) → Pay €15 once → Get your answer sheet: on screen with copy buttons + as PDF. Open ELSTER next to it and transfer field by field — the field numbers match."
6. **Transparency box (why no filled PDF):** "Why don't we just give you a filled-out form? Because Germany abolished the paper version — since 2021 this form can only be submitted through your personal ELSTER account (paper is reserved for rare hardship cases). Anyone selling you a 'filled PDF' of this form is selling paper you can't submit. What actually helps is having every answer ready in German, in ELSTER's exact order — that's what you get."
7. **Legal clarity box:** "We are not a Steuerberatung and give no individual tax advice. We explain what each field means in plain English; every entry and every choice is yours (mechanical assistance per §6 Nr. 3 StBerG). For advice on what's right for your situation, consult a Steuerberater."
8. **FAQ** (5 items, `<details>` accordions like the guides): Is this tax advice? (no — see above) · Do I need ELSTER first? (yes — free guide above) · What if my revenue changes later? (estimates are correctable by writing to your Finanzamt) · Can I use this if I'm employed AND freelancing? (yes — the form has fields for both) · Refunds? (digital service, delivered instantly — right of withdrawal is waived at checkout per §356 BGB, same as our Anmeldung product).
9. **CTA → wizard.** Footer.

Include Article + FAQPage JSON-LD (`dangerouslySetInnerHTML`, same pattern as guide pages) with `dateModified` set to today.

- [ ] **Step 3: Generic wizard renderer**

One component renders any `StepDef`:

```tsx
function FieldInput({ fd, form, setForm }: { fd: FieldDef; form: SteuerForm; setForm: (f: SteuerForm) => void }) {
  if (fd.showIf && !fd.showIf(form)) return null;
  const val = form[fd.key];
  const set = (v: any) => setForm({ ...form, [fd.key]: v });
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 2 }}>
        {fd.label}
        <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12, marginLeft: 8 }}>{fd.deLabel}</span>
      </label>
      {fd.explain && <p style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.55, margin: "4px 0 8px" }}>{fd.explain}</p>}
      {fd.decision && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: 8 }}>
          <p style={{ fontSize: 11.5, color: "#92400e", lineHeight: 1.5 }}>
            <strong>Your decision.</strong> We explain the mechanics; we don&apos;t recommend an option. Unsure? Check ELSTER&apos;s official help for this field or ask a Steuerberater.
          </p>
        </div>
      )}
      {fd.type === "boolean" ? (
        <div style={{ display: "flex", gap: 10 }}>
          {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
            <button key={l} onClick={() => set(v)} style={{
              flex: 1, padding: "11px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 14,
              border: val === v ? "2px solid #0075FF" : "1px solid #e2e8f0",
              background: val === v ? "#eff6ff" : "white", color: val === v ? "#0075FF" : "#64748b",
            }}>{l}</button>
          ))}
        </div>
      ) : fd.type === "select" ? (
        <select
          value={fd.key === "kleinunternehmer" ? (val === true ? "yes" : val === false ? "no" : "") : String(val ?? "")}
          onChange={e => set(fd.key === "kleinunternehmer" ? (e.target.value === "yes" ? true : e.target.value === "no" ? false : null) : e.target.value)}
          style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", background: "white" }}>
          <option value="">— select —</option>
          {fd.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={fd.type === "date" ? "date" : "text"}
          inputMode={fd.type === "euro" ? "numeric" : undefined}
          value={String(val ?? "")}
          placeholder={fd.placeholder}
          onChange={e => set(fd.type === "euro" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
          style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit" }}
        />
      )}
    </div>
  );
}
```

Wizard shell: sidebar with the 6 step labels (About you · Address · Activity · Bank · Estimates · VAT) + step counter + privacy line ("Stays in your browser") + restart button (own `confirmRestart` modal — WizardLayout pattern, modal at top level NOT inside `<aside>`, per BUG 10/Safari note in CLAUDE.md). Validation on Next via `stepError(stepId, form)`. Last step → review screen listing all `buildAnswerRows` sections (grey preview, no copy buttons yet) → "Continue to payment".

- [ ] **Step 4: Payment phase**

Clone `MunichPaymentPage` layout but with real Stripe (Berlin `page.tsx:3828-3859` pattern):

```tsx
const res = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ returnPath: "/freelance-steuer", product: "steuer" }),
});
```

Card contents: "Easy Fragebogen — solo freelancer" · line items (Complete English walkthrough of every ELSTER field · Answer sheet on screen with copy buttons · Same sheet as PDF download) · the privacy box ("Your tax ID, IBAN and income data never reach our servers — everything stays in your browser") · the not-tax-advice disclaimer box · Pay €15 button · devtest skip button gated by `sessionStorage.getItem("devtest") === process.env.NEXT_PUBLIC_DEV_TOKEN` (Munich pattern).

- [ ] **Step 5: Generating + done phases**

Generating: spinner (Munich pattern), calls `buildSteuerPDF(form)`, stores bytes in state, sets DONE_KEY.

Done page:
- Header: "Your answer sheet is ready." + button row: **Download PDF** (blob download of `pdfBytes`; if `sessionError`, show the contact-support banner instead — `getForm`-returns-null pattern from BUG 6) + **Open Mein ELSTER** (link `https://www.elster.de/eportal/login`, `target="_blank" rel="noopener"`).
- Sticky mini-header showing "Section X of Y" as user scrolls (simple scroll listener on section refs).
- For each `AnswerSection`: navy section header (German title + English subtitle), then rows: field number chip (blue), German label (small, muted), the value in a mono-style box with a **Copy** button:

```tsx
function CopyValue({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => {
      try { await navigator.clipboard.writeText(value); } catch {
        const ta = document.createElement("textarea");
        ta.value = value; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      setOk(true); setTimeout(() => setOk(false), 1400);
    }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: ok ? "#f0fdf4" : "white", color: ok ? "#16a34a" : "#0075FF", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
      {ok ? <Check size={12} /> : <CopyIcon size={12} />} {ok ? "Copied" : "Copy"}
    </button>
  );
}
```

(`CopyIcon` = lucide `Copy`, aliased on import to avoid the DOM `Copy` name clash: `import { Copy as CopyIcon } from "lucide-react"`.)
- Footer of done page: disclaimer line (same as PDF footer) + restart button.

- [ ] **Step 6: Verify build, then commit**

```bash
npm run build
git add app/freelance-steuer/page.tsx app/freelance-steuer/layout.tsx
git commit -m "feat(steuer): Easy Fragebogen page — landing guide, wizard, payment, answer sheet"
```

---

## Task 6: Terms disclaimer section

**Files:**
- Modify: `app/terms/page.tsx`

- [ ] **Step 1: Read the existing terms page** to find the section list structure and match its heading/paragraph styles exactly.

- [ ] **Step 2: Append a new section** (original wording — do NOT copy any competitor text):

Heading: "Tax Form Assistant (Easy Fragebogen zur steuerlichen Erfassung)". Body paragraphs:
1. "The tax form assistant translates and explains the fields of the official ELSTER questionnaire in English and formats the answers you yourself provide. This constitutes mechanical assistance based on your individual instructions (§ 6 Nr. 3 StBerG). ReadyExpat is not a tax consultancy (Steuerberatung) within the meaning of the Steuerberatungsgesetz, is not admitted to provide tax advice, and does not provide individual tax advice, tax planning, or recommendations of any kind."
2. "All entries, estimates, and elections (including whether to apply the Kleinunternehmer-Regelung under § 19 UStG) are made exclusively by you. You are responsible for reviewing your entries in ELSTER before submission. For advice on your individual tax situation, consult a licensed Steuerberater or lawyer."
3. "All form data you enter is processed locally in your browser and stored only in your browser's localStorage. It is not transmitted to or stored on ReadyExpat's servers. Payment processing is handled by Stripe; see the privacy policy."

- [ ] **Step 3: Verify build, then commit**

```bash
npm run build
git add app/terms/page.tsx
git commit -m "feat(terms): disclaimer section for tax form assistant"
```

---

## Task 7: Copy audit (auditor subagent — user's standing rule)

**Files:** none modified by the auditor directly; findings fixed in `steuer-data.ts` / `page.tsx`.

- [ ] **Step 1: Dispatch an independent auditor subagent** with this brief: "Read `app/freelance-steuer/steuer-data.ts` and `app/freelance-steuer/page.tsx`. Report: (1) any sentence in user-facing copy that recommends a choice, uses 'should/we recommend/better/most people', or otherwise crosses from explanation into advice; (2) any legal-fact claim (numbers, deadlines, § references) that does not match the verified-facts comment block at the top of `steuer-data.ts`; (3) any answer-sheet row whose German value would be wrong for the captured ELSTER sample in the design spec §3 (docs/superpowers/specs/2026-07-06-easy-fragebogen-steuerliche-erfassung-design.md); (4) any place where the privacy promise (localStorage-only) is contradicted by actual code (e.g. data sent in a fetch)."

- [ ] **Step 2: Fix every finding.** Re-run the auditor once if findings were substantive. Commit fixes:

```bash
git add app/freelance-steuer/ app/terms/page.tsx
git commit -m "fix(steuer): copy audit findings"
```

---

## Task 8: End-to-end verification + deploy

- [ ] **Step 1: Full build**

Run: `npm run build` — expected: clean completion, `/freelance-steuer` in the route list.

- [ ] **Step 2: Manual walkthrough via devtest (no local server — use Vercel preview after push, per user rule)**

Push to main (Vercel auto-deploys), then on the deployed site with `?devtest=<NEXT_PUBLIC_DEV_TOKEN>`:
1. Complete the wizard with the spec §3 sample persona (Lisa Meyer, Schwimmtraining, revenue 4.800/7.200, Kleinunternehmer = yes, profit 1.500/3.900, employment 10.800, Sonderausgaben 2.500).
2. Verify the answer sheet matches the captured ELSTER summary in spec §3 value-for-value (dates DD.MM.YYYY, euro amounts German-formatted, "wird neu beantragt", "nicht kirchensteuerpflichtig", "der/die Steuerpflichtige", "alle Steuerarten").
3. Verify copy buttons work, PDF downloads and renders all sections, restart clears both localStorage keys.
4. Verify Kleinunternehmer = no shows field 133 and the "Häkchen NICHT setzen" row.
5. Reload after closing tab → done page restores; clear localStorage → sessionError banner appears (no blank sheet).

- [ ] **Step 3: Stripe test**

With Stripe test keys in a preview environment (or live with an immediate refund if no test env exists — ask user): pay → `/success` → redirected to `/freelance-steuer?paid=verified` → sheet auto-generates.

- [ ] **Step 4: Final commit + push**

```bash
git add -u app/freelance-steuer docs/superpowers/plans/2026-07-06-easy-fragebogen-steuerliche-erfassung.md
git commit -m "feat(steuer): ship Easy Fragebogen zur steuerlichen Erfassung (staging)"
git push
```

Report deploy URL and walkthrough results to the user. Do NOT add nav/homepage/sitemap entries — post-validation step per spec §7.
