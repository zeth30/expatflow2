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
  ArrowRight, ArrowLeft, Plus, Trash2, Download,
  User, Users, MapPin, Home, CreditCard,
  CheckCircle2, RotateCcw, AlertCircle,
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

  // ── Leave blank — office fills these ───────────────────────────
  // fam_bev, vorname_bev, geb_bev, fam_vg, vorname_vg, geb_vg
  // Datum, Datum1 (signing date), Ort, Ort1 (signing place)
  // anschr5, anschr5a, anschrift_bev (non-moving spouse address)
  // fam5, vorn5, gebdat5, gebort5, gr5, name5, geschl6 (non-moving spouse)
  // getrennt1 (separation status), zuzug (last German address if from abroad)
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

const EMPTY: MunichForm = {
  originCountry: "", isEU: true,
  maritalStatus: "", marriageDate: "", marriagePlace: "", marriageCountry: "",
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

// ─── Munich PDF filler ────────────────────────────────────────────
async function fillMunichSheet(d: MunichForm): Promise<Uint8Array> {
  const { PDFDocument, PDFName } = await loadPdfLib();
  const templateBytes = await fetch("/munich-anmeldung.pdf").then(r => r.arrayBuffer());
  const doc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = doc.getForm();

  // Text field helper — identical guard to Berlin
  const txt = (n: string, v: string) => {
    if (!v?.trim()) return;
    try { form.getTextField(n).setText(safe(v)); } catch {}
  };

  // Radio button helper — getRadioGroup().select() silently fails on this PDF (same issue as Berlin checkboxes).
  // Directly set AS on each kid widget and V on the parent.
  const rdo = (fieldName: string, exportVal: string) => {
    if (!exportVal) return;
    try {
      const radioGroup = form.getRadioGroup(fieldName);
      const acroField = (radioGroup as any).acroField;
      acroField.dict.set(PDFName.of("V"), PDFName.of(exportVal));
      const kids = acroField.Kids();
      if (!kids) return;
      kids.forEach((kidRef: any) => {
        try {
          const kid = doc.context.lookup(kidRef) as any;
          const ap = kid.get(PDFName.of("AP"));
          const nDict = ap?.get(PDFName.of("N"));
          // Find this widget's own export value from its AP/N keys
          let widgetExport: string | null = null;
          if (nDict?.entries) {
            for (const [k] of nDict.entries()) {
              const kName = k.asString ? k.asString() : String(k);
              if (kName !== "/Off" && kName !== "Off") {
                widgetExport = kName.startsWith("/") ? kName.slice(1) : kName;
                break;
              }
            }
          }
          kid.set(PDFName.of("AS"), PDFName.of(widgetExport === exportVal ? exportVal : "Off"));
        } catch {}
      });
    } catch {}
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
  txt(MF.EINZUG,       fmtDate(d.moveInDate));
  txt(MF.NEUW_STRASSE, safe(streetLine));
  txt(MF.NW_PLZ,       safe(d.newPostalCode));
  rdo(MF.WOHNUNG,      WOHNUNG_VALS[d.newResType as keyof typeof WOHNUNG_VALS] ?? "einzige Wohnung");

  // ── Previous address ─────────────────────────────────────────────
  const prevIsGerman = !d.prevCountry || ["germany","deutschland"].includes(d.prevCountry.toLowerCase());
  if (prevIsGerman && (d.prevStreet || d.prevCity)) {
    txt(MF.BISHWO_STRASSE, safe(`${d.prevStreet} ${d.prevNumber}`.trim()));
    txt(MF.BISHWO_PLZ,     safe(d.prevPostalCode));
    txt(MF.BISHWO_ORT,     safe(d.prevCity));
  }
  // If from abroad: bishwo fields stay blank — Munich form handles via zuzug
  // (zuzug = last German address before going abroad; most expats leave blank)

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

  form.flatten();
  return doc.save();
}

async function buildMunichPDF(d: MunichForm): Promise<{ bytes: Uint8Array; name: string }> {
  const bytes = await fillMunichSheet(d);
  const lastName = d.people[0]?.lastName?.toLowerCase() || "anmeldung";
  return { bytes, name: `anmeldung-muenchen-${lastName}.pdf` };
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
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ background: "#fff", border: BORDER, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 4, color: NAVY }}>Munich Anmeldung — {form.people.length} person{form.people.length > 1 ? "s" : ""}</p>
          <p style={{ color: MUTED, fontSize: 14 }}>
            {form.people[0]?.firstName} {form.people[0]?.lastName} · {form.newStreet} {form.newNumber}, München
          </p>
        </div>
        <button onClick={onDevSkip} style={{
          width: "100%", background: BLUE, color: "#fff", border: "none",
          padding: 14, borderRadius: 8, fontSize: 16, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "inherit",
        }}>
          <Download size={18} /> Get my Munich PDF — Free
        </button>
        <p style={{ color: MUTED, fontSize: 12, marginTop: 10, textAlign: "center" }}>
          Munich is free during our beta · No account needed
        </p>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Done page ────────────────────────────────────────────────────
function MunichDonePage({
  pdfBytes, pdfName, onRestart, sessionError,
}: {
  pdfBytes: Uint8Array | null;
  pdfName: string;
  onRestart: () => void;
  sessionError: boolean;
}) {
  const handleDownload = () => {
    if (!pdfBytes) return;
    savePDF(pdfBytes, pdfName);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "#dcfce7",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <CheckCircle2 size={32} color="#16a34a" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 8 }}>
          Your Munich Anmeldung is ready
        </h2>
        <p style={{ color: MUTED, marginBottom: 28, fontSize: 15 }}>
          Print it, sign at the bottom (&ldquo;Datum, Unterschrift&rdquo;), and bring it to your Bürgerbüro appointment.
        </p>

        {sessionError ? (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>
              Session data was lost. Please contact info@readyexpat.de with your payment confirmation and we will resend your PDF.
            </p>
          </div>
        ) : pdfBytes ? (
          <button onClick={handleDownload} style={{
            display: "flex", alignItems: "center", gap: 8, margin: "0 auto 16px",
            background: BLUE, color: "#fff", border: "none",
            padding: "14px 28px", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}>
            <Download size={18} /> Download PDF
          </button>
        ) : null}

        <div style={{ background: "#f8fafc", border: BORDER, borderRadius: 8, padding: 14, marginBottom: 16, textAlign: "left" }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: NAVY }}>Next steps</p>
          <ol style={{ margin: 0, paddingLeft: 20, color: MUTED, fontSize: 14, lineHeight: 1.7 }}>
            <li>Print the PDF (single-sided, black &amp; white is fine)</li>
            <li>Sign at the bottom after printing — do NOT sign before</li>
            <li>Book a Bürgerbüro appointment at muenchen.de</li>
            <li>Bring: this form + ID/passport + Wohnungsgeberbestätigung from landlord</li>
          </ol>
        </div>

        <button onClick={onRestart} style={{
          background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13,
          display: "flex", alignItems: "center", gap: 6, margin: "0 auto",
        }}>
          <RotateCcw size={13} /> Start over
        </button>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────
function MunichLandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ display: "inline-block", background: "#eff6ff", color: BLUE, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          München · Anmeldung
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: NAVY, marginBottom: 8, lineHeight: 1.2 }}>
          Anmeldung München — in English
        </h1>
        <p style={{ fontSize: 18, color: MUTED, marginBottom: 8 }}>
          In English. No German required.
        </p>
        <p style={{ fontSize: 16, color: "#475569", marginBottom: 32, maxWidth: 560 }}>
          Fill Munich&apos;s official residence registration form in English.
          We auto-fill all fields in German — ready to print and submit at your Bürgerbüro.
        </p>
        <button onClick={onStart} style={{
          background: BLUE, color: "#fff", border: "none",
          padding: "14px 32px", borderRadius: 8, fontSize: 16, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        }}>
          Fill my Munich form now <ArrowRight size={18} />
        </button>
        <p style={{ marginTop: 10, fontSize: 13, color: "#94a3b8" }}>
          €15 · One-time · No account needed
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
          {[
            { icon: <MapPin size={20} />, title: "Munich-specific", body: "Uses the official Landeshauptstadt München form" },
            { icon: <Users size={20} />, title: "Up to 4 people", body: "Register your whole family on one sheet" },
            { icon: <Home size={20} />, title: "All field types", body: "Text, dropdowns, and radio buttons — all filled correctly" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", border: BORDER, borderRadius: 10, padding: 16 }}>
              <div style={{ color: BLUE, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14, color: NAVY }}>{c.title}</p>
              <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>
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
  const stepIdx = STEPS.indexOf(step);

  const stepLabels: Record<WizardStep, string> = {
    "origin": "Origin", "new-address": "New Address", "prev-address": "Previous",
    "people": "People", "status": "Status", "documents": "Documents", "review": "Review",
  };

  const stepContent: Record<WizardStep, React.ReactNode> = {
    "origin":       <StepOrigin f={form} set_={set_} />,
    "new-address":  <StepNewAddress f={form} upd={upd} set_={set_} />,
    "prev-address": <StepPrevAddress f={form} upd={upd} set_={set_} />,
    "people":       <StepPeople f={form} set_={set_} />,
    "status":       <StepStatus f={form} upd={upd} set_={set_} />,
    "documents":    <StepDocuments f={form} set_={set_} />,
    "review":       <StepReview f={form} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />

      {/* Restart confirm modal */}
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

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= stepIdx ? BLUE : "#e2e8f0",
                transition: "background 0.2s",
              }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            {stepLabels[step]} · Step {stepIdx + 1} of {STEPS.length}
          </p>
        </div>

        {/* Error banners */}
        {genError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <p style={{ color: "#dc2626", fontSize: 14, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} /> {genError}
            </p>
          </div>
        )}

        {/* Step content */}
        {stepContent[step]}

        {stepError && (
          <p style={{ color: "#ef4444", marginTop: 12, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertCircle size={14} /> {stepError}
          </p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={goBack} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#f1f5f9", border: "none", padding: "12px 20px",
            borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 15, color: NAVY,
          }}>
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={goNext} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: BLUE, color: "#fff", border: "none",
            padding: "12px 20px", borderRadius: 8, cursor: "pointer",
            fontWeight: 700, fontSize: 15,
          }}>
            {step === "review" ? "Pay €15 & get PDF" : "Continue"} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <AppFooter />
      <CookieBanner />
    </div>
  );
}
