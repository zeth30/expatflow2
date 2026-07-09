// app/freelance-steuer/steuer-pdf.ts
// Branded answer-sheet PDF for the Easy Fragebogen zur steuerlichen Erfassung.
// Drawn from scratch with pdf-lib (no AcroForm — the paper form is not a valid
// submission channel; this sheet mirrors the ELSTER online form field order).
// A4 = 595.28 x 841.89 pt. pdf-lib uses bottom-left origin.

import { buildAnswerRows, type SteuerForm } from "./steuer-data";

async function loadPdfLib(): Promise<any> {
  if ((window as any).PDFLib) return (window as any).PDFLib;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    // SRI pin: this script runs in the page holding tax ID/IBAN data, so a
    // compromised CDN must not be able to serve altered code (audit D1).
    s.integrity = "sha384-weMABwrltA6jWR8DDe9Jp5blk+tZQh7ugpCsF3JwSA53WZM9/14PjS5LAJNHNjAI";
    s.crossOrigin = "anonymous";
    s.onload = () => resolve((window as any).PDFLib);
    s.onerror = () => reject(new Error("Could not load PDF library"));
    document.head.appendChild(s);
  });
}

const fmtToday = (): string => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

// pdf-lib's standard fonts are WinAnsi-only. Replace non-encodable characters
// with "?" instead of deleting them, so a Cyrillic/Greek/Arabic name is
// visibly incomplete rather than silently vanishing (audit E6) — the
// on-screen sheet always shows the exact value.
const safe = (s: string): string =>
  (s || "")
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/≥/g, ">=")
    .replace(/→/g, "->")
    .replace(/[^\x00-\xFF]/g, "?");

// Truncate with visible ellipsis instead of a silent cut (audit E6).
const clip = (s: string, max: number): string =>
  s.length > max ? s.slice(0, max - 3) + "..." : s;

