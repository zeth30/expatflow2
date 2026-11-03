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
//  PERSONAL-USE VERSION (2026-11): this route sits behind a password and is
//  used only by the founder, so fields may carry personalised `tip`s and
//  step `tips` that do recommend. Before any public launch, the
//  explain-never-recommend rule (spec §2, StBerG) must be re-applied.
//  Facts in tips still have to be correct — they are acted on.
//
//  GEWERBE (trade) extension, verified 2026-11-03:
//  - GewA 1 field numbers 1–33: official form, Anlage 1 GewAnzV
//    (gesetze-im-internet.de/gewanzv_2014/anlage_1.html, BGBl. I 2024 version)
//  - §14 Abs. 1 GewO: register the trade "gleichzeitig" with starting it
//  - §192 Abs. 1 SGB VII: the Gewerbeanzeige counts as the notification to
//    the accident insurer (Berufsgenossenschaft) — no separate one-week duty
//  - §3 Abs. 3 IHKG: sole traders not in the Handelsregister with trade
//    profit ≤ €5,200 pay no IHK contribution; founders without business
//    income in the 5 prior years: first 2 years free if profit ≤ €25,000
//  - §11 Abs. 1 GewStG: €24,500 trade-tax allowance for natural persons
//  - Gewerbe fees vary by city: state NO amount.
// ═══════════════════════════════════════════════════════════════════

export type Goal = "" | "fulltime" | "side" | "explore";
export type WorkType = "" | "liberal" | "trade" | "both" | "unsure";
export type Clients = "" | "business" | "private" | "abroad" | "mixed";

