// app/freelance-steuer/steuer-data.ts
// ═══════════════════════════════════════════════════════════════════
//  EASY FRAGEBOGEN ZUR STEUERLICHEN ERFASSUNG · data layer
//  Single source of truth for the FsE EUn (solo freelancer) copilot.
//  ELSTER field numbers verified against a real fseeun-202401
//  submission summary captured 2026-03 (see design spec §3:
//  docs/superpowers/specs/2026-07-06-easy-fragebogen-steuerliche-erfassung-design.md).
//
//  VERIFIED LEGAL FACTS (update date + source when re-verified):
//  - §19 UStG Kleinunternehmer: previous calendar year ≤ €25,000 /
//    current calendar year ≤ €100,000 (fixed limits, not forecasts).
//    Source: gesetze-im-internet.de/ustg_1980/__19.html, verified 2026-07-07
//  - §19 UStG FOUNDING YEAR (JStG 2024 reform, from 2025): in the year of
//    founding the €25,000 limit applies to actual founding-year revenue
//    (no previous year exists); the transaction that crosses it is already
//    subject to regular taxation from that point on.
//    Sources: haufe.de HI1342178, nwb.de "Neuregelungen für Kleinunternehmer
//    ab 2025", ihk.de Stuttgart 1843632 — verified 2026-07-07
//  - Filing deadline: within ONE MONTH of the reportable event (start of
//    activity) — §138 Abs. 4 AO ("innerhalb eines Monats").
//    Source: gesetze-im-internet.de/ao_1977/__138.html, verified 2026-07-07
//  - ELSTER-only submission since 2021: electronic transmission mandated by
//    §138 Abs. 1b AO; paper only in hardship cases (§150 Abs. 8 AO).
//  - ELSTER activation letter: sent by post, typically a few days up to
//    two weeks. Source: elster.de help pages + steuern.de/elster-zertifikatsdatei,
//    verified 2026-07-07
//  - Steuernummer delivery time: NO verified number — do not state one.
//    Copy must say "by post after processing" without a timeframe.
//  - Church tax (Kirchensteuer): not only rk/ev — some other communities
//    (e.g. jüdische Kultusgemeinden, altkatholisch) also levy it. "Other"
//    must NEVER auto-map to "nicht kirchensteuerpflichtig".
//
//  LEGAL DESIGN RULE (spec §2): every `explain` explains, NEVER recommends.
//  Words like "should", "we recommend", "better", "most people pick"
//  are FORBIDDEN in field copy. Discretionary fields carry `decision: true`
//  which renders the neutral your-decision banner in the wizard.
// ═══════════════════════════════════════════════════════════════════

export type SteuerForm = {
  // ── Meta: ELSTER readiness (wizard step 1, not an ELSTER form field) ──
  hasElsterAccount: boolean | null;
  // ── Allgemeine Angaben ──
  anrede: "" | "Frau" | "Herr" | "keine Angabe";
  firstName: string;
  lastName: string;
  birthDate: string;            // ISO yyyy-mm-dd
  profession: string;           // Ausgeübter Beruf (field 4)
  steuerId: string;             // 11-digit Identifikationsnummer (field 5)
  // NOTE: gate booleans are `boolean | null` — null = not yet answered.
  // A pre-selected "No" on a tax declaration is a silent wrong answer,
  // so every yes/no must be an active user choice (audit finding E2).
  hasIncomeTaxNumber: boolean | null;  // had a German income-tax Steuernummer before?
  incomeTaxNumber: string;      // if yes (field 5) — else sheet prints "wird neu beantragt"
  religion: "" | "none" | "rk" | "ev" | "other";  // field 5 — "" = unanswered
  // ── Familienstand / Ehegatte (conditional subsection of Allgemeine Angaben) ──
  married: boolean | null;
  spouseFirstName: string; spouseLastName: string;
  spouseBirthDate: string;      // ISO
  spouseProfession: string;
  spouseSteuerId: string;
  spouseReligion: "" | "none" | "rk" | "ev" | "other";
  // ── Adresse im Inland ──
  street: string; houseNo: string; houseNoSuffix: string;
  plz: string; city: string;
  // ── Bisherige persönliche Verhältnisse ──
  movedWithin12Months: boolean | null;
  movedDate: string;            // ISO (field 47)
  prevStreet: string; prevHouseNo: string; prevPlz: string; prevCity: string; // 48–50
  taxRegisteredBefore: boolean | null; // registered for income tax in last 3 years?
  prevTaxNumber: string;        // field 52
  // ── Tätigkeit ──
  activityDesc: string;         // field 21 — genaue Bezeichnung
  isNewFounding: boolean | null; // scope gate: v1 covers Neugründung only (field 85)
  businessAddrIsHome: boolean | null;  // field 56
  bizStreet: string; bizHouseNo: string; bizPlz: string; bizCity: string; // only if businessAddrIsHome === false
  activityStart: string;        // ISO (field 69, incl. Vorbereitungshandlungen)
  foundingDate: string;         // ISO (field 85)
  priorBusiness: boolean | null; // field 93 (5-year lookback)
  // ── Bankverbindung ──
  iban: string;                 // field 22 (inländisches Geldinstitut)
  accountHolderIsSelf: boolean | null; // field 25
  accountHolderName: string;    // only if accountHolderIsSelf === false
  // ── Vorauszahlungen (plain-integer € strings, German-formatted on the sheet) ──
  profitY1: string; profitY2: string;             // field 107 selbständige Arbeit
  employmentY1: string; employmentY2: string;     // field 108 nichtselbständige Arbeit
  sonderausgabenY1: string; sonderausgabenY2: string; // field 112
  // ── Gewinnermittlung ──
  confirmEuer: boolean | null;  // user's explicit confirmation of EÜR (field 114 — audit A1)
  deviatingFiscalYear: boolean | null; // field 116
  // ── Umsatzsteuer ──
  currentlyVatRegistered: boolean | null; // field 128
  revenueY1: string; revenueY2: string;           // field 130 geschätzte Umsätze
  kleinunternehmer: null | boolean; // field 131 — NO DEFAULT. User must actively choose.
  vatBalance: string;           // field 133 geschätzte Zahllast (only if kleinunternehmer === false)
};

