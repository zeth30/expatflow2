# Munich UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Munich's `/munich` wizard (landing, wizard shell, payment, done) a freshly designed UI that feels like a sibling of Berlin's polished `app/page.tsx` experience — same brand palette and copy where the underlying question is identical — without cloning Berlin's JSX, touching its PDF fill logic, merging the two codebases, or introducing a real Stripe charge for Munich.

**Architecture:** All changes confined to `app/munich/page.tsx` (self-contained, `"use client"`, no imports from `app/page.tsx`). New sub-components added to the same file: `MunichLandingPage`, `MunichWizardShell` (replaces the current flat wizard container), `MunichPaymentPage`, `MunichDonePage`. `fillMunichSheet`, `MF`, `FAMST_CODE`, `REL_CODE`, `ART_CODE`, `GESCHL_VALS`, `WOHNUNG_VALS`, and all step-data types/validation (`getError`, `MunichForm`, `Person`) are **not modified** — only their consuming JSX changes.

**Tech Stack:** Next.js 16 App Router, TypeScript, React 19, inline styles (no Tailwind), lucide-react icons. Mirrors `app/page.tsx`'s palette constants (`NAVY #0f172a`, `BLUE #0075FF`, `MUTED #64748b`, background `#f8fafc`) already defined at `app/munich/page.tsx:588-591`.

---

## 1. Design decisions

