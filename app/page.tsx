"use client";
// ═══════════════════════════════════════════════════════════════════
//  BERLIN BUTLER  ·  page.tsx  ·  Multi-Person Edition v7
//  - People stored as people: Person[] array (not p1/p2 flat keys)
//  - Up to 6 people; auto-generates ceil(n/2) Anmeldung sheets
//  - Identical form module for every person (no Person 1 vs 2 bugs)
//  - ZIP download via client-side Blob concatenation
//  - All 54 AcroForm fields · truncField() overflow guard
//  - No emoji in pdf-lib drawText · safe() WinAnsi guard
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Check, ChevronRight, Plus, Trash2,
  Download, FileText, Shield, MapPin, User, Users, Home,
  Building2, Info, ExternalLink, Zap, Globe,
  CreditCard, CheckCircle2, Church, Package, RotateCcw,
  AlertCircle, Sparkles, Layers,
} from "lucide-react";

// ─── PDF FIELD NAMES ─────────────────────────────────────────────
const F = {
  // ── Exact field names extracted from anmeldung_bei_der_meldebehoerde.pdf ──
  FAMILIENSTAND: "Familienstand 1oder 1 und 2Row1",
  NEUE_ALLEINIG: "Die neue Wohnung ist alleinige Wohnung",
  NEUE_HAUPT:    "Die neue Wohnung ist Hauptwohnung",
  NEUE_NEBEN:    "Die neue Wohnung ist Nebenwohnung",
  NEUE_EINZUG:   "Neue Wohnung Tag des Einzugs",
  NEUE_PLZ:      "Neue Wohnung des Einzugs Postleitzahl Gemeinde Ortsteil",
  NEUE_STRASSE:  "Neue Wohnung Straße Hausnummer Zusätze",
  BIS_ALLEINIG:  "Die \(letzte\) bisherige Wohnung \(im Inland\) war alleinige Wohnung",
  BIS_HAUPT:     "Die \(letzte\) bisherige Wohnung \(im Inland\) war Hauptwohnung",
  BIS_NEBEN:     "Die \(letzte\) bisherige Wohnung \(im Inland\) war Nebenwohnung",
  BIS_AUSZUG:    "Bisherige Wohnung Tag des Auszugs",
  BIS_PLZ:       "Bisherige Wohnung Postleitzahl Gemeinde Kreis Land",
  BIS_STRASSE:   "Bisherige Wohnung Straße Hausnummer Zusätze",
  AUSLAND_STAAT: "Bei Zuzug aus dem Ausland Staat",
  BEIB_NEIN:     "Wird die bisherige Wohnung beibehalten? Nein",
  BEIB_JA:       "Wird die bisherige Wohnung beibehalten? Ja und zwar als",
  BEIB_HAUPT:    "Wird die bisherige Wohnung beibehalten? Ja und zwar als Hauptwohnung",
  BEIB_NEBEN:    "Wird die bisherige Wohnung beibehalten? Ja und zwar als Nebenwohnung",
  WEITERE_NEIN:  "] noch weitere Wohnungen Nein",
  WEITERE_JA:    "] noch weitere Wohnungen Ja",
  P1_NAME:       "Person 1 Familienname ggf Doktorgrad Passname",
  P1_VORNAME:    "Person 1 Vornamen Rufnamen unterstreichen",
  P1_GEBURTSNAME:"Person 1 Geburtsname",
  P1_GESCHLECHT: "Person 1 Geschlecht",
  P1_GEBURT:     "Person 1 Tag Ort Land der Geburt",
  P1_RELIGION:   "Person 1 Religionsgesellschaft",
  P1_STAATSANG:  "Person 1 Staatsangehörigkeiten",
  P1_ORDENS:     "Person 1 Ordens- Künstlername",
  P2_NAME:       "Person 2 Familienname ggf Doktorgrad Passname",
  P2_VORNAME:    "Person 2 Vornamen Rufnamen unterstreichen",
  P2_GEBURTSNAME:"Person 2 Geburtsname",
  P2_GESCHLECHT: "Person 2 Geschlecht",
  P2_GEBURT:     "Person 2 Tag Ort Land der Geburt",
  P2_RELIGION:   "Person 2 Religionsgesellschaft",
  P2_STAATSANG:  "Person 2 Staatsangehörigkeiten",
  P2_ORDENS:     "Person 2 Ordens- Künstlername",
  EHE_ANGABEN:   "Angaben zur Eheschließung  Lebenspartnerschaft Datum Ort Land AZ",
  DOK1_NAME:     "Dokument 1 Name, Vorname",
  DOK1_ART:      "Dokument 1 Art",
  DOK1_BEHOERDE: "Dokument 1 Ausstellungsbehörde",
  DOK1_SERIAL:   "Dokument 1 Seriennummer",
  DOK1_DATUM:    "Dokument 1 Datum",
  DOK1_GUELTIG:  "Dokumente 1 gültig bis",
  DOK2_NAME:     "Dokument 2 Name Vorname",
  DOK2_ART:      "Dokument 2 Art",
  DOK2_BEHOERDE: "Dokument 2 Ausstellungsbehörde",
  DOK2_SERIAL:   "Dokument 2 Seriennummer",
  DOK2_DATUM:    "Dokumen 2 Datum",
  DOK2_GUELTIG:  "Dokument 2 gültig bis",
  UNTERSCHRIFT:  "Datum, Unterschrift [",
} as const;

// ─── Field char limits (px width / 4.5px per char @ Helvetica 8pt) ─
const FIELD_LIMITS: Record<string, number> = {
  "Neue Wohnung Tag des Einzugs": 13,
  "Neue Wohnung des Einzugs Postleitzahl Gemeinde Ortsteil": 44,
  "Neue Wohnung Stra\u00dfe Hausnummer Zus\u00e4tze": 58,
  "Bisherige Wohnung Tag des Auszugs": 14,
  "Bisherige Wohnung Postleitzahl Gemeinde Kreis Land": 45,
  "Bisherige Wohnung Stra\u00dfe Hausnummer Zus\u00e4tze": 59,
  "Bei Zuzug aus dem Ausland Staat": 33,
  "Familienstand 1oder 1 und 2Row1": 22,
  "Angaben zur Eheschlie\u00dfung  Lebenspartnerschaft Datum Ort Land AZ": 72,
  "Person 1 Familienname ggf Doktorgrad Passname": 95,
  "Person 1 Vornamen Rufnamen unterstreichen": 95,
  "Person 1 Geburtsname": 96,
  "Person 1 Geschlecht": 96,
  "Person 1 Tag Ort Land der Geburt": 96,
  "Person 1 Religionsgesellschaft": 96,
  "Person 1 Staatsangeh\u00f6rigkeiten": 96,
  "Person 1 Ordens- K\u00fcnstlername": 96,
  "Person 2 Familienname ggf Doktorgrad Passname": 95,
  "Person 2 Vornamen Rufnamen unterstreichen": 95,
  "Person 2 Geburtsname": 96,
  "Person 2 Geschlecht": 96,
  "Person 2 Tag Ort Land der Geburt": 96,
  "Person 2 Religionsgesellschaft": 96,
  "Person 2 Staatsangeh\u00f6rigkeiten": 96,
  "Person 2 Ordens- K\u00fcnstlername": 96,
  "Dokument 1 Name, Vorname": 132,
  "Dokument 1 Art": 4,
  "Dokument 1 Ausstellungsbeh\u00f6rde": 57,
  "Dokument 1 Seriennummer": 26,
  "Dokument 1 Datum": 14,
  "Dokumente 1 g\u00fcltig bis": 14,
  "Dokument 2 Name Vorname": 132,
  "Dokument 2 Art": 4,
  "Dokument 2 Ausstellungsbeh\u00f6rde": 57,
  "Dokument 2 Seriennummer": 26,
  "Dokumen 2 Datum": 14,
  "Dokument 2 g\u00fcltig bis": 14,
};

function truncField(fieldName: string, value: string): string {
  const limit = FIELD_LIMITS[fieldName];
  if (!limit || value.length <= limit) return value;
  console.warn("[SimplyExpat] Truncated:", fieldName, value.length, "->", limit);
  return value.slice(0, limit - 1) + "\u2026";
}

// ─── Types ────────────────────────────────────────────────────────
type AppPhase = "landing" | "wizard" | "payment" | "generating" | "done";
type WizardStep = "origin" | "new-address" | "prev-address" | "people" | "status" | "documents" | "review";

// Every person has EXACTLY the same fields
// relationship: "primary" (person 1), "spouse" (married to person 1), "child" — family members only
interface Person {
  lastName: string;
  firstName: string;
  birthName: string;
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
  relationship: "primary" | "spouse" | "child"; // family-only: Anmeldung legal requirement
  fillHandwritten: boolean; // privacy toggle — skip docSerial/docDate in PDF if true
  // Marriage details per-person (only relevant if relationship === "spouse")
  personMarriageDate: string;
  personMarriagePlace: string;
  personMarriageCountry: string;
}

const EMPTY_PERSON: Person = {
  lastName: "", firstName: "", birthName: "",
  birthDate: "", birthPlace: "", birthCountry: "",
  gender: "", religion: "", citizenship: "", artisticName: "",
  docType: "RP", docAuthority: "", docSerial: "", docDate: "", docValidUntil: "",
  relationship: "primary", fillHandwritten: false,
  personMarriageDate: "", personMarriagePlace: "", personMarriageCountry: "",
};

interface FormData {
  // Who & situation
  isBerlin: boolean | null; // null = not yet answered; true = Berlin; false = other city
  originCountry: string;
  isEU: boolean;
  maritalStatus: string;
  marriageDate: string;
  marriagePlace: string;
  marriageCountry: string;
  // People array — the core change
  people: Person[];
  // New address
  newStreet: string;
  newNumber: string;
  newAddExtra: string;  // Zusätze: Stockwerk, HH/VH etc
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
  furtherAddresses: string;
}

const EMPTY: FormData = {
  isBerlin: null,
  originCountry: "", isEU: true,
  maritalStatus: "", marriageDate: "", marriagePlace: "", marriageCountry: "",
  people: [{ ...EMPTY_PERSON }],
  newStreet: "", newNumber: "", newAddExtra: "", newPostalCode: "", newCity: "Berlin",
  moveInDate: "", newResType: "alleinige",
  prevStreet: "", prevNumber: "", prevPostalCode: "", prevCity: "",
  prevCountry: "", moveOutDate: "", prevResType: "alleinige",
  keepPrev: "nein", furtherAddresses: "nein",
};

const STORAGE_KEY = "simplyexpat-v1";
const MAX_PEOPLE = 6;

const GENDER_DE: Record<string,string> = { m:"m\u00e4nnlich", f:"weiblich", d:"divers", x:"ohne Angabe" };
const RELIGION_DE: Record<string,string> = { none:"ohne Konfession", rk:"r\u00f6m.-kath.", ev:"ev.", jd:"j\u00fcdisch", is:"islamisch", or:"orthodox", bu:"buddhistisch", so:"sonstige" };
const MARITAL_DE: Record<string,string> = {
  ledig:"ledig", verheiratet:"verheiratet",
  partnerschaft:"Lebenspartnersch.", // 17 chars — fits 22-char field
  getrennt:"getrennt lebend", geschieden:"geschieden", verwitwet:"verwitwet",
};
// ─── Country → German name (official Auswärtiges Amt terminology) ─
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

// ─── Citizenship (adjective form) → German ────────────────────────
const CITIZENSHIP_DE: Record<string,string> = {
  "Afghan":"afghanisch","Albanian":"albanisch","Algerian":"algerisch",
  "Argentine":"argentinisch","Australian":"australisch","Austrian":"österreichisch",
  "Bangladeshi":"bangladeschisch","Belarusian":"weißrussisch","Belgian":"belgisch",
  "Bolivian":"bolivianisch","Bosnian":"bosnisch-herzegowinisch","Brazilian":"brasilianisch",
  "British":"britisch","Bulgarian":"bulgarisch","Cambodian":"kambodschanisch",
  "Canadian":"kanadisch","Chilean":"chilenisch","Chinese":"chinesisch",
  "Colombian":"kolumbianisch","Croatian":"kroatisch","Cypriot":"zypriotisch",
  "Czech":"tschechisch","Danish":"dänisch","Dutch":"niederländisch",
  "Egyptian":"ägyptisch","Estonian":"estnisch","Ethiopian":"äthiopisch",
  "Finnish":"finnisch","French":"französisch","Georgian":"georgisch",
  "German":"deutsch","Ghanaian":"ghanaisch","Greek":"griechisch",
  "Hungarian":"ungarisch","Icelandic":"isländisch","Indian":"indisch",
  "Indonesian":"indonesisch","Iranian":"iranisch","Iraqi":"irakisch",
  "Irish":"irisch","Israeli":"israelisch","Italian":"italienisch",
  "Japanese":"japanisch","Jordanian":"jordanisch","Kazakh":"kasachisch",
  "Kenyan":"kenianisch","Latvian":"lettisch","Lebanese":"libanesisch",
  "Libyan":"libysch","Lithuanian":"litauisch","Luxembourgish":"luxemburgisch",
  "Malaysian":"malaysisch","Maltese":"maltesisch","Mexican":"mexikanisch",
  "Moldovan":"moldauisch","Moroccan":"marokkanisch","New Zealand":"neuseeländisch",
  "Nigerian":"nigerianisch","Norwegian":"norwegisch","Pakistani":"pakistanisch",
  "Palestinian":"palästinensisch","Peruvian":"peruanisch","Philippine":"philippinisch",
  "Filipino":"philippinisch","Polish":"polnisch","Portuguese":"portugiesisch",
  "Romanian":"rumänisch","Russian":"russisch","Saudi":"saudi-arabisch",
  "Saudi Arabian":"saudi-arabisch","Serbian":"serbisch","Singaporean":"singapurisch",
  "Slovak":"slowakisch","Slovenian":"slowenisch","Somali":"somalisch",
  "South African":"südafrikanisch","South Korean":"südkoreanisch","Spanish":"spanisch",
  "Sudanese":"sudanesisch","Swedish":"schwedisch","Swiss":"schweizerisch",
  "Syrian":"syrisch","Thai":"thailändisch","Tunisian":"tunesisch",
  "Turkish":"türkisch","Ukrainian":"ukrainisch","Venezuelan":"venezolanisch",
  "Vietnamese":"vietnamesisch","Yemeni":"jemenitisch",
  // Country name aliases — so typing "United States" works in citizenship field
  "American":"amerikanisch","United States":"amerikanisch","USA":"amerikanisch","US":"amerikanisch",
  "British":"britisch","United Kingdom":"britisch","UK":"britisch",
  "Swiss":"schweizerisch","Switzerland":"schweizerisch",
  "Dutch":"niederländisch","Netherlands":"niederländisch",
  "New Zealander":"neuseeländisch","New Zealand":"neuseeländisch",
  "Saudi":"saudi-arabisch","Saudi Arabia":"saudi-arabisch",
  "South African":"südafrikanisch","South Africa":"südafrikanisch",
  "South Korean":"südkoreanisch","South Korea":"südkoreanisch","Korean":"südkoreanisch",
  "Emirati":"emiratisch","UAE":"emiratisch","United Arab Emirates":"emiratisch",
  "Ivorian":"ivorisch","Ivory Coast":"ivorisch",
  "Congolese":"kongolesisch","Congo":"kongolesisch",
  "Burmese":"myanmarisch","Myanmar":"myanmarisch","Burma":"myanmarisch",
  "North Korean":"nordkoreanisch","North Korea":"nordkoreanisch",
  "Sri Lankan":"sri-lankisch","Sri Lanka":"sri-lankisch",
  "Taiwanese":"taiwanesisch","Taiwan":"taiwanesisch",
  "Angolan":"angolanisch","Angola":"angolanisch",
  "Armenian":"armenisch","Armenia":"armenisch",
  "Azerbaijani":"aserbaidschanisch","Azerbaijan":"aserbaidschanisch",
  "Bahraini":"bahrainisch","Bahrain":"bahrainisch",
  "Cameroonian":"kamerunisch","Cameroon":"kamerunisch",
  "Chilean":"chilenisch","Chile":"chilenisch",
  "Congolese":"kongolesisch","DR Congo":"kongolesisch",
  "Cuban":"kubanisch","Cuba":"kubanisch",
  "Dominican":"dominikanisch","Dominican Republic":"dominikanisch",
  "Ecuadorian":"ecuadorianisch","Ecuador":"ecuadorianisch",
  "Ghanaian":"ghanaisch","Ghana":"ghanaisch",
  "Guatemalan":"guatemaltekisch","Guatemala":"guatemaltekisch",
  "Haitian":"haitianisch","Haiti":"haitianisch",
  "Ivorian":"ivorisch","Ivory Coast":"ivorisch",
  "Jamaican":"jamaikanisch","Jamaica":"jamaikanisch",
  "Kuwaiti":"kuwaitisch","Kuwait":"kuwaitisch",
  "Kyrgyz":"kirgisisch","Kyrgyzstan":"kirgisisch",
  "Malian":"malisch","Mali":"malisch",
  "Mongolian":"mongolisch","Mongolia":"mongolisch",
  "Montenegrin":"montenegrinisch","Montenegro":"montenegrinisch",
  "Mozambican":"mosambikanisch","Mozambique":"mosambikanisch",
  "Nepali":"nepalesisch","Nepal":"nepalesisch",
  "Nicaraguan":"nicaraguanisch","Nicaragua":"nicaraguanisch",
  "Omani":"omanisch","Oman":"omanisch",
  "Panamanian":"panamaisch","Panama":"panamaisch",
  "Paraguayan":"paraguayisch","Paraguay":"paraguayisch",
  "Qatari":"katarisch","Qatar":"katarisch",
  "Rwandan":"ruandisch","Rwanda":"ruandisch",
  "Senegalese":"senegalesisch","Senegal":"senegalesisch",
  "Somali":"somalisch","Somalia":"somalisch",
  "Tanzanian":"tansanisch","Tanzania":"tansanisch",
  "Togolese":"togoisch","Togo":"togoisch",
  "Ugandan":"ugandisch","Uganda":"ugandisch",
  "Uruguayan":"uruguayisch","Uruguay":"uruguayisch",
  "Uzbek":"usbekisch","Uzbekistan":"usbekisch",
  "Zambian":"sambisch","Zambia":"sambisch",
  "Zimbabwean":"simbabwisch","Zimbabwe":"simbabwisch",
  "Tajik":"tadschikisch","Tajikistan":"tadschikisch",
};

// Translate a comma-separated citizenship string to German.
// "British, Italian" → "britisch, italienisch"
function toGermanCitizenship(raw: string): string {
  if (!raw?.trim()) return raw;
  return raw.split(",").map(s => {
    const t = s.trim();
    return CITIZENSHIP_DE[t] ?? COUNTRY_DE[t] ?? t;
  }).join(", ");
}

// Translate a country name to German.
// Short-form aliases removed from COUNTRY_DE to avoid duplicates in dropdowns
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

// Age in years from an ISO date string
function ageFromDOB(dob: string): number {
  if (!dob) return 99;
  return (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
}

// Marital status for PDF — based on relationship of the sheet's Person 1:
// - relationship === "child" → always ledig (children-only sheet, clerk expects this)
// - relationship === "primary" or "spouse" → use household marital status as entered
// Fallback to "ledig" if status is blank to prevent empty FAMILIENSTAND field.
function pdfMaritalStatus(formStatus: string, person: Person): string {
  if (person.relationship === "child")
    return MARITAL_DE["ledig"];
  return MARITAL_DE[formStatus] ?? (formStatus?.trim() ? formStatus : MARITAL_DE["ledig"]);
}

// All countries for searchable dropdowns (sorted)
const ALL_COUNTRIES: string[] = Object.keys(COUNTRY_DE).sort();
// All citizenships for searchable dropdowns
// ALL_CITIZENSHIPS: adjective forms + country name aliases, both searchable
const ALL_CITIZENSHIPS: string[] = Object.keys(CITIZENSHIP_DE).sort();
// Maps citizenship adjective → { country (English), isEU }
// Used to auto-derive originCountry and EU status from Step 1 citizenship answer
const CITIZENSHIP_TO_COUNTRY: Record<string, { country: string; isEU: boolean }> = {
  // EU members
  "Austrian":{"country":"Austria","isEU":true},"Austria":{"country":"Austria","isEU":true},
  "Belgian":{"country":"Belgium","isEU":true},"Belgium":{"country":"Belgium","isEU":true},
  "Bulgarian":{"country":"Bulgaria","isEU":true},"Bulgaria":{"country":"Bulgaria","isEU":true},
  "Croatian":{"country":"Croatia","isEU":true},"Croatia":{"country":"Croatia","isEU":true},
  "Cypriot":{"country":"Cyprus","isEU":true},"Cyprus":{"country":"Cyprus","isEU":true},
  "Czech":{"country":"Czech Republic","isEU":true},"Czech Republic":{"country":"Czech Republic","isEU":true},
  "Danish":{"country":"Denmark","isEU":true},"Denmark":{"country":"Denmark","isEU":true},
  "Estonian":{"country":"Estonia","isEU":true},"Estonia":{"country":"Estonia","isEU":true},
  "Finnish":{"country":"Finland","isEU":true},"Finland":{"country":"Finland","isEU":true},
  "French":{"country":"France","isEU":true},"France":{"country":"France","isEU":true},
  "German":{"country":"Germany","isEU":true},"Germany":{"country":"Germany","isEU":true},
  "Greek":{"country":"Greece","isEU":true},"Greece":{"country":"Greece","isEU":true},
  "Hungarian":{"country":"Hungary","isEU":true},"Hungary":{"country":"Hungary","isEU":true},
  "Irish":{"country":"Ireland","isEU":true},"Ireland":{"country":"Ireland","isEU":true},
  "Italian":{"country":"Italy","isEU":true},"Italy":{"country":"Italy","isEU":true},
  "Latvian":{"country":"Latvia","isEU":true},"Latvia":{"country":"Latvia","isEU":true},
  "Lithuanian":{"country":"Lithuania","isEU":true},"Lithuania":{"country":"Lithuania","isEU":true},
  "Luxembourgish":{"country":"Luxembourg","isEU":true},"Luxembourg":{"country":"Luxembourg","isEU":true},
  "Maltese":{"country":"Malta","isEU":true},"Malta":{"country":"Malta","isEU":true},
  "Dutch":{"country":"Netherlands","isEU":true},"Netherlands":{"country":"Netherlands","isEU":true},
  "Polish":{"country":"Poland","isEU":true},"Poland":{"country":"Poland","isEU":true},
  "Portuguese":{"country":"Portugal","isEU":true},"Portugal":{"country":"Portugal","isEU":true},
  "Romanian":{"country":"Romania","isEU":true},"Romania":{"country":"Romania","isEU":true},
  "Slovak":{"country":"Slovakia","isEU":true},"Slovakia":{"country":"Slovakia","isEU":true},
  "Slovenian":{"country":"Slovenia","isEU":true},"Slovenia":{"country":"Slovenia","isEU":true},
  "Spanish":{"country":"Spain","isEU":true},"Spain":{"country":"Spain","isEU":true},
  "Swedish":{"country":"Sweden","isEU":true},"Sweden":{"country":"Sweden","isEU":true},
  // EEA non-EU
  "Icelandic":{"country":"Iceland","isEU":true},"Iceland":{"country":"Iceland","isEU":true},
  "Norwegian":{"country":"Norway","isEU":true},"Norway":{"country":"Norway","isEU":true},
  "Liechtenstein":{"country":"Liechtenstein","isEU":true},
  // EFTA — not EU
  "Swiss":{"country":"Switzerland","isEU":false},"Switzerland":{"country":"Switzerland","isEU":false},
  // UK — post-Brexit, NOT EU
  "British":{"country":"United Kingdom","isEU":false},"United Kingdom":{"country":"United Kingdom","isEU":false},"UK":{"country":"United Kingdom","isEU":false},
  // Rest of world — adjective AND country name both work
  "American":{"country":"United States","isEU":false},"United States":{"country":"United States","isEU":false},"USA":{"country":"United States","isEU":false},"US":{"country":"United States","isEU":false},
  "Afghan":{"country":"Afghanistan","isEU":false},"Afghanistan":{"country":"Afghanistan","isEU":false},
  "Albanian":{"country":"Albania","isEU":false},"Albania":{"country":"Albania","isEU":false},
  "Algerian":{"country":"Algeria","isEU":false},"Algeria":{"country":"Algeria","isEU":false},
  "Angolan":{"country":"Angola","isEU":false},"Angola":{"country":"Angola","isEU":false},
  "Argentinian":{"country":"Argentina","isEU":false},"Argentine":{"country":"Argentina","isEU":false},"Argentina":{"country":"Argentina","isEU":false},
  "Armenian":{"country":"Armenia","isEU":false},"Armenia":{"country":"Armenia","isEU":false},
  "Australian":{"country":"Australia","isEU":false},"Australia":{"country":"Australia","isEU":false},
  "Azerbaijani":{"country":"Azerbaijan","isEU":false},"Azerbaijan":{"country":"Azerbaijan","isEU":false},
  "Bahraini":{"country":"Bahrain","isEU":false},"Bahrain":{"country":"Bahrain","isEU":false},
  "Bangladeshi":{"country":"Bangladesh","isEU":false},"Bangladesh":{"country":"Bangladesh","isEU":false},
  "Belarusian":{"country":"Belarus","isEU":false},"Belarus":{"country":"Belarus","isEU":false},
  "Bolivian":{"country":"Bolivia","isEU":false},"Bolivia":{"country":"Bolivia","isEU":false},
  "Bosnian":{"country":"Bosnia","isEU":false},"Bosnia":{"country":"Bosnia","isEU":false},"Bosnia and Herzegovina":{"country":"Bosnia","isEU":false},
  "Brazilian":{"country":"Brazil","isEU":false},"Brazil":{"country":"Brazil","isEU":false},
  "Cambodian":{"country":"Cambodia","isEU":false},"Cambodia":{"country":"Cambodia","isEU":false},
  "Cameroonian":{"country":"Cameroon","isEU":false},"Cameroon":{"country":"Cameroon","isEU":false},
  "Canadian":{"country":"Canada","isEU":false},"Canada":{"country":"Canada","isEU":false},
  "Chilean":{"country":"Chile","isEU":false},"Chile":{"country":"Chile","isEU":false},
  "Chinese":{"country":"China","isEU":false},"China":{"country":"China","isEU":false},
  "Colombian":{"country":"Colombia","isEU":false},"Colombia":{"country":"Colombia","isEU":false},
  "Congolese":{"country":"Congo","isEU":false},"Congo":{"country":"Congo","isEU":false},"DR Congo":{"country":"Congo","isEU":false},
  "Cuban":{"country":"Cuba","isEU":false},"Cuba":{"country":"Cuba","isEU":false},
  "Dominican":{"country":"Dominican Republic","isEU":false},"Dominican Republic":{"country":"Dominican Republic","isEU":false},
  "Ecuadorian":{"country":"Ecuador","isEU":false},"Ecuador":{"country":"Ecuador","isEU":false},
  "Egyptian":{"country":"Egypt","isEU":false},"Egypt":{"country":"Egypt","isEU":false},
  "Ethiopian":{"country":"Ethiopia","isEU":false},"Ethiopia":{"country":"Ethiopia","isEU":false},
  "Filipino":{"country":"Philippines","isEU":false},"Philippine":{"country":"Philippines","isEU":false},"Philippines":{"country":"Philippines","isEU":false},
  "Georgian":{"country":"Georgia","isEU":false},"Georgia":{"country":"Georgia","isEU":false},
  "Ghanaian":{"country":"Ghana","isEU":false},"Ghana":{"country":"Ghana","isEU":false},
  "Guatemalan":{"country":"Guatemala","isEU":false},"Guatemala":{"country":"Guatemala","isEU":false},
  "Guinean":{"country":"Guinea","isEU":false},"Guinea":{"country":"Guinea","isEU":false},
  "Haitian":{"country":"Haiti","isEU":false},"Haiti":{"country":"Haiti","isEU":false},
  "Indian":{"country":"India","isEU":false},"India":{"country":"India","isEU":false},
  "Indonesian":{"country":"Indonesia","isEU":false},"Indonesia":{"country":"Indonesia","isEU":false},
  "Iranian":{"country":"Iran","isEU":false},"Iran":{"country":"Iran","isEU":false},
  "Iraqi":{"country":"Iraq","isEU":false},"Iraq":{"country":"Iraq","isEU":false},
  "Israeli":{"country":"Israel","isEU":false},"Israel":{"country":"Israel","isEU":false},
  "Ivorian":{"country":"Ivory Coast","isEU":false},"Ivory Coast":{"country":"Ivory Coast","isEU":false},"Côte d'Ivoire":{"country":"Ivory Coast","isEU":false},
  "Jamaican":{"country":"Jamaica","isEU":false},"Jamaica":{"country":"Jamaica","isEU":false},
  "Japanese":{"country":"Japan","isEU":false},"Japan":{"country":"Japan","isEU":false},
  "Jordanian":{"country":"Jordan","isEU":false},"Jordan":{"country":"Jordan","isEU":false},
  "Kazakh":{"country":"Kazakhstan","isEU":false},"Kazakhstan":{"country":"Kazakhstan","isEU":false},
  "Kenyan":{"country":"Kenya","isEU":false},"Kenya":{"country":"Kenya","isEU":false},
  "Kuwaiti":{"country":"Kuwait","isEU":false},"Kuwait":{"country":"Kuwait","isEU":false},
  "Kyrgyz":{"country":"Kyrgyzstan","isEU":false},"Kyrgyzstan":{"country":"Kyrgyzstan","isEU":false},
  "Lao":{"country":"Laos","isEU":false},"Laos":{"country":"Laos","isEU":false},
  "Lebanese":{"country":"Lebanon","isEU":false},"Lebanon":{"country":"Lebanon","isEU":false},
  "Libyan":{"country":"Libya","isEU":false},"Libya":{"country":"Libya","isEU":false},
  "Malaysian":{"country":"Malaysia","isEU":false},"Malaysia":{"country":"Malaysia","isEU":false},
  "Malian":{"country":"Mali","isEU":false},"Mali":{"country":"Mali","isEU":false},
  "Mexican":{"country":"Mexico","isEU":false},"Mexico":{"country":"Mexico","isEU":false},
  "Moldovan":{"country":"Moldova","isEU":false},"Moldova":{"country":"Moldova","isEU":false},
  "Mongolian":{"country":"Mongolia","isEU":false},"Mongolia":{"country":"Mongolia","isEU":false},
  "Montenegrin":{"country":"Montenegro","isEU":false},"Montenegro":{"country":"Montenegro","isEU":false},
  "Moroccan":{"country":"Morocco","isEU":false},"Morocco":{"country":"Morocco","isEU":false},
  "Mozambican":{"country":"Mozambique","isEU":false},"Mozambique":{"country":"Mozambique","isEU":false},
  "Burmese":{"country":"Myanmar","isEU":false},"Myanmar":{"country":"Myanmar","isEU":false},"Burma":{"country":"Myanmar","isEU":false},
  "Nepali":{"country":"Nepal","isEU":false},"Nepal":{"country":"Nepal","isEU":false},
  "New Zealander":{"country":"New Zealand","isEU":false},"New Zealand":{"country":"New Zealand","isEU":false},
  "Nicaraguan":{"country":"Nicaragua","isEU":false},"Nicaragua":{"country":"Nicaragua","isEU":false},
  "Nigerian":{"country":"Nigeria","isEU":false},"Nigeria":{"country":"Nigeria","isEU":false},
  "North Korean":{"country":"North Korea","isEU":false},"North Korea":{"country":"North Korea","isEU":false},
  "North Macedonian":{"country":"North Macedonia","isEU":false},"North Macedonia":{"country":"North Macedonia","isEU":false},
  "Omani":{"country":"Oman","isEU":false},"Oman":{"country":"Oman","isEU":false},
  "Pakistani":{"country":"Pakistan","isEU":false},"Pakistan":{"country":"Pakistan","isEU":false},
  "Palestinian":{"country":"Palestine","isEU":false},"Palestine":{"country":"Palestine","isEU":false},
  "Panamanian":{"country":"Panama","isEU":false},"Panama":{"country":"Panama","isEU":false},
  "Paraguayan":{"country":"Paraguay","isEU":false},"Paraguay":{"country":"Paraguay","isEU":false},
  "Peruvian":{"country":"Peru","isEU":false},"Peru":{"country":"Peru","isEU":false},
  "Qatari":{"country":"Qatar","isEU":false},"Qatar":{"country":"Qatar","isEU":false},
  "Russian":{"country":"Russia","isEU":false},"Russia":{"country":"Russia","isEU":false},
  "Rwandan":{"country":"Rwanda","isEU":false},"Rwanda":{"country":"Rwanda","isEU":false},
  "Saudi":{"country":"Saudi Arabia","isEU":false},"Saudi Arabian":{"country":"Saudi Arabia","isEU":false},"Saudi Arabia":{"country":"Saudi Arabia","isEU":false},
  "Senegalese":{"country":"Senegal","isEU":false},"Senegal":{"country":"Senegal","isEU":false},
  "Serbian":{"country":"Serbia","isEU":false},"Serbia":{"country":"Serbia","isEU":false},
  "Singaporean":{"country":"Singapore","isEU":false},"Singapore":{"country":"Singapore","isEU":false},
  "Somali":{"country":"Somalia","isEU":false},"Somalia":{"country":"Somalia","isEU":false},
  "South African":{"country":"South Africa","isEU":false},"South Africa":{"country":"South Africa","isEU":false},
  "South Korean":{"country":"South Korea","isEU":false},"South Korea":{"country":"South Korea","isEU":false},"Korean":{"country":"South Korea","isEU":false},
  "Sri Lankan":{"country":"Sri Lanka","isEU":false},"Sri Lanka":{"country":"Sri Lanka","isEU":false},
  "Sudanese":{"country":"Sudan","isEU":false},"Sudan":{"country":"Sudan","isEU":false},
  "Syrian":{"country":"Syria","isEU":false},"Syria":{"country":"Syria","isEU":false},
  "Taiwanese":{"country":"Taiwan","isEU":false},"Taiwan":{"country":"Taiwan","isEU":false},
  "Tajik":{"country":"Tajikistan","isEU":false},"Tajikistan":{"country":"Tajikistan","isEU":false},
  "Tanzanian":{"country":"Tanzania","isEU":false},"Tanzania":{"country":"Tanzania","isEU":false},
  "Thai":{"country":"Thailand","isEU":false},"Thailand":{"country":"Thailand","isEU":false},
  "Togolese":{"country":"Togo","isEU":false},"Togo":{"country":"Togo","isEU":false},
  "Tunisian":{"country":"Tunisia","isEU":false},"Tunisia":{"country":"Tunisia","isEU":false},
  "Turkish":{"country":"Turkey","isEU":false},"Turkey":{"country":"Turkey","isEU":false},"Türkiye":{"country":"Turkey","isEU":false},
  "Ugandan":{"country":"Uganda","isEU":false},"Uganda":{"country":"Uganda","isEU":false},
  "Ukrainian":{"country":"Ukraine","isEU":false},"Ukraine":{"country":"Ukraine","isEU":false},
  "Emirati":{"country":"UAE","isEU":false},"UAE":{"country":"UAE","isEU":false},"United Arab Emirates":{"country":"UAE","isEU":false},
  "Uruguayan":{"country":"Uruguay","isEU":false},"Uruguay":{"country":"Uruguay","isEU":false},
  "Uzbek":{"country":"Uzbekistan","isEU":false},"Uzbekistan":{"country":"Uzbekistan","isEU":false},
  "Venezuelan":{"country":"Venezuela","isEU":false},"Venezuela":{"country":"Venezuela","isEU":false},
  "Vietnamese":{"country":"Vietnam","isEU":false},"Vietnam":{"country":"Vietnam","isEU":false},
  "Yemeni":{"country":"Yemen","isEU":false},"Yemen":{"country":"Yemen","isEU":false},
  "Zambian":{"country":"Zambia","isEU":false},"Zambia":{"country":"Zambia","isEU":false},
  "Zimbabwean":{"country":"Zimbabwe","isEU":false},"Zimbabwe":{"country":"Zimbabwe","isEU":false},
};

// Derive country + EU status from first citizenship in a comma-separated string
function citizenshipToOrigin(cit: string): { country: string; isEU: boolean } {
  const first = cit.split(",")[0].trim();
  return CITIZENSHIP_TO_COUNTRY[first] ?? { country: first, isEU: false };
}



const fmtDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00"); // noon avoids timezone shifts
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};
const safe = (s: string) => (s || "").replace(/[^\u0000-\u00ff]/g, "");

