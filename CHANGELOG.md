# Changelog

All notable changes to ReadyExpat (readyexpat.de) are documented here.

---

## 2026-05-30

### Content
- Added FAQ entry to `what-is-anmeldung`: "Do I need a visa or residence permit before I can register?" — clarifies that Anmeldung comes first, then Ausländerbehörde uses the Anmeldebestätigung as proof of address
- Added `callout ok` box to `what-is-anmeldung` section 03: "The Ausländerbehörde needs your Anmeldung — not the other way around"
- Fact-checked visa/immigration content in `anmeldung-online-non-eu` — removed inaccurate claim that clerk has no legal authority to check immigration status (§87 AufenthG creates reporting obligation)

### Design
- Replaced 4 colored inline cross-link banners (blue/rose/purple/green promo bars) in existing guides with clean pill chips — same quiet style inline and at the bottom of each guide's CTA section
- `guides.css` section padding reduced: `80px → 56px` desktop, `40px → 32px` mobile; `final-cta` padding tightened proportionally
- `guides.css` kf-card colors updated to German flag palette: `#1a1a1a` (black), `#CC0000` (red), `#C8A000` (gold)
- `guides.css` kf-section background changed from warm beige gradient to flat `#f4f4f4`

### Style alignment (cluster pages)
- All 5 cluster pages (`anmeldung-mistakes-berlin`, `anmeldung-deadline-berlin`, `anmeldung-couple-berlin`, `anmeldung-berlin-english`, `moving-to-berlin-registration`) aligned to `guides.css` design system: `section-head reveal`, `h2.h2`, `faq reveal`, `final-cta`/`cta-box`/`cta-btn` replacing raw inline styles

---

## 2026-05-16

### Fact-checks
- **Walk-in locations removed** — `burgeramt-berlin-appointment` section 03 previously listed Bürgeramt Tempelhof and Mitte as accepting walk-ins. Incorrect: service.berlin.de states "Ohne Termin erfolgt keine Bearbeitung." Section rewritten as "Walk-in — last resort." JSON-LD FAQ updated to match.
- **Steuer-ID timing caveat** — `what-is-anmeldung` section 05 added "up to 6–8 weeks during peak September relocation season" to the 2–4 week estimate.

### New guide design system
- All 5 original guide pages rewritten with shared design: `app/guides.css`, `GuideReveal`, `GuideSidebar`, `GuidePageNav`
- `Article` + `FAQPage` JSON-LD added to all guide pages
- Visible FAQ sections added to all guides
- Aggressive internal linking between all guides
- "2026" added to all guide titles

### Contradiction fixes
- Removed "rental contract is not a substitute" callout from `wohnungsgeberbestaetigung` (contradicted the emergency exception in section 06)
- eID callout in `anmeldung-online-non-eu` updated to clarify chip activation requirement
- Cross-page eID language standardised

---

## 2026-05-09

### Features
- Guide icons added to nav dropdown and landing page guide cards
- Wizard sidebar fix: background/border now extends full page height
- Merged FAQ teaser and Guides into one landing page section (removed duplicate headers)
- `CONTENT_RULES.md` added

---

## 2026-05-08

### New pages
- `/what-is-anmeldung` — what, who, why, timeline, Steuer-ID
- `/anmeldung-online-non-eu` — why non-EU can't register online, eID rules
- `/anmeldung-documents` — personalised checklist by situation
- `/wohnungsgeberbestaetigung` — landlord form guide with mock preview and email template
- `/burgeramt-berlin-appointment` — booking strategy, slot hacks, walk-in guidance

### New cluster pages
- `/anmeldung-deadline-berlin` — 14-day rule, deadline calculator, fine information
- `/anmeldung-mistakes-berlin` — 6 common mistakes with before/after examples
- `/anmeldung-couple-berlin` — multi-person registration, sheet calculator
- `/anmeldung-berlin-english` — field-by-field breakdown, translation traps
- `/moving-to-berlin-registration` — 6-step overview guide for newcomers

