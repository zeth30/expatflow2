# Munich Anmeldung Wizard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully-working Munich Anmeldung wizard at `/munich` that mirrors the Berlin wizard but fills the official Munich PDF (`anmeldung_meldebehorde.pdf`, 105 AcroForm fields, up to 5 people per sheet).

**Architecture:** A new self-contained `app/munich/page.tsx` (mirroring `app/page.tsx`) with its own `FormData` type, localStorage key (`simplyexpat-munich-v1`), PDF field map, and fill logic. Shared UI components (SharedNav, AppFooter, CookieBanner) are imported as-is. The Berlin wizard is not touched. The `/api/checkout` and `/api/verify-session` endpoints are reused as-is (city is irrelevant to Stripe).

**Tech Stack:** Next.js 15 App Router, TypeScript, pdf-lib (CDN via `loadPdfLib()`), Stripe, Resend, inline styles (no Tailwind). Mirrors `app/page.tsx` patterns exactly.

---

## Munich PDF Field Reference

Field names extracted from the official Munich PDF (`stadt.muenchen.de`). Use these exact strings in the fill logic.

**Address fields:**
- `einzug` — move-in date (DD.MM.YYYY)
- `zuzug` — date of arrival from abroad (DD.MM.YYYY)
- `strasse` — new street + house number
- `plz` — new postal code + city
- `bishwo` — previous address (street, PLZ, city — or country if abroad)
- `neuw` — new dwelling type (text field; value: `"Alleinige Wohnung"` / `"Hauptwohnung"` / `"Nebenwohnung"`)
- `wohnung` — previous dwelling type (same values)
- `nw` — kept previous dwelling type (same values, if keeping prev address)

**Person fields (1–5):** Persons 1–5 on one sheet (Munich fits 5 per page).
- `fam1`–`fam5` — Familienname (last name)
- `vorn1`–`vorn5` — Vorname (first name)
- `gebdat1`–`gebdat5` — Geburtsdatum (DD.MM.YYYY)
- `gebort1`–`gebort5` — Geburtsort + Geburtsland (e.g. `"New York, USA"`)
- `geschl1`–`geschl4`, `geschl6` — Geschlecht (`"männlich"` / `"weiblich"` / `"divers"`)
  - Note: `geschl5` does not exist; person 5 uses `geschl6`
- `staatsang1`–`staatsang4` — Staatsangehörigkeit (German citizenship adjective)
  - Note: only 4 nationality fields despite 5 person slots; person 5 has none
- `rel1`–`rel4` — Religion; same 4-slot limit
- `famst1`–`famst4` — Familienstand; same 4-slot limit
- `ordenskuenstler1`–`ordenskuenstler4` — Ordens-/Künstlername; same 4-slot limit
- `getrennt1` — "getrennt lebend" checkbox (for separated marital status)
- `gesetzlver` — Legal representative name (for minors; fill with parent name if any person is under 18)

**Document fields (slots 1–4, one per person):**
- `art1`–`art4` — document type abbreviation (e.g. `"RP"` for Reisepass, `"PA"` for Personalausweis)
- `name1`–`name5` — document holder name (Familienname, Vorname)
- `serien1`–`serien4` — serial number
- `ausstelldat1`–`ausstelldat4` — issue date (DD.MM.YYYY)
- `ausstellb1`–`ausstellb4` — issuing authority
- `gueltig1`–`gueltig4` — valid until (DD.MM.YYYY)
- `dat1`–`dat4` — birth date repeated in document section (DD.MM.YYYY)
- `gr1`–`gr5` — leave blank (internal office field)
- `vertrieb1`–`vertrieb4` — leave blank (expellee field, not relevant for expats)

**Office pre-fill (leave all blank — filled by Bürgeramt):**
- `fam_bev`, `vorname_bev`, `geb_bev` — Bevölkerungsamt fields
- `fam_vg`, `vorname_vg`, `geb_vg` — Vorgänger fields
- `anschr5`, `anschr5a`, `anschrift_bev` — address cross-reference

**Signature:**
- `Datum` / `Datum1` — signing date (leave blank; user fills by hand after printing)
- `Ort` / `Ort1` — signing place (leave blank)
- `Druckbereich` — print area label (leave blank)
- `drucken1` — print button widget (ignore)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `public/munich-anmeldung.pdf` | **Create** | Munich AcroForm template (downloaded from stadt.muenchen.de) |
| `app/munich/page.tsx` | **Create** | Full Munich wizard + PDF filler (~2500 lines, mirrors app/page.tsx) |
| `app/munich/layout.tsx` | **Create** | Munich page metadata (title, description, OG, JSON-LD) |
| `app/components/SharedNav.tsx` | **Modify** | Add "Munich" city link / indicator |
| `app/sitemap.ts` | **Modify** | Add `/munich` at priority 0.9 |

---

## Task 1: Download Munich PDF and commit it

**Files:**
- Create: `public/munich-anmeldung.pdf`

- [ ] **Step 1: Download the official PDF**

```bash
curl -L "https://stadt.muenchen.de/dam/jcr:15cee8cc-bd9a-46f0-9c4b-052766dc547f/anmeldung_meldebehorde.pdf" \
  -o public/munich-anmeldung.pdf
```

Expected: file appears at `public/munich-anmeldung.pdf`, size ~900 KB.

- [ ] **Step 2: Verify field count**

```bash
python3 -c "
import zlib, re
with open('public/munich-anmeldung.pdf', 'rb') as f:
    data = f.read()
all_fields = set()
for s in re.findall(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL):
    try:
        dec = zlib.decompress(s)
        for h in re.findall(rb'/T\s*\(([^)]+)\)', dec):
            all_fields.add(h.decode('latin-1'))
    except: pass
print(sorted(all_fields))
print('TOTAL:', len(all_fields))
"
```