export type SteuerForm = {
  // ── Meta: your plan (wizard step 1, not ELSTER fields — drive the tips) ──
  goal: Goal;
  workType: WorkType;
  sellsGoods: boolean | null;   // follow-up when workType is "unsure"
  clients: Clients;
  // ── Gewerbe-Anmeldung (GewA 1) — only when needsGewerbe(f) ──
  businessName: string;         // Feld 3 (optional trading name)
  gender: "" | "männlich" | "weiblich" | "divers" | "ohne Angabe"; // Feld 6
  birthName: string;            // Feld 7 (only if different)
  birthPlace: string;           // Feld 9 Geburtsort und -land
  citizenship: string;          // Feld 10 — "deutsch" or other, in German
  phone: string; email: string; website: string; // Feld 11/15 contact
  gewActivity: string;          // Feld 18 Angemeldete Tätigkeit
  nebenerwerb: boolean | null;  // Feld 19
  gewArt: "" | "Industrie" | "Handwerk" | "Handel" | "Sonstiges"; // Feld 21
  salesChannel: "" | "online" | "dropship" | "offline"; // not on GewA 1 — drives the after-registration duties
  supplierRegion: "" | "de" | "eu" | "nonEu"; // where the goods come from — customs/import VAT
  salesRegion: "" | "de" | "eu"; // where customers sit — OSS
  staffFull: string; staffPart: string; // Feld 22 (empty = keine)
  permitNeeded: boolean | null; permitDetails: string;      // Feld 28
  handwerkA: boolean | null; handwerkDetails: string;       // Feld 29
  needsResidencePermit: boolean | null; residenceDetails: string; // Feld 30
  residenceRestriction: boolean | null; residenceRestrictionText: string; // Feld 31
  // ── Meta: ELSTER readiness (not an ELSTER form field) ──
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
  goal: "", workType: "", sellsGoods: null, clients: "",
  businessName: "", gender: "", birthName: "", birthPlace: "", citizenship: "",
  phone: "", email: "", website: "", gewActivity: "", nebenerwerb: null, gewArt: "", salesChannel: "", supplierRegion: "", salesRegion: "",
  staffFull: "", staffPart: "", permitNeeded: null, permitDetails: "",
  handwerkA: null, handwerkDetails: "", needsResidencePermit: null, residenceDetails: "",
  residenceRestriction: null, residenceRestrictionText: "",
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

// Sample persona for the simulator's demo mode (mirrors the captured
// fseeun-202401 sample in the design spec — no real person).
export const DEMO_STEUER: SteuerForm = {
  ...EMPTY_STEUER,
  goal: "side", workType: "liberal", clients: "mixed", needsResidencePermit: false,
  hasElsterAccount: true,
  anrede: "Frau", firstName: "Lisa", lastName: "Meyer",
  birthDate: "2000-03-19", profession: "Schwimmtrainerin",
  steuerId: "12345678995", hasIncomeTaxNumber: false, religion: "none",
  married: false,
  street: "Melanchthonstraße", houseNo: "31", houseNoSuffix: "a", plz: "33615", city: "Bielefeld",
  movedWithin12Months: true, movedDate: "2025-12-01",
  prevStreet: "Uwe-Seeler-Allee", prevHouseNo: "9", prevPlz: "22525", prevCity: "Hamburg",
  taxRegisteredBefore: true, prevTaxNumber: "49/099/01230",
  activityDesc: "Schwimmtraining in Vereinen", isNewFounding: true, businessAddrIsHome: true,
  activityStart: "2026-03-01", foundingDate: "2026-03-01", priorBusiness: false,
  iban: "DE03200000000020001530", accountHolderIsSelf: true,
  profitY1: "1500", profitY2: "3900", employmentY1: "10800", employmentY2: "10800",
  sonderausgabenY1: "2500", sonderausgabenY2: "2500",
  confirmEuer: true, deviatingFiscalYear: false,
  currentlyVatRegistered: false, revenueY1: "4800", revenueY2: "7200",
  kleinunternehmer: true, vatBalance: "",
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

// Trade registration needed: pure trade, freelance + trade, or "unsure" but selling goods
export const needsGewerbe = (f: SteuerForm): boolean =>
  f.workType === "trade" || f.workType === "both" || (f.workType === "unsure" && f.sellsGoods === true);

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
// Types live in the shared form engine; re-exported for existing imports.
export type { AnswerRow, AnswerSection, FieldDef as EngineFieldDef } from "../components/form-engine/types";
import type { AnswerRow, AnswerSection } from "../components/form-engine/types";

export function buildGewerbeRows(f: SteuerForm): AnswerSection {
  const empty = (nr: string, label: string, en: string): AnswerRow => ({ nr, label, de: "leer lassen", instruction: true, enHint: en });
  const addr = `${f.street} ${f.houseNo}${f.houseNoSuffix}, ${f.plz} ${f.city}`;
  const contact = [f.phone && `Tel. ${f.phone}`, f.email, f.website].filter(Boolean).join(" · ");
  const yesNo = (v: boolean | null, details: string) => v ? `ja — ${details}` : "nein";
  const rows: AnswerRow[] = [
    empty("1–2", "Registereintrag (Handelsregister o. ä.)", "Only for registered companies — as a sole trader not in the Handelsregister, leave empty"),
    f.businessName ? { nr: "3", label: "Name des Geschäfts", de: f.businessName, enHint: "Your trading name" } : empty("3", "Name des Geschäfts", "No separate trading name — leave empty"),
    { nr: "4", label: "Name", de: f.lastName, enHint: "Last name" },
    { nr: "5", label: "Vornamen", de: f.firstName, enHint: "First name(s)" },
    { nr: "6", label: "Geschlecht", de: `Kästchen „${f.gender}“ ankreuzen`, instruction: true, enHint: "Tick the matching box (as in your birth certificate)" },
    f.birthName ? { nr: "7", label: "Geburtsname", de: f.birthName, enHint: "Birth name" } : empty("7", "Geburtsname", "Same as your name — leave empty"),
    { nr: "8", label: "Geburtsdatum", de: fmtDateDE(f.birthDate), enHint: "Date of birth" },
    { nr: "9", label: "Geburtsort und -land", de: f.birthPlace, enHint: "Place and country of birth" },
    f.citizenship.trim().toLowerCase() === "deutsch"
      ? { nr: "10", label: "Staatsangehörigkeit(en)", de: "Kästchen „deutsch“ ankreuzen", instruction: true, enHint: "Tick “deutsch”" }
      : { nr: "10", label: "Staatsangehörigkeit(en) — andere", de: f.citizenship, enHint: "Your citizenship, in German" },
    { nr: "11", label: "Anschrift der Wohnung", de: addr, enHint: "Home address" },
    ...(contact ? [{ nr: "11", label: "Telefon / E-Mail / Internet", de: contact, enHint: "Contact details (optional)" }] : []),
    empty("12–14", "Gesellschafter / öffentliche Hand / Betriebsleiter", "Only for companies — leave empty"),
    { nr: "15", label: "Betriebsstätte", de: f.businessAddrIsHome === false ? `${f.bizStreet} ${f.bizHouseNo}, ${f.bizPlz} ${f.bizCity}` : addr, enHint: f.businessAddrIsHome === false ? "Business premises" : "Business premises = your home address" },
    empty("16–17", "Hauptniederlassung / frühere Betriebsstätte", "Only for branches or relocations — leave empty"),
    { nr: "18", label: "Angemeldete Tätigkeit", de: f.gewActivity, enHint: "Registered activity — precise description" },
    { nr: "19", label: "Im Nebenerwerb?", de: f.nebenerwerb ? "ja" : "nein", enHint: f.nebenerwerb ? "Yes — side business" : "No — main occupation" },
    { nr: "20", label: "Datum des Beginns", de: fmtDateDE(f.activityStart), enHint: "Start date" },
    { nr: "21", label: "Art des angemeldeten Betriebes", de: `Kästchen „${f.gewArt}“ ankreuzen`, instruction: true, enHint: "Type of business" },
    { nr: "22", label: "Zahl der tätigen Personen (ohne Inhaber)", de: (f.staffFull || f.staffPart) ? `Vollzeit ${f.staffFull || 0}, Teilzeit ${f.staffPart || 0}` : "Kästchen „keine“ ankreuzen", instruction: !(f.staffFull || f.staffPart) || undefined, enHint: "People working with you, not counting yourself" },
    { nr: "23", label: "Die Anmeldung wird erstattet für", de: "Kästchen „eine Hauptniederlassung“ ankreuzen", instruction: true, enHint: "Your main (and only) establishment" },
    { nr: "25", label: "Grund", de: "Kästchen „Neugründung“ ankreuzen", instruction: true, enHint: "New founding" },
    empty("24, 26–27", "Reisegewerbe / früherer Inhaber / Unfallversicherung", "Only for travelling trades or takeovers — leave empty"),
    { nr: "28", label: "Liegt eine Erlaubnis vor?", de: f.permitNeeded ? yesNo(true, f.permitDetails) : "leer lassen (keine Erlaubnis nötig)", instruction: !f.permitNeeded || undefined, enHint: "Trade permit (only for regulated trades)" },
    ...(f.gewArt === "Handwerk" ? [{ nr: "29", label: "Handwerkskarte (Anlage A)", de: f.handwerkA ? yesNo(true, f.handwerkDetails) : "leer lassen (kein Anlage-A-Handwerk)", instruction: !f.handwerkA || undefined, enHint: "Craft card — only for licensed crafts (Anlage A)" }] : []),
    { nr: "30", label: "Liegt ein Aufenthaltstitel vor?", de: f.needsResidencePermit ? yesNo(true, f.residenceDetails) : "leer lassen (kein Aufenthaltstitel nötig)", instruction: !f.needsResidencePermit || undefined, enHint: "Residence permit — only for people who need one" },
    ...(f.needsResidencePermit ? [{ nr: "31", label: "Auflage zur Erwerbstätigkeit?", de: f.residenceRestriction ? `ja — ${f.residenceRestrictionText}` : "nein", enHint: "Any work-related condition in your permit" }] : []),
    { nr: "32–33", label: "Datum, Unterschrift", de: "beim Absenden / auf Papier unterschreiben", instruction: true, enHint: "Date and signature" },
  ];
  return { title: "Gewerbe-Anmeldung (GewA 1) — beim Gewerbeamt, ZUERST", titleEn: "Trade registration at your Gewerbeamt — do this first", rows };
}

export function buildAnswerRows(f: SteuerForm): AnswerSection[] {
  const sections: AnswerSection[] = [];
  if (needsGewerbe(f)) sections.push(buildGewerbeRows(f));

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

  // Trade (Gewerbe): ELSTER has a separate line "Einkünfte aus Gewerbebetrieb".
  // Its field number was NOT in the captured freelancer protocol — no guessing.
  const both = f.workType === "both" || (f.workType === "unsure" && f.sellsGoods === true);
  const trade = f.workType === "trade";
  const profitNr = trade ? "—" : both ? "107 / —" : "107";
  const profitLabel = trade ? "Einkünfte aus Gewerbebetrieb" : both ? "Einkünfte aus selbständiger Arbeit + Gewerbebetrieb" : "Einkünfte aus selbständiger Arbeit";
  const tradeHint = trade ? " — trade income: use ELSTER's line labelled “Gewerbebetrieb” (field number not verified)"
    : both ? " — you do both: split this total, freelance part in field 107, trade part in ELSTER's line “Gewerbebetrieb” (field number not verified)" : "";
  sections.push({
    title: "Festsetzung der Vorauszahlungen",
    titleEn: "Advance tax payments — your estimates",
    rows: [
      { nr: profitNr, label: `${profitLabel} — Jahr der Betriebseröffnung`, de: fmtEuro(f.profitY1), enHint: "Estimated PROFIT (income minus expenses), year 1" + tradeHint },
      { nr: profitNr, label: `${profitLabel} — Folgejahr`, de: fmtEuro(f.profitY2), enHint: "Estimated profit, year 2" + tradeHint },
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
// FieldDef/StepDef come from the shared form engine; aliased to the
// steuer form type so all copy in this file stays strongly typed.
import type { FieldDef as GenericFieldDef, StepDef as GenericStepDef } from "../components/form-engine/types";
import { requiredError } from "../components/form-engine/validation";
import { L, tr } from "./i18n";
export type FieldDef = GenericFieldDef<SteuerForm>;
export type StepDef = GenericStepDef<SteuerForm>;

// ── Tip helpers ─────────────────────────────────────────────────────
const num = (raw: string) => parseInt((raw || "").replace(/[^\d]/g, ""), 10) || 0;
const eur = (n: number) => L("€" + Math.round(n).toLocaleString("de-DE"), Math.round(n).toLocaleString("de-DE") + " €");
// Months covered in the founding year (start month to December, inclusive)
const monthsLeft = (iso: string) => iso ? 12 - (parseInt(iso.slice(5, 7), 10) || 1) + 1 : 12;
const fullYear = (y1: string, start: string) => {
  const v = num(y1), m = monthsLeft(start);
  return v && m < 12 ? String(Math.round(v / m * 12 / 100) * 100) : "";
};
const daysSince = (iso: string) => iso ? Math.floor((Date.now() - new Date(iso + "T12:00:00").getTime()) / 86400000) : 0;

function planTips(f: SteuerForm): string[] {
  const t: string[] = [];
  if (f.goal === "fulltime") {
    t.push("Health insurance is now your own job. Full-time freelancers pay their public (or private) health insurance themselves — sort it out before your start date, because Germany doesn't allow gaps.");
    t.push("Put roughly 30% of every payment you receive on a separate account for tax. The advance payments the Finanzamt sets from your estimates rarely cover everything, and the first annual return can bring a back-payment.");
    if (f.workType !== "trade") t.push("Creative or publishing work (design, writing, journalism, music, photography as art…)? Check the Künstlersozialkasse (KSK): if accepted, it pays about half of your health and pension contributions — like an employer would. Apply early, it takes a while.");
    if (f.workType !== "trade") t.push("Teaching or training without employees of your own? Those freelancers are usually obliged to pay into the public pension insurance (Deutsche Rentenversicherung) and must register there within three months of starting.");
  }
  if (f.goal === "side") {
    t.push("Look at your employment contract for a side-job clause (Nebentätigkeit). Many contracts require you to tell your employer — and working for a direct competitor is usually off-limits.");
    t.push("Your salary and your freelance profit are taxed together, so every freelance euro is taxed at your personal top rate. Put a generous share (30–40%) aside until your first annual return is through.");
    t.push("Your health insurance normally keeps running through your job as long as the freelancing stays clearly secondary — less time and less income than the job.");
  }
  if (f.goal === "explore") {
    t.push("Nothing here is sent anywhere. You can fill in everything, look at the result, and only submit in ELSTER once you've really started.");
    t.push("Once you do start (preparation counts — buying equipment, signing a first contract), you have one month to submit this form (§138 AO).");
  }
  if (f.needsResidencePermit === true) t.push("Before anything else: check your residence permit. Self-employment — freelance or Gewerbe — is only allowed if the extra sheet (Nebenbestimmungen) says something like “Selbständige Tätigkeit gestattet”. If it says “nicht gestattet”, or ties you to one employer, ask your Ausländerbehörde (Berlin: Landesamt für Einwanderung) for permission first and only start once you have it. This can take weeks, so ask early.");
  if (f.workType === "liberal") t.push("Sounds like a liberal profession (Freiberuf): no trade registration and no trade tax. The Finanzamt makes the final call from your activity description — so describe the work precisely.");
  if (f.workType === "liberal" || f.workType === "unsure") t.push("Careful with “consulting”: only the professions listed in the law (e.g. engineers, journalists, translators, teachers) and very similar work count as Freiberuf. General business, marketing, IT or AI consulting is often classified as Gewerbe. If you're unsure, registering a Gewerbe is the safe side: no Gewerbesteuer below €24,500 profit and no IHK fee below €5,200.");
  if (needsGewerbe(f) && (f.sellsGoods === true || f.gewArt === "Handel" || f.clients === "private" || f.clients === "mixed")) t.push("Only selling your own used things (clearing out your wardrobe or basement)? That's a private sale, no Gewerbe. As soon as you buy, print or produce goods in order to sell them, it is a Gewerbe.");
  if (f.workType === "trade") t.push("Sounds like a trade (Gewerbe): register at your local Gewerbeamt first (Gewerbeanmeldung, small fee, often online). The Gewerbeamt informs the Finanzamt, but you still submit this form yourself in ELSTER. Trade tax (Gewerbesteuer) only applies to yearly profit above the €24,500 allowance for sole traders.");
  if (f.workType === "both" || (f.workType === "unsure" && f.sellsGoods === true)) t.push("You do both — that's allowed and common. Germany treats them as two separate activities: the selling part (e.g. your own prints or products) is a Gewerbe and needs the Gewerbeanmeldung; the freelance part stays Freiberuf, without Gewerbesteuer. Keep the two clearly apart — separate invoices and records. If they can't be told apart, the Finanzamt classifies the whole thing by its main character.");
  if (f.workType === "unsure" && f.sellsGoods !== true) t.push("Rule of thumb: creative, academic, teaching, consulting and most IT work is freiberuflich (Freiberuf, no trade registration). Selling products, brokering and most crafts are Gewerbe (trade registration needed). The question below sorts out the most common mix-up.");
  if (f.clients === "abroad") t.push("Clients outside Germany follow their own VAT rules (for business clients often “reverse charge”, meaning no German VAT on your invoice). Check how to invoice them before your first cross-border invoice.");
  if (f.clients === "mixed") t.push("If any of your clients are outside Germany, their invoices follow different VAT rules (often “reverse charge”). If they're all in Germany, ignore this.");
  return t;
}

function kleinunternehmerTip(f: SteuerForm): string | null {
  const r1 = num(f.revenueY1);
  if (r1 > 25000) return L(`Your founding-year revenue estimate (${eur(r1)}) is above the €25,000 limit — the Kleinunternehmer scheme won't carry you through this year. Plan with charging VAT: “Don't use it”.`, `Deine Umsatzschätzung fürs Gründungsjahr (${eur(r1)}) liegt über der Grenze von 25.000 € — die Kleinunternehmerregelung trägt dich nicht durch dieses Jahr. Plane mit Umsatzsteuer: „Nicht nutzen“.`);
  if (f.clients === "business") return "Your clients are businesses: they get any VAT you charge refunded, so it costs them almost nothing — while you reclaim the 19% on your own laptop, software and equipment. Unless you want to avoid VAT returns at all costs, “Don't use it” is usually the better deal.";
  if (f.clients === "private" && f.supplierRegion === "nonEu") return L("Your customers are private people, who can't reclaim VAT — so “Use it” keeps your prices lower. But know the catch for importers: as a Kleinunternehmer you can't get back the import VAT and the reverse-charge VAT on ads and apps — they simply become costs. With high purchase volumes, “Don't use it” can work out cheaper.", "Deine Kunden sind Privatleute und können die Umsatzsteuer nicht zurückholen — „Nutzen“ hält deine Preise also niedriger. Aber der Haken für Importeure: Als Kleinunternehmer bekommst du die Einfuhrumsatzsteuer und die Reverse-Charge-Steuer auf Werbung und Apps nicht zurück — sie sind einfach Kosten. Bei hohen Einkaufsmengen kann „Nicht nutzen“ günstiger sein.");
  if (f.clients === "private") return "Your customers are private people, who can't reclaim VAT — 19% on top would simply make you more expensive. With revenue under €25,000, “Use it” keeps your prices lower and saves you the monthly or quarterly VAT returns.";
  return "If you're under €25,000 and unsure: “Use it” is the simpler start (no VAT returns), and you can switch to regular VAT in any later year. Choosing “Don't use it” binds you for 5 years — so only pick it if your clients are mainly businesses or you have big equipment costs.";
}

export const STEUER_STEPS: StepDef[] = [
  {
    id: "goal", title: "First: what's your plan?",
    sub: "A few quick questions about you. They decide which steps you see and which tips you get all the way through.",
    tips: planTips,
    fields: [
      { key: "goal", label: "What do you want to do?", deLabel: "Ihr Vorhaben", type: "choice", required: true,
        options: [
          { value: "fulltime", label: "Go freelance full-time", desc: "Freelancing becomes your main income." },
          { value: "side", label: "Freelance next to my job", desc: "You keep your employment and add freelance work." },
          { value: "explore", label: "Just exploring", desc: "Not started yet — you want to see what's involved." },
        ],
        explain: "Changes which tips you get — and which numbers matter most later." },
      { key: "workType", label: "What kind of work is it?", deLabel: "Art der Tätigkeit", type: "choice", required: true,
        options: [
          { value: "liberal", label: "Freiberuf: creative, IT, teaching", desc: "Design, software development, writing, translating, teaching, photography, journalism…" },
          { value: "trade", label: "Gewerbe: selling, services, crafts", desc: "Online shop, dropshipping, reselling, agency, business or AI consulting, crafts, gastronomy…" },
          { value: "both", label: "Both", desc: "e.g. design work for clients AND selling your own prints or products." },
          { value: "unsure", label: "Not sure", desc: "Something that doesn't fit neatly." },
        ],
        explain: "Germany splits self-employment into Freiberuf and Gewerbe — the difference decides whether you also need a trade registration (Gewerbeanmeldung) at the town's trade office (Gewerbeamt)." },
      { key: "sellsGoods", label: "Do you also sell physical products?", deLabel: "Verkauf von Waren", type: "boolean", showIf: f => f.workType === "unsure", required: f => f.workType === "unsure",
        explain: "For example your own prints, merch, handmade items, or anything you buy and resell — online or offline.",
        tip: f => f.sellsGoods === true ? "Then you'll need a Gewerbeanmeldung for the selling part — the wizard adds those steps for you." : f.sellsGoods === false ? "Then you're most likely a Freiberuf. Describe your work precisely later — the Finanzamt (tax office) makes the final call." : null },
      { key: "clients", label: "Who will pay you?", deLabel: "Ihre Kunden", type: "choice", required: true,
        options: [
          { value: "business", label: "Businesses in Germany", desc: "Companies, agencies, startups." },
          { value: "private", label: "Private people", desc: "Consumers, students, families." },
          { value: "abroad", label: "Mostly clients abroad", desc: "Companies or people outside Germany." },
          { value: "mixed", label: "A mix", desc: "Some of everything." },
        ],
        explain: "Matters most for the VAT decision at the end — businesses get VAT back, private people don't." },
      { key: "needsResidencePermit", label: "Do you need a residence permit to live in Germany?", deLabel: "Aufenthaltstitel", type: "boolean", required: true,
        explain: "EU, EEA and Swiss citizens: No. Everyone else: Yes. It matters for freelancers AND traders.",
        more: "This is the expat trap: the permit must ALLOW self-employment. Check the “Nebenbestimmungen” on your card or the extra sheet — phrases like “Selbständige Tätigkeit gestattet” are what you want; “Selbständige Tätigkeit nicht gestattet” means you need to ask the immigration office first.\nA job-bound work permit or a Blue Card tied to employment usually does NOT cover self-employment by itself. Side freelancing next to your job needs permission too." },
    ],
  },
  {
    id: "elster", title: "First things first: your ELSTER account",
    sub: "The finished form can only be submitted through Mein ELSTER, Germany's official tax portal. Everything in this wizard works without it — but the account takes up to two weeks (thanks to a letter), so let's check now.",
    fields: [
      { key: "hasElsterAccount", label: "Do you already have access to Mein ELSTER?", deLabel: "Mein ELSTER — Zertifikatsdatei", type: "boolean", required: true,
        explain: "Both answers are fine — you can prepare all your answers here either way.",
        tip: f => f.hasElsterAccount === false ? "Register at elster.de today, even before you finish here — the activation letter is the slowest part of the whole process (up to two weeks by post)." : null,
        more: "What Yes means: you can log in at elster.de with your certificate file (.pfx) and password. You're ready to transfer your answers the moment your sheet is done.\nWhat No means: no problem at all. Register today at elster.de (about 10 minutes online — the steps above show you every screen), and Germany mails you an activation code. The letter typically takes a few days up to two weeks. Yes, the online portal starts with a letter by post.\nThe good news: you don't have to wait. Prepare your entire answer sheet here now; it stays saved in your browser (plus your PDF), and when the letter arrives you'll transfer everything in ten minutes." },
    ],
  },
  {
    id: "gewerbe-intro", title: "Gewerbeanmeldung — the trade registration",
    sub: "Because you trade, there's a second form, and it comes FIRST: the Gewerbe-Anmeldung (form GewA 1) at your town's trade office (Gewerbeamt). Here's the whole route, then we fill it in.",
    showIf: needsGewerbe,
    fields: [],
  },
  {
    id: "gewerbe-person", title: "Gewerbe: about you", sub: "The person questions of GewA 1 that the tax form doesn't ask. Your name, birth date and address come in the tax part right after — you type them only once, they go on both forms.",
    showIf: needsGewerbe,
    fields: [
      { key: "gender", label: "Gender", deLabel: "Feld 6 — Geschlecht", type: "select", required: true,
        options: [ { value: "männlich", label: "male (männlich)" }, { value: "weiblich", label: "female (weiblich)" }, { value: "divers", label: "diverse (divers)" }, { value: "ohne Angabe", label: "not stated (ohne Angabe)" } ],
        explain: "The form says: as entered in your birth certificate." },
      { key: "birthName", label: "Birth name (only if different)", deLabel: "Feld 7 — Geburtsname", type: "text",
        explain: "Only if your name today differs from your name at birth, e.g. after marriage. Otherwise leave empty." },
      { key: "birthPlace", label: "Place and country of birth", deLabel: "Feld 9 — Geburtsort und -land", type: "text", required: true, placeholder: "e.g. Manchester, Vereinigtes Königreich",
        explain: "City plus country, ideally with the country in German (e.g. “Vereinigte Staaten”, “Indien”, “Brasilien”)." },
      { key: "citizenship", label: "Citizenship(s)", deLabel: "Feld 10 — Staatsangehörigkeit(en)", type: "text", required: true, placeholder: "e.g. britisch, indisch, deutsch",
        explain: "The adjective in German, lowercase: “britisch”, “amerikanisch”, “indisch”, “italienisch”. Type “deutsch” if you're German — the sheet then tells you to tick the box." },
      { key: "phone", label: "Phone (optional)", deLabel: "Feld 11 — (Mobil-)Telefonnummer", type: "text", explain: "Optional, but makes follow-up questions faster." },
      { key: "email", label: "Email (optional)", deLabel: "Feld 11 — E-Mail-Adresse", type: "text", explain: "" },
      { key: "website", label: "Website (optional)", deLabel: "Feld 11 — Internetadresse", type: "text", explain: "" },
      { key: "businessName", label: "Trading name (optional)", deLabel: "Feld 3 — Name des Geschäfts", type: "text", placeholder: "e.g. Kaffeerösterei Bohnenglück",
        explain: "Only if you'll trade under a shop or brand name. Sole traders must still show their full personal name on invoices.",
        tip: f => f.businessName ? "A trading name is fine, but it isn't a protected company name and can't contain “GmbH” or similar. Check it's not someone else's trademark before you print anything." : null },
    ],
  },
  {
    id: "gewerbe-business", title: "Gewerbe: your business", sub: "What you register, how big it is, and any permits.",
    showIf: needsGewerbe,
    fields: [
      { key: "gewActivity", label: "Registered activity, in German", deLabel: "Feld 18 — Angemeldete Tätigkeit", type: "text", required: true, placeholder: "e.g. Onlinehandel mit Bekleidung",
        explain: "As precise as possible — the form's own examples are “Herstellung von Möbeln”, “Elektroinstallationen und Elektroeinzelhandel”, “Großhandel mit Lebensmitteln”. With several activities, underline the main one.",
        tip: f => f.gewArt === "Sonstiges" ? "Service examples: “IT-Beratung und Entwicklung von KI-Anwendungen für Unternehmen”, “Online-Marketing-Dienstleistungen”, “Eventplanung”."
          : f.salesChannel === "dropship" ? "Dropshipping example: “Onlinehandel mit Wohnaccessoires (Streckengeschäft/Dropshipping)”."
          : f.gewArt === "Handel" ? "Retail examples: “Onlinehandel mit bedruckter Bekleidung (T-Shirts)”, “Einzelhandel mit Kunstdrucken”." : null,
        more: "This line decides a lot: which chamber you belong to (IHK or Handwerkskammer), whether a permit is needed, and whether a future expansion counts as a change you must report.\nWrite slightly broader than today's exact product so you don't have to re-register for every new idea — “Onlinehandel mit Bekleidung und Accessoires” rather than “Verkauf von T-Shirts”. But stay honest: activities that need a permit must be named as such.\nChanging or extending the activity later means a short Gewerbe-Ummeldung (§14 GewO)." },
      { key: "nebenerwerb", label: "Is it (for now) a side business?", deLabel: "Feld 19 — Im Nebenerwerb?", type: "boolean", required: true,
        explain: "Yes if you mainly do something else (a job, studies) and the trade comes on top.",
        suggest: f => f.goal === "side" ? { value: true, label: "Yes — next to your job" } : f.goal === "fulltime" ? { value: false, label: "No — it's your main income" } : null },
      { key: "gewArt", label: "Type of business", deLabel: "Feld 21 — Art des angemeldeten Betriebes", type: "choice", required: true,
        options: [
          { value: "Handel", label: "Handel", desc: "Buying and selling goods — shops, e-commerce, resale." },
          { value: "Handwerk", label: "Handwerk", desc: "Crafts and repairs — e.g. carpenter, hairdresser, electrician." },
          { value: "Industrie", label: "Industrie", desc: "Industrial production — rare for solo founders." },
          { value: "Sonstiges", label: "Sonstiges", desc: "Services and everything else — consulting, IT and AI services, agencies, brokering, events, cleaning…" },
        ],
        explain: "Pick the one that fits your main activity.",
        tip: f => f.gewArt === "Sonstiges" ? "Consulting, IT, AI and agency services need no permit. Permits are only for specific trades such as brokering property, loans or insurance, security services or financial advice." : f.gewArt === "Handwerk" ? "Crafts are split in two: the licensed crafts of Anlage A of the Handwerksordnung (e.g. electrician, hairdresser, roofer) need a master's qualification or exception and a Handwerkskarte from the Handwerkskammer before you start. Other crafts (Anlage B, e.g. tailoring, cosmetics) only need to be entered with the Handwerkskammer." : null },
      { key: "salesChannel", label: "How will you sell?", deLabel: "Vertriebsweg", type: "choice", showIf: f => f.gewArt === "Handel", required: f => f.gewArt === "Handel",
        options: [
          { value: "online", label: "Online, shipping myself", desc: "Own shop, Etsy, eBay, Amazon… — you pack and ship." },
          { value: "dropship", label: "Dropshipping", desc: "You sell online, a supplier ships directly to your customer." },
          { value: "offline", label: "In person", desc: "Markets, a shop, events — no shipping." },
        ],
        explain: "Not part of the form — it decides which shop duties show up on your to-do page at the end.",
        tip: f => f.salesChannel === "dropship" ? "With dropshipping you are legally the seller: warranty, returns and product safety are your responsibility, not the supplier's. Your to-do page lists what that means." : null },
      { key: "supplierRegion", label: "Where do your goods come from?", deLabel: "Herkunft der Waren", type: "choice", showIf: f => f.gewArt === "Handel", required: f => f.gewArt === "Handel",
        options: [
          { value: "de", label: "Germany", desc: "German wholesaler or supplier." },
          { value: "eu", label: "Another EU country", desc: "e.g. a supplier or warehouse in Poland, the Netherlands, Italy…" },
          { value: "nonEu", label: "Outside the EU", desc: "e.g. China (AliExpress, Alibaba, CJ), USA, Turkey, UK." },
        ],
        explain: "Not part of the form — decides whether customs, import VAT and EU VAT rules land on your to-do page.",
        tip: f => f.supplierRegion === "nonEu" ? L("Imports from outside the EU always mean import VAT, and since July 2026 also customs duty on small parcels. Your to-do page explains who pays what — work it into your prices from day one.", "Import aus Nicht-EU-Ländern heißt immer Einfuhrumsatzsteuer und seit Juli 2026 auch Zoll auf kleine Pakete. Deine To-do-Seite erklärt, wer was zahlt — rechne es von Anfang an in deine Preise ein.") : null },
      { key: "salesRegion", label: "Where are your customers?", deLabel: "Absatzgebiet", type: "choice", showIf: f => f.gewArt === "Handel" && (f.salesChannel === "online" || f.salesChannel === "dropship"), required: f => f.gewArt === "Handel" && (f.salesChannel === "online" || f.salesChannel === "dropship"),
        options: [
          { value: "de", label: "Germany only", desc: "You only ship to German addresses." },
          { value: "eu", label: "Also other EU countries", desc: "Your shop ships to Austria, France, the Netherlands…" },
        ],
        explain: "Not part of the form — decides whether the EU OSS rules show up on your to-do page." },
      { key: "staffFull", label: "People working with you full-time (not counting you)", deLabel: "Feld 22 — Vollzeit", type: "euro",
        explain: "Including temporary helpers and your spouse/partner if they work in the business. Leave empty if it's just you.",
        tip: f => !f.staffFull && !f.staffPart ? "Just you? Leave both empty — the sheet then says to tick “keine”." : "Employees bring their own duties (payroll, social insurance registration, an employer number from the Arbeitsagentur) — plan those before the first working day." },
      { key: "staffPart", label: "People working with you part-time", deLabel: "Feld 22 — Teilzeit", type: "euro", explain: "" },
      { key: "permitNeeded", label: "Does your trade need a permit?", deLabel: "Feld 28 — Liegt eine Erlaubnis vor?", type: "boolean", required: true,
        explain: "Only regulated trades — e.g. selling alcohol in a restaurant (Gaststättenerlaubnis), real-estate or loan brokering (§34c GewO), insurance brokering (§34d), security services (§34a), finance advice (§34f).",
        more: "Most trades need NO permit: online shops, resale, events, most services.\nIf yours does, you need the permit BEFORE you start — the form itself warns that the registration doesn't allow you to begin without it. You then enter the issue date and the authority that granted it.\nNot sure? Your Gewerbeamt tells you during registration — ask before you pay for anything.",
        suggest: f => f.gewArt === "Handel" ? { value: false, label: "No — normal retail needs no permit" } : null },
      { key: "permitDetails", label: "Permit: issue date and authority", deLabel: "Feld 28 — Ausstellungsdatum und erteilende Behörde", type: "text", showIf: f => f.permitNeeded === true, required: f => f.permitNeeded === true, explain: "" },
      { key: "handwerkA", label: "Licensed craft (Anlage A) — do you have a Handwerkskarte?", deLabel: "Feld 29 — Handwerkskarte", type: "boolean", showIf: f => f.gewArt === "Handwerk", required: f => f.gewArt === "Handwerk",
        explain: "Yes only if your craft is on Anlage A and the Handwerkskammer has issued your card. For Anlage B crafts answer No." },
      { key: "handwerkDetails", label: "Handwerkskarte: date and Handwerkskammer", deLabel: "Feld 29 — Ausstellungsdatum, Handwerkskammer", type: "text", showIf: f => f.handwerkA === true, required: f => f.handwerkA === true, explain: "" },
      { key: "residenceDetails", label: "Permit: issue date and authority", deLabel: "Feld 30 — Ausstellungsdatum und erteilende Behörde", type: "text", showIf: f => f.needsResidencePermit === true, required: f => f.needsResidencePermit === true, placeholder: "e.g. 12.03.2026, Landesamt für Einwanderung Berlin", explain: "" },
      { key: "residenceRestriction", label: "Does your permit have a condition about work?", deLabel: "Feld 31 — Auflage zur Erwerbstätigkeit", type: "boolean", showIf: f => f.needsResidencePermit === true, required: f => f.needsResidencePermit === true,
        explain: "Look at the conditions (Nebenbestimmungen) on your permit and copy the work-related one exactly.",
        tip: f => f.residenceRestriction === true ? "If the condition says self-employment is not allowed, don't register yet — apply to your immigration office for permission first." : null },
      { key: "residenceRestrictionText", label: "The condition, word for word", deLabel: "Feld 31 — Angabe der Auflage", type: "text", showIf: f => f.residenceRestriction === true, required: f => f.residenceRestriction === true, placeholder: "e.g. Selbständige Tätigkeit gestattet", explain: "" },
    ],
  },
  {
    id: "form", title: "What you're about to fill out",
    sub: "Nine short sections, all in German. Here's the map — and what Germany may ask you to send along with it. Two minutes, then we start.",
    // Content is rendered by the page (FORM_INTRO) — this step has no inputs.
    fields: [],
  },
  {
    id: "personal", title: "About you", sub: "Exactly as in your passport and Anmeldung.",
    fields: [
      { key: "anrede", label: "Salutation", deLabel: "Anrede", type: "select", required: true,
        options: [ { value: "Frau", label: "Frau (Ms)" }, { value: "Herr", label: "Herr (Mr)" }, { value: "keine Angabe", label: "No salutation (keine Angabe)" } ],
        explain: "ELSTER asks for a salutation. “Keine Angabe” means “no statement” and is a normal option.",
        suggest: f => f.gender === "männlich" ? { value: "Herr", label: "Herr (from your Gewerbe answers)" } : f.gender === "weiblich" ? { value: "Frau", label: "Frau (from your Gewerbe answers)" } : null },
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
        more: "Fair warning: Germany will give you up to three different tax-related numbers, and the names sound alike.\n1. Steuer-ID (this field) — 11 digits, yours for life, sent automatically after your Anmeldung. It's on the letter from the Bundeszentralamt für Steuern.\n2. Steuernummer — assigned by your local Finanzamt for your tax file. As a new freelancer you'll get one AFTER submitting this form. That's the number you'll later print on invoices.\n3. USt-IdNr. (VAT ID) — only relevant for certain cross-border business, and optional for many freelancers.\nFor this field you need number 1 only. Never received it? Request it at bzst.de — it's free, but it comes by post, so do it today." },
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
        more: "Yes, a German tax form really asks about your religion. The reason: Germany collects tax on behalf of certain religious communities — mainly the Catholic and Protestant churches, but also some others like Jewish communities (jüdische Kultusgemeinden) and the Old Catholic Church (altkatholisch). It's 8–9% of your income tax, collected automatically.\nWhat the options mean:\n· “No church-tax-liable membership” — you are not a registered member of any community that collects church tax in Germany. Your faith itself is irrelevant here; a practicing Muslim, Hindu or Buddhist typically enters this too, because those communities don't collect German church tax.\n· Roman Catholic / Protestant — you are a registered member (baptism usually counts, even from abroad).\n· “Member of another church-tax-collecting community” — pick your exact community from ELSTER's own dropdown list.\nGood to know: leaving a church later is a separate process (Kirchenaustritt) at a local office — depending on your state the Amtsgericht or the Standesamt, usually with a fee. This form only records your current status." },
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
    id: "activity", title: "Your activity", sub: "What you do, from when, and from where.",
    fields: [
      { key: "activityDesc", label: "Describe your activity (in German)", deLabel: "Art der Tätigkeit — genaue Bezeichnung", type: "text", required: true, placeholder: "e.g. Softwareentwicklung für Webanwendungen",
        explain: "One precise line, in German. Describe what you really do: “Entwicklung von Websoftware” is more precise than “IT”.",
        suggest: f => f.workType === "trade" && f.gewActivity ? { value: f.gewActivity, label: L(`“${f.gewActivity}” — same as your Gewerbeanmeldung`, `„${f.gewActivity}“ — wie in deiner Gewerbeanmeldung`) } : null,
        tip: f => needsGewerbe(f)
          ? (f.workType === "trade" ? "Use the same wording as on your Gewerbeanmeldung (Feld 18)." : "You do both: name both parts, e.g. “Grafikdesign (freiberuflich) und Onlinehandel mit Kunstdrucken”.")
          : "Good examples: “Softwareentwicklung für Webanwendungen”, “Grafikdesign und Illustration”, “Übersetzungen Englisch–Deutsch”, “Online-Sprachunterricht”. Name the activity, not your job title.",
        more: "This one line matters more than it looks. The Finanzamt reads it to classify your work as either freiberuflich (liberal profession — e.g. software development, design, writing, teaching, consulting) or gewerblich (trade/commerce). The difference decides whether you also need a Gewerbe registration (before you start) and may owe Gewerbesteuer.\nThe classification is the Finanzamt's call, based on what you actually do — not on which word you'd prefer. So the best strategy is simply precision: describe the real work. “Entwicklung und Wartung von Websoftware für Agenturen” tells them everything; “IT-Services” tells them nothing and invites follow-up questions.\nWriting it in German is expected. A clean dictionary translation of your honest description is completely fine — this is a description, not literature." },
      { key: "isNewFounding", label: "Is this a brand-new activity you are founding yourself?", deLabel: "Gründungsart — Neugründung", type: "boolean", required: true,
        explain: "This assistant covers new foundings (Neugründung) only. Taking over an existing business (Übernahme) or relocating one (Verlegung) triggers different ELSTER questions that this wizard doesn't cover.",
        more: "What Yes means: you're starting something of your own from scratch — the standard case for a new freelancer, and what ELSTER calls “Neugründung”.\nWhat No means: you're taking over an existing business (Übernahme), converting one (Umwandlung), or moving one from another town (Verlegung). Those unlock extra ELSTER sections about the previous business that we'd rather not half-explain — so this wizard honestly stops and points you to ELSTER's help or a Steuerberater instead of guessing.\nStarting the same kind of work you did as an employee still counts as a new founding — what matters is that the BUSINESS is new, not the skill." },
      { key: "businessAddrIsHome", label: "Do you work from your home address?", deLabel: "Anschrift des Unternehmens entspricht Wohnanschrift", type: "boolean", required: true,
        tip: f => needsGewerbe(f) && f.businessAddrIsHome === false ? "A separate shop or workshop may need its own permissions under building law — the Gewerbeanmeldung itself doesn't cover that." : null,
        explain: "If yes, ELSTER has a checkbox for “business address equals home address” — no extra typing.",
        more: "What Yes means: your desk is at home. Completely normal for freelancers — most start exactly like this, and it doesn't create any special obligations by itself.\nWhat No means: you rent a separate office, co-working desk with a fixed address, or studio — ELSTER wants that address as your business address.\nDon't confuse this with the home-office tax deduction debate — that's a topic for your future tax returns, not for this registration. Here the Finanzamt only wants to know where your business physically sits, mostly to confirm which Finanzamt is responsible for you." },
      { key: "bizStreet", label: "Business street", deLabel: "Straße", type: "text", showIf: f => f.businessAddrIsHome === false, required: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizHouseNo", label: "Business house number", deLabel: "Hausnummer", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizPlz", label: "Business postal code", deLabel: "Postleitzahl", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "bizCity", label: "Business city", deLabel: "Ort", type: "text", showIf: f => f.businessAddrIsHome === false, explain: "" },
      { key: "activityStart", label: "When did/will your activity start?", deLabel: "Beginn der Tätigkeit (inklusive Vorbereitungshandlungen)", type: "date", required: true,
        explain: "Including preparation: the day you started setting things up counts, not just your first invoice. You must submit this Fragebogen within ONE MONTH of this date (§138 AO).",
        tip: f => {
          const d = daysSince(f.activityStart);
          if (d > 31) return L(`That's ${d} days ago — past the one-month deadline. Don't change the date; just submit soon. A slightly late Fragebogen is routine, a wrong date is not.`, `Das ist ${d} Tage her — die Monatsfrist ist vorbei. Ändere das Datum nicht, reiche einfach bald ein. Ein etwas verspäteter Fragebogen ist Routine, ein falsches Datum nicht.`);
          if (d > 21) return "Your one-month deadline is close — aim to submit in ELSTER this week.";
          return null;
        },
        more: "Germany starts the clock earlier than you'd think. “Beginn der Tätigkeit” includes Vorbereitungshandlungen — preparation acts: buying your work laptop, signing a client contract, setting up the website you'll sell through. Not just the glamorous first invoice.\nWhy it matters: the one-month filing deadline (§138 AO) runs from this date. If your honest start date is further back than a month, don't panic and don't “adjust” the date — file now. A slightly late Fragebogen is routine; a false date on a tax form is not.\nThis date also tells the Finanzamt from when your business expenses can count — which is exactly why the definition includes preparation." },
      { key: "foundingDate", label: "Founding date (usually the same)", deLabel: "Gründungsdatum", type: "date",
        suggest: f => f.activityStart ? { value: f.activityStart, label: L(`same as your start date (${fmtDateDE(f.activityStart)})`, `wie dein Startdatum (${fmtDateDE(f.activityStart)})`) } : null,
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
        tip: () => "Not required, but worth it: a separate account just for your freelance money. It makes bookkeeping and the annual return far easier — and the tax money you put aside doesn't get spent by accident.",
        more: "Why the Finanzamt wants this: tax refunds and any SEPA direct debits go through this account. Good news first: this is how you get money BACK.\nThe form field is labelled “inländisches Geldinstitut” — domestic bank. Modern German online banks (N26, DKB, ING…) all give DE IBANs and are fine. If you only have a foreign account so far, ELSTER has a separate variant for foreign IBANs — but for this assistant we stick to the standard DE case, which is also the path of least friction with the Finanzamt.\nAbout the checksum: every IBAN contains a built-in error check (that's the two digits after DE). We verify it mathematically in your browser so a typo can't slip onto your sheet — the number itself never leaves your device." },
      { key: "accountHolderIsSelf", label: "Is the account in your name?", deLabel: "Kontoinhaber(in)", type: "boolean", required: true,
        suggest: () => ({ value: true, label: "Yes — your own account" }),
        explain: "If yes, ELSTER's option “der/die Steuerpflichtige” (the taxpayer) applies." },
      { key: "accountHolderName", label: "Account holder's name", deLabel: "Kontoinhaber(in)", type: "text", showIf: f => f.accountHolderIsSelf === false, required: f => f.accountHolderIsSelf === false, explain: "" },
    ],
  },
  {
    id: "estimates", title: "Income estimates", sub: "Honest guesses are expected — nobody can predict a first year exactly.",
    fields: [
      { key: "profitY1", label: "Estimated PROFIT — founding year (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Jahr der Betriebseröffnung", type: "euro", required: true,
        explain: "Founding year = the calendar year your activity starts. Profit = income minus business expenses, NOT your revenue. Only count the months from your start date until 31 December.",
        tip: f => f.goal === "explore"
          ? "Still exploring? Make a realistic guess — you can correct it with a short letter to the Finanzamt later."
          : "Aim realistic, not optimistic: a lower estimate keeps your quarterly advance payments low, but then the difference comes due with your annual return — so keep putting money aside.",
        more: "Yes, Germany asks you to predict the future. Nobody knows their first-year profit — the Finanzamt knows that nobody knows, and asks anyway. What they want is your honest current guess, not a promise.\nWhat the number does: it sets your quarterly advance income-tax payments (Vorauszahlungen). Mechanically: a higher estimate → higher advance payments now, refunded later if you earn less. A lower estimate → lower advance payments now, with a back-payment later if you earn more. Either way, your FINAL tax is settled by your annual tax return — the estimate only changes the timing of cash, not the total.\nGot it wrong later? Write to your Finanzamt and have the advance payments adjusted — that's a normal letter, not a confession.\nRemember: profit, not revenue. €40,000 invoiced minus €10,000 costs = €30,000 goes here." },
      { key: "profitY2", label: "Estimated profit — the year after (€)", deLabel: "Einkünfte aus selbständiger Arbeit, Folgejahr", type: "euro", required: true,
        suggest: f => { const v = fullYear(f.profitY1, f.activityStart); return v ? { value: v, label: L(`€${fmtEuro(v)} — your year-1 profit scaled from ${monthsLeft(f.activityStart)} ${monthsLeft(f.activityStart) === 1 ? "month" : "months"} to a full year`, `${fmtEuro(v)} € — dein Gewinn im Gründungsjahr von ${monthsLeft(f.activityStart)} ${monthsLeft(f.activityStart) === 1 ? "Monat" : "Monaten"} auf ein ganzes Jahr hochgerechnet`) } : null; },
        explain: "Same logic for the first full calendar year." },
      { key: "employmentY1", label: "Employment income in the founding year, if any (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit", type: "euro",
        explain: "Only salary from the founding calendar year. Quitting your job to go freelance? Count only the months until you leave. Starting on 1 January after quitting? Then it's 0.",
        tip: f => f.goal === "side" ? "You're employed — enter your gross yearly salary here. Leaving it at 0 makes the Finanzamt calculate your advance payments far too low, and the back-payment arrives later." : null,
        more: "Why a freelance form asks about your day job: income tax in Germany is calculated on your TOTAL income. If you employ-and-freelance in parallel (very common), the Finanzamt combines both to set fair advance payments — otherwise you'd get a nasty surprise at your first tax return.\nEnter the gross yearly amount (before taxes) from your employment this calendar year — your Brutto from the work contract, roughly. An estimate is fine here too.\nPure freelancer with no job? Enter 0 and move on." },
      { key: "employmentY2", label: "Employment income the year after (€, gross)", deLabel: "Einkünfte aus nichtselbständiger Arbeit, Folgejahr", type: "euro",
        suggest: f => f.goal === "fulltime" ? { value: "0", label: "0 — you're going full-time freelance" } : f.goal === "side" && f.employmentY1 ? { value: f.employmentY1, label: L(`€${fmtEuro(f.employmentY1)} — same salary as in the founding year`, `${fmtEuro(f.employmentY1)} € — gleiches Gehalt wie im Gründungsjahr`) } : null, explain: "0 if none." },
      { key: "sonderausgabenY1", label: "Special expenses in the founding year (€) — e.g. health insurance", deLabel: "Sonderausgaben", type: "euro",
        explain: "Mainly your own health and pension insurance contributions per year.",
        tip: f => f.goal === "fulltime"
          ? "Full-time freelancer: enter your yearly health + long-term care insurance (monthly amount × 12), plus pension contributions if you pay any. Your insurer's confirmation letter shows the monthly figure."
          : f.goal === "side" ? "Employed: your share of health and pension insurance is on your payslip (“Sozialversicherung”). A rough yearly total is enough." : null,
        more: "Sonderausgaben is bureaucratic German for “special expenses” — mainly what you pay for your own health insurance and pension contributions per year.\nMechanically: amounts here reduce the income your advance payments are calculated on. Whatever you enter now, the real numbers get sorted out in your annual tax return — this field only tunes the advance-payment estimate.\nAs a rough orientation of what belongs here: freelancers pay their health insurance themselves (public insurers often charge several hundred euros a month), and that yearly total is exactly the kind of number this field is about. If you genuinely don't know yet, the field tolerates that too — it changes timing, not your final tax." },
      { key: "sonderausgabenY2", label: "Special expenses the year after (€)", deLabel: "Sonderausgaben, Folgejahr", type: "euro",
        tip: f => f.goal === "fulltime" ? L("Full-time freelancer: next year you pay health insurance for all 12 months yourself — usually much more than in a short founding year. Enter the full yearly amount (monthly contribution × 12).", "Hauptberuflich selbständig: Im Folgejahr zahlst du die Krankenversicherung alle 12 Monate selbst — meist deutlich mehr als im kurzen Gründungsjahr. Trag den vollen Jahresbetrag ein (Monatsbeitrag × 12).") : null,
        suggest: f => f.sonderausgabenY1 && f.goal !== "fulltime" ? { value: f.sonderausgabenY1, label: L(`€${fmtEuro(f.sonderausgabenY1)} — same as the founding year`, `${fmtEuro(f.sonderausgabenY1)} € — wie im Gründungsjahr`) } : null, explain: "" },
      { key: "confirmEuer", label: "Profit method: will you use simple cash-basis accounting (EÜR)?", deLabel: "Gewinnermittlungsart — Einnahmenüberschussrechnung", type: "boolean", required: true,
        suggest: () => ({ value: true, label: "Yes — EÜR, the standard for solo businesses" }),
        explain: "EÜR means you record income and expenses when money actually flows — no double-entry bookkeeping, no balance sheet.",
        tip: () => "Choose Yes. For a solo freelancer or small trader, EÜR is the standard — the alternative (balance sheets) only makes sense for much bigger businesses.",
        more: "Einnahmenüberschussrechnung (EÜR) simply means “money in minus money out”.\nWhat Yes (EÜR) means: you track income when it arrives and expenses when you pay them. One list, once a year, done. It's the simple method open to freelancers without commercial bookkeeping duties, and the one the famous Excel sheet was invented for.\nWhat No (Bilanzierung) means: voluntary double-entry accounting with balance sheets — a setup that usually involves accounting software and often a Steuerberater. Some businesses choose it deliberately (e.g. for investor reporting); it's a different world, and this assistant honestly doesn't cover it.\nAlmost every solo business uses EÜR." },
      { key: "deviatingFiscalYear", label: "Does your business year differ from the calendar year?", deLabel: "Abweichendes Wirtschaftsjahr", type: "boolean", required: true,
        suggest: () => ({ value: false, label: "No — calendar year" }),
        explain: "Only relevant if you have (or will request) a business year that differs from the calendar year — this requires Finanzamt approval. If you haven't arranged anything like that, the factual answer is no.",
        more: "What this even is: some businesses close their books on, say, June 30 instead of December 31 — a “deviating fiscal year”. It requires explicit Finanzamt approval and exists mainly for certain trades and agricultural businesses.\nWhat Yes means: you already have (or are formally requesting) such an approved arrangement. You'd know — there'd be paperwork.\nWhat No means: your business year is the calendar year, like the January-to-December world the rest of us live in.\nIf this is the first time you've heard the phrase “abweichendes Wirtschaftsjahr”, the factual answer to this question is no." },
    ],
  },
  {
    id: "vat", title: "VAT (Umsatzsteuer)", sub: "The section people worry about most. We explain every option in plain English — you decide.",
    fields: [
      { key: "currentlyVatRegistered", label: "Are you currently VAT-registered at a German Finanzamt?", deLabel: "Aktuell umsatzsteuerlich geführt", type: "boolean", required: true,
        suggest: f => f.priorBusiness === false && f.taxRegisteredBefore === false ? { value: false, label: "No — you've never had a business or tax file here" } : null,
        explain: "Yes only if a German Finanzamt already manages VAT for you (you'd have an existing USt file and tax number for it).",
        more: "What Yes means: somewhere in Germany a Finanzamt already runs a VAT (Umsatzsteuer) file under your name — from an earlier business, for example. ELSTER will then ask follow-up questions about that existing registration (which office, which number) that this assistant doesn't cover — have those old documents ready.\nWhat No means: you're VAT-new. The standard case for a first-time founder.\nNot the same thing: having paid VAT as a CUSTOMER (everyone does, it's in every supermarket receipt) or having had VAT deducted on invoices you received. The question is whether you were registered as a BUSINESS for VAT." },
      { key: "revenueY1", label: "Estimated total REVENUE — founding year (€)", deLabel: "Summe der Umsätze, Jahr der Betriebseröffnung", type: "euro", required: true,
        explain: "Revenue = everything you invoice, before any expenses. This is a different number from the profit you entered earlier.",
        tip: f => {
          const r = num(f.revenueY1), p = num(f.profitY1);
          if (r && p && r < p) return L(`Your revenue (${eur(r)}) is lower than your profit (${eur(p)}) — that can't be right. Revenue is before expenses, so it's always at least as high as profit.`, `Dein Umsatz (${eur(r)}) ist niedriger als dein Gewinn (${eur(p)}) — das kann nicht stimmen. Umsatz ist vor Abzug der Kosten, also immer mindestens so hoch wie der Gewinn.`);
          return null;
        },
        more: "Third number the form wants, and yes, it's different from the last two. Revenue (Umsatz) = the total of everything you will invoice this year, before subtracting a single cost. Profit was income MINUS expenses; revenue is the raw top line.\nWhy it matters twice: (1) it feeds the VAT section's math, and (2) it determines whether you're even ELIGIBLE for the Kleinunternehmer option below — the €25,000 founding-year limit is measured against exactly this number.\nSame estimate rules as before: honest guess, correctable later, and the sale that actually happens always beats the forecast." },
      { key: "revenueY2", label: "Estimated revenue — the year after (€)", deLabel: "Summe der Umsätze, Folgejahr", type: "euro", required: true,
        suggest: f => { const v = fullYear(f.revenueY1, f.activityStart); return v ? { value: v, label: L(`€${fmtEuro(v)} — your year-1 revenue scaled to a full year`, `${fmtEuro(v)} € — dein Umsatz im Gründungsjahr auf ein ganzes Jahr hochgerechnet`) } : null; }, explain: "" },
      { key: "kleinunternehmer", label: "Kleinunternehmer-Regelung (§ 19 UStG) — use it or not?", deLabel: "Kleinunternehmer-Regelung", type: "choice", required: true,
        suggest: f => {
          if (num(f.revenueY1) > 25000) return { value: false, label: "Don't use it — your revenue is above €25,000" };
          if (f.clients === "business") return { value: false, label: "Don't use it — business clients, VAT back on purchases" };
          if (f.clients === "private" || num(f.revenueY1)) return { value: true, label: "Use it — simpler, and no VAT on your prices" };
          return null;
        },
        selectMap: {
          fromValue: (v: any) => (v === true ? "yes" : v === false ? "no" : ""),
          toValue: (s: string) => (s === "yes" ? true : s === "no" ? false : null),
        },
        options: [
          { value: "yes", label: "Use it — I will NOT charge VAT", desc: "No VAT on your invoices, no VAT returns. But no VAT back on your own purchases. You can switch later." },
          { value: "no",  label: "Don't use it — I WILL charge VAT", desc: "You add 19% and file VAT returns, and get VAT back on purchases. Binds you for 5 years." },
        ],
        explain: "The small-business scheme (§ 19 UStG) — the one real decision in this form. The two cards sum it up; “Tell me more” has the details.",
        tip: kleinunternehmerTip,
        more: "This is the question everyone googles at 1am, so let's take it slowly.\nTHE LIMITS (fixed by law, § 19 UStG): previous calendar year ≤ €25,000 revenue and current year ≤ €100,000. In your founding year there IS no previous year — so the €25,000 limit applies to your actual founding-year revenue, and the sale that crosses it is already subject to regular VAT from that moment on.\nOPTION 1 — use it (“I will NOT charge VAT”): your invoices carry no VAT and a small note citing §19 UStG · no VAT returns for these sales · but you also CANNOT reclaim the VAT you pay on business purchases (laptop, software, desk — the 19% inside those prices stays your cost).\nOPTION 2 — don't use it (“I WILL charge VAT”): you add VAT (usually 19%) to every invoice · you file VAT returns (Umsatzsteuer-Voranmeldungen — more paperwork) · and you reclaim the VAT on your business purchases.\nWHICH ONE WINS: it mostly depends on who pays you. Business clients reclaim your VAT anyway, so charging it costs them nothing and you get VAT back on your purchases. Private customers can't reclaim it, so for them VAT is simply a 19% price increase. Big equipment costs at the start also favour charging VAT. The tip below is based on your answers in step 1.\nOne mechanical note on reversibility: staying a Kleinunternehmer has no lock-in — you can switch to regular VAT taxation in any later year. Opting out (“I WILL charge VAT”) is different: under § 19 Abs. 3 UStG that election binds you to regular taxation for 5 years before you can return to the small-business scheme. Whatever you choose, your answer sheet shows the exact ELSTER entry for it." },
      { key: "vatBalance", label: "Estimated VAT payable — founding year (€)", deLabel: "Voraussichtliche Umsatzsteuer-Zahllast", type: "euro", showIf: f => f.kleinunternehmer === false, required: f => f.kleinunternehmer === false,
        suggest: f => num(f.revenueY1) ? { value: String(Math.round(num(f.revenueY1) * 0.19 * 0.8 / 10) * 10), label: L(`€${fmtEuro(String(Math.round(num(f.revenueY1) * 0.19 * 0.8 / 10) * 10))} — rough guess: 19% of revenue, minus ~20% assumed VAT on purchases`, `${fmtEuro(String(Math.round(num(f.revenueY1) * 0.19 * 0.8 / 10) * 10))} € — grobe Schätzung: 19 % vom Umsatz, minus ~20 % angenommene Vorsteuer auf Einkäufe`) } : null,
        explain: "Rough estimate: the VAT you will charge minus the VAT you pay on purchases. The final amount is always settled through your VAT returns.",
        tip: f => num(f.revenueY1) ? L(`Quick estimate: 19% of your revenue is ${eur(num(f.revenueY1) * 0.19)} — subtract the VAT inside your planned business purchases (about 16% of their gross price) and you have your number.`, `Schnelle Rechnung: 19 % deines Umsatzes sind ${eur(num(f.revenueY1) * 0.19)} — zieh die Umsatzsteuer in deinen geplanten Betriebseinkäufen ab (rund 16 % vom Bruttopreis), dann hast du deine Zahl.`) : null,
        more: "The math behind it: you'll collect VAT on your invoices (19% of revenue, usually) and pay VAT inside your business purchases. Zahllast = collected minus paid — what you expect to forward to the state this year.\nA back-of-envelope version is genuinely enough: 19% of your revenue estimate, minus roughly 19% of your expected purchases. The real amounts get settled through your regular VAT returns anyway — this field just gives the Finanzamt a first idea of scale." },
    ],
  },
];

// ── After registration: what comes next (done page) ─────────────────
// Facts checked 2026-11: §14 Abs.4 UStG invoice details; e-invoice
// receiving duty since 1.1.2025 (Wachstumschancengesetz); §5 DDG Impressum;
// VerpackG LUCID registration; EU textile regulation 1007/2011; GPSR
// (EU 2023/988) since 13.12.2024; OSS threshold €10,000; DAC7 (30 sales /
// €2,000); EU AI Act Art. 4 AI literacy since 2.2.2025; §25 GewStDV.
// Goods/VAT: €3/item customs on parcels ≤ €150 from 1.7.2026 to 1.7.2028 (Council Reg. (EU) 2026/382);
// §13b tax also owed by Kleinunternehmer (§19 Abs. 1 UStG); Erwerbsschwelle €12,500 (§1a Abs. 3); OSS/IOSS €10,000 / €150.
export type AfterGroup = { title: string; items: string[] };

export function afterRegistration(f: SteuerForm): AfterGroup[] {
  const g: AfterGroup[] = [];
  const ku = f.kleinunternehmer === true;
  const trade = needsGewerbe(f);
  const shipsGoods = trade && (f.salesChannel === "online" || f.salesChannel === "dropship");
  const sellsOnline = shipsGoods || !!f.website;
  const what = `${f.gewActivity} ${f.activityDesc}`;

  const inv = [
    L("Every invoice needs: your full name and address, your client's name and address, your Steuernummer (or USt-IdNr.), the invoice date, a consecutive invoice number, what you delivered and when, and the net amount.",
      "Jede Rechnung braucht: deinen vollen Namen und deine Adresse, Name und Adresse des Kunden, deine Steuernummer (oder USt-IdNr.), Rechnungsdatum, eine fortlaufende Rechnungsnummer, was du wann geliefert oder geleistet hast und den Nettobetrag."),
    ku ? L("As a Kleinunternehmer: no VAT on the invoice, but add the sentence “Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.”",
           "Als Kleinunternehmer: keine Umsatzsteuer auf der Rechnung, aber der Satz „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ muss drauf.")
       : L("With VAT: show the rate (usually 19%), the VAT amount and the gross total.",
           "Mit Umsatzsteuer: Steuersatz (meist 19 %), Steuerbetrag und Bruttosumme angeben."),
    L("No Steuernummer yet? Best wait the few weeks and send the invoice once the number has arrived.",
      "Noch keine Steuernummer? Am besten die paar Wochen warten und die Rechnung schreiben, sobald die Nummer da ist."),
    L("Since 2025 every business in Germany must be able to RECEIVE e-invoices (XRechnung/ZUGFeRD) from other businesses — an email inbox that accepts PDF/XML is enough. Sending them becomes mandatory in steps from 2027/2028" + (ku ? "; Kleinunternehmer are exempt from sending." : "."),
      "Seit 2025 muss jedes Unternehmen in Deutschland E-Rechnungen (XRechnung/ZUGFeRD) von anderen Unternehmen EMPFANGEN können — ein E-Mail-Postfach reicht. Das Versenden wird ab 2027/2028 schrittweise Pflicht" + (ku ? "; Kleinunternehmer sind davon ausgenommen." : ".")),
  ];
  if (f.clients === "abroad" || f.clients === "mixed") inv.push(L(
    "Business clients in other EU countries: apply for a USt-IdNr. (VAT ID) at bzst.de, put it and the client's VAT ID on the invoice, charge no German VAT and add “Steuerschuldnerschaft des Leistungsempfängers” (reverse charge).",
    "Geschäftskunden in anderen EU-Ländern: USt-IdNr. beim BZSt (bzst.de) beantragen, sie und die USt-IdNr. des Kunden auf die Rechnung schreiben, keine deutsche Umsatzsteuer berechnen und „Steuerschuldnerschaft des Leistungsempfängers“ vermerken."));
  g.push({ title: L("Writing invoices", "Rechnungen schreiben"), items: inv });

  const money = [
    L("Open a separate bank account for the business — not required for sole traders, but it makes the yearly accounts far easier.",
      "Eröffne ein eigenes Konto fürs Geschäft — für Einzelunternehmer keine Pflicht, aber die Jahresabrechnung wird viel einfacher."),
    L("Keep every invoice and receipt: 8 years for receipts, 10 years for your annual accounts. A folder per year (paper or PDF) is enough.",
      "Bewahre jede Rechnung und jeden Beleg auf: 8 Jahre für Belege, 10 Jahre für die Jahresabschlüsse. Ein Ordner pro Jahr (Papier oder PDF) reicht."),
    L("Advance tax payments: the Finanzamt sends a notice (Vorauszahlungsbescheid) — payments are due on 10 March, June, September and December.",
      "Vorauszahlungen: Das Finanzamt schickt einen Vorauszahlungsbescheid — fällig jeweils am 10. März, Juni, September und Dezember."),
  ];
  if (f.kleinunternehmer === false) money.push(L(
    "VAT returns (Umsatzsteuer-Voranmeldung) via ELSTER by the 10th of the following month — monthly or quarterly, your Finanzamt letter tells you which.",
    "Umsatzsteuer-Voranmeldung über ELSTER bis zum 10. des Folgemonats — monatlich oder vierteljährlich, das steht im Brief vom Finanzamt."));
  money.push(L(
    "Once a year (deadline 31 July of the following year): income tax return with the Anlage EÜR" + (f.kleinunternehmer === false ? ", the annual VAT return" : "") + (trade ? ", and a trade tax return if your trade profit is above €24,500" : "") + ".",
    "Einmal im Jahr (Frist 31. Juli des Folgejahres): Einkommensteuererklärung mit Anlage EÜR" + (f.kleinunternehmer === false ? ", Umsatzsteuer-Jahreserklärung" : "") + (trade ? " und Gewerbesteuererklärung, wenn dein Gewerbegewinn über 24.500 € liegt" : "") + "."));
  g.push({ title: L("Money, bookkeeping, deadlines", "Geld, Buchhaltung, Fristen"), items: money });

  const ins: string[] = [];
  if (f.goal === "fulltime") ins.push(
    L("Tell your health insurer (Krankenkasse) the day your job ends. With public insurance you stay insured as a voluntary member; the contribution is now based on your profit, and they'll ask for your tax assessment. Private insurance is possible for self-employed people.",
      "Sag deiner Krankenkasse Bescheid, sobald dein Job endet. Gesetzlich Versicherte bleiben als freiwilliges Mitglied versichert; der Beitrag richtet sich jetzt nach deinem Gewinn, die Kasse fragt später nach deinem Steuerbescheid. Privat versichern ist für Selbständige auch möglich."),
    L("Pension: most self-employed people have no obligation — but no employer pays in for you any more either. Plan your own provision (exceptions: teachers/trainers, some crafts).",
      "Rente: Für die meisten Selbständigen gibt es keine Pflicht — aber es zahlt auch kein Arbeitgeber mehr ein. Plane deine eigene Vorsorge (Ausnahmen: Lehrende, manche Handwerke)."));
  if (f.goal === "side") ins.push(L(
    "Health insurance stays with your job. If the business grows bigger than the job (time or income), tell your Krankenkasse — then you become insured as self-employed.",
    "Die Krankenversicherung läuft über deinen Job weiter. Wird das Geschäft größer als der Job (Zeit oder Einkommen), sag der Krankenkasse Bescheid — dann wirst du als Selbständige(r) versichert."));
  if (f.gewArt === "Sonstiges" || /beratung|consult/i.test(what)) ins.push(L(
    "Consulting: consider a professional liability insurance (Berufshaftpflicht / Vermögensschadenhaftpflicht) — not mandatory, but one wrong piece of advice can cost more than a year's profit.",
    "Beratung: Überlege dir eine Vermögensschadenhaftpflicht — keine Pflicht, aber ein einziger falscher Rat kann mehr kosten als ein Jahresgewinn."));
  if (ins.length) g.push({ title: L("Insurance", "Versicherung"), items: ins });

  const web: string[] = [];
  if (sellsOnline || f.workType !== "liberal") web.push(L(
    "Any business website or shop page needs an Impressum (§ 5 DDG: name, address, email, phone or contact form, VAT ID if you have one) and a privacy policy (Datenschutzerklärung, GDPR).",
    "Jede geschäftliche Website und jede Shopseite braucht ein Impressum (§ 5 DDG: Name, Anschrift, E-Mail, Telefon oder Kontaktformular, ggf. USt-IdNr.) und eine Datenschutzerklärung (DSGVO)."));
  if (shipsGoods) web.push(
    L(`Selling online to consumers: a withdrawal notice (Widerrufsbelehrung, 14 days), final prices (${ku ? "as a Kleinunternehmer without VAT" : "including VAT"}), shipping costs shown up front, and an order button that says “zahlungspflichtig bestellen”. Marketplaces like Etsy or eBay help, but the duties stay yours.`,
      `Online an Verbraucher verkaufen: Widerrufsbelehrung (14 Tage), Endpreise (${ku ? "als Kleinunternehmer ohne Umsatzsteuer" : "inkl. Umsatzsteuer"}), Versandkosten vorab sichtbar und ein Bestellbutton mit „zahlungspflichtig bestellen“. Marktplätze wie Etsy oder eBay helfen, die Pflichten bleiben aber deine.`));
  if (f.salesChannel === "online") web.push(
    L("Packaging: register in the LUCID packaging register (free, verpackungsregister.org) and license your shipping packaging with a dual system BEFORE your first shipment. Selling without it can mean a sales ban and fines.",
      "Verpackung: Vor dem ersten Versand im Verpackungsregister LUCID registrieren (kostenlos, verpackungsregister.org) und deine Versandverpackung bei einem dualen System lizenzieren. Ohne droht Verkaufsverbot und Bußgeld."));
  if (shipsGoods) web.push(
    L("Marketplaces report sellers to the tax office from 30 sales or €2,000 a year (DAC7) — just one more reason to keep clean records.",
      "Marktplätze melden Verkäufer ab 30 Verkäufen oder 2.000 € im Jahr ans Finanzamt (DAC7) — ein Grund mehr für saubere Aufzeichnungen."));
  if (f.salesChannel === "dropship") web.push(
    L("Dropshipping: towards your customers YOU are the seller — warranty (2 years), returns and delivery problems are yours, whatever the supplier does. Put that in your contract with the supplier.",
      "Dropshipping: Gegenüber deinen Kunden bist DU der Verkäufer — Gewährleistung (2 Jahre), Rücksendungen und Lieferprobleme liegen bei dir, egal was der Lieferant macht. Regle das im Vertrag mit dem Lieferanten."),
    L("Packaging with dropshipping: usually you, as the seller, are responsible for the LUCID registration — ask your supplier whether they already license the packaging for you.",
      "Verpackung beim Dropshipping: Meist bist du als Verkäufer für die LUCID-Registrierung zuständig — frag deinen Lieferanten, ob er die Verpackung schon für dich lizenziert."));
  if (trade && f.supplierRegion === "nonEu") web.push(L(
    "Product safety (GPSR, since December 2024): every product sold in the EU needs an EU-based responsible person and safety information on the product or listing. If your supplier sits outside the EU and has no EU representative, that responsible person is often YOU. Electronics and toys also need CE marking. Check this BEFORE listing a product.",
    "Produktsicherheit (GPSR, seit Dezember 2024): Jedes in der EU verkaufte Produkt braucht eine verantwortliche Person in der EU und Sicherheitsinformationen am Produkt oder im Angebot. Sitzt dein Lieferant außerhalb der EU und hat keinen EU-Vertreter, bist das oft DU. Elektronik und Spielzeug brauchen zusätzlich eine CE-Kennzeichnung. Prüf das, BEVOR du ein Produkt einstellst."));
  if (/shirt|textil|bekleidung|kleidung|mode|hoodie|merch/i.test(what)) web.push(L(
    "Clothing: every textile product sold in the EU needs a label with its fibre composition, e.g. “100 % Baumwolle” (EU Textile Regulation 1007/2011). Blank shirts from a wholesaler usually have it — if you sew or re-label, it's your job. Using someone else's logos or characters on shirts needs a licence.",
    "Kleidung: Jedes in der EU verkaufte Textil braucht ein Etikett mit der Faserzusammensetzung, z. B. „100 % Baumwolle“ (EU-Textilkennzeichnungsverordnung 1007/2011). Rohlinge vom Großhändler haben das meist — wenn du selbst nähst oder umlabelst, ist es deine Aufgabe. Fremde Logos oder Figuren auf Shirts brauchen eine Lizenz."));
  if (web.length) g.push({ title: L("Website and shop", "Website und Shop"), items: web });

  const goods: string[] = [];
  if (trade && f.gewArt === "Handel") {
    const imp = f.supplierRegion === "nonEu";
    if (ku) goods.push(L(
      `In short, as a Kleinunternehmer: no VAT on your sales and no OSS returns (as long as sales to other EU countries stay under €10,000). BUT ${imp ? "import VAT, customs duty and " : ""}reverse-charge VAT on foreign services hit${imp ? "" : "s"} you anyway — and you can't get ${imp ? "them" : "it"} back. Below is what each means.`,
      `Kurz gesagt als Kleinunternehmer: keine Umsatzsteuer auf deine Verkäufe und keine OSS-Meldung (solange Verkäufe ins EU-Ausland unter 10.000 € bleiben). ABER: ${imp ? "Einfuhrumsatzsteuer, Zoll und " : ""}Reverse-Charge-Steuer auf Auslandsleistungen ${imp ? "treffen" : "trifft"} dich trotzdem — und du bekommst ${imp ? "sie" : "sie"} nicht zurück. Was das jeweils heißt, steht hier.`));
    if (f.supplierRegion === "nonEu") goods.push(
      L("Import VAT and customs: every parcel from outside the EU (China, USA, Turkey, UK…) pays 19 % German import VAT (Einfuhrumsatzsteuer) — since 2021 even for tiny amounts. Since 1 July 2026 parcels up to €150 also pay a flat customs duty of €3 per item (EU Regulation 2026/382, until July 2028); above €150 the normal duty rate for that product applies. Build both into your prices.",
        "Einfuhrumsatzsteuer und Zoll: Auf jedes Paket von außerhalb der EU (China, USA, Türkei, UK…) fallen 19 % Einfuhrumsatzsteuer an — seit 2021 auch für Kleinstbeträge. Seit 1. Juli 2026 kommt bei Paketen bis 150 € ein pauschaler Zoll von 3 € pro Artikel dazu (EU-Verordnung 2026/382, bis Juli 2028); über 150 € gilt der normale Zollsatz der Ware. Rechne beides in deine Preise ein."),
      L("Who imports? If the supplier ships “unverzollt” (DAP), YOUR customer pays import VAT, customs and a carrier fee at the door — many refuse the parcel, and the return is your problem. Better: suppliers with an EU warehouse, or delivery “verzollt” (DDP), where the import is handled before the parcel reaches the customer.",
        "Wer importiert? Liefert der Lieferant „unverzollt“ (DAP), zahlt DEIN Kunde Einfuhrumsatzsteuer, Zoll und eine Gebühr des Paketdienstes an der Haustür — viele verweigern die Annahme, und die Rücksendung ist dein Problem. Besser: Lieferanten mit EU-Lager oder Lieferung „verzollt“ (DDP), bei der die Einfuhr erledigt ist, bevor das Paket beim Kunden ankommt."),
      ku ? L("IOSS (Import One-Stop-Shop) lets sellers charge the VAT at checkout for parcels up to €150, so the import itself is VAT-free. As a Kleinunternehmer you don't charge VAT, so IOSS usually doesn't fit — if you import yourself, the import VAT is simply a cost for you. Selling via Amazon, eBay or Etsy? For parcels up to €150 from outside the EU the marketplace handles the VAT for you.",
             "IOSS (Import-One-Stop-Shop): Damit kassieren Verkäufer die Umsatzsteuer bei Paketen bis 150 € schon an der Kasse, und die Einfuhr ist steuerfrei. Als Kleinunternehmer berechnest du keine Umsatzsteuer, IOSS passt also meist nicht — importierst du selbst, ist die Einfuhrumsatzsteuer für dich einfach Kosten. Verkaufst du über Amazon, eBay oder Etsy? Bei Paketen bis 150 € von außerhalb der EU übernimmt der Marktplatz die Umsatzsteuer für dich.")
         : L("IOSS (Import One-Stop-Shop): for parcels up to €150 to private customers in the EU you charge the VAT at checkout and report it monthly via the BZSt — the import is then VAT-free and the parcel arrives without a surprise bill. Selling via Amazon, eBay or Etsy? For parcels up to €150 from outside the EU the marketplace counts as the seller for VAT and handles it for you. Import VAT you pay yourself (larger shipments) comes back as input VAT in your VAT return.",
             "IOSS (Import-One-Stop-Shop): Bei Paketen bis 150 € an Privatkunden in der EU kassierst du die Umsatzsteuer schon an der Kasse und meldest sie monatlich über das BZSt — dann ist die Einfuhr steuerfrei und das Paket kommt ohne Nachzahlung an. Verkaufst du über Amazon, eBay oder Etsy? Bei Paketen bis 150 € von außerhalb der EU gilt der Marktplatz für die Umsatzsteuer als Verkäufer und erledigt das. Einfuhrumsatzsteuer, die du selbst zahlst (größere Lieferungen), holst du dir in der Voranmeldung als Vorsteuer zurück."),
      L("Importing goods yourself (you are the recipient in the customs declaration, e.g. stock for your basement)? You need an EORI number — free from customs at zoll.de, takes a few days.",
        "Importierst du selbst (du bist Empfänger in der Zollanmeldung, z. B. Ware fürs eigene Lager)? Dann brauchst du eine EORI-Nummer — kostenlos beim Zoll (zoll.de), dauert ein paar Tage."));
    if (f.supplierRegion === "eu") goods.push(ku
      ? L("Buying goods from another EU country as a Kleinunternehmer: as long as these purchases stay under €12,500 a year (Erwerbsschwelle) and you don't give your supplier a VAT ID, the supplier simply charges its own country's VAT — nothing to report for you. Above that, you have to pay German VAT on the purchases (innergemeinschaftlicher Erwerb). Careful: once you give a supplier your VAT ID (e.g. the one you need for reverse charge), the purchase counts as such an acquisition anyway.",
          "Einkauf aus anderen EU-Ländern als Kleinunternehmer: Solange diese Einkäufe unter 12.500 € im Jahr bleiben (Erwerbsschwelle) und du dem Lieferanten keine USt-IdNr. angibst, berechnet er dir einfach die Umsatzsteuer seines Landes — für dich nichts zu melden. Darüber musst du die Einkäufe in Deutschland versteuern (innergemeinschaftlicher Erwerb). Achtung: Sobald du einem Lieferanten deine USt-IdNr. angibst (z. B. die, die du für Reverse Charge brauchst), gilt der Einkauf trotzdem als solcher Erwerb.")
      : L("Buying goods from another EU country: give your supplier your VAT ID (USt-IdNr.) and you get an invoice without VAT. You then report German VAT on the purchase in your VAT return (innergemeinschaftlicher Erwerb) and deduct the same amount as input VAT — net €0, but both lines must be there. Your VAT ID comes with your tax registration or from the BZSt.",
          "Einkauf aus anderen EU-Ländern: Gib dem Lieferanten deine USt-IdNr., dann bekommst du eine Rechnung ohne Umsatzsteuer. Die deutsche Umsatzsteuer darauf meldest du selbst in der Voranmeldung (innergemeinschaftlicher Erwerb) und ziehst denselben Betrag als Vorsteuer wieder ab — unterm Strich 0 €, aber beide Zeilen müssen drinstehen. Die USt-IdNr. kommt mit deiner steuerlichen Erfassung oder vom BZSt."));
    goods.push(ku
      ? L("Reverse charge on services from abroad (§ 13b UStG): ads on Meta, Google or TikTok, Shopify and many apps bill from Ireland or other countries without VAT. Then YOU owe the 19 % German VAT on it — and this applies to Kleinunternehmer too, without getting it back: €1,000 of ads cost you €1,190. In months with such invoices you must file a VAT return (Umsatzsteuer-Voranmeldung) despite the Kleinunternehmer scheme.",
          "Reverse Charge bei Leistungen aus dem Ausland (§ 13b UStG): Werbung bei Meta, Google oder TikTok, Shopify und viele Apps rechnen aus Irland oder anderen Ländern ohne Umsatzsteuer ab. Dann schuldest DU die 19 % deutsche Umsatzsteuer darauf — das gilt auch für Kleinunternehmer, ohne dass du sie zurückbekommst: 1.000 € Werbung kosten dich 1.190 €. In Monaten mit solchen Rechnungen musst du trotz Kleinunternehmerregelung eine Umsatzsteuer-Voranmeldung abgeben.")
      : L("Reverse charge on services from abroad (§ 13b UStG): ads on Meta, Google or TikTok, Shopify and many apps bill from Ireland or other countries without VAT. Then YOU report the 19 % German VAT on it in your VAT return — and deduct it again as input VAT in the same return. Net €0, but both lines must be there. Enter your VAT ID with these providers so they bill correctly.",
          "Reverse Charge bei Leistungen aus dem Ausland (§ 13b UStG): Werbung bei Meta, Google oder TikTok, Shopify und viele Apps rechnen aus Irland oder anderen Ländern ohne Umsatzsteuer ab. Dann meldest DU die 19 % deutsche Umsatzsteuer darauf in der Voranmeldung — und ziehst sie in derselben Meldung als Vorsteuer wieder ab. Unterm Strich 0 €, aber beide Zeilen müssen drinstehen. Hinterleg bei diesen Anbietern deine USt-IdNr., damit sie richtig abrechnen."));
    if (f.salesRegion === "eu") goods.push(ku
      ? L("Selling to private customers in other EU countries as a Kleinunternehmer: as long as these sales stay under €10,000 a year in total (all EU countries together), German rules apply — so no VAT. Above that, the customer's country's VAT applies and the German Kleinunternehmer scheme doesn't cover it — get advice before you cross the line.",
          "Verkäufe an Privatkunden in anderen EU-Ländern als Kleinunternehmer: Solange sie unter 10.000 € im Jahr bleiben (alle EU-Länder zusammen), gilt deutsches Recht — also keine Umsatzsteuer. Darüber gilt die Umsatzsteuer des Kundenlandes, und die deutsche Kleinunternehmerregelung deckt das nicht ab — lass dich beraten, bevor du die Grenze erreichst.")
      : L("OSS (One-Stop-Shop): sales to private customers in other EU countries are taxed with German VAT up to €10,000 a year in total (all EU countries together). From the sale that crosses that line, the customer's country's rate applies (e.g. 20 % Austria, 21 % Netherlands). You report it quarterly via the OSS procedure at the BZSt instead of registering in every country. Selling to businesses in other EU countries with their VAT ID: the supply is VAT-free (“steuerfreie innergemeinschaftliche Lieferung” and both VAT IDs on the invoice), plus a recapitulative statement (Zusammenfassende Meldung) to the BZSt.",
          "OSS (One-Stop-Shop): Verkäufe an Privatkunden in anderen EU-Ländern versteuerst du bis insgesamt 10.000 € im Jahr (alle EU-Länder zusammen) mit deutscher Umsatzsteuer. Ab dem Verkauf, mit dem du die Grenze überschreitest, gilt der Satz des Kundenlandes (z. B. 20 % Österreich, 21 % Niederlande). Du meldest das vierteljährlich über das OSS-Verfahren beim BZSt, statt dich in jedem Land zu registrieren. Verkaufst du an Firmen in anderen EU-Ländern mit deren USt-IdNr.: Die Lieferung ist steuerfrei („steuerfreie innergemeinschaftliche Lieferung“ und beide USt-IdNrn. auf die Rechnung), dazu eine Zusammenfassende Meldung ans BZSt."));
  }
  if (goods.length) g.push({ title: L("Goods, customs and VAT", "Waren, Zoll und Umsatzsteuer"), items: goods });

  const extra: string[] = [];
  if (/\b(ki|ai)\b|künstliche intelligenz|artificial intelligence/i.test(what)) extra.push(L(
    "AI work: the EU AI Act applies step by step. Since February 2025 anyone who provides or uses AI systems professionally must ensure sufficient AI literacy (Art. 4) — document how you and your clients' staff are trained. Strict duties apply only to high-risk uses (e.g. hiring, credit scoring).",
    "KI-Arbeit: Der EU AI Act gilt schrittweise. Seit Februar 2025 muss jeder, der KI-Systeme beruflich anbietet oder einsetzt, für ausreichende KI-Kompetenz sorgen (Art. 4) — dokumentiere, wie du und die Mitarbeitenden deiner Kunden geschult werden. Strenge Pflichten gelten nur für Hochrisiko-Anwendungen (z. B. Bewerberauswahl, Kreditprüfung)."));
  if (trade) extra.push(L(
    "Changing what you do later (new products, new services) or moving: report it to the Gewerbeamt with a short Gewerbe-Ummeldung.",
    "Wenn sich später deine Tätigkeit ändert (neue Produkte, neue Leistungen) oder du umziehst: kurz beim Gewerbeamt ummelden (Gewerbe-Ummeldung)."));
  if (trade && f.businessAddrIsHome !== false && f.gewArt && f.gewArt !== "Sonstiges") extra.push(L(
    "Working from home (flat, basement, garage)? Without customer visits that is usually fine. For storage, machines or customers coming by, a rented flat needs your landlord's consent — check your rental contract.",
    "Du arbeitest von zu Hause (Wohnung, Keller, Garage)? Ohne Kundenverkehr ist das meist in Ordnung. Für Lager, Maschinen oder Kundenbesuche brauchst du in einer Mietwohnung die Zustimmung des Vermieters — schau in deinen Mietvertrag."));
  if (f.needsResidencePermit) extra.push(L(
    "Keep your tax assessments and invoices together: the Ausländerbehörde usually wants to see your self-employed income when you extend your permit.",
    "Heb Steuerbescheide und Rechnungen gut auf: Die Ausländerbehörde will bei der Verlängerung deines Aufenthaltstitels meist dein Einkommen aus der Selbständigkeit sehen."));
  if (extra.length) g.push({ title: L("Good to know", "Gut zu wissen"), items: extra });
  return g;
}

// ── Validation ──────────────────────────────────────────────────────
export function stepError(stepId: string, f: SteuerForm): string {
  // Generic required-check from the engine, then steuer-specific rules.
  const missing = requiredError(STEUER_STEPS, stepId, f, tr);
  if (missing) return missing;
  if (stepId === "activity" && f.isNewFounding === false) {
    return tr("This assistant currently covers new foundings (Neugründung) only. For a business takeover (Übernahme) or relocation (Verlegung), please use ELSTER's own help or a Steuerberater.");
  }
  if (stepId === "estimates" && f.confirmEuer === false) {
    return tr("This assistant covers cash-basis accounting (EÜR) only. If you plan double-entry accounting (Bilanzierung), please use ELSTER directly or a Steuerberater.");
  }
  if (stepId === "identity" && f.steuerId && !validateSteuerId(f.steuerId)) {
    return tr("The tax ID (Identifikationsnummer) must be exactly 11 digits.");
  }
  if (stepId === "identity" && f.married && f.spouseSteuerId && !validateSteuerId(f.spouseSteuerId)) {
    return tr("Your spouse's tax ID must be exactly 11 digits (or leave it empty).");
  }
  if (stepId === "bank" && f.iban && !validateIBAN(f.iban)) {
    return tr("This IBAN doesn't pass the checksum — please double-check it.");
  }
  if (stepId === "bank" && f.iban && !f.iban.replace(/\s/g, "").toUpperCase().startsWith("DE")) {
    return tr("This form field expects a German IBAN (starting with DE).");
  }
  return "";
}
