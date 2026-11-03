// Personal action plan for the done page: not theory, but WHAT to do, WHEN,
// WHERE (with link), WHAT you need, and the steps — picked from the answers.
//
// Verified procedure facts (checked 2026-11-03):
// - EORI: only online via the Zoll-Portal since 1.10.2026, login with the ELSTER
//   certificate, free (IHK Halle, fimportal.de).
// - OSS/IOSS: registration only in the BZSt-Online-Portal (BOP); an existing
//   ELSTER certificate works as login; OSS return + payment by the end of the
//   month after the quarter, no grace period (service.bremen.de, Lexware).
// - UStVA: Kz 46/47 = services from EU businesses under §13b(1) (NetSuite box list).
// - €3/item customs on parcels ≤ €150 from 1.7.2026 (Council Reg. (EU) 2026/382).
// - §13b tax is also owed by Kleinunternehmer (§19 Abs. 1 S. 3 UStG).
import { L } from "./i18n";
import { needsGewerbe, type SteuerForm } from "./steuer-data";

export type Phase = "now" | "beforeSale" | "monthly" | "quarterly" | "yearly" | "when";
export type Action = {
  phase: Phase;
  title: string;
  why?: string;
  where?: { label: string; url?: string };
  need?: string[];
  steps: string[];
  cost?: string;
  copy?: string; // ready-to-send text (e.g. message to a supplier)
};

export const PHASES: { id: Phase; label: () => string }[] = [
  { id: "now",        label: () => L("This week", "Diese Woche") },
  { id: "beforeSale", label: () => L("Before your first sale", "Vor deinem ersten Verkauf") },
  { id: "monthly",    label: () => L("Every month", "Jeden Monat") },
  { id: "quarterly",  label: () => L("Every quarter", "Jedes Quartal") },
  { id: "yearly",     label: () => L("Once a year", "Einmal im Jahr") },
  { id: "when",       label: () => L("When this happens", "Wenn das passiert") },
];

const n = (s: string) => parseFloat((s || "").replace(/\./g, "").replace(",", ".")) || 0;
const eur = (v: number) => L(`€${Math.round(v).toLocaleString("de-DE")}`, `${Math.round(v).toLocaleString("de-DE")} €`);
const eur2 = (v: number) => L(`€${v.toFixed(2)}`, `${v.toFixed(2).replace(".", ",")} €`);