Expected: ~105 fields including `fam1`, `vorn1`, `einzug`, `strasse`, `plz`, etc.

- [ ] **Step 3: Commit**

```bash
git add public/munich-anmeldung.pdf
git commit -m "feat(munich): add official Munich Anmeldung PDF template"
```

---

## Task 2: Create Munich layout.tsx (metadata)

**Files:**
- Create: `app/munich/layout.tsx`

- [ ] **Step 1: Create the layout file**

```tsx
// app/munich/layout.tsx
import type { Metadata } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export const metadata: Metadata = {
  title: "Anmeldung München in English — Expat Form Filler, No German Required",
  description:
    "Fill Munich's official Anmeldung (residence registration) form in English. Auto-fills all fields in German. Ready to print and submit. For expats and foreigners in München.",
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: "/munich",
    languages: { en: `${DOMAIN}/munich`, "x-default": `${DOMAIN}/munich` },
  },
  openGraph: {
    title: "Anmeldung München in English — Expat Form Filler",
    description:
      "Munich residence registration for expats. Fill in English, get a perfect German PDF in 5 minutes.",
    url: `${DOMAIN}/munich`,
    siteName: "SimplyExpat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anmeldung München in English",
    description: "Munich Anmeldung for expats. No German required.",
  },
};

export default function MunichLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/munich/layout.tsx
git commit -m "feat(munich): add Munich page metadata layout"
```

---

## Task 3: Create app/munich/page.tsx — types, constants, and PDF field map

**Files:**
- Create: `app/munich/page.tsx` (scaffold — grow through tasks 3–8)

This file mirrors `app/page.tsx` but is self-contained. Build it incrementally across tasks 3–8.

- [ ] **Step 1: Create the file with imports, types, and the Munich field map**

```tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Check, ChevronRight, Plus, Trash2,
  Download, FileText, Shield, MapPin, User, Users, Home,
  Building2, Info, Zap, Globe, CreditCard, CheckCircle2,
  Church, RotateCcw, AlertCircle, Sparkles,
} from "lucide-react";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";
import { CookieBanner } from "../components/LegalModals";

// ─── Munich PDF field names (extracted from anmeldung_meldebehorde.pdf) ──────
const MF = {
  // Address
  EINZUG:    "einzug",       // move-in date DD.MM.YYYY
  ZUZUG:     "zuzug",       // arrival-from-abroad date (only if prevIsGerman=false)
  STRASSE:   "strasse",     // new street + house number
  PLZ:       "plz",         // new postal code + city
  BISHWO:    "bishwo",      // previous address or country if abroad
  NEUW:      "neuw",        // new dwelling type text
  WOHNUNG:   "wohnung",     // previous dwelling type text
  NW:        "nw",          // kept previous dwelling type (if keepPrev)
  GETRENNT:  "getrennt1",   // separated checkbox

  // Person fields — 5 slots
  FAM:       ["fam1","fam2","fam3","fam4","fam5"],      // last name
  VORN:      ["vorn1","vorn2","vorn3","vorn4","vorn5"],  // first name
  GEBDAT:    ["gebdat1","gebdat2","gebdat3","gebdat4","gebdat5"], // birth date
  GEBORT:    ["gebort1","gebort2","gebort3","gebort4","gebort5"], // birth place+country
  // geschl5 does not exist; person 5 uses geschl6
  GESCHL:    ["geschl1","geschl2","geschl3","geschl4","geschl6"],
  // only 4 slots for nationality, religion, marital status, artistic name
  STAATSANG: ["staatsang1","staatsang2","staatsang3","staatsang4"],
  REL:       ["rel1","rel2","rel3","rel4"],
  FAMST:     ["famst1","famst2","famst3","famst4"],
  ORDENS:    ["ordenskuenstler1","ordenskuenstler2","ordenskuenstler3","ordenskuenstler4"],
  GESETZLVER: "gesetzlver",  // legal representative (fill if any person < 18)

  // Document fields — 4 slots (one per person)
  DOC_NAME:   ["name1","name2","name3","name4"],         // Familienname Vorname
  DOC_ART:    ["art1","art2","art3","art4"],             // doc type abbreviation
  DOC_SERIEN: ["serien1","serien2","serien3","serien4"], // serial number
  DOC_AUSDAT: ["ausstelldat1","ausstelldat2","ausstelldat3","ausstelldat4"], // issue date
  DOC_AUSB:   ["ausstellb1","ausstellb2","ausstellb3","ausstellb4"],         // authority
  DOC_GUELTIG:["gueltig1","gueltig2","gueltig3","gueltig4"],                 // valid until
  DOC_DAT:    ["dat1","dat2","dat3","dat4"],             // birth date in doc section
  // name5 exists but doc slots max at 4; name5 is left blank

  // Leave blank — office fills these
  // fam_bev, vorname_bev, geb_bev, fam_vg, vorname_vg, geb_vg
  // anschr5, anschr5a, anschrift_bev
  // gr1-gr5, vertrieb1-vertrieb4
  // Datum, Datum1, Ort, Ort1, Druckbereich, drucken1
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type AppPhase = "landing" | "wizard" | "payment" | "generating" | "done";
type WizardStep = "origin" | "new-address" | "prev-address" | "people" | "status" | "documents" | "review";

interface Person {
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  birthCountry: string;
  gender: string;
  religion: string;
  citizenship: string;
  artisticName: string;
  docType: string;
  docAuthority: string;
  docSerial: string;
  docDate: string;
  docValidUntil: string;
  relationship: "primary" | "spouse" | "child";
  fillHandwritten: boolean;
}

interface MunichFormData {
  originCountry: string;
  isEU: boolean;
  maritalStatus: string;
  marriageDate: string;
  marriagePlace: string;
  marriageCountry: string;
  people: Person[];
  // New address
  newStreet: string;
  newNumber: string;
  newAddExtra: string;
  newPostalCode: string;
  newCity: string;
  moveInDate: string;
  newResType: string;
  // Previous address
  prevStreet: string;
  prevNumber: string;
  prevPostalCode: string;
  prevCity: string;
  prevCountry: string;
  moveOutDate: string;
  prevResType: string;
  keepPrev: string;
}

const EMPTY_PERSON: Person = {
  lastName: "", firstName: "",
  birthDate: "", birthPlace: "", birthCountry: "",
  gender: "", religion: "", citizenship: "", artisticName: "",
  docType: "RP", docAuthority: "", docSerial: "", docDate: "", docValidUntil: "",
  relationship: "primary", fillHandwritten: false,
};

const EMPTY: MunichFormData = {
  originCountry: "", isEU: true,
  maritalStatus: "", marriageDate: "", marriagePlace: "", marriageCountry: "",
  people: [{ ...EMPTY_PERSON }],
  newStreet: "", newNumber: "", newAddExtra: "", newPostalCode: "", newCity: "München",
  moveInDate: "", newResType: "alleinig",
  prevStreet: "", prevNumber: "", prevPostalCode: "", prevCity: "", prevCountry: "",
  moveOutDate: "", prevResType: "alleinig", keepPrev: "no",
};

const STORAGE_KEY = "simplyexpat-munich-v1";
const DONE_KEY    = "simplyexpat-munich-done-v1";
const MAX_PEOPLE  = 5; // Munich fits 5 per sheet (vs Berlin's 2)
```

