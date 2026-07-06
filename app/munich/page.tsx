"use client";
// ═══════════════════════════════════════════════════════════════════
//  MUNICH ANMELDUNG  ·  page.tsx
//  Fills the official Munich Anmeldung PDF (anmeldung_meldebehorde.pdf)
//  - Up to 4 registering persons (Munich form limit)
//  - Choice fields: famst1-4, rel1-4, art1-4 (dropdowns)
//  - Radio buttons: geschl1-4, wohnung, getrennt1
//  - Nested address fields: neuw.strasse, nw.plz, bishwo.{strasse,plz,ort}
//  - Mirrors Berlin wizard UX exactly (same steps, same styling)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, ChevronRight, Plus, Trash2, Download,
  User, Users, Home, FileText, Shield, Layers,
  CheckCircle2, Check, RotateCcw, AlertCircle,
} from "lucide-react";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";
import { CookieBanner } from "../components/LegalModals";

// ─── Munich PDF field map (verified via pypdf against anmeldung_meldebehorde.pdf) ─
// Field types confirmed:
//   Tx  = text field (form.getTextField)
//   Ch  = choice/dropdown (form.getDropdown)
//   Btn = radio button group (form.getRadioGroup)
//   nested = dot-notation child field (form.getTextField("parent.child"))
const MF = {
  // ── New address (nested fields) ─────────────────────────────────
  EINZUG:        "einzug",          // Tx  move-in date DD.MM.YYYY
  NEUW_STRASSE:  "neuw.strasse",    // Tx  Straße/Platz, Hausnummer, Stockwerk
  NW_PLZ:        "nw.plz",          // Tx  Postleitzahl (city is pre-printed on Munich form)
  WOHNUNG:       "wohnung",         // Btn einzige Wohnung | Hauptwohnung | Nebenwohnung

  // ── Previous address (nested fields) ───────────────────────────
  BISHWO_STRASSE: "bishwo.strasse", // Tx  Straße/Platz, Hausnummer, Stockwerk
  BISHWO_PLZ:     "bishwo.plz",     // Tx  Postleitzahl
  BISHWO_ORT:     "bishwo.ort",     // Tx  Ort/Gemeinde

  // ── Person fields: persons 1-4 register, person 5 = non-moving spouse ──
  // All 4-element arrays index as [0]=person1 [1]=person2 [2]=person3 [3]=person4
  FAM:       ["fam1",  "fam2",  "fam3",  "fam4" ],   // Tx  Familienname
  VORN:      ["vorn1", "vorn2", "vorn3", "vorn4"],    // Tx  Vorname(n)
  NAME:      ["name1", "name2", "name3", "name4"],    // Tx  frühere Namen / Geburtsname
  GR:        ["gr1",   "gr2",   "gr3",   "gr4"  ],   // Tx  Doktorgrad (leave blank)
  GEBDAT:    ["gebdat1","gebdat2","gebdat3","gebdat4"], // Tx  Geburtsdatum DD.MM.YYYY
  GEBORT:    ["gebort1","gebort2","gebort3","gebort4"], // Tx  Geburtsort, Geburtsland
  GESCHL:    ["geschl1","geschl2","geschl3","geschl4"], // Btn Männlich|Weiblich|Divers|ohne Angabe
  STAATSANG: ["staatsang1","staatsang2","staatsang3","staatsang4"], // Tx  Staatsangehörigkeit
  FAMST:     ["famst1","famst2","famst3","famst4"],   // Ch  LD|VH|VW|GS|LP|LV
  REL:       ["rel1",  "rel2",  "rel3",  "rel4" ],   // Ch  -|rk|ev|ak|...
  ORDENS:    ["ordenskuenstler1","ordenskuenstler2","ordenskuenstler3","ordenskuenstler4"], // Tx
  DAT:       ["dat1",  "dat2",  "dat3",  "dat4" ],   // Tx  Datum+Ort Eheschließung per person

  // ── Document fields: 4 slots, one per person ───────────────────
  ART:       ["art1",  "art2",  "art3",  "art4" ],   // Ch  PA|RP|KRP|KA|AKN
  SERIEN:    ["serien1","serien2","serien3","serien4"], // Tx  Seriennummer
  AUSSTELLDAT:["ausstelldat1","ausstelldat2","ausstelldat3","ausstelldat4"], // Tx  Ausstellungsdatum
  AUSSTELLB: ["ausstellb1","ausstellb2","ausstellb3","ausstellb4"],         // Tx  Ausstellungsbehörde
  GUELTIG:   ["gueltig1","gueltig2","gueltig3","gueltig4"],                 // Tx  gültig bis
  // Note: name1-4 = birth/previous names (NOT doc holder name — implied by slot)

  // ── Legal representative (fill if any registering person is a minor) ──
  GESETZLVER: "gesetzlver",         // Tx  Vor- und Familienname, Doktorgrad, Geburtsdatum, Anschrift

  // ── Non-moving spouse / registered partner ─────────────────────
  NMS_FAM:     "fam5",              // Tx  Familienname
  NMS_VORN:    "vorn5",             // Tx  Vorname(n)
  NMS_GEBDAT:  "gebdat5",           // Tx  Geburtsdatum DD.MM.YYYY
  NMS_GEBORT:  "gebort5",           // Tx  Geburtsort, Geburtsland
  NMS_NAME:    "name5",             // Tx  Geburtsname / frühere Namen
  NMS_GESCHL:  "geschl6",           // Btn Männlich|Weiblich|Divers|ohne Angabe
  NMS_GETRENNT:"getrennt1",         // Btn Ja|Nein (dauerhaft getrennt?)
  NMS_ANSCHR:  "anschr5",           // Tx  Straße, Hausnummer (current address)
  NMS_ANSCHR_A:"anschr5a",          // Tx  PLZ, Ort

  // ── Leave blank — office fills these ───────────────────────────
  // fam_bev, vorname_bev, geb_bev, fam_vg, vorname_vg, geb_vg
  // Datum, Datum1 (signing date), Ort, Ort1 (signing place)
  // anschrift_bev (Meldebehörde address), gr5 (Doktorgrad NMS)
  // zuzug (last German address if from abroad)
  // vertrieb1-4, drucken1, Druckbereich, zurücksetzen1
} as const;

// ── Munich-specific radio button export values (case-sensitive, must match AP/N keys in PDF)
const WOHNUNG_VALS = {
  alleinig: "einzige Wohnung",   // sole/only dwelling
  haupt:    "Hauptwohnung",       // primary dwelling
  neben:    "Nebenwohnung",       // secondary dwelling
} as const;

const GESCHL_VALS: Record<string, string> = {
  m: "Männlich",
  f: "Weiblich",
  d: "Divers",
  x: "ohne Angabe",
};

// Munich marital status codes for Ch dropdown (famst1-4)
const FAMST_CODE: Record<string, string> = {
  ledig:         "LD",
  verheiratet:   "VH",
  verwitwet:     "VW",
  geschieden:    "GS",
  partnerschaft: "LP",
  getrennt:      "VH", // still legally married, separated
};

// Munich religion codes for Ch dropdown (rel1-4)
const REL_CODE: Record<string, string> = {
  none:        "-",
  rk:          "rk",   // römisch-katholisch
  ev:          "ev",   // evangelisch
  ak:          "ak",   // altkatholisch
  jewish:      "-",    // no jd code found in options, use no-declaration
  islamic:     "-",
  orthodox:    "-",
  other:       "-",
};

// Munich doc type codes for Ch dropdown (art1-4)
const ART_CODE: Record<string, string> = {
  RP:   "RP",    // Reisepass (passport)
  PA:   "PA",    // Personalausweis (national ID)
  KRP:  "KRP",   // Kinderreisepass
  KA:   "KA",    // Kinderausweis
  AKN:  "AKN",   // Aufenthaltstitel (residence permit)
  "":   "     ", // blank
};

// ─── Types ────────────────────────────────────────────────────────
type AppPhase = "landing" | "wizard" | "payment" | "generating" | "done";
type WizardStep = "origin" | "new-address" | "prev-address" | "people" | "status" | "documents" | "review";

interface Person {
  lastName: string;
  firstName: string;
  birthName: string;       // Geburtsname / frühere Namen → name1-4
  birthDate: string;
  birthPlace: string;
  birthCountry: string;
  gender: string;          // m|f|d|x
  religion: string;        // none|rk|ev|ak|...
  citizenship: string;
  artisticName: string;
  docType: string;         // RP|PA|KRP|KA|AKN
  docAuthority: string;
  docSerial: string;
  docDate: string;
  docValidUntil: string;
  relationship: "primary" | "spouse" | "child";
  fillHandwritten: boolean;
}

interface MunichForm {
  originCountry: string;
  isEU: boolean;
  maritalStatus: string;
  marriageDate: string;
  marriagePlace: string;
  marriageCountry: string;
  nonMovingSpouse: {
    firstName: string; lastName: string; birthDate: string;
    birthPlace: string; birthCountry: string; gender: string;
    separated: boolean; street: string; postalCity: string;
  } | null;
  people: Person[];
  // New address
  newStreet: string;
  newNumber: string;
  newAddExtra: string;
  newPostalCode: string;
  moveInDate: string;
  newResType: string;      // alleinig | haupt | neben
  // Previous address
  prevStreet: string;
  prevNumber: string;
  prevPostalCode: string;
  prevCity: string;
  prevCountry: string;
  moveOutDate: string;
}

const EMPTY_PERSON: Person = {
  lastName: "", firstName: "", birthName: "",
  birthDate: "", birthPlace: "", birthCountry: "",
  gender: "", religion: "none", citizenship: "", artisticName: "",
  docType: "RP", docAuthority: "", docSerial: "", docDate: "", docValidUntil: "",
  relationship: "primary", fillHandwritten: false,
};

const EMPTY_NMS = {
  firstName: "", lastName: "", birthDate: "", birthPlace: "", birthCountry: "",
  gender: "", separated: false, street: "", postalCity: "",
};

const EMPTY: MunichForm = {
  originCountry: "", isEU: true,
  maritalStatus: "", marriageDate: "", marriagePlace: "", marriageCountry: "",
  nonMovingSpouse: null,
  people: [{ ...EMPTY_PERSON }],
  newStreet: "", newNumber: "", newAddExtra: "", newPostalCode: "", moveInDate: "",
  newResType: "alleinig",
  prevStreet: "", prevNumber: "", prevPostalCode: "", prevCity: "", prevCountry: "",
  moveOutDate: "",
};

const STORAGE_KEY = "simplyexpat-munich-v1";
const DONE_KEY    = "simplyexpat-munich-done-v1";
const MAX_PEOPLE  = 4; // Munich form has 4 registering-person slots