export const EMPTY_STEUER: SteuerForm = {
  hasElsterAccount: null,
  anrede: "", firstName: "", lastName: "", birthDate: "", profession: "",
  steuerId: "", hasIncomeTaxNumber: null, incomeTaxNumber: "", religion: "",
  married: null, spouseFirstName: "", spouseLastName: "", spouseBirthDate: "",
  spouseProfession: "", spouseSteuerId: "", spouseReligion: "",
  street: "", houseNo: "", houseNoSuffix: "", plz: "", city: "",
  movedWithin12Months: null, movedDate: "",
  prevStreet: "", prevHouseNo: "", prevPlz: "", prevCity: "",
  taxRegisteredBefore: null, prevTaxNumber: "",
  activityDesc: "", isNewFounding: null, businessAddrIsHome: null,
  bizStreet: "", bizHouseNo: "", bizPlz: "", bizCity: "",
  activityStart: "", foundingDate: "", priorBusiness: null,
  iban: "", accountHolderIsSelf: null, accountHolderName: "",
  profitY1: "", profitY2: "", employmentY1: "", employmentY2: "",
  sonderausgabenY1: "", sonderausgabenY2: "",
  confirmEuer: null, deviatingFiscalYear: null,
  currentlyVatRegistered: null, revenueY1: "", revenueY2: "",
  kleinunternehmer: null, vatBalance: "",
};

export const STORAGE_KEY = "simplyexpat-steuer-v1";
export const DONE_KEY    = "simplyexpat-steuer-done-v1";

// German religion values as ELSTER expects them.
// IMPORTANT (audit B1): "other" must NOT auto-map to "nicht kirchensteuer-
// pflichtig" — some non-rk/ev communities (jüdische Kultusgemeinden,
// altkatholisch, …) DO levy church tax. "other" gets an instruction to pick
// the community from ELSTER's own dropdown instead of a fabricated value.
export const RELIGION_STEUER: Record<SteuerForm["religion"], string> = {
  "":    "",
  none:  "nicht kirchensteuerpflichtig",
  rk:    "römisch-katholisch",
  ev:    "evangelisch",
  other: "Ihre Gemeinschaft in ELSTERs Religions-Liste auswählen",
};

// DD.MM.YYYY, locale-independent (same approach as main app fmtDate)
export const fmtDateDE = (iso: string): string => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : "";
};