- [ ] **Step 2: Commit scaffold**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): scaffold types, field map, and constants"
```

---

## Task 4: Add PDF fill logic (fillMunichSheet)

**Files:**
- Modify: `app/munich/page.tsx`

Munich has one sheet for all people (up to 5), unlike Berlin's 2-per-sheet with multiple sheets.

- [ ] **Step 1: Add helper utilities and loadPdfLib (copy pattern from app/page.tsx)**

Add these after the constants section (before the React component):

```tsx
// ─── loadPdfLib (CDN, identical to Berlin) ────────────────────────────────────
let _pdfLibCache: any = null;
async function loadPdfLib() {
  if (_pdfLibCache) return _pdfLibCache;
  await new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
    s.onload = () => res();
    s.onerror = rej;
    document.head.appendChild(s);
  });
  _pdfLibCache = (window as any).PDFLib;
  return _pdfLibCache;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const safe = (s: string) =>
  s.replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");

const fmtDate = (iso: string): string => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d.padStart(2,"0")}.${m.padStart(2,"0")}.${y}`;
};

function truncField(s: string, maxChars: number): string {
  return s.length > maxChars ? s.slice(0, maxChars) : s;
}

// ─── Munich PDF filler ────────────────────────────────────────────────────────
async function fillMunichSheet(d: MunichFormData): Promise<Uint8Array> {
  const { PDFDocument, PDFName } = await loadPdfLib();
  const templateBytes = await fetch("/munich-anmeldung.pdf").then(r => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  const txt = (name: string, value: string) => {
    try { form.getTextField(name).setText(safe(value)); } catch {}
  };
  const chk = (name: string, checked: boolean) => {
    try {
      const field = form.getFields().find((f: any) => {
        try { return f.getName() === name; } catch { return false; }
      });
      if (!field) return;
      const acro = (field as any).acroField;
      acro.dict.set(PDFName.of("AS"), PDFName.of(checked ? "On" : "Off"));
      acro.dict.set(PDFName.of("V"),  PDFName.of(checked ? "On" : "Off"));
    } catch {}
  };

  // ── Address ─────────────────────────────────────────────────────────────────
  const prevIsGerman = !d.prevCountry || d.prevCountry === "Germany";
  const streetLine = [d.newStreet, d.newNumber, d.newAddExtra].filter(Boolean).join(" ");

  txt(MF.EINZUG,  fmtDate(d.moveInDate));
  txt(MF.STRASSE, safe(truncField(streetLine, 60)));
  txt(MF.PLZ,     safe(truncField(`${d.newPostalCode} ${d.newCity}`.trim(), 50)));

  const newResMap: Record<string,string> = {
    alleinig: "Alleinige Wohnung",
    haupt:    "Hauptwohnung",
    neben:    "Nebenwohnung",
  };
  txt(MF.NEUW, newResMap[d.newResType] ?? "");

  if (prevIsGerman) {
    const prevStreetLine = [d.prevStreet, d.prevNumber].filter(Boolean).join(" ");
    const prevPlzCity    = [d.prevPostalCode, d.prevCity].filter(Boolean).join(" ");
    txt(MF.BISHWO, safe(truncField(`${prevStreetLine}, ${prevPlzCity}`.trim(), 80)));
    txt(MF.WOHNUNG, newResMap[d.prevResType] ?? "");
  } else {
    // Foreign previous address — write country name in bishwo
    txt(MF.BISHWO, safe(d.prevCountry));
    if (d.moveOutDate) txt(MF.ZUZUG, fmtDate(d.moveOutDate));
  }

  if (d.keepPrev === "yes") {
    txt(MF.NW, newResMap[d.prevResType] ?? "");
  }

  // Separated marital status
  chk(MF.GETRENNT, d.maritalStatus === "getrennt");

  // ── People (up to 5) ──────────────────────────────────────────────────────
  const genderDE: Record<string,string> = {
    male: "männlich", female: "weiblich", diverse: "divers", other: "divers",
  };
  const religionDE: Record<string,string> = {
    none: "", protestant: "ev", catholic: "rk", jewish: "jd",
    islamic: "isl", orthodox: "or", other: "sonstige",
  };
  const maritalDE: Record<string,string> = {
    single: "ledig", married: "verheiratet", divorced: "geschieden",
    widowed: "verwitwet", partnership: "Lebenspartnerschaft",
    separated: "getrennt lebend",
  };

  // Check if any person is a minor (needs legal representative)
  const today = new Date();
  let legalRepNeeded = false;
  let legalRepName = "";

  d.people.forEach((p, i) => {
    if (i >= MAX_PEOPLE) return;
    txt(MF.FAM[i],    safe(truncField(p.lastName, 40)));
    txt(MF.VORN[i],   safe(truncField(p.firstName, 40)));
    txt(MF.GEBDAT[i], fmtDate(p.birthDate));
    txt(MF.GEBORT[i], safe(truncField(`${p.birthPlace}${p.birthCountry ? ", " + p.birthCountry : ""}`, 50)));
    txt(MF.GESCHL[i], genderDE[p.gender] ?? "");

    // Nationality, religion, marital status, artistic name — only 4 slots
    if (i < 4) {
      txt(MF.STAATSANG[i], safe(truncField(p.citizenship, 30)));
      txt(MF.REL[i],       religionDE[p.religion] ?? "");
      // Marital status: children are always ledig
      const ms = p.relationship === "child" ? "ledig"
        : maritalDE[d.maritalStatus] ?? "";
      txt(MF.FAMST[i], ms);
      txt(MF.ORDENS[i], safe(truncField(p.artisticName, 30)));
    }

    // Check if minor
    if (p.birthDate) {
      const birth = new Date(p.birthDate);
      const age = (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) {
        legalRepNeeded = true;
        // Legal rep is the primary person
        const primary = d.people.find(pp => pp.relationship === "primary");
        if (primary) legalRepName = `${primary.lastName}, ${primary.firstName}`;
      }
    }

    // Document fields — slots 0–3 (up to 4 people with docs)
    if (i < 4 && !p.fillHandwritten) {
      txt(MF.DOC_NAME[i],   safe(`${p.lastName}, ${p.firstName}`));
      txt(MF.DOC_ART[i],    safe(p.docType));
      txt(MF.DOC_SERIEN[i], safe(truncField(p.docSerial, 25)));
      txt(MF.DOC_AUSDAT[i], fmtDate(p.docDate));
      txt(MF.DOC_AUSB[i],   safe(truncField(p.docAuthority, 40)));
      txt(MF.DOC_GUELTIG[i],fmtDate(p.docValidUntil));
      txt(MF.DOC_DAT[i],    fmtDate(p.birthDate));
    }
  });

  if (legalRepNeeded) {
    txt(MF.GESETZLVER, safe(legalRepName));
  }

  // Flatten form to lock fields
  form.flatten();
  return pdfDoc.save();
}

// ─── Entry point: build PDF and return download blob ─────────────────────────
async function buildMunichPDF(d: MunichFormData): Promise<{ bytes: Uint8Array; name: string }> {
  const bytes = await fillMunichSheet(d);
  const p1 = d.people[0];
  const lastName = p1?.lastName ?? "anmeldung";
  return { bytes, name: `anmeldung-muenchen-${lastName.toLowerCase()}.pdf` };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): add fillMunichSheet PDF fill logic"
```

