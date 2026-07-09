# ELSTER Practice Simulator + Form Engine — Design Spec

**Date:** 2026-07-09 · **Status:** approved by user ("A) und C)")

## A) ELSTER Practice Simulator

**What:** An interactive replica of the FsE EUn flow so users can rehearse the real ELSTER before logging in. Renders the user's own German answers pre-filled at the right spots (or sample data in demo mode).

- **Component:** `app/freelance-steuer/SteuerSimulator.tsx` — client component, full-screen overlay.
- **Data source:** `buildAnswerRows(form)` (existing single source of truth). Demo mode uses a `DEMO_FORM` constant (the spec §3 sample persona: Lisa Meyer, Schwimmtraining, 4.800/7.200, KU=yes).
- **Look:** generic German-government web-form aesthetic (light gray page, white card, thin borders, small caps labels, field-number badges). **NOT ELSTER's green, NOT the ELSTER logo** — permanent banner: "Practice simulation — not affiliated with or endorsed by ELSTER / Finanzverwaltung."
- **Flow:** one screen per AnswerSection · German "Zurück / Weiter" buttons · progress "Seite X von Y" · read-only inputs with the user's German values · instruction rows (Häkchen setzen / leer lassen) styled as amber to-do chips · final screen explains that real ELSTER now shows summary + "Absenden", CTA → elster.de login.
- **Entry points:** (1) Done page button "Practice in the simulator" next to Download; (2) Landing teaser button "Try the simulator with sample data" (demo mode).
- **Legal:** descriptive use of the word ELSTER + disclaimer; simulation transmits nothing, still localStorage-only.

## C) Form Engine (multi-form foundation)

**What:** Extract the reusable wizard machinery so the next form (Abmeldung, Vollmacht, Kindergeld …) is a data config, not a rebuild.

- **New module:** `app/components/form-engine/`
  - `types.ts` — generic `FieldDef<TForm>`, `StepDef<TForm>`, `AnswerRow`, `AnswerSection`
  - `FieldInput.tsx` — the generic field renderer (text/date/select/boolean/euro, decision banner, deep-dive)
  - `MoreInfo.tsx` — premium expander + `MoreBlock` visual parser (YES/NO cards, numbered chips, bullets, caps headlines)
  - `validation.ts` — `requiredError(steps, stepId, form)` generic required-check (product-specific rules stay in the product's data file)
  - `README.md` — how to add a new form product
- **Migration:** `steuer-data.ts` re-exports/imports engine types; `page.tsx` imports FieldInput/MoreInfo from the engine. Zero visual/behavioral change; build must stay green.
- **Explicitly NOT tonight:** generic phase machine/payment/PDF extraction (higher risk, no payoff until form #3).

**Order:** A → push · C → push · auditor subagent reviews A's copy/legal & C's refactor equivalence · fixes → push.