// How many Anmeldung sheets this family needs
const sheetsNeeded = (people: Person[]) => Math.ceil(Math.max(people.length, 1) / 2);

// ─── pdf-lib loader ───────────────────────────────────────────────
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

function savePDF(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 6000);
}

// ─── Fill one Anmeldung sheet for a pair of people ────────────────
async function fillAnmeldungSheet(
  d: FormData,
  p1: Person,
  p2: Person | null,
  pdfBytes: ArrayBuffer
): Promise<Uint8Array> {
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = doc.getForm();

  const txt = (n: string, v: string) => {
    if (!v?.trim()) return;
    try { form.getTextField(n).setText(truncField(n, v)); } catch {}
  };
  // This PDF uses "On" (not "Yes") as the checked appearance state.
  // pdf-lib's default check() uses "Yes" so we set AS and V manually using PDFName.
  const { PDFName } = await loadPdfLib();
  const chk = (n: string, checked: boolean) => {
    try {
      const fields = form.getFields();
      const field = fields.find((f: any) => { try { return f.getName() === n; } catch { return false; } });
      if (!field) return;
      const acro = (field as any).acroField;
      acro.dict.set(PDFName.of("AS"), PDFName.of(checked ? "On" : "Off"));
      acro.dict.set(PDFName.of("V"),  PDFName.of(checked ? "On" : "Off"));
    } catch {}
  };

  // ── Shared address data ──────────────────────────────────────
  txt(F.NEUE_EINZUG,   fmtDate(d.moveInDate));
  txt(F.NEUE_PLZ,      `${d.newPostalCode} ${d.newCity || "Berlin"}`);
  txt(F.NEUE_STRASSE,  [d.newStreet + " " + d.newNumber, d.newAddExtra].filter(s => s.trim()).join(", ").trim());
  chk(F.NEUE_ALLEINIG, d.newResType === "alleinige");
  chk(F.NEUE_HAUPT,    d.newResType === "Haupt");
  chk(F.NEUE_NEBEN,    d.newResType === "Neben");

  txt(F.BIS_AUSZUG,    fmtDate(d.moveOutDate));
  // BIS_PLZ: for German previous address include postal/city/country
  // For foreign previous address: leave BIS_PLZ empty — country goes to AUSLAND_STAAT only
  const prevIsGerman = d.prevCountry && ["germany","deutschland"].includes(d.prevCountry.toLowerCase());
  txt(F.BIS_PLZ, prevIsGerman
    ? [d.prevPostalCode, d.prevCity, toGermanCountry(d.prevCountry)].filter(Boolean).join(" ")
    : [d.prevPostalCode, d.prevCity].filter(Boolean).join(" "));
  txt(F.BIS_STRASSE,   `${d.prevStreet} ${d.prevNumber}`.trim());
  chk(F.BIS_ALLEINIG,  d.prevResType === "alleinige");
  chk(F.BIS_HAUPT,     d.prevResType === "Haupt");
  chk(F.BIS_NEBEN,     d.prevResType === "Neben");

  chk(F.BEIB_NEIN,  d.keepPrev === "nein");
  chk(F.BEIB_JA,    d.keepPrev !== "nein");
  chk(F.BEIB_HAUPT, d.keepPrev === "haupt");
  chk(F.BEIB_NEBEN, d.keepPrev === "neben");
  chk(F.WEITERE_NEIN, d.furtherAddresses === "nein");
  chk(F.WEITERE_JA,   d.furtherAddresses === "ja");

  // ── Familienstand + Ehe ─────────────────────────────────────────
  // Marital status source of truth for this sheet:
  //   - Sheet 1 (primary): actual maritalStatus + EHE_ANGABEN from form
  //   - Sheet 2+ (children only): ledig, no EHE_ANGABEN — clerk expects this
  const sheetP1IsChild = p1.relationship === "child";
  const sheetP1Status = pdfMaritalStatus(d.maritalStatus, p1);
  txt(F.FAMILIENSTAND, sheetP1Status);
  if (!sheetP1IsChild && (d.marriageDate || d.marriagePlace || d.marriageCountry)) {
    // EHE_ANGABEN has two child widgets sharing one parent — setText() writes to both.
    // All approaches to manipulate the AcroForm have failed.
    // Solution: bypass the form field entirely and draw text directly on the page
    // at the exact pixel coordinates of the LEFT child widget:
    // Widget 0 rect (pdf-lib bottom-left coords): x=140.28 y=267.00 w=327.00 h=13.20
    // Widget 1 (right box) starts at x=468.60 — our text never reaches it
    const eheValue = [fmtDate(d.marriageDate), d.marriagePlace, toGermanCountry(d.marriageCountry)].filter(Boolean).join(", ");
    try {
      const { StandardFonts, rgb } = await loadPdfLib();
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const page = doc.getPages()[0];
      // Draw white rectangle to cover whatever the AcroForm rendered in the left widget
      page.drawRectangle({ x: 140, y: 267, width: 327, height: 14, color: rgb(1, 1, 1) });
      // Draw our text in the left box only — truncate to fit
      const maxChars = 52;
      const displayValue = eheValue.length > maxChars ? eheValue.substring(0, maxChars) : eheValue;
      page.drawText(displayValue, { x: 142, y: 270, size: 9, font: helvetica, color: rgb(0, 0, 0) });
      // Also set the form field value for PDF readers that read AcroForm data
      // but DON'T update appearances (so it doesn't overwrite our drawing)
      try {
        const parentField = form.getTextField(F.EHE_ANGABEN);
        (parentField.acroField as any).dict.set(
          (await loadPdfLib()).PDFName.of("V"),
          (await loadPdfLib()).PDFString.of(eheValue)
        );
      } catch {}
    } catch {
      // Absolute fallback
      txt(F.EHE_ANGABEN, eheValue);
    }
  }

  // prevCountry fallback: blank → "Ausland" (standard Bürgeramt placeholder)
  const prevCountryDE = d.prevCountry?.trim()
    ? toGermanCountry(d.prevCountry)
    : (!d.prevStreet && !d.prevCity ? "Ausland" : "");
  if (prevCountryDE && !["germany","deutschland"].includes(prevCountryDE.toLowerCase()))
    txt(F.AUSLAND_STAAT, prevCountryDE);

  // ── Person 1 slot ────────────────────────────────────────────
  txt(F.P1_NAME,        p1.lastName.toUpperCase());
  txt(F.P1_VORNAME,     p1.firstName);
  txt(F.P1_GEBURTSNAME, p1.birthName);
  txt(F.P1_GESCHLECHT,  GENDER_DE[p1.gender] ?? p1.gender);
  txt(F.P1_GEBURT,      [fmtDate(p1.birthDate), p1.birthPlace, toGermanCountry(p1.birthCountry)].filter(Boolean).join(", "));
  txt(F.P1_RELIGION,    RELIGION_DE[p1.religion] ?? p1.religion);
  txt(F.P1_STAATSANG,   toGermanCitizenship(p1.citizenship));
  txt(F.P1_ORDENS,      p1.artisticName);
  txt(F.DOK1_NAME,      `${p1.lastName}, ${p1.firstName}`);
  txt(F.DOK1_ART,       p1.docType);
  txt(F.DOK1_BEHOERDE,  p1.docAuthority);
  if (!p1.fillHandwritten || String(p1.fillHandwritten) === "false") {
    txt(F.DOK1_SERIAL,  p1.docSerial);
    txt(F.DOK1_DATUM,   fmtDate(p1.docDate));
  }
  txt(F.DOK1_GUELTIG,   fmtDate(p1.docValidUntil));

  // ── Person 2 slot (optional) ─────────────────────────────────
  if (p2) {
    txt(F.P2_NAME,        p2.lastName.toUpperCase());
    txt(F.P2_VORNAME,     p2.firstName);
    txt(F.P2_GEBURTSNAME, p2.birthName);
    txt(F.P2_GESCHLECHT,  GENDER_DE[p2.gender] ?? p2.gender);
    txt(F.P2_GEBURT,      [fmtDate(p2.birthDate), p2.birthPlace, toGermanCountry(p2.birthCountry)].filter(Boolean).join(", "));
    txt(F.P2_RELIGION,    RELIGION_DE[p2.religion] ?? p2.religion);
    txt(F.P2_STAATSANG,   toGermanCitizenship(p2.citizenship));
    txt(F.P2_ORDENS,      p2.artisticName);
    txt(F.DOK2_NAME,      `${p2.lastName}, ${p2.firstName}`);
    txt(F.DOK2_ART,       p2.docType);
    txt(F.DOK2_BEHOERDE,  p2.docAuthority);
    if (!p2.fillHandwritten || String(p2.fillHandwritten) === "false") {
      txt(F.DOK2_SERIAL,  p2.docSerial);
      txt(F.DOK2_DATUM,   fmtDate(p2.docDate));
    }
    txt(F.DOK2_GUELTIG,   fmtDate(p2.docValidUntil));
  }

  form.flatten();
  return doc.save();
}

// ─── Generate ALL Anmeldung sheets ───────────────────────────────
// Multi-sheet marriage logic:
// Familienstand/Ehe fields are only filled on a sheet if the pair on that
// sheet includes a person with relationship "spouse" (married to the primary).
// Children and "other" occupants on sheet 2+ get ledig/empty marriage fields.
async function buildAllAnmeldungPDFs(d: FormData): Promise<{ bytes: Uint8Array; name: string }[]> {
  const r = await fetch("/anmeldung.pdf");
  if (!r.ok) throw new Error("PDF_NOT_FOUND");
  const templateBytes = await r.arrayBuffer();

  const results: { bytes: Uint8Array; name: string }[] = [];
  const people = d.people;
  const sheets = sheetsNeeded(people);

  for (let sheet = 0; sheet < sheets; sheet++) {
    const p1 = people[sheet * 2];
    const p2 = people[sheet * 2 + 1] ?? null;

    // Marriage data belongs on a sheet when:
    // - Person 1 of this sheet is the primary registrant (sheet 0) AND is married/partnered
    // - OR Person 2 is explicitly a spouse
    // This covers: married to someone on the form, married to someone outside the form,
    // and children-only sheets (where we clear marriage data).
    const isFirstSheet = sheet === 0;
    const sheetHasSpouse = (p2 && p2.relationship === "spouse") || p1.relationship === "spouse";
    const primaryIsMarried = isFirstSheet && (
      d.maritalStatus === "verheiratet" ||
      d.maritalStatus === "partnerschaft"
    );
    const includeMarriage = primaryIsMarried || sheetHasSpouse;

    const sheetFormData: FormData = {
      ...d,
      // Sheet 0 with married primary: always show marital status + marriage details
      // Sheet 0 without marriage: show status but no marriage details
      // Sheet 1+: force ledig, clear marriage data (children-only sheets)
      // Ledig only if the sheet's Person 1 is a child.
      // Spouse on sheet 2+ correctly inherits household marital status.
      maritalStatus: (p1.relationship === "child") ? "ledig" : d.maritalStatus,
      marriageDate:    includeMarriage ? d.marriageDate : "",
      marriagePlace:   includeMarriage ? d.marriagePlace : "",
      marriageCountry: includeMarriage ? d.marriageCountry : "",
    };

    const bytes = await fillAnmeldungSheet(sheetFormData, p1, p2, templateBytes);
    const label = sheets > 1 ? `_${sheet + 1}of${sheets}` : "";
    const name = `Anmeldung_Berlin_${p1.lastName}${label}.pdf`;
    results.push({ bytes, name });
  }
  return results;
}

// ─── Wohnungsgeberbestätigung ─────────────────────────────────────
async function buildWGPDF(d: FormData): Promise<Uint8Array> {
  // ─── WG Template Overlay ──────────────────────────────────────────────────
  // Template: flat scanned PDF, 491 x 772 pt, no AcroForm fields.
  // We ONLY fill the persons table (Familienname | Vorname columns).
  // Everything else (landlord address, property address, date, signature)
  // is left blank for the landlord to complete by hand.
  //
  // ── Coordinate derivation (verified against 200 DPI render) ──────────────
  // Scale: 200 DPI → 1pt = 2.778px. pdf-lib origin = bottom-left.
  // Row y values are text baselines measured from page bottom.
  //
  // Persons table row Y baselines (from bottom, 8pt font):
  //   Row 1: y=300  Row 2: y=283  Row 3: y=265  Row 4: y=247
  //   Row 5: y=230  Row 6: y=212  Row 7: y=195  Row 8: y=178
  //
  // Column X positions:
  //   Familienname: x=24    Vorname: x=251
  //
  // ── Self-check ────────────────────────────────────────────────────────────
  // A debug overlay can be enabled (DRAW_GRID=true) to render a red coordinate
  // grid over the template — use during development to verify positions.

  const DRAW_GRID = false; // set true to render calibration grid (dev only)

  const WG_ROW_Y = [300, 283, 265, 247, 230, 212, 195, 178] as const;
  const WG_COL_FNAM = 47;   // Familienname text x
  const WG_COL_VNAM = 274;   // Vorname text x
  const WG_FONT_SIZE = 8;
  const WG_PAGE_W = 491;
  const WG_PAGE_H = 772;

  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();

  // ── Load official template ────────────────────────────────────────────────
  const resp = await fetch("/wg-template.pdf");
  if (!resp.ok) return buildWGPDFFallback(d);

  const templateBytes = await resp.arrayBuffer();
  const doc  = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const page = doc.getPages()[0];
  const HB   = await doc.embedFont(StandardFonts.HelveticaBold);
  const HV   = await doc.embedFont(StandardFonts.Helvetica);
  const INK  = rgb(0.06, 0.08, 0.20); // dark navy — matches handwriting feel

  // ── Self-check: verify page dimensions match template ─────────────────────
  const { width, height } = page.getSize();
  if (Math.abs(width - WG_PAGE_W) > 2 || Math.abs(height - WG_PAGE_H) > 2) {
    console.warn(
      `[SimplyExpat] WG template size mismatch: got ${width}×${height}, expected ${WG_PAGE_W}×${WG_PAGE_H}. ` +
      `Coordinates may be off — falling back to generated PDF.`
    );
    return buildWGPDFFallback(d);
  }

  // ── Optional calibration grid (dev only) ─────────────────────────────────
  if (DRAW_GRID) {
    const RED = rgb(0.8, 0.05, 0.05);
    const BLUE = rgb(0.05, 0.05, 0.8);
    // Horizontal lines every 10pt
    for (let y = 0; y <= WG_PAGE_H; y += 10) {
      const thick = y % 50 === 0 ? 0.6 : 0.2;
      const col = y % 50 === 0 ? BLUE : rgb(0.85, 0.90, 1);
      page.drawLine({ start: { x: 0, y }, end: { x: WG_PAGE_W, y }, thickness: thick, color: col });
      if (y % 50 === 0) page.drawText(String(y), { x: 2, y: y + 1, size: 5, font: HB, color: BLUE });
    }
    // Vertical lines every 50pt
    for (let x = 0; x <= WG_PAGE_W; x += 50) {
      page.drawLine({ start: { x, y: 0 }, end: { x, y: WG_PAGE_H }, thickness: 0.3, color: rgb(0.85, 0.90, 1) });
      page.drawText(String(x), { x: x + 1, y: 5, size: 5, font: HB, color: BLUE });
    }
    // Mark row positions in red
    WG_ROW_Y.forEach((y, i) => {
      page.drawLine({ start: { x: WG_COL_FNAM, y }, end: { x: 460, y }, thickness: 0.5, color: RED });
      page.drawText(`row${i + 1} y=${y}`, { x: 2, y: y + 1, size: 4.5, font: HV, color: RED });
    });
    // Mark column x positions
    [WG_COL_FNAM, WG_COL_VNAM].forEach(x => {
      page.drawLine({ start: { x, y: 150 }, end: { x, y: 320 }, thickness: 0.5, color: RED });
      page.drawText(`x=${x}`, { x: x + 1, y: 155, size: 4.5, font: HV, color: RED });
    });
  }

  // ── Fill persons table — Familienname | Vorname ───────────────────────────
  // ONLY the names. No address, no date, no checkboxes.
  // Landlord fills all remaining fields themselves.
  const people = d.people.filter(p => p.firstName || p.lastName);

  people.forEach((p, i) => {
    if (i >= WG_ROW_Y.length) return; // max 8 rows on the form
    const y = WG_ROW_Y[i];

    // Familienname — UPPERCASE as required
    const lastName = safe(p.lastName || "").toUpperCase();
    if (lastName) {
      page.drawText(lastName, {
        x: WG_COL_FNAM,
        y,
        size: WG_FONT_SIZE,
        font: HB,
        color: INK,
      });
    }

    // Vorname
    const firstName = safe(p.firstName || "");
    if (firstName) {
      page.drawText(firstName, {
        x: WG_COL_VNAM,
        y,
        size: WG_FONT_SIZE,
        font: HV,
        color: INK,
      });
    }
  });

  return doc.save();
}


async function buildWGPDFFallback(d: FormData): Promise<Uint8Array> {
  // Fallback WG PDF if template not found — generates styled document
  const { PDFDocument, rgb, StandardFonts, PageSizes } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const page = doc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const hv = await doc.embedFont(StandardFonts.Helvetica);
  const hb = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.08, 0.16, 0.42);
  const dark = rgb(0.06, 0.08, 0.14);
  const muted = rgb(0.38, 0.42, 0.52);
  const M = 54;
  const W = width - M * 2;
  const p1 = d.people[0] ?? EMPTY_PERSON;

  page.drawRectangle({ x: 0, y: height - 76, width, height: 76, color: navy });
  page.drawText("Wohnungsgeberbestätigung", { x: M, y: height - 34, size: 20, font: hb, color: rgb(1,1,1) });
  page.drawText("gemäß § 19 Bundesmeldegesetz (BMG)", { x: M, y: height - 56, size: 10, font: hv, color: rgb(0.72,0.84,1) });

  let y = height - 102;
  const sec = (t: string) => {
    page.drawRectangle({ x: M, y: y - 3, width: W, height: 22, color: rgb(0.93, 0.96, 1) });
    page.drawText(safe(t), { x: M + 8, y: y + 5, size: 8, font: hb, color: navy });
    y -= 30;
  };
  const fld = (label: string, val: string) => {
    page.drawText(safe(label), { x: M, y, size: 7.5, font: hv, color: muted });
    y -= 14;
    page.drawText(safe(val) || "_____________________________________________", {
      x: M, y, size: val ? 11 : 10, font: val ? hb : hv,
      color: val ? dark : rgb(0.72, 0.75, 0.82),
    });
    y -= 7;
    page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.4, color: rgb(0.82, 0.86, 0.92) });
    y -= 18;
  };

  sec("A.  Wohnung / New Address");
  fld("Straße und Hausnummer", `${d.newStreet} ${d.newNumber}`.trim());
  fld("Postleitzahl und Ort", `${d.newPostalCode} ${d.newCity || "Berlin"}`.trim());
  fld("Einzugsdatum", fmtDate(d.moveInDate));

  sec("B.  Meldepflichtige Personen / Tenants");
  d.people.forEach((p, i) => {
    if (p.firstName || p.lastName)
      fld(`Person ${i + 1}`, `${p.lastName.toUpperCase()}, ${p.firstName}`);
  });

  sec("C.  Wohnungsgeber / Landlord (to complete & sign)");
  fld("Name, Vorname des Wohnungsgebers", "");
  fld("Anschrift des Wohnungsgebers", "");
  fld("Datum und Unterschrift", "");

  const legal = ["§ 19 BMG: Der Wohnungsgeber ist verpflichtet, diese Bestätigung auszustellen.", "Verweigerung ist eine Ordnungswidrigkeit (Bußgeld bis zu 1.000 Euro)."];
  y -= 8;
  const lh = legal.length * 13 + 14;
  page.drawRectangle({ x: M, y: y - lh + 6, width: W, height: lh, color: rgb(1, 0.95, 0.93), borderColor: rgb(0.9, 0.7, 0.65), borderWidth: 0.6 });
  legal.forEach(l => { page.drawText(safe(l), { x: M + 8, y, size: 8, font: hv, color: rgb(0.55, 0.1, 0.08) }); y -= 13; });

  page.drawLine({ start: { x: M, y: 36 }, end: { x: width - M, y: 36 }, thickness: 0.3, color: rgb(0.82, 0.86, 0.92) });
  page.drawText("SimplyExpat Berlin  ·  " + new Date().toLocaleDateString("de-DE"), { x: M, y: 20, size: 7, font: hv, color: rgb(0.68, 0.72, 0.8) });
  return doc.save();
}