// German thousands format: "4800" -> "4.800"
export const fmtEuro = (raw: string): string => {
  const n = parseInt((raw || "").replace(/[^\d]/g, ""), 10);
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

// ── Answer sheet ────────────────────────────────────────────────────
// One row = one ELSTER field the user will fill. `nr` matches the small
// number printed next to the field in Mein ELSTER so users can track
// exactly where they are. `de` = the value to type/select (in German).
// `enHint` = short English reminder of what the field is.

// `instruction: true` = the de-value is a to-do ("tick the box", "leave
// empty"), not text to type — the done page renders it without a copy button
// so nobody pastes "Felder leer lassen" into a tax form.
export type AnswerRow = { nr: string; label: string; de: string; enHint: string; instruction?: boolean };
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
        instruction: f.religion === "other" || undefined,
        enHint: f.religion === "other"
          ? "You belong to another church-tax-collecting community — pick it from ELSTER's own list for this field"
          : "Church-tax status — see explanation in the wizard" },
      ...(f.married ? [
        { nr: "—", label: "Ehegatte/Lebenspartner(in): Vorname", de: f.spouseFirstName, enHint: "Spouse subsection (ELSTER shows it inside Allgemeine Angaben when married)" },
        { nr: "—", label: "Ehegatte: Name", de: f.spouseLastName, enHint: "Spouse's last name" },
        { nr: "—", label: "Ehegatte: Geburtsdatum", de: fmtDateDE(f.spouseBirthDate), enHint: "Spouse's date of birth" },
        { nr: "—", label: "Ehegatte: Ausgeübter Beruf", de: f.spouseProfession, enHint: "Spouse's occupation" },
        { nr: "—", label: "Ehegatte: Identifikationsnummer", de: f.spouseSteuerId, enHint: "Spouse's 11-digit tax ID (leave field empty in ELSTER if none yet)" },
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
        de: f.accountHolderIsSelf === false ? f.accountHolderName : "der/die Steuerpflichtige",
        enHint: f.accountHolderIsSelf === false ? "Name of the account holder" : "= “the taxpayer” (you)" },
    ],
  });

  // Always emit this section — ELSTER shows the questions either way, so the
  // user needs explicit "leave empty" guidance for the parts that don't apply
  // (audit C1).
  const prevRows: AnswerRow[] = [];
  if (f.movedWithin12Months) {
    prevRows.push(
      { nr: "47", label: "Innerhalb der letzten 12 Monate zugezogen am", de: fmtDateDE(f.movedDate), enHint: "Date you moved (within last 12 months)" },
      { nr: "48", label: "Straße (bisherige Adresse)", de: f.prevStreet, enHint: "Previous street" },
      { nr: "49", label: "Hausnummer", de: f.prevHouseNo, enHint: "Previous house number" },
      { nr: "50", label: "Postleitzahl", de: f.prevPlz, enHint: "Previous postal code" },
      { nr: "50", label: "Wohnort", de: f.prevCity, enHint: "Previous city (and country if abroad)" },
    );
  } else {
    prevRows.push({ nr: "47–50", label: "Zugezogen innerhalb der letzten 12 Monate / bisherige Adresse", de: "Felder leer lassen", instruction: true, enHint: "You didn't move within the last 12 months — leave these fields empty" });
  }
  if (f.taxRegisteredBefore) {
    prevRows.push({ nr: "52", label: "Steuernummer (falls in den letzten 3 Jahren steuerlich erfasst)", de: f.prevTaxNumber, enHint: "Your previous German tax number" });
  } else {
    prevRows.push({ nr: "52", label: "Steuernummer (falls in den letzten 3 Jahren steuerlich erfasst)", de: "Feld leer lassen", instruction: true, enHint: "You weren't registered for German income tax in the last 3 years — leave empty" });
  }
  sections.push({ title: "Bisherige persönliche Verhältnisse", titleEn: "Previous circumstances", rows: prevRows });

  sections.push({
    title: "Angaben zur Tätigkeit — Unternehmen",
    titleEn: "Business details",
    rows: [
      f.businessAddrIsHome === false
        ? { nr: "56", label: "Anschrift des Unternehmens", de: `${f.bizStreet} ${f.bizHouseNo}, ${f.bizPlz} ${f.bizCity}`, enHint: "Separate business address" }
        : { nr: "56", label: "Anschrift des Unternehmens", de: "Häkchen setzen: „Die Anschrift des Unternehmens entspricht meiner Wohnanschrift.“", instruction: true, enHint: "Tick the checkbox: business address = home address" },
      { nr: "69", label: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", de: fmtDateDE(f.activityStart), enHint: "Start date, incl. preparation (e.g. buying equipment)" },
      { nr: "85", label: "Gründungsart", de: "Neugründung", enHint: "= “new founding” — you confirmed in the wizard that this is a brand-new activity" },
      { nr: "85", label: "Gründungsdatum", de: fmtDateDE(f.foundingDate || f.activityStart), enHint: "Founding date" },
      { nr: "93", label: "Frühere Selbständigkeit / Beteiligungen (letzte 5 Jahre)", de: f.priorBusiness === true ? "Ja" : "Nein", enHint: "Any self-employment or company shares (≥1%) in the last 5 years?" },
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
      { nr: "114", label: "Gewinnermittlungsart", de: "Einnahmenüberschussrechnung", enHint: "= cash-basis accounting (EÜR) — the method YOU confirmed in the wizard" },
      { nr: "116", label: "Vom Kalenderjahr abweichendes Wirtschaftsjahr?", de: f.deviatingFiscalYear === true ? "Ja" : "Nein", enHint: "Fiscal year different from calendar year (requires Finanzamt approval)" },
    ],
  });

  const vatRows: AnswerRow[] = [
    { nr: "128", label: "Ich werde aktuell bei einem Finanzamt umsatzsteuerlich geführt", de: f.currentlyVatRegistered === true ? "Ja" : "Nein",
      enHint: f.currentlyVatRegistered === true
        ? "Yes — note: ELSTER will ask follow-up questions about your existing VAT file that this sheet doesn't cover; have your existing tax documents ready"
        : "Currently VAT-registered at a German tax office?" },
    { nr: "130", label: "Summe der Umsätze (geschätzt) — Jahr der Betriebseröffnung", de: fmtEuro(f.revenueY1), enHint: "Estimated total REVENUE (before expenses), year 1" },
    { nr: "130", label: "Summe der Umsätze (geschätzt) — Folgejahr", de: fmtEuro(f.revenueY2), enHint: "Estimated revenue, year 2" },
  ];
  if (f.kleinunternehmer === true) {
    vatRows.push({ nr: "131", label: "Kleinunternehmer-Regelung", de: "Häkchen setzen (Kleinunternehmer-Regelung nach § 19 UStG in Anspruch nehmen)", instruction: true, enHint: "Tick the box — YOUR choice from the wizard" });
  } else if (f.kleinunternehmer === false) {
    vatRows.push(
      { nr: "131", label: "Kleinunternehmer-Regelung", de: "Häkchen NICHT setzen", instruction: true, enHint: "Leave unticked — YOUR choice from the wizard" },
      { nr: "133", label: "Voraussichtliche Umsatzsteuer-Zahllast (geschätzt)", de: fmtEuro(f.vatBalance) || "0", enHint: "Estimated VAT payable (VAT charged minus input VAT)" },
    );
  }
  sections.push({ title: "Anmeldung und Abführung der Umsatzsteuer", titleEn: "VAT registration", rows: vatRows });

  return sections;
}

// ── Wizard step definitions ─────────────────────────────────────────
export type FieldDef = {
  key: keyof SteuerForm;
  label: string;              // English label shown in wizard
  deLabel: string;            // German original (shown small, builds recognition for ELSTER)
  type: "text" | "date" | "select" | "boolean" | "euro";
  options?: { value: string; label: string }[]; // for select
  placeholder?: string;
  explain: string;            // neutral English explanation (short, always visible)
  more?: string;              // deep-dive: opens on click ("Tell me more"), \n = paragraph.
                              // Easy English, honest about the German system, still NEVER a recommendation.
  decision?: boolean;         // renders the your-decision banner
  showIf?: (f: SteuerForm) => boolean;
  required?: boolean | ((f: SteuerForm) => boolean);
};