// ─── Translation tables (copied verbatim from Berlin app/page.tsx) ─
const GENDER_DE: Record<string,string> = { m:"männlich", f:"weiblich", d:"divers", x:"ohne Angabe" };
const COUNTRY_DE: Record<string,string> = {
  "Afghanistan":"Afghanistan","Albania":"Albanien","Algeria":"Algerien",
  "Angola":"Angola","Argentina":"Argentinien","Armenia":"Armenien",
  "Australia":"Australien","Austria":"Österreich","Azerbaijan":"Aserbaidschan",
  "Bahrain":"Bahrain","Bangladesh":"Bangladesch","Belarus":"Weißrussland",
  "Belgium":"Belgien","Bolivia":"Bolivien",
  "Bosnia and Herzegovina":"Bosnien und Herzegowina","Brazil":"Brasilien",
  "Bulgaria":"Bulgarien","Cambodia":"Kambodscha","Cameroon":"Kamerun",
  "Canada":"Kanada","Chile":"Chile","China":"China","Colombia":"Kolumbien",
  "Congo":"Kongo","Costa Rica":"Costa Rica","Croatia":"Kroatien",
  "Cuba":"Kuba","Cyprus":"Zypern","Czech Republic":"Tschechien",
  "Denmark":"Dänemark","Dominican Republic":"Dominikanische Republik",
  "DR Congo":"DR Kongo","Ecuador":"Ecuador","Egypt":"Ägypten",
  "El Salvador":"El Salvador","Estonia":"Estland","Ethiopia":"Äthiopien",
  "Finland":"Finnland","France":"Frankreich","Georgia":"Georgien",
  "Germany":"Deutschland","Ghana":"Ghana","Greece":"Griechenland",
  "Guatemala":"Guatemala","Guinea":"Guinea","Haiti":"Haiti",
  "Honduras":"Honduras","Hungary":"Ungarn","Iceland":"Island",
  "India":"Indien","Indonesia":"Indonesien","Iran":"Iran","Iraq":"Irak",
  "Ireland":"Irland","Israel":"Israel","Italy":"Italien",
  "Ivory Coast":"Elfenbeinküste","Jamaica":"Jamaika","Japan":"Japan",
  "Jordan":"Jordanien","Kazakhstan":"Kasachstan","Kenya":"Kenia",
  "Kosovo":"Kosovo","Kuwait":"Kuwait","Kyrgyzstan":"Kirgisistan",
  "Laos":"Laos","Latvia":"Lettland","Lebanon":"Libanon","Libya":"Libyen",
  "Liechtenstein":"Liechtenstein","Lithuania":"Litauen","Luxembourg":"Luxemburg",
  "Malaysia":"Malaysia","Mali":"Mali","Malta":"Malta","Mexico":"Mexiko",
  "Moldova":"Moldau","Mongolia":"Mongolei","Montenegro":"Montenegro",
  "Morocco":"Marokko","Mozambique":"Mosambik","Myanmar":"Myanmar",
  "Nepal":"Nepal","Netherlands":"Niederlande","New Zealand":"Neuseeland",
  "Nicaragua":"Nicaragua","Nigeria":"Nigeria","North Korea":"Nordkorea",
  "North Macedonia":"Nordmazedonien","Norway":"Norwegen","Oman":"Oman",
  "Pakistan":"Pakistan","Palestine":"Palästina","Panama":"Panama",
  "Paraguay":"Paraguay","Peru":"Peru","Philippines":"Philippinen",
  "Poland":"Polen","Portugal":"Portugal","Qatar":"Katar",
  "Romania":"Rumänien","Russia":"Russland","Rwanda":"Ruanda",
  "Saudi Arabia":"Saudi-Arabien","Senegal":"Senegal","Serbia":"Serbien",
  "Singapore":"Singapur","Slovakia":"Slowakei","Slovenia":"Slowenien",
  "Somalia":"Somalia","South Africa":"Südafrika","South Korea":"Südkorea",
  "Spain":"Spanien","Sri Lanka":"Sri Lanka","Sudan":"Sudan",
  "Sweden":"Schweden","Switzerland":"Schweiz","Syria":"Syrien",
  "Taiwan":"Taiwan","Tajikistan":"Tadschikistan","Tanzania":"Tansania",
  "Thailand":"Thailand","Togo":"Togo","Tunisia":"Tunesien",
  "Turkey":"Türkei","Türkiye":"Türkei","Uganda":"Uganda","Ukraine":"Ukraine",
  "United Arab Emirates":"Vereinigte Arabische Emirate",
  "United Kingdom":"Vereinigtes Königreich",
  "United States":"Vereinigte Staaten von Amerika",
  "Uruguay":"Uruguay","Uzbekistan":"Usbekistan","Venezuela":"Venezuela",
  "Vietnam":"Vietnam","Yemen":"Jemen","Zambia":"Sambia","Zimbabwe":"Simbabwe",
  "Other":"Sonstiges",
};
const COUNTRY_ALIASES: Record<string,string> = {
  "UK":"Vereinigtes Königreich",
  "USA":"Vereinigte Staaten von Amerika","US":"Vereinigte Staaten von Amerika",
  "UAE":"Vereinigte Arabische Emirate",
  "Bosnia":"Bosnien und Herzegowina",
};
function toGermanCountry(raw: string): string {
  if (!raw?.trim()) return raw;
  const t = raw.trim();
  return COUNTRY_DE[t] ?? COUNTRY_ALIASES[t] ?? t;
}
const CITIZENSHIP_DE: Record<string,string> = {
  "Afghan":"afghanisch","Albanian":"albanisch","Algerian":"algerisch",
  "American":"amerikanisch","Angolan":"angolanisch","Argentine":"argentinisch",
  "Armenian":"armenisch","Australian":"australisch","Austrian":"österreichisch",
  "Azerbaijani":"aserbaidschanisch","Bahraini":"bahrainisch","Bangladeshi":"bangladeschisch",
  "Belarusian":"weißrussisch","Belgian":"belgisch","Bolivian":"bolivianisch",
  "Bosnian":"bosnisch-herzegowinisch","Brazilian":"brasilianisch","British":"britisch",
  "Bulgarian":"bulgarisch","Burmese":"myanmarisch","Cambodian":"kambodschanisch",
  "Cameroonian":"kamerunisch","Canadian":"kanadisch","Chilean":"chilenisch",
  "Chinese":"chinesisch","Colombian":"kolumbianisch","Congolese":"kongolesisch",
  "Croatian":"kroatisch","Cuban":"kubanisch","Cypriot":"zypriotisch",
  "Czech":"tschechisch","Danish":"dänisch","Dominican":"dominikanisch",
  "Dutch":"niederländisch","Ecuadorian":"ecuadorianisch","Egyptian":"ägyptisch",
  "Emirati":"emiratisch","Estonian":"estnisch","Ethiopian":"äthiopisch",
  "Filipino":"philippinisch","Finnish":"finnisch","French":"französisch",
  "Georgian":"georgisch","German":"deutsch","Ghanaian":"ghanaisch",
  "Greek":"griechisch","Guatemalan":"guatemaltekisch","Haitian":"haitianisch",
  "Hungarian":"ungarisch","Icelandic":"isländisch","Indian":"indisch",
  "Indonesian":"indonesisch","Iranian":"iranisch","Iraqi":"irakisch",
  "Irish":"irisch","Israeli":"israelisch","Italian":"italienisch",
  "Ivorian":"ivorisch","Jamaican":"jamaikanisch","Japanese":"japanisch",
  "Jordanian":"jordanisch","Kazakh":"kasachisch","Kenyan":"kenianisch",
  "Korean":"südkoreanisch","Kuwaiti":"kuwaitisch","Kyrgyz":"kirgisisch",
  "Latvian":"lettisch","Lebanese":"libanesisch","Libyan":"libysch",
  "Lithuanian":"litauisch","Luxembourgish":"luxemburgisch","Malaysian":"malaysisch",
  "Malian":"malisch","Maltese":"maltesisch","Mexican":"mexikanisch",
  "Moldovan":"moldauisch","Mongolian":"mongolisch","Montenegrin":"montenegrinisch",
  "Moroccan":"marokkanisch","Mozambican":"mosambikanisch","Nepali":"nepalesisch",
  "New Zealander":"neuseeländisch","Nicaraguan":"nicaraguanisch","Nigerian":"nigerianisch",
  "North Korean":"nordkoreanisch","Norwegian":"norwegisch","Omani":"omanisch",
  "Pakistani":"pakistanisch","Palestinian":"palästinensisch","Panamanian":"panamaisch",
  "Paraguayan":"paraguayisch","Peruvian":"peruanisch","Polish":"polnisch",
  "Portuguese":"portugiesisch","Qatari":"katarisch","Romanian":"rumänisch",
  "Russian":"russisch","Rwandan":"ruandisch","Saudi":"saudi-arabisch",
  "Senegalese":"senegalesisch","Serbian":"serbisch","Singaporean":"singapurisch",
  "Slovak":"slowakisch","Slovenian":"slowenisch","Somali":"somalisch",
  "South African":"südafrikanisch","South Korean":"südkoreanisch","Spanish":"spanisch",
  "Sri Lankan":"sri-lankisch","Sudanese":"sudanesisch","Swedish":"schwedisch",
  "Swiss":"schweizerisch","Syrian":"syrisch","Taiwanese":"taiwanesisch",
  "Tajik":"tadschikisch","Thai":"thailändisch","Togolese":"togoisch",
  "Tunisian":"tunesisch","Turkish":"türkisch","Ugandan":"ugandisch",
  "Ukrainian":"ukrainisch","Uruguayan":"uruguayisch","Uzbek":"usbekisch",
  "Venezuelan":"venezolanisch","Vietnamese":"vietnamesisch","Yemeni":"jemenitisch",
  "Zambian":"sambisch","Zimbabwean":"simbabwisch",
};
const CITIZENSHIP_ALIASES: Record<string,string> = {
  "United States":"amerikanisch","USA":"amerikanisch","US":"amerikanisch",
  "United Kingdom":"britisch","UK":"britisch",
  "Switzerland":"schweizerisch","Netherlands":"niederländisch",
  "New Zealand":"neuseeländisch","Saudi Arabia":"saudi-arabisch",
  "South Africa":"südafrikanisch","South Korea":"südkoreanisch",
  "UAE":"emiratisch","United Arab Emirates":"emiratisch",
  "Ivory Coast":"ivorisch","Congo":"kongolesisch","DR Congo":"kongolesisch",
  "Myanmar":"myanmarisch","Burma":"myanmarisch",
  "North Korea":"nordkoreanisch","Sri Lanka":"sri-lankisch","Taiwan":"taiwanesisch",
};
function toGermanCitizenship(raw: string): string {
  if (!raw?.trim()) return raw;
  return raw.split(",").map(s => {
    const t = s.trim();
    return CITIZENSHIP_DE[t] ?? CITIZENSHIP_ALIASES[t] ?? COUNTRY_DE[t] ?? t;
  }).join(", ");
}
const ALL_COUNTRIES: string[] = Object.keys(COUNTRY_DE).sort();
const ALL_CITIZENSHIPS: string[] = Object.keys(CITIZENSHIP_DE).sort();