// ─── Checkliste ───────────────────────────────────────────────────
async function buildChecklistePDF(d: FormData): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts, PageSizes } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const page = doc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const hv = await doc.embedFont(StandardFonts.Helvetica);
  const hb = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.08, 0.16, 0.42);
  const dark = rgb(0.06, 0.08, 0.14);
  const muted = rgb(0.4, 0.45, 0.55);
  const M = 52;
  const W = width - M * 2;
  const p1 = d.people[0] ?? EMPTY_PERSON;
  const sheets = sheetsNeeded(d.people);

  // ── Multi-page checklist engine ──────────────────────────────────
  // Pages are added on demand when content overflows.
  let curPage = page;
  const FOOTER_Y = 52; // space reserved at bottom for footer
  const TOP_MARGIN = 92; // first page: below header
  const TOP_MARGIN_CONT = 52; // continuation pages: top margin

  const drawFooter = (pg: any) => {
    pg.drawLine({ start: { x: M, y: 36 }, end: { x: width - M, y: 36 }, thickness: 0.3, color: rgb(0.8, 0.84, 0.92) });
    pg.drawText("SimplyExpat Berlin  \u00b7  service.berlin.de  \u00b7  Ohne Gew\u00e4hr", { x: M, y: 20, size: 7, font: hv, color: rgb(0.65, 0.68, 0.76) });
  };

  const addNewPage = () => {
    drawFooter(curPage);
    curPage = doc.addPage(PageSizes.A4);
    // Continuation header
    curPage.drawRectangle({ x: 0, y: height - 36, width, height: 36, color: navy });
    curPage.drawText("B\u00fcrgeramt Checkliste (Fortsetzung)", { x: M, y: height - 24, size: 11, font: hb, color: rgb(1,1,1) });
    return height - TOP_MARGIN_CONT;
  };

  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: navy });
  page.drawText("B\u00fcrgeramt Checkliste", { x: M, y: height - 31, size: 20, font: hb, color: rgb(1,1,1) });
  page.drawText(safe(`${p1.firstName} ${p1.lastName}  \u00b7  ${d.people.length} Person(en)  \u00b7  ${sheets} Formular(e)  \u00b7  ${new Date().toLocaleDateString("de-DE")}`), {
    x: M, y: height - 53, size: 9, font: hv, color: rgb(0.7, 0.82, 1),
  });

  let y = height - TOP_MARGIN;

  const wrap = (text: string, max: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let cur = "";
    words.forEach(w => {
      if ((cur + " " + w).trim().length > max) { if (cur) lines.push(cur.trim()); cur = w; }
      else cur = (cur + " " + w).trim();
    });
    if (cur) lines.push(cur.trim());
    return lines;
  };

  const secHdr = (t: string) => {
    if (y < FOOTER_Y + 40) y = addNewPage();
    curPage.drawRectangle({ x: M, y: y - 2, width: W, height: 22, color: rgb(0.93, 0.96, 1) });
    curPage.drawText(safe(t), { x: M + 8, y: y + 5, size: 8.5, font: hb, color: navy });
    y -= 30;
  };

  type Item = { text: string; note?: string; urgent?: boolean };
  const items: Item[] = [];

  if (sheets === 1) {
    items.push({ text: "Anmeldeformular (1 Formular, ausgedruckt oder digital)", urgent: true });
  } else {
    items.push({ text: `${sheets} Anmeldeformulare (je 2 Personen pro Blatt, ausgedruckt oder digital)`, urgent: true,
      note: `Ihre Familie benoetigt ${sheets} separate Formulare. Alle wurden generiert und heruntergeladen.` });
  }
  items.push({ text: "Wohnungsgeberbest\u00e4tigung vom Vermieter (Original, unterschrieben)", urgent: true,
    note: "\u00a7 19 BMG: Vermieter ist zur Ausstellung gesetzlich verpflichtet." });

  d.people.forEach((p, i) => {
    if (p.lastName || p.firstName) {
      const personIsEU = p.citizenship
        ? p.citizenship.split(",").map((s: string) => s.trim()).some((c: string) => (CITIZENSHIP_TO_COUNTRY[c] ?? {isEU: false}).isEU)
        : d.isEU;
      items.push({
        text: safe(`${personIsEU ? "Reisepass oder Ausweis" : "Reisepass (kein Ausweis)"}: ${p.firstName} ${p.lastName} (Person ${i + 1})`),
        urgent: true,
        note: personIsEU
          ? "EU/EWR: Reisepass oder Personalausweis. Alle Staatsangehoerigkeiten mitbringen."
          : "Nicht-EU: Nur Reisepass gueltig. Alle Paesse bei mehreren Staatsangehoerigkeiten mitbringen.",
      });
    }
  });
  items.push({ text: "Terminbest\u00e4tigung des B\u00fcrgeramts (digital oder Ausdruck)" });
  if (!d.isEU) items.push({ text: "Aufenthaltstitel oder Visum (Original + Kopie)", urgent: true,
    note: "Als Drittstaatsangeh\u00f6riger zwingend. Ohne dieses Dokument wird die Anmeldung verweigert." });
  if (d.maritalStatus === "verheiratet" || d.maritalStatus === "partnerschaft")
    items.push({ text: "Heiratsurkunde (Original)", urgent: true,
      note: "Ausl\u00e4ndische Urkunden: Vereidigte deutsche \u00dcbersetzung + ggf. Apostille erforderlich." });
  if (d.maritalStatus === "geschieden")
    items.push({ text: "Scheidungsurteil (Original + beglaubigte Kopie)" });
  items.push({ text: "Mietvertrag (Kopie \u2013 empfohlen, nicht vorgeschrieben)" });

  secHdr("Mitzubringende Dokumente / Required Documents");

  // Draw each item — add new page if needed
  items.forEach(item => {
    const textLines = wrap(safe(item.text), 77);
    const noteLines = item.note ? wrap(safe("Hinweis: " + item.note), 82) : [];
    const itemHeight = 13 * textLines.length + (noteLines.length > 0 ? 11 * noteLines.length + 4 : 0) + 10;

    if (y - itemHeight < FOOTER_Y) y = addNewPage();

    curPage.drawRectangle({ x: M, y: y - 1, width: 11, height: 11,
      borderColor: item.urgent ? navy : rgb(0.6, 0.65, 0.75),
      borderWidth: item.urgent ? 1.5 : 1, color: rgb(1,1,1) });
    textLines.forEach((l, i) => {
      curPage.drawText(l, { x: M + 18, y: y + (i === 0 ? 6 : 6 - i * 11),
        size: 9.5, font: item.urgent && i === 0 ? hb : hv, color: item.urgent ? dark : muted });
    });
    y -= 13 * textLines.length;
    noteLines.forEach(l => {
      curPage.drawText(l, { x: M + 18, y, size: 7.8, font: hv, color: rgb(0.38, 0.44, 0.66) });
      y -= 11;
    });
    y -= 10;
  });

  // Tips section — only if space remains, otherwise new page
  if (y < FOOTER_Y + 80) y = addNewPage();
  y -= 6;
  secHdr("Tipps: So bekommen Sie schneller einen Termin");
  const tips: [string,string][] = [
    ["Dienstags 7:55-8:00 Uhr:", "Neue Slots auf service.berlin.de erscheinen \u2013 Browser sofort refreshen."],
    ["Rufnummer 115 um 7:00 Uhr:", "Stornierungspl\u00e4tze telefonisch anfragen \u2013 morgens am besten."],
    ["Walk-in:", "B\u00fcrger\u00e4mter Tempelhof, Mitte \u2013 30 Min. vor \u00d6ffnungszeit erscheinen."],
  ];
  tips.forEach(([b, r]) => {
    if (y - 30 < FOOTER_Y) y = addNewPage();
    curPage.drawText(safe(b), { x: M, y, size: 8.5, font: hb, color: dark }); y -= 12;
    curPage.drawText(safe("  " + r), { x: M, y, size: 8.5, font: hv, color: muted }); y -= 14;
  });

  drawFooter(curPage);
  return doc.save();
}

