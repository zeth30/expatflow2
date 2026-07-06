# Easy Fragebogen zur steuerlichen Erfassung — Design Spec

**Date:** 2026-07-06
**Status:** Approved for implementation (pending user review of this spec)
**Product name:** Easy Fragebogen zur steuerlichen Erfassung
**Route:** `/freelance-steuer` (staging, like `/munich` — no nav entry, reduced discoverability until validated)

---

## 1. What this is

ReadyExpat's second product: an English-language copilot for the **Fragebogen zur steuerlichen Erfassung** (tax registration questionnaire) that every new freelancer in Germany must submit — **electronically via ELSTER only** (paper has not been accepted since 2021, except hardship cases).

Because the form cannot be submitted on paper, this product does **not** generate a fillable official PDF. Instead:

1. **Free content (SEO + trust):** a full English guide to the process — what the Fragebogen is, the 1-month deadline after starting self-employment (§138 AO), and step-by-step how to get an ELSTER account as a new arrival (registration → activation letter by post ~2 weeks → certificate file).
2. **Paid product (€15, one-time):** a wizard that asks every question of the real form in plain English, explains each field neutrally, and produces an **answer sheet mapped 1:1 to the ELSTER form's sections, field order, and field numbers** — viewable on screen (tab-next-to-tab workflow with per-field copy buttons) **and downloadable as a branded PDF** for safekeeping. The user opens Mein ELSTER in one tab, the answer sheet in the other, and transfers confident German answers field by field.

This dual-output (online + downloadable) is explained transparently to the user in simple English: *"Germany only accepts this form online through ELSTER. That's why we don't give you a printout to hand in — we give you every answer, in German, in exactly the order ELSTER asks for it."*

**Scope v1:** Solo freelancer / Einzelunternehmer (FsE EUn) only. No employees, no Personengesellschaft, no Kapitalgesellschaft, no Handelsregister cases.

---

## 2. Legal positioning (hard constraint)

- The product operates under the **§6 Nr. 3 StBerG** pattern used by German consumer tax software: mechanical assistance performed according to the taxpayer's own case-specific instructions. We translate and explain; **the user decides everything**.
- **Never recommend a choice.** Discretionary fields (Kleinunternehmerregelung, income estimates, profit method) get: neutral explanation of what the field means and what the law says, an explicit "this is your decision" framing, and a pointer to the official ELSTER help text / a Steuerberater for individual advice.
- **Own Terms & Disclaimer** (original wording, NOT copied from Taxfix or anyone): ReadyExpat is not a Steuerberatung within the meaning of the StBerG, provides no individual tax advice, and the user is responsible for their own entries. Disclaimer appears (a) in the Terms, (b) visibly in the wizard before the discretionary fields, (c) on the answer sheet itself.
- All legal-fact claims in copy (thresholds, deadlines, § references) must be verified against current 2026 law during implementation — especially the **§19 UStG Kleinunternehmer thresholds (since 2025: €25,000 previous year / €100,000 current year)** and the **1-month filing deadline (§138 AO)**. No number ships unverified.

---

## 3. Form coverage — verified field map (FsE EUn, ELSTER 2026)

Source: actual ELSTER submission summary of `fseeun-202401` (captured 2026-03). ELSTER field numbers in parentheses — these appear on the answer sheet so the user can match fields exactly.

| ELSTER section | Fields (nr) |
|---|---|
| **Allgemeine Angaben — Steuerpflichtige(r)** | Anrede, Vorname, Name (2) · Geburtsdatum (3) · Ausgeübter Beruf (4) · Identifikationsnummer, ggf. ESt-Steuernummer, Religion (5) |
| **Adresse im Inland** | Straße (7) · Hausnummer + Zusatz (8) · PLZ, Wohnort (9) |
| **Art der Tätigkeit** | Genaue Bezeichnung der Tätigkeit (21) |
| **Bankverbindung** | IBAN (22) · gültig für Steuerarten (24) · Kontoinhaber (25) |
| **Bisherige persönliche Verhältnisse** | Zugezogen innerhalb 12 Monate am (47) · bisherige Adresse (48–50) · frühere Steuernummer falls vorhanden (52) |
| **Unternehmen** | Anschrift = Wohnanschrift ja/nein (56) · Beginn der Tätigkeit inkl. Vorbereitungshandlungen (69) |
| **Gründungsangaben** | Gründungsart + Datum (85) |
| **Bisherige betriebliche Verhältnisse** | Frühere Selbständigkeit / Beteiligungen letzte 5 Jahre (93) |
| **Vorauszahlungen** | Voraussichtliche Einkünfte selbständig, Jahr 1 + Folgejahr (107) · nichtselbständig (108) · Sonderausgaben (112) |
| **Gewinnermittlung** | Gewinnermittlungsart — EÜR (114) · abweichendes Wirtschaftsjahr (116) |
| **Umsatzsteuer** | Aktuell umsatzsteuerlich geführt (128) · geschätzte Umsätze Jahr 1 + Folgejahr (130) · Kleinunternehmer-Regelung (131) · geschätzte Zahllast (133) |