// ─── pdf-lib loader (identical pattern to Berlin) ─────────────────
async function loadPdfLib(): Promise<any> {
  if ((window as any).PDFLib) return (window as any).PDFLib;
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload = () => res((window as any).PDFLib);
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

// Strips non-latin-1 characters (identical to Berlin safe())
const safe = (s: string) => (s || "").replace(/[^ -ÿ]/g, "");

const fmtDate = (iso: string): string => {
  if (!iso) return "";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}.${mm}.${yyyy}`;
};

function savePDF(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 6000);
}

// Radio button widget positions hardcoded from template PDF (pypdf, page 0, bottom-left origin).
// cx/cy = center of each widget's /Rect. Used for direct circle drawing — bypasses form API.
const RADIO_DOTS: Record<string, Record<string, { cx: number; cy: number }>> = {
  geschl1: { "Männlich":[175.8,457.3], "Weiblich":[206.4,457.3], "ohne Angabe":[238.1,457.3], "Divers":[270.8,457.3] },
  geschl2: { "Männlich":[175.8,440.6], "Weiblich":[206.4,440.6], "ohne Angabe":[238.4,440.6], "Divers":[270.8,440.9] },
  geschl3: { "Männlich":[175.8,424.1], "Weiblich":[206.4,424.1], "ohne Angabe":[238.1,424.1], "Divers":[270.8,424.1] },
  geschl4: { "Männlich":[175.8,407.5], "Weiblich":[206.4,407.5], "ohne Angabe":[238.1,407.5], "Divers":[270.8,407.5] },
  wohnung:  { "einzige Wohnung":[52.0,599.8], "Hauptwohnung":[145.1,599.8], "Nebenwohnung":[227.4,599.8] },
  geschl6:  { "Männlich":[102.8,113.4], "Weiblich":[134.0,113.8], "ohne Angabe":[165.3,113.4], "Divers":[198.0,113.4] },
  getrennt1:{ "Ja":[499.7,171.5], "Nein":[535.6,171.5] },
} as unknown as Record<string, Record<string, { cx: number; cy: number }>>;

// ─── Munich PDF filler ────────────────────────────────────────────
async function fillMunichSheet(d: MunichForm): Promise<Uint8Array> {
  const { PDFDocument, PDFName, PDFString, rgb } = await loadPdfLib();
  const templateBytes = await fetch("/munich-anmeldung.pdf").then(r => r.arrayBuffer());
  const doc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = doc.getForm();

  // Text field helper — identical guard to Berlin
  const txt = (n: string, v: string) => {
    if (!v?.trim()) return;
    try { form.getTextField(n).setText(safe(v)); } catch {}
  };

  // Direct dict setter for fields with /Kids + /AA JavaScript validation (e.g. einzug)
  // setText() silently fails on these; setting V directly on the dict works.
  const txtDirect = (n: string, v: string) => {
    if (!v?.trim()) return;
    try {
      const fields = form.getFields();
      const field = fields.find((f: any) => { try { return f.getName() === n; } catch { return false; } });
      if (!field) return;
      const acro = (field as any).acroField;
      acro.dict.set(PDFName.of("V"), PDFString.of(safe(v)));
      // Propagate to child widget if present
      const kids = acro.Kids?.();
      if (kids?.length) kids[0].dict.set(PDFName.of("V"), PDFString.of(safe(v)));
    } catch {}
  };

  // Radio button helper — draw filled circle directly on page (bypasses form API entirely).
  // Coordinates come from RADIO_DOTS (hardcoded from template via pypdf).
  // Also sets V on the parent field so interactive PDF viewers show selection too.
  const page0 = doc.getPages()[0];
  const rdo = (fieldName: string, exportVal: string) => {
    if (!exportVal) return;
    // Set V on parent for completeness
    try {
      const fields = form.getFields();
      const field = fields.find((f: any) => { try { return f.getName() === fieldName; } catch { return false; } });
      if (field) (field as any).acroField.dict.set(PDFName.of("V"), PDFName.of(exportVal));
    } catch {}
    // Draw dot
    const pos = (RADIO_DOTS[fieldName] as any)?.[exportVal] as [number, number] | undefined;
    if (!pos) return;
    page0.drawCircle({ x: pos[0], y: pos[1], size: 3, color: rgb(0, 0, 0) });
  };

  // Choice field helper (combobox/listbox) — Munich famst1-4, rel1-4, art1-4
  const sel = (n: string, v: string) => {
    if (!v) return;
    try { form.getDropdown(n).select(v); } catch {
      try { form.getOptionList(n).select([v]); } catch {}
    }
  };

  // ── New address ──────────────────────────────────────────────────
  const streetLine = [d.newStreet + " " + d.newNumber, d.newAddExtra]
    .map(s => s.trim()).filter(Boolean).join(", ");
  // einzug is an 8-cell comb — dots are printed on the form, value must be DDMMYYYY
  const einzugVal = d.moveInDate ? (() => { const [y,m,dd] = d.moveInDate.split("-"); return dd+m+y; })() : "";
  txtDirect(MF.EINZUG, einzugVal);
  txt(MF.NEUW_STRASSE, safe(streetLine));
  txt(MF.NW_PLZ,       safe(d.newPostalCode));
  rdo(MF.WOHNUNG,      WOHNUNG_VALS[d.newResType as keyof typeof WOHNUNG_VALS] ?? "einzige Wohnung");

  // ── Previous address ─────────────────────────────────────────────
  const prevIsGerman = !d.prevCountry || ["germany","deutschland"].includes(d.prevCountry.toLowerCase());
  if (prevIsGerman && (d.prevStreet || d.prevCity)) {
    txt(MF.BISHWO_STRASSE, safe(`${d.prevStreet} ${d.prevNumber}`.trim()));
    txt(MF.BISHWO_PLZ,     safe(d.prevPostalCode));
    txt(MF.BISHWO_ORT,     safe(d.prevCity));
  } else if (!prevIsGerman && d.prevCountry) {
    // Foreign previous address: put country name in the Ort field
    txt(MF.BISHWO_ORT, safe(toGermanCountry(d.prevCountry)));
  }

  // ── People (up to 4) ────────────────────────────────────────────
  const today = new Date();
  let legalRepNeeded = false;
  let legalRepName = "";

  d.people.forEach((p, i) => {
    if (i >= MAX_PEOPLE) return;

    txt(MF.FAM[i],       safe(p.lastName.toUpperCase()));
    txt(MF.VORN[i],      safe(p.firstName));
    txt(MF.NAME[i],      safe(p.birthName));         // Geburtsname
    txt(MF.GEBDAT[i],    fmtDate(p.birthDate));
    txt(MF.GEBORT[i],    safe(
      [p.birthPlace, toGermanCountry(p.birthCountry)].filter(Boolean).join(", ")
    ));
    txt(MF.STAATSANG[i], safe(toGermanCitizenship(p.citizenship)));
    txt(MF.ORDENS[i],    safe(p.artisticName));
    // gr1-4 = Doktorgrad — leave blank for expats

    // Gender radio button
    rdo(MF.GESCHL[i], GESCHL_VALS[p.gender] ?? "ohne Angabe");

    // Marital status dropdown
    // Children are always ledig; primary/spouse get household status
    const mCode = p.relationship === "child"
      ? "LD"
      : (FAMST_CODE[d.maritalStatus] ?? "LD");
    sel(MF.FAMST[i], mCode);

    // Religion dropdown
    sel(MF.REL[i], REL_CODE[p.religion] ?? "-");

    // Marriage date+place per person (only if married/partnership, not child)
    if (p.relationship !== "child" && ["verheiratet","partnerschaft","getrennt"].includes(d.maritalStatus)) {
      const eheVal = [fmtDate(d.marriageDate), d.marriagePlace, toGermanCountry(d.marriageCountry)]
        .filter(Boolean).join(", ");
      txt(MF.DAT[i], safe(eheVal));
    }

    // Document fields (Munich: 4 slots, one per person, up to person 4)
    if (!p.fillHandwritten) {
      sel(MF.ART[i],          ART_CODE[p.docType] ?? "RP");
      txt(MF.SERIEN[i],       safe(p.docSerial));
      txt(MF.AUSSTELLDAT[i],  fmtDate(p.docDate));
      txt(MF.AUSSTELLB[i],    safe(p.docAuthority));
      txt(MF.GUELTIG[i],      fmtDate(p.docValidUntil));
    } else {
      // Still fill doc type even if handwritten (helps clerk)
      sel(MF.ART[i], ART_CODE[p.docType] ?? "RP");
    }

    // Check for minors
    if (p.birthDate) {
      const age = (today.getTime() - new Date(p.birthDate).getTime())
        / (365.25 * 24 * 3600 * 1000);
      if (age < 18) {
        legalRepNeeded = true;
        const primary = d.people.find(pp => pp.relationship === "primary");
        if (primary) legalRepName = `${primary.firstName} ${primary.lastName}`;
      }
    }
  });

  // Legal representative (for minors)
  if (legalRepNeeded && legalRepName) {
    txt(MF.GESETZLVER, safe(legalRepName));
  }

  // Non-moving spouse / registered partner
  const nms = d.nonMovingSpouse;
  if (nms && (nms.firstName || nms.lastName)) {
    txt(MF.NMS_FAM,    safe(nms.lastName.toUpperCase()));
    txt(MF.NMS_VORN,   safe(nms.firstName));
    txt(MF.NMS_GEBDAT, fmtDate(nms.birthDate));
    txt(MF.NMS_GEBORT, safe([nms.birthPlace, toGermanCountry(nms.birthCountry)].filter(Boolean).join(", ")));
    rdo(MF.NMS_GESCHL,  GESCHL_VALS[nms.gender] ?? "ohne Angabe");
    rdo(MF.NMS_GETRENNT, nms.separated ? "Ja" : "Nein");
    txt(MF.NMS_ANSCHR,  safe(nms.street));
    txt(MF.NMS_ANSCHR_A, safe(nms.postalCity));
  }

  // Flatten form so drawn radio dots are visible and not hidden by AcroForm widget overlay
  try { form.flatten(); } catch {}

  return doc.save();
}

async function buildMunichPDF(d: MunichForm): Promise<{ bytes: Uint8Array; name: string }> {
  const bytes = await fillMunichSheet(d);
  const lastName = d.people[0]?.lastName?.toLowerCase() || "anmeldung";
  return { bytes, name: `anmeldung-muenchen-${lastName}.pdf` };
}

// ─── Munich Guide PDF (personalised checklist + guide, 2 pages) ───
async function buildMunichGuidePDF(d: MunichForm): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const HV = await doc.embedFont(StandardFonts.Helvetica);
  const HB = await doc.embedFont(StandardFonts.HelveticaBold);
  const HI = await doc.embedFont(StandardFonts.HelveticaOblique);

  const NAVY  = rgb(0.08, 0.14, 0.38);
  const BLUE  = rgb(0.14, 0.35, 0.82);
  const BLUEL = rgb(0.93, 0.96, 1.00);
  const GRN   = rgb(0.04, 0.44, 0.24);
  const GRNL  = rgb(0.93, 0.99, 0.95);
  const AMB   = rgb(0.54, 0.28, 0.00);
  const AMBL  = rgb(1.00, 0.97, 0.88);
  const RED   = rgb(0.60, 0.07, 0.07);
  const REDL  = rgb(1.00, 0.93, 0.93);
  const DARK  = rgb(0.13, 0.16, 0.22);
  const MID   = rgb(0.32, 0.37, 0.47);
  const MUTE  = rgb(0.52, 0.57, 0.65);
  const WHITE = rgb(1, 1, 1);
  const BGROW = rgb(0.97, 0.975, 0.988);
  const LNCLR = rgb(0.88, 0.90, 0.94);

  const fmtToday = (): string => {
    const t = new Date();
    return `${String(t.getDate()).padStart(2,"0")}.${String(t.getMonth()+1).padStart(2,"0")}.${t.getFullYear()}`;
  };

  const p1        = d.people[0] ?? EMPTY_PERSON;
  const isEU       = d.isEU;
  const isMarried  = ["verheiratet","partnerschaft","getrennt"].includes(d.maritalStatus);
  const isDivorced = d.maritalStatus === "geschieden";
  const isWidowed  = d.maritalStatus === "verwitwet";
  const hasForeignBirth    = d.people.some(p => p.birthCountry && !["germany","deutschland"].includes(p.birthCountry.toLowerCase()));
  const hasForeignMarriage = isMarried && d.marriageCountry && !["germany","deutschland"].includes(d.marriageCountry.toLowerCase());
  const maritalLabel: Record<string,string> = { verheiratet:"Married", partnerschaft:"Partnership", geschieden:"Divorced", verwitwet:"Widowed", ledig:"Single", getrennt:"Separated" };

  const wrapPx = (text: string, maxPx: number, fs: number): string[] => {
    if (!text?.trim()) return [];
    const charW = fs * 0.52;
    const maxCh = Math.floor(maxPx / charW);
    const words = safe(text).split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const candidate = cur ? cur + " " + w : w;
      if (candidate.length > maxCh) { if (cur) lines.push(cur); cur = w; }
      else cur = candidate;
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  };

  const PW = 595.28, PH = 841.89, ML = 50, MR = 50, CW = PW - ML - MR, LH = 15.4, FOOTER_H = 40;

  const secBlock = (page: any, title: string, cursor: number): number => {
    const H = 26;
    const barY = PH - cursor - H;
    page.drawRectangle({ x: ML, y: barY, width: CW, height: H, color: BLUEL });
    page.drawRectangle({ x: ML, y: barY, width: 4, height: H, color: NAVY });
    page.drawText(title.toUpperCase(), { x: ML + 12, y: barY + 8, size: 8.5, font: HB, color: NAVY });
    return cursor + H + 10;
  };

  const checkItem = (page: any, text: string, cursor: number, tag: "required"|"recommended", note?: string, warn?: string): number => {
    const FS = 11, NOTE_FS = 9.5, WARN_FS = 9.5, PAD_T = 9, PAD_B = 9;
    const TX_X = ML + 28, TX_W = CW - 30;
    const mainLines = wrapPx(text, TX_W, FS);
    const noteLines = note ? wrapPx("Note: " + note, TX_W - 4, NOTE_FS) : [];
    const warnLines = warn ? wrapPx(warn, TX_W - 4, WARN_FS) : [];
    const mainH = mainLines.length * LH;
    const noteH = noteLines.length > 0 ? noteLines.length * (NOTE_FS * 1.45) + 5 : 0;
    const warnH = warnLines.length > 0 ? warnLines.length * (WARN_FS * 1.45) + 12 : 0;
    const totalH = PAD_T + mainH + noteH + warnH + PAD_B;
    if (cursor + totalH > PH - FOOTER_H - 10) return cursor;
    const tagC = tag === "required"
      ? { bg: REDL, dot: RED, pill: "Required" }
      : { bg: GRNL, dot: GRN, pill: "Recommended" };
    const cardY = PH - cursor - totalH;
    page.drawRectangle({ x: ML, y: cardY, width: CW, height: totalH, color: tagC.bg, borderRadius: 5 });
    page.drawRectangle({ x: ML, y: cardY, width: 4, height: totalH, color: tagC.dot, borderRadius: 5 });
    const cbY = PH - cursor - PAD_T - FS;
    page.drawRectangle({ x: ML + 10, y: cbY + 1, width: 10, height: 10, color: WHITE, borderColor: tagC.dot, borderWidth: 1.3 });
    let ty = cursor + PAD_T;
    for (let i = 0; i < mainLines.length; i++) {
      page.drawText(mainLines[i], { x: TX_X, y: PH - ty - FS, size: FS, font: i === 0 ? HB : HV, color: DARK });
      ty += LH;
    }
    const pillW = tagC.pill.length * 5.2 + 10;
    const pillY = PH - cursor - PAD_T - NOTE_FS;
    page.drawRectangle({ x: ML + CW - pillW - 2, y: pillY + 1, width: pillW, height: 13, color: tagC.dot, borderRadius: 3 });
    page.drawText(tagC.pill, { x: ML + CW - pillW + 2, y: pillY + 3.5, size: 7.5, font: HB, color: WHITE });
    if (noteLines.length > 0) {
      ty += 4;
      for (const nl of noteLines) { page.drawText(nl, { x: TX_X + 2, y: PH - ty - NOTE_FS, size: NOTE_FS, font: HI, color: MID }); ty += NOTE_FS * 1.45; }
    }
    if (warnLines.length > 0) {
      ty += 6;
      const warnBoxH = warnLines.length * (WARN_FS * 1.45) + 8;
      const warnBoxY = PH - ty - warnBoxH;
      page.drawRectangle({ x: TX_X - 2, y: warnBoxY, width: TX_W - 4, height: warnBoxH, color: rgb(1, 0.91, 0.91), borderRadius: 3 });
      for (const wl of warnLines) { page.drawText(wl, { x: TX_X + 4, y: PH - ty - WARN_FS, size: WARN_FS, font: HB, color: RED }); ty += WARN_FS * 1.45; }
    }
    return cursor + totalH + 7;
  };

  const calloutBlock = (page: any, text: string, cursor: number, bgC: any, stripeC: any): number => {
    const FS = 10, PAD = 10;
    const lines = wrapPx(text, CW - 20, FS);
    const blockH = lines.length * (FS * 1.45) + PAD * 2;
    if (cursor + blockH > PH - FOOTER_H) return cursor;
    const boxY = PH - cursor - blockH;
    page.drawRectangle({ x: ML, y: boxY, width: CW, height: blockH, color: bgC, borderRadius: 6 });
    page.drawRectangle({ x: ML, y: boxY, width: 4, height: blockH, color: stripeC, borderRadius: 6 });
    let ty = cursor + PAD;
    for (let i = 0; i < lines.length; i++) {
      page.drawText(lines[i], { x: ML + 14, y: PH - ty - FS, size: FS, font: i === 0 ? HB : HV, color: DARK });
      ty += FS * 1.45;
    }
    return cursor + blockH + 8;
  };

  const bulletBlock = (page: any, label: string, body: string, cursor: number, dotC = BLUE): number => {
    const FS = 10.5, DOT = ML + 8, TX = ML + 18, TW = CW - 20;
    const labelW = label.length * FS * 0.55;
    const bodyLines = wrapPx(body, TW - labelW - 4, FS);
    const blockH = bodyLines.length * (FS * 1.4);
    if (cursor + blockH > PH - FOOTER_H) return cursor;
    page.drawRectangle({ x: DOT, y: PH - cursor - FS - 1, width: 4, height: 4, color: dotC, borderRadius: 2 });
    page.drawText(safe(label), { x: TX, y: PH - cursor - FS, size: FS, font: HB, color: dotC });
    for (let i = 0; i < bodyLines.length; i++) {
      const lineX = i === 0 ? TX + labelW + 4 : TX;
      page.drawText(safe(bodyLines[i]), { x: lineX, y: PH - cursor - FS - i * FS * 1.4, size: FS, font: HV, color: DARK });
    }
    return cursor + blockH + 4;
  };

  // ═══ PAGE 1 — PERSONALISED CHECKLIST ═══
  const p1pg = doc.addPage([PW, PH] as [number, number]);
  const HDR_H = 82;
  p1pg.drawRectangle({ x: 0, y: PH - HDR_H, width: PW, height: HDR_H, color: NAVY });
  const LOGO_X = PW - ML - 22;
  p1pg.drawRectangle({ x: LOGO_X, y: PH - HDR_H + 46, width: 22, height: 22, color: BLUE, borderRadius: 4 });
  p1pg.drawText("R", { x: LOGO_X + 6, y: PH - HDR_H + 53, size: 14, font: HB, color: WHITE });
  p1pg.drawText("readyexpat.de", { x: LOGO_X - 52, y: PH - HDR_H + 47, size: 7, font: HV, color: rgb(0.60, 0.76, 1.00) });
  p1pg.drawText("Your Personalised Munich Anmeldung Checklist", { x: ML, y: PH - 34, size: 18, font: HB, color: WHITE });
  p1pg.drawText(safe("ReadyExpat München  ·  Anmeldung  ·  " + (p1.firstName + " " + p1.lastName).trim() + "  ·  " + fmtToday()), {
    x: ML, y: PH - 52, size: 9, font: HV, color: rgb(0.70, 0.82, 1.00),
  });

  const situBadges: [string, any][] = [
    [isEU ? "EU Citizen" : "Non-EU Citizen", isEU ? GRN : AMB],
    [maritalLabel[d.maritalStatus] ?? "Single", BLUE],
    [`${d.people.length} person${d.people.length > 1 ? "s" : ""}`, NAVY],
  ];
  let bx = ML;
  for (const [t, c] of situBadges) {
    if (!t.trim()) continue;
    const bw = t.length * 5.8 + 14;
    p1pg.drawRectangle({ x: bx, y: PH - 73, width: bw, height: 14, color: c, borderRadius: 3 });
    p1pg.drawText(safe(t), { x: bx + 6, y: PH - 68, size: 7.5, font: HB, color: WHITE });
    bx += bw + 8;
  }

  let cur1 = HDR_H + 16;
  type CItem = { text: string; tag: "required"|"recommended"; note?: string; warn?: string };
  const items: CItem[] = [];

  items.push({ text: "Munich Anmeldung form (printed on paper) — do NOT bring a phone screen", tag: "required" });
  items.push({
    text: "Wohnungsgeberbestätigung — signed original from your landlord",
    tag: "required",
    note: "Check your move-in documents and email first — many landlords include it automatically. Under §19 BMG they are legally required to provide it (refusal = fine up to €1,000 for the landlord).",
  });

  for (const p of d.people) {
    if (p.firstName || p.lastName) {
      if (isEU) {
        items.push({ text: `Passport or national ID card: ${safe(p.firstName)} ${safe(p.lastName)}`.trim(), tag: "required", note: "EU/EEA citizen — passport or national ID card accepted." });
      } else {
        items.push({ text: `Passport (original, valid): ${safe(p.firstName)} ${safe(p.lastName)}`.trim(), tag: "required", note: "Non-EU citizen — passport only, national ID cards are not accepted." });
      }
    }
  }

  for (const p of d.people) {
    if ((p.firstName || p.lastName) && p.birthCountry && !["germany","deutschland"].includes(p.birthCountry.toLowerCase())) {
      items.push({
        text: `Birth certificate: ${safe(p.firstName)} ${safe(p.lastName)}`.trim(),
        tag: "required",
        note: `Born in ${p.birthCountry}. Original required. CERTIFIED TRANSLATION REQUIRED — beglaubigte Übersetzung by a sworn translator (approx. €50–150).`,
      });
    }
  }

  items.push({ text: "Appointment confirmation — email printout or screenshot", tag: "required" });

  if (!isEU) {
    items.push({
      text: "Aufenthaltstitel or Visa — ONLY if you already have one",
      tag: "required",
      note: "You do NOT need a visa before registering. If you have none yet, go without — register first.",
      warn: "Do NOT delay your Anmeldung waiting for a visa. Register first.",
    });
  }

  if (isMarried) {
    items.push({
      text: "Marriage or civil partnership certificate — original document",
      tag: "required",
      warn: hasForeignMarriage ? "TRANSLATION REQUIRED: bring a certified German translation (beglaubigte Übersetzung) by a sworn translator." : undefined,
    });
  }
  if (isDivorced) items.push({ text: "Divorce decree — NOT required for Anmeldung", tag: "recommended", note: "Marital status is self-declared on the form." });
  if (isWidowed)  items.push({ text: "Death certificate — NOT required for Anmeldung", tag: "recommended", note: "Marital status is self-declared." });

  if (d.nonMovingSpouse) {
    items.push({
      text: `Non-moving spouse/partner details: ${safe(d.nonMovingSpouse.firstName)} ${safe(d.nonMovingSpouse.lastName)}`.trim(),
      tag: "recommended",
      note: "Their details were filled in the form's non-moving spouse section. They do not need to be present at your appointment.",
    });
  }

  items.push({ text: "Rental contract (Mietvertrag) — a copy, not original", tag: "recommended", note: "Not mandatory, but useful if the clerk has questions about your address." });

  cur1 = secBlock(p1pg, "Documents to bring to the Bürgerbüro", cur1);
  let curPage1 = p1pg;
  const overflowToNextPage = () => {
    curPage1.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
    curPage1.drawText("ReadyExpat München  ·  Your personalised checklist  ·  continued", { x: ML, y: 14, size: 7.5, font: HV, color: MUTE });
    curPage1 = doc.addPage([PW, PH] as [number, number]);
    curPage1.drawRectangle({ x: 0, y: PH - 38, width: PW, height: 38, color: NAVY });
    curPage1.drawText("Your Personalised Munich Anmeldung Checklist (continued)", { x: ML, y: PH - 25, size: 13, font: HB, color: WHITE });
    cur1 = 52;
  };
  for (const item of items) {
    const prevCur = cur1;
    cur1 = checkItem(curPage1, item.text, cur1, item.tag, item.note, item.warn);
    if (cur1 === prevCur) {
      overflowToNextPage();
      cur1 = checkItem(curPage1, item.text, cur1, item.tag, item.note, item.warn);
    }
  }

  if (cur1 < PH - FOOTER_H - 50) {
    cur1 = calloutBlock(curPage1,
      "Letterbox (Briefkasten): After moving in, add your surname to your letterbox immediately. Official German mail is NOT delivered to unlabelled mailboxes. Your Steuer-ID (tax ID) arrives by post 2–4 weeks after registration.",
      cur1, GRNL, GRN);
  }

  curPage1.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
  curPage1.drawText("readyexpat.de  ·  Your personalised checklist  ·  Page 1 of 2", { x: ML, y: 14, size: 7.5, font: HV, color: MUTE });
  curPage1.drawText("muenchen.de", { x: ML + CW - 90, y: 14, size: 7.5, font: HV, color: BLUE });

  // ═══ PAGE 2 — MUNICH GUIDE ═══
  const p2pg = doc.addPage([PW, PH] as [number, number]);
  p2pg.drawRectangle({ x: 0, y: PH - HDR_H, width: PW, height: HDR_H, color: NAVY });
  p2pg.drawRectangle({ x: LOGO_X, y: PH - HDR_H + 46, width: 22, height: 22, color: BLUE, borderRadius: 4 });
  p2pg.drawText("R", { x: LOGO_X + 6, y: PH - HDR_H + 53, size: 14, font: HB, color: WHITE });
  p2pg.drawText("readyexpat.de", { x: LOGO_X - 52, y: PH - HDR_H + 47, size: 7, font: HV, color: rgb(0.60, 0.76, 1.00) });
  p2pg.drawText("Your Munich Anmeldung Guide", { x: ML, y: PH - 34, size: 20, font: HB, color: WHITE });
  const situStr = [
    isEU ? "EU/EEA citizen" : "Non-EU citizen",
    d.people.length > 1 ? `${d.people.length} people` : null,
    isMarried ? "married" : null,
    hasForeignBirth ? "foreign birth docs" : null,
  ].filter(Boolean).join(" · ");
  p2pg.drawText(safe("Prepared for " + (p1.firstName + " " + p1.lastName).trim() + " · " + situStr), {
    x: ML, y: PH - 55, size: 8.5, font: HI, color: rgb(0.60, 0.76, 1.00),
  });

  let cur2 = HDR_H + 12;
  if (isEU) {
    cur2 = calloutBlock(p2pg, "As an EU/EEA citizen, you can use a passport or national ID card — both are accepted. You must still appear in person at your local Bürgerbüro.", cur2, GRNL, GRN);
  } else {
    cur2 = calloutBlock(p2pg, "As a non-EU citizen, you must appear in person — online registration is not available. Bring your passport (national ID is NOT accepted for Anmeldung).", cur2, AMBL, AMB);
  }
  if (d.people.length > 1) {
    cur2 = calloutBlock(p2pg, safe(`You are registering ${d.people.length} people. Munich's Anmeldung form fits up to 4 people on one sheet — hand it in at the counter together.`), cur2, BLUEL, BLUE);
  }
  if (hasForeignBirth || hasForeignMarriage) {
    cur2 = calloutBlock(p2pg, "You have foreign documents. These must be accompanied by a certified German translation (beglaubigte Übersetzung). Cost: approx. €50–150 per document. Do not attend the appointment without these.", cur2, REDL, RED);
  }
  if (d.nonMovingSpouse) {
    cur2 = calloutBlock(p2pg, safe(`Your spouse/partner (${d.nonMovingSpouse.firstName} ${d.nonMovingSpouse.lastName}) is not moving with you. Their details were already filled into the form's non-moving spouse section — they do not need to attend your appointment.`), cur2, BLUEL, BLUE);
  }
  cur2 += 4;

  cur2 = secBlock(p2pg, "Booking your Bürgerbüro appointment", cur2);
  cur2 = bulletBlock(p2pg, "Book early:", "Munich Anmeldung appointments are booked through muenchen.de. Slots can be limited, especially during peak relocation months — book as early as possible after moving in.", cur2);
  cur2 = bulletBlock(p2pg, "Registering for others:", "As in many German cities, one person can often register the household with a written Vollmacht (power of attorney) plus the absent person's ID/passport copy — confirm this is accepted at your specific Bürgerbüro before relying on it.", cur2);
  cur2 = bulletBlock(p2pg, "14-day deadline:", "You must register within 14 days of moving in (§17 BMG). If no appointment is available in time, book the earliest one you can find and keep it as evidence.", cur2);
  cur2 += 4;

  cur2 = secBlock(p2pg, "Before you go — printing", cur2);
  cur2 = calloutBlock(p2pg, "Print on paper — the Bürgerbüro will NOT accept a phone screen. Sign the form in pen after printing (at the bottom: Datum, Unterschrift). Bring it in a folder, unfolded.", cur2, REDL, RED);
  cur2 = bulletBlock(p2pg, "DM / Rossmann:", "Self-service print kiosks are available at most branches. Approx. €0.10–0.15 per page.", cur2);
  cur2 += 4;

  cur2 = secBlock(p2pg, "After your appointment", cur2);
  cur2 = bulletBlock(p2pg, "Meldebestätigung:", "You receive your registration confirmation the same day. Keep it — you need it for banks, employers, and government services.", cur2);
  cur2 = bulletBlock(p2pg, "Steuer-ID:", "Your German tax ID arrives by post within a few weeks at your new address. Keep it permanently.", cur2);
  cur2 = bulletBlock(p2pg, "Letterbox (Briefkasten):", "Put your surname on your letterbox immediately after moving in. Official German mail is NOT delivered to unlabelled mailboxes.", cur2, GRN);
  if (isMarried) {
    const kirchStr = d.people.some(p => ["rk","ev"].includes(p.religion))
      ? "You registered a church affiliation — approx. 8–9% Kirchensteuer (church tax) applies on your income tax. To leave (Kirchenaustritt), visit the Amtsgericht (district court) — approx. €30–40 fee."
      : "You did not register a church affiliation — no church tax applies.";
    cur2 = bulletBlock(p2pg, "Kirchensteuer:", kirchStr, cur2);
  } else {
    cur2 = bulletBlock(p2pg, "Kirchensteuer:", "If you declared Catholic or Protestant membership, approx. 8–9% church tax on your income tax applies automatically. To leave: you must formally exit (Kirchenaustritt) at the Amtsgericht — approx. €30–40 fee.", cur2);
  }
  cur2 += 4;

  const tipH = 40, tipY = FOOTER_H + 10;
  p2pg.drawRectangle({ x: ML, y: tipY, width: CW, height: tipH, color: NAVY, borderRadius: 6 });
  p2pg.drawText(safe("Good luck, " + (p1.firstName || "expat") + ". Bring a pen. Arrive calm. The form does the talking."), { x: ML + 14, y: tipY + tipH - 16, size: 9.5, font: HB, color: WHITE });
  p2pg.drawText("Next step: book your Bürgerbüro appointment at muenchen.de.", { x: ML + 14, y: tipY + tipH - 29, size: 9, font: HV, color: rgb(0.80, 0.89, 1.00) });

  p2pg.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
  p2pg.drawText("readyexpat.de  ·  Munich Guide  ·  Page 2 of 2  ·  Information without guarantee", { x: ML, y: 14, size: 7.5, font: HV, color: MUTE });
  p2pg.drawText("muenchen.de", { x: ML + CW - 90, y: 14, size: 7.5, font: HV, color: BLUE });

  return doc.save();
}