export async function buildSteuerPDF(form: SteuerForm): Promise<{ bytes: Uint8Array; name: string }> {
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const NAVY = rgb(0.06, 0.09, 0.16);
  const BLUE = rgb(0, 0.46, 1);
  const MUTED = rgb(0.39, 0.45, 0.55);
  const LINE = rgb(0.91, 0.93, 0.96);
  const PW = 595.28, PH = 841.89, ML = 48, CW = PW - ML * 2;

  const doc = await PDFDocument.create();
  doc.setTitle("ReadyExpat - Fragebogen zur steuerlichen Erfassung - Answer Sheet");
  const HB = await doc.embedFont(StandardFonts.HelveticaBold);
  const HR = await doc.embedFont(StandardFonts.Helvetica);
  const HO = await doc.embedFont(StandardFonts.HelveticaOblique);

  let page = doc.addPage([PW, PH]);
  let pageNo = 1;
  let y = PH - 100;

  const drawHeader = (pg: any, first: boolean) => {
    pg.drawRectangle({ x: 0, y: PH - (first ? 74 : 40), width: PW, height: first ? 74 : 40, color: NAVY });
    pg.drawText("ReadyExpat", { x: ML, y: PH - (first ? 34 : 26), size: 13, font: HB, color: rgb(1, 1, 1) });
    if (first) {
      pg.drawText("Fragebogen zur steuerlichen Erfassung - Your ELSTER answer sheet", { x: ML, y: PH - 54, size: 10.5, font: HR, color: rgb(0.75, 0.85, 1) });
      pg.drawText(fmtToday(), { x: PW - ML - 60, y: PH - 34, size: 9, font: HR, color: rgb(0.75, 0.85, 1) });
    }
  };
  const drawFooter = (pg: any, n: number) => {
    pg.drawText(
      safe("Not tax advice. You entered every value yourself; ReadyExpat translated and formatted your own answers (mechanical assistance, § 6 Nr. 3 StBerG)."),
      { x: ML, y: 34, size: 7, font: HO, color: MUTED, maxWidth: CW - 40 }
    );
    pg.drawText("Generated locally in your browser - readyexpat.de", { x: ML, y: 24, size: 7, font: HO, color: MUTED });
    pg.drawText(`Page ${n}`, { x: PW - ML - 30, y: 24, size: 8, font: HR, color: MUTED });
  };

  drawHeader(page, true);
  drawFooter(page, pageNo);

  const newPageIfNeeded = (needed: number) => {
    if (y - needed < 60) {
      page = doc.addPage([PW, PH]);
      pageNo += 1;
      drawHeader(page, false);
      drawFooter(page, pageNo);
      y = PH - 64;
    }
  };

  // Intro box
  page.drawRectangle({ x: ML, y: y - 61, width: CW, height: 71, color: rgb(0.94, 0.97, 1), borderColor: rgb(0.73, 0.9, 1), borderWidth: 1 });
  page.drawText(safe("How to use this sheet: open Mein ELSTER (elster.de) in one window and this sheet next to it."), { x: ML + 10, y: y - 6, size: 8.5, font: HB, color: NAVY });
  page.drawText(safe("The small numbers match the field numbers ELSTER shows next to each input. Work top to bottom -"), { x: ML + 10, y: y - 19, size: 8.5, font: HR, color: NAVY });
  page.drawText(safe("every value below is one of YOUR answers, formatted in German. Review each entry before submitting."), { x: ML + 10, y: y - 32, size: 8.5, font: HR, color: NAVY });
  page.drawText(safe("Field numbers verified against the 2026 form version (fseeun-202401). If ELSTER ever shows a"), { x: ML + 10, y: y - 45, size: 7.5, font: HO, color: MUTED });
  page.drawText(safe("different number, match by the German label printed next to it - the labels don't change."), { x: ML + 10, y: y - 55, size: 7.5, font: HO, color: MUTED });
  y -= 83;

  for (const section of buildAnswerRows(form)) {
    newPageIfNeeded(56);
    page.drawRectangle({ x: ML, y: y - 6, width: CW, height: 22, color: NAVY });
    page.drawText(safe(section.title), { x: ML + 8, y: y, size: 9.5, font: HB, color: rgb(1, 1, 1) });
    y -= 20;
    page.drawText(safe(section.titleEn), { x: ML + 8, y, size: 8, font: HO, color: MUTED });
    y -= 18;
    for (const row of section.rows) {
      newPageIfNeeded(34);
      page.drawText(safe(row.nr), { x: ML, y, size: 8, font: HB, color: BLUE });
      page.drawText(clip(safe(row.label), 62), { x: ML + 24, y, size: 8.5, font: HR, color: MUTED, maxWidth: 255 });
      page.drawText(clip(safe(row.de || "-"), 60), { x: ML + 288, y, size: 9.5, font: HB, color: NAVY, maxWidth: CW - 292 });
      if (row.enHint) {
        page.drawText(clip(safe(row.enHint), 110), { x: ML + 24, y: y - 11, size: 7, font: HO, color: MUTED, maxWidth: CW - 32 });
      }
      page.drawLine({ start: { x: ML, y: y - 17 }, end: { x: ML + CW, y: y - 17 }, thickness: 0.5, color: LINE });
      y -= 27;
    }
    y -= 12;
  }

  // Closing note
  newPageIfNeeded(80);
  page.drawText("Before you submit in ELSTER:", { x: ML, y, size: 9.5, font: HB, color: NAVY });
  y -= 15;
  for (const line of [
    "Review every value on the ELSTER summary screen - you are responsible for your entries.",
    "ELSTER shows a transmission protocol after submitting. Save it.",
    "The Finanzamt sends your Steuernummer by post after processing.",
  ]) {
    page.drawText(safe("-  " + line), { x: ML + 6, y, size: 8.5, font: HR, color: MUTED, maxWidth: CW - 12 });
    y -= 13;
  }

  const bytes = await doc.save();
  return { bytes, name: "readyexpat-steuer-answer-sheet.pdf" };
}