// ─── Guide PDF — complete rewrite with disciplined layout engine ─────────────
// Core fix: compute exact block height FIRST, draw background, THEN draw text.
// Y cursor is always the TOP of the current drawing area (pdf-lib origin = bottom-left,
// so we subtract from PH to get "top-down" y values, then pass PH - y to drawText).
async function buildGuidePDF(d: FormData): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts, PageSizes } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const HV = await doc.embedFont(StandardFonts.Helvetica);
  const HB = await doc.embedFont(StandardFonts.HelveticaBold);
  const HI = await doc.embedFont(StandardFonts.HelveticaOblique);

  // ── Palette ──────────────────────────────────────────────────────────────
  const NAVY  = rgb(0.08, 0.14, 0.38);
  const BLUE  = rgb(0.14, 0.35, 0.82);
  const BLUEL = rgb(0.93, 0.96, 1.00);
  const GRN   = rgb(0.04, 0.44, 0.24);
  const GRNL  = rgb(0.93, 0.99, 0.95);
  const AMB   = rgb(0.54, 0.28, 0.00);
  const AMBL  = rgb(1.00, 0.97, 0.88);
  const RED   = rgb(0.60, 0.07, 0.07);
  const REDL  = rgb(1.00, 0.93, 0.93);
  const DARK  = rgb(0.13, 0.16, 0.22);   // anthracite — not pure black
  const MID   = rgb(0.32, 0.37, 0.47);
  const MUTE  = rgb(0.52, 0.57, 0.65);
  const WHITE = rgb(1, 1, 1);
  const BGROW = rgb(0.97, 0.975, 0.988); // very light blue-grey row bg
  const LNCLR = rgb(0.88, 0.90, 0.94);  // separator line colour

  // ── Context data ──────────────────────────────────────────────────────────
  const p1          = d.people[0] ?? EMPTY_PERSON;
  const sheets      = sheetsNeeded(d.people);
  const isEU        = d.isEU;
  const isMarried   = d.maritalStatus === "verheiratet" || d.maritalStatus === "partnerschaft";
  const isDivorced  = d.maritalStatus === "geschieden";
  const isWidowed   = d.maritalStatus === "verwitwet";
  const hasForeignBirth    = d.people.some(p => p.birthCountry &&
    !["germany","deutschland"].includes(p.birthCountry.toLowerCase()));
  const hasForeignMarriage = isMarried && d.marriageCountry &&
    !["germany","deutschland"].includes(d.marriageCountry.toLowerCase());
  const maritalLabel = { verheiratet:"Married", partnerschaft:"Partnership",
    geschieden:"Divorced", verwitwet:"Widowed", ledig:"Single", getrennt:"Separated" };

  // ── Word wrapper ──────────────────────────────────────────────────────────
  // Returns array of strings that each fit within maxPx at fontSize using Helvetica
  // Approximation: Helvetica average char width ≈ fontSize * 0.52
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

  // ── Layout constants (A4 = 595 × 842 pt) ─────────────────────────────────
  const PW  = 595.28;
  const PH  = 841.89;
  const ML  = 50;        // left margin
  const MR  = 50;        // right margin
  const CW  = PW - ML - MR;  // 495.28 pt content width
  const LH  = 15.4;     // base line height (11pt × 1.4)
  const FOOTER_H = 40;  // reserved at bottom

  // ── Low-level draw helper — Y is top-down cursor ─────────────────────────
  // pdf-lib y=0 is bottom; we track topY and convert
  const drawTxt = (page: any, text: string, x: number, topY: number, size: number, font: any, color: any) => {
    page.drawText(safe(text), { x, y: PH - topY - size, size, font, color });
  };

  // ── High-level block primitives ───────────────────────────────────────────

  // Section header — full-width tinted bar with left accent stripe
  // Returns new cursor after the block
  const secBlock = (page: any, title: string, cursor: number): number => {
    const H = 26;
    const barY = PH - cursor - H;
    page.drawRectangle({ x: ML, y: barY, width: CW, height: H, color: BLUEL });
    page.drawRectangle({ x: ML, y: barY, width: 4,  height: H, color: NAVY });
    page.drawText(title.toUpperCase(), {
      x: ML + 12, y: barY + 8, size: 8.5, font: HB, color: NAVY,
    });
    return cursor + H + 10; // 10pt gap after header
  };

  // Separator line
  const sepLine = (page: any, cursor: number): number => {
    page.drawLine({ start: { x: ML, y: PH - cursor }, end: { x: ML + CW, y: PH - cursor }, thickness: 0.5, color: LNCLR });
    return cursor + 8;
  };

  // Paragraph block (plain body text, left-aligned)
  const paraBlock = (page: any, text: string, cursor: number, indent = 0, fs = 11, font = HV, color = DARK): number => {
    const lines = wrapPx(text, CW - indent, fs);
    for (const line of lines) {
      page.drawText(line, { x: ML + indent, y: PH - cursor - fs, size: fs, font, color });
      cursor += LH;
    }
    return cursor;
  };

  // Checklist item — background first, then content — ZERO overlap guaranteed
  // Returns new cursor after the block
  const checkItem = (
    page: any,
    text: string,
    cursor: number,
    tag: "required"|"recommended",
    note?: string,
    warn?: string,
  ): number => {
    const FS      = 11;
    const NOTE_FS = 9.5;
    const WARN_FS = 9.5;
    const PAD_T   = 9;  // top padding inside card
    const PAD_B   = 9;  // bottom padding inside card
    const CB_X    = ML + 10; // checkbox x
    const TX_X    = ML + 28; // text x (after checkbox)
    const TX_W    = CW - 30; // text width

    const mainLines = wrapPx(text, TX_W, FS);
    const noteLines = note ? wrapPx("Note: " + note, TX_W - 4, NOTE_FS) : [];
    const warnLines = warn ? wrapPx(warn, TX_W - 4, WARN_FS) : [];

    // Compute total block height
    const mainH = mainLines.length * LH;
    const noteH = noteLines.length > 0 ? noteLines.length * (NOTE_FS * 1.45) + 5 : 0;
    const warnH = warnLines.length > 0 ? warnLines.length * (WARN_FS * 1.45) + 12 : 0;
    const totalH = PAD_T + mainH + noteH + warnH + PAD_B;

    // Skip if no room — caller should handle page overflow
    if (cursor + totalH > PH - FOOTER_H - 10) return cursor;

    // Colours
    const tagC = tag === "required"
      ? { bg: REDL,  border: RED,  dot: RED,  pill: "Required",    pillC: RED  }
      : { bg: GRNL,  border: GRN,  dot: GRN,  pill: "Recommended", pillC: GRN  };

    // Card background
    const cardY = PH - cursor - totalH;
    page.drawRectangle({ x: ML, y: cardY, width: CW, height: totalH,
      color: tagC.bg, borderRadius: 5 });
    // Left accent stripe
    page.drawRectangle({ x: ML, y: cardY, width: 4, height: totalH,
      color: tagC.dot, borderRadius: 5 });

    // Checkbox [ ] at top-left inside card
    const cbY = PH - cursor - PAD_T - FS;
    page.drawRectangle({ x: CB_X, y: cbY + 1, width: 10, height: 10,
      color: WHITE, borderColor: tagC.dot, borderWidth: 1.3 });

    // Main text lines
    let ty = cursor + PAD_T;
    for (let i = 0; i < mainLines.length; i++) {
      page.drawText(mainLines[i], {
        x: TX_X, y: PH - ty - FS,
        size: FS, font: i === 0 ? HB : HV, color: DARK,
      });
      ty += LH;
    }

    // Tag pill (top right)
    const pillW = tagC.pill.length * 5.2 + 10;
    const pillY = PH - cursor - PAD_T - NOTE_FS;
    page.drawRectangle({ x: ML + CW - pillW - 2, y: pillY + 1, width: pillW, height: 13,
      color: tagC.dot, borderRadius: 3 });
    page.drawText(tagC.pill, { x: ML + CW - pillW + 2, y: pillY + 3.5,
      size: 7.5, font: HB, color: WHITE });

    // Note lines (italics, muted)
    if (noteLines.length > 0) {
      ty += 4;
      for (const nl of noteLines) {
        page.drawText(nl, { x: TX_X + 2, y: PH - ty - NOTE_FS,
          size: NOTE_FS, font: HI, color: MID });
        ty += NOTE_FS * 1.45;
      }
    }

    // Warning box (red, indented)
    if (warnLines.length > 0) {
      ty += 6;
      const warnBoxH = warnLines.length * (WARN_FS * 1.45) + 8;
      const warnBoxY = PH - ty - warnBoxH;
      page.drawRectangle({ x: TX_X - 2, y: warnBoxY, width: TX_W - 4, height: warnBoxH,
        color: rgb(1, 0.91, 0.91), borderRadius: 3 });
      for (const wl of warnLines) {
        page.drawText(wl, { x: TX_X + 4, y: PH - ty - WARN_FS,
          size: WARN_FS, font: HB, color: RED });
        ty += WARN_FS * 1.45;
      }
    }

    return cursor + totalH + 7; // 7pt gap between items
  };

  // Callout box (tinted, left stripe, body text)
  const calloutBlock = (page: any, text: string, cursor: number, bgC: any, stripeC: any): number => {
    const FS   = 10;
    const PAD  = 10;
    const lines = wrapPx(text, CW - 20, FS);
    const blockH = lines.length * (FS * 1.45) + PAD * 2;
    if (cursor + blockH > PH - FOOTER_H) return cursor;
    const boxY = PH - cursor - blockH;
    page.drawRectangle({ x: ML, y: boxY, width: CW, height: blockH,
      color: bgC, borderRadius: 6 });
    page.drawRectangle({ x: ML, y: boxY, width: 4, height: blockH,
      color: stripeC, borderRadius: 6 });
    let ty = cursor + PAD;
    for (let i = 0; i < lines.length; i++) {
      page.drawText(lines[i], { x: ML + 14, y: PH - ty - FS,
        size: FS, font: i === 0 ? HB : HV, color: DARK });
      ty += FS * 1.45;
    }
    return cursor + blockH + 8;
  };

  // Bullet point (colored dot + bold label + wrapped body)
  const bulletBlock = (page: any, label: string, body: string, cursor: number, dotC = BLUE): number => {
    const FS  = 10.5;
    const DOT = ML + 8;
    const TX  = ML + 18;
    const TW  = CW - 20;
    // measure label width (approx)
    const labelW = label.length * FS * 0.55;
    const bodyLines = wrapPx(body, TW - labelW - 4, FS);
    const totalLines = bodyLines.length + (bodyLines.length > 1 ? bodyLines.length - 1 : 0);
    const blockH = bodyLines.length * (FS * 1.4);
    if (cursor + blockH > PH - FOOTER_H) return cursor;
    // Dot
    page.drawRectangle({ x: DOT, y: PH - cursor - FS - 1, width: 4, height: 4,
      color: dotC, borderRadius: 2 });
    // Label
    page.drawText(safe(label), { x: TX, y: PH - cursor - FS,
      size: FS, font: HB, color: dotC });
    // Body — first line after label, subsequent lines below
    for (let i = 0; i < bodyLines.length; i++) {
      const lineX = i === 0 ? TX + labelW + 4 : TX;
      page.drawText(safe(bodyLines[i]), {
        x: lineX, y: PH - cursor - FS - i * FS * 1.4,
        size: FS, font: HV, color: DARK,
      });
    }
    return cursor + blockH + 4;
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  PAGE 1 — PERSONALISED CHECKLIST
  // ═════════════════════════════════════════════════════════════════════════
  const p1pg = doc.addPage([PW, PH] as [number, number]);

  // ── Header bar ──────────────────────────────────────────────────────────
  const HDR_H = 82;
  p1pg.drawRectangle({ x: 0, y: PH - HDR_H, width: PW, height: HDR_H, color: NAVY });

  // Title
  p1pg.drawText("Your Personalised Anmeldung Checklist", {
    x: ML, y: PH - 34, size: 20, font: HB, color: WHITE,
  });
  // Subtitle
  p1pg.drawText(safe("SimplyExpat Berlin  ·  Anmeldung  ·  " + (p1.firstName + " " + p1.lastName).trim() + "  ·  " + new Date().toLocaleDateString("en-GB")), {
    x: ML, y: PH - 52, size: 9, font: HV, color: rgb(0.70, 0.82, 1.00),
  });

  // Situation badges (small coloured pills)
  const situBadges: [string, any][] = [
    [isEU ? "EU Citizen" : "Non-EU Citizen", isEU ? GRN : AMB],
    [maritalLabel[d.maritalStatus as keyof typeof maritalLabel] ?? "Single", BLUE],
    [`${d.people.length} person${d.people.length > 1 ? "s" : ""}`, NAVY],
    [`${sheets} form${sheets > 1 ? "s" : ""}`, sheets > 1 ? AMB : GRN],
  ];
  let bx = ML;
  for (const [t, c] of situBadges) {
    if (!t.trim()) continue;
    const bw = t.length * 5.8 + 14;
    p1pg.drawRectangle({ x: bx, y: PH - 73, width: bw, height: 14, color: c, borderRadius: 3 });
    p1pg.drawText(safe(t), { x: bx + 6, y: PH - 68, size: 7.5, font: HB, color: WHITE });
    bx += bw + 8;
  }

  // ── Content cursor starts below header ───────────────────────────────────
  let cur1 = HDR_H + 16;

  // ── Build item list ───────────────────────────────────────────────────────
  type CItem = { text: string; tag: "required"|"recommended"; note?: string; warn?: string };
  const items: CItem[] = [];

  // Always required
  items.push({
    text: sheets > 1
      ? `${sheets} Anmeldung forms (printed) — hand all in together at one appointment`
      : "Anmeldung form (printed on paper) — do NOT bring a phone screen",
    tag: "required",
    note: sheets > 1
      ? `Sheet 1: ${[d.people[0]?.firstName, d.people[1]?.firstName].filter(Boolean).join(" + ")} | Sheet 2: ${[d.people[2]?.firstName, d.people[3]?.firstName].filter(Boolean).join(" + ")}`
      : undefined,
  });

  items.push({
    text: "Wohnungsgeberbestaetigung — signed original from your landlord",
    tag: "required",
    note: "This is a one-page form your landlord signs confirming you live at the address. Check your move-in documents and email first — many landlords include it automatically. If you don't have it: send them the template from your downloads. Under § 19 BMG they are legally required to provide it (refusal = fine up to EUR 1,000 for the landlord). The Buergeramt cannot process your Anmeldung without this document.",
  });

  for (const p of d.people) {
    if (p.firstName || p.lastName) {
      // Per-person EU check — handles mixed households (e.g. non-EU parent, EU child)
      const personIsEU = p.citizenship
        ? p.citizenship.split(",").map((s: string) => s.trim()).some((c: string) => (CITIZENSHIP_TO_COUNTRY[c] ?? {isEU: false}).isEU)
        : isEU;
      if (personIsEU) {
        items.push({
          text: `Passport or national ID card: ${safe(p.firstName)} ${safe(p.lastName)}`.trim(),
          tag: "required",
          note: "EU/EEA citizen — passport or national ID card accepted. If you hold multiple citizenships, bring proof of all of them. The Buergeramt registers all nationalities.",
        });
      } else {
        items.push({
          text: `Passport (original, valid): ${safe(p.firstName)} ${safe(p.lastName)}`.trim(),
          tag: "required",
          note: "Non-EU citizen — passport only, national ID cards are not accepted. If you hold multiple citizenships, bring all passports. The Buergeramt registers all nationalities.",
        });
      }
    }
  }

  // Birth certificates — foreign born only
  for (const p of d.people) {
    if ((p.firstName || p.lastName) && p.birthCountry && !["germany","deutschland"].includes(p.birthCountry.toLowerCase())) {
      items.push({
        text: `Birth certificate: ${safe(p.firstName)} ${safe(p.lastName)}`.trim(),
        tag: "required",
        note: `Born in ${p.birthCountry}. Original required. CERTIFIED TRANSLATION REQUIRED — beglaubigte Uebersetzung by a sworn translator (approx. EUR 50-150). Some districts also require an Apostille.`,
      });
    }
  }

  items.push({ text: "Appointment confirmation — email printout or screenshot", tag: "required" });

  if (!isEU) {
    items.push({
      text: "Aufenthaltstitel or Visa — ONLY if you already have one",
      tag: "required",
      note: "You do NOT need a visa before registering. If you have one, bring it. If not, go without — the Buergeramt will register you and you sort the visa after.",
      warn: "Do NOT delay your Anmeldung waiting for a visa. Register first.",
    });
  }

  if (isMarried) {
    items.push({
      text: "Marriage or civil partnership certificate — original document",
      tag: "required",
      warn: hasForeignMarriage
        ? "TRANSLATION REQUIRED: Your certificate is not German. You MUST bring a certified German translation (beglaubigte Uebersetzung) by a sworn translator. Cost approx. EUR 50-150. Some districts also require an Apostille."
        : undefined,
    });
  }

  if (isDivorced) {
    items.push({
      text: "Divorce decree — NOT required for Anmeldung",
      tag: "recommended",
      note: "Marital status is self-declared on the form. The Bürgeramt does not verify it. You may optionally bring it if asked, but it is not required.",
    });
  }

  if (isWidowed) {
    items.push({
      text: "Death certificate — NOT required for Anmeldung",
      tag: "recommended",
      note: "Marital status is self-declared. The Bürgeramt does not require proof of widowhood for registration.",
    });
  }

  items.push({
    text: "Rental contract (Mietvertrag) — a copy, not original",
    tag: "recommended",
    note: "Not mandatory, but useful if the clerk has questions about your address.",
  });
  items.push({
    text: "Your own ballpoint pen (black or blue ink)",
    tag: "recommended",
    note: "Many Buergeramt offices no longer provide pens. You may need to sign documents.",
  });

  // ── Section header ────────────────────────────────────────────────────────
  cur1 = secBlock(p1pg, "Documents to bring to the Buergeramt", cur1);

  // ── Draw items — add new page if overflow ────────────────────────
  let curPage1 = p1pg;
  const overflowToNextPage = () => {
    curPage1.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
    curPage1.drawText("SimplyExpat Berlin  ·  Your personalised checklist  ·  continued", {
      x: ML, y: 14, size: 7.5, font: HV, color: MUTE,
    });
    curPage1 = doc.addPage([PW, PH] as [number, number]);
    curPage1.drawRectangle({ x: 0, y: PH - 38, width: PW, height: 38, color: NAVY });
    curPage1.drawText("Your Personalised Anmeldung Checklist (continued)", {
      x: ML, y: PH - 25, size: 13, font: HB, color: WHITE,
    });
    cur1 = 52;
  };
  for (const item of items) {
    const prevCur = cur1;
    cur1 = checkItem(curPage1, item.text, cur1, item.tag, item.note, item.warn);
    if (cur1 === prevCur) {
      // checkItem skipped this item because it didn't fit — overflow and retry
      overflowToNextPage();
      cur1 = checkItem(curPage1, item.text, cur1, item.tag, item.note, item.warn);
    }
  }

  // ── Print warning box ─────────────────────────────────────────────────────
  if (cur1 < PH - FOOTER_H - 60) {
    cur1 += 6;
    const warnLines = [
      "The Buergeramt does NOT accept forms on a phone screen.",
      "Print your Anmeldung form on paper before your appointment.",
      "Quick tip: DM and Rossmann drugstores have self-service print kiosks (approx. EUR 0.10-0.15 per page).",
    ];
    const warnBoxH = warnLines.length * 13 + 18;
    if (cur1 + warnBoxH < PH - FOOTER_H) {
      const boxY = PH - cur1 - warnBoxH;
      curPage1.drawRectangle({ x: ML, y: boxY, width: CW, height: warnBoxH, color: REDL, borderRadius: 6 });
      curPage1.drawRectangle({ x: ML, y: boxY, width: 4, height: warnBoxH, color: RED, borderRadius: 6 });
      curPage1.drawText("! Print Warning", { x: ML + 12, y: boxY + warnBoxH - 14, size: 9, font: HB, color: RED });
      let wy = cur1 + 18;
      for (let i = 1; i < warnLines.length; i++) {
        curPage1.drawText(safe(warnLines[i]), { x: ML + 12, y: PH - wy - 9, size: 9, font: i === 0 ? HB : HV, color: RED });
        wy += 13;
      }
      cur1 += warnBoxH + 6;
    }
  }

  // ── Appointment notes lines ───────────────────────────────────────────────
  if (cur1 < PH - FOOTER_H - 50) {
    cur1 += 6;
    const noteH = 48;
    const noteBoxY = PH - cur1 - noteH;
    curPage1.drawRectangle({ x: ML, y: noteBoxY, width: CW, height: noteH, color: BGROW, borderRadius: 5 });
    curPage1.drawText("Appointment date & location:", { x: ML + 10, y: noteBoxY + noteH - 13, size: 8.5, font: HB, color: NAVY });
    curPage1.drawLine({ start:{x:ML+10,y:noteBoxY+20}, end:{x:ML+CW-10,y:noteBoxY+20}, thickness:0.4, color:LNCLR });
    curPage1.drawLine({ start:{x:ML+10,y:noteBoxY+8 }, end:{x:ML+CW-10,y:noteBoxY+8 }, thickness:0.4, color:LNCLR });
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  curPage1.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
  curPage1.drawText("SimplyExpat Berlin  ·  Your personalised checklist  ·  Page 1 of 2", {
    x: ML, y: 14, size: 7.5, font: HV, color: MUTE,
  });
  curPage1.drawText("service.berlin.de/dienstleistung/120686", {
    x: ML + CW - 200, y: 14, size: 7.5, font: HV, color: BLUE,
  });

  // ═════════════════════════════════════════════════════════════════════════
  //  PAGE 2 — EXPERT GUIDE
  // ═════════════════════════════════════════════════════════════════════════
  const p2pg = doc.addPage([PW, PH] as [number, number]);

  // ── Header — personalised ─────────────────────────────────────────────────
  p2pg.drawRectangle({ x: 0, y: PH - HDR_H, width: PW, height: HDR_H, color: NAVY });
  p2pg.drawText("Your Berlin Anmeldung Guide", { x: ML, y: PH - 34, size: 20, font: HB, color: WHITE });
  const nameStr = (p1.firstName + " " + p1.lastName).trim();
  const situStr = [
    isEU ? "EU/EEA citizen" : "Non-EU citizen",
    d.people.length > 1 ? `${d.people.length} people` : null,
    isMarried ? "married" : null,
    hasForeignBirth ? "foreign birth docs" : null,
  ].filter(Boolean).join(" · ");
  p2pg.drawText(safe("Prepared for " + nameStr + " · " + situStr), {
    x: ML, y: PH - 55, size: 8.5, font: HI, color: rgb(0.60, 0.76, 1.00),
  });

  let cur2 = HDR_H + 12;

  // ── Your situation ────────────────────────────────────────────────────────
  // Personalised callout based on EU status
  if (isEU) {
    cur2 = calloutBlock(p2pg, safe("As an EU/EEA citizen, you can use a passport or national ID card — both are accepted. You must appear in person at any of the 44 Berlin Buergeramt locations."), cur2, GRNL, GRN);
  } else {
    cur2 = calloutBlock(p2pg, safe("As a non-EU citizen, you must appear in person — online registration is not available. Bring your passport (national ID is NOT accepted for Anmeldung). Scroll to the bottom of service.berlin.de to select an in-person appointment."), cur2, AMBL, AMB);
  }

  // Family note if multiple people
  if (d.people.length > 1) {
    cur2 = calloutBlock(p2pg, safe(`You are registering ${d.people.length} people on ${sheets} form${sheets > 1 ? "s" : ""}. Hand all forms in together at the counter. The clerk will process everyone at once.`), cur2, BLUEL, BLUE);
  }

  // Foreign documents note
  if (hasForeignBirth || hasForeignMarriage) {
    cur2 = calloutBlock(p2pg, "You have foreign documents. These must be accompanied by a certified German translation (beglaubigte Uebersetzung). Cost: approx. EUR 50-150 per document. Some also require an Apostille. Do not attend the appointment without these.", cur2, REDL, RED);
  }
  cur2 += 4;

  // ── Appointment hacks ─────────────────────────────────────────────────────
  cur2 = secBlock(p2pg, "How to get a Buergeramt appointment fast", cur2);
  cur2 = bulletBlock(p2pg, "Tuesday 7:55 AM:", "New slots appear on service.berlin.de at 8:00 AM sharp. Refresh from 7:55. Slots vanish in under 60 seconds. This is the single best hack.", cur2);
  cur2 = bulletBlock(p2pg, "Book any location:", "You are not limited to your nearest Buergeramt. Any of the 44 Berlin locations is valid — more options means more available slots.", cur2);
  cur2 = bulletBlock(p2pg, "Call 115 at 7 AM:", "Ask specifically for cancellation slots. Morning calls get answered fastest.", cur2);
  cur2 = bulletBlock(p2pg, "Walk-in options:", "Buergeramt Tempelhof (Tempelhofer Damm 165) or Mitte (Karl-Marx-Allee 31). Arrive 30 min before opening. No guarantee but works regularly.", cur2);
  cur2 += 4;

  // ── Printing ─────────────────────────────────────────────────────────────
  cur2 = secBlock(p2pg, "Before you go — printing", cur2);
  cur2 = calloutBlock(p2pg, "Print on paper — the Buergeramt will NOT accept a phone screen. Sign the form in pen after printing (at the bottom: Datum, Unterschrift). Bring it in a folder, unfolded.", cur2, REDL, RED);
  cur2 = bulletBlock(p2pg, "DM / Rossmann:", "Self-service kiosks in almost every Berlin neighbourhood. Approx. EUR 0.10-0.15 per page.", cur2);
  cur2 += 4;

  // ── After registration ────────────────────────────────────────────────────
  cur2 = secBlock(p2pg, "After your appointment", cur2);
  cur2 = bulletBlock(p2pg, "Meldebestaetigung:", "You receive your registration confirmation the same day. Keep it — you need it for banks, employers, and government services.", cur2);
  cur2 = bulletBlock(p2pg, "Steuer-ID:", "Your German tax ID arrives by post within 4 weeks at your new address. Keep it permanently — you will use it for the rest of your life in Germany.", cur2);
  if (isMarried) {
    const kirchStr = d.people.some(p => ["rk","ev"].includes(p.religion))
      ? "You registered a church affiliation — approx. 8-9% Kirchensteuer (church tax) applies on your income tax. To leave (Kirchenaustritt), visit the Standesamt — approx. EUR 30-40 fee."
      : "You did not register a church affiliation — no church tax applies.";
    cur2 = bulletBlock(p2pg, "Kirchensteuer:", kirchStr, cur2);
  } else {
    cur2 = bulletBlock(p2pg, "Kirchensteuer:", "If you declared Catholic or Protestant membership, approx. 8-9% church tax on your income tax applies automatically. To leave: you must formally exit (Kirchenaustritt) at the Standesamt or Amtsgericht — approx. EUR 30-40 fee, separate appointment required.", cur2);
  }
  cur2 += 4;

  // ── Closing tip ───────────────────────────────────────────────────────────
  const tipH = 40;
  const tipY = FOOTER_H + 10;
  p2pg.drawRectangle({ x: ML, y: tipY, width: CW, height: tipH, color: NAVY, borderRadius: 6 });
  p2pg.drawText(safe("Good luck, " + (p1.firstName || "expat") + ". Bring a pen. Arrive calm. The form does the talking."), {
    x: ML + 14, y: tipY + tipH - 16, size: 9.5, font: HB, color: WHITE,
  });
  p2pg.drawText("Next step: book your Buergeramt slot at service.berlin.de  (Tuesdays 8:00 AM, gone in 60 s).", {
    x: ML + 14, y: tipY + tipH - 29, size: 9, font: HV, color: rgb(0.80, 0.89, 1.00),
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  p2pg.drawLine({ start:{x:ML,y:28}, end:{x:ML+CW,y:28}, thickness:0.5, color:LNCLR });
  p2pg.drawText("SimplyExpat Berlin  ·  Expert Guide  ·  Page 2 of 2  ·  All information without guarantee", {
    x: ML, y: 14, size: 7.5, font: HV, color: MUTE,
  });
  p2pg.drawText("service.berlin.de", {
    x: ML + CW - 90, y: 14, size: 7.5, font: HV, color: BLUE,
  });

  return doc.save();
}

// ─── Anxiety barometer ────────────────────────────────────────────
function calcAnxiety(form: FormData): number {
  const p1 = form.people[0] ?? EMPTY_PERSON;
  const fields = [
    form.originCountry, form.maritalStatus,
    form.newStreet, form.newPostalCode, form.moveInDate,
    form.prevCountry,
    p1.lastName, p1.firstName, p1.birthDate, p1.birthPlace,
    p1.citizenship, p1.gender, p1.religion, p1.docSerial, p1.docAuthority,
  ];
  return Math.round(fields.filter(v => v && v !== "").length / fields.length * 100);
}

// ─── Life Hacks ───────────────────────────────────────────────────
const HACKS: Record<WizardStep, { title: string; tip: string; tag: "tip"|"warn"|"info" }[]> = {
  origin: [
    { title: "EU vs Non-EU", tip: "EU/EEA: passport or national ID accepted — simplest case. Non-EU: must attend in person, bring passport. All prep included in your Guide PDF.", tag: "info" },
    { title: "Language at the counter", tip: "Most clerks don't speak English. Our completed German form does the talking for you.", tag: "tip" },
  ],
  "new-address": [
    { title: "14-day deadline", tip: "You must register within 14 days of moving in. Late = fine up to 1,000 Euro.", tag: "warn" },
    { title: "Appointment hack", tip: "New slots appear on service.berlin.de on Tuesdays around 8:00 AM — keep refreshing from 7:55.", tag: "tip" },
  ],
  "prev-address": [
    { title: "First time in Germany?", tip: "Enter your last foreign address. Completely normal, expected by the clerk.", tag: "info" },
    { title: "Keeping two homes?", tip: "If keeping the old flat, choose Haupt- or Nebenwohnung. This affects your tax residency.", tag: "warn" },
  ],
  people: [
    { title: "Name must match passport", tip: "Enter names letter-for-letter as in the passport. Any mismatch can cause rejection.", tag: "warn" },
    { title: "2 people per sheet", tip: "The official form fits exactly 2 people. For families of 3+, we generate multiple forms automatically.", tag: "info" },
    { title: "Same appointment!", tip: "You can register your whole family in one appointment with multiple forms.", tag: "tip" },
  ],
  status: [
    { title: "Church tax trap", tip: "Catholic or Evangelical = ~8-9% extra income tax. Choose 'keine' to opt out entirely.", tag: "warn" },
    { title: "Religion is optional", tip: "Choosing 'keine' has zero negative consequences. Changeable at Finanzamt anytime.", tag: "info" },
  ],
  documents: [
    { title: "Serial number location", tip: "German passport: top-right of photo page. ID card: front below photo.", tag: "info" },
    { title: "Original only!", tip: "Scanned docs are often rejected. Always bring the physical original.", tag: "warn" },
    { title: "Bring a pen!", tip: "Bring your own ballpoint pen — shared ones at the counter often run dry.", tag: "tip" },
  ],
  review: [
    { title: "Check everything!", tip: "A wrong registration needs a full new appointment to fix. Take 60 seconds now.", tag: "warn" },
    { title: "Multi-form families", tip: `Forms are paired: Person 1+2 on Sheet 1, Person 3+4 on Sheet 2, etc.`, tag: "info" },
  ],
};

// ─── Wizard step builder ──────────────────────────────────────────
function buildStepList(): WizardStep[] {
  return ["origin", "new-address", "prev-address", "people", "status", "documents", "review"];
}

function getError(step: WizardStep, f: FormData): string {
  if (step === "origin" && f.isBerlin !== true) return "Please confirm your new address is in Berlin to continue.";
  if (step === "origin" && !f.people[0]?.citizenship) return "Please enter your citizenship.";
  if (step === "origin" && !f.maritalStatus) return "Please select your marital status.";
  if (step === "origin" && f.furtherAddresses === "ja") return "Beiblatt is not supported yet. Please uncheck \"I have additional residences\" to continue.";

  if (step === "new-address") {
    if (!f.newStreet || !f.newNumber) return "Please enter street and house number.";
    if (!f.newPostalCode) return "Please enter the postal code (PLZ).";
    // Berlin PLZ must start with 1 (10xxx–14xxx)
    if (!/^1[0-4]\d{3}$/.test(f.newPostalCode.trim()))
      return "That postal code doesn't look like a Berlin PLZ. Berlin postcodes start with 10, 11, 12, 13, or 14.";
    if (!f.moveInDate) return "Please enter your move-in date.";
  }

  if (step === "prev-address" && !f.prevCountry) return "Please enter the country of your previous address.";

  if (step === "people") {
    for (let i = 0; i < f.people.length; i++) {
      const p = f.people[i];
      const label = i === 0 ? "Person 1" : `Person ${i + 1}`;
      if (!p.lastName || !p.firstName) return `Please enter the full name of ${label}.`;
      if (!p.birthDate || !p.birthPlace) return `Please enter date and place of birth for ${label}.`;
      if (!p.citizenship) return `Please enter the citizenship of ${label}.`;
      if (!p.gender) return `Please select the gender of ${label}.`;
    }
  }

  if (step === "documents") {
    for (let i = 0; i < f.people.length; i++) {
      const p = f.people[i];
      const label = i === 0 ? "Person 1" : `Person ${i + 1}`;
      if (!p.docSerial) return `Please enter the document serial number for ${label}.`;
      if (!p.docAuthority) return `Please enter the issuing authority for ${label}.`;
    }
  }

  return "";
}

// ═══════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════
export default function BerlinButler() {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [step, setStep] = useState<WizardStep>("origin");
  const [paid, setPaid] = useState(false);
  const stripeReturnRef = React.useRef(false); // flag: came back from Stripe
  const [genStatus, setGenStatus] = useState("");
  const [allDone, setAllDone] = useState(false);
  const [generatedPDFs, setGeneratedPDFs] = useState<{ anmeldung: { bytes: Uint8Array; name: string }[]; guide: Uint8Array | null }>({ anmeldung: [], guide: null });
  const [err, setErr] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // ── URL hash helpers ─────────────────────────────────────────────
  // Hash format: #wizard/new-address  |  #payment  |  #done  |  (empty = landing)
  const pushNav = useCallback((ph: AppPhase, st?: WizardStep) => {
    const hash = ph === "landing" ? "" : ph === "wizard" ? `wizard/${st ?? "origin"}` : ph;
    window.history.pushState({ ph, st }, "", hash ? `#${hash}` : window.location.pathname);
  }, []);

  const applyHash = useCallback((ph: AppPhase, st: WizardStep) => {
    setPhase(ph);
    setStep(st);
  }, []);

  // ── Restore form data from localStorage (data only, never phase) ─
  useEffect(() => {
    // Capture devtest flag first — before any early returns — so it survives all navigation paths
    if (new URLSearchParams(window.location.search).get("devtest") === "1") sessionStorage.setItem("devtest", "1");

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.form) setForm(() => ({ ...EMPTY, ...saved.form }));
      }
    } catch {}

    // Check if user already completed — land on done page and restore form for re-downloads
    try {
      if (localStorage.getItem("simplyexpat-done-v1") === "1") {
        // Restore form data first so re-downloads on done page have real data
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.form) setForm(() => ({ ...EMPTY, ...saved.form }));
        }
        setPhase("done");
        // Push two history entries so back button has nowhere to go
        window.history.pushState({ ph: "done" }, "", window.location.pathname);
        window.history.pushState({ ph: "done" }, "", window.location.pathname);
        return;
      }
    } catch {}

    // Check if returning from Stripe payment — ?paid=verified in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("paid") === "verified") {
      window.history.replaceState({}, "", window.location.pathname);
      stripeReturnRef.current = true; // mark — will trigger after form restores
      setPaid(true);
      setPhase("generating"); // skip payment page entirely
      return;
    }

    // Read initial hash — if the user bookmarked mid-flow, honour it.
    const readHash = () => {
      const h = window.location.hash.replace("#", "");
      if (!h) return;
      if (h === "payment") { setPhase("payment"); return; }
      if (h === "done")    { setPhase("done");    return; }
      if (h.startsWith("wizard/")) {
        const st = h.replace("wizard/", "") as WizardStep;
        const valid: WizardStep[] = ["origin","new-address","prev-address","people","status","documents","review"];
        setPhase("wizard");
        setStep(valid.includes(st) ? st : "origin");
      }
    };
    readHash();
  }, []);

  // ── Persist form data to localStorage ───────────────────────────
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ form })); } catch {}
  }, [form]);

  // ── Guard: if done flag is set, always redirect to done page ─────
  // Prevents getting stuck in wizard after pressing back from done page.
  // Uses replaceState (not pushState) so it doesn't add a new history entry
  // that could itself be back-buttoned into, causing an infinite redirect loop.
  useEffect(() => {
    try {
      if (localStorage.getItem("simplyexpat-done-v1") === "1" && phase !== "done") {
        setPhase("done");
        window.history.replaceState({ ph: "done" }, "", window.location.pathname);
      }
    } catch {}
  }, [phase]);

  // ── If somehow still on payment page when done — redirect ────────
  useEffect(() => {
    if (allDone && phase === "payment") {
      setPhase("done");
      pushNav("done");
    }
  }, [allDone, phase]);

  // ── Auto-generate after Stripe redirect ──────────────────────────
  // Fires when form state updates after localStorage restore on Stripe return.
  // Using stripeReturnRef avoids the race condition where doGenerate() was
  // called before setForm() had applied the restored data.
  useEffect(() => {
    if (
      stripeReturnRef.current &&
      paid &&
      (phase === "generating" || phase === "payment") &&
      !allDone &&
      !genStatus &&
      form.people.length > 0 && form.people[0]?.firstName && form.newStreet // full form restored
    ) {
      stripeReturnRef.current = false; // clear flag so it only fires once
      const t = setTimeout(() => { doGenerate(); }, 600);
      return () => clearTimeout(t);
    }
  }, [form, paid, phase, allDone, genStatus]);

  // ── Browser back / forward button support ───────────────────────
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      // If user has completed generation, back button always returns to done page.
      // Never allow navigating back to payment or wizard after completion.
      try {
        if (localStorage.getItem("simplyexpat-done-v1") === "1") {
          // Push done state forward again — traps the back button on done page
          window.history.pushState({ ph: "done" }, "", window.location.pathname);
          setPhase("done");
          return;
        }
      } catch {}

      const state = e.state as { ph?: AppPhase; st?: WizardStep } | null;
      if (state?.ph) {
        applyHash(state.ph, state.st ?? "origin");
      } else {
        // No state = user went all the way back to root (landing)
        setPhase("landing");
        setStep("origin");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyHash]);

  // Generic field updater for flat FormData keys
  const upd = useCallback((k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setErr("");
      const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm(p => ({ ...p, [k]: v }));
    }, []);

  const set_ = useCallback((k: keyof FormData, v: any) =>
    setForm(p => ({ ...p, [k]: v })), []);

  // People array updaters
  const updPerson = useCallback((idx: number, k: keyof Person, v: string) => {
    setErr("");
    setForm(p => {
      const people = p.people.map((person, i) => {
        if (i !== idx) return person;
        const updated = { ...person, [k]: v };
        // Auto-logic: children under 18 are always ledig (single) per Anmeldung law
        if (k === "relationship" && v === "child") {
          updated.personMarriageDate = "";
          updated.personMarriagePlace = "";
          updated.personMarriageCountry = "";
        }
        if (k === "birthDate") {
          const age = (Date.now() - new Date(v).getTime()) / (365.25 * 24 * 3600 * 1000);
          if (age < 18 && updated.relationship === "child") {
            // marital status is contextual — no override needed on Person level
            // but flag is useful for StepStatus to suppress the marriage block
          }
        }
        return updated;
      });
      return { ...p, people };
    });
  }, []);

  const addPerson = useCallback(() => {
    setForm(p => {
      if (p.people.length >= MAX_PEOPLE) return p;
      return { ...p, people: [...p.people, { ...EMPTY_PERSON, relationship: "child" }] };
    });
  }, []);

  const removePerson = useCallback((idx: number) => {
    setForm(p => {
      if (p.people.length <= 1) return p;
      return { ...p, people: p.people.filter((_, i) => i !== idx) };
    });
  }, []);

  const doGenerate = useCallback(async () => {
    const sheets = sheetsNeeded(form.people);
    setGenStatus(`Generating Anmeldung${sheets > 1 ? ` (${sheets} sheets)` : ""}...`);
    try {
      const anmeldungPDFs = await buildAllAnmeldungPDFs(form);

      setGenStatus("Generating Guide & Checklist...");
      const guideBytes = await buildGuidePDF(form);

      // Store bytes in state — user downloads from Done page, no auto-download
      setGeneratedPDFs({ anmeldung: anmeldungPDFs, guide: guideBytes });
      setAllDone(true);
      setGenStatus("");
      // Immediately move to done page — no lingering on payment page
      setPhase("done");
      pushNav("done");

      // ── Option A: Reminder email only — NO PDF attachments ──────────
      // Only first name + email transmitted. Zero personal data, zero
      // special-category data. No Art. 9 issue. No Resend AVV needed
      // beyond standard email-address processing (Art. 6(1)(a) DSGVO).
      if (userEmail && userEmail.includes("@")) {
        setGenStatus("Sending your next steps by email...");
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: userEmail,
              firstName: form.people[0]?.firstName || "there",
              sheets,
              // No PDFs — no sensitive data leaves the browser
            }),
          });
          setEmailSent(true);
        } catch (emailErr) {
          console.warn("[SimplyExpat] Reminder email failed (non-critical):", emailErr);
        }
        setGenStatus("");
      }

      try {
        // Keep form data in localStorage so returning users can re-download filled PDFs.
        // The done flag prevents re-entry into the wizard.
        // Data is only wiped when user explicitly clicks "Clear & restart".
        localStorage.setItem("simplyexpat-done-v1", "1"); // returning users land on done page
      } catch {}
    } catch (e: any) {
      setGenStatus("");
      if (e.message === "PDF_NOT_FOUND") alert("Place anmeldung.pdf in /public/ folder.");
      else { console.error(e); alert("PDF error — check browser console."); }
    }
  }, [form]);

  const downloadWG = useCallback(async () => {
    try { savePDF(await buildWGPDF(form), `Wohnungsgeberbestaetigung_${form.people[0]?.lastName || "Template"}.pdf`); }
    catch (e) { console.error(e); }
  }, [form]);

  const anxiety = calcAnxiety(form);
  const sheets = sheetsNeeded(form.people);
  const isWizard = phase === "wizard";

  return (
    <div style={{ fontFamily: "'Geist',system-ui,sans-serif", minHeight: "100vh", background: "#f8f9fb" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes FU{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:FU 0.35s cubic-bezier(0.22,1,0.36,1)}
        @keyframes SI{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
        .si{animation:SI 0.28s cubic-bezier(0.22,1,0.36,1)}
        @keyframes POP{0%{transform:scale(0.94);opacity:0}100%{transform:scale(1);opacity:1}}
        .pop{animation:POP 0.22s cubic-bezier(0.34,1.56,0.64,1)}
        input,select,textarea{font-family:inherit;outline:none;transition:border-color 0.15s,box-shadow 0.15s;-webkit-appearance:none;appearance:none;font-size:16px}
        input:focus,select:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.12)!important}
        input::placeholder{color:#cbd5e1}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes urgency-slide{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes ring-fill{from{stroke-dashoffset:var(--from)}to{stroke-dashoffset:var(--to)}}@keyframes conf-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.conf-ring circle.track{fill:none;stroke:#e8ecf4;stroke-width:5}.conf-ring circle.fill{fill:none;stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1),stroke 0.6s ease}.conf-mob{display:none!important}@media(max-width:768px){.conf-mob{display:flex!important}}
        button{cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent}
        button:active:not(:disabled){transform:scale(0.97)}
        button:disabled{opacity:0.5;cursor:not-allowed}
        select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px!important}
        @keyframes person-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .person-in{animation:person-in 0.25s cubic-bezier(0.22,1,0.36,1)}
        /* ── Mobile responsive ── */
        .mob-hide{display:block}
        .mob-show{display:none}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .grid-1{display:grid;grid-template-columns:1fr;gap:12px}
        .hero-pad{padding:80px 40px 60px}
        .section-pad{padding:56px 40px 64px}
        .wizard-aside{width:300px;flex-shrink:0}
        .wizard-main-pad{padding:44px 56px 80px}
        .done-layout{display:flex;gap:0;min-height:100vh}
        .done-main{flex:1;min-width:0;padding:28px 32px 100px}
        .done-sidebar{width:320px;flex-shrink:0;background:#0f172a;padding:0;display:flex;flex-direction:column}
        .done-sidebar-sticky{position:sticky;top:0;height:100vh;overflow-y:auto}
        .wizard-max{max-width:720px}
        .landing-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}.hero-grid{display:grid;grid-template-columns:1fr 420px;gap:56px;align-items:center}
        .nav-pad{padding:0 40px}
        @media(max-width:768px){
          .mob-hide{display:none!important}
          .mob-show{display:block!important}
          .mob-flex-show{display:flex!important}
          .grid-2{grid-template-columns:1fr!important;gap:10px!important}
          .hero-pad{padding:36px 20px 32px!important}
          .section-pad{padding:28px 20px 36px!important}
          .wizard-aside{display:none!important}
          .wizard-main-pad{padding:16px 16px 120px!important}
          .done-layout{display:block!important}
          .done-sidebar{display:none!important}
          .done-main{padding:16px 16px 80px!important}
          .wizard-max{max-width:100%!important}
          .landing-grid{grid-template-columns:1fr!important;gap:24px!important}.hero-grid{grid-template-columns:1fr!important;gap:0!important}
          .nav-pad{padding:0 16px!important}
          .mob-stack{flex-direction:column!important}
          .mob-full{width:100%!important}
          .mob-sm-text h1{font-size:34px!important;line-height:1.12!important}
          .mob-sm-text p{font-size:16px!important}
          .mob-card-pad{padding:18px!important}
          .mob-btn-lg{padding:14px!important;font-size:15px!important}
        }
        @media(max-width:480px){
          .mob-sm-text h1{font-size:28px!important}.hero-berlin-img{display:none!important}
        }
        /* Mobile bottom nav for wizard */
        .mobile-bottom-nav{display:none}
        input:focus,select:focus{scroll-margin-bottom:140px}
        @media(max-width:768px){
          .mobile-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #e8ecf4;padding:12px 16px;gap:10px;z-index:100;box-shadow:0 -4px 20px rgba(0,0,0,0.08)}
        }
      `}</style>

      {/* Thin progress bar */}
      {isWizard && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "#e8ecf4", zIndex: 50 }}>
          <div style={{ height: "100%", background: anxiety < 31 ? "#f59e0b" : anxiety < 91 ? "#0075FF" : "#22c55e", transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)", width: `${anxiety}%`, boxShadow: "0 0 8px rgba(0,117,255,0.35)" }} />
        </div>
      )}

      {!mounted ? (
        <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0f172a,#0075FF)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "-0.05em" }}>S</span>
            </div>
            <div style={{ width: 80, height: 4, borderRadius: 99, background: "#e8ecf4", margin: "0 auto", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,#0075FF,transparent)", animation: "shimmer 1.2s ease-in-out infinite" }} />
            </div>
          </div>
        </div>
      ) : phase === "landing" ? (
        <LandingPage onStart={() => { setPhase("wizard"); pushNav("wizard", "origin"); }} onDownloadWG={downloadWG} />
      ) : null}
      <CookieBanner />

      {isWizard             && <WizardLayout form={form} step={step} setStep={setStep} upd={upd} set_={set_} updPerson={updPerson} addPerson={addPerson} removePerson={removePerson} err={err} setErr={setErr} anxiety={anxiety} sheets={sheets} pushNav={pushNav} onGoHome={() => { setPhase("landing"); pushNav("landing"); }} onComplete={() => { setPhase("payment"); pushNav("payment"); }} onRestart={() => { try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem("simplyexpat-done-v1"); } catch {} setForm(EMPTY); setPhase("landing"); pushNav("landing"); }} />}
      {phase === "payment"  && <PaymentPage paid={paid} genStatus={genStatus} onGenerate={doGenerate} allDone={allDone} sheets={sheets} form={form} downloadWG={downloadWG} userEmail={userEmail} setUserEmail={setUserEmail} emailSent={emailSent} />}
      {phase === "generating" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "system-ui,Arial,sans-serif" }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0f172a,#0075FF)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 900 }}>S</span>
            </div>
            <div style={{ width: 24, height: 24, border: "3px solid #e8ecf4", borderTopColor: "#0075FF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 17, marginBottom: 6 }}>
              {genStatus || "Generating your documents…"}
            </div>
            <p style={{ color: "#64748b", fontSize: 13 }}>Payment confirmed. Please keep this tab open.</p>
          </div>
        </div>
      )}
      {phase === "done"     && <DonePage form={form} sheets={sheets} generatedPDFs={generatedPDFs} onRestart={() => {
        try { localStorage.removeItem("simplyexpat-done-v1"); localStorage.clear(); } catch {}
        setForm({ ...EMPTY });
        setAllDone(false);
        setGeneratedPDFs({ anmeldung: [], guide: null });
        setPhase("landing");
        window.history.replaceState({}, "", window.location.pathname);
      }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
const EU_OPTS = ["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden","Iceland","Liechtenstein","Norway","Switzerland"];
const NON_EU_OPTS = ["United Kingdom","United States","Canada","Australia","India","China","Japan","South Korea","Brazil","Mexico","Turkey","Ukraine","Vietnam","Philippines","Indonesia","Egypt","Nigeria","South Africa","Pakistan","Bangladesh","Russia","Saudi Arabia","Singapore","Thailand","Other"];

// ─── 14-Day Urgency Bar — shared across landing + wizard ─────────
function UrgencyBar() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)",
      backgroundSize: "200% 100%",
      animation: "urgency-slide 4s ease-in-out infinite",
      borderBottom: "1px solid #fde68a",
      padding: "9px 20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 10, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d97706", animation: "pulse 2s infinite", flexShrink: 0 }} />
        <span style={{ fontWeight: 900, color: "#92400e", fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>14-Day Legal Deadline</span>
      </div>
      <p style={{ color: "#78350f", fontSize: 12.5, lineHeight: 1.4, textAlign: "center" }}>
        <strong>Berlin law requires you to register within 14 days of moving in.</strong>
        {" "}We make it simple — your form, filled perfectly, in minutes.
      </p>
    </div>
  );
}

// ── Bureaucracy Battle SVG Illustration ──────────────────────────
function BureaucracyBattleIllustration() {
  return (
    <svg viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 420, height: "auto" }}
      aria-label="Expat fighting the German bureaucracy monster with SimplyExpat">

      {/* ── Background glow ── */}
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0075FF" floodOpacity="0.12" />
        </filter>
      </defs>
      <ellipse cx="210" cy="340" rx="160" ry="22" fill="#e8ecf4" opacity="0.6" />
      <rect x="40" y="40" width="340" height="300" rx="24" fill="url(#bgGlow)" />

      {/* ══ MONSTER (right side) — Bureaucracy Dragon ══ */}
      {/* Body */}
      <ellipse cx="290" cy="210" rx="72" ry="85" fill="#dc2626" opacity="0.92" />
      {/* Belly */}
      <ellipse cx="290" cy="225" rx="44" ry="55" fill="#fca5a5" opacity="0.7" />
      {/* Head */}
      <ellipse cx="290" cy="118" rx="52" ry="46" fill="#dc2626" />
      {/* Horns */}
      <polygon points="265,80 258,52 275,78" fill="#b91c1c" />
      <polygon points="315,80 322,52 305,78" fill="#b91c1c" />
      {/* Eyes — angry */}
      <ellipse cx="275" cy="112" rx="9" ry="10" fill="white" />
      <ellipse cx="305" cy="112" rx="9" ry="10" fill="white" />
      <ellipse cx="278" cy="114" rx="5" ry="6" fill="#111111" />
      <ellipse cx="308" cy="114" rx="5" ry="6" fill="#111111" />
      {/* Angry eyebrows */}
      <line x1="266" y1="102" x2="284" y2="107" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
      <line x1="314" y1="102" x2="296" y2="107" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M272 130 Q290 145 308 130" stroke="#7f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Teeth */}
      <polygon points="278,130 283,142 273,142" fill="white" />
      <polygon points="290,133 295,145 285,145" fill="white" />
      <polygon points="302,130 307,142 297,142" fill="white" />
      {/* Wings */}
      <path d="M360,150 Q400,100 390,60 Q370,120 345,145 Z" fill="#fca5a5" opacity="0.8" />
      <path d="M360,150 Q400,100 390,60" stroke="#dc2626" strokeWidth="2" fill="none" />
      {/* Tail */}
      <path d="M290,290 Q330,320 320,355 Q305,340 300,360 Q295,335 275,340 Q290,320 290,290" fill="#b91c1c" />
      {/* Claws */}
      <path d="M250,280 Q235,295 228,310" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M240,288 Q222,298 218,315" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* ── FORMS floating around monster ── */}
      {/* Form 1 — tilted */}
      <g transform="rotate(-15,330,170)">
        <rect x="320" y="155" width="36" height="46" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="325" y="163" width="26" height="2.5" rx="1" fill="#94a3b8" />
        <rect x="325" y="169" width="20" height="2.5" rx="1" fill="#94a3b8" />
        <rect x="325" y="175" width="24" height="2.5" rx="1" fill="#94a3b8" />
        <rect x="325" y="181" width="16" height="2.5" rx="1" fill="#dc2626" opacity="0.6" />
        <text x="327" y="196" fontSize="7" fill="#dc2626" fontWeight="700">PFLICHT!</text>
      </g>
      {/* Stamp */}
      <g transform="rotate(12,350,240)">
        <rect x="338" y="228" width="28" height="22" rx="3" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
        <text x="342" y="243" fontSize="8" fill="#dc2626" fontWeight="900">ABGELEHNT</text>
      </g>
      {/* Form 2 — floating top right */}
      <g transform="rotate(8,375,90)">
        <rect x="358" y="78" width="30" height="38" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="363" y="86" width="20" height="2" rx="1" fill="#94a3b8" />
        <rect x="363" y="91" width="16" height="2" rx="1" fill="#94a3b8" />
        <rect x="363" y="96" width="18" height="2" rx="1" fill="#94a3b8" />
        <text x="362" y="111" fontSize="6" fill="#b91c1c" fontWeight="700">§17 BMG</text>
      </g>

      {/* ══ EXPAT (left side) ══ */}
      {/* Sword arm — raised high */}
      <line x1="138" y1="200" x2="210" y2="118" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
      {/* Sword blade — long, glowing blue */}
      <path d="M207,116 L252,68 L257,54 L243,60 L207,116" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Blade edge glow */}
      <path d="M210,113 L254,66 L257,54" stroke="#0075FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Sword guard */}
      <rect x="200" y="110" width="16" height="10" rx="3" fill="#d97706" transform="rotate(-50,208,115)" />
      {/* Sword handle */}
      <rect x="190" y="116" width="22" height="9" rx="4" fill="#78350f" transform="rotate(-50,201,120)" />
      {/* Sword tip glow */}
      <ellipse cx="252" cy="62" rx="7" ry="7" fill="#0075FF" opacity="0.6" />
      <ellipse cx="252" cy="62" rx="4" ry="4" fill="white" opacity="0.5" />

      {/* Body */}
      <ellipse cx="120" cy="260" rx="35" ry="50" fill="#0f172a" />
      {/* Legs */}
      <rect x="100" y="295" width="16" height="42" rx="8" fill="#1e3a8a" />
      <rect x="122" y="295" width="16" height="42" rx="8" fill="#1e3a8a" />
      {/* Shoes */}
      <ellipse cx="108" cy="337" rx="12" ry="6" fill="#111111" />
      <ellipse cx="130" cy="337" rx="12" ry="6" fill="#111111" />
      {/* Head */}
      <circle cx="120" cy="195" r="28" fill="#fbbf24" />
      {/* Face — determined */}
      <ellipse cx="112" cy="192" rx="4" ry="5" fill="#0f172a" />
      <ellipse cx="128" cy="192" rx="4" ry="5" fill="#0f172a" />
      {/* Determined brow */}
      <line x1="108" y1="185" x2="116" y2="188" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="132" y1="185" x2="124" y2="188" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Smile — confident */}
      <path d="M110 203 Q120 212 130 203" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Hair */}
      <path d="M95,190 Q95,165 120,163 Q145,165 145,190" fill="#0f172a" />
      {/* Cape / jacket */}
      <path d="M90,225 Q75,250 80,290 L100,295 Q95,260 120,245 Q145,260 140,295 L160,290 Q165,250 150,225 Z" fill="#1e3a8a" />

      {/* ── BATTLE FLASH between them ── */}
      <polygon points="195,165 210,145 215,165 230,150 220,170 240,168 220,180 228,198 210,185 205,205 198,185 180,195 192,178 175,172"
        fill="#fbbf24" opacity="0.9" />
      <polygon points="195,165 210,145 215,165 230,150 220,170 240,168 220,180 228,198 210,185 205,205 198,185 180,195 192,178 175,172"
        fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

      {/* ── Caption below ── */}


    </svg>
  );
}

// ─── Sticky nav with services mega-menu ──────────────────────────
function StickyNav({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
          <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
            <div style={{ background: "rgba(255,255,255,0.99)", borderBottom: "1px solid #e8ecf4", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <nav className="nav-pad">
                <div style={{ maxWidth: 1100, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "-0.05em" }}>S</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>SimplyExpat <span style={{ color: "#0075FF" }}>Berlin</span></span>
                    </div>
                    {/* Services tab */}
                    <button
                      onClick={() => setMenuOpen(o => !o)}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: menuOpen ? "1.5px solid #bfdbfe" : "1.5px solid transparent", background: menuOpen ? "#eff6ff" : "transparent", color: menuOpen ? "#0075FF" : "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                      Services
                      <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <button onClick={onStart}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 10, background: "#0f172a", color: "white", fontWeight: 700, fontSize: 13, border: "none", letterSpacing: "-0.01em" }}>
                    Prepare My Anmeldung <ArrowRight size={13} />
                  </button>
                </div>
              </nav>
            </div>

            {/* Mega menu dropdown */}
            {menuOpen && (
              <>
                {/* Backdrop */}
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "white", borderBottom: "1px solid #e8ecf4",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                  padding: "28px 40px 32px",
                  animation: "menuSlide 0.18s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  <style>{`@keyframes menuSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Services</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>

                      {/* Service 1 — Anmeldung (active) */}
                      <button onClick={() => { setMenuOpen(false); onStart(); }}
                        style={{ textAlign: "left", padding: "20px", borderRadius: 16, border: "2px solid #0075FF", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                          <FileText size={20} color="white" />
                        </div>
                        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>Bürgeramt Anmeldung <span style={{ fontWeight: 500, color: "#64748b", fontSize: 12 }}>(Registration)</span></div>
                        <div style={{ fontSize: 12.5, color: "#1d4ed8", lineHeight: 1.5 }}>Auto-generated official form — 54 fields in perfect German — plus your personalised document checklist.</div>
                        <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#0075FF" }}>
                          Start now <ArrowRight size={11} />
                        </div>
                      </button>

                      {/* Service 2 — Steuerliche Erfassung (coming soon) */}
                      <div style={{ padding: "20px", borderRadius: 16, border: "1.5px solid #e8ecf4", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>COMING SOON</div>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                          {/* Tax icon */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                        <div style={{ fontWeight: 800, color: "#94a3b8", fontSize: 15, marginBottom: 4 }}>Steuerliche Erfassung</div>
                        <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>Freelancer tax registration (Fragebogen zur steuerlichen Erfassung) — simplified, in English.</div>
                      </div>

                      {/* Service 3 — Elterngeld (coming soon) */}
                      <div style={{ padding: "20px", borderRadius: 16, border: "1.5px solid #e8ecf4", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>COMING SOON</div>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                          {/* Baby/family icon */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                        <div style={{ fontWeight: 800, color: "#94a3b8", fontSize: 15, marginBottom: 4 }}>Elterngeld</div>
                        <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>Parental allowance application — guided in English, submitted correctly the first time.</div>
                      </div>

                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
  );
}

function LandingPage({ onStart, onDownloadWG }: { onStart: () => void; onDownloadWG: () => void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div className="fu" style={{ background: "white" }}>
      <StickyNav onStart={onStart} />

      {/* ══ HERO ══ */}
      <div style={{ background: "white", borderBottom: "1px solid #e8ecf4" }}>
        <div className="hero-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Trust badge — full width above everything */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "5px 14px" }}>
              <CheckCircle2 size={11} color="#16a34a" />
              <span style={{ color: "#15803d", fontSize: 12, fontWeight: 700 }}>Trusted by expats in Berlin</span>
            </div>
          </div>

          {/* Headline — full width, dominant */}
          <h1 style={{ fontSize: 54, fontWeight: 900, color: "#0f172a", lineHeight: 1.06, marginBottom: 40, letterSpacing: "-0.035em", maxWidth: 700 }}>
            Your Anmeldung form,<br />
            <span style={{ color: "#0075FF" }}>filled in 3 minutes.</span>
          </h1>

          {/* Two columns below headline */}
          <div className="hero-grid" style={{ alignItems: "start" }}>

            {/* ── Left: copy + CTA ── */}
            <div>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, marginBottom: 10 }}>
                Anmeldung is the mandatory Berlin residence registration. The form is in German. Forget one document and the clerk sends you home.
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.65, marginBottom: 28 }}>
                We auto-generate your official Anmeldung PDF — all 54 fields filled in perfect German — plus your personalised document checklist. In English. In 3 minutes.
              </p>

              {/* Deliverables */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 32 }}>
                {[
                  { label: "Anmeldung PDF", sub: "All 54 fields · Perfect German · All 44 Berlin Bürgerämter" },
                  { label: "Document checklist", sub: "Personalised for your nationality and situation — exactly what to bring" },
                  { label: "Appointment guide", sub: "Hacks to get a slot fast in Berlin" },
                ].map(({ label, sub }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 15px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e8ecf4" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0075FF", flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 13.5 }}>{label}</span>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}> — {sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button onClick={onStart}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "17px 34px", borderRadius: 13, background: hov ? "#0066ee" : "#0075FF", color: "white", fontWeight: 900, fontSize: 17, border: "none", boxShadow: hov ? "0 16px 48px rgba(0,117,255,0.45)" : "0 6px 24px rgba(0,117,255,0.3)", transform: hov ? "translateY(-2px)" : "none", transition: "all 0.18s", letterSpacing: "-0.01em", cursor: "pointer", fontFamily: "inherit", marginBottom: 18 }}>
                Prepare My Anmeldung <ArrowRight size={18} />
              </button>

              {/* 14-day rule */}
              <div style={{ padding: "11px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", display: "inline-flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontWeight: 900, color: "#dc2626", fontSize: 24, lineHeight: 1, letterSpacing: "-0.02em", flexShrink: 0 }}>14</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#7f1d1d", fontSize: 13 }}>days to register after moving in</div>
                  <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 1 }}>Bundesmeldegesetz §17 — fines up to €1,000</div>
                </div>
              </div>
            </div>

            {/* ── Right: Berlin photo, full height ── */}
            <div className="hero-berlin-img" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e8ecf4", boxShadow: "0 12px 48px rgba(0,0,0,0.10)" }}>
              <img
                src="https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&q=85"
                alt="Berlin"
                style={{ width: "100%", height: "100%", minHeight: 460, objectFit: "cover", objectPosition: "center 40%", display: "block" }}
              />
            </div>

          </div>

          {/* Stats strip — full width, centred, below both columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 36, paddingTop: 32, borderTop: "1px solid #e8ecf4" }}>
            {[
              { v: "54", l: "Fields filled in German" },
              { v: "3 min", l: "Average completion" },
              { v: "44", l: "Berlin Bürgerämter" },
              { v: "0", l: "Bytes stored on any server" },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center", padding: "14px 10px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0075FF", letterSpacing: "-0.03em", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ══ BOTTOM CTA ══ */}
      <div style={{ background: "#0f172a", padding: "56px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "white", marginBottom: 10, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Walk in better prepared than anyone else in that waiting room.
          </h2>
          <p style={{ color: "#475569", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
            Perfect German form. Personalised checklist. Zero data stored. Ready in 3 minutes.
          </p>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "#0075FF", color: "white", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em", boxShadow: "0 8px 28px rgba(0,117,255,0.4)" }}>
            Get started <ArrowRight size={15} />
          </button>
          <LandingLegalFooter />
        </div>
      </div>
    </div>
  );
}


function LandingLegalFooter() {
  const [modal, setModal] = useState<"tos" | "cancel" | "privacy" | "impressum" | null>(null);
  const linkStyle: React.CSSProperties = { background: "none", border: "none", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", padding: 0 };
  return (
    <>
      {modal === "tos"       && <TermsOfService     onClose={() => setModal(null)} />}
      {modal === "cancel"    && <CancellationPolicy onClose={() => setModal(null)} />}
      {modal === "privacy"   && <PrivacyPolicy      onClose={() => setModal(null)} />}
      {modal === "impressum" && <Impressum          onClose={() => setModal(null)} />}
      <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <button style={linkStyle} onClick={() => setModal("tos")}>Terms of Service</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("cancel")}>Cancellation Policy</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("privacy")}>Privacy Policy</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("impressum")}>Impressum</button>
      </div>
      {/* SEO long-tail paragraph — visible but subtle, naturally written */}
      <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 20, marginBottom: 10, lineHeight: 1.7, maxWidth: 680, textAlign: "center" }}>
        SimplyExpat helps expats complete the Berlin Anmeldung form in English and generate an official PDF ready for the Bürgeramt — with zero data stored on any server.
        Whether you need Anmeldung Berlin English PDF support, expert relocation Berlin paperwork assistance, or simply want to fill your Bürgeramt form without storing your data anywhere,
        SimplyExpat prepares everything in 3 minutes. Available for every nationality moving to Berlin.
      </p>
      <p style={{ color: "rgba(100,116,139,0.6)", fontSize: 11.5, marginTop: 14 }}>© 2026 SimplyExpat GmbH (in formation) · Berlin, Germany · Not a legal service (§2 RDG)</p>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  WIZARD LAYOUT
// ═══════════════════════════════════════════════════════════════════
const STEP_LABELS: Record<WizardStep, string> = {
  origin: "Your Situation",
  "new-address": "New Berlin Address",
  "prev-address": "Previous Address",
  people: "Who is moving?",
  status: "Status & Religion",
  documents: "Identity Documents",
  review: "Review All",
};

function WizardLayout({ form, step, setStep, upd, set_, updPerson, addPerson, removePerson, err, setErr, anxiety, sheets, pushNav, onComplete, onGoHome, onRestart }: {
  form: FormData; step: WizardStep; setStep: (s: WizardStep) => void;
  upd: any; set_: any; updPerson: (i: number, k: keyof Person, v: string) => void;
  addPerson: () => void; removePerson: (i: number) => void;
  err: string; setErr: (s: string) => void;
  anxiety: number; sheets: number;
  pushNav: (ph: AppPhase, st?: WizardStep) => void;
  onComplete: () => void;
  onGoHome: () => void;
  onRestart: () => void;
}) {
  const steps = buildStepList();
  const idx = steps.indexOf(step);
  const hacks = HACKS[step] || [];
  const [confirmHome, setConfirmHome] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  // Has the user entered meaningful data?
  const hasData = !!(form.people[0]?.firstName || form.people[0]?.lastName || form.newStreet || form.originCountry);

  const next = () => {
    const e = getError(step, form);
    if (e) { setErr(e); return; }
    setErr("");
    const nxt = steps[idx + 1];
    if (nxt) { setStep(nxt); pushNav("wizard", nxt); } else onComplete();
  };
  const back = () => {
    setErr("");
    const prv = steps[idx - 1];
    if (prv) { setStep(prv); pushNav("wizard", prv); }
  };

  // ── Confidence Score (= form completion 0–100) ───────────────────
  const score = anxiety; // alias — same calc, new framing
  const ringColor = score < 31 ? "#f59e0b" : score < 91 ? "#0075FF" : "#22c55e";
  const confText =
    score < 31 ? "The bureaucracy monster is strong. But you've picked up your weapon — keep going." :
    score < 61 ? "You're cutting through the German paperwork monster. Keep going." :
    score < 91 ? "The monster is weakening. Your documents are reaching professional standards." :
               "Monster defeated. ✅ Your documents are perfect — you are ready for the Bürgeramt.";
  const confLabel =
    score < 31 ? "vs. Bureaucracy" :
    score < 61 ? "Gaining ground" :
    score < 91 ? "Almost fearless" :
               "Fully armed";
  const barColor = ringColor; // keep barColor for legacy mobile pill

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ── Modals — rendered at top level so position:fixed escapes sticky sidebar stacking context (Safari bug) ── */}
      {confirmRestart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 360, width: "100%", background: "white", borderRadius: 20, padding: "28px 26px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 900, color: "#111111", fontSize: 17, marginBottom: 8 }}>Clear all data and restart?</h3>
            <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              This will permanently delete everything you've entered. You'll start from the beginning. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "2px solid #e8ecf4", background: "white", fontWeight: 700, fontSize: 13.5, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                Keep my data
              </button>
              <button onClick={() => { setConfirmRestart(false); onRestart(); }} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "none", background: "#dc2626", fontWeight: 700, fontSize: 13.5, color: "white", cursor: "pointer", fontFamily: "inherit" }}>
                Clear & restart
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmHome && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 380, width: "100%", background: "white", borderRadius: 20, padding: "28px 26px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏠</div>
            <h3 style={{ fontWeight: 900, color: "#111111", fontSize: 17, marginBottom: 8 }}>Leave the registration?</h3>
            <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Your progress is saved automatically. You can return at any time and continue where you left off.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmHome(false)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "2px solid #e8ecf4", background: "white", fontWeight: 700, fontSize: 13.5, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                Keep going
              </button>
              <button onClick={() => { setConfirmHome(false); onGoHome(); }} style={{ flex: 1, padding: "12px", borderRadius: 11, border: "none", background: "#111111", fontWeight: 700, fontSize: 13.5, color: "white", cursor: "pointer", fontFamily: "inherit" }}>
                Go to homepage
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Desktop: slim deadline reminder ── */}
      <div className="mob-hide" style={{ background: "#f8fafc", borderBottom: "1px solid #e8ecf4", padding: "7px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>⏱ <strong style={{ color: "#0f172a" }}>14-day registration deadline</strong> — §17 BMG · Fines up to €1,000 for late registration</span>
      </div>

      {/* ── Mobile: sticky header — two rows, 64px total ── */}
      <div className="conf-mob" style={{
        display: "none", position: "sticky", top: 0, zIndex: 49,
        background: "rgba(255,255,255,0.99)", borderBottom: "1px solid #e8ecf4",
        borderBottom: "1px solid #e8ecf4",
        flexDirection: "column",
      }}>
        {/* Row 1 — logo + "Confidence" label + ring */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 6px" }}>
          {/* Logo */}
          <button onClick={() => hasData ? setConfirmHome(true) : onGoHome()}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>S</span>
            </div>
          </button>

          {/* Confidence text — grows to fill */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 }}>Confidence</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginTop: 2 }}>{confLabel}</span>
          </div>

          {/* Ring — 38px */}
          <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
            <svg className="conf-ring" width="38" height="38" viewBox="0 0 38 38" style={{ transform: "rotate(-90deg)" }}>
              <circle className="track" cx="19" cy="19" r="15" />
              <circle className="fill" cx="19" cy="19" r="15"
                stroke={ringColor}
                strokeDasharray="94.25"
                strokeDashoffset={94.25 * (1 - score / 100)}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: ringColor, lineHeight: 1 }}>{score}%</span>
              <span style={{ fontSize: 8, lineHeight: 1 }}></span>
            </div>
          </div>
        </div>

        {/* Row 2 — step segments */}
        <div style={{ display: "flex", gap: 3, padding: "0 16px 7px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: i === idx ? 5 : 3, borderRadius: 99,
              background: i < idx ? "#22c55e" : i === idx ? ringColor : "#e2e8f0",
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, paddingTop: 3 }}>
      {/* Sidebar — hidden on mobile */}
      <aside className="wizard-aside" style={{ background: "white", borderRight: "1px solid #e8ecf4", display: "flex", flexDirection: "column", position: "sticky", top: 3, height: "calc(100vh - 3px)", overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <button onClick={() => hasData ? setConfirmHome(true) : onGoHome()}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#0075FF,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 12, fontWeight: 900 }}>S</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 13, color: "#111111" }}>SimplyExpat <span style={{ color: "#0075FF" }}>Berlin</span></span>
          </button>
        </div>

        {/* ── Confidence & Document Health Score ── */}
        <div style={{ margin: "14px 14px 8px", padding: "16px 14px 14px", borderRadius: 16, background: "white", border: "1px solid #e8ecf4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>Confidence vs. Bureaucracy</div>
          {/* Donut ring */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg className="conf-ring" width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
                <circle className="track" cx="36" cy="36" r="30" />
                <circle className="fill" cx="36" cy="36" r="30"
                  stroke={ringColor}
                  strokeDasharray="188.5"
                  strokeDashoffset={188.5 * (1 - score / 100)}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: ringColor, lineHeight: 1 }}>{score}%</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 12.5, lineHeight: 1.3, marginBottom: 4 }}>{confLabel}</div>
              <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{confText}</p>
            </div>
          </div>
        </div>

        {/* Sheets counter — key new feature */}
        <div style={{ margin: "0 14px 8px", padding: "12px 14px", borderRadius: 12, background: sheets > 1 ? "linear-gradient(135deg,#fef3c7,#fffbeb)" : "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: `1px solid ${sheets > 1 ? "#fde68a" : "#86efac"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Layers size={14} color={sheets > 1 ? "#d97706" : "#16a34a"} />
            <div>
              <div style={{ fontWeight: 800, color: sheets > 1 ? "#78350f" : "#15803d", fontSize: 12 }}>
                {form.people.length} {form.people.length === 1 ? "person" : "people"} → {sheets} {sheets === 1 ? "form" : "forms"} needed
              </div>
              <div style={{ color: sheets > 1 ? "#92400e" : "#16a34a", fontSize: 10.5, marginTop: 2 }}>
                {sheets === 1 ? "All fit on one Anmeldung sheet" : `Your family needs ${sheets} separate forms`}
              </div>
            </div>
          </div>
          {sheets > 1 && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
              {Array.from({ length: sheets }, (_, i) => {
                const p1 = form.people[i * 2];
                const p2 = form.people[i * 2 + 1];
                return (
                  <div key={i} style={{ fontSize: 10.5, color: "#92400e", paddingLeft: 22 }}>
                    Sheet {i + 1}: {[p1?.firstName, p2?.firstName].filter(Boolean).join(" + ") || "—"}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Steps */}
        <div style={{ padding: "6px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8, paddingLeft: 8 }}>Progress</div>
          {steps.map((s, i) => {
            const isCur = s === step, isDone = i < idx;
            return (
              <button key={s}
                onClick={() => {
                  // Only allow navigating to current step or already-completed steps
                  if (!isDone && !isCur) return;
                  // Validate current step before going back — in case user wants to edit
                  setErr("");
                  setStep(s);
                  pushNav("wizard", s);
                }}
                disabled={!isDone && !isCur}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 9, border: "none", background: isCur ? "#eff6ff" : "transparent", marginBottom: 1, transition: "background 0.15s", textAlign: "left", cursor: (isDone || isCur) ? "pointer" : "default", opacity: (!isDone && !isCur) ? 0.4 : 1 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isCur ? "#2563eb" : isDone ? "#dcfce7" : "#f1f5f9" }}>
                  {isDone ? <Check size={10} color="#16a34a" /> : <span style={{ fontSize: 9, fontWeight: 800, color: isCur ? "white" : "#94a3b8" }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 12, fontWeight: isCur ? 700 : 500, color: isCur ? "#1e40af" : isDone ? "#16a34a" : "#64748b" }}>{STEP_LABELS[s]}</span>
                {isCur && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#2563eb" }} />}
              </button>
            );
          })}
        </div>

        {/* Life Hacks */}
        {hacks.length > 0 && (
          <div style={{ padding: "12px 14px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 9 }}>Life Hacks</div>
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
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 11.5 }}>{h.title}</div>
                  </div>
                  <p style={{ color: colors.tx, fontSize: 11, lineHeight: 1.55, paddingLeft: 20 }}>{h.tip}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Stuck */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ padding: "11px 12px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            <div style={{ fontWeight: 800, color: "#9a3412", fontSize: 11.5, marginBottom: 5 }}>Stuck? Common fears:</div>
            {[["What if I fill it wrong?","The clerk fixes minor typos on the spot."],["Do I need to speak German?","Zero. The form does the talking."],["Multiple forms confusing?","Hand them in together — one appointment."]].map(([q, a]) => (
              <div key={q} style={{ marginBottom: 4 }}>
                <div style={{ fontWeight: 700, color: "#c2410c", fontSize: 10.5 }}>{q}</div>
                <div style={{ color: "#9a3412", fontSize: 10.5, lineHeight: 1.4 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart button in sidebar */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9", marginTop: "auto" }}>
          <button
            onClick={() => { setConfirmRestart(true); }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", color: "#94a3b8", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}>
            <RotateCcw size={12} /> Restart & clear data
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="wizard-main-pad" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="wizard-max si" style={{ width: "100%" }}>

          {/* Auto-save + header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.2)" }} />
              <span style={{ fontSize: 10.5, color: "#64748b" }}>Progress saved on your device</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {steps.map((s, i) => (
                <div key={s} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 99, background: i < idx ? "#22c55e" : i === idx ? "#2563eb" : "#e2e8f0", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Step {idx + 1} of {steps.length}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>{STEP_LABELS[step]}</h1>
          </div>

          <div className="mob-card-pad" style={{ background: "white", borderRadius: 20, border: "1px solid #e8ecf4", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", padding: 28, marginBottom: 14 }}>
            {step === "origin"       && <StepOrigin      form={form} set_={set_} updPerson={updPerson} />}
            {step === "new-address"  && <StepNewAddress  form={form} upd={upd} set_={set_} />}
            {step === "prev-address" && <StepPrevAddress form={form} upd={upd} set_={set_} />}
            {step === "people"       && <StepPeople      form={form} updPerson={updPerson} addPerson={addPerson} removePerson={removePerson} />}
            {step === "status"       && <StepStatus      form={form} upd={upd} set_={set_} updPerson={updPerson} />}
            {step === "documents"    && <StepDocuments   form={form} updPerson={updPerson} />}
            {step === "review"       && <StepReview      form={form} sheets={sheets} />}

            {err && (
              <div style={{ marginTop: 16, display: "flex", gap: 9, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 15px" }}>
                <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: "#b91c1c", fontSize: 13 }}>{err}</p>
              </div>
            )}
          </div>

          {/* Desktop nav buttons */}
          <div className="mob-hide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {idx > 0
              ? <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 11, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 700, fontSize: 13, transition: "all 0.15s" }}>
                  <ArrowLeft size={13} /> Back
                </button>
              : <div />}
            <button onClick={next}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 30px", borderRadius: 13, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white", fontWeight: 800, fontSize: 13.5, border: "none", boxShadow: "0 6px 20px rgba(37,99,235,0.35)", transition: "all 0.2s" }}>
              {step === "review" ? "Continue to Payment" : "Continue"} <ChevronRight size={15} />
            </button>
          </div>
          {/* Mobile fixed bottom navigation - CSS controls display via media query */}
          <div className="mobile-bottom-nav">
            {idx > 0
              ? <button onClick={back} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "13px", borderRadius: 12, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 700, fontSize: 14, flex: "0 0 100px" }}>
                  <ArrowLeft size={14} /> Back
                </button>
              : <div />}
            <button onClick={next}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 13, background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white", fontWeight: 800, fontSize: 15, border: "none", boxShadow: "0 6px 20px rgba(37,99,235,0.35)", flex: 1 }}>
              {step === "review" ? "Continue to Payment" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

// ─── UI Atoms ─────────────────────────────────────────────────────
const Lbl = ({ children, req, opt }: { children: React.ReactNode; req?: boolean; opt?: boolean }) => (
  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
    {children}
    {req && <span style={{ color: "#ef4444", fontWeight: 900 }}> *</span>}
    {opt && <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.88em" }}> (optional)</span>}
  </label>
);

const Inp = ({ label, req, opt, info, ...p }: { label: string; req?: boolean; opt?: boolean; info?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Lbl req={req} opt={opt}>{label}</Lbl>
    <input style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 10, padding: "10px 14px", fontSize: 16, color: "#0f172a", background: "white", fontFamily: "inherit" }} {...p} />
    {info && <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>{info}</p>}
  </div>
);

const Sel = ({ label, req, opts, info, ...p }: { label: string; req?: boolean; opts: [string,string][]; info?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <Lbl req={req}>{label}</Lbl>
    <select style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 10, padding: "10px 14px", fontSize: 16, color: "#0f172a", background: "white", fontFamily: "inherit", appearance: "none" }} {...p}>
      <option value="">— Select —</option>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
    {info && <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>{info}</p>}
  </div>
);

const R2 = ({ a, b }: { a: React.ReactNode; b: React.ReactNode }) => (
  <div className="grid-2">{a}{b}</div>
);

const IBox = ({ children, type = "info" }: { children: React.ReactNode; type?: "info"|"warn" }) => {
  const c = type === "warn"
    ? { bg: "#fffbeb", bd: "#fde68a", tx: "#78350f", ic: "#d97706" }
    : { bg: "#eff6ff", bd: "#bfdbfe", tx: "#1d4ed8", ic: "#3b82f6" };
  return (
    <div style={{ display: "flex", gap: 9, background: c.bg, border: `1px solid ${c.bd}`, borderRadius: 10, padding: "10px 13px", marginTop: 12 }}>
      <Info size={12} color={c.ic} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ color: c.tx, fontSize: 12.5, lineHeight: 1.55 }}>{children}</p>
    </div>
  );
};

const SH = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
    <div style={{ width: 28, height: 28, borderRadius: 7, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={13} color="#2563eb" />
    </div>
    <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: 15.5 }}>{children}</h3>
  </div>
);

const TG = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string,string][] }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(options.length, 3)},1fr)`, gap: 7, marginTop: 4 }}>
    {options.map(([v, l]) => {
      const active = value === v;
      return (
        <button key={v} onClick={() => onChange(v)}
          style={{ padding: "10px 6px", borderRadius: 9, border: `2px solid ${active ? "#2563eb" : "#e8ecf4"}`, background: active ? "#eff6ff" : "white", fontWeight: active ? 700 : 500, fontSize: 13, color: active ? "#1d4ed8" : "#64748b", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 42 }}>
          {active && <Check size={11} color="#2563eb" strokeWidth={3} />}
          {l}
        </button>
      );
    })}
  </div>
);

// ─── Revolut-style Searchable Dropdown ───────────────────────────
function SearchableSelect({ label, value, onChange, options, placeholder, req, info, allowCustom = false }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; req?: boolean; info?: string; allowCustom?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase())).slice(0, 40);
  const displayVal = value || "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Lbl req={req}>{label}</Lbl>
      <div style={{ position: "relative" }}>
        <input
          value={open ? query : displayVal}
          onFocus={() => { setOpen(true); setQuery(""); }}
          onChange={e => { setQuery(e.target.value); if (allowCustom) onChange(e.target.value); }}
          placeholder={placeholder ?? "Search or type..."}
          style={{ width: "100%", border: `2px solid ${open ? "#0075FF" : "#e8ecf4"}`, borderRadius: 10, padding: "10px 36px 10px 14px", fontSize: 16, color: displayVal ? "#111111" : "#94a3b8", background: "white", fontFamily: "inherit", outline: "none", boxShadow: open ? "0 0 0 3px rgba(0,117,255,0.1)" : "none", transition: "all 0.15s" }}
        />
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: 10 }}>▼</div>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "white", border: "2px solid #e8ecf4", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 300, maxHeight: 220, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 13 }}>No results — type to add custom</div>
          )}
          {filtered.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
              style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: opt === value ? "#f0f7ff" : "white", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, color: opt === value ? "#0075FF" : "#111111", fontWeight: opt === value ? 700 : 400, borderBottom: "1px solid #f1f5f9" }}>
              {opt}
              {opt === value && <Check size={12} color="#0075FF" style={{ float: "right", marginTop: 2 }} />}
            </button>
          ))}
        </div>
      )}
      {info && <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>{info}</p>}
    </div>
  );
}

// ─── Privacy Toggle component ─────────────────────────────────────
function HandwrittenToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 12, background: value ? "#f0f7ff" : "#f8fafc", border: `1.5px solid ${value ? "#0075FF" : "#e8ecf4"}`, transition: "all 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#111111", fontSize: 13, marginBottom: 2 }}>
            Fill passport details by hand after printing
          </div>
          <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
            Your data is safe — we do not store your passport information. This option is for your additional peace of mind.
          </p>
        </div>
        {/* Toggle pill */}
        <button onClick={() => onChange(!value)} style={{ flexShrink: 0, width: 44, height: 24, borderRadius: 999, background: value ? "#0075FF" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
          <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
        </button>
      </div>
      {value && (
        <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(0,117,255,0.07)", border: "1px solid rgba(0,117,255,0.2)" }}>
          <p style={{ fontSize: 12, color: "#0075FF", fontWeight: 600 }}>
            Serial number and issue date fields will be left blank — fill them in with a pen after printing.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Reusable PersonForm (identical for all people) ───────────────
// ─── Reusable multi-citizenship field ────────────────────────────
// Works for all people. Stores comma-separated values in form state.
// Up to 3 citizenships. EU status derived from the list.
function CitizenshipField({ value, onChange, isPrefilled }: {
  value: string;
  onChange: (v: string) => void;
  isPrefilled?: boolean;
}) {
  const [editing, setEditing] = React.useState(!isPrefilled);
  const initialSlots = value ? value.split(",").map(s => s.trim()) : [""];
  const [slots, setSlots] = React.useState<string[]>(initialSlots.length ? initialSlots : [""]);

  // Keep slots in sync if value changes externally (e.g. pre-fill from Step 1)
  React.useEffect(() => {
    if (value && !editing) {
      setSlots(value.split(",").map(s => s.trim()));
    }
  }, [value]);

  const commitSlots = (arr: string[]) => {
    setSlots(arr);
    const filled = arr.filter(s => s.trim());
    onChange(filled.join(", "));
  };

  if (isPrefilled && !editing) {
    return (
      <div>
        <Lbl req>Citizenship (Staatsangehörigkeit)</Lbl>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "2px solid #86efac" }}>
          <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#15803d", fontSize: 13 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 1 }}>Pre-filled from Step 1</div>
          </div>
          <button onClick={() => setEditing(true)} style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", padding: 0 }}>Edit</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Lbl req>Citizenship (Staatsangehörigkeit)</Lbl>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slots.map((cit, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <SearchableSelect
                label=""
                value={cit}
                onChange={v => {
                  const next = [...slots];
                  next[i] = v;
                  commitSlots(next);
                }}
                options={ALL_CITIZENSHIPS}
                allowCustom
                placeholder={i === 0 ? "e.g. British, German, Turkish..." : "Add citizenship..."}
              />
            </div>
            {i > 0 && (
              <button onClick={() => commitSlots(slots.filter((_, j) => j !== i))}
                style={{ marginTop: 4, padding: "10px 12px", borderRadius: 9, border: "1.5px solid #fecaca", background: "white", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                ✕
              </button>
            )}
          </div>
        ))}
        {slots.length < 3 && (
          <button onClick={() => setSlots([...slots, ""])}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, border: "1.5px dashed #bfdbfe", background: "#f8faff", color: "#0075FF", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
            <Plus size={13} /> Add citizenship
          </button>
        )}
      </div>
      <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 5, lineHeight: 1.5 }}>Stored as comma-separated on the form — e.g. "German, Turkish"</p>
    </div>
  );
}

function PersonForm({ person, idx, onChange, showDocuments = false }: {
  person: Person;
  idx: number;
  onChange: (k: keyof Person, v: string) => void;
  showDocuments?: boolean;
}) {
  const u = (k: keyof Person) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(k, e.target.value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <R2
        a={<Inp req label="Last Name (Familienname)" value={person.lastName} onChange={u("lastName")} placeholder="MUELLER" info="CAPS as in passport" />}
        b={<Inp req label="First Name(s) (Vornamen)" value={person.firstName} onChange={u("firstName")} placeholder="Maria Anna" />}
      />
      <Inp opt label="Birth Name (Geburtsname)" value={person.birthName} onChange={u("birthName")} placeholder="Only if different from current name" />
      <R2
        a={<Inp req label="Date of Birth" type="date" value={person.birthDate} onChange={u("birthDate")} />}
        b={<Sel req label="Gender (Geschlecht)" value={person.gender} onChange={u("gender")} opts={[["m","Male (männlich)"],["f","Female (weiblich)"],["d","Diverse (divers)"],["x","Ohne Angabe"]]} />}
      />
      <R2
        a={<Inp req label="Place of Birth" value={person.birthPlace} onChange={u("birthPlace")} placeholder="London" />}
        b={<SearchableSelect opt label="Country of Birth" value={person.birthCountry}
              onChange={v => onChange("birthCountry", v)} options={ALL_COUNTRIES} allowCustom placeholder="Search country..." />}
      />
      {/* Multi-citizenship for every person — up to 3 slots, comma-separated in form */}
      <CitizenshipField
        value={person.citizenship}
        onChange={v => onChange("citizenship", v)}
        isPrefilled={idx === 0 && !!person.citizenship}
      />
      <Sel opt label="Religion (Religionsgesellschaft)" value={person.religion} onChange={u("religion")}
        opts={[["none","None / non-religious"],["rk","Catholic (r\u00f6m.-kath.)"],["ev","Protestant (ev.)"],["jd","Jewish (j\u00fcdisch)"],["is","Muslim (islamisch)"],["or","Orthodox (orthodox)"],["bu","Buddhist (buddhistisch)"],["so","Other (sonstige)"]]}
        info="Optional — but if you select Catholic or Protestant, ~8–9% church tax applies automatically. Select 'None' to opt out with no consequences." />
      <Inp opt label="Artistic / Order Name (optional)" value={person.artisticName} onChange={u("artisticName")} placeholder="Leave blank if not applicable" />

      {showDocuments && (
        <div style={{ background: "#f8fafc", border: "1px solid #e8ecf4", borderRadius: 12, padding: 16, marginTop: 4 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
            <FileText size={13} color="#2563eb" /> Identity Document
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <R2
              a={<Sel req label="Document Type" value={person.docType} onChange={u("docType")} opts={[["RP","Reisepass (Passport)"],["PA","Personalausweis (National ID)"],["KP","Kinderreisepass (Child Passport)"]]} />}
              b={<Inp req label="Serial Number" value={person.docSerial} onChange={u("docSerial")} placeholder="C01X00T47" />}
            />
            <Inp req label="Issuing Authority" value={person.docAuthority} onChange={u("docAuthority")} placeholder="City of London" info="Where was the document issued?" />
            <R2
              a={<Inp opt label="Issue Date" type="date" value={person.docDate} onChange={u("docDate")} />}
              b={<Inp req label="Valid Until" type="date" value={person.docValidUntil} onChange={u("docValidUntil")} />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step: Origin ─────────────────────────────────────────────────
const EU_OPTS2 = ["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden","Iceland","Liechtenstein","Norway","Switzerland"];
const NON_EU_OPTS2 = ["United Kingdom","United States","Canada","Australia","India","China","Japan","South Korea","Brazil","Mexico","Turkey","Ukraine","Vietnam","Philippines","Indonesia","Egypt","Nigeria","South Africa","Pakistan","Bangladesh","Russia","Saudi Arabia","Singapore","Thailand","Other"];

// ── Coming Soon overlay for non-Berlin users ──────────────────────
function ComingSoonOverlay({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.72)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: 440, width: "100%", background: "white", borderRadius: 24, padding: "36px 32px", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <MapPin size={22} color="#94a3b8" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111111", letterSpacing: "-0.02em", marginBottom: 8 }}>Coming to your city soon</h2>
        <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
          SimplyExpat currently supports <strong>Berlin only</strong>. We are expanding to Hamburg, Munich, and Frankfurt in 2026.
        </p>
        {!submitted ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 12, padding: "12px 16px", fontSize: 15, fontFamily: "inherit", color: "#111111", outline: "none" }}
            />
            <button
              onClick={() => { if (email.includes("@")) setSubmitted(true); }}
              style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#111111", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Notify me when it launches
            </button>
            <button onClick={onBack}
              style={{ width: "100%", padding: "11px", borderRadius: 12, background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, border: "2px solid #e8ecf4", cursor: "pointer", fontFamily: "inherit" }}>
              Back
            </button>
          </div>
        ) : (
          <div>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #86efac", marginBottom: 14 }}>
              <p style={{ color: "#15803d", fontWeight: 700, fontSize: 14 }}>You are on the list.</p>
              <p style={{ color: "#16a34a", fontSize: 13, marginTop: 3 }}>We will email you the moment we launch in your city.</p>
            </div>
            <button onClick={onBack}
              style={{ width: "100%", padding: "11px", borderRadius: 12, background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, border: "2px solid #e8ecf4", cursor: "pointer", fontFamily: "inherit" }}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepOrigin({ form, set_, updPerson }: { form: FormData; set_: any; updPerson: (i: number, k: keyof Person, v: string) => void }) {
  const showComingSoon = form.isBerlin === false;
  const p1citizenship = form.people[0]?.citizenship ?? "";
  const hasOrigin = !!(p1citizenship && p1citizenship.trim());



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {showComingSoon && <ComingSoonOverlay onBack={() => set_("isBerlin", null)} />}

      <SH icon={MapPin}>Is your new address in Berlin?</SH>

      {/* Berlin gate */}
      <div>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12, lineHeight: 1.55 }}>
          SimplyExpat currently supports Berlin only. Please confirm your new address is within the city of Berlin.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {([["true", "Yes — my new address is in Berlin"], ["false", "No — different city"]] as const).map(([v, l]) => {
            const active = String(form.isBerlin) === v;
            const isYes = v === "true";
            return (
              <button key={v} onClick={() => { set_("isBerlin", isYes); if (isYes) set_("newCity", "Berlin"); }}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 12, border: `2px solid ${active ? (isYes ? "#0075FF" : "#94a3b8") : "#e8ecf4"}`, background: active ? (isYes ? "#eff6ff" : "#f8fafc") : "white", fontWeight: active ? 700 : 500, fontSize: 13.5, color: active ? (isYes ? "#0075FF" : "#374151") : "#64748b", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}>
                {active && isYes && <Check size={13} color="#0075FF" strokeWidth={3} />}
                {l}
              </button>
            );
          })}
        </div>
        {form.isBerlin === true && (
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #86efac", display: "flex", gap: 8, alignItems: "center" }}>
            <CheckCircle2 size={14} color="#16a34a" />
            <p style={{ color: "#15803d", fontSize: 12.5, fontWeight: 600 }}>Berlin confirmed. Let's get you registered.</p>
          </div>
        )}
      </div>

      {form.isBerlin === true && (<>
        <SH icon={User}>What is your citizenship?</SH>

        {/* ── Citizenship-first question ─────────────────────────────
            This is the same field as Person 1 citizenship in Step 4.
            Answering here pre-fills it there — and instantly tells us
            whether you are EU or Non-EU, personalising the whole flow. */}
        <div>
          {/* Multi-citizenship via shared CitizenshipField component */}
          <CitizenshipField
            value={p1citizenship}
            onChange={(val: string) => {
              updPerson(0, "citizenship", val);
              const citizenships = val.split(",").map((s: string) => s.trim()).filter(Boolean);
              const anyEU = citizenships.some((c: string) => (CITIZENSHIP_TO_COUNTRY[c] ?? {isEU: false}).isEU);
              const { country } = citizenshipToOrigin(val);
              set_("originCountry", country);
              set_("isEU", anyEU);
            }}
          />

          {/* EU / Non-EU personalised cards */}

          {/* EU/EEA — positive, accurate, no mention of appointments */}
          {hasOrigin && form.isEU && (
            <div style={{ marginTop: 10, borderRadius: 13, border: "1px solid #bfdbfe", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,117,255,0.08)" }}>
              <div style={{ padding: "14px 16px", background: "#eff6ff", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#0075FF" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, color: "#1e40af", fontSize: 13.5, marginBottom: 4 }}>You are in the right place.</div>
                  <p style={{ color: "#1d4ed8", fontSize: 12.5, lineHeight: 1.6 }}>
                    As an EU/EEA citizen you can actually use Berlin's official online Anmeldung — but it requires a German eID account, which most expats don't have. If that sounds complicated, just book an in-person appointment and we prepare everything: your form filled in German, your personalised document checklist, and your appointment guide.
                  </p>
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: "#dbeafe", borderTop: "1px solid #bfdbfe" }}>
                <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What we prepare for you:</div>
                {[
                  { label: "Your Anmeldung, filled in German", note: "All 54 official fields — zero errors, accepted at all 44 Berlin Bürgerämter" },
                  { label: "A personalised checklist", note: "Every document you need based on your exact situation — nothing more, nothing less" },
                  { label: "An expert appointment guide", note: "Step-by-step tips so you walk in confident and walk out registered" },
                ].map(({ label, note }) => (
                  <div key={label} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color="white" strokeWidth={3} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#1e3a8a", fontSize: 12.5 }}>{label}</span>
                      <span style={{ color: "#1d4ed8", fontSize: 12 }}> — {note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-EU — amber alarm, then immediate solution */}
          {hasOrigin && !form.isEU && (
            <div style={{ marginTop: 10, borderRadius: 13, border: "1px solid #fcd34d", overflow: "hidden", boxShadow: "0 4px 16px rgba(217,119,6,0.15)" }}>
              {/* Alarm header */}
              <div style={{ padding: "14px 16px", background: "linear-gradient(135deg,#78350f,#b45309)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertCircle size={18} color="#fcd34d" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 900, color: "#fef3c7", fontSize: 14, marginBottom: 5, letterSpacing: "-0.01em" }}>
                    Heads up — you are required to appear in person.
                  </div>
                  <p style={{ color: "#fde68a", fontSize: 12.5, lineHeight: 1.65 }}>
                    As a non-EU citizen, Berlin's online registration is <strong style={{ color: "white" }}>not available to you</strong>. You must book an in-person appointment at a Bürgeramt and bring your paperwork. Miss the <strong style={{ color: "white" }}>14-day deadline</strong> and you risk a fine of up to <strong style={{ color: "white" }}>€1,000</strong>.
                  </p>
                </div>
              </div>
              {/* Solution */}
              <div style={{ padding: "14px 16px", background: "#fffbeb", borderTop: "2px solid #fcd34d" }}>
                <div style={{ fontWeight: 800, color: "#78350f", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>We handle the paperwork — continue and we prepare:</div>
                {[
                  { label: "Your Anmeldung, filled in German", note: "All 54 official fields — no errors, no repeat visits" },
                  { label: "A personalised document checklist", note: "Based on your country and situation — arrive with exactly the right papers" },
                  { label: "The appointment playbook", note: "Tuesday 8 AM trick, walk-in locations, phone slots — get seen fast" },
                ].map(({ label, note }) => (
                  <div key={label} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color="white" strokeWidth={3} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#78350f", fontSize: 12.5 }}>{label}</span>
                      <span style={{ color: "#92400e", fontSize: 12 }}> — {note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Lbl req>Marital Status (Familienstand)</Lbl>
          <TG value={form.maritalStatus} onChange={v => set_("maritalStatus", v)}
            options={[["ledig","Single"],["verheiratet","Married"],["partnerschaft","Civil Partnership (eingetr. Lebenspartnerschaft)"],["getrennt","Separated"],["geschieden","Divorced"],["verwitwet","Widowed"]]} />

        </div>

        <div>
          <div
            onClick={() => set_("furtherAddresses", form.furtherAddresses === "ja" ? "nein" : "ja")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "#f8fafc", border: "1px solid #e8ecf4", borderRadius: 9, cursor: "pointer", userSelect: "none" }}>
            {/* Custom checkbox */}
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${form.furtherAddresses === "ja" ? "#0075FF" : "#cbd5e1"}`, background: form.furtherAddresses === "ja" ? "#0075FF" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
              {form.furtherAddresses === "ja" && <Check size={11} color="white" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 600 }}>I have additional residences in Germany (Beiblatt required)</span>
          </div>
        </div>
        {form.furtherAddresses === "ja" && (
          <div style={{ padding: "13px 15px", borderRadius: 11, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", gap: 9, alignItems: "flex-start" }}>
            <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13, marginBottom: 3 }}>Beiblatt not supported yet</div>
              <p style={{ color: "#7f1d1d", fontSize: 12.5, lineHeight: 1.6 }}>
                We currently cannot generate the Beiblatt (supplementary sheet for multiple residences). You will need to fill that form manually. You can still use SimplyExpat for the main Anmeldung — uncheck this box to continue.
              </p>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

// ─── Step: New Address ────────────────────────────────────────────
// ─── Zusätze field with info toggle ─────────────────────────────
function ZusaetzeField({ value, onChange }: { value: string; onChange: (e: any) => void }) {
  const [showInfo, setShowInfo] = React.useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <label style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Zusätze <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: "0.88em" }}>(optional)</span>
        </label>
        <button onClick={() => setShowInfo(s => !s)}
          style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #94a3b8", background: showInfo ? "#0075FF" : "white", color: showInfo ? "white" : "#94a3b8", fontSize: 10, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
          i
        </button>
      </div>
      {showInfo && (
        <div style={{ marginBottom: 8, padding: "10px 13px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <p style={{ color: "#1d4ed8", fontSize: 12.5, lineHeight: 1.6 }}>
            <strong>Zusätze</strong> (additions) are extra address details the Bürgeramt may ask for — for example:<br/>
            <strong>Stockwerk</strong> (floor): e.g. "2. OG" (2nd floor)<br/>
            <strong>Vorderhaus / Hinterhaus</strong>: front or rear building (common in Berlin Altbauten)<br/>
            <strong>Quergebäude / Seitenflügel</strong>: side wing<br/>
            Leave blank if not applicable — most Berlin addresses don't need this.
          </p>
        </div>
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder="e.g. 2. OG, Hinterhaus"
        style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 10, padding: "10px 14px", fontSize: 16, color: "#0f172a", background: "white", fontFamily: "inherit" }}
      />
    </div>
  );
}

function StepNewAddress({ form, upd, set_ }: { form: FormData; upd: any; set_: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SH icon={MapPin}>New Berlin Address</SH>
      <R2 a={<Inp req label="Street Name" value={form.newStreet} onChange={upd("newStreet")} placeholder="Hauptstrasse" autoFocus />}
          b={<Inp req label="House No." value={form.newNumber} onChange={upd("newNumber")} placeholder="12a" />} />
      <ZusaetzeField value={form.newAddExtra} onChange={upd("newAddExtra")} />
      <R2 a={<Inp req label="Postal Code (PLZ)" value={form.newPostalCode} onChange={upd("newPostalCode")} placeholder="10115" maxLength={5} inputMode="numeric" />}
          b={<div>
            <Lbl>City</Lbl>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "2px solid #86efac", fontSize: 16, color: "#15803d", fontWeight: 700 }}>
              <CheckCircle2 size={14} color="#16a34a" /> Berlin
            </div>
          </div>} />
      <Inp req label="Move-in Date (Einzugsdatum)" type="date" value={form.moveInDate} onChange={upd("moveInDate")} />
      <div>
        <Lbl req>Residence Type</Lbl>
        <TG value={form.newResType} onChange={v => set_("newResType", v)} options={[["alleinige","Sole residence (Alleinige Wohnung)"],["Haupt","Primary residence (Hauptwohnung)"],["Neben","Secondary residence (Nebenwohnung)"]]} />
      </div>
      <IBox type="warn">You have <strong>14 days</strong> from your Einzugsdatum to register (§17 BMG). Fines up to €1,000 for late registration.</IBox>
    </div>
  );
}