export function actionPlan(f: SteuerForm): Action[] {
  const a: Action[] = [];
  const ku = f.kleinunternehmer === true;
  const trade = needsGewerbe(f);
  const handel = trade && f.gewArt === "Handel";
  const ships = handel && (f.salesChannel === "online" || f.salesChannel === "dropship");
  const drop = f.salesChannel === "dropship";
  const imp = handel && f.supplierRegion === "nonEu";
  const euSup = handel && f.supplierRegion === "eu";
  const euSales = ships && f.salesRegion === "eu";
  const mp = f.shopType === "marketplace" || f.shopType === "both";
  const own = f.shopType === "own" || f.shopType === "both";
  const needsVatId = !ku || ships || f.clients === "abroad" || f.clients === "mixed";

  // ── This week ──────────────────────────────────────────────
  a.push({
    phase: "now",
    title: L("Open a separate account for the business", "Eigenes Konto fürs Geschäft eröffnen"),
    why: L("Not required, but your bookkeeping becomes: everything on this account = business.", "Keine Pflicht, aber deine Buchhaltung wird simpel: alles auf diesem Konto = Geschäft."),
    where: { label: L("Any bank — an ordinary current account is enough", "Jede Bank — ein normales Girokonto reicht") },
    need: [L("ID card or passport", "Ausweis oder Pass"), ...(trade ? [L("Copy of your Gewerbeanmeldung", "Kopie deiner Gewerbeanmeldung")] : [])],
    steps: [
      L("Open the account online (10 minutes).", "Konto online eröffnen (10 Minuten)."),
      L("Give only this IBAN on invoices, shops and marketplaces.", "Nur diese IBAN auf Rechnungen, im Shop und bei Marktplätzen angeben."),
      L("Pay business costs (ads, goods, software) only from this account.", "Geschäftskosten (Werbung, Ware, Software) nur von diesem Konto zahlen."),
    ],
  });

  if (f.goal === "fulltime") a.push({
    phase: "now",
    title: L("Tell your health insurer you're now self-employed", "Krankenkasse über die Selbständigkeit informieren"),
    why: L("Germany allows no gap in health insurance — and your contribution is now based on your profit.", "In Deutschland darf es keine Lücke geben — und dein Beitrag richtet sich jetzt nach deinem Gewinn."),
    where: { label: L("Your health insurer — app, online mailbox or phone", "Deine Krankenkasse — App, Online-Postfach oder Telefon") },
    need: [
      L(`Start date: ${f.activityStart || "—"}`, `Startdatum: ${f.activityStart ? f.activityStart.split("-").reverse().join(".") : "—"}`),
      L(`Expected profit next year: ${eur(n(f.profitY2))} (same figure as in your tax form)`, `Erwarteter Gewinn im Folgejahr: ${eur(n(f.profitY2))} (dieselbe Zahl wie im Steuerfragebogen)`),
      L("The date your job ends", "Das Datum, an dem dein Job endet"),
    ],
    steps: [
      L("Ask for the questionnaire for self-employed members (“Fragebogen für Selbständige”).", "Den Fragebogen für Selbständige anfordern („Einkommensfragebogen / Fragebogen für Selbständige“)."),
      L("Fill it in with the profit estimate above — the insurer sets a provisional contribution.", "Mit der Gewinnschätzung oben ausfüllen — die Kasse setzt einen vorläufigen Beitrag fest."),
      L("Set up the direct debit. Once your first tax assessment arrives, send it to the insurer — they correct the contribution.", "Lastschrift einrichten. Wenn dein erster Steuerbescheid kommt, schick ihn an die Kasse — sie korrigiert den Beitrag."),
    ],
  });

  if (needsVatId) a.push({
    phase: "now",
    title: L("Apply for your VAT ID (USt-IdNr.)", "USt-IdNr. beantragen"),
    why: ku
      ? L("Even as a Kleinunternehmer you need it, so that Meta, Google, Shopify & co. bill you as a business.", "Auch als Kleinunternehmer brauchst du sie, damit Meta, Google, Shopify & Co. dich als Unternehmen abrechnen.")
      : L("You need it for EU suppliers, ads platforms and EU business customers.", "Brauchst du für EU-Lieferanten, Werbeplattformen und Geschäftskunden in der EU."),
    where: { label: L("Bundeszentralamt für Steuern — online form", "Bundeszentralamt für Steuern — Online-Formular"), url: "https://www.bzst.de/DE/Unternehmen/Identifikationsnummern/Umsatzsteuer-Identifikationsnummer/umsatzsteuer-identifikationsnummer_node.html" },
    need: [L("Your Steuernummer (from the Finanzamt letter after this form)", "Deine Steuernummer (aus dem Brief vom Finanzamt nach diesem Fragebogen)"), L("Name of your Finanzamt", "Name deines Finanzamts")],
    steps: [
      L("Wait for the letter with your Steuernummer.", "Auf den Brief mit deiner Steuernummer warten."),
      L("Open the BZSt form, enter Steuernummer, Finanzamt, name and address, send.", "BZSt-Formular öffnen, Steuernummer, Finanzamt, Name und Adresse eintragen, absenden."),
      L("The number comes by post. Write it down — you need it in the next steps.", "Die Nummer kommt per Post. Notier sie dir — du brauchst sie in den nächsten Schritten."),
    ],
    cost: L("Free", "Kostenlos"),
  });

  if (imp && !drop) a.push({
    phase: "now",
    title: L("Apply for an EORI number (customs number)", "EORI-Nummer beantragen (Zollnummer)"),
    why: L("You import goods to yourself — without an EORI your parcels get stuck at customs.", "Du importierst Ware zu dir — ohne EORI bleiben deine Pakete beim Zoll hängen."),
    where: { label: "Zoll-Portal", url: "https://www.zoll-portal.de" },
    need: [L("Your ELSTER certificate file (.pfx) and password — the same as for ELSTER", "Deine ELSTER-Zertifikatsdatei (.pfx) und dein Passwort — dieselben wie für ELSTER")],
    steps: [
      L("Zoll-Portal → register as a business with your ELSTER certificate.", "Zoll-Portal → als Unternehmen mit deinem ELSTER-Zertifikat registrieren."),
      L("Choose the application “EORI-Nummer” and send it (only online since October 2026).", "Den Antrag „EORI-Nummer“ auswählen und absenden (seit Oktober 2026 nur noch online)."),
      L("The confirmation arrives in your Zoll-Portal mailbox. Give the number to your supplier and carrier.", "Die Bestätigung kommt ins Postfach im Zoll-Portal. Gib die Nummer deinem Lieferanten und Paketdienst."),
      L("If the portal says your certificate has no Steuernummer: call the customs information line (contact on zoll.de) — don't create a second ELSTER account blindly.", "Meldet das Portal, dass in deinem Zertifikat keine Steuernummer steckt: bei der Zentralen Auskunft des Zolls anrufen (Kontakt auf zoll.de) — nicht einfach ein zweites ELSTER-Konto anlegen."),
    ],
    cost: L("Free", "Kostenlos"),
  });

  // ── Before your first sale ─────────────────────────────────
  if (imp && drop) a.push({
    phase: "beforeSale",
    title: L("Check every supplier before you list a product", "Jeden Lieferanten prüfen, bevor du ein Produkt einstellst"),
    why: L("Towards your customers YOU are the seller. If the supplier can't answer these questions, the risk is yours.", "Gegenüber deinen Kunden bist DU der Verkäufer. Kann der Lieferant diese Fragen nicht beantworten, liegt das Risiko bei dir."),
    where: { label: L("Message to the supplier (AliExpress, CJ, Alibaba chat or email)", "Nachricht an den Lieferanten (AliExpress-, CJ-, Alibaba-Chat oder E-Mail)") },
    steps: [
      L("Send the message below and keep the answers (screenshot/PDF).", "Die Nachricht unten schicken und die Antworten aufheben (Screenshot/PDF)."),
      L("Only list the product if questions 1 and 2 are answered with “yes”.", "Produkt nur einstellen, wenn Frage 1 und 2 mit „ja“ beantwortet sind."),
      L("Put the EU responsible person (name, address, email) and the safety info into your listing.", "Die verantwortliche Person in der EU (Name, Adresse, E-Mail) und die Sicherheitsinfos in dein Angebot schreiben."),
    ],
    copy: "Hi, before I list your products in Germany:\n1. Do you ship DDP (duties and VAT paid) or from an EU warehouse?\n2. Who is your EU responsible person under the GPSR (name, address, email)?\n3. Please send the safety information / manual in German or English, and for electronics or toys the CE declaration of conformity.\n4. Is the packaging licensed in Germany? If yes, what is your LUCID registration number?\nThank you!",
  });

  if (imp && !drop) a.push({
    phase: "beforeSale",
    title: L("Put your name on the product (you are the importer)", "Deinen Namen aufs Produkt (du bist der Importeur)"),
    why: L("Whoever brings goods from outside the EU into the EU counts as importer under the product safety rules (GPSR).", "Wer Ware von außerhalb in die EU bringt, gilt bei der Produktsicherheit (GPSR) als Importeur."),
    steps: [
      L("Name, postal address and email of you AND the manufacturer on the product, the label or the packaging.", "Name, Postanschrift und E-Mail von dir UND vom Hersteller aufs Produkt, Etikett oder die Verpackung."),
      L("Ask the manufacturer for safety and care instructions; enclose them in German.", "Beim Hersteller Sicherheits- und Pflegehinweise anfordern; auf Deutsch beilegen."),
      L("Put the same information into every online listing.", "Dieselben Angaben in jedes Online-Angebot schreiben."),
    ],
  });

  if (imp) {
    const buy = 10, duty = 3, eust = (buy + duty) * 0.19;
    a.push({
      phase: "beforeSale",
      title: L("Calculate your price with customs and import VAT", "Preis mit Zoll und Einfuhrumsatzsteuer kalkulieren"),
      why: L("Since 1 July 2026 every item up to €150 from outside the EU pays €3 customs, plus 19 % import VAT on goods + shipping + customs.", "Seit 1. Juli 2026 zahlt jeder Artikel bis 150 € von außerhalb der EU 3 € Zoll, dazu 19 % Einfuhrumsatzsteuer auf Ware + Versand + Zoll."),
      steps: [
        L(`Example: item incl. shipping ${eur2(buy)} + customs ${eur2(duty)} + import VAT ${eur2(eust)} = ${eur2(buy + duty + eust)}.`,
          `Beispiel: Artikel inkl. Versand ${eur2(buy)} + Zoll ${eur2(duty)} + Einfuhrumsatzsteuer ${eur2(eust)} = ${eur2(buy + duty + eust)}.`),
        ku
          ? L(`As a Kleinunternehmer that ${eur2(buy + duty + eust)} is your real cost — you don't get the import VAT back. Your selling price is the final price, no VAT on top.`,
              `Als Kleinunternehmer sind ${eur2(buy + duty + eust)} deine echten Kosten — die Einfuhrumsatzsteuer bekommst du nicht zurück. Dein Verkaufspreis ist der Endpreis, keine Umsatzsteuer obendrauf.`)
          : L(`With regular VAT your cost is ${eur2(buy + duty)} — the ${eur2(eust)} comes back in your VAT return. Your shop price must include 19 % VAT: €29.99 final price = €25.20 for you.`,
              `Mit normaler Umsatzsteuer kostet dich der Artikel ${eur2(buy + duty)} — die ${eur2(eust)} holst du in der Voranmeldung zurück. Dein Shoppreis muss 19 % Umsatzsteuer enthalten: 29,99 € Endpreis = 25,20 € für dich.`),
        drop
          ? L("If the supplier ships DDP, these costs are usually in his price — ask for the total price per item “delivered, duties paid”.", "Liefert der Lieferant DDP, stecken diese Kosten meist schon in seinem Preis — frag nach dem Gesamtpreis pro Artikel „geliefert, verzollt“.")
          : L("Customs is charged by the carrier on delivery or billed to you — keep every customs notice (Einfuhrabgabenbescheid).", "Den Zoll zieht der Paketdienst bei Lieferung ein oder stellt ihn dir in Rechnung — jeden Zollbescheid (Einfuhrabgabenbescheid) aufheben."),
      ],
    });
  }

  if (imp && drop && !ku && own) a.push({
    phase: "beforeSale",
    title: L("Register for IOSS (own shop, parcels from outside the EU)", "Für IOSS registrieren (eigener Shop, Pakete von außerhalb der EU)"),
    why: L("Then you charge the VAT at your checkout, the parcel crosses the border without extra costs and your customer pays nothing at the door.", "Dann kassierst du die Umsatzsteuer an deiner Kasse, das Paket kommt ohne Zusatzkosten über die Grenze und dein Kunde zahlt nichts an der Haustür."),
    where: { label: L("BZSt-Online-Portal (BOP)", "BZSt-Online-Portal (BOP)"), url: "https://www.elster.de/bportal/start" },
    need: [L("ELSTER certificate (same login)", "ELSTER-Zertifikat (gleicher Login)"), L("Steuernummer and USt-IdNr.", "Steuernummer und USt-IdNr.")],
    steps: [
      L("Log in to the BOP with your ELSTER certificate → form “Registrierung IOSS”.", "Im BOP mit deinem ELSTER-Zertifikat einloggen → Formular „Registrierung IOSS“."),
      L("Allow about 10 working days. You get an IOSS number (starts with IM276…).", "Etwa 10 Werktage einplanen. Du bekommst eine IOSS-Nummer (beginnt mit IM276…)."),
      L("Give the IOSS number to your supplier — it goes on the customs papers of every parcel.", "Die IOSS-Nummer dem Lieferanten geben — sie kommt auf die Zollpapiere jedes Pakets."),
      L("In your shop (e.g. Shopify → Settings → Taxes and duties) switch on: charge VAT at checkout for EU orders up to €150.", "Im Shop (z. B. Shopify → Einstellungen → Steuern und Zölle) einschalten: Umsatzsteuer an der Kasse für EU-Bestellungen bis 150 €."),
    ],
    cost: L("Free", "Kostenlos"),
  });

  if (imp && drop && (ku || !own)) a.push({
    phase: "beforeSale",
    title: mp && !own
      ? L("Marketplace: let it handle the import VAT", "Marktplatz: Einfuhrumsatzsteuer übernimmt er")
      : L("Only order DDP or from an EU warehouse", "Nur verzollt (DDP) oder aus EU-Lager bestellen"),
    why: mp && !own
      ? L("Amazon, eBay or Etsy collect the VAT on parcels up to €150 from outside the EU themselves.", "Amazon, eBay oder Etsy kassieren bei Paketen bis 150 € von außerhalb der EU die Umsatzsteuer selbst.")
      : L("As a Kleinunternehmer IOSS doesn't fit you. Without DDP your customer pays at the door — and often refuses the parcel.", "Als Kleinunternehmer passt IOSS nicht für dich. Ohne DDP zahlt dein Kunde an der Haustür — und verweigert oft die Annahme."),
    steps: mp && !own
      ? [L("Nothing to register. Check in your seller account under tax reports that VAT is shown as “collected by the marketplace”.", "Nichts anzumelden. Prüf im Verkäuferkonto unter Steuerberichten, dass die Steuer als „vom Marktplatz abgeführt“ ausgewiesen ist."),
         L("For parcels above €150 the marketplace does NOT do it — avoid those products or ship them DDP.", "Bei Paketen über 150 € macht der Marktplatz das NICHT — solche Produkte meiden oder DDP verschicken.")]
      : [L("Filter suppliers for “EU warehouse” / “ships from EU” or ask for DDP.", "Lieferanten nach „EU warehouse“ / „ships from EU“ filtern oder nach DDP fragen."),
         L("Write in your shop: “Versand verzollt — keine Zusatzkosten bei Lieferung”.", "Im Shop schreiben: „Versand verzollt — keine Zusatzkosten bei Lieferung“.")],
  });

  if (ships) a.push({
    phase: "beforeSale",
    title: L("Register your packaging (LUCID)", "Verpackung registrieren (LUCID)"),
    why: L("Anyone who ships goods to consumers in Germany must register first — otherwise sales ban and fines. Marketplaces ask for the number.", "Wer Ware an Verbraucher in Deutschland verschickt, muss sich vorher registrieren — sonst Verkaufsverbot und Bußgeld. Marktplätze fragen nach der Nummer."),
    where: { label: "LUCID Verpackungsregister", url: "https://lucid.verpackungsregister.org" },
    need: [L("Steuernummer or USt-IdNr.", "Steuernummer oder USt-IdNr."), L("Rough estimate: how many kg of cardboard and plastic (film, padding) you ship per year", "Grobe Schätzung: wie viele kg Karton und Kunststoff (Folie, Polster) du pro Jahr verschickst")],
    steps: [
      L("Register in LUCID as “Hersteller” and confirm the email.", "In LUCID als „Hersteller“ registrieren und die E-Mail bestätigen."),
      L("Sign a contract with a dual system online (several offer small-shop packages) with your kg estimate.", "Online einen Vertrag mit einem dualen System abschließen (mehrere bieten Pakete für kleine Shops) mit deiner kg-Schätzung."),
      L("Enter the system's name and the same kg in LUCID (“Datenmeldung”).", "Den Namen des Systems und dieselben kg in LUCID eintragen („Datenmeldung“)."),
      ...(mp ? [L("Put the LUCID number into your marketplace seller account.", "Die LUCID-Nummer im Verkäuferkonto des Marktplatzes eintragen.")] : []),
      ...(drop ? [L("Dropshipping: if your supplier confirms in writing that he licenses the packaging for Germany, keep that confirmation — otherwise you license it.", "Dropshipping: Bestätigt dein Lieferant schriftlich, dass er die Verpackung für Deutschland lizenziert, heb das auf — sonst lizenzierst du sie.")] : []),
    ],
    cost: L("Registration free; licence for small amounts usually a low two-digit amount per year", "Registrierung kostenlos; Lizenz für kleine Mengen meist niedriger zweistelliger Betrag im Jahr"),
  });

  if (ships || f.website) a.push({
    phase: "beforeSale",
    title: L("Legal texts in your shop", "Rechtstexte in deinen Shop"),
    where: { label: L("Your shop backend / marketplace seller account", "Dein Shop-Backend / Verkäuferkonto") },
    need: [L("Name, address, email, phone", "Name, Anschrift, E-Mail, Telefon"), ...(needsVatId ? [L("USt-IdNr. (once you have it)", "USt-IdNr. (sobald du sie hast)")] : [])],
    steps: [
      L("Impressum and privacy policy as their own pages, linked in the footer.", "Impressum und Datenschutzerklärung als eigene Seiten, im Footer verlinkt."),
      ...(ships ? [
        L("Terms (AGB), withdrawal notice (14 days) and shipping costs page.", "AGB, Widerrufsbelehrung (14 Tage) und Seite mit Versandkosten."),
        L("Order button text: “zahlungspflichtig bestellen”.", "Text auf dem Bestellbutton: „zahlungspflichtig bestellen“."),
        ku ? L("Under every price: “Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.”", "Unter jeden Preis: „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“")
           : L("Under every price: “inkl. 19 % MwSt., zzgl. Versand”.", "Unter jeden Preis: „inkl. 19 % MwSt., zzgl. Versand“."),
      ] : []),
      L("Use a legal-text service that updates the texts automatically when laws change — copying another shop's texts is a common reason for warning letters.", "Einen Rechtstexte-Dienst nutzen, der die Texte bei Gesetzesänderungen automatisch aktualisiert — Texte von anderen Shops kopieren ist ein häufiger Abmahngrund."),
    ],
  });

  if (trade && (handel || f.website)) a.push({
    phase: "beforeSale",
    title: L("Enter your VAT ID with Meta, Google, Shopify & co.", "USt-IdNr. bei Meta, Google, Shopify & Co. hinterlegen"),
    why: L("They bill from Ireland. With your VAT ID they invoice without VAT and you declare it yourself (reverse charge).", "Sie rechnen aus Irland ab. Mit deiner USt-IdNr. stellen sie ohne Umsatzsteuer in Rechnung und du meldest sie selbst (Reverse Charge)."),
    where: { label: L("Billing / tax settings of each platform", "Abrechnungs- bzw. Steuereinstellungen jeder Plattform") },
    steps: [
      L("Meta Business: billing → business info → VAT number. Google Ads: billing → settings → tax info. Shopify: settings → billing → tax ID. (Menu names change now and then.)", "Meta Business: Abrechnung → Unternehmensinfos → USt-IdNr. Google Ads: Abrechnung → Einstellungen → Steuerinformationen. Shopify: Einstellungen → Abrechnung → Steuer-ID. (Menünamen ändern sich ab und zu.)"),
      L("Download every monthly invoice into one folder “Ausland”.", "Jede Monatsrechnung in einen Ordner „Ausland“ herunterladen."),
      ku ? L(`Plan ad budgets with +19 %: €500 ads = ${eur(595)} real cost.`, `Werbebudget mit +19 % planen: 500 € Werbung = ${eur(595)} echte Kosten.`)
         : L("The VAT nets out to €0 in your VAT return — see “Every month”.", "Die Umsatzsteuer gleicht sich in der Voranmeldung auf 0 € aus — siehe „Jeden Monat“."),
    ],
  });

  if (/shirt|textil|bekleidung|kleidung|mode|hoodie|merch/i.test(`${f.gewActivity} ${f.activityDesc}`)) a.push({
    phase: "beforeSale",
    title: L("Check the labels on your shirts", "Etiketten deiner Shirts prüfen"),
    why: L("Every piece of clothing sold in the EU needs a fibre label (EU Regulation 1007/2011) — missing labels are a classic reason for warning letters.", "Jedes in der EU verkaufte Kleidungsstück braucht ein Etikett mit der Faserzusammensetzung (EU-Verordnung 1007/2011) — fehlende Etiketten sind ein klassischer Abmahngrund."),
    steps: [
      L("Buying blanks (e.g. from a textile wholesaler): check that every shirt has a sewn-in label like “100 % Baumwolle”. Keep the wholesaler's product sheet.", "Rohlinge kaufen (z. B. beim Textilgroßhändler): prüfen, dass jedes Shirt ein eingenähtes Etikett wie „100 % Baumwolle“ hat. Das Produktdatenblatt des Händlers aufheben."),
      L("Cutting out the label or sewing your own: your new label must show the fibre composition in German.", "Etikett rausschneiden oder selbst nähen: Dein neues Etikett muss die Faserzusammensetzung auf Deutsch zeigen."),
      L("Write the same fibre composition into every listing.", "Dieselbe Faserangabe in jedes Angebot schreiben."),
      L("Only print your own designs. Logos, band names, film or game characters need a licence from the rights holder.", "Nur eigene Motive drucken. Logos, Bandnamen, Film- oder Spielfiguren brauchen eine Lizenz vom Rechteinhaber."),
    ],
  });

  if (euSup) a.push({
    phase: "beforeSale",
    title: ku ? L("Order from EU suppliers WITHOUT your VAT ID", "Bei EU-Lieferanten OHNE USt-IdNr. bestellen")
              : L("Order from EU suppliers WITH your VAT ID", "Bei EU-Lieferanten MIT USt-IdNr. bestellen"),
    steps: ku ? [
      L("Leave the VAT ID field empty in the supplier's customer account (delete it if the shop saved it).", "Im Kundenkonto des Lieferanten das Feld USt-IdNr. leer lassen (löschen, falls der Shop sie gespeichert hat)."),
      L("Then the supplier charges his own VAT (e.g. 23 % Poland) — that's simply part of your purchase price, nothing to report.", "Dann berechnet er seine eigene Umsatzsteuer (z. B. 23 % Polen) — das ist einfach Teil deines Einkaufspreises, nichts zu melden."),
      L("Add up EU purchases; at €12,500 a year this stops working — see “When this happens”.", "EU-Einkäufe zusammenzählen; ab 12.500 € im Jahr funktioniert das nicht mehr — siehe „Wenn das passiert“."),
    ] : [
      L("Enter your VAT ID in the supplier's customer account.", "Deine USt-IdNr. im Kundenkonto des Lieferanten eintragen."),
      L("Check every invoice: no VAT, both VAT IDs on it, note “steuerfreie innergemeinschaftliche Lieferung”. If foreign VAT is on it, ask for a corrected invoice — you can't reclaim foreign VAT via ELSTER.", "Jede Rechnung prüfen: keine Umsatzsteuer, beide USt-IdNrn. drauf, Vermerk „steuerfreie innergemeinschaftliche Lieferung“. Steht ausländische Steuer drauf, Korrektur verlangen — die bekommst du über ELSTER nicht zurück."),
    ],
  });

  // ── Every month ────────────────────────────────────────────
  if (ku && trade && (handel || f.website)) a.push({
    phase: "monthly",
    title: L("VAT return — only in months with foreign invoices", "Umsatzsteuer-Voranmeldung — nur in Monaten mit Auslandsrechnungen"),
    why: L("Kleinunternehmer too must pay the 19 % on Meta/Google/Shopify invoices from abroad (§ 13b UStG).", "Auch Kleinunternehmer zahlen die 19 % auf Meta-/Google-/Shopify-Rechnungen aus dem Ausland (§ 13b UStG)."),
    where: { label: L("Mein ELSTER → Forms → VAT → Umsatzsteuer-Voranmeldung", "Mein ELSTER → Formulare & Leistungen → Umsatzsteuer → Umsatzsteuer-Voranmeldung"), url: "https://www.elster.de" },
    need: [L("All invoices of the month from your folder “Ausland”", "Alle Rechnungen des Monats aus deinem Ordner „Ausland“")],
    steps: [
      L("Add up the net amounts of the month's invoices from EU companies (Meta, Google, Shopify Ireland).", "Die Nettobeträge der Monatsrechnungen von EU-Firmen (Meta, Google, Shopify Irland) zusammenzählen."),
      L("Enter the sum in Kennzahl 46 — ELSTER calculates the 19 % in Kennzahl 47.", "Die Summe in Kennzahl 46 eintragen — ELSTER rechnet die 19 % in Kennzahl 47 aus."),
      L("Send by the 10th of the next month and transfer the amount to your Finanzamt (IBAN on its letters, reference: Steuernummer + “USt 11/2026”).", "Bis zum 10. des Folgemonats absenden und den Betrag ans Finanzamt überweisen (IBAN auf seinen Briefen, Verwendungszweck: Steuernummer + „USt 11/2026“)."),
      L("No foreign invoices that month = nothing to do.", "Keine Auslandsrechnung im Monat = nichts zu tun."),
    ],
  });

  if (!ku) a.push({
    phase: "monthly",
    title: L("VAT return (Umsatzsteuer-Voranmeldung)", "Umsatzsteuer-Voranmeldung"),
    why: L("Monthly or quarterly — the Finanzamt tells you in its letter. Due by the 10th of the following month.", "Monatlich oder vierteljährlich — das steht im Brief vom Finanzamt. Fällig bis zum 10. des Folgemonats."),
    where: { label: L("Mein ELSTER → Forms → VAT → Umsatzsteuer-Voranmeldung", "Mein ELSTER → Formulare & Leistungen → Umsatzsteuer → Umsatzsteuer-Voranmeldung"), url: "https://www.elster.de" },
    need: [L("Your sales and purchase invoices of the month", "Deine Ausgangs- und Eingangsrechnungen des Monats")],
    steps: [
      L("Net sales at 19 % → Kennzahl 81. VAT on your purchase invoices → Kennzahl 66.", "Netto-Umsätze zu 19 % → Kennzahl 81. Umsatzsteuer aus deinen Eingangsrechnungen → Kennzahl 66."),
      ...(trade && (handel || f.website) ? [L("Meta/Google/Shopify (EU): net sum → Kennzahl 46; the same tax again as input VAT → Kennzahl 67. Nets to €0.", "Meta/Google/Shopify (EU): Nettosumme → Kennzahl 46; dieselbe Steuer nochmal als Vorsteuer → Kennzahl 67. Ergibt 0 €.")] : []),
      ...(imp ? [L("Import VAT from customs notices → Kennzahl 62.", "Einfuhrumsatzsteuer aus Zollbescheiden → Kennzahl 62.")] : []),
      ...(imp && drop && own ? [L("Sales that run through IOSS do NOT go here — they only go into the IOSS return.", "Verkäufe, die über IOSS laufen, kommen NICHT hierher — die stehen nur in der IOSS-Meldung.")] : []),
      ...(euSup ? [L("Goods bought VAT-free from EU suppliers: net → Kennzahl 89; the tax again as input VAT → Kennzahl 61.", "Steuerfrei eingekaufte Ware von EU-Lieferanten: netto → Kennzahl 89; die Steuer nochmal als Vorsteuer → Kennzahl 61.")] : []),
      L("Send, then pay the result to the Finanzamt by the 10th — or get the refund.", "Absenden, dann das Ergebnis bis zum 10. ans Finanzamt zahlen — oder die Erstattung bekommen."),
      L("ELSTER shows the text next to every Kennzahl — if unsure, read the line text, not just the number.", "ELSTER zeigt neben jeder Kennzahl den Text — im Zweifel die Zeile lesen, nicht nur die Nummer."),
    ],
  });

  if (imp && drop && !ku && own) a.push({
    phase: "monthly",
    title: L("IOSS return", "IOSS-Meldung"),
    where: { label: "BZSt-Online-Portal (BOP)", url: "https://www.elster.de/bportal/start" },
    steps: [
      L("Export the month's EU sales up to €150 per country from your shop.", "Die EU-Verkäufe des Monats bis 150 € pro Land aus dem Shop exportieren."),
      L("Enter them per country in the BOP and pay — by the end of the following month.", "Pro Land im BOP eintragen und zahlen — bis Ende des Folgemonats."),
    ],
  });

  if (euSales) a.push({
    phase: "monthly",
    title: L("Count your sales to other EU countries", "Verkäufe ins EU-Ausland mitzählen"),
    why: L("At €10,000 a year in total (all EU countries together) the rules change — see “When this happens”.", "Bei 10.000 € im Jahr (alle EU-Länder zusammen) ändern sich die Regeln — siehe „Wenn das passiert“."),
    steps: [
      L("Once a month: shop report “sales by country” (Shopify: Analytics → Reports), add up everything outside Germany.", "Einmal im Monat: Shop-Bericht „Umsatz nach Land“ (Shopify: Analysen → Berichte), alles außerhalb Deutschlands zusammenzählen."),
      L("Write the running total in a simple list.", "Die laufende Summe in eine einfache Liste schreiben."),
    ],
  });

  // ── Every quarter ──────────────────────────────────────────
  a.push({
    phase: "quarterly",
    title: L("Advance tax payments", "Steuer-Vorauszahlungen"),
    why: L("Only if the Finanzamt sets them (with small profits it often doesn't). Due on 10 March, June, September and December — the amounts are on your Vorauszahlungsbescheid.", "Nur wenn das Finanzamt welche festsetzt (bei kleinen Gewinnen oft nicht). Fällig am 10. März, Juni, September und Dezember — die Beträge stehen in deinem Vorauszahlungsbescheid."),
    where: { label: L("Your Finanzamt — SEPA direct debit form on its website", "Dein Finanzamt — SEPA-Lastschriftmandat auf seiner Website") },
    steps: [
      L("As soon as the first notice arrives: send the Finanzamt a SEPA direct debit mandate for your business account.", "Sobald der erste Bescheid kommt: dem Finanzamt ein SEPA-Lastschriftmandat für dein Geschäftskonto schicken."),
      L("Then you can never miss a date. Keep enough money on the account in those months.", "Dann verpasst du nie einen Termin. In diesen Monaten genug Geld auf dem Konto lassen."),
    ],
  });

  if (euSales && !ku) a.push({
    phase: "quarterly",
    title: L("OSS return (once you're registered)", "OSS-Meldung (sobald du registriert bist)"),
    where: { label: "BZSt-Online-Portal (BOP)", url: "https://www.elster.de/bportal/start" },
    steps: [
      L("Per EU country: net sales to private customers and the VAT at that country's rate.", "Pro EU-Land: Netto-Umsätze an Privatkunden und die Steuer zum Satz dieses Landes."),
      L("Send AND pay by 30 April, 31 July, 31 October, 31 January — no grace period.", "Absenden UND zahlen bis 30. April, 31. Juli, 31. Oktober, 31. Januar — keine Schonfrist."),
      L("These sales then don't go into your normal VAT return.", "Diese Umsätze kommen dann nicht in deine normale Voranmeldung."),
    ],
  });

  // ── Once a year ────────────────────────────────────────────
  a.push({
    phase: "yearly",
    title: L("Annual tax returns — by 31 July", "Jahreserklärungen — bis 31. Juli"),
    where: { label: "Mein ELSTER", url: "https://www.elster.de" },
    need: [L("All invoices and receipts of the year, bank statements of the business account", "Alle Rechnungen und Belege des Jahres, Kontoauszüge des Geschäftskontos")],
    steps: [
      L(`Income tax return with Anlage EÜR and ${trade ? "Anlage G" : "Anlage S"}.`, `Einkommensteuererklärung mit Anlage EÜR und ${trade ? "Anlage G" : "Anlage S"}.`),
      ...(!ku ? [L("Annual VAT return (Umsatzsteuererklärung).", "Umsatzsteuer-Jahreserklärung.")] : []),
      ...(trade ? [L("Trade tax return only if your trade profit is above €24,500.", "Gewerbesteuererklärung nur, wenn dein Gewerbegewinn über 24.500 € liegt.")] : []),
      ...(ships ? [L("Packaging: report the actual kg to your dual system and in LUCID.", "Verpackung: die tatsächlichen kg an dein duales System und in LUCID melden.")] : []),
      L("With a tax adviser the deadline moves to the end of February of the year after next.", "Mit Steuerberater verschiebt sich die Frist auf Ende Februar des übernächsten Jahres."),
    ],
  });

  // ── When this happens ──────────────────────────────────────
  if (euSales) a.push({
    phase: "when",
    title: L("Your EU sales approach €10,000 a year", "Deine EU-Auslandsverkäufe nähern sich 10.000 € im Jahr"),
    steps: ku ? [
      L("Stop and get advice before you cross the line — the German Kleinunternehmer scheme doesn't cover foreign VAT.", "Anhalten und beraten lassen, bevor du die Grenze überschreitest — die deutsche Kleinunternehmerregelung deckt ausländische Umsatzsteuer nicht ab."),
      L("Simple alternative: switch your shop to “Germany only” for the rest of the year.", "Einfache Alternative: den Shop für den Rest des Jahres auf „nur Deutschland“ stellen."),
    ] : [
      L("Register for OSS in the BOP (form “Anzeige über die Teilnahme am OSS-Verfahren”) — allow about 10 working days.", "Im BOP für OSS registrieren (Formular „Anzeige über die Teilnahme am OSS-Verfahren“) — etwa 10 Werktage einplanen."),
      L("From the sale that crosses €10,000: charge the customer country's VAT (e.g. 20 % Austria, 21 % Netherlands) — set country tax rates in your shop.", "Ab dem Verkauf, mit dem du 10.000 € überschreitest: Steuer des Kundenlandes berechnen (z. B. 20 % Österreich, 21 % Niederlande) — Ländersteuersätze im Shop einstellen."),
    ],
  });

  if (ku) {
    const r2 = n(f.revenueY2);
    a.push({
      phase: "when",
      title: L("Your revenue passes €25,000", "Dein Umsatz übersteigt 25.000 €"),
      why: r2 ? L(`Your estimate for next year: ${eur(r2)}.`, `Deine Schätzung fürs Folgejahr: ${eur(r2)}.`) : undefined,
      steps: [
        L("Above €25,000 in one year: from 1 January of the next year you charge VAT normally.", "Über 25.000 € in einem Jahr: ab 1. Januar des Folgejahres berechnest du normal Umsatzsteuer."),
        L("Above €100,000 during the year: from the very sale that crosses it — change your prices immediately.", "Über 100.000 € im laufenden Jahr: ab genau dem Verkauf, der die Grenze überschreitet — Preise sofort umstellen."),
        L("Then: tell the Finanzamt, switch shop prices to “inkl. 19 % MwSt.”, start monthly VAT returns.", "Dann: Finanzamt informieren, Shoppreise auf „inkl. 19 % MwSt.“ umstellen, monatliche Voranmeldungen starten."),
      ],
    });
    if (euSup) a.push({
      phase: "when",
      title: L("Your EU purchases pass €12,500 a year", "Deine EU-Einkäufe übersteigen 12.500 € im Jahr"),
      steps: [
        L("From then on you order WITH your VAT ID and declare German VAT on these purchases in your VAT return (Kennzahl 89).", "Ab dann bestellst du MIT USt-IdNr. und meldest die deutsche Umsatzsteuer auf diese Einkäufe in der Voranmeldung (Kennzahl 89)."),
        L("As a Kleinunternehmer you can't deduct it — it's a cost.", "Als Kleinunternehmer kannst du sie nicht abziehen — sie ist Kosten."),
      ],
    });
  }

  if (trade) a.push({
    phase: "when",
    title: L("You sell new kinds of products or move", "Du verkaufst neue Produktarten oder ziehst um"),
    where: { label: L("Gewerbeamt of your city — same portal as the registration", "Gewerbeamt deiner Stadt — gleiches Portal wie die Anmeldung") },
    steps: [L("File a Gewerbe-Ummeldung (form GewA 2) — online in most cities, small fee.", "Gewerbe-Ummeldung (Formular GewA 2) einreichen — in den meisten Städten online, kleine Gebühr.")],
  });

  return a;
}
