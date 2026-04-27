# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build (TypeScript errors are ignored — see next.config.ts)
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no tests. `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so the build will not fail on type errors.

## Environment Variables

Three variables are required; copy `.env.local.example` or set them directly:

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_DOMAIN` | Full domain, no trailing slash (e.g. `https://simplyexpat.de`) |
| `RESEND_API_KEY` | Resend API key for post-payment reminder emails |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from Stripe Dashboard (for `/api/webhook`) |

## Architecture

This is **SimplyExpat Berlin** — a Next.js 16 / React 19 app that lets expats fill in Berlin's official Anmeldung (address registration) form in English and generate a correctly-filled German PDF.

### Privacy model
All form data is stored exclusively in `localStorage` under the key `simplyexpat-v1`. It never reaches the server. The only data transmitted server-side is: Stripe payment info, and optionally a first name + email for the reminder email.

### Payment flow
1. User completes the wizard → reaches the payment step
2. `POST /api/checkout` creates a Stripe Checkout session (€15, one-time)
3. Stripe redirects to `/success?session_id=...`
4. `/success` page calls `POST /api/verify-session` to confirm `payment_status === "paid"`
5. On success, redirects to `/?paid=verified`, which auto-triggers PDF generation in `page.tsx`
6. `/api/webhook` receives `checkout.session.completed` events from Stripe for server-side logging

### PDF generation
PDF generation is entirely client-side using `pdf-lib`. The template is `public/anmeldung.pdf` (the official Berlin Anmeldung AcroForm). All 54 AcroForm field names are defined in the `F` constant at the top of `app/page.tsx`. Field character limits are in `FIELD_LIMITS` (enforced by `truncField()`). For households with more than 2 people, the app generates `ceil(n/2)` PDF sheets and packages them in a ZIP via client-side Blob concatenation.

### Key files

- **`app/page.tsx`** (~4800 lines) — the entire frontend: wizard steps, state management (`FormData`/`Person` types), all lookup tables (country/citizenship translations to German), PDF fill logic, Stripe checkout trigger, ZIP generation, and email opt-in UI. The app phase state machine is: `landing → wizard → payment → generating → done`.
- **`app/layout.tsx`** — metadata, OpenGraph tags, JSON-LD schema (`SoftwareApplication` + `FAQPage`).
- **`app/success/page.tsx`** — payment verification landing page; reads `?session_id` and calls `/api/verify-session`.
- **`app/api/checkout/route.ts`** — creates Stripe Checkout sessions.
- **`app/api/verify-session/route.ts`** — verifies a session is `paid` + `complete`.
- **`app/api/webhook/route.ts`** — Stripe webhook receiver (logs `checkout.session.completed`).
- **`app/api/send-email`** (file, not directory) — POST handler that calls `lib/resend.ts` to send post-generation reminder emails. Receives only `{ to, firstName, sheets }`.
- **`lib/resend.ts`** — `sendReminderEmail()` using the Resend SDK. Sends a styled HTML email with next-steps instructions (print → book appointment → bring checklist).

### Wizard steps (in order)
`origin → new-address → prev-address → people → status → documents → review`

### German translation tables
`page.tsx` contains large inline lookup tables: `COUNTRY_DE` (English country name → German), `CITIZENSHIP_DE` (adjective/country → German adjective), `GENDER_DE`, `RELIGION_DE`, `MARITAL_DE`, and `CITIZENSHIP_TO_COUNTRY` (citizenship → `{ country, isEU }`). These drive both UI dropdowns and PDF field values — edits here affect what gets printed in the PDF.

# SimplyExpat Berlin — Developer Transfer Package
> Paste this file + the latest `page.tsx` into a new Claude chat. Claude will be immediately up to speed.

---

## 1. PROJECT OVERVIEW