// ─── Step: Previous Address ───────────────────────────────────────
function StepPrevAddress({ form, upd, set_ }: { form: FormData; upd: any; set_: any }) {
  const fromGermany = form.prevCountry && ["germany","deutschland"].includes(form.prevCountry.toLowerCase());
  const fromAbroad = form.prevCountry && !["germany","deutschland"].includes(form.prevCountry.toLowerCase());
  const noCountryYet = !form.prevCountry;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SH icon={Home}>Previous Address</SH>

      <SearchableSelect
        label="Country" req
        value={form.prevCountry}
        onChange={v => { const e = { target: { type: "text", value: v } } as any; upd("prevCountry")(e); }}
        options={ALL_COUNTRIES}
        allowCustom
        placeholder="Search country..."
      />

      {/* German address — full details required by Amt */}
      {fromGermany && (
        <>
          <IBox>Your previous address was in Germany — the Amt requires the full address. Please fill in all fields below.</IBox>
          <R2 a={<Inp req label="Street Name" value={form.prevStreet} onChange={upd("prevStreet")} placeholder="Musterstraße" />}
              b={<Inp req label="House No." value={form.prevNumber} onChange={upd("prevNumber")} placeholder="12" />} />
          <R2 a={<Inp req label="Postal Code" value={form.prevPostalCode} onChange={upd("prevPostalCode")} placeholder="10115" />}
              b={<Inp req label="City" value={form.prevCity} onChange={upd("prevCity")} placeholder="Berlin" />} />
        </>
      )}

      {/* Foreign address — country only needed */}
      {fromAbroad && (
        <IBox>Moving from outside Germany — only the country is required. The Bürgeramt will use it to fill the "Bei Zuzug aus dem Ausland" field automatically.</IBox>
      )}

      {/* No country yet — show fields greyed out */}
      {noCountryYet && (
        <>
          <R2 a={<Inp opt label="Street Name" value={form.prevStreet} onChange={upd("prevStreet")} placeholder="Only needed for German address" />}
              b={<Inp opt label="House No." value={form.prevNumber} onChange={upd("prevNumber")} placeholder="" />} />
          <R2 a={<Inp opt label="Postal Code" value={form.prevPostalCode} onChange={upd("prevPostalCode")} placeholder="" />}
              b={<Inp opt label="City" value={form.prevCity} onChange={upd("prevCity")} placeholder="" />} />
        </>
      )}

      <Inp opt label="Move-out Date" type="date" value={form.moveOutDate} onChange={upd("moveOutDate")} />
      <div>
        <Lbl>Keep previous address?</Lbl>
        <TG value={form.keepPrev} onChange={v => set_("keepPrev", v)} options={[["nein","No — giving it up"],["haupt","Yes — keep as primary (Hauptwohnung)"],["neben","Yes — keep as secondary (Nebenwohnung)"]]} />
      </div>
    </div>
  );
}