The captured sample shows the fields of a filled minimal case; during implementation, the wizard must be cross-checked against a live walk-through of the empty ELSTER form so conditional fields (e.g. spouse data for married filers, foreign bank account variant) are not missed. Fields that only appear for out-of-scope cases (employees, Handelsregister) are omitted and documented as such on the answer sheet ("not needed for solo freelancers without employees").

---

## 4. Architecture

Mirrors the Munich staging pattern and the Anmeldung product patterns:

- **`app/freelance-steuer/page.tsx`** — self-contained client component, phase state machine `landing → wizard → payment → generating → done` (same as Anmeldung). Contains the free guide content on the landing phase (what the Fragebogen is, deadline, ELSTER account setup walkthrough) and the paid wizard.
- **localStorage key:** `simplyexpat-steuer-v1` (+ `simplyexpat-steuer-done-v1` completion flag) — fully separate from Anmeldung data. Privacy model identical: form data never leaves the browser.
- **Payment:** reuse `/api/checkout` with a `product` parameter (`anmeldung` default | `steuer`) so the Stripe line-item name and success redirect path are correct. €15 one-time. Success flow mirrors Anmeldung: verify session → redirect back with `?paid=verified` → auto-generate.
- **Answer sheet PDF:** generated client-side with pdf-lib **from scratch** (like the existing checklist/guide PDFs — not an AcroForm fill). Branded ReadyExpat header, section-by-section layout matching the table above, field numbers, German values, English sub-captions, disclaimer footer.
- **On-screen answer sheet:** same data rendered as the done-phase UI — sticky section nav, per-field copy button, "open Mein ELSTER" link, progress hint ("you are in section 3 of 8").
- **Wizard steps (mirroring ELSTER section order):** `personal → address → activity → bank → history → business-start → income-estimates → vat → review`.
- **Translations:** reuse existing lookup tables from Anmeldung where applicable (dates DD.MM.YYYY via existing `fmtDate` pattern); new small lookups for Steuerarten, Gewinnermittlungsart, Gründungsart.
- **Terms page:** extend the existing terms/legal page with the new product's disclaimer section (original wording).
- **SEO:** landing gets proper metadata + Article/FAQ JSON-LD, but stays out of sitemap/nav until validated (Munich pattern). `robots` noindex NOT set — discoverable by URL, just not promoted.

## 5. Error handling & edge cases

- Same session-loss guard as Anmeldung: `getForm()` returns `null` when localStorage is gone → error banner with support email, never a blank sheet.
- Payment return with unrestored form → same 600ms restore-then-generate pattern, guarded by presence of required fields.
- Copy buttons: clipboard API with fallback (select-text) for older browsers.
- Numeric fields (income estimates, IBAN): format validation client-side; IBAN checksum validation; amounts formatted German-style (1.500) on the sheet.

## 6. Verification & delivery

- Build passes (`npm run build`), no local dev servers — verification on Vercel after `git push` (user's standing rule).
- Multi-agent pattern (user's standing rule): builder implements; independent auditor subagent reviews all user-facing copy for (a) factual accuracy against the verified field map and cited law, (b) any sentence that could read as a recommendation — every finding fixed before ship.
- Manual end-to-end: complete wizard with a realistic solo-freelancer case, verify answer sheet against the captured ELSTER sample structure, verify PDF renders and downloads, verify Stripe test-mode checkout roundtrip.

## 7. Out of scope (v1)

- ELSTER API / ERiC submission (requires manufacturer registration — separate track)
- Employees / Lohnsteuer fields, Personengesellschaft, Kapitalgesellschaft
- German-language UI
- Nav/homepage integration and sitemap entry (post-validation, like Munich)
- Any recommendation engine ("should I choose Kleinunternehmerregelung?") — permanently out of scope by legal design, not just v1
