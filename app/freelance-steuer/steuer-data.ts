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
  explain: string;            // neutral English explanation
  decision?: boolean;         // renders the your-decision banner
  showIf?: (f: SteuerForm) => boolean;
  required?: boolean | ((f: SteuerForm) => boolean);
};

export type StepDef = { id: string; title: string; sub: string; fields: FieldDef[] };

export const STEUER_STEPS: StepDef[] = [
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
        explain: "Your job title, in German if possible. Short and factual — e.g. “Softwareentwickler”, “Fotografin”, “Übersetzer”. If you do several things, name the main one or write “mehrere” (several)." },
    ],
  },
  {
    id: "identity", title: "Your tax identity", sub: "The numbers and statuses the Finanzamt already knows you by.",
    fields: [
      { key: "steuerId", label: "Tax ID (Steuerliche Identifikationsnummer)", deLabel: "Identifikationsnummer", type: "text", required: true, placeholder: "11 digits, e.g. 12345678995",
        explain: "The 11-digit number you received by post a few weeks after your Anmeldung. It is on the letter from the Bundeszentralamt für Steuern and on every income-tax document. It is NOT the same as a Steuernummer. If you never received it, you can request it at bzst.de — you cannot submit the Fragebogen without it." },
      { key: "hasIncomeTaxNumber", label: "Have you ever had a German income-tax number (Steuernummer)?", deLabel: "Einkommensteuernummer", type: "boolean", required: true,
        explain: "If you answer no, the form entry is “wird neu beantragt” (will be newly requested) — the Finanzamt then assigns you one after processing." },
      { key: "incomeTaxNumber", label: "Your existing Steuernummer", deLabel: "Einkommensteuernummer", type: "text", showIf: f => f.hasIncomeTaxNumber, required: f => f.hasIncomeTaxNumber, placeholder: "e.g. 49/099/01230",
        explain: "The format looks like 12/345/67890 and is on previous letters from a Finanzamt." },
      { key: "religion", label: "Church tax status", deLabel: "Religion", type: "select", required: true,
        options: [
          { value: "none", label: "No church-tax-liable membership (nicht kirchensteuerpflichtig)" },
          { value: "rk", label: "Roman Catholic (römisch-katholisch)" },
          { value: "ev", label: "Protestant (evangelisch)" },
          { value: "other", label: "Member of another church-tax-collecting community" },
        ],
        explain: "Membership in a religious community that collects church tax in Germany triggers church tax of 8–9% of your income tax. That's mainly the Catholic and Protestant churches, but also some others — e.g. Jewish communities (jüdische Kultusgemeinden) and the Old Catholic Church (altkatholisch). If you belong to one of those others, pick the last option and select your exact community from ELSTER's own list. If you are not a member of any church-tax-collecting community — whatever your faith — the entry is “nicht kirchensteuerpflichtig”. This field states a fact about your membership; it does not change your faith." },
      { key: "married", label: "Are you married or in a registered partnership?", deLabel: "Familienstand", type: "boolean", required: true,
        explain: "If yes, ELSTER shows an additional subsection asking for your spouse's/partner's basic data inside “Allgemeine Angaben”. These spouse fields carry no printed field numbers in the summary — your answer sheet marks them clearly so you recognise the subsection." },
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
        explain: "If yes, ELSTER asks for the move-in date and your previous address. For most people who just arrived in Germany, the previous address is abroad — enter it as it was." },
      { key: "movedDate", label: "Move-in date", deLabel: "Zugezogen am", type: "date", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months,
        explain: "The date on your Anmeldung confirmation (Anmeldebestätigung)." },
      { key: "prevStreet", label: "Previous street", deLabel: "Straße (bisherige Adresse)", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months, explain: "" },
      { key: "prevHouseNo", label: "Previous house number", deLabel: "Hausnummer", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevPlz", label: "Previous postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.movedWithin12Months, explain: "" },
      { key: "prevCity", label: "Previous city (and country if abroad)", deLabel: "Wohnort", type: "text", showIf: f => f.movedWithin12Months, required: f => f.movedWithin12Months,
        explain: "e.g. “London, Vereinigtes Königreich”." },
      { key: "taxRegisteredBefore", label: "Were you registered for German income tax in the last 3 years?", deLabel: "Steuerlich erfasst in den letzten 3 Jahren", type: "boolean", required: true,
        explain: "Only yes if a German Finanzamt has processed your income tax before (e.g. you were employed here in a previous stay and filed a return)." },
      { key: "prevTaxNumber", label: "That previous tax number", deLabel: "Steuernummer", type: "text", showIf: f => f.taxRegisteredBefore, required: f => f.taxRegisteredBefore, explain: "" },
    ],
  },
  {
    id: "activity", title: "Your freelance activity", sub: "What you do, from when, and from where.",
    fields: [
      { key: "activityDesc", label: "Describe your activity (in German)", deLabel: "Art der Tätigkeit — genaue Bezeichnung", type: "text", required: true, placeholder: "e.g. Softwareentwicklung für Webanwendungen",
        explain: "One precise line. The Finanzamt uses this to classify your activity, which can affect whether it counts as freiberuflich (liberal profession) or gewerblich (trade) — that classification is made by the Finanzamt based on your description of the actual work. Describe what you really do, specifically: “Entwicklung von Websoftware” is more precise than “IT”." },
      { key: "isNewFounding", label: "Is this a brand-new activity you are founding yourself?", deLabel: "Gründungsart — Neugründung", type: "boolean", required: true,
        explain: "This assistant covers new foundings (Neugründung) only. Taking over an existing business (Übernahme) or relocating one (Verlegung) triggers different ELSTER questions that this wizard doesn't cover." },
      { key: "businessAddrIsHome", label: "Do you work from your home address?", deLabel: "Anschrift des Unternehmens entspricht Wohnanschrift", type: "boolean", required: true,
        explain: "If yes, ELSTER has a checkbox for “business address equals home address” — no extra typing." },
      { key: "bizStreet", label: "Business street", deLabel: "Straße", type: "text", showIf: f => f.businessAddrIsHome === false, required: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizHouseNo", label: "Business house number", deLabel: "Hausnummer", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizPlz", label: "Business postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizCity", label: "Business city", deLabel: "Ort", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "activityStart", label: "When did/will your activity start?", deLabel: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", type: "date", required: true,
        explain: "Including preparation: the day you started setting things up (buying equipment, signing contracts, building your website for clients) counts, not just your first invoice. You must submit this Fragebogen within ONE MONTH of this date (§138 AO)." },
      { key: "foundingDate", label: "Founding date (usually the same)", deLabel: "Gründungsdatum", type: "date",
        explain: "For a simple solo start this is normally the same date as above. If you leave it empty, your answer sheet repeats the start date." },
      { key: "priorBusiness", label: "In the last 5 years: any business, freelance work, or ≥1% company shareholding — in Germany or abroad?", deLabel: "Bisherige betriebliche Verhältnisse", type: "boolean", required: true,
        explain: "A factual yes/no. Yes does not block anything — the Finanzamt just wants the history." },
    ],
  },
  {
    id: "bank", title: "Bank account", sub: "Where tax refunds go.",
    fields: [
      { key: "iban", label: "Your IBAN (German bank account)", deLabel: "IBAN (inländisches Geldinstitut)", type: "text", required: true, placeholder: "DE00 0000 0000 0000 0000 00",
        explain: "This field of the form expects a German (DE) IBAN for refunds. We validate the checksum locally in your browser — the number is never sent to us." },
      { key: "accountHolderIsSelf", label: "Is the account in your name?", deLabel: "Kontoinhaber(in)", type: "boolean", required: true,
        explain: "If yes, ELSTER's option “der/die Steuerpflichtige” (the taxpayer) applies." },
      { key: "accountHolderName", label: "Account holder's name", deLabel: "Kontoinhaber(in)", type: "text", showIf: f => f.accountHolderIsSelf === false, required: f => f.accountHolderIsSelf === false, explain: "" },
    ],
  },
  {
    id: "estimates", title: "Income estimates", sub: "Honest guesses are expected — nobody can predict a first year exactly.",
    fields: [
      { key: "profitY1", label: "Estimated freelance PROFIT — this year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Profit = income minus business expenses, NOT your revenue. The Finanzamt uses these estimates to set your quarterly advance income-tax payments (Vorauszahlungen): a higher estimate means higher advance payments now (refunded later if you earn less), a lower estimate means lower advance payments now (with a back-payment later if you earn more). Estimates can be corrected later by writing to your Finanzamt. What to enter is your own honest estimate — we cannot advise you on the amount." },
      { key: "profitY2", label: "Estimated profit — next year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Folgejahr", type: "euro", required: true, decision: true,
        explain: "Same logic for the first full calendar year." },
      { key: "employmentY1", label: "Employment income this year, if any (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit", type: "euro",
        explain: "Only if you also have (or had) a salaried job this calendar year. 0 if none." },
      { key: "employmentY2", label: "Employment income next year (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit, Folgejahr", type: "euro", explain: "0 if none." },
      { key: "sonderausgabenY1", label: "Special expenses this year (€) — e.g. health insurance", deLabel: "Sonderausgaben", type: "euro",
        explain: "Mainly your own health and pension insurance contributions. Amounts entered here reduce the income your advance payments are based on; whatever you enter, your final tax is always settled with your annual return. Your own estimate — we can't advise on the amount." },
      { key: "sonderausgabenY2", label: "Special expenses next year (€)", deLabel: "Sonderausgaben, Folgejahr", type: "euro", explain: "" },
      { key: "confirmEuer", label: "Profit method: will you use simple cash-basis accounting (EÜR)?", deLabel: "Gewinnermittlungsart — Einnahmenüberschussrechnung", type: "boolean", required: true, decision: true,
        explain: "EÜR (Einnahmenüberschussrechnung) means you record income and expenses when money actually flows — no double-entry bookkeeping, no balance sheet. It is the method open to freelancers without commercial bookkeeping duties. The alternative — voluntary double-entry accounting with a balance sheet (Bilanzierung) — is a different setup this assistant doesn't cover. Which one fits your business is your choice." },
      { key: "deviatingFiscalYear", label: "Does your business year differ from the calendar year?", deLabel: "Abweichendes Wirtschaftsjahr", type: "boolean", required: true,
        explain: "Only relevant if you have (or will request) a business year that differs from the calendar year — this requires Finanzamt approval. If you haven't arranged anything like that, the factual answer is no." },
    ],
  },
  {
    id: "vat", title: "VAT (Umsatzsteuer)", sub: "The section people worry about most. We explain every option in plain English — you decide.",
    fields: [
      { key: "currentlyVatRegistered", label: "Are you currently VAT-registered at a German Finanzamt?", deLabel: "Aktuell umsatzsteuerlich geführt", type: "boolean", required: true,
        explain: "Yes only if a German Finanzamt already manages VAT for you (you'd have an existing USt file and tax number for it). If yes: ELSTER asks follow-up questions about that existing registration which this assistant doesn't cover — have those documents ready." },
      { key: "revenueY1", label: "Estimated total REVENUE this year (€)", deLabel: "Summe der Umsätze, Jahr der Betriebseröffnung", type: "euro", required: true, decision: true,
        explain: "Revenue = everything you invoice, before any expenses. This is a different number from the profit you entered earlier. Your revenue estimate also determines whether you are ELIGIBLE for the Kleinunternehmer option below." },
      { key: "revenueY2", label: "Estimated revenue next year (€)", deLabel: "Summe der Umsätze, Folgejahr", type: "euro", required: true, decision: true, explain: "" },
      { key: "kleinunternehmer", label: "Kleinunternehmer-Regelung (§ 19 UStG) — use it or not?", deLabel: "Kleinunternehmer-Regelung", type: "select", required: true, decision: true,
        options: [
          { value: "yes", label: "Use it — I will NOT charge VAT" },
          { value: "no",  label: "Don't use it — I WILL charge VAT" },
        ],
        explain: "The small-business scheme (§ 19 UStG). The legal limits are fixed: previous calendar year ≤ €25,000 and current year ≤ €100,000. In your founding year there is no previous year — the €25,000 limit then applies to your actual founding-year revenue, and the sale that crosses it is already subject to regular VAT from that moment.\nUsing it means: no VAT on your invoices · no VAT returns for these sales · no reclaiming the VAT you pay on business purchases.\nNot using it means: you add VAT (usually 19%) to invoices · file VAT returns · reclaim input VAT.\nWhich is better depends on who your clients are, your costs, and your plans — that judgement is exactly what we are not allowed to make for you, and we don't. If you are unsure, read ELSTER's help text for field 131 or ask a Steuerberater. Whatever you choose here, your answer sheet shows the exact entry." },
      { key: "vatBalance", label: "Estimated VAT payable this year (€)", deLabel: "Voraussichtliche Umsatzsteuer-Zahllast", type: "euro", showIf: f => f.kleinunternehmer === false, required: f => f.kleinunternehmer === false,
        explain: "Rough estimate: the VAT you will charge minus the VAT you pay on purchases. Your own estimate — the final amount is always settled through your VAT returns." },
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
