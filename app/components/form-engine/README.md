# Form Engine

Reusable building blocks for ReadyExpat form products (Steuer, Abmeldung, Vollmacht, Kindergeld, …). A new form product = **one data file + one answer-sheet builder + one page** — not a rebuild.

First consumer: `app/freelance-steuer/` (Easy Fragebogen zur steuerlichen Erfassung).

## Pieces

| File | What it gives you |
|---|---|
| `types.ts` | `FieldDef<TForm>`, `StepDef<TForm>`, `AnswerRow`, `AnswerSection` |
| `FieldInput.tsx` | Renders one field: text/date/select/boolean/euro, short explain, `more` deep-dive, neutral decision banner. Non-string select values plug in via `selectMap`. |
| `MoreInfo.tsx` | The "Tell me more" expander + `MoreBlock` parser (plain text → YES/NO cards, numbered chips, bullets, ALL-CAPS headlines). |
| `validation.ts` | `requiredError(steps, stepId, form)` — generic required-check. `false` counts as answered; booleans should be `boolean \| null` in the form type so nothing is silently pre-answered. |

## How to add a new form product

1. **Create `app/<product>/<product>-data.ts`:**
   - `type XForm = { … }` — every yes/no gate as `boolean | null`, selects with an `""` unanswered state.
   - `EMPTY_X`, `STORAGE_KEY` (`simplyexpat-<product>-v1`), `DONE_KEY`.
   - `X_STEPS: StepDef<XForm>[]` — all copy lives here. **Legal hard rule: `explain`/`more` explain mechanics, NEVER recommend.** Discretionary fields get `decision: true`.
   - `buildAnswerRows(f: XForm): AnswerSection[]` — maps state → official field numbers/labels. Only verified numbers (primary source, e.g. a real submission printout — note source + date in the header comment). Instructions ("tick the box") get `instruction: true`.
   - `stepError(stepId, f)` = `requiredError(X_STEPS, stepId, f)` + product-specific rules (checksums, scope gates).
2. **Create the page** following `app/freelance-steuer/page.tsx`: phase machine `landing → wizard → payment → generating → done`, localStorage restore/persist/back-lock effects, `FieldInput` per step field, review step, done page with copy buttons.
3. **Payment:** add the product to the `PRODUCTS` map in `app/api/checkout/route.ts` and pass `{ product, returnPath }` — verify-session/success need no changes.
4. **PDF:** answer-sheet builder from scratch with pdf-lib (see `steuer-pdf.ts` — WinAnsi `safe()`, `clip()`, SRI-pinned CDN loader).
5. **Deep-dive text conventions** (parsed by `MoreBlock`): paragraphs split on `\n`; `What Yes means: …` / `What No means: …` → cards; `1. …` → numbered; `· …` → bullets; `ALL-CAPS PREFIX (…): …` → headline. First paragraph renders as lede.

## Deliberately NOT in the engine (yet)

Phase machine, payment page, PDF scaffolding, simulator. Extract when form #3 exists and the shape is proven (rule of three).