**Product:** SimplyExpat Berlin  
**What it does:** Auto-fills the official German Anmeldung (residence registration) PDF form in English. Users answer a wizard, pay €15 via Stripe, and download a perfectly filled PDF ready for the Bürgeramt.  
**Stack:** Next.js 16.2.3 (App Router), TypeScript, pdf-lib (CDN via loadPdfLib()), Stripe, Resend, inline styles only (no Tailwind/CSS modules)  
**Repo:** github.com/zeth30/expatflow2 (branch: main)  
**Live:** simplyexpat.de (Vercel, deploy via deploy hook)  
**Local path:** /Users/zeth/expatflow/

---

## 2. FILE MAP

| Output file | Goes to in repo |
|---|---|
| `page.tsx` | `app/page.tsx` |
| `[app-success]-page.tsx` | `app/success/page.tsx` |
| `[app-api-checkout]-route.ts` | `app/api/checkout/route.ts` |
| `[app-api-verify-session]-route.ts` | `app/api/verify-session/route.ts` |
| `[app-api-send-email]-route.ts` | `app/api/send-email/route.ts` |
| `[app-api-webhook]-route.ts` | `app/api/webhook/route.ts` |
| `layout.tsx` | `app/layout.tsx` |
| `sitemap.ts` | `app/sitemap.ts` |
| `robots.ts` | `app/robots.ts` |

**In `/public/`:** `anmeldung.pdf` (the official form template), `wg-template.pdf`, `favicon.svg`

---

## 3. ARCHITECTURE

### App Phases
```
landing → wizard → payment → generating → done
```

### Wizard Steps
```
origin → new-address → prev-address → people → status → documents → review
```

### Storage
- `simplyexpat-v1` — form data in localStorage
- `simplyexpat-done-v1` — completion flag (set after generation, cleared only by "restart")

### Payment Flow
1. PaymentPage → POST `/api/checkout` → Stripe hosted checkout
2. Stripe → `/success?session_id=xxx`
3. `/success/page.tsx` → POST `/api/verify-session` → confirms paid → redirects to `/?paid=verified`
4. `page.tsx` detects `?paid=verified` → restores form → `stripeReturnRef.current = true` → `phase = "generating"`
5. useEffect watches form restoration (checks `form.people[0]?.firstName && form.newStreet`) → fires `doGenerate()` after 600ms
6. `doGenerate` → PDFs generated → `setPhase("done")` immediately
7. Form data is NOT wiped after generation (kept for re-downloads)
8. `simplyexpat-done-v1` stored → returning users always land on done page

---

## 4. PDF FIELD NAMES (verified from actual PDF bytes)

**CRITICAL:** This PDF uses `"On"` not `"Yes"` for checkbox checked state. pdf-lib's `.check()` uses `"Yes"` and silently fails. All checkboxes must be set via `acroField.dict.set(PDFName.of("AS"), PDFName.of("On"))`.