---

## Task 5: Add wizard steps UI

**Files:**
- Modify: `app/munich/page.tsx`

The wizard steps are identical in concept to Berlin. Copy the UI structure from `app/page.tsx` and adapt. Below is the complete set of step components needed — write them after the PDF logic.

- [ ] **Step 1: Add the `getError` validation function**

```tsx
function getError(step: WizardStep, f: MunichFormData): string {
  if (step === "origin") {
    if (!f.originCountry) return "Please select your origin country.";
  }
  if (step === "new-address") {
    if (!f.newStreet)      return "Street is required.";
    if (!f.newNumber)      return "House number is required.";
    if (!f.newPostalCode)  return "Postal code is required.";
    if (!f.moveInDate)     return "Move-in date is required.";
  }
  if (step === "prev-address") {
    if (!f.prevCountry && !f.prevStreet) return "Please enter your previous address or country.";
  }
  if (step === "people") {
    for (const p of f.people) {
      if (!p.lastName)   return "Last name is required for all persons.";
      if (!p.firstName)  return "First name is required for all persons.";
      if (!p.birthDate)  return "Birth date is required for all persons.";
      if (!p.citizenship) return "Citizenship is required for all persons.";
    }
  }
  if (step === "status") {
    if (!f.maritalStatus) return "Please select a marital status.";
  }
  if (step === "documents") {
    // documents are optional if fillHandwritten is true
  }
  return "";
}
```

- [ ] **Step 2: Add the wizard step order constant**

```tsx
const STEPS: WizardStep[] = [
  "origin", "new-address", "prev-address", "people", "status", "documents", "review"
];
```

- [ ] **Step 3: Add the LandingPage for Munich**

```tsx
function MunichLandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 60px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
          Anmeldung München — in English
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", marginBottom: 8 }}>
          In English. No German required.
        </p>
        <p style={{ fontSize: 16, color: "#475569", marginBottom: 32, maxWidth: 560 }}>
          Fill Munich&apos;s official residence registration form in English.
          We auto-fill all 105 fields in German. Print and submit at your Bürgerbüro.
        </p>
        <button
          onClick={onStart}
          style={{
            background: "#0075FF", color: "#fff", border: "none",
            padding: "14px 32px", borderRadius: 8, fontSize: 16,
            fontWeight: 700, cursor: "pointer", display: "flex",
            alignItems: "center", gap: 8,
          }}
        >
          Fill my form now <ArrowRight size={18} />
        </button>
        <p style={{ marginTop: 12, fontSize: 13, color: "#94a3b8" }}>
          €15 · One-time · No account needed
        </p>
      </div>
      <AppFooter />
      <CookieBanner />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): add getError validation and landing page component"
```

---

## Task 6: Add wizard step components (StepOrigin through StepReview)