### 1.1 Landing page — new layout, Munich-specific proof points
Keep the single-column, top-down flow (not Berlin's 2-column hero) but make it feel considered rather than plain:
- Pill badge "München · Anmeldung" (existing) → keep.
- Hero: headline + subhead (existing copy is fine, carries over).
- **New:** a stacked "document mockup" visual to the right on desktop (reuse Berlin's rotated-paper-stack pattern conceptually — 2 offset white rectangles behind a screenshot-style card — but built fresh for Munich, ideally using a Munich form screenshot if available, otherwise a generic styled placeholder) instead of Berlin's 2-column `hero-grid`. This is a genuinely new component (`MunichHeroVisual`), not an import of Berlin's JSX.
- **New:** replace the plain 3-box "grid of icons" with a horizontal "3-in-1" feature strip using the same bordered-box pattern Berlin uses conceptually (icon chip + title + bullet list) but content is Munich-specific: "Munich Anmeldung PDF" (105 fields, official Landeshauptstadt München form), "Up to 4 people, one sheet" (contrast with Berlin's multi-sheet), "Non-moving spouse support" (a feature Berlin doesn't have).
- **New:** a stats strip: "105 fields", "4 people/sheet", "5 min", "0 bytes stored" (Munich-specific numbers, not Berlin's 54/44).
- Keep `AppFooter` + `CookieBanner` (shared components, fine to reuse — these are generic site chrome, not Berlin wizard UI).
- Do **not** add the Berlin-skyline photo band or Berlin FAQ/guides section — Munich has no equivalent guide articles yet; adding them is out of scope (no new content pages).

### 1.2 Wizard shell — new structure, not a sidebar clone
Berlin's signature is a persistent 300px left `wizard-aside` with a gamified "Confidence vs. Bureaucracy" ring and a sheets-needed counter. Munich has **no multi-sheet concept** (always 1 sheet, max 4 people) and no gamified metaphor — cloning the sidebar would be hollow (nothing to put in the sheets-counter, ring math and "monster" copy wouldn't map to Munich's shorter, calmer flow). Instead:

- **New pattern — horizontal stepper header + centered card + collapsible desktop side-panel:**
  - Sticky top bar: logo/back button, a horizontal row of 7 numbered step pills (one per `WizardStep`), each showing a checkmark when completed, clickable if completed or current (same navigability rule as Berlin: no skipping ahead). Replaces the current thin 3-segment top-of-card progress bar.
  - Below the stepper, centered content card (max-width 640, same white/rounded-20/border/shadow treatment already used ad hoc in Berlin's `wizard-max` card) holding the active `Step*` component.
  - **New, desktop-only, replacing Berlin's always-on sidebar:** a slim floating "Munich notes" panel to the right of the card (not full height, not sticky-aside — a self-contained rounded card, ~260px, that scrolls with the page) showing 1-2 short contextual tips per step (e.g. on `people`: "Munich fits 4 people per sheet — no separate forms needed"; on `status`: explain the non-moving spouse concept; on `documents`: the RP/PA/KRP/KA/AKN code cheatsheet). This is structurally different from Berlin's sidebar (not full-height, not persistent nav, no ring/gamification) while still giving Munich its own "extra help" surface. On mobile it collapses into an expandable `<details>`-style disclosure under the card instead of disappearing entirely (Berlin hides its sidebar completely on mobile).
  - Bottom nav buttons: keep Munich's existing Back / Continue row, but adopt Berlin's mobile fixed-bottom-nav pattern (rebuilt independently — a `position: fixed` bar with the two buttons) since Munich currently has no mobile-specific nav at all.
- Keep the restart-confirmation modal (already implemented well) as-is.

### 1.3 Payment page — same structural "reveal" pattern, no Stripe, "beta free" made prominent
Reuse the *layout idea* of Berlin's payment page (dark navy/blue gradient hero collapsing into an overlapping white summary card) — freshly coded, not copy-pasted — because it's a good pattern for "what you get" framing, and it keeps the sibling brand feel:
- Gradient hero (`linear-gradient(135deg,#0f172a,#1e3a8a)`) with small logo lockup "ReadyExpat München", a badge "München Beta · Free" (green, not the amber/red urgency pill Berlin uses — Munich has no 14-day-deadline copy in this hero since there's no payment pressure), and a one-line headline ("Your Munich Anmeldung is ready to generate").
- White card overlapping the hero (`margin-top: -60px`) listing: what's included (1 official Munich Anmeldung PDF, all fields auto-filled in German), a summary line of the entered data (name + address, as today), and the single CTA button: **"Get my Munich PDF — Free (beta)"**.
- Directly under the button: a small note "Munich is free while we're in beta — no card required" (keep existing `onDevSkip` wiring; do not add `/api/checkout`).
- Do not add the Stripe disclaimer/§356 BGB withdrawal text (irrelevant — no payment is happening).

### 1.4 Done page — same visual quality/pattern as Berlin's, single-column (no fake multi-download)
Berlin's Done page succeeds via: a green gradient success banner with a personalized one-liner + tag chips, one prominent primary download card, secondary content cards, a dark "next step" CTA card, and a bring-list. Munich only produces **one** PDF (no Guide/WG PDFs exist for Munich — do not invent new PDF generation, that's out of scope), so the redesign should carry over the *visual quality and information hierarchy*, scaled to one artifact:
1. Green gradient success banner (`linear-gradient(135deg,#14532d,#16a34a)`) — "{FirstName}, your Munich Anmeldung is ready." + tag chips summarizing people count / EU status / non-moving-spouse-included, mirroring Berlin's chip row pattern but Munich-specific values.
2. One large primary download button card (navy→blue gradient, big icon, "Download Munich Anmeldung PDF", subtext "All fields filled in German · Print & sign"). No secondary/tertiary download cards since there's nothing else to download.
3. A dark "Next step" card (navy→blue gradient) with a CTA linking out to Munich's official Bürgerbüro appointment booking (`https://stadt.muenchen.de/infos/anmeldung-muenchen.html` or the actual KVR terminvereinbarung URL — builder to verify the correct link at implementation time) — mirrors Berlin's "Book on service.berlin.de" card but pointed at Munich's own booking portal, since Berlin's URL is Berlin-specific and must not be reused.
4. A light "Next steps" checklist card (already exists, keep content, restyle to match the rounded/bordered card language) covering print/sign/book/bring.
5. Foreign-document translation warning card, shown conditionally (reuse the same conditional logic pattern as Berlin's `hasForeignBirth`/`hasForeignMarriage`, computed locally in Munich's own component — do not import Berlin's helpers).
6. Non-moving-spouse-specific note, if `form.nonMovingSpouse` is set: a short card explaining that the spouse's data was filled in the appropriate PDF section and does not require their physical presence.
7. Keep the existing session-error banner and restart button/modal — already implemented well, keep as-is.

### 1.5 What is explicitly NOT changing
- `fillMunichSheet`, `MF` field map, `FAMST_CODE`/`REL_CODE`/`ART_CODE`/`GESCHL_VALS`/`WOHNUNG_VALS`, `MunichForm`/`Person` types, `getError` validation, `EMPTY`/`EMPTY_PERSON`/`EMPTY_NMS`, `STEPS` order, `COUNTRY_DE`/translation tables, `buildMunichPDF`.
- The free/skip-pay behavior (`onDevSkip` → `setPhase("generating")` directly) stays exactly as-is; only the visual wrapper around the button changes.
- The `/munich` route, file location, and self-contained-file architecture stay as-is.

---

## 2. Copy carryover: verbatim vs. changed

**Carries over verbatim (or near-verbatim) from Berlin because the underlying question is the same:**
| Concept | Berlin wording | Munich wording | Verdict |
|---|---|---|---|
| Dwelling type 3-way choice | "Sole residence (Alleinige Wohnung)" / "Primary residence (Hauptwohnung)" / "Secondary residence (Nebenwohnung)" (`app/page.tsx:3297`) | Munich UI currently says "Einzige Wohnung — only dwelling..." | **Align Munich's English labels to Berlin's exact phrasing** ("Sole residence" / "Primary residence" / "Secondary residence") — the concept and even 2 of 3 German nouns are identical; only the PDF's internal radio value differs (`einzige` vs `alleinige`), which is already correctly isolated in `WOHNUNG_VALS` and must not change. |
| "Where are you moving from?" / country picker | Same pattern | Same pattern | Keep Munich's wording (already aligned). |
| Marital status options list | ledig/verheiratet/geschieden/verwitwet/Lebenspartnerschaft/getrennt lebend | Same 6 options, same German terms | Keep as-is (already aligned). |
| "Progress saved on your device" / data-safety reassurance | Present in Berlin sidebar & payment page | Missing in Munich | **Add** — carry the exact reassurance copy ("Your data never reaches our servers... deleted after generation") into Munich's new side-panel/payment page. |
| Signature reminder ("sign after printing, not before") | Present | Present (Done page) | Keep as-is. |
| "We prepare your documents perfectly. We do not register you..." disclaimer | Present (payment page) | Missing | **Add** to Munich's new payment/done copy — legally important disclaimer, city-agnostic. |

**Must change because Munich's fields genuinely differ:**
| Difference | Berlin | Munich | Plan impact |
|---|---|---|---|
| People per form | 2 per sheet, multiple sheets (`sheetsNeeded`) | Up to 4 on **one** sheet, no multi-sheet concept | Remove all "sheets needed" UI (counter, per-sheet grouping) from Munich's new wizard shell — replace with a single "4 slots" note. |
| Non-moving spouse | No such concept | `nonMovingSpouse` block, German label "Nicht mitziehende/r Ehe-/Lebenspartner*in" | New step-content section (already implemented in `StepStatus`, keep) needs a dedicated tip in the new side-panel and a summary line in Review + Done. |
| Document type codes | RP / PA / KP (3 codes) | RP / PA / KRP / KA / AKN (5 codes, incl. Aufenthaltstitel + separate child ID) | Keep Munich's own dropdown copy; add a short "document code cheatsheet" tip card (side-panel) explaining KRP/KA/AKN since these don't exist in Berlin's flow. |
| Birth/previous name field | Not present in Berlin's `Person` | `birthName` (Geburtsname) | Keep Munich-specific label "Birth name / previous names (if different)" — no Berlin equivalent to align to. |
| Religion codes | Full list (protestant/catholic/jewish/islamic/orthodox/other) | Reduced list (none/rk/ev/ak only — PDF has no codes for jewish/islamic/orthodox/other) | Keep Munich's reduced list; do not "restore" options that don't exist in the target PDF. |
| Appointment booking link | `service.berlin.de` | Munich's own Bürgerbüro/KVR booking URL | Done page CTA must point to Munich's own portal — builder must source the correct URL, not reuse Berlin's. |
| "44 Bürgerämter" / city stats | Berlin-specific numbers | N/A | Replace with Munich-specific stats (field count, person capacity) — do not invent city-specific numbers not verifiable from the PDF/plan doc. |

---

## 3. File map

| File | Action | Purpose |
|---|---|---|
| `app/munich/page.tsx` | **Modify** | Replace `MunichLandingPage`, wizard-shell JSX (currently inline in `MunichPage`'s wizard-phase return), `MunichPaymentPage`, `MunichDonePage` with newly designed components. No changes to types, `MF`, fill logic, or state machine (`phase`/`step` transitions, `useEffect`s). |

Only one file changes. No new files are created (no new PDFs, no new routes, no shared-component edits).

---

## 4. Task breakdown

### Task 1: Landing page redesign
**Files:** `app/munich/page.tsx` (replace `MunichLandingPage`, lines ~1289-1336)

- [ ] **Step 1:** Build `MunichHeroVisual` — a small new component rendering the offset-paper-stack visual (2 rotated white rectangles behind a bordered "form preview" placeholder card with a blue corner badge "105 fields · Perfect German"), used only on desktop (hidden below 768px via inline `className` + existing CSS convention or a `window.matchMedia`-free CSS class).
- [ ] **Step 2:** Restructure `MunichLandingPage` hero into a `hero-grid`-style two-column flex (copy left, `MunichHeroVisual` right on desktop, visual hidden on mobile) using inline styles (no new global CSS classes needed if using flex + inline media-query-free responsive props, or add 2 small scoped classes in a local `<style>` tag inside the component, following the `LandingPage.tsx` convention of a component-scoped `<style>` block).
- [ ] **Step 3:** Replace the existing 3-icon grid with the "3-in-1" bordered feature-box strip (Munich-specific copy: Munich PDF / Up to 4 people / Non-moving spouse support).
- [ ] **Step 4:** Add a stats strip (105 fields, 4 people/sheet, 5 min, 0 bytes stored) below the feature strip.
- [ ] **Step 5:** Verify `AppFooter`/`CookieBanner`/`SharedNav` still render correctly; no changes needed to these shared components.
- [ ] **Step 6:** Commit.

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): redesign landing page with new hero visual and Munich-specific proof points"
```

### Task 2: Wizard shell redesign (stepper header + card + side-panel)
**Files:** `app/munich/page.tsx` (replace the wizard-phase JSX inside `MunichPage`, lines ~1545-1630; keep `stepContent`/`stepLabels`/`goNext`/`goBack`/`STEPS` untouched)

- [ ] **Step 1:** Build `MunichStepper` component — sticky top bar rendering 7 clickable step pills with checkmarks for completed steps, replacing the current 3-segment thin bar. Reuses `STEPS`, `stepIdx`, and a `canNavigateTo(i)` helper (only current or completed steps clickable) passed down from `MunichPage`.
- [ ] **Step 2:** Build `MunichTipsPanel({ step, form })` — a new component returning step-specific tip content (sheets-not-needed note on `people`, non-moving-spouse explainer on `status`, document-code cheatsheet on `documents`, data-safety reassurance on all steps) rendered as a small rounded card to the right of the content card on desktop, and as a `<details>` disclosure under the card on mobile.
- [ ] **Step 3:** Wire `MunichStepper` + main content card (unchanged `stepContent[step]` render) + `MunichTipsPanel` into a responsive flex layout inside `MunichPage`'s wizard-phase branch.
- [ ] **Step 4:** Add a fixed mobile bottom nav bar (Back/Continue), matching Berlin's `mobile-bottom-nav` pattern conceptually but implemented fresh with inline styles + a small local `<style>` media query block (no reliance on `app/page.tsx`'s global CSS classes).
- [ ] **Step 5:** Confirm restart-confirmation modal still renders identically (no changes needed there).
- [ ] **Step 6:** Commit.

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): replace flat wizard shell with stepper header + tips panel design"
```

### Task 3: Payment page redesign (keep skip-pay)
**Files:** `app/munich/page.tsx` (replace `MunichPaymentPage`, lines ~1191-1217)

- [ ] **Step 1:** Add the gradient hero block (navy→blue) with logo lockup, green "München Beta · Free" badge, and headline.
- [ ] **Step 2:** Add the overlapping white summary card (what's included list + entered-data summary line, reusing existing `form.people[0]` / address summary logic already present).
- [ ] **Step 3:** Add the data-safety reassurance line and the "we prepare, we don't register you" disclaimer (new copy, matching Berlin's legal framing but city-agnostic wording).
- [ ] **Step 4:** Keep the single CTA button wired to the existing `onDevSkip` prop — **do not** add `/api/checkout` or any Stripe call. Restyle only.
- [ ] **Step 5:** Commit.

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): redesign payment page as free-beta reveal card, no Stripe"
```

### Task 4: Done page redesign
**Files:** `app/munich/page.tsx` (replace `MunichDonePage`, lines ~1220-1286)

- [ ] **Step 1:** Add the green gradient success banner with personalized headline + tag chips (people count, EU/non-EU, non-moving-spouse-included if applicable).
- [ ] **Step 2:** Restyle the single download button into the large gradient "primary download card" pattern (icon chip + title + subtext + download icon), keeping the existing `handleDownload`/`pdfBytes` logic untouched.
- [ ] **Step 3:** Add the dark "Next step" gradient card with a CTA button linking to Munich's official Bürgerbüro appointment-booking URL (builder must verify/source the correct live URL before hardcoding it — do not reuse `service.berlin.de`).
- [ ] **Step 4:** Restyle the existing "Next steps" checklist into a bordered card matching the new visual language (content unchanged).
- [ ] **Step 5:** Add conditional cards: foreign-document translation warning (compute `hasForeignBirth` locally from `f.people`, mirroring Berlin's logic pattern but self-contained), and a non-moving-spouse note if `form.nonMovingSpouse` is set.
- [ ] **Step 6:** Keep `sessionError` banner and restart button/modal logic exactly as today.
- [ ] **Step 7:** Commit.

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): redesign done page to match Berlin's completion-experience quality"
```

### Task 5: Manual verification pass
- [ ] **Step 1:** Run `npm run dev`, walk through `/munich` end-to-end (landing → all 7 wizard steps → payment skip → done) on desktop viewport.
- [ ] **Step 2:** Repeat at a mobile viewport (≤480px), confirming the tips-panel disclosure and mobile bottom nav both work.
- [ ] **Step 3:** Confirm the generated PDF is byte-identical to before the redesign (spot-check a filled form against `fillMunichSheet` output pre-change) — proves no fill-logic regressions leaked in from the UI refactor.
- [ ] **Step 4:** Confirm `/munich` still builds with `npm run build` (or project's equivalent) with no new TypeScript errors.
- [ ] **Step 5:** Commit any small fixes found during verification.

```bash
git add app/munich/page.tsx
git commit -m "fix(munich): polish redesigned UI after manual verification pass"
```

---

## 5. Non-goals

- **No PDF/fill-logic changes.** `fillMunichSheet`, `MF`, `*_CODE`/`*_VALS` tables, and `buildMunichPDF` are not touched, referenced for modification, or refactored.
- **No merging with Berlin.** `app/munich/page.tsx` remains fully self-contained; no shared imports beyond the existing generic `SharedNav`/`AppFooter`/`CookieBanner`.
- **No real Stripe integration.** The free/skip-pay (`onDevSkip`) behavior is preserved exactly; `/api/checkout` is not called from Munich.
- **No renaming.** The route stays `/munich`, the export stays `MunichPage`, and all user-facing "Munich"/"München" naming is unchanged.
- **No new PDF artifacts** (no Munich "Guide" or "WG template" PDFs are invented to match Berlin's 3-download Done page — Munich's Done page reflects that only one PDF exists).
- **No new content pages** (Berlin's guide-articles/FAQ section on the landing page is not replicated for Munich).