```typescript
const F = {
  FAMILIENSTAND: "Familienstand 1oder 1 und 2Row1",
  NEUE_ALLEINIG: "Die neue Wohnung ist alleinige Wohnung",
  NEUE_HAUPT:    "Die neue Wohnung ist Hauptwohnung",
  NEUE_NEBEN:    "Die neue Wohnung ist Nebenwohnung",
  NEUE_EINZUG:   "Neue Wohnung Tag des Einzugs",
  NEUE_PLZ:      "Neue Wohnung des Einzugs Postleitzahl Gemeinde Ortsteil",
  NEUE_STRASSE:  "Neue Wohnung Straße Hausnummer Zusätze",
  BIS_ALLEINIG:  "Die \\(letzte\\) bisherige Wohnung \\(im Inland\\) war alleinige Wohnung",
  BIS_HAUPT:     "Die \\(letzte\\) bisherige Wohnung \\(im Inland\\) war Hauptwohnung",
  BIS_NEBEN:     "Die \\(letzte\\) bisherige Wohnung \\(im Inland\\) war Nebenwohnung",
  BIS_AUSZUG:    "Bisherige Wohnung Tag des Auszugs",
  BIS_PLZ:       "Bisherige Wohnung Postleitzahl Gemeinde Kreis Land",
  BIS_STRASSE:   "Bisherige Wohnung Straße Hausnummer Zusätze",
  AUSLAND_STAAT: "Bei Zuzug aus dem Ausland Staat",
  BEIB_NEIN:     "Wird die bisherige Wohnung beibehalten? Nein",
  BEIB_JA:       "Wird die bisherige Wohnung beibehalten? Ja und zwar als",
  BEIB_HAUPT:    "Wird die bisherige Wohnung beibehalten? Ja und zwar als Hauptwohnung",
  BEIB_NEBEN:    "Wird die bisherige Wohnung beibehalten? Ja und zwar als Nebenwohnung",
  WEITERE_NEIN:  "] noch weitere Wohnungen Nein",
  WEITERE_JA:    "] noch weitere Wohnungen Ja",
  P1_NAME:       "Person 1 Familienname ggf Doktorgrad Passname",
  P1_VORNAME:    "Person 1 Vornamen Rufnamen unterstreichen",
  P1_GEBURTSNAME:"Person 1 Geburtsname",
  P1_GESCHLECHT: "Person 1 Geschlecht",
  P1_GEBURT:     "Person 1 Tag Ort Land der Geburt",
  P1_RELIGION:   "Person 1 Religionsgesellschaft",
  P1_STAATSANG:  "Person 1 Staatsangehörigkeiten",
  P1_ORDENS:     "Person 1 Ordens- Künstlername",
  P2_NAME:       "Person 2 Familienname ggf Doktorgrad Passname",
  P2_VORNAME:    "Person 2 Vornamen Rufnamen unterstreichen",
  P2_GEBURTSNAME:"Person 2 Geburtsname",
  P2_GESCHLECHT: "Person 2 Geschlecht",
  P2_GEBURT:     "Person 2 Tag Ort Land der Geburt",
  P2_RELIGION:   "Person 2 Religionsgesellschaft",
  P2_STAATSANG:  "Person 2 Staatsangehörigkeiten",
  P2_ORDENS:     "Person 2 Ordens- Künstlername",
  EHE_ANGABEN:   "Angaben zur Eheschließung  Lebenspartnerschaft Datum Ort Land AZ",
  DOK1_NAME:     "Dokument 1 Name, Vorname",
  DOK1_ART:      "Dokument 1 Art",
  DOK1_BEHOERDE: "Dokument 1 Ausstellungsbehörde",
  DOK1_SERIAL:   "Dokument 1 Seriennummer",
  DOK1_DATUM:    "Dokument 1 Datum",
  DOK1_GUELTIG:  "Dokumente 1 gültig bis",
  DOK2_NAME:     "Dokument 2 Name Vorname",
  DOK2_ART:      "Dokument 2 Art",
  DOK2_BEHOERDE: "Dokument 2 Ausstellungsbehörde",
  DOK2_SERIAL:   "Dokument 2 Seriennummer",
  DOK2_DATUM:    "Dokumen 2 Datum",  // NOTE: typo in official PDF
  DOK2_GUELTIG:  "Dokument 2 gültig bis",
  UNTERSCHRIFT:  "Datum, Unterschrift [",
}
```

---

## 5. MULTI-PERSON LOGIC

- Max 6 people, 2 per sheet → `sheets = ceil(people.length / 2)`
- Sheet assignment: `p1 = people[sheet*2]`, `p2 = people[sheet*2+1]`
- **FAMILIENSTAND logic:**
  - `p1.relationship === "child"` → always `ledig` (even on sheet 2+)
  - `p1.relationship === "spouse"` on sheet 2 → gets household marital status (NOT ledig)
  - `p1.relationship === "primary"` → household marital status