// ─── Step: People (the new multi-person step) ─────────────────────
function StepPeople({ form, updPerson, addPerson, removePerson }: {
  form: FormData;
  updPerson: (i: number, k: keyof Person, v: string) => void;
  addPerson: () => void;
  removePerson: (i: number) => void;
}) {
  const sheets = sheetsNeeded(form.people);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SH icon={Users}>Who is moving with you?</SH>

      {/* Sheet allocation preview */}
      {form.people.length > 1 && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg,#f0f9ff,#eff6ff)", border: "1px solid #bfdbfe" }}>
          <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 12.5, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Layers size={13} color="#2563eb" /> {sheets} Anmeldung {sheets === 1 ? "sheet" : "sheets"} will be generated
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Array.from({ length: sheets }, (_, i) => {
              const p1 = form.people[i * 2];
              const p2 = form.people[i * 2 + 1];
              return (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 7, background: "white", border: "1px solid #bfdbfe", fontSize: 11.5, color: "#1d4ed8", fontWeight: 600 }}>
                  Sheet {i + 1}: {[p1?.firstName || "Person " + (i*2+1), p2?.firstName || (p2 !== undefined ? "Person " + (i*2+2) : null)].filter(Boolean).join(" + ")}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Person cards */}
      {form.people.map((person, idx) => (
        <div key={idx} className="person-in" style={{ border: "2px solid #e8ecf4", borderRadius: 16, overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ padding: "14px 18px", background: idx === 0 ? "linear-gradient(135deg,#1e40af,#2563eb)" : "#f8fafc", borderBottom: "1px solid #e8ecf4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: idx === 0 ? "rgba(255,255,255,0.25)" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={13} color={idx === 0 ? "white" : "#2563eb"} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: idx === 0 ? "white" : "#0f172a", fontSize: 13.5 }}>
                  {idx === 0 ? "You (Person 1)" : `Person ${idx + 1}`}
                  {idx > 0 && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: 999 }}>
                    Sheet {Math.floor(idx / 2) + 1}, Slot {idx % 2 === 0 ? 1 : 2}
                  </span>}
                </div>
                {person.firstName && <div style={{ fontSize: 11.5, color: idx === 0 ? "rgba(255,255,255,0.75)" : "#64748b" }}>{person.firstName} {person.lastName}</div>}
              </div>
            </div>
            {idx > 0 && (
              <button onClick={() => removePerson(idx)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1.5px solid #fecaca", background: "transparent", color: "#dc2626", fontSize: 12, fontWeight: 600 }}>
                <Trash2 size={11} /> Remove
              </button>
            )}
          </div>
          {/* Relationship selector for non-primary people */}
          {idx > 0 && (
            <div style={{ padding: "10px 18px 0", background: idx === 0 ? "rgba(0,0,0,0.1)" : "#f8fafc" }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Relationship to Person 1
              </label>
              <div style={{ display: "flex", gap: 7 }}>
                {([["spouse","Spouse / Partner"],["child","Child"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => updPerson(idx, "relationship", v)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `2px solid ${person.relationship === v ? "#0075FF" : "#e8ecf4"}`, background: person.relationship === v ? "#eff6ff" : "white", fontWeight: person.relationship === v ? 700 : 500, fontSize: 12, color: person.relationship === v ? "#0075FF" : "#64748b", cursor: "pointer", fontFamily: "inherit" }}>
                    {l}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, lineHeight: 1.45 }}>
                Only family members (spouse, children) may share an Anmeldung form. Roommates register separately.
              </p>
            </div>
          )}
          {/* Form body */}
          <div style={{ padding: 18 }}>
            <PersonForm person={person} idx={idx} onChange={(k, v) => updPerson(idx, k, v)} />
          </div>
        </div>
      ))}

      {/* Add person button */}
      {form.people.length < MAX_PEOPLE ? (
        <button onClick={addPerson}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "15px 13px", borderRadius: 13, border: "2px dashed #bfdbfe", background: "#f8faff", color: "#2563eb", fontWeight: 700, fontSize: 14, transition: "all 0.15s", minHeight: 52 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#eff6ff"; (e.currentTarget as HTMLElement).style.borderColor = "#93c5fd"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f8faff"; (e.currentTarget as HTMLElement).style.borderColor = "#bfdbfe"; }}>
          <Plus size={16} /> Add another person
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>({MAX_PEOPLE - form.people.length} remaining)</span>
        </button>
      ) : (
        <div style={{ padding: "11px 16px", borderRadius: 11, background: "#fafafa", border: "1px solid #e8ecf4", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          Maximum {MAX_PEOPLE} people reached (3 Anmeldung sheets)
        </div>
      )}

      <IBox>The official Anmeldung form fits exactly <strong>2 people per sheet</strong>. We automatically generate the right number of forms — you hand them all in at the same appointment.</IBox>
    </div>
  );
}

// ─── Step: Status & Religion ──────────────────────────────────────
function StepStatus({ form, upd, set_, updPerson }: { form: FormData; upd: any; set_: any; updPerson: (i: number, k: keyof Person, v: string) => void }) {
  const isMarried = form.maritalStatus === "verheiratet" || form.maritalStatus === "partnerschaft";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SH icon={Church}>Status & Religion</SH>

      {/* Religion for each person inline */}
      <div>
        <Lbl req>Religious Affiliation — All Persons</Lbl>
        <p style={{ color: "#64748b", fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
          Determines Kirchensteuer (church tax ~8–9% on income tax). Choose "keine" to opt out.
        </p>
        {form.people.map((person, idx) => (
          <div key={idx} style={{ marginBottom: 10, padding: "12px 14px", background: "#f8fafc", border: "1px solid #e8ecf4", borderRadius: 11 }}>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 12.5, marginBottom: 8 }}>
              {idx === 0 ? "You (Person 1)" : `Person ${idx + 1}`}
              {person.firstName && <span style={{ color: "#64748b", fontWeight: 400 }}> — {person.firstName} {person.lastName}</span>}
            </div>
            <select value={person.religion} onChange={e => updPerson(idx, "religion", e.target.value)}
              style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 9, padding: "9px 34px 9px 12px", fontSize: 13, color: "#0f172a", background: "white", fontFamily: "inherit", appearance: "none" }}>
              <option value="">— Select —</option>
              {[["none","None / non-religious"],["rk","Catholic (r\u00f6m.-kath.)"],["ev","Protestant (ev.)"],["jd","Jewish (j\u00fcdisch)"],["is","Muslim (islamisch)"],["or","Orthodox (orthodox)"],["bu","Buddhist (buddhistisch)"],["so","Other (sonstige)"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Warning: minors will get ledig in PDF */}
      {form.people.some((p, i) => i > 0 && ageFromDOB(p.birthDate) < 18) && (
        <IBox type="info">
          <strong>Note for minors:</strong> Any person under 18 in your form will have their marital status set to <strong>ledig</strong> (single) in the PDF automatically — this is a legal requirement on the Anmeldung form. Your entered status for Person 1 is not affected.
        </IBox>
      )}

      {isMarried && (
        <div style={{ background: "#f8fafc", border: "1px solid #e8ecf4", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 12 }}>Marriage / Partnership Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <R2 a={<Inp opt label="Date of Marriage" type="date" value={form.marriageDate} onChange={upd("marriageDate")} />}
                b={<Inp opt label="Place / City" value={form.marriagePlace} onChange={upd("marriagePlace")} placeholder="Lisbon" />} />
            <SearchableSelect opt label="Country" value={form.marriageCountry} onChange={upd("marriageCountry")} options={ALL_COUNTRIES} allowCustom placeholder="Search country..." />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step: Documents ──────────────────────────────────────────────
function StepDocuments({ form, updPerson }: { form: FormData; updPerson: (i: number, k: keyof Person, v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SH icon={FileText}>Identity Documents</SH>
      <p style={{ color: "#64748b", fontSize: 13.5, marginTop: -8, lineHeight: 1.6 }}>Enter document details for every person. This fills the Dokument fields on each Anmeldung sheet.</p>
      {form.people.map((person, idx) => (
        <div key={idx} className="person-in" style={{ border: "1px solid #e8ecf4", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", background: idx === 0 ? "#eff6ff" : "#f8fafc", borderBottom: "1px solid #e8ecf4" }}>
            <div style={{ fontWeight: 700, color: idx === 0 ? "#1e40af" : "#0f172a", fontSize: 13 }}>
              {idx === 0 ? "You (Person 1)" : `Person ${idx + 1}`}
              {person.firstName && <span style={{ color: "#64748b", fontWeight: 400 }}> — {person.firstName} {person.lastName}</span>}
              <span style={{ marginLeft: 8, fontSize: 10.5, color: "#64748b", fontWeight: 500 }}>Sheet {Math.floor(idx/2)+1}, Slot {idx%2===0?1:2}</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div>
                <Lbl req>Document Type</Lbl>
                <select value={person.docType} onChange={e => updPerson(idx, "docType", e.target.value)}
                  style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 10, padding: "10px 14px", fontSize: 16, color: "#0f172a", background: "white", fontFamily: "inherit", appearance: "none" }}>
                  <option value="">— Select —</option>
                  <option value="RP">Reisepass (Passport)</option>
                  {form.isEU && <option value="PA">Personalausweis (National ID Card)</option>}
                  <option value="KP">Kinderreisepass (Child Passport)</option>
                </select>
                {!form.isEU && person.docType === "PA" && (
                  <p style={{ color: "#dc2626", fontSize: 12, marginTop: 5, fontWeight: 600 }}>National ID cards are only accepted for EU/EEA citizens. Please select Reisepass.</p>
                )}
                {form.isEU && <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 4 }}>EU/EEA citizens may use either passport or national ID card.</p>}
              </div>
              <Inp req label="Issuing Authority" value={person.docAuthority} onChange={e => updPerson(idx, "docAuthority", e.target.value)} placeholder="City of London" info="Where was the document issued?" />
              <R2 a={<Inp req label="Serial Number" value={person.docSerial} onChange={e => updPerson(idx, "docSerial", e.target.value)} placeholder="C01X00T47" />}
                  b={<Inp opt label="Issue Date" type="date" value={person.docDate} onChange={e => updPerson(idx, "docDate", e.target.value)} />} />
              <Inp req label="Valid Until" type="date" value={person.docValidUntil} onChange={e => updPerson(idx, "docValidUntil", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      {!form.isEU && <IBox type="info"><strong>Non-EU citizens:</strong> You must appear in person at the Bürgeramt. Our Guide PDF includes a full checklist of what to bring. The Anmeldung itself only requires your passport — no additional document fields here.</IBox>}
    </div>
  );
}

// ─── Step: Review ─────────────────────────────────────────────────
function StepReview({ form, sheets }: { form: FormData; sheets: number }) {
  const Sec = ({ title, rows }: { title: string; rows: [string,string][] }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: "#1d4ed8", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6, paddingBottom: 4, borderBottom: "1px solid #e8ecf4" }}>{title}</div>
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} style={{ display: "flex", gap: 14, marginBottom: 4, fontSize: 13 }}>
          <span style={{ color: "#64748b", minWidth: 155, flexShrink: 0 }}>{k}</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <SH icon={CheckCircle2}>Review All Data</SH>

      {/* Sheet plan */}
      <div style={{ marginBottom: 18, padding: "14px 16px", borderRadius: 14, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #86efac" }}>
        <div style={{ fontWeight: 800, color: "#15803d", fontSize: 13.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
          <Layers size={14} color="#16a34a" /> Generation Plan: {sheets} Anmeldung {sheets === 1 ? "form" : "forms"} + Wohnungsgeberbest. + Checkliste
        </div>
        {Array.from({ length: sheets }, (_, i) => {
          const p1 = form.people[i * 2];
          const p2 = form.people[i * 2 + 1];
          return (
            <div key={i} style={{ fontSize: 12.5, color: "#15803d", marginBottom: 3, paddingLeft: 4 }}>
              Sheet {i + 1}: {[p1 && `${p1.firstName} ${p1.lastName}`, p2 && `${p2.firstName} ${p2.lastName}`].filter(Boolean).join(" + ")}
            </div>
          );
        })}
      </div>

      <IBox>Everything below goes into the official forms. Verify carefully before generating.</IBox>
      <div style={{ marginTop: 16 }}>
        <Sec title="New Address" rows={[["Street", `${form.newStreet} ${form.newNumber}`],["PLZ / City", `${form.newPostalCode} ${form.newCity}`],["Move-in", fmtDate(form.moveInDate)],["Type", form.newResType]]} />
        <Sec title="Previous Address" rows={[["Street", `${form.prevStreet} ${form.prevNumber}`.trim()],["City / Country", `${form.prevCity}, ${form.prevCountry}`],["Move-out", fmtDate(form.moveOutDate)]]} />
        <Sec title="Status" rows={[["Marital", MARITAL_DE[form.maritalStatus] ?? form.maritalStatus],["Marriage", `${fmtDate(form.marriageDate)} ${form.marriagePlace} ${form.marriageCountry}`.trim()]]} />
        {form.people.map((p, i) => (
          <Sec key={i} title={`Person ${i + 1}${p.firstName ? " — " + p.firstName + " " + p.lastName : ""}`} rows={[
            ["Born", `${fmtDate(p.birthDate)}, ${p.birthPlace}, ${p.birthCountry}`],
            ["Gender", GENDER_DE[p.gender] ?? p.gender],
            ["Citizenship", p.citizenship],
            ["Religion", RELIGION_DE[p.religion] ?? p.religion],
            ["Document", `${p.docType} ${p.docSerial}`],
            ["Authority", p.docAuthority],
            ["Valid Until", fmtDate(p.docValidUntil)],
          ]} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PAYMENT PAGE
// ═══════════════════════════════════════════════════════════════════
function PaymentPage({ paid, genStatus, onGenerate, allDone, sheets, form, downloadWG, userEmail, setUserEmail, emailSent }: {
  paid: boolean; genStatus: string; onGenerate: () => void;
  allDone: boolean; sheets: number; form: FormData; downloadWG: () => void;
  userEmail: string; setUserEmail: (v: string) => void; emailSent: boolean;
}) {
  const busy = !!genStatus;
  const [dlA, setDlA] = React.useState(false);
  const [dlG, setDlG] = React.useState(false);
  const [dlW, setDlW] = React.useState(false);
  const [isDevTest, setIsDevTest] = React.useState(false);
  React.useEffect(() => {
    setIsDevTest(sessionStorage.getItem("devtest") === "1");
  }, []);
  const p1 = form.people[0] ?? EMPTY_PERSON;

  const redownloadAnmeldung = async () => {
    setDlA(true);
    try {
      const pdfs = await buildAllAnmeldungPDFs(form);
      for (const { bytes, name } of pdfs) {
        savePDF(bytes, name);
        await new Promise(r => setTimeout(r, 250));
      }
    } catch (e) { console.error(e); }
    setDlA(false);
  };

  const redownloadGuide = async () => {
    setDlG(true);
    try { savePDF(await buildGuidePDF(form), `Guide_Anmeldung_Berlin_${p1.lastName || ""}.pdf`); }
    catch (e) { console.error(e); }
    setDlG(false);
  };

  const redownloadWG = async () => {
    setDlW(true);
    try { savePDF(await buildWGPDF(form), `Wohnungsgeberbestaetigung_${p1.lastName || "Template"}.pdf`); }
    catch (e) { console.error(e); }
    setDlW(false);
  };

  // ── Shared button style ──────────────────────────────────────
  const dlBtn = (bg: string, shadow: string): React.CSSProperties => ({
    width: "100%", display: "flex", alignItems: "center", padding: "14px 18px",
    borderRadius: 13, background: bg, color: "white", fontWeight: 700, fontSize: 14,
    border: "none", cursor: "pointer", boxShadow: shadow,
    fontFamily: "inherit", gap: 12, transition: "opacity 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,Arial,sans-serif" }} className="fu">

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "40px 20px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(0,117,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>S</span>
            </div>
            <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>SimplyExpat <span style={{ color: "#60a5fa" }}>Berlin</span></span>
          </div>
          {(() => {
            const d = form.moveInDate ? Math.ceil((new Date().getTime() - new Date(form.moveInDate).getTime()) / 86400000) : null;
            const daysLeft = d !== null ? 14 - d : null;
            return (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: daysLeft !== null && daysLeft <= 7 ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.1)", border: `1px solid ${daysLeft !== null && daysLeft <= 7 ? "rgba(239,68,68,0.4)" : "rgba(251,191,36,0.3)"}`, borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
                <AlertCircle size={11} color={daysLeft !== null && daysLeft <= 7 ? "#f87171" : "#fbbf24"} />
                <span style={{ color: daysLeft !== null && daysLeft <= 7 ? "#f87171" : "#fbbf24", fontSize: 11.5, fontWeight: 700 }}>
                  {daysLeft !== null && d! > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to register` : "14-day deadline from your move-in date"}
                </span>
              </div>
            );
          })()}
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
            A few steps away from<br/><span style={{ color: "#60a5fa" }}>being registered.</span>
          </h1>
          <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 15, lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}>
            Your form is ready to generate. Get your documents and walk in to the Bürgeramt prepared.
          </p>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{ maxWidth: 560, margin: "-60px auto 0", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>

        {/* What you get */}
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", marginBottom: 12 }}>

          {/* Price row — clean, minimal */}
          <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>One-time payment · No subscription</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.04em" }}>€15</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>one time</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {["Instant download", "No account", "Zero data stored"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={8} color="#16a34a" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div style={{ padding: "16px 24px" }}>
            {[
              { label: sheets > 1 ? `${sheets} Official Anmeldung Forms` : "Official Anmeldung Form", desc: "All 54 fields · Perfect German · All 44 Berlin Bürgerämter" },
              { label: "Personalised Document Checklist", desc: "Based on your nationality and situation" },
              { label: "Berlin Appointment Guide", desc: "Tuesday 8 AM slots, walk-ins, phone tricks" },
            ].map(({ label, desc }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? "1px solid #f8fafc" : "none", marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", border: "1px solid #e8ecf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={14} color="#0075FF" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>{label}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 1 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ margin: "0 16px 16px", padding: "11px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e8ecf4", display: "flex", gap: 9 }}>
            <Shield size={13} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>We prepare your documents perfectly. We do not register you — that requires your personal appearance at the Bürgeramt. We cannot book appointments for you, but our Guide shows you how to get one fast.</p>
          </div>
        </div>

        {/* Email capture */}
        {!paid && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 14, background: "white", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 6 }}>
              Get your next steps by email <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12 }}>(optional)</span>
            </div>
            <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="your@email.com"
              style={{ width: "100%", border: "2px solid #e8ecf4", borderRadius: 10, padding: "10px 14px", fontSize: 15, color: "#0f172a", background: "#f8fafc", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 6, lineHeight: 1.55 }}>
              Next steps + booking link sent to your inbox. <strong>No PDFs, no personal data.</strong> Art. 6(1)(a) DSGVO.
            </p>
          </div>
        )}

        {/* Data safety */}
        {!paid && (
          <div style={{ marginBottom: 14, padding: "11px 14px", borderRadius: 12, background: "#f0f9ff", border: "1px solid #bae6fd", display: "flex", gap: 9 }}>
            <Shield size={13} color="#0284c7" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: "#0c4a6e", lineHeight: 1.6 }}>
              <strong>Your data never reaches our servers.</strong> Everything stays in your browser — deleted after generation.
            </p>
          </div>
        )}

        {/* ── Hacks reminder ── */}
        {!paid && (
          <div style={{ marginBottom: 14, padding: "13px 16px", borderRadius: 13, background: "#fffbeb", border: "1px solid #fde68a" }}>
            <div style={{ fontWeight: 800, color: "#92400e", fontSize: 12.5, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
              🗡️ Can't find an appointment?
            </div>
            <p style={{ color: "#78350f", fontSize: 12, lineHeight: 1.6 }}>
              Your Guide PDF includes insider hacks — Tuesday 8 AM slots, walk-in Bürgeramt locations, and how to call for cancellations. Don't book just one location. The Amt won't fine you as long as you have an appointment booked.
            </p>
          </div>
        )}

        {/* ── Pay button / generating spinner ── */}
        {!paid ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {form.isBerlin !== true && (
              <div style={{ padding: "12px 14px", borderRadius: 11, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", gap: 9 }}>
                <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: "#991b1b", fontSize: 13, lineHeight: 1.5 }}>
                  <strong>Berlin only:</strong> SimplyExpat currently supports Berlin addresses only. Please go back and confirm your address is in Berlin.
                </p>
              </div>
            )}
            <button
              onClick={async (e) => {
                if (form.isBerlin !== true) return;
                const btn = e.currentTarget as HTMLButtonElement;
                btn.disabled = true;
                btn.textContent = "Opening Stripe...";
                try {
                  const res = await fetch("/api/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) { window.location.href = data.url; }
                  else { btn.disabled = false; btn.innerHTML = "Pay €15 — Secure Stripe Checkout"; alert("Could not start checkout. Please try again."); }
                } catch { btn.disabled = false; btn.innerHTML = "Pay €15 — Secure Stripe Checkout"; alert("Network error. Please try again."); }
              }}
              id="stripe-pay-btn"
              disabled={form.isBerlin !== true}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px", borderRadius: 14, background: form.isBerlin === true ? "linear-gradient(135deg,#0075FF,#2563eb)" : "#334155", color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: form.isBerlin === true ? "0 8px 32px rgba(0,117,255,0.5)" : "none", cursor: form.isBerlin === true ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: "-0.01em" }}>
              <CreditCard size={18} /> Pay €15 — Secure Checkout
            </button>
            <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('pageshow',function(){var b=document.getElementById('stripe-pay-btn');if(b){b.disabled=false;b.textContent='Pay €15 — Secure Checkout';}});` }} />
            <p style={{ textAlign: "center", color: "rgba(147,197,253,0.6)", fontSize: 11.5 }}>
              🔒 Powered by Stripe · Secure · No card stored
            </p>
            {isDevTest && (
              <button
                onClick={onGenerate}
                style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 11, border: "2px dashed #f87171", background: "transparent", color: "#f87171", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                [DEV] Skip payment &amp; generate PDFs
              </button>
            )}
          </div>
        ) : !allDone ? (
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "22px", textAlign: "center" }}>
            <div style={{ width: 22, height: 22, border: "2.5px solid rgba(255,255,255,0.2)", borderTopColor: "#0075FF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ fontWeight: 700, color: "white", fontSize: 14 }}>{genStatus || "Generating your documents…"}</div>
            <div style={{ color: "rgba(191,219,254,0.6)", fontSize: 12, marginTop: 4 }}>Please keep this tab open</div>
          </div>
        ) : null}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DONE PAGE — product-first layout, big download cards, no auto-DL
// ═══════════════════════════════════════════════════════════════════
function DonePage({ form, sheets, generatedPDFs, onRestart }: {
  form: FormData;
  sheets: number;
  generatedPDFs: { anmeldung: { bytes: Uint8Array; name: string }[]; guide: Uint8Array | null };
  onRestart: () => void;
}) {
  const p1 = form.people[0] ?? EMPTY_PERSON;
  const [dlA, setDlA] = useState(false);
  const [dlG, setDlG] = useState(false);
  const [dlW, setDlW] = useState(false);
  const [showWipe, setShowWipe] = useState(false);
  const [wipeChecked, setWipeChecked] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  const isMarried = form.maritalStatus === "verheiratet" || form.maritalStatus === "partnerschaft";
  const isDivorced = form.maritalStatus === "geschieden";
  const isWidowed  = form.maritalStatus === "verwitwet";
  const hasForeignBirth = form.people.some(p =>
    p.birthCountry && !["germany","deutschland"].includes(p.birthCountry.toLowerCase()));
  const hasForeignMarriage = isMarried && form.marriageCountry &&
    !["germany","deutschland"].includes(form.marriageCountry.toLowerCase());

  // Guard: restore form from localStorage if state is empty (returning user after tab close)
  const getForm = (): FormData | null => {
    if (form.people[0]?.firstName || form.newStreet) return form;
    try {
      const raw = localStorage.getItem("simplyexpat-v1");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.form?.people?.[0]?.firstName) return { ...EMPTY, ...saved.form };
      }
    } catch {}
    return null; // session data gone
  };

  const dlAnmeldung = async () => {
    setDlA(true);
    try {
      // Always prefer cached bytes from this session (instant)
      // Fall back to regenerating from form (slightly slower but always correct)
      if (generatedPDFs.anmeldung.length > 0) {
        for (const { bytes, name } of generatedPDFs.anmeldung) {
          savePDF(bytes, name);
          await new Promise(r => setTimeout(r, 250));
        }
      } else {
        const f = getForm();
        if (!f) { setSessionError(true); setDlA(false); return; }
        const pdfs = await buildAllAnmeldungPDFs(f);
        for (const { bytes, name } of pdfs) {
          savePDF(bytes, name);
          await new Promise(r => setTimeout(r, 250));
        }
      }
    } catch (e) { console.error(e); }
    setDlA(false);
  };

  const dlGuide = async () => {
    setDlG(true);
    try {
      if (generatedPDFs.guide) {
        savePDF(generatedPDFs.guide, `Checklist_Guide_${p1.lastName || "Berlin"}.pdf`);
      } else {
        const f = getForm();
        if (!f) { setSessionError(true); setDlG(false); return; }
        savePDF(await buildGuidePDF(f), `Checklist_Guide_${f.people[0]?.lastName || "Berlin"}.pdf`);
      }
    } catch (e) { console.error(e); }
    setDlG(false);
  };

  const dlWG = async () => {
    setDlW(true);
    try {
      const f = getForm();
      if (!f) { setSessionError(true); setDlW(false); return; }
      savePDF(await buildWGPDF(f), `Wohnungsgeberbestaetigung_${f.people[0]?.lastName || "Template"}.pdf`);
    }
    catch (e) { console.error(e); }
    setDlW(false);
  };

  // ── Situation-based checklist cards
  type Card = { title: string; items: { text: string; detail?: string; warn?: string }[]; color: string; bg: string; border: string };
  const cards: Card[] = [];

  const isPersonEU = (p: Person): boolean => {
    if (!p.citizenship) return form.isEU;
    return p.citizenship.split(",").map(s => s.trim()).some(c => (CITIZENSHIP_TO_COUNTRY[c] ?? {isEU: false}).isEU);
  };

  // 1. Anmeldung forms
  cards.push({
    title: sheets > 1 ? `${sheets} Anmeldung Forms — print ALL, bring ALL` : "Anmeldung Form — printed on paper",
    color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe",
    items: sheets > 1
      ? Array.from({ length: sheets }, (_, i) => {
          const pa = form.people[i * 2]; const pb = form.people[i * 2 + 1];
          return { text: `Form ${i + 1}: ${[pa && `${pa.firstName} ${pa.lastName}`.trim(), pb && `${pb.firstName} ${pb.lastName}`.trim()].filter(Boolean).join(" + ")}`, detail: "Print double-sided if possible. Sign at the bottom after printing." };
        })
      : [{ text: "Your filled Anmeldung PDF — printed on paper", detail: "The Bürgeramt does NOT accept phone screens. Print at DM/Rossmann (~€0.10/page). Sign at the bottom after printing." }],
  });

  // 2. Wohnungsgeberbestätigung
  cards.push({
    title: "Wohnungsgeberbestätigung — signed by your landlord",
    color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    items: [{
      text: "Original signed confirmation from your landlord",
      detail: "Check your move-in documents and email first — many landlords include it automatically. If missing: download our template below and send to your landlord. Under §19 BMG they are legally required to provide it (refusal = fine up to €1,000).",
    }],
  });

  // 3. Identity documents per person
  cards.push({
    title: "Identity Documents — one per person",
    color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe",
    items: form.people.filter(p => p.firstName || p.lastName).map(p => {
      const eu = isPersonEU(p);
      return {
        text: `${p.firstName} ${p.lastName}`.trim(),
        detail: eu
          ? "Passport or National ID card (both valid for EU/EEA). Bring proof of ALL citizenships."
          : "Passport only — National ID cards NOT accepted for non-EU. Bring all passports if dual nationality.",
      };
    }),
  });

  // 4. Birth certificates — foreign born only
  if (hasForeignBirth) {
    const foreignPeople = form.people.filter(p =>
      p.birthCountry && !["germany","deutschland"].includes(p.birthCountry.toLowerCase()));
    cards.push({
      title: "Birth Certificates (born outside Germany)",
      color: "#0e7490", bg: "#f0f9ff", border: "#bae6fd",
      items: [
        ...foreignPeople.map(p => ({
          text: `Birth certificate: ${p.firstName} ${p.lastName}`.trim(),
          detail: `Born in ${p.birthCountry} — original required`,
          warn: "CERTIFIED TRANSLATION REQUIRED: Foreign birth certificates must have a beglaubigte Übersetzung (certified German translation). Some districts also require an Apostille.",
        })),
      ],
    });
  }

  // 5. Appointment confirmation
  cards.push({
    title: "Appointment Confirmation",
    color: "#374151", bg: "#f9fafb", border: "#e5e7eb",
    items: [{ text: "Bürgeramt appointment confirmation", detail: "Email printout or screenshot on your phone. You will need this at the entrance." }],
  });

  // 6. Marriage certificate if married
  if (isMarried) {
    cards.push({
      title: "Marriage or Civil Partnership Certificate",
      color: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe",
      items: [{
        text: "Original marriage or civil partnership certificate",
        detail: "Must be the original — no photocopies.",
        warn: hasForeignMarriage ? "CERTIFIED TRANSLATION REQUIRED: Your certificate is not German. Bring a beglaubigte Übersetzung by a sworn translator (approx. €50–150). Some districts also require an Apostille." : undefined,
      }],
    });
  }

  // 7. Visa/residence permit if non-EU
  if (!form.isEU) {
    cards.push({
      title: "Visa or Residence Permit (if you have one)",
      color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
      items: [{
        text: "Aufenthaltstitel or entry visa — original + copy",
        detail: "Only if you already have one. You do NOT need to wait for a visa before registering. If you have none yet, go without — register first.",
        warn: "Do NOT delay your Anmeldung waiting for a visa. Register first — the Bürgeramt will process you.",
      }],
    });
  }

  // 8. Mietvertrag (recommended)
  cards.push({
    title: "Rental Contract (recommended, not required)",
    color: "#374151", bg: "#f9fafb", border: "#e5e7eb",
    items: [{ text: "Copy of your Mietvertrag (rental contract)", detail: "Not mandatory but useful if the clerk has questions about your address. A copy is fine." }],
  });


  // Berlin stock photos for DM/Rossmann hack (Unsplash — free to use)
  const berlinPhotos = [
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80", // Berlin street
    "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=600&q=80", // Brandenburg Gate
    "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&q=80", // Berlin TV tower
  ];
  const berlinPhoto = berlinPhotos[Math.floor(Math.random() * berlinPhotos.length)];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,Arial,sans-serif" }} className="fu">

      {/* ── Header ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e8ecf4", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>SimplyExpat <span style={{ color: "#0075FF" }}>Berlin</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "5px 12px" }}>
          <CheckCircle2 size={12} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Documents ready</span>
        </div>
      </div>

      <div className="done-layout">
        {/* ── Desktop sidebar ── */}
        <div className="done-sidebar">
          <div className="done-sidebar-sticky">

            <div style={{ padding: "24px 20px", flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Your registration summary</div>
              {[
                ["Name", (p1.firstName + " " + p1.lastName).trim() || "—"],
                ["Address", form.newStreet ? `${form.newStreet} ${form.newNumber}, ${form.newPostalCode} Berlin` : "—"],
                ["Move-in", form.moveInDate ? fmtDate(form.moveInDate) : "—"],
                ["Status", form.isEU ? "EU/EEA citizen" : "Non-EU citizen"],
                ["People", String(form.people.length)],
                ["Forms", String(sheets)],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{v}</div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(0,117,255,0.1)", border: "1px solid rgba(0,117,255,0.2)" }}>
                <div style={{ fontWeight: 800, color: "#60a5fa", fontSize: 12.5, marginBottom: 6 }}>🗡️ Appointment hacks</div>
                <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 12, lineHeight: 1.6 }}>
                  Tuesday 7:55 AM on service.berlin.de. Refresh from 7:55 — new slots appear at 8:00 AM sharp and vanish in seconds. Any of 44 locations. Full hacks in your Guide PDF.
                </p>
              </div>
              <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p style={{ color: "rgba(187,247,208,0.85)", fontSize: 12, lineHeight: 1.6 }}>
                  <strong style={{ color: "#86efac" }}>Don't stress about the days.</strong> The Amt understands Berlin waiting times. As long as you have an appointment booked, no fine.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="done-main">

        {/* ── 1. GREEN SUCCESS BANNER ── */}
        <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", borderRadius: 18, padding: "22px 24px", marginBottom: 20, color: "white", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <CheckCircle2 size={20} color="#86efac" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#86efac", letterSpacing: "0.06em", textTransform: "uppercase" }}>Payment confirmed · Documents generated</span>
          </div>
          <h1 style={{ fontSize: 23, fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1.15 }}>
            {p1.firstName ? `${p1.firstName}, you're ready.` : "You're ready."}
          </h1>
          {/* Personalised summary */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 10 }}>
            {[
              sheets > 1 ? `${sheets} Anmeldung forms` : "1 Anmeldung form",
              "Your personalised checklist",
              "Appointment guide",
              ...(form.isEU ? ["EU/EEA — ID or passport"] : ["Non-EU — passport required"]),
              ...(form.people.length > 1 ? [`${form.people.length} people`] : []),
            ].map(tag => (
              <span key={tag} style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(187,247,208,0.95)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 999 }}>{tag}</span>
            ))}
          </div>
          <p style={{ color: "rgba(187,247,208,0.8)", fontSize: 13.5, lineHeight: 1.6 }}>
            {form.moveInDate ? (() => {
              const days = Math.ceil((new Date().getTime() - new Date(form.moveInDate).getTime()) / 86400000);
              const left = 14 - days;
              return left > 3
                ? `${left} day${left !== 1 ? "s" : ""} left — but don't stress. The Amt understands Berlin waiting times. Book an appointment and you're protected. See the hacks in your Guide.`
                : left > 0
                  ? `${left} day${left !== 1 ? "s" : ""} left — book an appointment immediately. The Amt won't fine you as long as you have one booked.`
                  : "Past 14 days — book an appointment now. The Amt won't fine you as long as you show up. See the hacks in your Guide PDF.";
            })() : "Book your Bürgeramt appointment — your Guide PDF has hacks to get one fast."}
          </p>
        </div>

        {/* ── 2. DOWNLOADS — front and centre ── */}
        <div style={{ marginBottom: 32 }}>
          {sessionError && (
            <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 800, color: "#991b1b", fontSize: 13, marginBottom: 3 }}>Session data not found</div>
                <p style={{ color: "#b91c1c", fontSize: 12.5, lineHeight: 1.6 }}>
                  Your form data is no longer in this browser — it may have been cleared. Use the "Clear data & start over" button below to begin again. If you completed payment, contact us at info@simplyexpat.de with your payment confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Anmeldung */}
          <button onClick={dlAnmeldung} disabled={dlA}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px 22px", borderRadius: 18, background: dlA ? "#64748b" : "linear-gradient(135deg,#0f172a,#0075FF)", color: "white", border: "none", cursor: dlA ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 10, boxShadow: dlA ? "none" : "0 8px 32px rgba(0,117,255,0.35)", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 3 }}>
                {dlA ? "Generating..." : sheets > 1 ? `Download ${sheets} Anmeldung Forms` : "Download Anmeldung Form"}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.8 }}>All 54 fields filled in German · Print &amp; bring to appointment</div>
            </div>
            <Download size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
          </button>

          {/* Checklist + Guide */}
          <button onClick={dlGuide} disabled={dlG}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 18, background: dlG ? "#64748b" : "linear-gradient(135deg,#134e4a,#0f766e)", color: "white", border: "none", cursor: dlG ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 10, boxShadow: dlG ? "none" : "0 8px 24px rgba(15,118,110,0.3)", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Layers size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 3 }}>
                {dlG ? "Generating..." : "Download Checklist + Guide"}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.8 }}>Your personalised checklist + Berlin appointment guide</div>
            </div>
            <Download size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
          </button>

          {/* WG */}
          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "12px 16px", marginBottom: 2 }}>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Home size={14} color="#d97706" /> Wohnungsgeberbestätigung — do you have it?
            </div>
            <p style={{ color: "#78350f", fontSize: 12.5, lineHeight: 1.6, marginBottom: 10 }}>
              Many landlords give you this form in your move-in documents — check your email or paperwork first. It's a single signed page with your name and address. If you already have it, you don't need to download this.<br/>
              <strong>If not:</strong> Download the template below and send it to your landlord. Under §19 BMG they are legally required to sign it.
            </p>
            <button onClick={dlWG} disabled={dlW}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: "white", color: "#374151", border: "1.5px solid #fde68a", cursor: dlW ? "not-allowed" : "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Home size={14} color="#d97706" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 1 }}>{dlW ? "Generating..." : "Download Landlord Confirmation Template"}</div>
                <div style={{ fontSize: 11.5, color: "#92400e" }}>Only if your landlord hasn't provided it yet</div>
              </div>
              <Download size={14} color="#d97706" style={{ flexShrink: 0 }} />
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 10, fontSize: 11.5, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Shield size={11} /> Generated in your browser · No data on any server
          </p>

          {/* Signature reminder */}
          <div style={{ marginTop: 14, padding: "13px 16px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <AlertCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 800, color: "#92400e", fontSize: 13, marginBottom: 2 }}>Don't forget to sign before you go in</div>
              <p style={{ color: "#78350f", fontSize: 12.5, lineHeight: 1.5 }}>The form requires a handwritten signature at the bottom ("Datum, Unterschrift"). Sign it after printing — not before.</p>
            </div>
          </div>
        </div>

        {/* ── 3. NEXT STEP — book appointment ── */}
        <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #e8ecf4", overflow: "hidden", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", padding: "20px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Your next step</div>
            <h2 style={{ fontSize: 19, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>Book your Bürgeramt appointment</h2>
            <p style={{ color: "rgba(191,219,254,0.85)", fontSize: 13.5, lineHeight: 1.65, marginBottom: 16 }}>
              You must appear in person — this is a legal requirement we cannot fulfil for you. Bring your printed form and the documents from your checklist.
            </p>
            <a href="https://service.berlin.de/dienstleistung/120686/" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 12, background: "white", color: "#0f172a", fontWeight: 900, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <ExternalLink size={15} color="#0075FF" /> Book on service.berlin.de →
            </a>
            <p style={{ color: "rgba(147,197,253,0.6)", fontSize: 11.5, marginTop: 10 }}>Any of 44 locations · Free · Scroll to bottom to see all Bürgeramt locations</p>
          </div>
          {!form.isEU && (
            <div style={{ padding: "14px 22px", background: "#fffbeb", borderTop: "1px solid #fde68a", display: "flex", gap: 10 }}>
              <AlertCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#92400e", fontSize: 13, lineHeight: 1.6 }}>
                <strong>Non-EU:</strong> You must attend in person. Bring your passport — national ID cards are not accepted.
              </p>
            </div>
          )}
        </div>

        {/* ── 4. APPOINTMENT HACKS TEASER ── */}
        <div style={{ background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", padding: "13px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
          <Zap size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, color: "#92400e", fontSize: 13, marginBottom: 3 }}>Appointment hacks are in your Guide PDF</div>
            <p style={{ color: "#78350f", fontSize: 12.5, lineHeight: 1.6 }}>Page 2 of your Checklist + Guide includes insider tips on finding slots, walk-in locations, and calling for cancellations.</p>
          </div>
        </div>

        {/* ── 5. BRING LIST ── */}
        {(hasForeignBirth || hasForeignMarriage) && (
          <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 12, border: "1px solid #bae6fd" }}>
            <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0e7490)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 9 }}>
              <AlertCircle size={15} color="#7dd3fc" style={{ flexShrink: 0 }} />
              <div style={{ fontWeight: 800, color: "white", fontSize: 13 }}>Foreign documents — translations required</div>
            </div>
            <div style={{ background: "#f0f9ff", padding: "12px 16px" }}>
              <p style={{ color: "#0c4a6e", fontSize: 13, lineHeight: 1.7 }}>Birth or marriage certificates from outside Germany need a <strong>certified German translation</strong> (beglaubigte Übersetzung). Some require an Apostille. Missing translations are the most common reason registrations fail.</p>
            </div>
          </div>
        )}

        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10 }}>Bring to your appointment</div>
        {cards.map((card, ci) => (
          <div key={card.title} style={{ background: "white", borderRadius: 14, border: `1.5px solid ${card.border}`, marginBottom: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${card.border}`, background: card.bg }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={13} color="white" strokeWidth={3} />
              </div>
              <div style={{ fontWeight: 800, color: card.color, fontSize: 13, flex: 1 }}>{card.title}</div>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>REQUIRED</span>
            </div>
            <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {card.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${card.border}`, flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#111111", fontSize: 13, lineHeight: 1.4 }}>{item.text}</div>
                    {item.detail && <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{item.detail}</div>}
                    {item.warn && <div style={{ marginTop: 6, padding: "8px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}><p style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.6, fontWeight: 600 }}>{item.warn}</p></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e8ecf4", marginBottom: 20, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f8fafc" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={13} color="white" strokeWidth={3} /></div>
            <div style={{ fontWeight: 700, color: "#475569", fontSize: 13, flex: 1 }}>Rental contract copy (Mietvertrag)</div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#0075FF", background: "#eff6ff", padding: "2px 8px", borderRadius: 999 }}>RECOMMENDED</span>
          </div>
          <div style={{ padding: "10px 16px" }}>
            <p style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.6 }}>Not mandatory but useful if the clerk has questions. A copy is fine — no original needed.</p>
          </div>
        </div>

        {/* Print tip */}
        <div style={{ background: "#0f172a", borderRadius: 14, padding: "16px 18px", marginBottom: 20, display: "flex", gap: 12 }}>
          <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 900, color: "white", fontSize: 13.5, marginBottom: 3 }}>Print on paper — Germany requires it.</div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, lineHeight: 1.5 }}>DM or Rossmann self-service kiosks: ~€0.10 per page. Bürgeramt will not accept digital forms.</p>
          </div>
        </div>

        {/* ── 6. REFERRAL ── */}
        <div style={{ borderRadius: 20, overflow: "hidden", border: "1.5px solid #e8ecf4", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", padding: "22px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>🗡️</div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.25 }}>Saved your life?<br/>Send this to another expat.</h3>
            <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: "0 auto 16px" }}>Every expat in Berlin needs this. One link saves them hours.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/?text=Just%20used%20this%20to%20fill%20my%20Berlin%20Anmeldung%20in%20English%20in%203%20minutes%20%E2%80%94%20perfectly%20in%20German%2C%20no%20data%20stored%3A%20https%3A%2F%2Fsimplyexpat.de" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 11, background: "#25D366", color: "white", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>Share on WhatsApp</a>
              <button onClick={() => { navigator.clipboard.writeText("https://simplyexpat.de").then(() => { const btn = document.getElementById("copy-link-btn"); if (btn) { btn.textContent = "✓ Copied!"; setTimeout(() => { btn.textContent = "Copy link"; }, 2000); } }); }} id="copy-link-btn"
                style={{ padding: "11px 18px", borderRadius: 11, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Copy link</button>
            </div>
          </div>
          <div style={{ background: "#f8fafc", padding: "11px 20px", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 12 }}>No referral scheme. No commission. Just one expat helping another.</p>
          </div>
        </div>

        {/* ── 7. WIPE ── */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button onClick={() => { setShowWipe(true); setWipeChecked(false); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RotateCcw size={13} /> Clear data &amp; start over
          </button>
        </div>


        {/* ── Wipe confirmation popup ── */}
        {showWipe && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.7)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
            <div style={{ maxWidth: 420, width: "100%", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
              {/* Header */}
              <div style={{ background: "#fef2f2", padding: "22px 24px 18px", borderBottom: "1px solid #fecaca" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: "#111111", letterSpacing: "-0.02em", marginBottom: 6 }}>
                  Clear all data &amp; start over
                </h3>
                <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6 }}>
                  This will permanently delete all your data from this browser.
                </p>
              </div>
              {/* Warning items */}
              <div style={{ padding: "18px 24px" }}>
                {[
                  { icon: "🗑", text: "Your filled Anmeldung form will be deleted from your browser" },
                  { icon: "📄", text: "Make sure you have already downloaded your PDFs — they cannot be recovered" },
                  { icon: "💳", text: "Your purchase cannot be restored — we do not store it on any server" },
                  { icon: "🔁", text: "You will need to pay again if you want new documents" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}

                {/* Checkbox confirmation */}
                <div
                  onClick={() => setWipeChecked(c => !c)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 11, background: wipeChecked ? "#f0fdf4" : "#f8fafc", border: `1.5px solid ${wipeChecked ? "#86efac" : "#e8ecf4"}`, cursor: "pointer", marginTop: 16, transition: "all 0.15s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${wipeChecked ? "#16a34a" : "#cbd5e1"}`, background: wipeChecked ? "#16a34a" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
                    {wipeChecked && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, fontWeight: 600 }}>
                    I have downloaded my documents and understand that my purchase cannot be recovered.
                  </span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ padding: "0 24px 22px", display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowWipe(false)}
                  style={{ flex: 1, padding: "12px", borderRadius: 11, border: "1.5px solid #e8ecf4", background: "white", color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button
                  onClick={() => { if (wipeChecked) onRestart(); }}
                  disabled={!wipeChecked}
                  style={{ flex: 1, padding: "12px", borderRadius: 11, border: "none", background: wipeChecked ? "#dc2626" : "#e2e8f0", color: wipeChecked ? "white" : "#94a3b8", fontWeight: 800, fontSize: 13.5, cursor: wipeChecked ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
                  Delete everything
                </button>
              </div>
            </div>
          </div>
        )}

        </div> {/* end done-main */}
      </div> {/* end done-layout */}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  LEGAL MODAL SHELL — reusable wrapper
// ═══════════════════════════════════════════════════════════════════
function LegalModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", backdropFilter: "blur(6px)", zIndex: 500, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: 680, width: "100%", background: "white", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "white", zIndex: 10 }}>
          <div style={{ fontWeight: 800, color: "#111111", fontSize: 16, letterSpacing: "-0.01em" }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid #e8ecf4", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "inherit", color: "#64748b", fontSize: 16, fontWeight: 700 }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: "28px", color: "#374151", fontSize: 13.5, lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Legal typography helpers ──────────────────────────────────────
const LH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 14, fontWeight: 800, color: "#111111", marginTop: 24, marginBottom: 8, letterSpacing: "-0.01em" }}>{children}</h2>
);
const LP = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: 12, lineHeight: 1.75 }}>{children}</p>
);
const LUL = ({ items }: { items: string[] }) => (
  <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
    {items.map((item, i) => <li key={i} style={{ marginBottom: 5 }}>{item}</li>)}
  </ul>
);
const LHighlight = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "12px 16px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 16 }}>
    <p style={{ color: "#1e40af", fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>{children}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  TERMS OF SERVICE
//  Legal basis: §312i BGB (e-commerce), TDG/TTDSG, EU DSA Art.13
//  Key framing: Ausfüllhilfe (filing aid) NOT legal advice (§2 RDG)
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
//  IMPRESSUM (§5 TMG — required for German commercial websites)
// ═══════════════════════════════════════════════════════════════════
export function Impressum({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Impressum" onClose={onClose}>
      <LH2>Angaben gemäß §5 TMG</LH2>
      <LP>
        Karl Fasselt<br/>
        Fürbringerstraße 25<br/>
        10961 Berlin<br/>
        Germany
      </LP>

      <LH2>Kontakt</LH2>
      <LP>E-Mail: info@simplyexpat.de</LP>

      <LH2>Verantwortlich für den Inhalt nach §18 Abs. 2 MStV</LH2>
      <LP>
        Karl Fasselt<br/>
        Fürbringerstraße 25<br/>
        10961 Berlin
      </LP>

      <LH2>Haftungsausschluss</LH2>
      <LP>SimplyExpat ist ein technisches Hilfsmittel (Ausfüllhilfe) gemäß §2 RDG und stellt keine Rechtsberatung dar. Die generierten Dokumente ersetzen keine rechtliche Beratung. Die Richtigkeit der eingegebenen Daten liegt in der alleinigen Verantwortung des Nutzers.</LP>

      <LH2>Streitschlichtung</LH2>
      <LP>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <strong>ec.europa.eu/consumers/odr</strong>. Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</LP>
    </LegalModal>
  );
}

export function TermsOfService({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Terms of Service — SimplyExpat" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · SimplyExpat GmbH (in formation), Berlin, Germany</p>

      <LHighlight>
        SimplyExpat is a <strong>Technical Filing Aid (Ausfüllhilfe)</strong>. We are a software service, not a law firm, legal advisor, or governmental authority. Use of this service does not constitute legal advice and does not create a legal service relationship under §2 RDG (Rechtsdienstleistungsgesetz).
      </LHighlight>

      <LH2>1. Service Description</LH2>
      <LP>SimplyExpat provides a guided digital form-completion service that generates pre-filled PDF documents for the Berlin Anmeldung process (residential registration under §17 BMG). The service is strictly a technical tool. You remain solely responsible for the accuracy of the information you provide and for submitting completed documents to the relevant authority (Bürgeramt).</LP>

      <LH2>2. What We Do Not Do</LH2>
      <LUL items={[
        "We do not submit any registration on your behalf.",
        "We do not book Bürgeramt appointments. Appointment availability is managed exclusively by the Berlin city administration via service.berlin.de.",
        "We do not guarantee that your registration will be accepted by the Bürgeramt. Acceptance depends on your personal circumstances and the discretion of the authority.",
        "We do not provide legal, immigration, or tax advice.",
      ]} />

      <LH2>3. Eligibility</LH2>
      <LP>The service is available only for registrations at a <strong>Berlin address</strong>. By using SimplyExpat you confirm that your new primary address is located within the city boundaries of Berlin, Germany. Use for other cities or regions is not supported and may produce incorrect outputs.</LP>

      <LH2>4. Accuracy of Information</LH2>
      <LP>You warrant that all information you enter is truthful, accurate, and matches your official identity documents. Deliberately providing false information on an Anmeldung constitutes an administrative offence (Ordnungswidrigkeit) under German law. SimplyExpat bears no liability for errors arising from incorrect user inputs.</LP>

      <LH2>5. Payment and Delivery</LH2>
      <LP>The service fee is <strong>€15 (one-time, no subscription)</strong>. Payment is processed by Stripe via a secure hosted checkout page. SimplyExpat never handles your card details. Upon successful payment confirmation, you are redirected to a success page where PDF documents are generated instantly in your browser. Delivery is considered complete at the moment the PDF generation process finishes in your browser. No physical documents are sent.</LP>

      <LH2>6. Limitation of Liability</LH2>
      <LP>To the maximum extent permitted by applicable law, SimplyExpat's total liability to you for any claim arising from or relating to these Terms or the service shall not exceed the amount you paid for the service (€15). We are not liable for indirect, incidental, or consequential damages, including any administrative fees, fines, or costs arising from a rejected Anmeldung.</LP>

      <LH2>7. Governing Law</LH2>
      <LP>These Terms are governed by the laws of the Federal Republic of Germany. The exclusive place of jurisdiction for all disputes is Berlin, Germany, to the extent permitted by applicable consumer protection law.</LP>

      <LH2>8. Changes to Terms</LH2>
      <LP>We may update these Terms from time to time. Material changes will be communicated via the website. Continued use of the service after changes constitutes acceptance.</LP>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Contact: info@simplyexpat.de</p>
    </LegalModal>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CANCELLATION POLICY (Widerrufsbelehrung)
//  Legal basis: §356 BGB — right of withdrawal lapses for digital
//  content fully performed with consumer's prior express consent.
//  EU Consumer Rights Directive 2011/83/EU, Art. 16(m).
//  For 2026: confirmed unchanged post-Omnibus Directive (EU 2019/2161).
// ═══════════════════════════════════════════════════════════════════
export function CancellationPolicy({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Cancellation Policy (Widerrufsbelehrung)" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · SimplyExpat GmbH (in formation)</p>

      <LHighlight>
        <strong>Important notice:</strong> Because SimplyExpat is a digital service that is performed immediately upon your request, your statutory right of withdrawal expires as soon as the PDF generation is complete — provided you have expressly consented to this at checkout, as required by §356 para. 5 BGB and Article 16(m) of Directive 2011/83/EU.
      </LHighlight>

      <LH2>Right of Withdrawal</LH2>
      <LP>You have the right to withdraw from this contract within <strong>14 days</strong> without giving any reason (§355 BGB). The withdrawal period begins on the day the contract is concluded (i.e., the moment payment is confirmed).</LP>
      <LP>To exercise your right of withdrawal, you must inform us of your decision by an unequivocal statement (e.g., by email to info@simplyexpat.de) before the service has been fully performed.</LP>

      <LH2>Expiry of the Right of Withdrawal for Digital Services</LH2>
      <LP><strong>You expressly acknowledge and agree</strong> that SimplyExpat will begin performing the service (PDF generation) immediately after your payment is confirmed, and that the service is fully performed at the moment PDF generation completes. By requesting immediate performance and confirming this at the point of payment, <strong>you waive your right of withdrawal</strong> under §356 para. 5 BGB once the service has been fully performed.</LP>
      <LP>This waiver is legally valid under §356 para. 5 BGB and Article 16(m) of EU Directive 2011/83/EU, which exempts fully-performed digital content services from the right of withdrawal where the consumer has given prior express consent and acknowledged the loss of the withdrawal right.</LP>

      <LH2>Consequence of Withdrawal (Before Service Completion)</LH2>
      <LP>If you exercise your right of withdrawal before PDF generation has started, we will reimburse all payments received from you, without undue delay and no later than 14 days after the day on which we receive your withdrawal decision. We will use the same means of payment as you used for the initial transaction.</LP>

      <LH2>Withdrawal Form (Model)</LH2>
      <LP>If you wish to withdraw, you may use the following model form (not mandatory):</LP>
      <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e8ecf4", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7, marginBottom: 16 }}>
        To: SimplyExpat GmbH, info@simplyexpat.de<br/>
        I/We hereby give notice that I/we withdraw from my/our contract for the provision of the following service: SimplyExpat Anmeldung PDF Generation<br/>
        Ordered on: ___________<br/>
        Name: ___________<br/>
        Signature (if paper): ___________<br/>
        Date: ___________
      </div>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Contact: info@simplyexpat.de</p>
    </LegalModal>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PRIVACY POLICY
//  Legal basis: GDPR (EU 2016/679), TTDSG (Germany, as of 2024),
//  EDPB Guidelines 01/2020 on consent.
//  Special categories: Art. 9 GDPR — religious affiliation is
//  special-category data. Zero-storage = no Art. 9 processing
//  on our servers. Processing is entirely local (client-side).
// ═══════════════════════════════════════════════════════════════════
export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Privacy Policy — SimplyExpat" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · Last reviewed: April 2026 · Verantwortlicher: Karl Fasselt, Fürbringerstraße 25, 10961 Berlin</p>

      <LHighlight>
        <strong>In plain English:</strong> The form data you enter (address, passport details, family information) never leaves your device. It is stored only in your browser and deleted once your PDFs are generated. The only personal data that reaches our servers is: (1) your payment via Stripe, and (2) optionally your first name and email address if you choose to receive a post-purchase confirmation email with your next steps.
      </LHighlight>

      <LH2>1. Controller (Verantwortlicher)</LH2>
      <LP>Karl Fasselt, Fürbringerstraße 25, 10961 Berlin, Germany. E-Mail: info@simplyexpat.de. Operating under the brand name SimplyExpat (GmbH in formation).</LP>

      <LH2>2. What data we process and why</LH2>

      <LP><strong>a) Registration form data</strong> — names, dates of birth, addresses, passport numbers, citizenship, marital status, religious affiliation: Stored exclusively in your browser's localStorage on your own device under the key "simplyexpat-v1". SimplyExpat has no technical access to this data at any point. It is never transmitted to our servers. It is automatically deleted from your browser once document generation is complete. Legal basis: this is not a processing activity by SimplyExpat within the meaning of Art. 4 No. 2 GDPR, as the data never reaches our systems (see GDPR Recital 26).</LP>

      <LP><strong>b) PDF generation</strong>: Your completed Anmeldung form and personalised checklist are generated entirely in your browser using the open-source pdf-lib library. The PDF bytes exist only in browser memory and are downloaded directly to your device. They are never transmitted to SimplyExpat servers.</LP>

      <LP><strong>c) Payment processing</strong>: Your payment of €15 is handled exclusively by Stripe, Inc. (510 Townsend Street, San Francisco, CA 94103, USA), a PCI-DSS Level 1 certified payment processor. You are redirected to a Stripe-hosted payment page. SimplyExpat never receives or processes your card number, bank details, or any payment credentials. After your payment is completed, your browser transmits only your Stripe session ID to our server for the sole purpose of confirming payment status (paid / not paid). No personal form data is included in this request. Legal basis: Art. 6(1)(b) GDPR — performance of a contract. Stripe's Privacy Policy: stripe.com/privacy.</LP>

      <LP><strong>d) Post-purchase next-steps email (optional)</strong>: After your documents are generated, you may optionally provide your email address to receive a transactional confirmation email. This email contains your next steps: printing your form, booking your Bürgeramt appointment, and your document checklist. The only data transmitted to our server and forwarded to our email service provider Resend, Inc. for delivery is: your email address, your first name, and the number of forms generated. No form data, no passport information, no special-category data (Art. 9 GDPR) is included. This field is entirely optional — the service is fully functional without providing an email. Legal basis: Art. 6(1)(a) GDPR — your freely given, specific, informed, and unambiguous consent by voluntarily entering your email address. You may withdraw this consent at any time by contacting info@simplyexpat.de; withdrawal does not affect the lawfulness of processing prior to withdrawal. Resend, Inc. Privacy Policy: resend.com/privacy.</LP>

      <LP><strong>e) Cookie / localStorage consent flag</strong>: When you acknowledge the cookie notice, a flag ("simplyexpat-cookie-ack-v1") is stored in your browser's localStorage. This flag contains no personal data and is used solely to avoid showing the notice repeatedly. Legal basis: §25(2) No. 2 TTDSG — strictly necessary.</LP>

      <LH2>3. Special category data — Religious affiliation (Art. 9 GDPR)</LH2>
      <LP>Religious affiliation is special-category personal data under Art. 9(1) GDPR. The Anmeldung form includes an optional field for religious affiliation for tax purposes (Kirchensteuer). Because all form data is processed exclusively in your browser and never transmitted to SimplyExpat servers, SimplyExpat does not process this data within the meaning of Art. 4 No. 2 GDPR. You may leave this field blank or select "None" — this is a valid choice that results in no church tax obligation.</LP>

      <LH2>4. Cookies and browser storage (§25 TTDSG)</LH2>
      <LP>We use no marketing, tracking, or analytics cookies. We use no third-party advertising cookies. The only storage mechanisms are:</LP>
      <LUL items={[
        "localStorage 'simplyexpat-v1': Your registration form state. Stored on your device only. Deleted automatically upon document generation. Legal basis: §25(2) No. 2 TTDSG — strictly necessary for the service you explicitly requested.",
        "localStorage 'simplyexpat-cookie-ack-v1': Records that you have acknowledged the cookie notice. Contains no personal data. Legal basis: §25(2) No. 2 TTDSG.",
        "Stripe cookies: Set by Stripe on their hosted checkout page to enable secure payment processing. Governed by Stripe's cookie policy. Legal basis: §25(2) No. 2 TTDSG — strictly necessary for payment.",
      ]} />

      <LH2>5. Data processors (Auftragsverarbeiter)</LH2>
      <LP>We use the following data processors who process personal data on our behalf under Art. 28 GDPR:</LP>
      <LUL items={[
        "Stripe, Inc., 510 Townsend Street, San Francisco, CA 94103, USA — payment processing. Data processed: payment session ID for verification. Basis: Art. 28 GDPR + Standard Contractual Clauses (SCCs).",
        "Resend, Inc. — transactional email delivery. Data processed: email address and first name, only when you voluntarily provide your email. Basis: Art. 28 GDPR + Standard Contractual Clauses (SCCs). Only used if you opt in to the confirmation email.",
      ]} />

      <LH2>6. International data transfers (Art. 44–49 GDPR)</LH2>
      <LP>Stripe and Resend are US-based companies. Data transfers to the USA are carried out on the basis of Standard Contractual Clauses (SCCs) pursuant to Art. 46(2)(c) GDPR, as adopted by the European Commission. You may request a copy of the applicable SCCs by contacting info@simplyexpat.de.</LP>

      <LH2>7. Your rights (Art. 15–22 GDPR)</LH2>
      <LP>You have the following rights regarding your personal data: the right of access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and the right to object (Art. 21). Because SimplyExpat does not store your form data on our servers, most of these rights apply to data held by Stripe (for payment records) or Resend (for email delivery, if you opted in). To exercise any right, contact info@simplyexpat.de. We will respond within 30 days.</LP>
      <LP>If you provided your email address and wish to withdraw consent for email processing, contact info@simplyexpat.de and we will instruct Resend to delete any data associated with your email. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.</LP>
      <LP>You also have the right to lodge a complaint with a supervisory authority. The competent authority for SimplyExpat is: Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin, mailbox@datenschutz-berlin.de.</LP>

      <LH2>8. Data retention</LH2>
      <LP>SimplyExpat retains no personal data on its own systems. Browser localStorage data is deleted upon service completion. Stripe retains payment records for 7 years per §257 HGB (German Commercial Code). Resend retains email delivery data per their own retention policy; contact info@simplyexpat.de to request deletion.</LP>

      <LH2>9. Automated decision-making</LH2>
      <LP>SimplyExpat does not use automated decision-making or profiling within the meaning of Art. 22 GDPR.</LP>

      <LH2>10. Changes to this policy</LH2>
      <LP>We will notify you of material changes via the website at least 14 days before they take effect. The current version is always available at simplyexpat.de. The effective date is shown at the top of this document.</LP>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Datenschutzanfragen / GDPR enquiries: info@simplyexpat.de · Karl Fasselt, Fürbringerstraße 25, 10961 Berlin</p>
    </LegalModal>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  COOKIE BANNER
//  §25 TTDSG: essential cookies do not require opt-in consent.
//  Banner is informational only — "Understood" stores the ack.
// ═══════════════════════════════════════════════════════════════════
const COOKIE_KEY = "simplyexpat-cookie-ack-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(COOKIE_KEY, "1"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 400, background: "#111111", borderTop: "1px solid #1e293b", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.55 }}>
            <span style={{ color: "white", fontWeight: 600 }}>We do not store your information.</span>{" "}
            We use only essential cookies for secure payments and your registration progress — no tracking, no marketing, no third-party analytics.{" "}
            <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#0075FF", fontSize: 12.5, cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline" }}>
              Privacy Policy
            </button>
          </p>
        </div>
        <button onClick={dismiss}
          style={{ padding: "8px 20px", borderRadius: 8, background: "white", color: "#111111", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap" }}>
          Understood
        </button>
      </div>
    </>
  );
}