// ─── Validation ───────────────────────────────────────────────────
const STEPS: WizardStep[] = ["origin","new-address","prev-address","people","status","documents","review"];

function getError(step: WizardStep, f: MunichForm): string {
  if (step === "origin") {
    if (!f.originCountry) return "Please select your origin country.";
  }
  if (step === "new-address") {
    if (!f.newStreet)     return "Street name is required.";
    if (!f.newNumber)     return "House number is required.";
    if (!f.newPostalCode) return "Postal code is required.";
    if (!f.moveInDate)    return "Move-in date is required.";
  }
  if (step === "prev-address") {
    if (!f.prevCountry)   return "Please select your previous country.";
    const prevIsGerman = ["germany","deutschland"].includes(f.prevCountry.toLowerCase());
    if (prevIsGerman && !f.prevStreet) return "Previous street is required for a German address.";
    if (prevIsGerman && !f.prevCity)   return "Previous city is required.";
  }
  if (step === "people") {
    for (let i = 0; i < f.people.length; i++) {
      const p = f.people[i];
      if (!p.lastName)    return `Person ${i+1}: last name is required.`;
      if (!p.firstName)   return `Person ${i+1}: first name is required.`;
      if (!p.birthDate)   return `Person ${i+1}: birth date is required.`;
      if (!p.gender)      return `Person ${i+1}: gender is required.`;
      if (!p.citizenship) return `Person ${i+1}: citizenship is required.`;
    }
  }
  if (step === "status") {
    if (!f.maritalStatus) return "Please select a marital status.";
    if (["verheiratet","partnerschaft","getrennt"].includes(f.maritalStatus) && !f.marriageDate)
      return "Marriage / partnership date is required.";
  }
  return "";
}