export type StepDef = { id: string; title: string; sub: string; fields: FieldDef[] };

export const STEUER_STEPS: StepDef[] = [
  {
    id: "elster", title: "First things first: your ELSTER account",
    sub: "The finished form can only be submitted through Mein ELSTER, Germany's official tax portal. Everything in this wizard works without it — but the account takes up to two weeks (thanks to a letter), so let's check now.",
    fields: [
      { key: "hasElsterAccount", label: "Do you already have access to Mein ELSTER?", deLabel: "Mein ELSTER — Zertifikatsdatei", type: "boolean", required: true,
        explain: "Both answers are fine — you can prepare all your answers here either way.",
        more: "What Yes means: you can log in at elster.de with your certificate file (.pfx) and password. You're ready to transfer your answers the moment your sheet is done.\nWhat No means: no problem at all. Register today at elster.de (about 10 minutes online — the steps above show you every screen), and Germany mails you an activation code. The letter typically takes a few days up to two weeks. Yes, the digital tax portal starts with a physical letter — we don't make the rules.\nThe good news: you don't have to wait. Prepare your entire answer sheet here now; it stays saved in your browser (plus your PDF), and when the letter arrives you'll transfer everything in ten minutes." },
    ],
  },
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
        explain: "Your job title, in German if possible. Short and factual — e.g. “Softwareentwickler”, “Fotografin”, “Übersetzer”. If you do several things, name the main one or write “mehrere” (several).",
        more: "Why does a tax form ask for your job? The Finanzamt uses it for context — it helps them sanity-check the rest of your answers (a photographer estimating €500,000 revenue would raise an eyebrow).\nDon't overthink it. This is a label, not a contract. It doesn't limit what work you're allowed to do later, and it's separate from the detailed activity description you'll write in a later step.\nIf you don't know the German word for your job, a simple translation from a dictionary is fine — the clerk reading it is human." },
    ],
  },
  {
    id: "identity", title: "Your tax identity", sub: "The numbers and statuses the Finanzamt already knows you by.",
    fields: [
      { key: "steuerId", label: "Tax ID (Steuerliche Identifikationsnummer)", deLabel: "Identifikationsnummer", type: "text", required: true, placeholder: "11 digits, e.g. 12345678995",
        explain: "The 11-digit number you received by post a few weeks after your Anmeldung. It is NOT the same as a Steuernummer.",
        more: "Fair warning: Germany will give you up to three different tax-related numbers, and the names all sound the same. Nobody designed this to be understood.\n1. Steuer-ID (this field) — 11 digits, yours for life, sent automatically after your Anmeldung. It's on the letter from the Bundeszentralamt für Steuern.\n2. Steuernummer — assigned by your local Finanzamt for your tax file. As a new freelancer you'll get one AFTER submitting this form. That's the number you'll later print on invoices.\n3. USt-IdNr. (VAT ID) — only relevant for certain cross-border business, and optional for many freelancers.\nFor this field you need number 1 only. Never received it? Request it at bzst.de — it's free, but it comes by post (of course it does), so do it today." },
      { key: "hasIncomeTaxNumber", label: "Have you ever had a German income-tax number (Steuernummer)?", deLabel: "Einkommensteuernummer", type: "boolean", required: true,
        explain: "If you answer no, the form entry is “wird neu beantragt” (will be newly requested) — the Finanzamt then assigns you one after processing.",
        more: "What Yes means: a German Finanzamt has processed income tax for you before (for example, you filed a tax return during an earlier stay) and gave you a Steuernummer — a number formatted like 12/345/67890 on letters from a Finanzamt.\nWhat No means: you're new to the German income-tax system. Totally normal for new arrivals. The form entry becomes “wird neu beantragt” and the Finanzamt creates your number for you.\nNot sure? If you've never filed a German tax return and never received Finanzamt letters, the honest answer is almost certainly no — and answering no when you actually had one long ago is not a catastrophe; the Finanzamt matches people by Steuer-ID anyway. That's literally what the 11-digit number is for." },
      { key: "incomeTaxNumber", label: "Your existing Steuernummer", deLabel: "Einkommensteuernummer", type: "text", showIf: f => f.hasIncomeTaxNumber, required: f => f.hasIncomeTaxNumber, placeholder: "e.g. 49/099/01230",
        explain: "The format looks like 12/345/67890 and is on previous letters from a Finanzamt." },
      { key: "religion", label: "Church tax status", deLabel: "Religion", type: "select", required: true,
        options: [
          { value: "none", label: "No church-tax-liable membership (nicht kirchensteuerpflichtig)" },
          { value: "rk", label: "Roman Catholic (römisch-katholisch)" },
          { value: "ev", label: "Protestant (evangelisch)" },
          { value: "other", label: "Member of another church-tax-collecting community" },
        ],
        explain: "Membership in a religious community that collects church tax in Germany triggers church tax of 8–9% of your income tax. This field states a fact about your membership; it does not change your faith.",
        more: "Yes, a German tax form really asks about your religion. The reason: Germany collects tax on behalf of certain religious communities — mainly the Catholic and Protestant churches, but also some others like Jewish communities (jüdische Kultusgemeinden) and the Old Catholic Church (altkatholisch). It's 8–9% of your income tax, collected automatically.\nWhat the options mean:\n· “No church-tax-liable membership” — you are not a registered member of any community that collects church tax in Germany. Your faith itself is irrelevant here; a practicing Muslim, Hindu or Buddhist typically enters this too, because those communities don't collect German church tax.\n· Roman Catholic / Protestant — you are a registered member (baptism usually counts, even from abroad).\n· “Member of another church-tax-collecting community” — pick your exact community from ELSTER's own dropdown list.\nGood to know: leaving a church later is its own bureaucratic process (Kirchenaustritt, at the Amtsgericht, roughly €30–40 — no, it's not free, and no, you can't do it here). This form only records your current status." },
      { key: "married", label: "Are you married or in a registered partnership?", deLabel: "Familienstand", type: "boolean", required: true,
        explain: "If yes, ELSTER shows an additional subsection asking for your spouse's/partner's basic data inside “Allgemeine Angaben”.",
        more: "Why does the Finanzamt care about your spouse for YOUR freelance registration? Because married couples in Germany can be taxed jointly, which changes how your advance payments are calculated. The state wants the full household picture from day one.\nWhat Yes means: ELSTER opens extra fields for your spouse's name, birth date, occupation, tax ID and church-tax status — we collect them in this step so your sheet is complete.\nWhat No means: the spouse subsection stays closed and you skip ahead. Unmarried partners, boyfriends/girlfriends and flatmates don't count — Germany only recognises marriage and registered partnerships (eingetragene Lebenspartnerschaft) here." },
      { key: "spouseFirstName", label: "Spouse: first name", deLabel: "Ehegatte — Vorname", type: "text", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseLastName", label: "Spouse: last name", deLabel: "Ehegatte — Name", type: "text", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseBirthDate", label: "Spouse: date of birth", deLabel: "Ehegatte — Geburtsdatum", type: "date", showIf: f => f.married, required: f => f.married, explain: "" },
      { key: "spouseProfession", label: "Spouse: occupation", deLabel: "Ehegatte — Ausgeübter Beruf", type: "text", showIf: f => f.married,
        explain: "In German if possible, e.g. “Lehrerin”, “angestellt”, “ohne Beschäftigung”." },
      { key: "spouseSteuerId", label: "Spouse: tax ID (11 digits)", deLabel: "Ehegatte — Identifikationsnummer", type: "text", showIf: f => f.married,
        explain: "On your spouse's letter from the Bundeszentralamt für Steuern. Leave empty if your spouse has none yet (e.g. just arrived) — the Finanzamt can match it later." },
      { key: "spouseReligion", label: "Spouse: church tax status", deLabel: "Ehegatte — Religion", type: "select", showIf: f => f.married === true, required: f => f.married === true,
        options: [
          { value: "none", label: "No church-tax-liable membership" },
          { value: "rk", label: "Roman Catholic (römisch-katholisch)" },
          { value: "ev", label: "Protestant (evangelisch)" },
          { value: "other", label: "Member of another church-tax-collecting community" },
        ],
        explain: "Same logic as your own church-tax field above." },
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
        explain: "If yes, ELSTER asks for the move-in date and your previous address. A previous address abroad is fine — enter it as it was.",
        more: "What Yes means: you tell the Finanzamt your move-in date and previous address. If you came from abroad, you enter your old foreign address — street, city, country, exactly as it was. German forms cope with foreign addresses better than you'd expect.\nWhat No means: you've lived at your current address for over a year, and this whole subsection stays empty on your sheet.\nWhy they ask: tax responsibility follows your residence. The date tells them from when Germany considers you tax-resident and which Finanzamt is responsible for you. It usually matches the date on your Anmeldebestätigung — the paper you got at the Bürgeramt." },
      { key: "movedDate", label: "Move-in date", deLabel: "Zugezogen am", type: "date", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months,
        explain: "The date on your Anmeldung confirmation (Anmeldebestätigung)." },
      { key: "prevStreet", label: "Previous street", deLabel: "Straße (bisherige Adresse)", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months, explain: "" },
      { key: "prevHouseNo", label: "Previous house number", deLabel: "Hausnummer", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevPlz", label: "Previous postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevCity", label: "Previous city (and country if abroad)", deLabel: "Wohnort", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months,
        explain: "e.g. “London, Vereinigtes Königreich”." },
      { key: "taxRegisteredBefore", label: "Were you registered for German income tax in the last 3 years?", deLabel: "Steuerlich erfasst in den letzten 3 Jahren", type: "boolean", required: true,
        explain: "Only yes if a German Finanzamt has processed your income tax before (e.g. you were employed here in a previous stay and filed a return).",
        more: "What Yes means: sometime in the last 3 years, a German Finanzamt had a tax file on you — you filed a return or received tax assessments. ELSTER then asks for that old Steuernummer so they can link the files.\nWhat No means: you're new to the system, nothing to link. This is the normal answer for fresh arrivals.\nBeing employed in Germany alone doesn't automatically mean yes — your employer paid wage tax under their own number. The question is whether YOU were registered for income tax with your own file. If no Finanzamt ever wrote to you, the answer is no." },
      { key: "prevTaxNumber", label: "That previous tax number", deLabel: "Steuernummer", type: "text", showIf: f => f.taxRegisteredBefore, required: f => f.taxRegisteredBefore, explain: "" },
    ],
  },
  {
    id: "activity", title: "Your freelance activity", sub: "What you do, from when, and from where.",
    fields: [
      { key: "activityDesc", label: "Describe your activity (in German)", deLabel: "Art der Tätigkeit — genaue Bezeichnung", type: "text", required: true, placeholder: "e.g. Softwareentwicklung für Webanwendungen",
        explain: "One precise line, in German. Describe what you really do: “Entwicklung von Websoftware” is more precise than “IT”.",
        more: "This one line matters more than it looks. The Finanzamt reads it to classify your work as either freiberuflich (liberal profession — e.g. software development, design, writing, teaching, consulting) or gewerblich (trade/commerce). The difference decides whether you'll also deal with Gewerbe registration and Gewerbesteuer later.\nThe classification is the Finanzamt's call, based on what you actually do — not on which word you'd prefer. So the best strategy is simply precision: describe the real work. “Entwicklung und Wartung von Websoftware für Agenturen” tells them everything; “IT-Services” tells them nothing and invites follow-up questions.\nWriting it in German is expected. A clean dictionary translation of your honest description is completely fine — this is a description, not literature." },
      { key: "isNewFounding", label: "Is this a brand-new activity you are founding yourself?", deLabel: "Gründungsart — Neugründung", type: "boolean", required: true,
        explain: "This assistant covers new foundings (Neugründung) only. Taking over an existing business (Übernahme) or relocating one (Verlegung) triggers different ELSTER questions that this wizard doesn't cover.",
        more: "What Yes means: you're starting something of your own from scratch — the standard case for a new freelancer, and what ELSTER calls “Neugründung”.\nWhat No means: you're taking over an existing business (Übernahme), converting one (Umwandlung), or moving one from another town (Verlegung). Those unlock extra ELSTER sections about the previous business that we'd rather not half-explain — so this wizard honestly stops and points you to ELSTER's help or a Steuerberater instead of guessing.\nStarting the same kind of work you did as an employee still counts as a new founding — what matters is that the BUSINESS is new, not the skill." },
      { key: "businessAddrIsHome", label: "Do you work from your home address?", deLabel: "Anschrift des Unternehmens entspricht Wohnanschrift", type: "boolean", required: true,
        explain: "If yes, ELSTER has a checkbox for “business address equals home address” — no extra typing.",
        more: "What Yes means: your desk is at home. Completely normal for freelancers — most start exactly like this, and it doesn't create any special obligations by itself.\nWhat No means: you rent a separate office, co-working desk with a fixed address, or studio — ELSTER wants that address as your business address.\nDon't confuse this with the home-office tax deduction debate — that's a topic for your future tax returns, not for this registration. Here the Finanzamt only wants to know where your business physically sits, mostly to confirm which Finanzamt is responsible for you." },
      { key: "bizStreet", label: "Business street", deLabel: "Straße", type: "text", showIf: f => f.businessAddrIsHome === false, required: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizHouseNo", label: "Business house number", deLabel: "Hausnummer", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizPlz", label: "Business postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizCity", label: "Business city", deLabel: "Ort", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "activityStart", label: "When did/will your activity start?", deLabel: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", type: "date", required: true,
        explain: "Including preparation: the day you started setting things up counts, not just your first invoice. You must submit this Fragebogen within ONE MONTH of this date (§138 AO).",
        more: "Germany starts the clock earlier than you'd think. “Beginn der Tätigkeit” includes Vorbereitungshandlungen — preparation acts: buying your work laptop, signing a client contract, setting up the website you'll sell through. Not just the glamorous first invoice.\nWhy it matters: the one-month filing deadline (§138 AO) runs from this date. If your honest start date is further back than a month, don't panic and don't “adjust” the date — file now. A slightly late Fragebogen is routine; a false date on a tax form is not.\nThis date also tells the Finanzamt from when your business expenses can count — which is exactly why the definition includes preparation." },
      { key: "foundingDate", label: "Founding date (usually the same)", deLabel: "Gründungsdatum", type: "date",
        explain: "For a simple solo start this is normally the same date as above. If you leave it empty, your answer sheet repeats the start date." },
      { key: "priorBusiness", label: "In the last 5 years: any business, freelance work, or ≥1% company shareholding — in Germany or abroad?", deLabel: "Bisherige betriebliche Verhältnisse", type: "boolean", required: true,
        explain: "A factual yes/no. Yes does not block anything — the Finanzamt just wants the history.",
        more: "What counts as Yes: any self-employment, business, or farm you ran in the last 5 years — in Germany OR abroad — and also owning 1% or more of a company (shares in your own Ltd/LLC back home count; a handful of publicly traded stocks doesn't reach 1% and doesn't).\nWhat Yes triggers: nothing scary. It's context for the Finanzamt, and being a serial founder is not a crime.\nWhat No means: clean slate, nothing to declare here.\nThe honest answer is the only good answer — this is a declaration to a tax authority, and the sheet will print exactly what you choose." },
    ],
  },
  {
    id: "bank", title: "Bank account", sub: "Where tax refunds go.",
    fields: [
      { key: "iban", label: "Your IBAN (German bank account)", deLabel: "IBAN (inländisches Geldinstitut)", type: "text", required: true, placeholder: "DE00 0000 0000 0000 0000 00",
        explain: "This field of the form expects a German (DE) IBAN for refunds. We validate the checksum locally in your browser — the number is never sent to us.",
        more: "Why the Finanzamt wants this: tax refunds and any SEPA direct debits go through this account. Good news first: this is how you get money BACK.\nThe form field is labelled “inländisches Geldinstitut” — domestic bank. Modern German online banks (N26, DKB, ING…) all give DE IBANs and are fine. If you only have a foreign account so far, ELSTER has a separate variant for foreign IBANs — but for this assistant we stick to the standard DE case, which is also the path of least friction with the Finanzamt.\nAbout the checksum: every IBAN contains a built-in error check (that's the two digits after DE). We verify it mathematically in your browser so a typo can't slip onto your sheet — the number itself never leaves your device." },
      { key: "accountHolderIsSelf", label: "Is the account in your name?", deLabel: "Kontoinhaber(in)", type: "boolean", required: true,
        explain: "If yes, ELSTER's option “der/die Steuerpflichtige” (the taxpayer) applies." },
      { key: "accountHolderName", label: "Account holder's name", deLabel: "Kontoinhaber(in)", type: "text", showIf: f => f.accountHolderIsSelf === false, required: f => f.accountHolderIsSelf === false, explain: "" },
    ],
  },
  {
    id: "estimates", title: "Income estimates", sub: "Honest guesses are expected — nobody can predict a first year exactly.",
    fields: [
      { key: "profitY1", label: "Estimated freelance PROFIT — this year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Profit = income minus business expenses, NOT your revenue. Your own honest estimate — we cannot advise you on the amount.",
        more: "Yes, Germany asks you to predict the future. Nobody knows their first-year profit — the Finanzamt knows that nobody knows, and asks anyway. What they want is your honest current guess, not a promise.\nWhat the number does: it sets your quarterly advance income-tax payments (Vorauszahlungen). Mechanically: a higher estimate → higher advance payments now, refunded later if you earn less. A lower estimate → lower advance payments now, with a back-payment later if you earn more. Either way, your FINAL tax is settled by your annual tax return — the estimate only changes the timing of cash, not the total.\nGot it wrong later? Write to your Finanzamt and have the advance payments adjusted — that's a normal letter, not a confession.\nRemember: profit, not revenue. €40,000 invoiced minus €10,000 costs = €30,000 goes here." },
      { key: "profitY2", label: "Estimated profit — next year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Folgejahr", type: "euro", required: true, decision: true,
        explain: "Same logic for the first full calendar year." },
      { key: "employmentY1", label: "Employment income this year, if any (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit", type: "euro",
        explain: "Only if you also have (or had) a salaried job this calendar year. 0 if none.",
        more: "Why a freelance form asks about your day job: income tax in Germany is calculated on your TOTAL income. If you employ-and-freelance in parallel (very common), the Finanzamt combines both to set fair advance payments — otherwise you'd get a nasty surprise at your first tax return.\nEnter the gross yearly amount (before taxes) from your employment this calendar year — your Brutto from the work contract, roughly. An estimate is fine here too.\nPure freelancer with no job? Enter 0 and move on." },
      { key: "employmentY2", label: "Employment income next year (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit, Folgejahr", type: "euro", explain: "0 if none." },
      { key: "sonderausgabenY1", label: "Special expenses this year (€) — e.g. health insurance", deLabel: "Sonderausgaben", type: "euro",
        explain: "Mainly your own health and pension insurance contributions. Your own estimate — we can't advise on the amount.",
        more: "Sonderausgaben is bureaucratic German for “special expenses” — mainly what you pay for your own health insurance and pension contributions per year.\nMechanically: amounts here reduce the income your advance payments are calculated on. Whatever you enter now, the real numbers get sorted out in your annual tax return — this field only tunes the advance-payment estimate.\nAs a rough orientation of what belongs here: freelancers pay their health insurance themselves (public insurers often charge several hundred euros a month), and that yearly total is exactly the kind of number this field is about. If you genuinely don't know yet, the field tolerates that too — it changes timing, not your final tax." },
      { key: "sonderausgabenY2", label: "Special expenses next year (€)", deLabel: "Sonderausgaben, Folgejahr", type: "euro", explain: "" },
      { key: "confirmEuer", label: "Profit method: will you use simple cash-basis accounting (EÜR)?", deLabel: "Gewinnermittlungsart — Einnahmenüberschussrechnung", type: "boolean", required: true, decision: true,
        explain: "EÜR means you record income and expenses when money actually flows — no double-entry bookkeeping, no balance sheet. Which method fits your business is your choice.",
        more: "Einnahmenüberschussrechnung — 30 letters for “money in minus money out”. German bureaucracy has a gift for names.\nWhat Yes (EÜR) means: you track income when it arrives and expenses when you pay them. One list, once a year, done. It's the simple method open to freelancers without commercial bookkeeping duties, and the one the famous Excel sheet was invented for.\nWhat No (Bilanzierung) means: voluntary double-entry accounting with balance sheets — a setup that usually involves accounting software and often a Steuerberater. Some businesses choose it deliberately (e.g. for investor reporting); it's a different world, and this assistant honestly doesn't cover it.\nThis is your call to make — we describe the mechanics, you know your business." },
      { key: "deviatingFiscalYear", label: "Does your business year differ from the calendar year?", deLabel: "Abweichendes Wirtschaftsjahr", type: "boolean", required: true,
        explain: "Only relevant if you have (or will request) a business year that differs from the calendar year — this requires Finanzamt approval. If you haven't arranged anything like that, the factual answer is no.",
        more: "What this even is: some businesses close their books on, say, June 30 instead of December 31 — a “deviating fiscal year”. It requires explicit Finanzamt approval and exists mainly for certain trades and agricultural businesses.\nWhat Yes means: you already have (or are formally requesting) such an approved arrangement. You'd know — there'd be paperwork.\nWhat No means: your business year is the calendar year, like the January-to-December world the rest of us live in.\nIf this is the first time you've heard the phrase “abweichendes Wirtschaftsjahr”, the factual answer to this question is no." },
    ],
  },
  {
    id: "vat", title: "VAT (Umsatzsteuer)", sub: "The section people worry about most. We explain every option in plain English — you decide.",
    fields: [
      { key: "currentlyVatRegistered", label: "Are you currently VAT-registered at a German Finanzamt?", deLabel: "Aktuell umsatzsteuerlich geführt", type: "boolean", required: true,
        explain: "Yes only if a German Finanzamt already manages VAT for you (you'd have an existing USt file and tax number for it).",
        more: "What Yes means: somewhere in Germany a Finanzamt already runs a VAT (Umsatzsteuer) file under your name — from an earlier business, for example. ELSTER will then ask follow-up questions about that existing registration (which office, which number) that this assistant doesn't cover — have those old documents ready.\nWhat No means: you're VAT-new. The standard case for a first-time founder.\nNot the same thing: having paid VAT as a CUSTOMER (everyone does, it's in every supermarket receipt) or having had VAT deducted on invoices you received. The question is whether you were registered as a BUSINESS for VAT." },
      { key: "revenueY1", label: "Estimated total REVENUE this year (€)", deLabel: "Summe der Umsätze, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Revenue = everything you invoice, before any expenses. This is a different number from the profit you entered earlier.",
        more: "Third number the form wants, and yes, it's different from the last two. Revenue (Umsatz) = the total of everything you will invoice this year, before subtracting a single cost. Profit was income MINUS expenses; revenue is the raw top line.\nWhy it matters twice: (1) it feeds the VAT section's math, and (2) it determines whether you're even ELIGIBLE for the Kleinunternehmer option below — the €25,000 founding-year limit is measured against exactly this number.\nSame estimate rules as before: honest guess, correctable later, and the sale that actually happens always beats the forecast." },
      { key: "revenueY2", label: "Estimated revenue next year (€)", deLabel: "Summe der Umsätze, Folgejahr", type: "euro", required: true, decision: true, explain: "" },
      { key: "kleinunternehmer", label: "Kleinunternehmer-Regelung (§ 19 UStG) — use it or not?", deLabel: "Kleinunternehmer-Regelung", type: "select", required: true, decision: true,
        options: [
          { value: "yes", label: "Use it — I will NOT charge VAT" },
          { value: "no",  label: "Don't use it — I WILL charge VAT" },
        ],
        explain: "The small-business scheme (§ 19 UStG) — the one genuine decision in this form. Read the full explanation before choosing.",
        more: "This is the question everyone googles at 1am, so let's take it slowly.\nTHE LIMITS (fixed by law, § 19 UStG): previous calendar year ≤ €25,000 revenue and current year ≤ €100,000. In your founding year there IS no previous year — so the €25,000 limit applies to your actual founding-year revenue, and the sale that crosses it is already subject to regular VAT from that moment on.\nOPTION 1 — use it (“I will NOT charge VAT”): your invoices carry no VAT and a small note citing §19 UStG · no VAT returns for these sales · but you also CANNOT reclaim the VAT you pay on business purchases (laptop, software, desk — the 19% inside those prices stays your cost).\nOPTION 2 — don't use it (“I WILL charge VAT”): you add VAT (usually 19%) to every invoice · you file VAT returns (Umsatzsteuer-Voranmeldungen — more paperwork, welcome to Germany) · and you reclaim the VAT on your business purchases.\nTHE HONEST PART: which option wins depends on who your clients are (businesses reclaim your VAT anyway; private customers feel it as a price increase), how big your costs are, and your plans. That judgement is exactly the individual tax advice we are legally not allowed to give — and we take that seriously, so we don't. If you're unsure, ELSTER's help text for field 131 and a Steuerberater exist for precisely this moment.\nWhatever you choose, your answer sheet shows the exact ELSTER entry for it — and the choice is changeable in later years, so it's a decision, not a tattoo." },
      { key: "vatBalance", label: "Estimated VAT payable this year (€)", deLabel: "Voraussichtliche Umsatzsteuer-Zahllast", type: "euro", showIf: f => f.kleinunternehmer === false, required: f => f.kleinunternehmer === false,
        explain: "Rough estimate: the VAT you will charge minus the VAT you pay on purchases. Your own estimate — the final amount is always settled through your VAT returns.",
        more: "The math behind it: you'll collect VAT on your invoices (19% of revenue, usually) and pay VAT inside your business purchases. Zahllast = collected minus paid — what you expect to forward to the state this year.\nA back-of-envelope version is genuinely enough: 19% of your revenue estimate, minus roughly 19% of your expected purchases. The real amounts get settled through your regular VAT returns anyway — this field just gives the Finanzamt a first idea of scale." },
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
  if (stepId === "activity" && f.isNewFounding === false) {
    return "This assistant currently covers new foundings (Neugründung) only. For a business takeover (Übernahme) or relocation (Verlegung), please use ELSTER's own help or a Steuerberater.";
  }
  if (stepId === "estimates" && f.confirmEuer === false) {
    return "This assistant covers cash-basis accounting (EÜR) only. If you plan double-entry accounting (Bilanzierung), please use ELSTER directly or a Steuerberater.";
  }
  if (stepId === "identity" && f.steuerId && !validateSteuerId(f.steuerId)) {
    return "The tax ID (Identifikationsnummer) must be exactly 11 digits.";
  }
  if (stepId === "identity" && f.married && f.spouseSteuerId && !validateSteuerId(f.spouseSteuerId)) {
    return "Your spouse's tax ID must be exactly 11 digits (or leave it empty).";
  }
  if (stepId === "bank" && f.iban && !validateIBAN(f.iban)) {
    return "This IBAN doesn't pass the checksum — please double-check it.";
  }
  if (stepId === "bank" && f.iban && !f.iban.replace(/\s/g, "").toUpperCase().startsWith("DE")) {
    return "This form field expects a German IBAN (starting with DE).";
  }
  return "";
}