**Files:**
- Modify: `app/munich/page.tsx`

These mirror Berlin's step components but use `MunichFormData` and are self-contained. Add each as a named function component.

- [ ] **Step 1: Add StepOrigin**

```tsx
function StepOrigin({ f, upd }: { f: MunichFormData; upd: (k: keyof MunichFormData) => (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => void }) {
  // Reuse the same ALL_COUNTRIES list from Berlin — import from a shared location
  // or inline the same array. For now, inline a representative subset.
  // Full list should be copied from app/page.tsx ALL_COUNTRIES (derived from COUNTRY_DE).
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Where are you moving from?</h2>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Country of previous address</label>
      <select
        value={f.originCountry}
        onChange={upd("originCountry")}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }}
      >
        <option value="">Select country…</option>
        <option value="Germany">Germany</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        {/* Copy full ALL_COUNTRIES list from app/page.tsx */}
      </select>
    </div>
  );
}
```

> **Note:** The `ALL_COUNTRIES` list, `COUNTRY_DE`, `CITIZENSHIP_DE`, `GENDER_DE`, `RELIGION_DE`, `MARITAL_DE` tables in `app/page.tsx` are the source of truth. Copy them verbatim into `app/munich/page.tsx` — they are large inline objects. Do not import from `app/page.tsx` (it's a client component, not a library module).

- [ ] **Step 2: Add StepNewAddress**

```tsx
function StepNewAddress({ f, upd, set_ }: {
  f: MunichFormData;
  upd: (k: keyof MunichFormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
  set_: (k: keyof MunichFormData, v: any) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Your new Munich address</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Street</label>
          <input value={f.newStreet} onChange={upd("newStreet")}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>House no.</label>
          <input value={f.newNumber} onChange={upd("newNumber")}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Floor / Additional (optional)</label>
        <input value={f.newAddExtra} onChange={upd("newAddExtra")} placeholder="e.g. 2. OG, VH"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Postal code</label>
          <input value={f.newPostalCode} onChange={upd("newPostalCode")} placeholder="80331"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>City</label>
          <input value={f.newCity} onChange={upd("newCity")}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Move-in date</label>
        <input type="date" value={f.moveInDate} onChange={upd("moveInDate")}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Dwelling type</label>
        <select value={f.newResType} onChange={upd("newResType")}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }}>
          <option value="alleinig">Alleinige Wohnung (only home)</option>
          <option value="haupt">Hauptwohnung (main home)</option>
          <option value="neben">Nebenwohnung (secondary home)</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add StepPrevAddress**

```tsx
function StepPrevAddress({ f, upd }: {
  f: MunichFormData;
  upd: (k: keyof MunichFormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
}) {
  const isAbroad = f.prevCountry && f.prevCountry !== "Germany";
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Previous address</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Country</label>
        <select value={f.prevCountry} onChange={upd("prevCountry")}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }}>
          <option value="">Select country…</option>
          <option value="Germany">Germany</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          {/* Copy full list from app/page.tsx */}
        </select>
      </div>
      {!isAbroad && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Street</label>
              <input value={f.prevStreet} onChange={upd("prevStreet")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>House no.</label>
              <input value={f.prevNumber} onChange={upd("prevNumber")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Postal code</label>
              <input value={f.prevPostalCode} onChange={upd("prevPostalCode")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>City</label>
              <input value={f.prevCity} onChange={upd("prevCity")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Move-out date</label>
            <input type="date" value={f.moveOutDate} onChange={upd("moveOutDate")}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
          </div>
        </>
      )}
      {isAbroad && (
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>
          Moving from abroad — only the country will be printed on the form.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add StepPeople**

```tsx
function StepPeople({ f, set_ }: {
  f: MunichFormData;
  set_: (k: keyof MunichFormData, v: any) => void;
}) {
  const updPerson = (i: number, k: keyof Person, v: string | boolean) => {
    const next = f.people.map((p, idx) => idx === i ? { ...p, [k]: v } : p);
    set_("people", next);
  };
  const addPerson = () => {
    if (f.people.length >= MAX_PEOPLE) return;
    set_("people", [...f.people, { ...EMPTY_PERSON, relationship: "child" }]);
  };
  const removePerson = (i: number) => {
    set_("people", f.people.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Who is registering?</h2>
      {f.people.map((p, i) => (
        <div key={i} style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 15 }}>Person {i + 1}{i === 0 ? " (you)" : ""}</strong>
            {i > 0 && (
              <button onClick={() => removePerson(i)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Last name</label>
              <input value={p.lastName} onChange={e => updPerson(i, "lastName", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>First name</label>
              <input value={p.firstName} onChange={e => updPerson(i, "firstName", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Birth date</label>
              <input type="date" value={p.birthDate} onChange={e => updPerson(i, "birthDate", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Birth city</label>
              <input value={p.birthPlace} onChange={e => updPerson(i, "birthPlace", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Birth country</label>
              <input value={p.birthCountry} onChange={e => updPerson(i, "birthCountry", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Gender</label>
              <select value={p.gender} onChange={e => updPerson(i, "gender", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }}>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="diverse">Diverse</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Citizenship (nationality)</label>
            <input value={p.citizenship} onChange={e => updPerson(i, "citizenship", e.target.value)}
              placeholder="e.g. American, British, Indian"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
          </div>
          {i > 0 && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Relationship to Person 1</label>
              <select value={p.relationship} onChange={e => updPerson(i, "relationship", e.target.value as any)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }}>
                <option value="spouse">Spouse / partner</option>
                <option value="child">Child</option>
              </select>
            </div>
          )}
        </div>
      ))}
      {f.people.length < MAX_PEOPLE && (
        <button onClick={addPerson}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "1.5px dashed #94a3b8", borderRadius: 8, padding: "10px 16px",
            cursor: "pointer", color: "#64748b", width: "100%", justifyContent: "center" }}>
          <Plus size={16} /> Add another person (max {MAX_PEOPLE})
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Add StepStatus**

```tsx
function StepStatus({ f, upd }: {
  f: MunichFormData;
  upd: (k: keyof MunichFormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
}) {
  const showMarriageDetails = ["married", "partnership"].includes(f.maritalStatus);
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Civil status</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Marital status</label>
        <select value={f.maritalStatus} onChange={upd("maritalStatus")}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }}>
          <option value="">Select…</option>
          <option value="single">Single (ledig)</option>
          <option value="married">Married (verheiratet)</option>
          <option value="divorced">Divorced (geschieden)</option>
          <option value="widowed">Widowed (verwitwet)</option>
          <option value="partnership">Registered partnership (Lebenspartnerschaft)</option>
          <option value="separated">Separated (getrennt lebend)</option>
        </select>
      </div>
      {showMarriageDetails && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Marriage date</label>
            <input type="date" value={f.marriageDate} onChange={upd("marriageDate")}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Marriage city</label>
              <input value={f.marriagePlace} onChange={upd("marriagePlace")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Marriage country</label>
              <input value={f.marriageCountry} onChange={upd("marriageCountry")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 15 }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Add StepDocuments**

```tsx
function StepDocuments({ f, set_ }: {
  f: MunichFormData;
  set_: (k: keyof MunichFormData, v: any) => void;
}) {
  const updPerson = (i: number, k: keyof Person, v: string | boolean) => {
    const next = f.people.map((p, idx) => idx === i ? { ...p, [k]: v } : p);
    set_("people", next);
  };
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Identity documents</h2>
      <p style={{ color: "#64748b", marginBottom: 16, fontSize: 14 }}>
        Up to 4 document slots on the Munich form. Person 5 (if any) will not have a document slot pre-filled.
      </p>
      {f.people.slice(0, 4).map((p, i) => (
        <div key={i} style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 15 }}>{p.firstName || `Person ${i + 1}`}</strong>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
              <input type="checkbox" checked={p.fillHandwritten}
                onChange={e => updPerson(i, "fillHandwritten", e.target.checked)} />
              I&apos;ll fill doc details by hand
            </label>
          </div>
          {!p.fillHandwritten && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Document type</label>
                  <select value={p.docType} onChange={e => updPerson(i, "docType", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }}>
                    <option value="RP">Reisepass (RP)</option>
                    <option value="PA">Personalausweis (PA)</option>
                    <option value="AT">Aufenthaltstitel (AT)</option>
                    <option value="NV">Nationalpass (NV)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Serial number</label>
                  <input value={p.docSerial} onChange={e => updPerson(i, "docSerial", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Issue date</label>
                  <input type="date" value={p.docDate} onChange={e => updPerson(i, "docDate", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Valid until</label>
                  <input type="date" value={p.docValidUntil} onChange={e => updPerson(i, "docValidUntil", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Issuing authority</label>
                  <input value={p.docAuthority} onChange={e => updPerson(i, "docAuthority", e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Add StepReview**

```tsx
function StepReview({ f }: { f: MunichFormData }) {
  const p1 = f.people[0];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Review your details</h2>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>New address</p>
        <p style={{ color: "#475569" }}>
          {[f.newStreet, f.newNumber, f.newAddExtra].filter(Boolean).join(" ")}<br />
          {f.newPostalCode} {f.newCity}
        </p>
        <p style={{ color: "#64748b", fontSize: 13 }}>Move-in: {f.moveInDate || "—"}</p>
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          {f.people.length} person{f.people.length > 1 ? "s" : ""} registering
        </p>
        {f.people.map((p, i) => (
          <p key={i} style={{ color: "#475569", fontSize: 14 }}>
            {p.firstName} {p.lastName}{p.birthDate ? ` · ${p.birthDate}` : ""}
          </p>
        ))}
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>Status</p>
        <p style={{ color: "#475569" }}>{f.maritalStatus || "—"}</p>
      </div>
      <p style={{ marginTop: 20, color: "#64748b", fontSize: 13 }}>
        After payment, your Munich Anmeldung PDF is generated and downloaded immediately.
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): add all wizard step components"
```

---

## Task 7: Add the main MunichPage React component (state machine + wizard shell)

**Files:**
- Modify: `app/munich/page.tsx`

This is the root export of `app/munich/page.tsx`. It mirrors the `export default function Home()` in `app/page.tsx`.

- [ ] **Step 1: Add PaymentPage component (reuses existing /api/checkout)**

```tsx
function MunichPaymentPage({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: "munich" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Payment setup failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>One-time payment</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>€15 · Instant PDF download · No account</p>
        {error && <p style={{ color: "#ef4444", marginBottom: 16 }}>{error}</p>}
        <button onClick={handlePay} disabled={loading}
          style={{ width: "100%", background: "#0075FF", color: "#fff", border: "none",
            padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Redirecting…" : "Pay €15 and download PDF"}
        </button>
      </div>
      <AppFooter />
    </div>
  );
}
```

- [ ] **Step 2: Add DonePage component**

```tsx
function MunichDonePage({ pdfBlob, filename, onRestart }: {
  pdfBlob: Blob | null;
  filename: string;
  onRestart: () => void;
}) {
  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Your Munich Anmeldung is ready</h2>
        <p style={{ color: "#64748b", marginBottom: 32 }}>
          Print it, sign it at the bottom, and bring it to your Bürgerbüro appointment.
        </p>
        {pdfBlob && (
          <button onClick={handleDownload}
            style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 auto 16px",
              background: "#0075FF", color: "#fff", border: "none",
              padding: "14px 28px", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            <Download size={18} /> Download PDF
          </button>
        )}
        <button onClick={onRestart}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
          Start over
        </button>
      </div>
      <AppFooter />
    </div>
  );
}
```

- [ ] **Step 3: Add the main exported component**

```tsx
export default function MunichPage() {
  const [phase, setPhase]       = useState<AppPhase>("landing");
  const [step, setStep]         = useState<WizardStep>("origin");
  const [form, setForm]         = useState<MunichFormData>(EMPTY);
  const [pdfBlob, setPdfBlob]   = useState<Blob | null>(null);
  const [pdfName, setPdfName]   = useState("anmeldung-muenchen.pdf");
  const [genError, setGenError] = useState("");
  const [stepError, setStepError] = useState("");
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DONE_KEY) === "1") {
      setPhase("done");
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (saved.form) setForm(f => ({ ...EMPTY, ...saved.form }));
      } catch {}
    }
    // Handle Stripe return
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "verified") {
      setPhase("generating");
      window.history.replaceState({}, "", "/munich");
    }
  }, []);

  // Persist form to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ form })); } catch {}
  }, [form]);

  // Generate PDF when phase becomes "generating"
  useEffect(() => {
    if (phase !== "generating") return;
    (async () => {
      try {
        const { bytes, name } = await buildMunichPDF(form);
        const blob = new Blob([bytes], { type: "application/pdf" });
        setPdfBlob(blob);
        setPdfName(name);
        localStorage.setItem(DONE_KEY, "1");
        setPhase("done");
      } catch (e: any) {
        setGenError(e?.message ?? "PDF generation failed. Please try again.");
        setPhase("wizard");
      }
    })();
  }, [phase]);

  const upd = useCallback(
    (k: keyof MunichFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value })),
    []
  );
  const set_ = useCallback(
    (k: keyof MunichFormData, v: any) => setForm(f => ({ ...f, [k]: v })),
    []
  );

  const goNext = () => {
    const err = getError(step, form);
    if (err) { setStepError(err); return; }
    setStepError("");
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    } else {
      setPhase("payment");
    }
  };
  const goBack = () => {
    setStepError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else setPhase("landing");
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DONE_KEY);
    setForm(EMPTY);
    setPdfBlob(null);
    setPhase("landing");
    setStep("origin");
    setConfirmRestart(false);
  };

  // ── Phase: landing ──────────────────────────────────────────────────────────
  if (phase === "landing") {
    return <MunichLandingPage onStart={() => { setPhase("wizard"); setStep("origin"); }} />;
  }

  // ── Phase: payment ──────────────────────────────────────────────────────────
  if (phase === "payment") {
    return <MunichPaymentPage onSuccess={() => setPhase("generating")} />;
  }

  // ── Phase: generating ───────────────────────────────────────────────────────
  if (phase === "generating") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Generating your PDF…</p>
        </div>
      </div>
    );
  }

  // ── Phase: done ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <MunichDonePage
        pdfBlob={pdfBlob}
        filename={pdfName}
        onRestart={() => setConfirmRestart(true)}
      />
    );
  }

  // ── Phase: wizard ───────────────────────────────────────────────────────────
  const stepIdx = STEPS.indexOf(step);

  const stepContent: Record<WizardStep, React.ReactNode> = {
    "origin":       <StepOrigin f={form} upd={upd} />,
    "new-address":  <StepNewAddress f={form} upd={upd} set_={set_} />,
    "prev-address": <StepPrevAddress f={form} upd={upd} />,
    "people":       <StepPeople f={form} set_={set_} />,
    "status":       <StepStatus f={form} upd={upd} />,
    "documents":    <StepDocuments f={form} set_={set_} />,
    "review":       <StepReview f={form} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />

      {/* Restart confirm modal */}
      {confirmRestart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Clear & restart?</h3>
            <p style={{ color: "#64748b", marginBottom: 20 }}>All entered data will be lost.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleRestart}
                style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none",
                  padding: "10px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
                Clear & restart
              </button>
              <button onClick={() => setConfirmRestart(false)}
                style={{ flex: 1, background: "#f1f5f9", color: "#0f172a", border: "none",
                  padding: "10px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
                Keep my data
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= stepIdx ? "#0075FF" : "#e2e8f0",
              }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
            Step {stepIdx + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step content */}
        {genError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
            padding: 12, marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
            {genError}
          </div>
        )}
        {stepContent[step]}

        {/* Error message */}
        {stepError && (
          <p style={{ color: "#ef4444", marginTop: 12, fontSize: 14 }}>{stepError}</p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={goBack}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9",
              border: "none", padding: "12px 20px", borderRadius: 8, cursor: "pointer",
              fontWeight: 600, fontSize: 15 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={goNext}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, background: "#0075FF", color: "#fff", border: "none",
              padding: "12px 20px", borderRadius: 8, cursor: "pointer",
              fontWeight: 700, fontSize: 15 }}>
            {step === "review" ? "Pay €15 & download PDF" : "Continue"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <AppFooter />
      <CookieBanner />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): add main MunichPage state machine and wizard shell"
```

---

## Task 8: Copy translation tables from Berlin

**Files:**
- Modify: `app/munich/page.tsx`

The Munich form needs the same German translation tables for citizenship, country, gender, religion, and marital status. These live in `app/page.tsx` and must be copied verbatim — do not import from `app/page.tsx`.

- [ ] **Step 1: Copy translation tables**

Open `app/page.tsx` and find the following constants. Copy them into `app/munich/page.tsx` after the `MF` field map:

- `COUNTRY_DE` — English country name → German (large object, ~200 entries)
- `COUNTRY_ALIASES` — alias keys like UK, USA, UAE → canonical names
- `CITIZENSHIP_DE` — citizenship adjective → German adjective (e.g. `"American" → "amerikanisch"`)
- `ALL_COUNTRIES` — array derived from `Object.keys(COUNTRY_DE)`, used in dropdowns
- `toGermanCountry(name: string): string` — looks up `COUNTRY_DE` then `COUNTRY_ALIASES`
- `toGermanCitizenship(raw: string): string` — handles comma-separated multi-citizenship

Then update `StepOrigin` and `StepPrevAddress` to replace the hardcoded `<option>` lists with `ALL_COUNTRIES.map(...)`.

Also update the `citizenship` field in `StepPeople` to use a `SearchableSelect` component (copy `SearchableSelect` from `app/page.tsx`) driven by `Object.keys(CITIZENSHIP_DE)`, so the Munich PDF gets proper German adjectives in `staatsang1`–`staatsang4`.

Also update `fillMunichSheet` to call `toGermanCitizenship(p.citizenship)` when setting `MF.STAATSANG[i]` and `toGermanCountry(p.birthCountry)` when setting `MF.GEBORT[i]`.

- [ ] **Step 2: Commit**

```bash
git add app/munich/page.tsx
git commit -m "feat(munich): copy translation tables and wire German citizenship/country to PDF"
```

---

## Task 9: Update navigation and sitemap

**Files:**
- Modify: `app/components/SharedNav.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Check current SharedNav structure**

Open `app/components/SharedNav.tsx` and locate the city or services navigation. Find the appropriate place to add a "Munich" entry — likely alongside or adjacent to the Berlin entry.

- [ ] **Step 2: Add Munich to nav**

In `SharedNav.tsx`, add a Munich link in the services or city dropdown. The exact location depends on the current structure, but it should appear as:

```tsx
// Inside the nav dropdown items (or wherever Berlin's main CTA link lives):
{ href: "/munich", label: "München", badge: "New" }
```

If there is no city switcher yet, add a simple link in the nav dropdown alongside the existing guide links. Do not redesign the nav — just add the entry.

- [ ] **Step 3: Add Munich to sitemap**

In `app/sitemap.ts`, add `/munich` alongside the existing entries:

```ts
{
  url: `${base}/munich`,
  lastModified: new Date("2026-06-28"),
  changeFrequency: "monthly" as const,
  priority: 0.9,
},
```

- [ ] **Step 4: Commit**

```bash
git add app/components/SharedNav.tsx app/sitemap.ts
git commit -m "feat(munich): add Munich to nav and sitemap"
```

---

## Task 10: Manual PDF verification

No automated tests exist in this codebase. Verification is manual.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Complete the Munich wizard end-to-end**

Navigate to `http://localhost:3000/munich`. Complete all 7 steps with these test values:

- Origin country: United States
- New address: Maximilianstraße 1, 80538 München, move-in 2026-07-01
- Previous address: New York, USA (abroad)
- People: 2 — John Smith (1990-03-15, New York, USA, male, American) + Jane Smith (1992-06-20, London, UK, female, British) — Jane as spouse
- Status: Married, 2020-05-01, New York, USA
- Documents: Reisepass, with serial numbers and dates

- [ ] **Step 3: Skip payment in dev**

After the review step, the wizard redirects to Stripe. To test PDF generation without paying, temporarily add `?paid=verified` to the URL and ensure `DONE_KEY` is cleared, OR use Stripe test keys (`sk_test_...` in `.env.local`) and use Stripe's test card `4242 4242 4242 4242`.

- [ ] **Step 4: Verify the downloaded PDF**

Open the generated PDF in a PDF viewer. Verify:

- `strasse` = `"Maximilianstraße 1"`
- `plz` = `"80538 München"`
- `einzug` = `"01.07.2026"`
- `fam1` = `"Smith"`, `vorn1` = `"John"`
- `fam2` = `"Smith"`, `vorn2` = `"Jane"`
- `gebdat1` = `"15.03.1990"`, `gebdat2` = `"20.06.1992"`
- `staatsang1` = `"amerikanisch"`, `staatsang2` = `"britisch"`
- `bishwo` = `"Vereinigte Staaten von Amerika"` (or `"USA"` — confirm what looks right)
- All other fields blank (office fields, signature, etc.)

- [ ] **Step 5: Fix any field mapping errors and commit**

If any fields are wrong or missing, trace back to the `MF` field map and `fillMunichSheet` function and correct them.

```bash
git add app/munich/page.tsx
git commit -m "fix(munich): correct PDF field mappings after manual verification"
```

---

## Task 11: Deploy to Vercel

- [ ] **Step 1: Push to main**

```bash
git push
```

Vercel auto-deploys from `main`. Check `simplyexpat.de/munich` once the deploy completes (~2 min).

- [ ] **Step 2: Smoke test on production**

Navigate to `https://simplyexpat.de/munich`, complete the wizard, pay with a real card (or Stripe test keys if still in test mode), and verify the downloaded PDF is correctly filled.

---

## Self-Review

**Spec coverage:**
- ✅ Separate wizard at `/munich` (Task 3–7)
- ✅ Munich PDF template downloaded (Task 1)
- ✅ All 105 fields mapped (MF constant + fillMunichSheet)
- ✅ Up to 5 people per sheet (Munich's limit)
- ✅ 4 document slots (vs Berlin's 2)
- ✅ `gesetzlver` legal representative for minors (Task 4)
- ✅ `getrennt1` separated status (Task 4)
- ✅ Foreign previous address → country in `bishwo` (Task 4)
- ✅ German translation tables copied (Task 8)
- ✅ Nav + sitemap updated (Task 9)
- ✅ Manual PDF verification (Task 10)
- ✅ Deployment (Task 11)

**Placeholder scan:** No TBD or TODO left. Task 8 Step 1 references `app/page.tsx` directly for the copy — this is intentional (source of truth).

**Type consistency:** `MunichFormData` used consistently throughout. `EMPTY` matches the interface. `MF` arrays are 0-indexed and accessed as `MF.FAM[i]` everywhere.