### Infrastructure
- `GuideNav` and `GuideSidebar` components added — shared across all guide pages
- Wohnungsgeberbestätigung guide: email template replaced with downloadable blank PDF
- Guide card label shortened to "Landlord Confirmation"
- Guides dropdown added to `StickyNav`
- Duplicate `FAQPage` JSON-LD schema fixed (was on layout + faq page simultaneously)
- `/success` page noindexed
- `lang="en"` corrected (was `de-DE`, suppressing English search traffic)
- `HowTo` schema added to `/faq`
- `/public/llms.txt` added for AI crawlers

---

## 2026-05-05

### SEO & schema
- Duplicate `FAQPage` schema fixed — `layout.tsx` was injecting a second block on every page, triggering Google Search Console "FAQPage doppelt" critical error
- `/success` page noindexed via `app/success/layout.tsx`
- OG image reference fixed: `.png` → `.svg` (`.png` did not exist)
- `/public/llms.txt` created — AI crawler index with legal facts, process steps, documents list
- `Organization` schema added to `layout.tsx`
- `HowTo` schema added to `/faq`
- Freshness signals: `dateModified` + visible "Last updated" badge added to FAQ
- `lang="de-DE"` corrected to `lang="en"` — was suppressing English search traffic
- `hreflang` added for English language targeting

---

## 2026-05-04 — FAQ page

### New page: `/faq`
- 20 questions across 5 color-coded sections
- CSS-only accordion (`<details>/<summary>`) with slide animation
- Full `FAQPage` JSON-LD for GEO/AI citation
- `HowTo` schema (6-step Anmeldung process)
- `/faq` added to sitemap (priority 0.8)
- FAQ teaser section added to landing page (3 Q&As + "See all 20 →")
- "FAQ" link added to `StickyNav`

---

## 2026-04-28

### Content & design
- Mailbox tip added in 4 locations: `StepNewAddress`, done page, guide PDF page 1, guide PDF page 2
- PDF branding: SimplyExpat "S" logo + URL added to guide PDF headers
- Landing page: new tagline, single hero paragraph, €15/no account note below CTA, testimonial, form preview image replacing Brandenburg Gate photo
- Time consistency: standardised to "5 minutes" everywhere (was "2", "3", and "5" in different places)

---

## 2026-04-27

### Bug fixes
- `EHE_ANGABEN` y-coordinates corrected: `y:561/564 → y:267/270` (pdf-lib bottom-left coords)
- Checklist overflow (birth certificates silently missing): replaced pre-check threshold with detect-and-retry loop
- Guide PDF closing text corrected: "You have already done that [the appointment]" → actionable next-step line
- `WizardLayout` restart modal: was referencing DonePage state; fixed with own `confirmRestart` state + `onRestart` prop
- Safari sidebar modal bug: removed `backdropFilter:blur` from sidebar and `StickyNav`
- Country dropdown duplicates: alias keys moved from `COUNTRY_DE` to `COUNTRY_ALIASES` table
- UK post-Brexit: moved from EU to non-EU in all dropdowns and logic
- Marriage country: changed to `SearchableSelect` with `ALL_COUNTRIES` for correct German translation

---

## 2026-04-26

### Bug fixes
- `EHE_ANGABEN` duplicate text: draw white rectangle + direct text draw bypasses AcroForm parent/child propagation
- Checklist items silently dropped: detect-and-retry replacing pre-check threshold
- Blank PDF on re-download: `getForm()` returns `null` (not empty form) when localStorage is gone — shows error banner instead of blank PDF
- Back button from done page: `popstate` handler + extra history entries prevent return to wizard
- Modal behind dropdown: `backdropFilter` removed from sidebar

---

## 2026-04-01 — Initial launch

- Full wizard flow with validation (7 steps)
- Stripe payment integration (live, €15 one-time)
- Client-side PDF generation via `pdf-lib` against official `anmeldung.pdf` AcroForm
- Multi-person support up to 6 people (2 per sheet, ZIP packaging)
- All 54 AcroForm fields mapped and verified
- German translation tables: countries, citizenships, gender, religion, marital status
- Done page with navigation guard, re-download, and checklist PDF
- Post-payment reminder email via Resend
