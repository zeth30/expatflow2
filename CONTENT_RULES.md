# SimplyExpat — Content Rules

Established facts and rules that must stay consistent across all guide pages, landing page, FAQ, and done page. Read this before writing or editing any user-facing copy.

---

## What SimplyExpat does and does not do

- **DOES:** Generate the completed Anmeldeformular PDF from English answers — all 54 fields, correct German, DD.MM.YYYY dates, all translations handled
- **DOES:** Handle the Kirchensteuer religion field (blank by default unless user chooses otherwise)
- **DOES:** Generate the correct number of sheets for multi-person households
- **DOES NOT:** Generate the Wohnungsgeberbestätigung — that must come from the landlord
- **DOES NOT:** Book Bürgeramt appointments

Any guide content that tells the user how to fill the Anmeldeformular themselves contradicts the product. Instead: explain the difficulty/stakes, then let the CTA block do the sell.

---

## Wohnungsgeberbestätigung

- Most landlords include it in move-in documents automatically — always lead with "check first"
- Only email the template if the landlord has not provided it
- Template PDF lives at `/wg-template.pdf` — downloadable on the done page and the wohnungsgeberbestaetigung guide page
- §19 BMG: landlords must provide it within 2 weeks. Refusal without legal reason = fine up to €1,000
- Card/button label: **"Landlord Confirmation"** (the full German term is too long for compact UI elements)

---

## Kirchensteuer

- Declaring a religion on the Anmeldeformular triggers ~8–9% extra income tax (Kirchensteuer)
- Leave the Religionsgesellschaft field blank or write "OA" (Ohne Angabe) to opt out — zero negative consequences
- Leaving the church requires a separate process at the **Standesamt** — NOT the Finanzamt, NOT free

---

## Bürgeramt appointments

- Berlin slots book out 3–6 weeks in advance in central districts; outer districts (Marzahn, Spandau, Reinickendorf) have more availability
- 14-day legal deadline (§17 BMG) — but if no slot is available, book the earliest one, take a screenshot as evidence, no fine
- Clerks will not help fill in the form at the counter
- Clerks turn you away for: incomplete form, any English entries, phone screen instead of printed form, missing Wohnungsgeberbestätigung, arriving late

---

## SEO / editorial balance in guides

- Guide body = pure editorial. No inline product pitches inside lists, steps, or warnings
- One neutral category hint per relevant page max: *"English-language form preparation services exist for this step"* — no brand name in body text
- SimplyExpat named explicitly only inside CTA blocks (visually distinct from editorial content)
- Test: would a newspaper publish this body text as-is? If not, it's too promotional

---

## UI label rules

| Context | Label to use |
|---|---|
| Card / sidebar / nav dropdown | "Landlord Confirmation" |
| Page H1 / section headings | Full German: "Wohnungsgeberbestätigung" |