const STEP_LABELS: Record<WizardStep, string> = {
  "origin": "Origin", "new-address": "New Address", "prev-address": "Previous Address",
  "people": "People", "status": "Status", "documents": "Documents", "review": "Review",
};

function calcMunichScore(f: MunichForm): number {
  let filled = 0;
  const total = 6;
  if (f.originCountry) filled++;
  if (f.newStreet && f.newPostalCode && f.moveInDate) filled++;
  if (f.prevCountry) filled++;
  if (f.people.length > 0 && f.people.every(p => p.lastName && p.firstName && p.birthDate && p.citizenship)) filled++;
  if (f.maritalStatus) filled++;
  if (f.people.some(p => p.docSerial || p.fillHandwritten)) filled++;
  return Math.round((filled / total) * 100);
}

type MunichHack = { tag: "tip" | "warn" | "info"; title: string; tip: string };
const MUNICH_HACKS: Partial<Record<WizardStep, MunichHack[]>> = {
  "new-address": [
    { tag: "info", title: "Sole / Primary / Secondary residence", tip: "Sole residence = your only home in Germany. Primary = your main home if you're keeping a second address. Secondary = a non-main address you keep registered." },
  ],
  "people": [
    { tag: "tip", title: "One form fits your family", tip: "Munich's Anmeldung fits up to 4 people on a single sheet — no separate forms needed for the whole household." },
  ],
  "status": [
    { tag: "info", title: "Non-moving spouse?", tip: "If your spouse or registered partner isn't moving to Munich with you, add their details separately — they don't need to be present at your appointment." },
  ],
  "documents": [
    { tag: "tip", title: "Document code cheatsheet", tip: "RP = Reisepass (passport) · PA = Personalausweis (ID card) · KRP/KA = children's travel document/ID · AKN = Aufenthaltstitel (residence permit)." },
  ],
};

// ─── Shared style tokens ──────────────────────────────────────────
const NAVY  = "#0f172a";
const BLUE  = "#0075FF";
const MUTED = "#64748b";
const BORDER= "1.5px solid #e2e8f0";
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 6,
  border: BORDER, fontSize: 15, boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: 4, fontWeight: 600, fontSize: 14,
};

// ─── SearchableSelect ─────────────────────────────────────────────
function SearchableSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase())).slice(0, 50);
  return (
    <div style={{ position: "relative" }}>
      <input
        value={open ? q : value}
        onFocus={() => { setOpen(true); setQ(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        style={inputStyle}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", border: BORDER, borderRadius: 6,
          maxHeight: 220, overflowY: "auto", zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,.08)",
        }}>
          {filtered.map(o => (
            <div key={o}
              onMouseDown={() => { onChange(o); setOpen(false); setQ(""); }}
              style={{ padding: "8px 12px", cursor: "pointer", fontSize: 14 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.background = "")}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Wizard step components ───────────────────────────────────────
function StepOrigin({ f, set_ }: { f: MunichForm; set_: (k: keyof MunichForm, v: any) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Where are you moving from?</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>Select the country of your previous address.</p>
      <label style={labelStyle}>Country</label>
      <SearchableSelect
        value={f.originCountry}
        onChange={v => { set_("originCountry", v); set_("prevCountry", v); }}
        options={ALL_COUNTRIES}
        placeholder="Search country…"
      />
    </div>
  );
}

function StepNewAddress({ f, upd, set_ }: {
  f: MunichForm;
  upd: (k: keyof MunichForm) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
  set_: (k: keyof MunichForm, v: any) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Your new Munich address</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>This will be filled in the &ldquo;Neue Wohnung&rdquo; section of the form.</p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Street</label>
          <input value={f.newStreet} onChange={upd("newStreet")} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>House no.</label>
          <input value={f.newNumber} onChange={upd("newNumber")} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Floor / additional (optional)</label>
        <input value={f.newAddExtra} onChange={upd("newAddExtra")} placeholder="e.g. 2. OG, VH" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Postal code</label>
        <input value={f.newPostalCode} onChange={upd("newPostalCode")} placeholder="80331" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Move-in date</label>
        <input type="date" value={f.moveInDate} onChange={upd("moveInDate")} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Dwelling type</label>
        <select value={f.newResType} onChange={upd("newResType")} style={inputStyle}>
          <option value="alleinig">Einzige Wohnung — only dwelling in Germany</option>
          <option value="haupt">Hauptwohnung — primary dwelling (you have others)</option>
          <option value="neben">Nebenwohnung — secondary dwelling</option>
        </select>
      </div>
    </div>
  );
}

function StepPrevAddress({ f, upd, set_ }: {
  f: MunichForm;
  upd: (k: keyof MunichForm) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
  set_: (k: keyof MunichForm, v: any) => void;
}) {
  const prevIsGerman = f.prevCountry && ["germany","deutschland"].includes(f.prevCountry.toLowerCase());
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Previous address</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>Where did you live before Munich?</p>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Country</label>
        <SearchableSelect
          value={f.prevCountry}
          onChange={v => set_("prevCountry", v)}
          options={ALL_COUNTRIES}
          placeholder="Search country…"
        />
      </div>

      {prevIsGerman && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Street</label>
              <input value={f.prevStreet} onChange={upd("prevStreet")} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>House no.</label>
              <input value={f.prevNumber} onChange={upd("prevNumber")} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Postal code</label>
              <input value={f.prevPostalCode} onChange={upd("prevPostalCode")} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={f.prevCity} onChange={upd("prevCity")} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Move-out date (optional)</label>
            <input type="date" value={f.moveOutDate} onChange={upd("moveOutDate")} style={inputStyle} />
          </div>
        </>
      )}

      {f.prevCountry && !prevIsGerman && (
        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 8, padding: 14, marginTop: 8 }}>
          <p style={{ fontSize: 14, color: "#0369a1", margin: 0 }}>
            Moving from abroad — the &ldquo;Bisherige Wohnung&rdquo; section will be left blank.
            If you had a previous German address before going abroad, you can enter it optionally.
          </p>
        </div>
      )}
    </div>
  );
}