- **EHE_ANGABEN:** Only filled on sheets where `p1` is NOT a child. Marriage info comes from household `FormData` (not per-person).
- **CRITICAL BUG HISTORY:** `EHE_ANGABEN` is a parent field with TWO child widgets. `setText()` on parent writes to BOTH causing duplicate text. Current fix: draw white rectangle at `x=140, y=267, w=327, h=14` to erase form rendering, then draw text at `x=142, y=270` directly on page. Bypasses AcroForm entirely. The right box starts at x=468+, so text never bleeds into it. **IMPORTANT:** pdf-lib uses bottom-left origin — the field's PDF rect is `[140.28, 267.0, 467.28, 280.2]` so y=267 is correct. An earlier version wrongly used y=561/564 (calculated as `PH - rect_top` which is unnecessary since pdf-lib coords already match raw PDF coords).

---

## 6. DATE FORMAT

All dates in PDF must be DD.MM.YYYY with zero-padding:
```typescript
const fmtDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00"); // noon avoids timezone shifts
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
};
```
HTML `lang="de-DE"` set in layout.tsx so date inputs display DD/MM/YYYY.

---

## 7. ADDRESS LOGIC

- **Neue Wohnung:** Street + house number + Zusätze (floor/VH/HH), comma-separated: `"Hauptstr 12, 2. OG"`
- **Bisherige Wohnung:**
  - German previous address: full address in BIS_PLZ and BIS_STRASSE
  - Foreign previous address: BIS_PLZ stays EMPTY, only AUSLAND_STAAT gets the country
  - The old code wrongly put the country in BIS_PLZ for foreign addresses — fixed

---

## 8. DESIGN SYSTEM

**Colors:**
- Primary navy: `#0f172a`
- Primary blue: `#0075FF`
- Success green: `#16a34a`
- Background light: `#f8fafc`
- Muted text: `#64748b`

**Style:** Clean, minimal, trustworthy. Light white background on landing/wizard. Dark navy header. No Tailwind — pure inline styles throughout. No emojis in PDF. No backdrop-filter blur on sticky elements (causes modal rendering glitch).

**Layout:** Wizard has sidebar (300px) + main content (max-width 720px). Done page has dark navy sidebar (320px) + main content on desktop, single column on mobile.

**CSS classes used:** `wizard-aside`, `wizard-main-pad`, `wizard-max`, `done-layout`, `done-main`, `done-sidebar`, `hero-grid`, `hero-berlin-img`, `landing-grid`, `section-pad`, `hero-pad`

---

## 9. IMPORTANT LEGAL/CONTENT FACTS

- **14-day rule:** Bundesmeldegesetz §17 — must register within 14 days of moving in. Fine up to €1,000. BUT: as long as appointment is booked, Amt tolerates delays. No fine if you show up with appointment.
- **Wohnungsgeberbestätigung:** Landlord must sign under §19 BMG. Refusal = fine up to €1,000 for landlord. Many landlords include it in move-in docs automatically.
- **Kirchensteuer:** To leave church (Kirchenaustritt) requires visit to Standesamt, approx. €30-40 fee. NOT free, NOT at Finanzamt. Previous incorrect text said "no penalty, change at Finanzamt" — this is wrong.
- **Appointment hacks:** Tuesday 7:55 AM on service.berlin.de (new slots appear at 8:00 AM, gone in 60 seconds). Call 115 at 7 AM for cancellations. Walk-ins: Bürgeramt Tempelhof (Tempelhofer Damm 165), Mitte (Karl-Marx-Allee 31).
- **Print:** DM or Rossmann self-service kiosks ~€0.10-0.15/page. Bürgeramt does NOT accept phone screens.
- **Signature:** Must sign form AFTER printing at the bottom ("Datum, Unterschrift"). Do NOT sign before printing.
- **British:** Post-Brexit, NOT EU. Previously had isEU:true — fixed.

---

## 10. KNOWN BUGS & HOW TO FIX THEM

