# ReadyExpat — Mission & Vision

## What We Are

ReadyExpat is the English-language platform for German government paperwork. We turn bureaucratic forms that are confusing, high-stakes, and entirely in German into a guided, simple, English experience — ending with a correctly filled official PDF ready to submit.

We are not a translation tool. We are not a law firm. We are the interface layer between expats and the German state.

---

## Who We Serve

Expats moving to Germany — Americans, British, Indians, non-EU nationals, EU nationals — who are competent adults in their own language but are blocked by a form in a language they don't speak. They are not stupid. The system is just not built for them.

---

## The Mission

**Make life easier for expats in Germany by removing the language and complexity barrier from every official form they will ever need.**

One product. Every city. Every form. In English.

---

## The Business

- **Pay-per-form.** €15 one-time per PDF generation. No account. No subscription. No friction.
- **SEO guides** drive organic traffic from expats searching for help. Guides are broad, helpful, and city-aware. They feed the product.
- **The product converts.** A user who lands on a guide and understands the problem is one click away from solving it.

---

## The Product — Now

**Anmeldung (city registration)** — the first and most universal form every expat in Germany must complete.

- Berlin: live at `readyexpat.de` (the core wizard)
- Munich: live at `readyexpat.de/munich` (staging — tested separately before merging into main wizard)
- Hamburg, Frankfurt: planned 2026 (waitlist exists in product)

The wizard asks which city, adapts to that city's PDF fields and rules, and generates the correct official form. One product, many cities. The city is a parameter — not a separate product.

**Current architecture note:** Munich lives at `/munich` temporarily to validate the PDF filler in isolation. Once verified, it merges into the main wizard as a city option. The brand then becomes **ReadyExpat Germany** — not Berlin-specific.

---

## The Product — Coming Soon (already in nav)

These are committed future services, already visible to users as "coming soon":

1. **Steuerliche Erfassung** — Freelancer tax registration (Fragebogen zur steuerlichen Erfassung). Every freelancer in Germany must complete this. Huge market.

2. **Elterngeld** — Parental benefit application. Complex, high-stakes, time-sensitive. Expat parents are especially vulnerable to errors here.

---

## The Product — Longer Term

Every form an expat in Germany will ever need:

- **Abmeldung** — de-registration when leaving Germany
- **Vollmacht** — power of attorney (register on behalf of someone else)
- **Kindergeld** — child benefit
- **Rundfunkbeitrag** — broadcasting fee registration/exemption
- **Ummeldung** — change of address within the same city

The pattern is always the same: take an official German form, understand every field, build a guided English wizard, generate the correctly completed PDF.

---

## What ReadyExpat Is NOT

- Not a legal service or immigration advisor
- Not a translation service (we fill forms, we don't translate documents)
- Not city-specific — ReadyExpat serves expats across all of Germany
- Not subscription-based — every transaction stands alone

---

## Architecture Principles

**Before building any new feature:**

1. Read `app/page.tsx` in full — it contains the city selector, coming soon modal, waitlist, and product decisions that must not be duplicated or contradicted
2. Cities are configurations of one product, not separate products
3. New form types follow the same wizard → payment → PDF pattern
4. Guides are SEO assets that feed the product — keep them factually accurate and city-aware where possible
5. The brand is **ReadyExpat** (not ReadyExpat Berlin) — Germany-wide

---

## The Rename

The product is transitioning from **ReadyExpat Berlin** → **ReadyExpat Germany** as multi-city support launches. This affects:
- Homepage headline and metadata
- Nav branding
- OG/Twitter card titles
- `layout.tsx` metadata

Do not make this change until Munich is validated and merged into the main wizard.