function StepPeople({ f, set_ }: { f: MunichForm; set_: (k: keyof MunichForm, v: any) => void }) {
  const updPerson = (i: number, k: keyof Person, v: any) => {
    set_("people", f.people.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  };
  const addPerson = () => {
    if (f.people.length >= MAX_PEOPLE) return;
    set_("people", [...f.people, { ...EMPTY_PERSON, relationship: "child" }]);
  };
  const removePerson = (i: number) => set_("people", f.people.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Who is registering?</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>
        The Munich form fits up to 4 people on one sheet. Everyone moving to the same address.
      </p>

      {f.people.map((p, i) => (
        <div key={i} style={{ border: BORDER, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 15, color: NAVY }}>
              <User size={14} style={{ display: "inline", marginRight: 6 }} />
              Person {i + 1}{i === 0 ? " (you)" : ""}
            </strong>
            {i > 0 && (
              <button onClick={() => removePerson(i)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Last name</label>
              <input value={p.lastName} onChange={e => updPerson(i, "lastName", e.target.value)}
                style={{ ...inputStyle, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>First name(s)</label>
              <input value={p.firstName} onChange={e => updPerson(i, "firstName", e.target.value)}
                style={{ ...inputStyle, fontSize: 14 }} />
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ ...labelStyle, fontSize: 13 }}>Birth name / previous names (if different)</label>
            <input value={p.birthName} onChange={e => updPerson(i, "birthName", e.target.value)}
              placeholder="Geburtsname — leave blank if same as current"
              style={{ ...inputStyle, fontSize: 14 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Birth date</label>
              <input type="date" value={p.birthDate} onChange={e => updPerson(i, "birthDate", e.target.value)}
                style={{ ...inputStyle, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Gender</label>
              <select value={p.gender} onChange={e => updPerson(i, "gender", e.target.value)}
                style={{ ...inputStyle, fontSize: 14 }}>
                <option value="">Select…</option>
                <option value="m">Male (männlich)</option>
                <option value="f">Female (weiblich)</option>
                <option value="d">Diverse (divers)</option>
                <option value="x">No specification (ohne Angabe)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Birth city</label>
              <input value={p.birthPlace} onChange={e => updPerson(i, "birthPlace", e.target.value)}
                style={{ ...inputStyle, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Birth country</label>
              <SearchableSelect
                value={p.birthCountry}
                onChange={v => updPerson(i, "birthCountry", v)}
                options={ALL_COUNTRIES}
                placeholder="Search…"
              />
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ ...labelStyle, fontSize: 13 }}>Citizenship / nationality</label>
            <SearchableSelect
              value={p.citizenship}
              onChange={v => updPerson(i, "citizenship", v)}
              options={ALL_CITIZENSHIPS}
              placeholder="e.g. American, British, Indian…"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ ...labelStyle, fontSize: 13 }}>Religion (for church tax purposes)</label>
            <select value={p.religion} onChange={e => updPerson(i, "religion", e.target.value)}
              style={{ ...inputStyle, fontSize: 14 }}>
              <option value="none">No declaration / none</option>
              <option value="rk">Roman Catholic (röm.-kath.)</option>
              <option value="ev">Protestant (evangelisch)</option>
              <option value="ak">Old Catholic (altkatholisch)</option>
            </select>
          </div>

          {i > 0 && (
            <div>
              <label style={{ ...labelStyle, fontSize: 13 }}>Relationship to Person 1</label>
              <select value={p.relationship} onChange={e => updPerson(i, "relationship", e.target.value as any)}
                style={{ ...inputStyle, fontSize: 14 }}>
                <option value="spouse">Spouse / registered partner</option>
                <option value="child">Child</option>
              </select>
            </div>
          )}
        </div>
      ))}

      {f.people.length < MAX_PEOPLE && (
        <button onClick={addPerson} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "1.5px dashed #94a3b8", borderRadius: 8,
          padding: "10px 16px", cursor: "pointer", color: MUTED,
          width: "100%", justifyContent: "center", fontSize: 14,
        }}>
          <Plus size={15} /> Add another person (up to {MAX_PEOPLE})
        </button>
      )}
    </div>
  );
}

function StepStatus({ f, upd, set_ }: {
  f: MunichForm;
  upd: (k: keyof MunichForm) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
  set_: (k: keyof MunichForm, v: any) => void;
}) {
  const showMarriage = ["verheiratet","partnerschaft"].includes(f.maritalStatus);
  const showNMS = ["verheiratet","partnerschaft","getrennt"].includes(f.maritalStatus);
  const hasSpouseInPeople = f.people.some(p => p.relationship === "spouse");

  const updNms = (k: keyof NonNullable<MunichForm["nonMovingSpouse"]>, v: any) =>
    set_("nonMovingSpouse", { ...(f.nonMovingSpouse ?? EMPTY_NMS), [k]: v });

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Civil status</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>For Person 1. Children are always recorded as single (ledig).</p>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Marital status</label>
        <select value={f.maritalStatus} onChange={upd("maritalStatus")} style={inputStyle}>
          <option value="">Select…</option>
          <option value="ledig">Single (ledig)</option>
          <option value="verheiratet">Married (verheiratet)</option>
          <option value="geschieden">Divorced (geschieden)</option>
          <option value="verwitwet">Widowed (verwitwet)</option>
          <option value="partnerschaft">Registered partnership (Lebenspartnerschaft)</option>
          <option value="getrennt">Separated (getrennt lebend)</option>
        </select>
      </div>

      {showMarriage && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Marriage / partnership date</label>
            <input type="date" value={f.marriageDate} onChange={upd("marriageDate")} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>City</label>
              <input value={f.marriagePlace} onChange={upd("marriagePlace")} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <SearchableSelect
                value={f.marriageCountry}
                onChange={v => set_("marriageCountry", v)}
                options={ALL_COUNTRIES}
                placeholder="Search…"
              />
            </div>
          </div>
          <p style={{ color: MUTED, fontSize: 13, marginTop: 8 }}>
            This fills the &ldquo;Datum und Ort der Eheschließung&rdquo; field on the form.
          </p>
        </>
      )}

      {showNMS && !hasSpouseInPeople && (
        <div style={{ marginTop: 24, borderTop: BORDER, paddingTop: 20 }}>
          <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4, fontSize: 15 }}>
            Nicht mitziehende/r Ehe-/Lebenspartner*in
          </p>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 14 }}>
            Is your spouse / partner staying behind (not moving to Munich with you)?
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => set_("nonMovingSpouse", f.nonMovingSpouse ? null : { ...EMPTY_NMS })}
              style={{
                padding: "8px 18px", borderRadius: 6, border: BORDER, cursor: "pointer",
                background: f.nonMovingSpouse ? BLUE : "#fff",
                color: f.nonMovingSpouse ? "#fff" : NAVY, fontWeight: 600, fontSize: 14,
              }}
            >
              {f.nonMovingSpouse ? "Yes — fill their details" : "Yes — fill their details"}
            </button>
            <button
              type="button"
              onClick={() => set_("nonMovingSpouse", null)}
              style={{
                padding: "8px 18px", borderRadius: 6, border: BORDER, cursor: "pointer",
                background: f.nonMovingSpouse === null ? "#f1f5f9" : "#fff",
                color: NAVY, fontWeight: 600, fontSize: 14,
              }}
            >
              No / leave blank
            </button>
          </div>

          {f.nonMovingSpouse && (
            <div style={{ background: "#f8fafc", border: BORDER, borderRadius: 8, padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input value={f.nonMovingSpouse.firstName}
                    onChange={e => updNms("firstName", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input value={f.nonMovingSpouse.lastName}
                    onChange={e => updNms("lastName", e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Date of birth</label>
                  <input type="date" value={f.nonMovingSpouse.birthDate}
                    onChange={e => updNms("birthDate", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>City of birth</label>
                  <input value={f.nonMovingSpouse.birthPlace}
                    onChange={e => updNms("birthPlace", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Country of birth</label>
                  <SearchableSelect value={f.nonMovingSpouse.birthCountry}
                    onChange={v => updNms("birthCountry", v)}
                    options={ALL_COUNTRIES} placeholder="Search…" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Gender</label>
                <select value={f.nonMovingSpouse.gender}
                  onChange={e => updNms("gender", e.target.value)} style={inputStyle}>
                  <option value="">Select…</option>
                  <option value="m">Male (männlich)</option>
                  <option value="f">Female (weiblich)</option>
                  <option value="d">Divers</option>
                  <option value="x">No entry (ohne Angabe)</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Current street + house number</label>
                <input value={f.nonMovingSpouse.street}
                  onChange={e => updNms("street", e.target.value)}
                  placeholder="e.g. Hauptstraße 12" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Postal code + city</label>
                <input value={f.nonMovingSpouse.postalCity}
                  onChange={e => updNms("postalCity", e.target.value)}
                  placeholder="e.g. 10115 Berlin" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={f.nonMovingSpouse.separated}
                    onChange={e => updNms("separated", e.target.checked)} />
                  <span style={{ color: NAVY }}>Living permanently separated (dauerhaft getrennt)?</span>
                </label>
                <p style={{ color: MUTED, fontSize: 12, marginTop: 4, marginLeft: 22 }}>
                  Affects how the Meldebehörde classifies your new dwelling.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepDocuments({ f, set_ }: { f: MunichForm; set_: (k: keyof MunichForm, v: any) => void }) {
  const updPerson = (i: number, k: keyof Person, v: any) => {
    set_("people", f.people.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  };
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Identity documents</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>
        Munich form has 4 document slots — one per person. Doc details will be pre-filled in the PDF.
      </p>

      {f.people.map((p, i) => (
        <div key={i} style={{ border: BORDER, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 14, color: NAVY }}>{p.firstName || `Person ${i + 1}`}</strong>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: MUTED, cursor: "pointer" }}>
              <input type="checkbox" checked={p.fillHandwritten}
                onChange={e => updPerson(i, "fillHandwritten", e.target.checked)} />
              I&apos;ll fill by hand
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ ...labelStyle, fontSize: 13 }}>Document type</label>
            <select value={p.docType} onChange={e => updPerson(i, "docType", e.target.value)}
              style={{ ...inputStyle, fontSize: 14 }}>
              <option value="RP">Reisepass (RP) — Passport</option>
              <option value="PA">Personalausweis (PA) — National ID</option>
              <option value="KRP">Kinderreisepass (KRP) — Child passport</option>
              <option value="KA">Kinderausweis (KA) — Child ID</option>
              <option value="AKN">Aufenthaltstitel (AKN) — Residence permit</option>
            </select>
          </div>

          {!p.fillHandwritten && (
            <>
              <div style={{ marginBottom: 10 }}>
                <label style={{ ...labelStyle, fontSize: 13 }}>Serial / document number</label>
                <input value={p.docSerial} onChange={e => updPerson(i, "docSerial", e.target.value)}
                  style={{ ...inputStyle, fontSize: 14 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: 13 }}>Issue date</label>
                  <input type="date" value={p.docDate} onChange={e => updPerson(i, "docDate", e.target.value)}
                    style={{ ...inputStyle, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: 13 }}>Valid until</label>
                  <input type="date" value={p.docValidUntil} onChange={e => updPerson(i, "docValidUntil", e.target.value)}
                    style={{ ...inputStyle, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: 13 }}>Issuing authority</label>
                  <input value={p.docAuthority} onChange={e => updPerson(i, "docAuthority", e.target.value)}
                    placeholder="e.g. City of New York" style={{ ...inputStyle, fontSize: 14 }} />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function StepReview({ f }: { f: MunichForm }) {
  const p1 = f.people[0];
  const box = (title: string, body: React.ReactNode) => (
    <div style={{ background: "#f8fafc", border: BORDER, borderRadius: 8, padding: 14, marginBottom: 12 }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: NAVY, fontSize: 14 }}>{title}</p>
      {body}
    </div>
  );
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Review your details</h2>
      <p style={{ color: MUTED, marginBottom: 20, fontSize: 14 }}>Check everything before paying. You can go back to edit.</p>

      {box("New address", <>
        <p style={{ color: MUTED, fontSize: 14 }}>
          {[f.newStreet, f.newNumber, f.newAddExtra].filter(Boolean).join(" ")}<br />
          {f.newPostalCode} München
        </p>
        <p style={{ color: MUTED, fontSize: 13 }}>Move-in: {f.moveInDate || "—"} · {
          f.newResType === "alleinig" ? "Einzige Wohnung" :
          f.newResType === "haupt"    ? "Hauptwohnung" : "Nebenwohnung"
        }</p>
      </>)}

      {box(`${f.people.length} person${f.people.length > 1 ? "s" : ""} registering`, <>
        {f.people.map((p, i) => (
          <p key={i} style={{ color: MUTED, fontSize: 14 }}>
            {p.firstName} {p.lastName}
            {p.birthDate ? ` · born ${p.birthDate}` : ""}
            {i > 0 ? ` · ${p.relationship}` : ""}
          </p>
        ))}
      </>)}

      {box("Previous address", <>
        <p style={{ color: MUTED, fontSize: 14 }}>
          {f.prevCountry === "Germany" || f.prevCountry === "Deutschland"
            ? [f.prevStreet, f.prevNumber, f.prevPostalCode, f.prevCity].filter(Boolean).join(", ")
            : `From abroad: ${f.prevCountry}`}
        </p>
      </>)}

      {box("Civil status", <p style={{ color: MUTED, fontSize: 14 }}>{f.maritalStatus || "—"}</p>)}

      <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 8, padding: 14 }}>
        <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
          After payment, your Munich Anmeldung PDF is generated and downloaded immediately.
          Print it, sign at the bottom, and bring it to your Bürgerbüro appointment.
        </p>
      </div>
    </div>
  );
}

// ─── Payment page ─────────────────────────────────────────────────
function MunichPaymentPage({ form, onDevSkip }: { form: MunichForm; onDevSkip: () => void }) {
  const p1 = form.people[0] ?? EMPTY_PERSON;
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }} className="fu">
      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "40px 20px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(0,117,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>R</span>
            </div>
            <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>ReadyExpat <span style={{ color: "#60a5fa" }}>München</span></span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
            <CheckCircle2 size={11} color="#86efac" />
            <span style={{ color: "#86efac", fontSize: 11.5, fontWeight: 700 }}>München Beta · Free</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
            Your Munich Anmeldung<br/><span style={{ color: "#60a5fa" }}>is ready to generate.</span>
          </h1>
          <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 15, lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}>
            Walk in to your Bürgerbüro prepared. All 105 fields filled in correct German.
          </p>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{ maxWidth: 560, margin: "-60px auto 0", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", marginBottom: 12 }}>
          <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Munich Anmeldung — {form.people.length} person{form.people.length > 1 ? "s" : ""}</div>
            <div style={{ fontWeight: 700, color: NAVY, fontSize: 16 }}>{p1.firstName} {p1.lastName}</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{form.newStreet} {form.newNumber}, München</div>
          </div>
          <div style={{ padding: "16px 24px" }}>
            {[
              { label: "Official Munich Anmeldung PDF", desc: "All 105 fields · filled in correct German" },
              { label: "Fits your whole household", desc: "Up to 4 people on one sheet" },
              { label: "Personalised checklist + guide", desc: "What to bring, printing tips, after your appointment" },
            ].map(({ label, desc }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? "1px solid #f8fafc" : "none", marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", border: "1px solid #e8ecf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={14} color={BLUE} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: 13.5 }}>{label}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 1 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ margin: "0 16px 16px", padding: "11px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e8ecf4", display: "flex", gap: 9 }}>
            <Shield size={13} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>We prepare your documents perfectly. We do not register you — that requires your personal appearance at the Bürgerbüro. We cannot book appointments for you.</p>
          </div>
        </div>

        <div style={{ marginBottom: 14, padding: "11px 14px", borderRadius: 12, background: "#f0f9ff", border: "1px solid #bae6fd", display: "flex", gap: 9 }}>
          <Shield size={13} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11.5, color: "#1e3a8a", lineHeight: 1.6 }}>
            <strong>Your data never reaches our servers.</strong> Everything stays in your browser — deleted after generation.
          </p>
        </div>

        <button onClick={onDevSkip}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px", borderRadius: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: "0 8px 32px rgba(22,163,74,0.35)", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em" }}>
          <Download size={18} /> Get my Munich PDF — Free (beta)
        </button>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 10 }}>
          München is free while we&apos;re in beta — no card required
        </p>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Done page ────────────────────────────────────────────────────
function MunichDonePage({
  form, pdfBytes, pdfName, onRestart, sessionError,
}: {
  form: MunichForm;
  pdfBytes: Uint8Array | null;
  pdfName: string;
  onRestart: () => void;
  sessionError: boolean;
}) {
  const p1 = form.people[0] ?? EMPTY_PERSON;
  const [dlA, setDlA] = useState(false);
  const [dlG, setDlG] = useState(false);
  const handleDownload = () => {
    if (!pdfBytes) return;
    setDlA(true);
    savePDF(pdfBytes, pdfName);
    setTimeout(() => setDlA(false), 400);
  };
  const handleDownloadGuide = async () => {
    setDlG(true);
    try {
      const bytes = await buildMunichGuidePDF(form);
      savePDF(bytes, `Munich_Anmeldung_Guide_${p1.lastName || "guide"}.pdf`);
    } catch (e) { console.error(e); }
    setDlG(false);
  };

  const isMarried = ["verheiratet", "partnerschaft", "getrennt"].includes(form.maritalStatus);
  const hasForeignBirth = form.people.some(p =>
    p.birthCountry && !["germany", "deutschland"].includes(p.birthCountry.toLowerCase()));
  const hasForeignMarriage = isMarried && form.marriageCountry &&
    !["germany", "deutschland"].includes(form.marriageCountry.toLowerCase());

  type Card = { title: string; items: { text: string; detail?: string; warn?: string }[]; color: string; bg: string; border: string };
  const cards: Card[] = [];

  cards.push({
    title: "Munich Anmeldung Form — printed on paper",
    color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe",
    items: [{ text: "Your filled Anmeldung PDF — printed on paper", detail: "The Bürgerbüro does NOT accept phone screens. Sign at the bottom after printing — not before." }],
  });

  cards.push({
    title: "Wohnungsgeberbestätigung — signed by your landlord",
    color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    items: [{
      text: "Original signed confirmation from your landlord",
      detail: "Check your move-in documents and email first — many landlords include it automatically. Under §19 BMG they are legally required to provide it (refusal = fine up to €1,000).",
    }],
  });

  cards.push({
    title: "Identity Documents — one per person",
    color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe",
    items: form.people.filter(p => p.firstName || p.lastName).map(p => ({
      text: `${p.firstName} ${p.lastName}`.trim(),
      detail: p.docType === "RP" ? "Reisepass (passport)" : p.docType === "PA" ? "Personalausweis (ID card)" : "Bring the document type selected in your form",
    })),
  });

  if (hasForeignBirth) {
    const foreignPeople = form.people.filter(p =>
      p.birthCountry && !["germany", "deutschland"].includes(p.birthCountry.toLowerCase()));
    cards.push({
      title: "Birth Certificates (born outside Germany)",
      color: "#0e7490", bg: "#f0f9ff", border: "#bae6fd",
      items: foreignPeople.map(p => ({
        text: `Birth certificate: ${p.firstName} ${p.lastName}`.trim(),
        detail: `Born in ${p.birthCountry} — original required`,
        warn: "CERTIFIED TRANSLATION REQUIRED: foreign birth certificates need a beglaubigte Übersetzung (certified German translation).",
      })),
    });
  }

  cards.push({
    title: "Appointment Confirmation",
    color: "#374151", bg: "#f9fafb", border: "#e5e7eb",
    items: [{ text: "Bürgerbüro appointment confirmation", detail: "Email printout or screenshot on your phone." }],
  });

  if (isMarried) {
    cards.push({
      title: "Marriage or Civil Partnership Certificate",
      color: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe",
      items: [{
        text: "Original marriage or civil partnership certificate",
        detail: "Must be the original — no photocopies.",
        warn: hasForeignMarriage ? "CERTIFIED TRANSLATION REQUIRED: bring a beglaubigte Übersetzung by a sworn translator." : undefined,
      }],
    });
  }

  if (!form.isEU) {
    cards.push({
      title: "Visa or Residence Permit (if you have one)",
      color: "#2563eb", bg: "#eef2ff", border: "#bfdbfe",
      items: [{ text: "Aufenthaltstitel or entry visa — original + copy", detail: "You do NOT need to wait for a visa before registering. Register first." }],
    });
  }

  if (form.nonMovingSpouse) {
    cards.push({
      title: "Non-moving spouse / partner",
      color: "#9a3412", bg: "#fff7ed", border: "#fed7aa",
      items: [{ text: `${form.nonMovingSpouse.firstName} ${form.nonMovingSpouse.lastName}`.trim(), detail: "Their details were filled in the form's non-moving spouse section — they do not need to be present at your appointment." }],
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }} className="fu">
      <style>{`
        .m-done-layout{display:flex;gap:0;min-height:100vh}
        .m-done-main{flex:1;min-width:0;padding:28px 32px 100px}
        .m-done-sidebar{width:320px;flex-shrink:0;background:#0f172a;padding:0;display:flex;flex-direction:column}
        .m-done-sidebar-sticky{position:sticky;top:0;height:100vh;overflow-y:auto}
        @media(max-width:768px){
          .m-done-layout{display:block!important}
          .m-done-sidebar{display:none!important}
          .m-done-main{padding:16px 16px 80px!important}
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e8ecf4", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 900 }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: NAVY }}>ReadyExpat <span style={{ color: BLUE }}>München</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "5px 12px" }}>
          <CheckCircle2 size={12} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Document ready</span>
        </div>
      </div>

      {/* In-development notice */}
      <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "7px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: "#92400e" }}><strong>Munich support is still in development</strong> — free to use while we finish testing.</span>
      </div>

      <div className="m-done-layout">
        {/* Desktop sidebar */}
        <div className="m-done-sidebar">
          <div className="m-done-sidebar-sticky">
            <div style={{ padding: "24px 20px", flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Your registration summary</div>
              {[
                ["Name", (p1.firstName + " " + p1.lastName).trim() || "—"],
                ["Address", form.newStreet ? `${form.newStreet} ${form.newNumber}, ${form.newPostalCode} München` : "—"],
                ["Move-in", form.moveInDate ? fmtDate(form.moveInDate) : "—"],
                ["Status", form.isEU ? "EU/EEA citizen" : "Non-EU citizen"],
                ["People", String(form.people.length)],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{v}</div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(0,117,255,0.1)", border: "1px solid rgba(0,117,255,0.2)" }}>
                <div style={{ fontWeight: 800, color: "#60a5fa", fontSize: 12.5, marginBottom: 6 }}>Booking your appointment</div>
                <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 12, lineHeight: 1.6 }}>
                  Book your Bürgerbüro appointment at muenchen.de. Slots can be limited — book as early as possible.
                </p>
              </div>
              <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p style={{ color: "rgba(187,247,208,0.85)", fontSize: 12, lineHeight: 1.6 }}>
                  <strong style={{ color: "#86efac" }}>Don&apos;t stress about the days.</strong> As long as you have an appointment booked, you won&apos;t be fined for the 14-day deadline.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="m-done-main">
          {/* Success banner */}
          <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", borderRadius: 18, padding: "22px 24px", marginBottom: 20, color: "white", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={20} color="#86efac" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#86efac", letterSpacing: "0.06em", textTransform: "uppercase" }}>Documents generated</span>
            </div>
            <h1 style={{ fontSize: 23, fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1.15 }}>
              {p1.firstName ? `${p1.firstName}, you're ready.` : "You're ready."}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 10 }}>
              {[
                "1 Munich Anmeldung form",
                ...(form.isEU ? ["EU/EEA — ID or passport"] : ["Non-EU — passport required"]),
                ...(form.people.length > 1 ? [`${form.people.length} people`] : []),
                ...(form.nonMovingSpouse ? ["Non-moving spouse included"] : []),
              ].map(tag => (
                <span key={tag} style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(187,247,208,0.95)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 999 }}>{tag}</span>
              ))}
            </div>
            <p style={{ color: "rgba(187,247,208,0.8)", fontSize: 13.5, lineHeight: 1.6 }}>
              Book your Bürgerbüro appointment — the sooner the better.
            </p>
          </div>

          {sessionError && (
            <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "#eef2ff", border: "1px solid #bfdbfe", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertCircle size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 800, color: "#1e40af", fontSize: 13, marginBottom: 3 }}>Session data not found</div>
                <p style={{ color: "#1d4ed8", fontSize: 12.5, lineHeight: 1.6 }}>
                  Your form data is no longer in this browser. Use &quot;Clear data &amp; start over&quot; below to begin again, or contact info@readyexpat.de.
                </p>
              </div>
            </div>
          )}

          {/* Primary download */}
          {pdfBytes && (
            <button onClick={handleDownload} disabled={dlA}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px 22px", borderRadius: 18, background: dlA ? "#64748b" : "linear-gradient(135deg,#0f172a,#0075FF)", color: "white", border: "none", cursor: dlA ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 20, boxShadow: dlA ? "none" : "0 8px 32px rgba(0,117,255,0.35)", transition: "all 0.2s", textAlign: "left" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 3 }}>Download Munich Anmeldung PDF</div>
                <div style={{ fontSize: 12.5, opacity: 0.8 }}>All fields filled in German · Print &amp; sign</div>
              </div>
              <Download size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
            </button>
          )}

          {/* Guide download */}
          <button onClick={handleDownloadGuide} disabled={dlG}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 18, background: dlG ? "#64748b" : "linear-gradient(135deg,#134e4a,#0f766e)", color: "white", border: "none", cursor: dlG ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 20, boxShadow: dlG ? "none" : "0 8px 24px rgba(15,118,110,0.3)", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Layers size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 3 }}>
                {dlG ? "Generating..." : "Download Checklist + Munich Guide"}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.8 }}>Your personalised checklist + Munich appointment guide</div>
            </div>
            <Download size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
          </button>

          {/* Next step — book appointment */}
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", borderRadius: 18, padding: "20px 22px", marginBottom: 24, color: "white" }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Next step: book your Bürgerbüro appointment</div>
            <p style={{ color: "rgba(191,219,254,0.85)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
              Book at muenchen.de as early as possible — slots fill up quickly.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>
              muenchen.de <ChevronRight size={14} />
            </div>
          </div>

          {/* Checklist cards */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>What to bring</div>
          {cards.map(card => (
            <div key={card.title} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, color: card.color, fontSize: 13.5, marginBottom: 8 }}>{card.title}</div>
              {card.items.map((item, i) => (
                <div key={i} style={{ marginBottom: i < card.items.length - 1 ? 10 : 0 }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{item.text}</div>
                  {item.detail && <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6, marginTop: 2 }}>{item.detail}</div>}
                  {item.warn && <div style={{ color: "#b45309", fontSize: 12, lineHeight: 1.6, marginTop: 4, fontWeight: 600 }}>⚠ {item.warn}</div>}
                </div>
              ))}
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button onClick={onRestart} style={{
              background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <RotateCcw size={13} /> Clear data &amp; start over
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────
function MunichLandingPage({ onStart }: { onStart: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="fu" style={{ background: "white" }}>
      <style>{`
        .m-stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .m-feat-boxes{display:grid;grid-template-columns:repeat(3,1fr)}
        .m-feat-box-r{border-right:1px solid #e8ecf4}
        @keyframes FU{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:FU 0.35s cubic-bezier(0.22,1,0.36,1)}
        @media(max-width:768px){
          .m-hero-grid{grid-template-columns:1fr!important;gap:0!important}
          .m-hero-visual{display:none!important}
          .m-feat-boxes{grid-template-columns:1fr!important}
          .m-feat-box-r{border-right:none!important;border-bottom:1px solid #e8ecf4}
          .m-stats-strip{grid-template-columns:1fr 1fr!important}
          .m-hero-pad{padding:36px 20px 32px!important}
        }
        @media(max-width:640px){
          .m-h1{font-size:34px!important;line-height:1.08!important;letter-spacing:-0.02em!important}
          .m-cta-btn{width:100%!important;justify-content:center!important}
        }
      `}</style>
      <SharedNav onStart={onStart} />

      {/* ══ IN-DEVELOPMENT NOTICE ══ */}
      <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "10px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "#92400e" }}>
          <strong>Munich support is still in development.</strong> Some features may be incomplete or change — it&apos;s <strong>free</strong> to use while we finish testing.
        </span>
      </div>

      {/* ══ HERO ══ */}
      <div style={{ background: "#fbfcff", borderBottom: "1px solid #e8ecf4" }}>
        <div className="m-hero-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px" }}>
          <div className="m-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "center" }}>

            {/* Left: copy + CTA */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 999, padding: "5px 13px", marginBottom: 22 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, display: "inline-block", flexShrink: 0 }} />
                <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>For expats in München · Beta</span>
              </div>

              <h1 className="m-h1" style={{ fontSize: 48, fontWeight: 900, color: NAVY, lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 0 }}>
                Munich&apos;s Anmeldung — done correctly in English.
              </h1>
              <p style={{ fontSize: 16, color: "#6b7693", lineHeight: 1.65, margin: "16px 0 28px", maxWidth: 440 }}>
                Fill the official Landeshauptstadt München residence registration form in English.
                All fields auto-filled in German — ready to print and bring to your Bürgerbüro.
              </p>

              <button onClick={onStart} className="m-cta-btn"
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 13, background: hov ? "#0066ee" : BLUE, color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: hov ? "0 16px 48px rgba(0,117,255,0.45)" : "0 6px 24px rgba(0,117,255,0.3)", transform: hov ? "translateY(-2px)" : "none", transition: "all 0.18s", letterSpacing: "-0.01em", cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
                Fill my Munich form now <ArrowRight size={18} />
              </button>
              <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: 0 }}>
                München Beta · Free · No account needed
              </p>
            </div>

            {/* Right: form preview mockup (no external image dependency) */}
            <div className="m-hero-visual" style={{ borderRadius: 20, background: "linear-gradient(145deg,#eef3fb,#f0f4fa)", border: "1px solid #e8ecf4", boxShadow: "0 12px 48px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", minHeight: 420 }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
                <div style={{ position: "absolute", inset: 0, transform: "rotate(2deg) translateY(6px)", borderRadius: 4, background: "white", boxShadow: "0 4px 18px rgba(0,0,0,0.10)" }} />
                <div style={{ position: "absolute", inset: 0, transform: "rotate(-1deg) translateY(3px)", borderRadius: 4, background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }} />
                <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.16)", background: "white", padding: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Anmeldung · München</div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ width: `${60 + (i % 3) * 15}%`, height: 6, borderRadius: 3, background: "#e2e8f0", marginBottom: 5 }} />
                      <div style={{ width: "100%", height: 9, borderRadius: 2, background: i % 2 === 0 ? "#eff6ff" : "#f8fafc", border: "1px solid #e2e8f0" }} />
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", bottom: -14, right: -14, background: BLUE, color: "white", borderRadius: 10, padding: "8px 13px", boxShadow: "0 6px 20px rgba(0,117,255,0.4)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <CheckCircle2 size={13} color="white" />
                  <span style={{ fontSize: 12, fontWeight: 800 }}>105 fields · Perfect German</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature boxes */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Built for München</div>
            <div className="m-feat-boxes" style={{ gap: 0, borderRadius: 16, overflow: "hidden", border: "1px solid #e8ecf4" }}>
              <div className="m-feat-box-r" style={{ padding: "24px 26px 28px", background: "white" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <FileText size={16} color={BLUE} />
                </div>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: 14, marginBottom: 2 }}>Munich Anmeldung PDF</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginBottom: 10 }}>Official Landeshauptstadt München form</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["All 105 fields · filled in correct German", "Text, dropdowns, and radio buttons — all handled"].map(d => (
                    <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: "#6b7693", lineHeight: 1.4 }}>
                      <span style={{ color: BLUE, fontWeight: 900, flexShrink: 0 }}>·</span>{d}
                    </div>
                  ))}
                </div>
              </div>
              <div className="m-feat-box-r" style={{ padding: "24px 26px 28px", background: "white" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Users size={16} color="#16a34a" />
                </div>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: 14, marginBottom: 2 }}>Up to 4 people, one sheet</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginBottom: 10 }}>No separate forms</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Register your whole family together", "Non-moving spouse support built in"].map(d => (
                    <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: "#6b7693", lineHeight: 1.4 }}>
                      <span style={{ color: "#16a34a", fontWeight: 900, flexShrink: 0 }}>·</span>{d}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "24px 26px 28px", background: "white" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Home size={16} color="#ea580c" />
                </div>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: 14, marginBottom: 2 }}>Every field type, done right</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginBottom: 10 }}>Text, dropdowns, radios</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Document codes (RP/PA/KRP/KA/AKN) mapped correctly", "Dwelling-type radios filled and visible"].map(d => (
                    <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: "#6b7693", lineHeight: 1.4 }}>
                      <span style={{ color: "#ea580c", fontWeight: 900, flexShrink: 0 }}>·</span>{d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="m-stats-strip" style={{ marginTop: 36, paddingTop: 32, borderTop: "1px solid #e8ecf4" }}>
            {[
              { v: "105", l: "Fields filled in German" },
              { v: "5 min", l: "Average completion" },
              { v: "4", l: "People per sheet" },
              { v: "0", l: "Bytes stored on any server" },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center", padding: "14px 10px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: "-0.03em", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM CTA ══ */}
      <div style={{ background: NAVY, padding: "56px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "white", marginBottom: 10, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Walk in to your Bürgerbüro fully prepared.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
            Perfect German form. Zero data stored. Ready in 5 minutes. Free during München beta.
          </p>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: BLUE, color: "white", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em", boxShadow: "0 8px 28px rgba(0,117,255,0.4)" }}>
            Get started <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <AppFooter />
      <CookieBanner />
    </div>
  );
}

// ─── Wizard shell (sidebar layout, mirrors Berlin's WizardLayout) ─
function MunichWizardShell({
  form, step, setStep, upd, set_, err, setErr, genError, next, back, onGoHome, onRestart,
}: {
  form: MunichForm; step: WizardStep; setStep: (s: WizardStep) => void;
  upd: any; set_: any;
  err: string; setErr: (s: string) => void; genError: string;
  next: () => void; back: () => void;
  onGoHome: () => void; onRestart: () => void;
}) {
  const [confirmHome, setConfirmHome] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const hasData = !!(form.people[0]?.firstName || form.people[0]?.lastName || form.newStreet || form.originCountry);

  const stepIdx = STEPS.indexOf(step);
  const score = calcMunichScore(form);
  const ringColor = score < 31 ? "#f59e0b" : score < 91 ? BLUE : "#22c55e";

  const stepContent: Record<WizardStep, React.ReactNode> = {
    "origin":       <StepOrigin f={form} set_={set_} />,
    "new-address":  <StepNewAddress f={form} upd={upd} set_={set_} />,
    "prev-address": <StepPrevAddress f={form} upd={upd} set_={set_} />,
    "people":       <StepPeople f={form} set_={set_} />,
    "status":       <StepStatus f={form} upd={upd} set_={set_} />,
    "documents":    <StepDocuments f={form} set_={set_} />,
    "review":       <StepReview f={form} />,
  };
  const hacks = MUNICH_HACKS[step] ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <style>{`
        .m-wizard-aside{width:300px;flex-shrink:0}
        .m-wizard-main-pad{padding:44px 56px 80px}
        .m-wizard-max{max-width:720px}
        .m-conf-ring circle.track{fill:none;stroke:#e8ecf4;stroke-width:5}
        .m-conf-ring circle.fill{fill:none;stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1),stroke 0.6s ease}
        .m-mobile-bottom-nav{display:none}
        @media(max-width:768px){
          .m-wizard-aside{display:none!important}
          .m-wizard-main-pad{padding:16px 16px 120px!important}
          .m-wizard-max{max-width:100%!important}
          .m-mob-hide{display:none!important}
          .m-mobile-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #e8ecf4;padding:12px 16px;gap:8px;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.08)}
          .m-mobile-bottom-nav button{width:100%!important;flex:none!important;min-height:48px!important;font-size:16px!important;padding:12px 24px!important}
        }
      `}</style>

      {/* Modals */}
      {confirmRestart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 360, width: "100%", background: "white", borderRadius: 20, padding: "28px 26px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#111111", fontSize: 17, marginBottom: 8 }}>Clear all data and restart?</h3>
            <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              This will permanently delete everything you&apos;ve entered. You&apos;ll start from the beginning. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "2px solid #e8ecf4", background: "white", fontWeight: 700, fontSize: 13.5, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Keep my data</button>
              <button onClick={() => { setConfirmRestart(false); onRestart(); }} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "none", background: "#2563eb", fontWeight: 700, fontSize: 13.5, color: "white", cursor: "pointer", fontFamily: "inherit" }}>Clear &amp; restart</button>
            </div>
          </div>
        </div>
      )}
      {confirmHome && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 380, width: "100%", background: "white", borderRadius: 20, padding: "28px 26px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#111111", fontSize: 17, marginBottom: 8 }}>Leave the registration?</h3>
            <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Your progress is saved automatically. You can return at any time and continue where you left off.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmHome(false)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "2px solid #e8ecf4", background: "white", fontWeight: 700, fontSize: 13.5, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Keep going</button>
              <button onClick={() => { setConfirmHome(false); onGoHome(); }} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "none", background: "#111111", fontWeight: 700, fontSize: 13.5, color: "white", cursor: "pointer", fontFamily: "inherit" }}>Go to homepage</button>
            </div>
          </div>
        </div>
      )}

      {/* In-development notice */}
      <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "7px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: "#92400e" }}><strong>Munich support is still in development</strong> — free to use while we finish testing.</span>
      </div>

      {/* Slim reminder bar */}
      <div className="m-mob-hide" style={{ background: "#f8fafc", borderBottom: "1px solid #e8ecf4", padding: "7px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>⏱ <strong style={{ color: NAVY }}>14-day registration deadline</strong> — §17 BMG · Fines up to €1,000 for late registration</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside className="m-wizard-aside" style={{ display: "flex", flexDirection: "column", background: "white", borderRight: "1px solid #e8ecf4", flexShrink: 0 }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <button onClick={() => hasData ? setConfirmHome(true) : onGoHome()}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#0075FF,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 900 }}>R</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 13, color: "#111111" }}>ReadyExpat <span style={{ color: BLUE }}>München</span></span>
            </button>
          </div>

          {/* Confidence ring */}
          <div style={{ margin: "14px 14px 8px", padding: "16px 14px 14px", borderRadius: 16, background: "white", border: "1px solid #e8ecf4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>Form completeness</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg className="m-conf-ring" width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
                  <circle className="track" cx="36" cy="36" r="30" />
                  <circle className="fill" cx="36" cy="36" r="30" stroke={ringColor} strokeDasharray="188.5" strokeDashoffset={188.5 * (1 - score / 100)} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: ringColor, lineHeight: 1 }}>{score}%</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: 12.5, lineHeight: 1.3, marginBottom: 4 }}>
                  {score < 31 ? "Just getting started" : score < 91 ? "Almost there" : "Ready to generate"}
                </div>
                <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>Your data never reaches our servers — deleted after generation.</p>
              </div>
            </div>
          </div>

          {/* One-sheet note */}
          <div style={{ margin: "0 14px 8px", padding: "12px 14px", borderRadius: 12, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #86efac" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={14} color="#16a34a" />
              <div>
                <div style={{ fontWeight: 800, color: "#15803d", fontSize: 12 }}>{form.people.length} of 4 people on this sheet</div>
                <div style={{ color: "#16a34a", fontSize: 10.5, marginTop: 2 }}>Munich fits your whole family on one form</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ padding: "6px 12px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8, paddingLeft: 8 }}>Progress</div>
            {STEPS.map((s, i) => {
              const isCur = s === step, isDone = i < stepIdx;
              return (
                <button key={s}
                  onClick={() => { if (!isDone && !isCur) return; setErr(""); setStep(s); }}
                  disabled={!isDone && !isCur}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 9, border: "none", background: isCur ? "#eff6ff" : "transparent", marginBottom: 1, textAlign: "left", cursor: (isDone || isCur) ? "pointer" : "default", opacity: (!isDone && !isCur) ? 0.4 : 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isCur ? "#2563eb" : isDone ? "#dcfce7" : "#f1f5f9" }}>
                    {isDone ? <Check size={10} color="#16a34a" /> : <span style={{ fontSize: 9, fontWeight: 800, color: isCur ? "white" : "#94a3b8" }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: isCur ? 700 : 500, color: isCur ? "#1e40af" : isDone ? "#16a34a" : "#64748b" }}>{STEP_LABELS[s]}</span>
                  {isCur && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#2563eb" }} />}
                </button>
              );
            })}
          </div>

          {/* Munich notes (hacks) */}
          {hacks.length > 0 && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 9 }}>Munich Notes</div>
              {hacks.map((h, i) => {
                const colors = {
                  tip:  { bg: "#f0fdf4", bd: "#bbf7d0", dot: "#22c55e", tx: "#15803d", label: "TIP" },
                  warn: { bg: "#fffbeb", bd: "#fde68a", dot: "#f59e0b", tx: "#92400e", label: "!" },
                  info: { bg: "#eff6ff", bd: "#bfdbfe", dot: "#3b82f6", tx: "#1d4ed8", label: "i" },
                }[h.tag];
                return (
                  <div key={i} style={{ marginBottom: 8, padding: "10px 12px", borderRadius: 10, background: colors.bg, border: `1px solid ${colors.bd}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.dot, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "white", fontSize: 8, fontWeight: 900 }}>{colors.label}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: 11.5 }}>{h.title}</div>
                    </div>
                    <p style={{ color: colors.tx, fontSize: 11, lineHeight: 1.55, paddingLeft: 20 }}>{h.tip}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Restart */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9", marginTop: "auto" }}>
            <button onClick={() => setConfirmRestart(true)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", color: "#94a3b8", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              <RotateCcw size={12} /> Restart &amp; clear data
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="m-wizard-main-pad" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="m-wizard-max" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.2)" }} />
                <span style={{ fontSize: 10.5, color: "#64748b" }}>Progress saved on your device</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {STEPS.map((s, i) => (
                  <div key={s} style={{ width: i === stepIdx ? 20 : 6, height: 6, borderRadius: 99, background: i < stepIdx ? "#22c55e" : i === stepIdx ? "#2563eb" : "#e2e8f0", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Step {stepIdx + 1} of {STEPS.length}</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em" }}>{STEP_LABELS[step]}</h1>
            </div>

            {genError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <p style={{ color: "#dc2626", fontSize: 14, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertCircle size={14} /> {genError}
                </p>
              </div>
            )}

            <div style={{ background: "white", borderRadius: 20, border: "1px solid #e8ecf4", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", padding: 28, marginBottom: 14 }}>
              {stepContent[step]}
              {err && (
                <div style={{ marginTop: 16, display: "flex", gap: 9, background: "#eef2ff", border: "1px solid #bfdbfe", borderRadius: 11, padding: "11px 15px" }}>
                  <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ color: "#1d4ed8", fontSize: 13 }}>{err}</p>
                </div>
              )}
            </div>

            {/* Desktop nav */}
            <div className="m-mob-hide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {stepIdx > 0
                ? <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 11, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 700, fontSize: 13 }}>
                    <ArrowLeft size={13} /> Back
                  </button>
                : <div />}
              <button onClick={next} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 30px", borderRadius: 13, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white", fontWeight: 800, fontSize: 13.5, border: "none", boxShadow: "0 6px 20px rgba(37,99,235,0.35)" }}>
                {step === "review" ? "Continue to Get My PDF" : "Continue"} <ChevronRight size={15} />
              </button>
            </div>
            {/* Mobile fixed nav */}
            <div className="m-mobile-bottom-nav">
              {stepIdx > 0
                ? <button onClick={back} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "13px", borderRadius: 12, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 700, fontSize: 14, flex: "0 0 100px" }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                : <div />}
              <button onClick={next} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 13, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white", fontWeight: 800, fontSize: 15, border: "none", boxShadow: "0 6px 20px rgba(37,99,235,0.35)", flex: 1 }}>
                {step === "review" ? "Get My PDF" : "Continue"} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
      <AppFooter />
      <CookieBanner />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function MunichPage() {
  const [phase, setPhase]       = useState<AppPhase>("landing");
  const [step, setStep]         = useState<WizardStep>("origin");
  const [form, setForm]         = useState<MunichForm>(EMPTY);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfName, setPdfName]   = useState("anmeldung-muenchen.pdf");
  const [genError, setGenError] = useState("");
  const [stepError, setStepError] = useState("");
  const [sessionError, setSessionError] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Restore from localStorage + handle Stripe return + devtest flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
    if (devToken && new URLSearchParams(window.location.search).get("devtest") === devToken) {
      sessionStorage.setItem("devtest", devToken);
    }
    if (localStorage.getItem(DONE_KEY) === "1") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { setForm(f => ({ ...EMPTY, ...JSON.parse(raw).form })); } catch {}
      }
      setSessionError(true); // pdfBytes are gone after tab close — show contact banner
      setPhase("done");
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setForm(f => ({ ...EMPTY, ...JSON.parse(raw).form })); } catch {}
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "verified") {
      window.history.replaceState({}, "", "/munich");
      setPhase("generating");
    }
  }, []);

  // Persist form
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ form })); } catch {}
  }, [form]);

  // Lock done page — prevent back-button from re-entering wizard
  useEffect(() => {
    if (phase !== "done") return;
    window.history.pushState({ ph: "done" }, "");
    window.history.pushState({ ph: "done" }, "");
    const handler = () => {
      if (localStorage.getItem(DONE_KEY) === "1") {
        window.history.pushState({ ph: "done" }, "");
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [phase]);

  // Generate PDF when entering "generating" phase
  useEffect(() => {
    if (phase !== "generating") return;
    const savedForm = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed.form ?? null;
      } catch { return null; }
    })();
    const sourceForm = savedForm ?? form;
    if (!sourceForm.people?.[0]?.firstName) {
      setSessionError(true);
      localStorage.setItem(DONE_KEY, "1");
      setPhase("done");
      return;
    }
    const merged: MunichForm = { ...EMPTY, ...sourceForm };
    buildMunichPDF(merged).then(({ bytes, name }) => {
      setPdfBytes(bytes);
      setPdfName(name);
      localStorage.setItem(DONE_KEY, "1");
      setPhase("done");
    }).catch(e => {
      setGenError(e?.message ?? "PDF generation failed. Please try again.");
      setPhase("wizard");
    });
  }, [phase]);

  const upd = useCallback(
    (k: keyof MunichForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value })),
    []
  );
  const set_ = useCallback(
    (k: keyof MunichForm, v: any) => setForm(f => ({ ...f, [k]: v })),
    []
  );

  const goNext = () => {
    const err = getError(step, form);
    if (err) { setStepError(err); return; }
    setStepError("");
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
      window.scrollTo(0, 0);
    } else {
      setPhase("payment");
    }
  };
  const goBack = () => {
    setStepError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) { setStep(STEPS[idx - 1]); window.scrollTo(0, 0); }
    else setPhase("landing");
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DONE_KEY);
    setForm(EMPTY);
    setPdfBytes(null);
    setSessionError(false);
    setPhase("landing");
    setStep("origin");
    setConfirmRestart(false);
  };

  // ── Phase: landing ───────────────────────────────────────────────
  if (phase === "landing") {
    return <MunichLandingPage onStart={() => { setPhase("wizard"); setStep("origin"); }} />;
  }

  // ── Phase: payment ───────────────────────────────────────────────
  if (phase === "payment") {
    return <MunichPaymentPage form={form} onDevSkip={() => setPhase("generating")} />;
  }

  // ── Phase: generating ────────────────────────────────────────────
  if (phase === "generating") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <SharedNav />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: NAVY }}>Generating your Munich Anmeldung PDF…</p>
          <p style={{ color: MUTED, fontSize: 14 }}>Just a moment</p>
        </div>
      </div>
    );
  }

  // ── Phase: done ──────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <>
        <MunichDonePage
          form={form}
          pdfBytes={pdfBytes}
          pdfName={pdfName}
          sessionError={sessionError}
          onRestart={() => setConfirmRestart(true)}
        />
        {confirmRestart && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8, color: NAVY }}>Clear &amp; restart?</h3>
              <p style={{ color: MUTED, marginBottom: 20 }}>All entered data will be lost.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleRestart} style={{
                  flex: 1, background: "#ef4444", color: "#fff", border: "none",
                  padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer",
                }}>Clear &amp; restart</button>
                <button onClick={() => setConfirmRestart(false)} style={{
                  flex: 1, background: "#f1f5f9", color: NAVY, border: "none",
                  padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer",
                }}>Keep my data</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Phase: wizard ────────────────────────────────────────────────
  return (
    <MunichWizardShell
      form={form} step={step} setStep={setStep} upd={upd} set_={set_}
      err={stepError} setErr={setStepError} genError={genError}
      next={goNext} back={goBack}
      onGoHome={() => setPhase("landing")}
      onRestart={handleRestart}
    />
  );
}