### BUG 1: EHE_ANGABEN duplicate — FIXED (2026-04-26)
**Problem:** Marriage info appears in both left and right boxes.
**Root cause:** `EHE_ANGABEN` parent field has 2 child widgets. `setText()` propagates to both.
**Approaches that FAILED:** `form.getCheckBox().check()` (wrong API), `acroField.Kids()` splice (internal array not exposed), dict.set V/DV (appearance stream still writes both), Kids array manipulation (restoring right child still wrote both).
**Fix:** Draw white rectangle at `x=140, y=267, w=327, h=14` (pdf-lib bottom-left coords matching the PDF rect), then draw text at `x=142, y=270`. Bypasses AcroForm entirely. Also sets `V` on the parent for PDF readers that read AcroForm data without updating appearances.
**Note:** An earlier version used y=561/564 — wrong. That was calculated as `PH - rect_top` but pdf-lib already uses the same bottom-left origin as raw PDF coords. The correct y is 267 (from the field's rect `[140.28, 267.0, 467.28, 280.2]`).
**Status:** Unverified in production — generate PDF with married person and confirm right AZ box is blank.

### BUG 2: Checkboxes not ticking
**Problem:** All checkboxes appear unchecked.
**Root cause:** This PDF uses `"On"` as the checked appearance state, not `"Yes"` (pdf-lib default).
**Fix:** Use `acroField.dict.set(PDFName.of("AS"), PDFName.of("On"))` directly instead of `.check()`.
**Current chk() implementation:**
```typescript
const chk = (n: string, checked: boolean) => {
  try {
    const fields = form.getFields();
    const field = fields.find((f: any) => { try { return f.getName() === n; } catch { return false; } });
    if (!field) return;
    const acro = (field as any).acroField;
    acro.dict.set(PDFName.of("AS"), PDFName.of(checked ? "On" : "Off"));
    acro.dict.set(PDFName.of("V"),  PDFName.of(checked ? "On" : "Off"));
  } catch {}
};
```

### BUG 3: BIS_PLZ shows country for foreign previous address
**Problem:** "Iran" appearing in PLZ field instead of only AUSLAND_STAAT.
**Fix:** Check `prevIsGerman` flag, only include country in BIS_PLZ for German addresses.

### BUG 4: Spouse on sheet 2 gets ledig
**Problem:** Primary + child + spouse → spouse ends up on sheet 2 as p1, but sheet 2 forces `maritalStatus: "ledig"`.
**Fix:** Use `p1.relationship === "child"` check, not sheet number. Spouse on any sheet gets real marital status.

### BUG 5: Checklist items silently cut off — FIXED (2026-04-26)
**Problem:** Birth certificate items (and others) randomly missing from checklist PDF when page is full. Previously used a pre-check threshold (`cur1 > PH - FOOTER_H - 60`) before drawing — this was imprecise and items that fell into the gap were silently dropped.
**Fix:** `checkItem()` already returns `cursor` unchanged when an item doesn't fit (line: `if (cursor + totalH > PH - FOOTER_H - 10) return cursor`). The loop now uses detect-and-retry: draw the item, if `cur1 === prevCur` the item was skipped — call `overflowToNextPage()` then retry. This is exact and handles items of any height.
**`overflowToNextPage()`** is a closure that draws the footer on the current page, adds a new page with navy header, and resets `cur1 = 52`. It mutates the outer `curPage1` and `cur1` variables directly (JS closure by reference).

### BUG 6: Blank PDF on re-download after tab close — FIXED (2026-04-26)
**Problem:** React state cleared on tab close. Re-downloading generates from empty form.
**Fix:** Don't wipe localStorage after generation. `getForm()` reads from localStorage as fallback. Returns `null` (not empty form) when data is truly gone — shows `sessionError` banner in DonePage instead of generating a blank PDF. Banner text tells user to contact info@simplyexpat.de with payment confirmation.

### BUG 7: Back button from done page goes to wizard/payment
**Fix:** `popstate` handler checks `simplyexpat-done-v1` flag, calls `window.history.replaceState({ ph: "done" })`. Also push 2 extra history entries on done page mount. Also `useEffect` watching `phase` redirects immediately if done flag set.

### BUG 8: Modal behind dropdown (blurry sidebar)
**Problem:** Sidebar with `backdropFilter: blur()` creates stacking context that breaks `position: fixed` modals above it.
**Fix:** Remove `backdropFilter` from sidebar and StickyNav. Use solid white background instead.

### BUG 9: Dev skip button scope
**Never add a dev skip payment button** that calls `setPaid(true)` — the paid state is in the parent app, not PaymentPage. If you need to test without paying, use Stripe test mode keys (`sk_test_...`).

### BUG 10: WizardLayout restart button scope — FIXED (2026-04-26)
**Problem:** Restart button in sidebar called `setShowWipe(true)` which is DonePage state — not accessible in WizardLayout.
**Fix:** `WizardLayout` has its own `confirmRestart` state and shows a confirmation modal ("Clear & restart" / "Keep my data"). It accepts an `onRestart` prop from the main app. Main app's `onRestart` removes both `simplyexpat-v1` and `simplyexpat-done-v1` from localStorage, resets form to `EMPTY`, and navigates to landing phase.

### BUG 11: Guide PDF "Good luck" closing text was factually wrong — FIXED (2026-04-26)
**Problem:** Page 2 of the guide PDF ended with "The hardest part was getting the appointment. You have already done that." — but users receive this PDF before they've booked an appointment.
**Fix:** Changed to "Next step: book your Buergeramt slot at service.berlin.de  (Tuesdays 8:00 AM, gone in 60 s)." — actionable and accurate.

---

## 11. ENVIRONMENT VARIABLES (Vercel)

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `NEXT_PUBLIC_DOMAIN` | `https://simplyexpat.de` |
| `RESEND_API_KEY` | `re_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from live webhook endpoint) |

**Stripe webhook:** dashboard.stripe.com → Developers → Webhooks → endpoint `https://simplyexpat.de/api/webhook` → event `checkout.session.completed`

---

## 12. GERMAN TRANSLATION REQUIREMENTS (NEEDS WORK)

The PDF form requires German text. Two translation functions exist:

**`toGermanCountry(englishName)`** — uses `COUNTRY_DE` dict  
**`toGermanCitizenship(raw)`** — uses `CITIZENSHIP_DE` dict, handles comma-separated multi-citizenship

**KNOWN ISSUE:** `COUNTRY_DE` and `CITIZENSHIP_DE` need comprehensive expansion. Both adjective forms ("American") AND country names ("United States") must be searchable in the citizenship dropdown. The `ALL_COUNTRIES` array is derived from `COUNTRY_DE` keys and used for birth country and previous address country dropdowns.

**Key correct translations to verify:**
- United States → Vereinigte Staaten von Amerika / amerikanisch
- United Kingdom → Vereinigtes Königreich / britisch (NOT EU post-Brexit)
- Switzerland → Schweiz / schweizerisch (NOT EU, EFTA only)
- Turkey → Türkei / türkisch
- Iran → Iran / iranisch
- Netherlands → Niederlande / niederländisch
- South Korea → Südkorea / südkoreanisch
- Saudi Arabia → Saudi-Arabien / saudi-arabisch
- UAE → Vereinigte Arabische Emirate / emiratisch

---

## 13. NOT YET IMPLEMENTED (IDEAS)

1. **Steuerliche Erfassung** — tax registration form, shown as "coming soon" in nav
2. **Elterngeld** — parental benefit, shown as "coming soon" in nav
3. **Email reminder** — currently only sends next-steps email (no PDFs). Could add 7-day reminder to book appointment
4. **Multi-language** — German UI for German speakers who want to help family
5. **Appointment booking integration** — deep link to specific Bürgeramt calendar slots
6. **WG-Zimmer flow** — simplified flow for people renting a room (Untermiete), different landlord form
7. **Abmeldung** — de-registration form when leaving Berlin
8. **Vollmacht** — power of attorney template for registering someone else
9. **OG image** — `public/og-image.png` (1200×630) still missing, affects social sharing
10. **Referral tracking** — currently no referral code system despite referral block on done page

---

## 14. CHECKLIST ITEMS (Done Page + PDF — must be identical)

Both the done page cards and the PDF checklist show:
1. Anmeldung form(s) — printed on paper
2. Wohnungsgeberbestätigung — signed by landlord
3. Identity documents — per person (EU: passport or ID; non-EU: passport only)
4. Birth certificates — ONLY for people born outside Germany (with translation warning)
5. Appointment confirmation
6. Marriage certificate (if married, with translation warning if foreign)
7. Visa/residence permit (if non-EU)
8. Mietvertrag copy (recommended, not required)

---

## 15. CURRENT STATUS

**Working:**
- Full wizard flow with validation
- Stripe payment (live keys)
- PDF generation with correct field names
- Multi-person support (up to 6)
- Per-person EU detection
- Date format DD.MM.YYYY with zero-padding
- Marital status logic (relationship-based, not age-based)
- Done page navigation guard (can't go back)
- Form data persists for re-downloads; `getForm()` returns `null` (not empty form) when session gone — shows error banner
- Landing page with Berlin photo, 14-day warning
- Checklist PDF overflow/multi-page: detect-and-retry ensures no items silently dropped
- Guide PDF page 2 fully personalised; closing text corrected (appointment not yet booked)
- WizardLayout restart: own `confirmRestart` modal + `onRestart` prop from main app
- SEO: title, description, sitemap, robots

**Unverified (needs test PDF):**
- EHE_ANGABEN direct-draw fix: coordinates corrected (y=267/270 not y=561/564) — generate a married-person PDF and confirm right AZ box is blank
- Checkbox On/Off fix (verified for alleinige Wohnung, other checkboxes unconfirmed)

**Known remaining issue:**
- German translations in COUNTRY_DE and CITIZENSHIP_DE need comprehensive audit and expansion — user reported countries missing from dropdowns

---

## 16. CHANGELOG

### 2026-04-27
- **EHE_ANGABEN y-coordinates** — fixed `y:561/564` → `y:267/270`. Old values were calculated as `PH - rect_top` but pdf-lib already uses bottom-left origin. Unverified in prod — needs test with married person.
- **Checklist overflow (birth certificates missing)** — replaced pre-check threshold with detect-and-retry: draw item, if `checkItem` returns same cursor it was skipped → `overflowToNextPage()` + retry.
- **Guide PDF closing text** — "You have already done that [the appointment]" was wrong (users haven't booked yet). Changed to actionable next-step line.
- **WizardLayout restart modal** — restart button was referencing DonePage state. Fixed: `WizardLayout` has own `confirmRestart` state + `onRestart` prop from main app.
- **Safari sidebar modal bug** — `position:fixed` inside `position:sticky` clips overlay to sidebar in Safari. Moved both modals to top level of `WizardLayout` return, outside `<aside>`. Also removed `backdropFilter:blur` from `confirmHome`.
- **Dev skip payment button** — `[DEV] Skip payment & generate PDFs` on PaymentPage, gated by `?devtest=1` URL param on first load. Flag stored in `sessionStorage` at top of main `useEffect` (before early returns) so it survives wizard navigation.
- **Country dropdown duplicates** — alias keys (`UK`, `USA`, `UAE`, `Bosnia`) removed from `COUNTRY_DE` (were showing twice in `ALL_COUNTRIES`). Moved to `COUNTRY_ALIASES` table; `toGermanCountry()` checks both.
- **UK post-Brexit** — removed "United Kingdom" from `EU_OPTS`/`EU_OPTS2`, moved to `NON_EU_OPTS`. Deleted dead `EU_SET` constant (unused and had UK incorrectly as EU).
- **Marriage country translation** — changed from plain `<Inp>` to `SearchableSelect` with `ALL_COUNTRIES` so `toGermanCountry()` always gets a canonical name to translate into the EHE_ANGABEN field.

---

*End of transfer package. Upload this file + latest page.tsx from GitHub to new chat.*
