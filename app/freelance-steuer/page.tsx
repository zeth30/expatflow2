"use client";
// ═══════════════════════════════════════════════════════════════════
//  EASY FRAGEBOGEN ZUR STEUERLICHEN ERFASSUNG · page.tsx
//  English copilot for the ELSTER tax registration questionnaire
//  (FsE EUn, solo freelancers). Staging route — not linked from nav.
//
//  Phases: landing → wizard → payment → generating → done
//  Data:   localStorage only (simplyexpat-steuer-v1) — never sent to server
//  Access: personal use only, password gate in proxy.ts (lib/preview.ts).
//          Tips may recommend — see header of steuer-data.ts before launching.
// ═══════════════════════════════════════════════════════════════════

import { actionPlan, PHASES } from "./steuer-actions";
import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Check, Copy as CopyIcon, Download, Shield,
  FileText, CheckCircle2, AlertCircle, RotateCcw, ExternalLink,
  Lock, CreditCard, Landmark, Clock, Mail,
} from "lucide-react";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";
import { CookieBanner } from "../components/LegalModals";
import {
  type SteuerForm, type FieldDef, EMPTY_STEUER, DEMO_STEUER, STORAGE_KEY, DONE_KEY,
  STEUER_STEPS, stepError, buildAnswerRows, fmtDateDE,
  needsGewerbe, afterRegistration,
} from "./steuer-data";
import { L, tr, hasTr, setLang as setModuleLang, LANG_KEY, type Lang } from "./i18n";
import { buildSteuerPDF } from "./steuer-pdf";
import { SteuerSimulator } from "./SteuerSimulator";
import { FieldInput as EngineFieldInput, TipBox } from "../components/form-engine/FieldInput";

const NAVY  = "#0f172a";
const BLUE  = "#0075FF";
const MUTED = "#64748b";

type AppPhase = "landing" | "wizard" | "payment" | "generating" | "done";

// ─── Copy button ──────────────────────────────────────────────────
function CopyValue({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); } catch {
          const ta = document.createElement("textarea");
          ta.value = value; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); document.body.removeChild(ta);
        }
        setOk(true); setTimeout(() => setOk(false), 1400);
      }}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: ok ? "#f0fdf4" : "white", color: ok ? "#16a34a" : BLUE, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
      {ok ? <Check size={12} /> : <CopyIcon size={12} />} {ok ? L("Copied", "Kopiert") : L("Copy", "Kopieren")}
    </button>
  );
}

// ─── Field renderer (shared form engine) ──────────────────────────
function FieldInput({ fd, form, setForm }: { fd: FieldDef; form: SteuerForm; setForm: (f: SteuerForm) => void }) {
  return <EngineFieldInput fd={fd} form={form} setForm={setForm} decisionHelp={L("Check ELSTER's official help for this field or ask a Steuerberater.", "Schau in die offizielle ELSTER-Hilfe zu diesem Feld oder frag einen Steuerberater.")} t={tr} />;
}

// ─── Language switch (EN / DE) ────────────────────────────────────
const LangCtx = React.createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = React.useContext(LangCtx);
  return (
    <div style={{ display: "inline-flex", borderRadius: 999, padding: 3, background: dark ? "rgba(255,255,255,0.1)" : "#f1f5f9", border: dark ? "1px solid rgba(255,255,255,0.25)" : "1px solid #e2e8f0" }}>
      {(["en", "de"] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: "5px 13px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 12,
          background: lang === l ? (dark ? "white" : NAVY) : "transparent",
          color: lang === l ? (dark ? NAVY : "white") : (dark ? "rgba(255,255,255,0.8)" : MUTED),
        }}>{l === "en" ? "English" : "Deutsch"}</button>
      ))}
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────
function SteuerLanding({ onStart }: { onStart: () => void }) {
  const [showSim, setShowSim] = useState(false);
  const FAQ = [
    { q: L("Can I fill in the Fragebogen zur steuerlichen Erfassung in English?", "Gibt es den Fragebogen zur steuerlichen Erfassung auf Englisch?"),
      a: L("The official ELSTER form exists only in German — there is no English version. That's exactly what this tool solves: you answer every question in plain English, and you get each German entry ready to copy into ELSTER, matched to ELSTER's own field numbers.",
           "Das offizielle ELSTER-Formular gibt es nur auf Deutsch, und auch auf Deutsch ist es schwer verständlich. Hier beantwortest du jede Frage in einfacher Sprache und bekommst jeden Eintrag fertig zum Kopieren, passend zu den Feldnummern in ELSTER.") },
    { q: L("What's the difference between Steuer-ID and Steuernummer?", "Was ist der Unterschied zwischen Steuer-ID und Steuernummer?"),
      a: L("The Steuer-ID (steuerliche Identifikationsnummer) is the 11-digit number every resident gets by post after their Anmeldung — it never changes. The Steuernummer is a separate number the Finanzamt assigns for your tax file; as a new freelancer you receive it AFTER submitting this Fragebogen. You need the Steuer-ID to fill the form, and you get the Steuernummer as the result.",
           "Die Steuer-ID (steuerliche Identifikationsnummer) ist die 11-stellige Nummer, die jeder nach der Anmeldung per Post bekommt — sie ändert sich nie. Die Steuernummer vergibt das Finanzamt für deine Steuerakte; als Gründer bekommst du sie NACH dem Absenden dieses Fragebogens. Die Steuer-ID brauchst du zum Ausfüllen, die Steuernummer ist das Ergebnis.") },
    { q: L("Am I a Freiberufler or do I have a Gewerbe?", "Bin ich Freiberufler oder habe ich ein Gewerbe?"),
      a: L("The Finanzamt decides, based on what you actually do. Liberal professions listed in the law (e.g. software development close to engineering, design as art, writing, teaching, translating) are freiberuflich. Trading, dropshipping, crafts and most general business, marketing, IT or AI consulting are usually Gewerbe. The wizard's first step helps you sort it out — and both at the same time is possible.",
           "Das entscheidet das Finanzamt nach deiner tatsächlichen Tätigkeit. Die im Gesetz genannten freien Berufe (z. B. ingenieurnahe Softwareentwicklung, künstlerisches Design, Schreiben, Unterrichten, Übersetzen) sind freiberuflich. Handel, Dropshipping, Handwerk und die meiste allgemeine Unternehmens-, Marketing-, IT- oder KI-Beratung sind meist ein Gewerbe. Der erste Schritt im Wizard hilft dir beim Einordnen — und beides gleichzeitig geht auch.") },
    { q: L("Is this tax advice?", "Ist das Steuerberatung?"),
      a: L("No. The tool explains what each field means and gives rules of thumb based on your answers. Every entry and every choice is yours. For a binding answer on your personal situation, ask a Steuerberater (tax adviser).",
           "Nein. Das Tool erklärt, was jedes Feld bedeutet, und gibt Faustregeln passend zu deinen Antworten. Jeder Eintrag und jede Entscheidung liegt bei dir. Für eine verbindliche Antwort zu deiner Situation frag einen Steuerberater.") },
    { q: L("Do I need an ELSTER account first?", "Brauche ich zuerst ein ELSTER-Konto?"),
      a: L("Yes. The form can only be submitted through your personal ELSTER account. The free guide on this page shows how to get one — plan for the activation letter, which arrives by post and typically takes a few days up to two weeks.",
           "Ja. Der Fragebogen geht nur über dein persönliches ELSTER-Konto. Die kostenlose Anleitung auf dieser Seite zeigt dir, wie du es bekommst — plane den Aktivierungsbrief ein, der per Post kommt und meist ein paar Tage bis zwei Wochen braucht.") },
    { q: L("What if my income estimates turn out wrong?", "Was, wenn meine Schätzungen nicht stimmen?"),
      a: L("Estimates are expected to be estimates. You can correct them later by writing to your Finanzamt, and your actual tax is always settled with your annual tax return — the estimates only affect advance payments.",
           "Schätzungen dürfen Schätzungen sein. Du kannst sie später mit einem kurzen Schreiben ans Finanzamt korrigieren, und abgerechnet wird sowieso mit der Steuererklärung — die Schätzungen bestimmen nur die Vorauszahlungen.") },
    { q: L("I'm employed AND starting on the side. Does this work for me?", "Ich bin angestellt und gründe nebenbei. Passt das für mich?"),
      a: L("Yes. The form has fields for both your business profit and your employment income — the wizard asks for both and gives tips for side businesses.",
           "Ja. Das Formular hat Felder für deinen Gewinn und für dein Gehalt — der Wizard fragt beides ab und gibt Tipps fürs Nebengewerbe.") },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Fragebogen zur steuerlichen Erfassung in English — the complete guide for freelancers in Germany",
        description: "What the German tax registration questionnaire is, the one-month deadline, how to get an ELSTER account as a new arrival, and how to fill every field in English.",
        dateModified: "2026-07-07",
        author: { "@type": "Organization", name: "ReadyExpat" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map(f => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const Card = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div style={{ background: "white", borderRadius: 14, border: "1px solid #e8ecf4", padding: "22px 20px", flex: "1 1 260px", minWidth: 240 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 800, color: NAVY, fontSize: 15, marginBottom: 6 }}>{title}</div>
      <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.65 }}>{children}</p>
    </div>
  );
  const startLabel = L("Start in English", "Jetzt starten");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SharedNav />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "72px 20px 88px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(0,117,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}><LangSwitch dark /></div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,117,255,0.18)", border: "1px solid rgba(96,165,250,0.4)", borderRadius: 999, padding: "5px 14px", marginBottom: 22 }}>
            <span style={{ color: "#93c5fd", fontSize: 11.5, fontWeight: 700 }}>{L("Gewerbe & freelance · A to Z · in English", "Gewerbe & Freiberuf · von A bis Z · verständlich erklärt")}</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px,5vw,44px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.12, marginBottom: 16 }}>
            {L(<>Start your business in Germany,<br /><span style={{ color: "#60a5fa" }}>in English.</span></>,
               <>Dein Business anmelden,<br /><span style={{ color: "#60a5fa" }}>ohne Behördenfrust.</span></>)}
          </h1>
          <p style={{ color: "rgba(191,219,254,0.85)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 28px" }}>
            {L(<>Freelancer or trader — every new business in Germany ends at the same form: the <strong style={{ color: "white" }}>Fragebogen zur steuerlichen Erfassung</strong>, in German, via ELSTER, within one month. Traders need the <strong style={{ color: "white" }}>Gewerbeanmeldung</strong> first. You answer in plain English, get tips for your situation, and receive every German entry for both forms, ready to copy.</>,
               <>Freiberufler oder Gewerbe — jede Gründung in Deutschland endet beim selben Formular: dem <strong style={{ color: "white" }}>Fragebogen zur steuerlichen Erfassung</strong> in ELSTER, innerhalb eines Monats. Mit Gewerbe kommt vorher die <strong style={{ color: "white" }}>Gewerbeanmeldung</strong>. Du beantwortest einfache Fragen, bekommst Tipps für deinen Fall und am Ende jeden Eintrag für beide Formulare fertig zum Kopieren — plus was danach kommt.</>)}
          </p>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 14, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: "0 8px 32px rgba(0,117,255,0.45)", cursor: "pointer", fontFamily: "inherit" }}>
            {startLabel} <ArrowRight size={18} />
          </button>
          <p style={{ color: "rgba(147,197,253,0.7)", fontSize: 12.5, marginTop: 12 }}>{L("Personal version · free · no account needed", "Persönliche Version · kostenlos · ohne Konto")}</p>

          {/* Privacy trust block */}
          <div style={{ maxWidth: 560, margin: "28px auto 0", padding: "14px 18px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", gap: 12, textAlign: "left" }}>
            <Lock size={17} color="#86efac" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#bbf7d0", fontSize: 13, lineHeight: 1.65 }}>
              {L(<><strong style={{ color: "#dcfce7" }}>Your data never touches our servers.</strong> Everything you type — your tax ID, IBAN, income estimates — stays in your browser and is processed there. Clear it anytime with one click.</>,
                 <><strong style={{ color: "#dcfce7" }}>Deine Daten landen nie auf unseren Servern.</strong> Alles, was du eintippst — Steuer-ID, IBAN, Schätzungen — bleibt in deinem Browser und wird dort verarbeitet. Mit einem Klick wieder gelöscht.</>)}
            </p>
          </div>

          {/* Answer-sheet preview — stacked-paper mock of the actual product UI */}
          <div style={{ maxWidth: 440, margin: "40px auto 0", position: "relative", textAlign: "left" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: 14, transform: "rotate(-2.2deg)" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)", borderRadius: 14, transform: "rotate(1.4deg)" }} />
            <div style={{ position: "relative", background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
              <div style={{ background: NAVY, padding: "12px 16px" }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: 13 }}>Anmeldung und Abführung der Umsatzsteuer</div>
                <div style={{ color: "#93c5fd", fontSize: 10.5, marginTop: 1 }}>{L("VAT registration", "Umsatzsteuer")}</div>
              </div>
              {[
                { nr: "21", label: "Art der Tätigkeit", val: "Softwareentwicklung" },
                { nr: "69", label: "Beginn der Tätigkeit", val: "01.08.2026" },
                { nr: "130", label: "Summe der Umsätze (geschätzt)", val: "24.000" },
              ].map((r, i) => (
                <div key={r.nr} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 20, borderRadius: 6, background: "#eff6ff", color: BLUE, fontWeight: 800, fontSize: 10 }}>{r.nr}</span>
                  <span style={{ color: MUTED, fontSize: 11.5, flex: 1 }}>{r.label}</span>
                  <span style={{ color: NAVY, fontWeight: 800, fontSize: 12, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 6, padding: "4px 9px" }}>{r.val}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: BLUE, fontWeight: 700, fontSize: 10.5, border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}><CopyIcon size={10} /> {L("Copy", "Kopieren")}</span>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: -14, right: -8, background: "#16a34a", color: "white", fontWeight: 800, fontSize: 11, borderRadius: 999, padding: "6px 13px", boxShadow: "0 6px 20px rgba(22,163,74,0.5)" }}>
              {L("✓ Field numbers match ELSTER", "✓ Feldnummern wie in ELSTER")}
            </div>
          </div>

          {/* Simulator teaser */}
          <button onClick={() => setShowSim(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "11px 22px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.28)", color: "white", fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>
            {L("▶ Try the practice simulator with sample data", "▶ Übungs-Simulator mit Beispieldaten ausprobieren")}
          </button>
          <p style={{ color: "rgba(147,197,253,0.55)", fontSize: 11.5, marginTop: 6 }}>{L("Rehearse every screen of the form — free, nothing transmitted", "Jeden Bildschirm des Formulars üben — kostenlos, nichts wird gesendet")}</p>
        </div>
      </div>
      {showSim && <SteuerSimulator form={DEMO_STEUER} onClose={() => setShowSim(false)} />}

      {/* ── What is this form ── */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 8, textAlign: "center" }}>{L("What is the Fragebogen zur steuerlichen Erfassung?", "Was ist der Fragebogen zur steuerlichen Erfassung?")}</h2>
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: 640, margin: "0 auto 28px", textAlign: "center" }}>
          {L(<>It&apos;s how the Finanzamt learns that you exist as a business: who you are, what you do, what you expect to earn, and how you&apos;ll handle VAT. After processing it, you receive your <strong>Steuernummer</strong> — the number you need to invoice clients properly.</>,
             <>So erfährt das Finanzamt, dass es dich als Unternehmer gibt: wer du bist, was du machst, was du ungefähr verdienen wirst und wie du es mit der Umsatzsteuer hältst. Danach bekommst du deine <strong>Steuernummer</strong> — die brauchst du für korrekte Rechnungen.</>)}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card icon={<FileText size={17} color={BLUE} />} title={L("Who must file it", "Wer muss ihn abgeben")}>
            {L("Anyone starting self-employed work in Germany — freelance or Gewerbe, full-time or on the side.", "Jeder, der sich in Deutschland selbständig macht — freiberuflich oder mit Gewerbe, hauptberuflich oder nebenbei.")}
          </Card>
          <Card icon={<Clock size={17} color={BLUE} />} title={L("The deadline", "Die Frist")}>
            {L(<>Within <strong>one month</strong> of starting your activity (§ 138 AO) — and &quot;starting&quot; includes preparation like buying equipment or signing contracts.</>,
               <>Innerhalb von <strong>einem Monat</strong> nach Beginn (§ 138 AO) — und „Beginn“ umfasst schon Vorbereitungen wie Ausstattung kaufen oder Verträge unterschreiben.</>)}
          </Card>
          <Card icon={<Mail size={17} color={BLUE} />} title={L("What happens after", "Was danach passiert")}>
            {L("The Finanzamt processes your answers and sends your Steuernummer by post — processing times vary by Finanzamt. With it, you can invoice correctly.", "Das Finanzamt bearbeitet deine Angaben und schickt dir die Steuernummer per Post — wie lange das dauert, ist je nach Finanzamt verschieden. Damit kannst du korrekt Rechnungen schreiben.")}
          </Card>
        </div>
      </div>

      {/* ── Free ELSTER guide ── */}
      <div id="elster-guide" style={{ maxWidth: 780, margin: "0 auto", padding: "56px 20px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "5px 14px", marginBottom: 12 }}>
            <span style={{ color: "#16a34a", fontSize: 11.5, fontWeight: 700 }}>{L("Free guide", "Kostenlose Anleitung")}</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 8 }}>{L("First: get your ELSTER account", "Zuerst: dein ELSTER-Konto")}</h2>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            {L(<>The form can only be submitted through <strong>Mein ELSTER</strong>, Germany&apos;s official tax portal. Registration is free but takes several days because of a letter sent by post — start this now, even if you fill the form later.</>,
               <>Der Fragebogen geht nur über <strong>Mein ELSTER</strong>, das offizielle Steuerportal. Die Registrierung ist kostenlos, dauert aber ein paar Tage, weil ein Brief per Post kommt — fang jetzt damit an, auch wenn du den Fragebogen erst später ausfüllst.</>)}
          </p>
        </div>
        {[
          { n: 1, t: L("Have your Steuer-ID ready", "Steuer-ID bereitlegen"), d: L(<>Your 11-digit tax ID (Steuerliche Identifikationsnummer) arrives by post 2–4 weeks after your Anmeldung (up to 6–8 weeks in peak season). You need it to register. Lost it? Request it again at bzst.de.</>, <>Deine 11-stellige Steuer-ID kommt 2–4 Wochen nach der Anmeldung per Post (in der Hauptsaison bis zu 6–8 Wochen). Du brauchst sie für die Registrierung. Verloren? Bei bzst.de neu anfordern.</>) },
          { n: 2, t: L("Register at elster.de", "Bei elster.de registrieren"), d: L(<>Go to elster.de → &quot;Benutzerkonto erstellen&quot; (create account). Choose the standard login method <strong>&quot;Zertifikatsdatei&quot;</strong> (certificate file), select &quot;Für mich (und gemeinsam veranlagte Partner)&quot; — for yourself — and identify with your Steuer-ID (&quot;Mit steuerlicher Identifikationsnummer&quot;).</>, <>Auf elster.de → „Benutzerkonto erstellen“. Wähle die Standard-Methode <strong>„Zertifikatsdatei“</strong>, dann „Für mich (und gemeinsam veranlagte Partner)“ und identifiziere dich „Mit steuerlicher Identifikationsnummer“.</>) },
          { n: 3, t: L("Wait for two codes", "Auf zwei Codes warten"), d: L(<>ELSTER sends an <strong>activation ID by email</strong> immediately and an <strong>activation code by post</strong> — the letter typically takes a few days up to two weeks. This letter is why registering early matters.</>, <>ELSTER schickt sofort eine <strong>Aktivierungs-ID per E-Mail</strong> und einen <strong>Aktivierungscode per Post</strong> — der Brief braucht meist ein paar Tage bis zwei Wochen. Deshalb lohnt es sich, früh anzufangen.</>) },
          { n: 4, t: L("Activate and download your certificate file", "Aktivieren und Zertifikatsdatei speichern"), d: L(<>Enter both codes on the link from the email. ELSTER then generates your <strong>.pfx certificate file</strong> — this file plus your password IS your login. Save it somewhere safe (and back it up).</>, <>Gib beide Codes über den Link aus der E-Mail ein. ELSTER erstellt dann deine <strong>.pfx-Zertifikatsdatei</strong> — Datei plus Passwort sind dein Login. Sicher speichern (und ein Backup machen).</>) },
          { n: 5, t: L("Open the questionnaire", "Fragebogen öffnen"), d: L(<>Log in to Mein ELSTER → &quot;Alle Formulare&quot; → search &quot;Fragebogen zur steuerlichen Erfassung&quot; → choose <strong>&quot;Aufnahme einer gewerblichen, selbständigen (freiberuflichen) oder land- und forstwirtschaftlichen Tätigkeit&quot;</strong> (Einzelunternehmen). That&apos;s the form our answer sheet mirrors, field by field.</>, <>In Mein ELSTER einloggen → „Alle Formulare“ → „Fragebogen zur steuerlichen Erfassung“ suchen → <strong>„Aufnahme einer gewerblichen, selbständigen (freiberuflichen) oder land- und forstwirtschaftlichen Tätigkeit“</strong> (Einzelunternehmen) wählen. Genau dieses Formular bildet dein Antwortblatt Feld für Feld ab.</>) },
        ].map(s => (
          <div key={s.n} style={{ display: "flex", gap: 16, background: "white", borderRadius: 14, border: "1px solid #e8ecf4", padding: "18px 20px", marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: NAVY, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 800, color: NAVY, fontSize: 14.5, marginBottom: 4 }}>{s.t}</div>
              <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.65 }}>{s.d}</p>
            </div>
          </div>
        ))}
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/elster-account-english" style={{ color: BLUE, fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>
            {L("Want more detail on each screen? Read the full ELSTER account guide →", "Jeder Bildschirm im Detail (englische Anleitung) →")}
          </a>
        </p>
      </div>

      {/* ── How the product works ── */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 26, textAlign: "center" }}>{L("Then: fill it with confidence", "Dann: sicher ausfüllen")}</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card icon={<FileText size={17} color={BLUE} />} title={L("1 · Answer simple questions", "1 · Einfache Fragen beantworten")}>
            {L("15–25 minutes (a bit longer if you also register a Gewerbe). Every question of the real form, in plain English, with an explanation of what it means and why the Finanzamt asks.", "15–25 Minuten (etwas länger mit Gewerbeanmeldung). Jede Frage des echten Formulars in einfacher Sprache, mit Erklärung, was sie bedeutet und warum das Finanzamt fragt.")}
          </Card>
          <Card icon={<CheckCircle2 size={17} color={BLUE} />} title={L("2 · Get tips for your case", "2 · Tipps für deinen Fall")}>
            {L("Your plan from step 1 turns into suggestions you can take with one click — and warnings where people usually go wrong.", "Dein Plan aus Schritt 1 wird zu Vorschlägen, die du mit einem Klick übernimmst — und zu Warnungen an den Stellen, wo die meisten Fehler passieren.")}
          </Card>
          <Card icon={<CopyIcon size={17} color={BLUE} />} title={L("3 · Copy field by field", "3 · Feld für Feld kopieren")}>
            {L("Your answer sheet opens on screen with a copy button per field — and downloads as a PDF. Open ELSTER next to it: the field numbers match, top to bottom. Plus a to-do page for everything that comes after.", "Dein Antwortblatt öffnet sich mit einem Kopier-Button pro Feld — und als PDF zum Speichern. ELSTER daneben öffnen: Die Feldnummern stimmen, von oben nach unten. Dazu eine To-do-Seite für alles, was danach kommt.")}
          </Card>
        </div>

        {/* Transparency box */}
        <div style={{ marginTop: 20, padding: "18px 20px", borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", gap: 12 }}>
          <AlertCircle size={17} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "#1e3a8a", fontSize: 13.5, lineHeight: 1.7 }}>
            {L(<><strong>Why don&apos;t we just give you a filled-out form?</strong> Because Germany abolished the paper version — since 2021 this form can only be submitted through your personal ELSTER account (paper is reserved for rare hardship cases). What actually helps is having every answer ready in German, in ELSTER&apos;s exact order — on screen to copy from, and as a PDF to keep.</>,
               <><strong>Warum kein ausgefülltes Formular?</strong> Weil es die Papierversion nicht mehr gibt — seit 2021 geht dieser Fragebogen nur noch über dein ELSTER-Konto (Papier nur in seltenen Härtefällen). Was wirklich hilft: jede Antwort fertig formuliert, in genau der Reihenfolge von ELSTER — zum Kopieren auf dem Bildschirm und als PDF.</>)}
          </p>
        </div>

        {/* Legal clarity box */}
        <div style={{ marginTop: 12, padding: "18px 20px", borderRadius: 14, background: "white", border: "1px solid #e8ecf4", display: "flex", gap: 12 }}>
          <Shield size={17} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7 }}>
            {L(<><strong style={{ color: NAVY }}>Personal version, not tax advice.</strong> The tips are rules of thumb based on your answers, not individual advice from a Steuerberater (tax adviser). Every entry and every choice is yours — when in doubt, check ELSTER&apos;s official help.</>,
               <><strong style={{ color: NAVY }}>Persönliche Version, keine Steuerberatung.</strong> Die Tipps sind Faustregeln auf Basis deiner Antworten, keine individuelle Beratung durch einen Steuerberater. Jeder Eintrag und jede Entscheidung liegt bei dir — im Zweifel hilft die offizielle ELSTER-Hilfe.</>)}
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 20px 16px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 22, textAlign: "center" }}>{L("Frequently asked questions", "Häufige Fragen")}</h2>
        {FAQ.map(f => (
          <details key={f.q} style={{ background: "white", borderRadius: 12, border: "1px solid #e8ecf4", padding: "16px 20px", marginBottom: 10 }}>
            <summary style={{ fontWeight: 700, color: NAVY, fontSize: 14.5, cursor: "pointer" }}>{f.q}</summary>
            <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>{f.a}</p>
          </details>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ textAlign: "center", padding: "24px 20px 72px" }}>
        <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 14, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: "0 8px 32px rgba(0,117,255,0.35)", cursor: "pointer", fontFamily: "inherit" }}>
          {startLabel} <ArrowRight size={18} />
        </button>
        <p style={{ color: "#94a3b8", fontSize: 12.5, marginTop: 12 }}>{L("Your data stays in your browser", "Deine Daten bleiben in deinem Browser")}</p>
      </div>

<AppFooter />
      <CookieBanner />
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────
const wizLabel = (id: string) => ({
  goal: L("Your plan", "Dein Plan"), elster: L("ELSTER account", "ELSTER-Konto"), form: L("The form", "Das Formular"), personal: L("About you", "Über dich"), identity: L("Tax identity", "Steuer-Identität"), address: L("Address", "Adresse"), activity: L("Activity", "Tätigkeit"),
  "gewerbe-intro": L("Gewerbe: how it works", "Gewerbe: so geht's"), "gewerbe-person": L("Gewerbe: about you", "Gewerbe: zu dir"), "gewerbe-business": L("Gewerbe: business", "Gewerbe: Betrieb"),
  bank: L("Bank", "Bank"), estimates: L("Estimates", "Schätzungen"), vat: L("VAT", "Umsatzsteuer"), review: L("Review", "Überblick"),
} as Record<string, string>)[id];

// Step 2 content: the form at a glance + attachments, in easy English.
// Facts from the captured fseeun-202401 protocol: the SEPA-mandate request
// sentence and the Belege-nachreichen mechanism appear verbatim in it.
const formSectionsMap = () => [
  { n: "1", t: L("About you", "Über dich"), d: L("Name, birth date, tax ID, church tax — who you are.", "Name, Geburtsdatum, Steuer-ID, Kirchensteuer — wer du bist.") },
  { n: "2", t: L("Your address", "Deine Adresse"), d: L("Where you live now (and before, if you just moved).", "Wo du jetzt wohnst (und vorher, falls du gerade umgezogen bist).") },
  { n: "3", t: L("Your activity", "Deine Tätigkeit"), d: L("What your work actually is, in one line.", "Was du tatsächlich machst, in einer Zeile.") },
  { n: "4", t: L("Bank account", "Bankverbindung"), d: L("Where tax refunds go.", "Wohin Erstattungen gehen.") },
  { n: "5", t: L("Your history", "Deine Vorgeschichte"), d: L("Earlier tax files or businesses, if any.", "Frühere Steuernummern oder Betriebe, falls vorhanden.") },
  { n: "6", t: L("Business details", "Angaben zum Betrieb"), d: L("Start date, founding, work address.", "Beginn, Gründung, Betriebsadresse.") },
  { n: "7", t: L("Income estimates", "Einkommensschätzung"), d: L("Your honest guesses — Germany asks everyone to predict the future.", "Deine ehrliche Schätzung — das Finanzamt fragt jeden nach der Zukunft.") },
  { n: "8", t: L("Profit method", "Gewinnermittlung"), d: L("How you'll count your money (simple cash-basis for most).", "Wie du deinen Gewinn ermittelst (für fast alle: einfache EÜR).") },
  { n: "9", t: L("VAT", "Umsatzsteuer"), d: L("The one real decision in the form. We explain it slowly when we get there.", "Die eine echte Entscheidung im Formular. Wir erklären sie in Ruhe, wenn es so weit ist.") },
];
const formAttachments = () => [
  {
    t: L("Files to upload with the form: none", "Dateien zum Hochladen: keine"),
    d: L("The online form has no file upload for you. You type answers, you press send — that's the whole submission. Certificates, contracts, diplomas: nothing gets attached.", "Das Online-Formular hat keinen Upload. Du tippst die Antworten ein und klickst auf Senden — das ist alles. Zeugnisse, Verträge, Diplome: Nichts wird angehängt."),
    tone: "green" as const,
  },
  {
    t: L("SEPA-Lastschriftmandat — one piece of paper, only if you want it", "SEPA-Lastschriftmandat — ein Blatt Papier, nur wenn du willst"),
    d: L("The bank section of the form says: “Bitte übermitteln Sie das ausgefüllte SEPA-Lastschriftmandat” — please send the direct-debit mandate. That's a separate one-page paper form allowing the Finanzamt to collect what you owe automatically instead of you transferring manually. Whether you want direct debit is your choice; if yes, the paper goes to your Finanzamt by post, separate from this online form.",
         "Im Bank-Abschnitt steht: „Bitte übermitteln Sie das ausgefüllte SEPA-Lastschriftmandat“. Das ist ein separates Papierformular, mit dem das Finanzamt fällige Steuern automatisch abbucht, statt dass du selbst überweist. Ob du das willst, entscheidest du; wenn ja, geht das Blatt per Post ans Finanzamt, getrennt vom Online-Formular."),
    tone: "amber" as const,
  },
  {
    t: L("Receipts & proof — only if they ask, and there's a button for it", "Belege & Nachweise — nur wenn sie fragen, und dafür gibt es einen Knopf"),
    d: L("If the Finanzamt wants to see documents later, they write to you. And if you want to send something after submitting, ELSTER has a built-in way: “Meine Formulare” → “Übermittelte Formulare” → create an “Anschreiben” (cover letter) to your Finanzamt. No stress now.",
         "Wenn das Finanzamt später Unterlagen sehen will, schreibt es dir. Und wenn du nach dem Absenden etwas nachreichen willst: „Meine Formulare“ → „Übermittelte Formulare“ → ein „Anschreiben“ ans Finanzamt erstellen. Jetzt also kein Stress."),
    tone: "blue" as const,
  },
  {
    t: L("Your proof of submission — automatic", "Dein Nachweis — automatisch"),
    d: L("After you press send, ELSTER stores a transmission protocol (Übertragungsprotokoll) with every answer under “Meine Formulare”. Save it as PDF — that's your receipt that you filed on time.",
         "Nach dem Absenden speichert ELSTER ein Übertragungsprotokoll mit allen Antworten unter „Meine Formulare“. Als PDF sichern — das ist dein Beleg, dass du pünktlich abgegeben hast."),
    tone: "blue" as const,
  },
];

// Gewerbe A–Z (facts verified 2026-11-03, sources in steuer-data.ts header)
const gewerbeRoute = () => [
  { n: "1", t: L("Check the two blockers first", "Zuerst die zwei Stolpersteine prüfen"), d: L("Non-EU citizen? Your residence permit must allow self-employment. Regulated trade (gastronomy with alcohol, brokering, security, licensed crafts)? You need the permit or Handwerkskarte before you start.", "Nicht-EU-Bürger? Dein Aufenthaltstitel muss Selbständigkeit erlauben. Erlaubnispflichtiges Gewerbe (Gastronomie mit Alkohol, Makler, Bewachung, zulassungspflichtiges Handwerk)? Dann brauchst du die Erlaubnis oder Handwerkskarte vor dem Start.") },
  { n: "2", t: L("Gewerbeanmeldung at the Gewerbeamt", "Gewerbeanmeldung beim Gewerbeamt"), d: L("Form GewA 1, at the town where your business sits — most cities do it online (Berlin: service.berlin.de). Due at the latest on the day you start (§14 GewO). Small fee, set by your city. You get a confirmation, the “Gewerbeschein”.", "Formular GewA 1, in der Stadt, in der dein Betrieb sitzt — in den meisten Städten online (Berlin: service.berlin.de). Spätestens am Tag des Starts (§ 14 GewO). Kleine Gebühr, je nach Stadt. Du bekommst eine Bestätigung, den „Gewerbeschein“.") },
  { n: "3", t: L("Fragebogen zur steuerlichen Erfassung in ELSTER", "Fragebogen zur steuerlichen Erfassung in ELSTER"), d: L("The Gewerbeamt tells the Finanzamt about you, but you still send this tax form yourself — within one month of starting. This is the main part of this wizard.", "Das Gewerbeamt informiert das Finanzamt, den Fragebogen musst du trotzdem selbst schicken — innerhalb eines Monats nach dem Start. Das ist der Hauptteil dieses Wizards.") },
  { n: "4", t: L("Steuernummer by post", "Steuernummer per Post"), d: L("The Finanzamt processes the Fragebogen and mails your Steuernummer. That number goes on every invoice.", "Das Finanzamt bearbeitet den Fragebogen und schickt dir deine Steuernummer. Sie gehört auf jede Rechnung.") },
  { n: "5", t: L("Letters you'll get anyway", "Briefe, die sowieso kommen"), d: L("IHK (or Handwerkskammer for crafts): membership is automatic. Berufsgenossenschaft: your Gewerbeanmeldung already counts as the required notice to this accident insurer — they'll write to you. Neither needs action before they write.", "IHK (bzw. Handwerkskammer): Die Mitgliedschaft ist automatisch. Berufsgenossenschaft: Deine Gewerbeanmeldung gilt schon als Meldung bei dieser Unfallversicherung — sie schreibt dir. Bei beiden musst du nichts tun, bevor sie sich melden.") },
];
const gewerbeMoney = () => [
  { t: L("IHK contribution", "IHK-Beitrag"), d: L("Sole traders not in the Handelsregister pay no IHK contribution while their trade profit stays at or below €5,200 a year. Founders with no business income in the 5 years before pay nothing in their first two years and only the basic fee in years three and four, as long as profit stays at or below €25,000.", "Einzelunternehmer ohne Handelsregistereintrag zahlen keinen IHK-Beitrag, solange der Gewerbegewinn bei höchstens 5.200 € im Jahr liegt. Gründer ohne Betriebseinkünfte in den 5 Jahren davor zahlen in den ersten zwei Jahren nichts und im dritten und vierten Jahr nur den Grundbeitrag, solange der Gewinn höchstens 25.000 € beträgt.") },
  { t: L("Trade tax (Gewerbesteuer)", "Gewerbesteuer"), d: L("Sole traders get a €24,500 yearly allowance on their trade profit — below that, no trade tax at all. Above it, much of the trade tax is credited against your income tax.", "Einzelunternehmer haben einen Freibetrag von 24.500 € im Jahr — darunter fällt gar keine Gewerbesteuer an. Darüber wird ein großer Teil auf deine Einkommensteuer angerechnet.") },
  { t: L("Bring along", "Mitbringen"), d: L("ID card or passport, residence permit (non-EU), and any permit or Handwerkskarte your trade needs. For online registration: a way to pay the fee and to identify yourself (often the online ID function of your ID card or a scan).", "Personalausweis oder Reisepass, Aufenthaltstitel (Nicht-EU) und ggf. Erlaubnis oder Handwerkskarte. Online: eine Zahlungsmöglichkeit für die Gebühr und eine Identifizierung (oft die Online-Ausweisfunktion oder ein Scan).") },
];

// Condensed ELSTER registration steps (full guide: /elster-account-english)
const elsterMini = () => [
  { n: "1", t: L("Have your Steuer-ID ready", "Steuer-ID bereitlegen"), d: L("The 11-digit number that arrived by post after your Anmeldung. Lost? Request at bzst.de.", "Die 11-stellige Nummer, die nach deiner Anmeldung per Post kam. Verloren? Bei bzst.de anfordern.") },
  { n: "2", t: L("Register at elster.de", "Bei elster.de registrieren"), d: L("“Benutzerkonto erstellen” → login method “Zertifikatsdatei” → “Für mich” → identify with your Steuer-ID.", "„Benutzerkonto erstellen“ → Methode „Zertifikatsdatei“ → „Für mich“ → mit Steuer-ID identifizieren.") },
  { n: "3", t: L("Wait for two codes", "Auf zwei Codes warten"), d: L("Activation ID by email (instant) + activation code by post — typically a few days up to two weeks.", "Aktivierungs-ID per E-Mail (sofort) + Aktivierungscode per Post — meist ein paar Tage bis zwei Wochen.") },
  { n: "4", t: L("Activate & save your certificate file", "Aktivieren & Zertifikatsdatei speichern"), d: L("Enter both codes, download the .pfx file, set a password. File + password = your login. Back it up.", "Beide Codes eingeben, .pfx-Datei herunterladen, Passwort festlegen. Datei + Passwort = dein Login. Backup machen.") },
  { n: "5", t: L("Open the form", "Formular öffnen"), d: L("Log in → “Alle Formulare” → “Fragebogen zur steuerlichen Erfassung” → Einzelunternehmen.", "Einloggen → „Alle Formulare“ → „Fragebogen zur steuerlichen Erfassung“ → Einzelunternehmen.") },
];
// Steps with showIf (Gewerbe) appear only for the answers that need them
const wizIds = (f: SteuerForm) => [...STEUER_STEPS.filter(s => !s.showIf || s.showIf(f)).map(s => s.id), "review"];

function SteuerWizard({
  form, setForm, stepId, setStepId, onDone, onHome, onRestart,
}: {
  form: SteuerForm; setForm: (f: SteuerForm) => void;
  stepId: string; setStepId: (s: string) => void;
  onDone: () => void; onHome: () => void; onRestart: () => void;
}) {
  const [err, setErr] = useState("");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const WIZ_IDS = wizIds(form);
  const idx = Math.max(0, WIZ_IDS.indexOf(stepId));
  const stepDef = STEUER_STEPS.find(s => s.id === stepId);

  const next = () => {
    if (stepDef) {
      const e = stepError(stepId, form);
      if (e) { setErr(e); return; }
    }
    setErr("");
    if (idx < WIZ_IDS.length - 1) { setStepId(WIZ_IDS[idx + 1]); window.scrollTo(0, 0); }
    else onDone();
  };
  const back = () => {
    setErr("");
    if (idx > 0) { setStepId(WIZ_IDS[idx - 1]); window.scrollTo(0, 0); }
    else onHome();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* The .wizard-aside media rules live only on the Anmeldung route, so
          this page ships its own (critique finding: sidebar crushed mobile). */}
      <style>{`
        .steuer-mobile-progress { display: none; }
        @media (max-width: 860px) {
          .steuer-aside { display: none !important; }
          .steuer-mobile-progress { display: block !important; }
        }
      `}</style>
      <SharedNav />
      <div style={{ display: "flex", maxWidth: 1080, margin: "0 auto", gap: 0 }}>
        {/* Sidebar */}
        <aside className="steuer-aside" style={{ width: 260, flexShrink: 0, padding: "36px 24px", borderRight: "1px solid #e8ecf4", background: "white", minHeight: "calc(100vh - 60px)" }}>
          <div style={{ fontWeight: 900, color: NAVY, fontSize: 15, marginBottom: 4 }}>Easy Fragebogen</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 14 }}>zur steuerlichen Erfassung</div>
          <div style={{ marginBottom: 20 }}><LangSwitch /></div>
          {WIZ_IDS.map((id, i) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, marginBottom: 2, background: id === stepId ? "#eff6ff" : "transparent" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: i < idx ? "#16a34a" : id === stepId ? BLUE : "#f1f5f9", color: i < idx || id === stepId ? "white" : "#94a3b8" }}>
                {i < idx ? <Check size={11} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: id === stepId ? 800 : 500, color: id === stepId ? NAVY : MUTED }}>{wizLabel(id)}</span>
            </div>
          ))}
          <div style={{ marginTop: 26, padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", gap: 8 }}>
            <Lock size={12} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: "#166534", lineHeight: 1.5 }}>{L("Stays in your browser. Nothing is sent to our servers.", "Bleibt in deinem Browser. Nichts geht an unsere Server.")}</p>
          </div>
          <button onClick={() => setConfirmRestart(true)} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#94a3b8", fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", padding: "6px 10px" }}>
            <RotateCcw size={12} /> {L("Clear & restart", "Löschen & neu starten")}
          </button>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "40px 32px 80px", maxWidth: 640 }}>
          <div className="steuer-mobile-progress" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 10 }}><LangSwitch /></div>
            <div style={{ color: MUTED, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{L("Step", "Schritt")} {idx + 1} {L("of", "von")} {WIZ_IDS.length} · {wizLabel(stepId)}</div>
            <div style={{ height: 4, borderRadius: 2, background: "#e8ecf4" }}>
              <div style={{ height: 4, borderRadius: 2, background: BLUE, width: `${Math.round(((idx + 1) / WIZ_IDS.length) * 100)}%`, transition: "width 0.3s" }} />
            </div>
          </div>
          {stepDef ? (
            <>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 8 }}>{tr(stepDef.title)}</h2>
              <p style={{ color: "#475569", marginBottom: 30, fontSize: 16, lineHeight: 1.6 }}>{tr(stepDef.sub)}</p>
              {stepId === "elster" && (
                <div style={{ marginBottom: 26 }}>
                  {elsterMini().map(s => (
                    <div key={s.n} style={{ display: "flex", gap: 12, background: "white", borderRadius: 12, border: "1px solid #e8ecf4", padding: "13px 16px", marginBottom: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: NAVY, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{s.n}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: NAVY, fontSize: 13 }}>{s.t}</div>
                        <p style={{ color: MUTED, fontSize: 12, lineHeight: 1.55, marginTop: 2 }}>{s.d}</p>
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: 12.5, marginTop: 10 }}>
                    <a href="/elster-account-english" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontWeight: 700, textDecoration: "none" }}>
                      {L("Full screen-by-screen guide (opens in new tab) →", "Ausführliche Anleitung mit allen Bildschirmen (englisch, neuer Tab) →")}
                    </a>
                  </p>
                </div>
              )}
              {stepId === "gewerbe-intro" && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 17, marginBottom: 12 }}>{L("Your route, A to Z", "Dein Weg von A bis Z")}</div>
                  {gewerbeRoute().map(s => (
                    <div key={s.n} style={{ display: "flex", gap: 14, background: "white", borderRadius: 14, border: "1px solid #e8ecf4", padding: "15px 18px", marginBottom: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.n === "3" ? BLUE : NAVY, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{s.n}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: NAVY, fontSize: 15.5 }}>{s.t}</div>
                        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, marginTop: 3 }}>{s.d}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 17, margin: "24px 0 12px" }}>{L("Money & paperwork, honestly", "Geld & Papierkram, ehrlich")}</div>
                  {gewerbeMoney().map(m => (
                    <div key={m.t} style={{ marginBottom: 10, padding: "14px 16px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#1e40af", marginBottom: 4 }}>{m.t}</div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1e3a8a" }}>{m.d}</p>
                    </div>
                  ))}
                </div>
              )}
              {stepId === "form" && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, marginBottom: 10 }}>{L("The 9 sections, in order", "Die 9 Abschnitte, der Reihe nach")}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 24 }}>
                    {formSectionsMap().map(s => (
                      <div key={s.n} style={{ background: "white", borderRadius: 11, border: "1px solid #e8ecf4", padding: "11px 13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <span style={{ width: 20, height: 20, borderRadius: "50%", background: NAVY, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10.5, flexShrink: 0 }}>{s.n}</span>
                          <span style={{ fontWeight: 800, color: NAVY, fontSize: 12.5 }}>{s.t}</span>
                        </div>
                        <p style={{ color: MUTED, fontSize: 11.5, lineHeight: 1.5 }}>{s.d}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, marginBottom: 10 }}>{L("Attachments & paperwork — the honest list", "Anhänge & Papierkram — die ehrliche Liste")}</div>
                  {formAttachments().map(a => (
                    <div key={a.t} style={{
                      marginBottom: 10, padding: "13px 15px", borderRadius: 12,
                      background: a.tone === "green" ? "#f0fdf4" : a.tone === "amber" ? "#fffbeb" : "#eff6ff",
                      border: a.tone === "green" ? "1px solid #bbf7d0" : a.tone === "amber" ? "1px solid #fde68a" : "1px solid #bfdbfe",
                    }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: a.tone === "green" ? "#166534" : a.tone === "amber" ? "#92400e" : "#1e40af", marginBottom: 4 }}>{a.t}</div>
                      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: a.tone === "green" ? "#14532d" : a.tone === "amber" ? "#78350f" : "#1e3a8a" }}>{a.d}</p>
                    </div>
                  ))}
                </div>
              )}
              {stepDef.fields.map(fd => <FieldInput key={String(fd.key)} fd={fd} form={form} setForm={setForm} />)}
              {stepDef.tips && stepDef.tips(form).length > 0 && (
                <div style={{ marginTop: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 900, color: NAVY, fontSize: 15, marginBottom: 2 }}>{L("Your game plan", "Dein Fahrplan")}</div>
                  <p style={{ color: MUTED, fontSize: 12.5, marginBottom: 4 }}>{L("Based on your answers — worth reading before you continue.", "Passend zu deinen Antworten — lies das, bevor du weitermachst.")}</p>
                  {stepDef.tips(form).map((t, i) => <TipBox key={i} text={tr(t)} />)}
                </div>
              )}
              {stepId === "elster" && form.hasElsterAccount === false && (
                <div style={{ padding: "12px 15px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16, display: "flex", gap: 9 }}>
                  <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: "#166534", fontSize: 12.5, lineHeight: 1.6 }}>
                    {L(<><strong>You can still do everything today.</strong> Start the ELSTER registration in a new tab (step 2 above), then keep going here — your answers are saved in this browser, and the sheet plus PDF will be waiting when your activation letter arrives.</>,
                       <><strong>Du kannst trotzdem heute alles erledigen.</strong> Starte die ELSTER-Registrierung in einem neuen Tab (Schritt 2 oben) und mach hier weiter — deine Antworten bleiben in diesem Browser gespeichert, Antwortblatt und PDF warten auf dich, wenn der Aktivierungsbrief kommt.</>)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 23, fontWeight: 800, color: NAVY, marginBottom: 4 }}>{L("Almost done — here's your sheet", "Fast geschafft — hier ist dein Antwortblatt")}</h2>
              <p style={{ color: MUTED, marginBottom: 26, fontSize: 14 }}>{L("This is the structure of your answer sheet — every ELSTER section and field number, matched to your answers. Click below to get the finished German entries with copy buttons and the PDF. Use Back anytime to change an answer.", "So ist dein Antwortblatt aufgebaut — jeder ELSTER-Abschnitt und jede Feldnummer, passend zu deinen Antworten. Klick unten, um die fertigen Einträge mit Kopier-Buttons und das PDF zu bekommen. Mit Zurück kannst du jederzeit etwas ändern.")}</p>
              {buildAnswerRows(form).map(sec => (
                <div key={sec.title} style={{ marginBottom: 22 }}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, padding: "8px 12px", background: "#f1f5f9", borderRadius: 8, marginBottom: 8 }}>{sec.title}</div>
                  {sec.rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "7px 12px", borderBottom: "1px solid #f1f5f9", alignItems: "baseline" }}>
                      <span style={{ color: BLUE, fontWeight: 800, fontSize: 11, width: 26, flexShrink: 0 }}>{r.nr}</span>
                      <span style={{ color: MUTED, fontSize: 12, flex: 1 }}>{r.label}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#94a3b8", fontWeight: 700, fontSize: 11, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 6, padding: "3px 9px", flexShrink: 0 }}>
                        <Lock size={10} /> {L("Next step", "Nächster Schritt")}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {err && (
            <div style={{ padding: "11px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 16, display: "flex", gap: 8 }}>
              <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#991b1b", fontSize: 13 }}>{err}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 12, border: "1px solid #e2e8f0", background: "white", color: MUTED, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              <ArrowLeft size={15} /> {L("Back", "Zurück")}
            </button>
            <button onClick={next} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,117,255,0.3)" }}>
              {stepId === "review" ? L("Create my answer sheet", "Antwortblatt erstellen") : L("Next", "Weiter")} <ArrowRight size={15} />
            </button>
          </div>
        </main>
      </div>

      {/* Restart modal — top level, outside <aside> (Safari fixed/sticky bug) */}
      {confirmRestart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: NAVY }}>{L("Clear & restart?", "Löschen & neu starten?")}</h3>
            <p style={{ color: MUTED, marginBottom: 20 }}>{L("All entered data will be removed from your browser.", "Alle Eingaben werden aus deinem Browser gelöscht.")}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setConfirmRestart(false); onRestart(); }} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{L("Clear & restart", "Löschen & neu starten")}</button>
              <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, background: "#f1f5f9", color: NAVY, border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{L("Keep my data", "Daten behalten")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payment ──────────────────────────────────────────────────────
function SteuerPayment({ form, onDevSkip, onBack }: { form: SteuerForm; onDevSkip: () => void; onBack: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "40px 20px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(0,117,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>R</span>
            </div>
            <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>ReadyExpat <span style={{ color: "#60a5fa" }}>Steuer</span></span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
            Your answer sheet<br /><span style={{ color: "#60a5fa" }}>is ready to generate.</span>
          </h1>
          <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 15, lineHeight: 1.65, maxWidth: 400, margin: "0 auto" }}>
            Every ELSTER field, answered in correct German — on screen and as PDF.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "-60px auto 0", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", padding: "0 0 12px", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          <ArrowLeft size={14} /> Back to review
        </button>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", marginBottom: 12 }}>
          <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Easy Fragebogen — self-employed</div>
            <div style={{ fontWeight: 700, color: NAVY, fontSize: 16 }}>{form.firstName} {form.lastName}</div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>{form.activityDesc}</div>
          </div>
          <div style={{ padding: "16px 24px" }}>
            {[
              { label: "Complete English walkthrough", desc: "Every ELSTER field explained — you already did this part" },
              { label: "Answer sheet on screen", desc: "Copy button per field · matches ELSTER's field numbers" },
              { label: "Same sheet as PDF download", desc: "Keep it, reopen it, finish ELSTER whenever you want" },
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
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
              We translate and format the answers you provided; all entries and choices are yours. We do not submit the form for you — you submit it in your own ELSTER account.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 14, padding: "11px 14px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", gap: 9 }}>
          <Lock size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11.5, color: "#166534", lineHeight: 1.6 }}>
            <strong>Your tax ID, IBAN and income data never reach our servers.</strong> Everything stays in your browser — we receive only the payment confirmation from Stripe.
          </p>
        </div>

        {/* Beta: free access button (primary) — Munich beta pattern */}
        <button
          onClick={onDevSkip}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px", borderRadius: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: "0 8px 32px rgba(22,163,74,0.35)", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em" }}>
          <Download size={18} /> Get my answer sheet — Free (beta)
        </button>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 10 }}>
          Free while we&apos;re in beta — no card required
        </p>
        <button
          id="steuer-pay-btn"
          onClick={async (e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.disabled = true;
            btn.textContent = "Opening Stripe...";
            try {
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ returnPath: "/freelance-steuer", product: "steuer" }),
              });
              const data = await res.json();
              if (data.url) { window.location.href = data.url; }
              else { btn.disabled = false; btn.textContent = "Or support the beta — pay €15"; alert("Could not start checkout. Please try again."); }
            } catch {
              btn.disabled = false; btn.textContent = "Or support the beta — pay €15"; alert("Network error. Please try again.");
            }
          }}
          style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "13px", borderRadius: 12, background: "transparent", color: BLUE, fontWeight: 800, fontSize: 13.5, border: "1.5px solid #bfdbfe", cursor: "pointer", fontFamily: "inherit" }}>
          <CreditCard size={15} /> Or support the beta — pay €15
        </button>
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('pageshow',function(){var b=document.getElementById('steuer-pay-btn');if(b){b.disabled=false;b.textContent='Or support the beta — pay €15';}});` }} />
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 10.5, lineHeight: 1.5, marginTop: 8 }}>
          Payments via Stripe · Secure · No card stored. By paying you consent to immediate service delivery and acknowledge the loss of your 14-day right of withdrawal (§ 356 Abs. 5 BGB).
        </p>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Email opt-in (done page) ─────────────────────────────────────
// Privacy model: only first name + email leave the browser (Art. 6(1)(a)
// DSGVO consent via the field itself) — no form data attached.
function SteuerEmailOptIn({ firstName }: { firstName: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  if (state === "sent") {
    return (
      <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 26, display: "flex", gap: 9 }}>
        <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.6 }}>{L("Sent. Check your inbox for your ELSTER next steps.", "Gesendet. Schau in dein Postfach.")}</p>
      </div>
    );
  }
  return (
    <div style={{ padding: "16px 18px", borderRadius: 12, background: "white", border: "1px solid #e8ecf4", marginBottom: 26 }}>
      <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, marginBottom: 4 }}>{L("Email yourself the next steps", "Nächste Schritte per E-Mail")}</div>
      <p style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.6, marginBottom: 10 }}>
        {L("The ELSTER activation letter can take up to two weeks — get the 3 next steps in your inbox so nothing slips. Only your first name and email are transmitted; never your form data.", "Der ELSTER-Brief kann bis zu zwei Wochen dauern — hol dir die nächsten Schritte ins Postfach (die Mail ist auf Englisch). Übertragen werden nur Vorname und E-Mail, nie deine Formulardaten.")}
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email" value={email} placeholder="you@example.com"
          onChange={e => setEmail(e.target.value)}
          style={{ flex: "1 1 200px", padding: "10px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13.5, fontFamily: "inherit", color: NAVY }}
        />
        <button
          disabled={state === "sending" || !email.includes("@")}
          onClick={async () => {
            setState("sending");
            try {
              const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: email, firstName, product: "steuer" }),
              });
              setState(res.ok ? "sent" : "error");
            } catch { setState("error"); }
          }}
          style={{ padding: "10px 18px", borderRadius: 9, border: "none", background: email.includes("@") ? `linear-gradient(135deg,${BLUE},#2563eb)` : "#e2e8f0", color: email.includes("@") ? "white" : "#94a3b8", fontWeight: 800, fontSize: 13, cursor: email.includes("@") ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          {state === "sending" ? L("Sending…", "Sende…") : L("Send", "Senden")}
        </button>
      </div>
      {state === "error" && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 8 }}>{L("Could not send — please try again or email info@readyexpat.de.", "Senden fehlgeschlagen — bitte nochmal versuchen.")}</p>}
    </div>
  );
}

// ─── Done page ────────────────────────────────────────────────────
function SteuerDone({
  form, pdfBytes, pdfName, sessionError, pdfError, onRestart,
}: {
  form: SteuerForm; pdfBytes: Uint8Array | null; pdfName: string;
  sessionError: boolean; pdfError: boolean; onRestart: () => void;
}) {
  const sections = buildAnswerRows(form);
  const [showSim, setShowSim] = useState(false);
  const download = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = pdfName; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <SharedNav />
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "48px 20px 56px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e", marginBottom: 18 }}>
          <Check size={26} color="#4ade80" />
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 10 }}>{L("Your answer sheet is ready.", "Dein Antwortblatt ist fertig.")}</h1>
        <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 15, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.65 }}>
          {L("Open Mein ELSTER in a second tab and work top to bottom — the field numbers match. Download the PDF to keep your answers.", "Öffne Mein ELSTER in einem zweiten Tab und arbeite von oben nach unten — die Feldnummern stimmen. Lade das PDF herunter, um deine Antworten zu behalten.")}
        </p>
        <div style={{ marginBottom: 18 }}><LangSwitch dark /></div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={download} disabled={!pdfBytes} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: pdfBytes ? "linear-gradient(135deg,#16a34a,#15803d)" : "#334155", color: "white", fontWeight: 800, fontSize: 14.5, border: "none", cursor: pdfBytes ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: pdfBytes ? "0 6px 24px rgba(22,163,74,0.4)" : "none" }}>
            <Download size={16} /> {L("Download PDF", "PDF herunterladen")}
          </button>
          <button onClick={() => setShowSim(true)} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 800, fontSize: 14.5, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(0,117,255,0.4)" }}>
            {L("▶ Practice in the simulator", "▶ Im Simulator üben")}
          </button>
          <a href="https://www.elster.de/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontWeight: 800, fontSize: 14.5, textDecoration: "none", fontFamily: "inherit" }}>
            {L("Open Mein ELSTER", "Mein ELSTER öffnen")} <ExternalLink size={15} />
          </a>
        </div>
      </div>
      {showSim && <SteuerSimulator form={form} onClose={() => setShowSim(false)} />}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        {sessionError && (
          <div style={{ padding: "16px 18px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 22, display: "flex", gap: 10 }}>
            <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#991b1b", fontSize: 13.5, lineHeight: 1.65 }}>
              <strong>Your session data is no longer in this browser</strong> (it lives only in your browser and may have been cleared). If you paid and can&apos;t access your sheet, email <strong>info@readyexpat.de</strong> with your payment confirmation and we&apos;ll resolve it.
            </p>
          </div>
        )}

        {!sessionError && pdfError && (
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: 22, display: "flex", gap: 10 }}>
            <AlertCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#92400e", fontSize: 13, lineHeight: 1.6 }}>
              <strong>The PDF could not be generated in this browser</strong> — but your complete answer sheet is below and every value can be copied directly. If you need the PDF, try reloading this page, or email <strong>info@readyexpat.de</strong>.
            </p>
          </div>
        )}

        {!sessionError && (
          <>
            <div style={{ padding: "12px 16px", borderRadius: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 22, display: "flex", gap: 9 }}>
              <Lock size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12.5, color: "#166534", lineHeight: 1.6 }}>
                {L("This sheet was generated locally in your browser. Your data was never sent to our servers — it stays here until you clear it.", "Dieses Blatt wurde lokal in deinem Browser erstellt. Deine Daten gingen nie an unsere Server — sie bleiben hier, bis du sie löschst.")}
              </p>
            </div>

            <SteuerEmailOptIn firstName={form.firstName} />

            <div style={{ marginBottom: 26, padding: "18px 20px", borderRadius: 14, background: "white", border: "1px solid #e8ecf4" }}>
              <div style={{ fontWeight: 900, color: NAVY, fontSize: 18, marginBottom: 12 }}>{L("Your to-do list, in order", "Deine To-do-Liste, der Reihe nach")}</div>
              {[
                ...(form.needsResidencePermit ? [L("Check your residence permit: it must allow self-employment (“Selbständige Tätigkeit gestattet”). If not, get permission from your Ausländerbehörde before you start.", "Aufenthaltstitel prüfen: Er muss Selbständigkeit erlauben („Selbständige Tätigkeit gestattet“). Wenn nicht, vor dem Start die Erlaubnis bei der Ausländerbehörde holen.")] : []),
                ...(needsGewerbe(form) ? [L(`Gewerbeanmeldung at your Gewerbeamt (online in most cities) — use the GewA 1 section below. Do it on or before ${fmtDateDE(form.activityStart) || "your start date"}.`, `Gewerbeanmeldung beim Gewerbeamt (in den meisten Städten online) — nutze den GewA-1-Abschnitt unten. Spätestens am ${fmtDateDE(form.activityStart) || "Tag deines Starts"}.`)] : []),
                form.hasElsterAccount ? L("Log in to Mein ELSTER and open “Fragebogen zur steuerlichen Erfassung” → Einzelunternehmen.", "In Mein ELSTER einloggen und „Fragebogen zur steuerlichen Erfassung“ → Einzelunternehmen öffnen.") : L("Register at elster.de today — the activation letter takes up to two weeks.", "Heute noch bei elster.de registrieren — der Aktivierungsbrief braucht bis zu zwei Wochen."),
                L(`Copy the tax-form answers below into ELSTER, top to bottom, and send it${form.activityStart ? ` — deadline about one month after ${fmtDateDE(form.activityStart)}` : ""}. Save the transmission protocol as PDF.`, `Die Antworten unten von oben nach unten in ELSTER übertragen und absenden${form.activityStart ? ` — Frist etwa ein Monat nach dem ${fmtDateDE(form.activityStart)}` : ""}. Das Übertragungsprotokoll als PDF speichern.`),
                L("Wait for your Steuernummer by post — it goes on every invoice.", "Auf die Steuernummer per Post warten — sie gehört auf jede Rechnung."),
                ...(needsGewerbe(form) ? [L("Answer the letters from the IHK/Handwerkskammer and the Berufsgenossenschaft when they arrive.", "Die Briefe von IHK/Handwerkskammer und Berufsgenossenschaft beantworten, wenn sie kommen.")] : []),
                L("From your first payment on: put a share aside for tax and keep every receipt.", "Ab der ersten Zahlung: einen Teil für die Steuer zurücklegen und jeden Beleg aufheben."),
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: NAVY, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ color: "#334155", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>

            {(() => { const plan = actionPlan(form); return (
            <div style={{ marginBottom: 30 }}>
              <div style={{ fontWeight: 900, color: NAVY, fontSize: 18, marginBottom: 2 }}>{L("Your plan: what to do, when and where", "Dein Fahrplan: was du wann wo erledigst")}</div>
              <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{L("Made from your answers — step by step, with links.", "Aus deinen Antworten gebaut — Schritt für Schritt, mit Links.")}</p>
              {PHASES.filter(ph => plan.some(x => x.phase === ph.id)).map(ph => (
                <div key={ph.id} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 800, color: BLUE, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{ph.label()}</div>
                  {plan.filter(x => x.phase === ph.id).map((x, i) => (
                    <details key={i} style={{ background: "white", border: "1px solid #e8ecf4", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
                      <summary style={{ cursor: "pointer", fontWeight: 800, color: NAVY, fontSize: 15 }}>{x.title}</summary>
                      {x.why && <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6, margin: "8px 0" }}>{x.why}</p>}
                      {x.where && <p style={{ fontSize: 13.5, margin: "6px 0" }}><b>{L("Where: ", "Wo: ")}</b>{x.where.url ? <a href={x.where.url} target="_blank" rel="noreferrer" style={{ color: BLUE }}>{x.where.label}</a> : x.where.label}</p>}
                      {x.need && x.need.length > 0 && <div style={{ fontSize: 13.5, margin: "6px 0" }}><b>{L("You need:", "Du brauchst:")}</b><ul style={{ margin: "4px 0 0 18px", padding: 0 }}>{x.need.map((t, j) => <li key={j} style={{ lineHeight: 1.55 }}>{t}</li>)}</ul></div>}
                      <ol style={{ margin: "8px 0 4px 18px", padding: 0, fontSize: 14, color: "#334155" }}>{x.steps.map((t, j) => <li key={j} style={{ lineHeight: 1.6, marginBottom: 4 }}>{t}</li>)}</ol>
                      {x.copy && <div style={{ marginTop: 8 }}><pre style={{ whiteSpace: "pre-wrap", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 10, fontSize: 12.5, margin: 0 }}>{x.copy}</pre><button onClick={() => navigator.clipboard?.writeText(x.copy!)} style={{ marginTop: 6, border: "none", background: BLUE, color: "white", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>{L("Copy message", "Nachricht kopieren")}</button></div>}
                      {x.cost && <p style={{ fontSize: 13, color: MUTED, margin: "6px 0 0" }}><b>{L("Cost: ", "Kosten: ")}</b>{x.cost}</p>}
                    </details>
                  ))}
                </div>
              ))}
            </div>); })()}

            <div style={{ marginBottom: 30, padding: "20px 20px 8px", borderRadius: 14, background: "white", border: "1px solid #e8ecf4" }}>
              <div style={{ fontWeight: 900, color: NAVY, fontSize: 18, marginBottom: 2 }}>{L("Good to know", "Gut zu wissen")}</div>
              <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{L("What comes next for your business — picked for your answers.", "Was jetzt auf dein Business zukommt — passend zu deinen Antworten.")}</p>
              {afterRegistration(form).map(grp => (
                <div key={grp.title} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, color: BLUE, fontSize: 14.5, marginBottom: 8 }}>{grp.title}</div>
                  {grp.items.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
                      <Check size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 3 }} />
                      <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{t}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ fontWeight: 900, color: NAVY, fontSize: 18, marginBottom: 12 }}>{L("Your answer sheet", "Dein Antwortblatt")}</div>

            {/* Filled-form view: your values sitting inside the form layout,
                like the screen you'll see in ELSTER — not a list. */}
            {sections.map((sec, si) => (
              <div key={sec.title} style={{ marginBottom: 26, background: "white", border: "1px solid #cdd5df", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.06)" }}>
                <div style={{ borderBottom: "3px solid #37424f", padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "#1f2937", fontWeight: 700, fontSize: 14 }}>{sec.title}</div>
                    {hasTr(sec.titleEn) && <div style={{ color: BLUE, fontSize: 11.5, fontWeight: 600, marginTop: 1 }}>{tr(sec.titleEn)}</div>}
                  </div>
                  <span style={{ color: "#6b7280", fontSize: 11 }}>Seite {si + 1} von {sections.length}</span>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  {sec.rows.map((r, i) => (
                    <div key={i} style={{ marginBottom: i < sec.rows.length - 1 ? 14 : 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 11.5, color: "#4b5563", marginBottom: 4 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 16, borderRadius: 3, background: "#eef1f5", border: "1px solid #d5dbe3", color: "#374151", fontWeight: 700, fontSize: 9.5, padding: "0 4px", flexShrink: 0 }}>{r.nr}</span>
                        <span style={{ fontWeight: 600 }}>{r.label}</span>
                      </div>
                      {r.instruction ? (
                        <div style={{ padding: "9px 12px", borderRadius: 4, background: "#fffbeb", border: "1px dashed #f0c948", color: "#92400e", fontSize: 12.5, fontStyle: "italic" }}>
                          ☐ {r.de}
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                          <div style={{ flex: 1, padding: "9px 12px", borderRadius: 4, border: "1px solid #aeb8c4", background: r.de ? "#fbfdff" : "#f5f7fa", color: r.de ? "#111827" : "#9aa5b1", fontSize: 13.5, fontWeight: 600, overflowWrap: "anywhere" }}>
                            {r.de || L("— leave empty —", "— leer lassen —")}
                          </div>
                          {r.de && <CopyValue value={r.de} />}
                        </div>
                      )}
                      {r.enHint && hasTr(r.enHint) && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{tr(r.enHint)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ padding: "16px 18px", borderRadius: 12, background: "white", border: "1px solid #e8ecf4", display: "flex", gap: 10 }}>
              <Landmark size={15} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.7 }}>
                {L(<><strong style={{ color: NAVY }}>Before you submit in ELSTER:</strong> review every value on ELSTER&apos;s summary screen — you are responsible for your entries. After submitting, ELSTER stores a transmission protocol under &quot;Meine Formulare&quot;; save it. The Finanzamt sends your Steuernummer by post after processing.</>,
                   <><strong style={{ color: NAVY }}>Bevor du in ELSTER absendest:</strong> Prüf jeden Wert auf der Zusammenfassung in ELSTER — für deine Angaben bist du verantwortlich. Nach dem Absenden liegt das Übertragungsprotokoll unter „Meine Formulare“; speicher es. Das Finanzamt schickt die Steuernummer nach der Bearbeitung per Post.</>)}<br />
                <span style={{ fontSize: 11.5 }}>{L("Field numbers verified against the 2026 form version (fseeun-202401). If ELSTER ever shows a different number, match by the German label next to it — the labels don't change.", "Feldnummern geprüft an der Formularversion 2026 (fseeun-202401). Zeigt ELSTER mal eine andere Nummer, richte dich nach der Bezeichnung daneben — die ändert sich nicht.")}</span><br />
                <span style={{ fontSize: 11.5 }}>{L("Not tax advice — you entered every value yourself.", "Keine Steuerberatung — alle Werte hast du selbst eingegeben.")}</span>
              </p>
            </div>
          </>
        )}

        <button onClick={onRestart} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          <RotateCcw size={13} /> {L("Clear my data & start over", "Meine Daten löschen & neu starten")}
        </button>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function FreelanceSteuerPage() {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [stepId, setStepId] = useState<string>("goal");
  const [form, setForm] = useState<SteuerForm>(EMPTY_STEUER);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfName, setPdfName] = useState("readyexpat-steuer-answer-sheet.pdf");
  const [sessionError, setSessionError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");
  setModuleLang(lang); // copy helpers read the module-level language during this render
  const changeLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      setLangState(saved === "de" || saved === "en" ? saved : navigator.language.toLowerCase().startsWith("de") ? "de" : "en");
    } catch {}
  }, []);
  const withLang = (node: React.ReactNode) => <LangCtx.Provider value={{ lang, setLang: changeLang }}>{node}</LangCtx.Provider>;

  // Restore from localStorage + handle Stripe return + devtest flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
    if (devToken && new URLSearchParams(window.location.search).get("devtest") === devToken) {
      sessionStorage.setItem("devtest", devToken);
    }
    if (localStorage.getItem(DONE_KEY) === "1") {
      // Returning paid user. If the form data is still here, rebuild the PDF
      // locally and show the full sheet again (audit E1 — the deliverable must
      // survive a tab close). Only when the data is truly gone show the
      // support banner.
      let saved: any = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        saved = raw ? JSON.parse(raw).form : null;
      } catch {}
      if (saved?.firstName && saved?.activityDesc) {
        setForm({ ...EMPTY_STEUER, ...saved });
        setPhase("generating"); // re-generates the PDF from local data
      } else {
        setSessionError(true);
        setPhase("done");
      }
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setForm({ ...EMPTY_STEUER, ...JSON.parse(raw).form }); } catch {}
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "verified") {
      window.history.replaceState({}, "", "/freelance-steuer");
      setPhase("generating");
    }
  }, []);

  // Persist form
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ form })); } catch {}
  }, [form]);

  // Lock done page — prevent back-button from re-entering wizard/payment
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

  // Generate answer sheet when entering "generating"
  useEffect(() => {
    if (phase !== "generating") return;
    const savedForm = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw).form ?? null;
      } catch { return null; }
    })();
    const sourceForm = savedForm ?? form;
    if (!sourceForm?.firstName || !sourceForm?.activityDesc) {
      setSessionError(true);
      localStorage.setItem(DONE_KEY, "1");
      setPhase("done");
      return;
    }
    const merged: SteuerForm = { ...EMPTY_STEUER, ...sourceForm };
    setForm(merged);
    buildSteuerPDF(merged).then(({ bytes, name }) => {
      setPdfBytes(bytes);
      setPdfName(name);
      localStorage.setItem(DONE_KEY, "1");
      setSessionError(false);
      setPhase("done");
    }).catch(() => {
      // PDF failed — the on-screen sheet still works. Surface it (audit E5).
      setPdfError(true);
      localStorage.setItem(DONE_KEY, "1");
      setSessionError(false);
      setPhase("done");
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild the PDF in the new language when it is switched on the done page
  useEffect(() => {
    if (phase !== "done" || sessionError) return;
    buildSteuerPDF({ ...EMPTY_STEUER, ...form }).then(({ bytes, name }) => setPdfBytes(bytes)).catch(() => {});
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DONE_KEY);
    setForm(EMPTY_STEUER);
    setPdfBytes(null);
    setSessionError(false);
    setConfirmRestart(false);
    setPhase("landing");
    setStepId("goal");
  }, []);

  if (phase === "landing") {
    return withLang(<SteuerLanding onStart={() => { setPhase("wizard"); setStepId("goal"); window.scrollTo(0, 0); }} />);
  }

  if (phase === "payment") {
    return <SteuerPayment form={form} onDevSkip={() => setPhase("generating")} onBack={() => { setPhase("wizard"); setStepId("review"); window.scrollTo(0, 0); }} />;
  }

  if (phase === "generating") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid #e8ecf4", borderTopColor: BLUE, borderRadius: "50%", margin: "0 auto 18px", animation: "steuerspin 0.8s linear infinite" }} />
          <style>{`@keyframes steuerspin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{L("Preparing your answer sheet…", "Dein Antwortblatt wird erstellt…")}</p>
          <p style={{ color: MUTED, fontSize: 14 }}>{L("Generated locally in your browser", "Lokal in deinem Browser")}</p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return withLang(
      <>
        <SteuerDone form={form} pdfBytes={pdfBytes} pdfName={pdfName} sessionError={sessionError} pdfError={pdfError} onRestart={() => setConfirmRestart(true)} />
        {confirmRestart && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8, color: NAVY }}>Clear &amp; restart?</h3>
              <p style={{ color: MUTED, marginBottom: 20 }}>{L("Your answers will be removed from this browser. Keep the PDF first if you still need it.", "Deine Antworten werden aus diesem Browser gelöscht. Sichere vorher das PDF, falls du es noch brauchst.")}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleRestart} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{L("Clear & restart", "Löschen & neu starten")}</button>
                <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, background: "#f1f5f9", color: NAVY, border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{L("Keep my data", "Daten behalten")}</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return withLang(
    <SteuerWizard
      form={form} setForm={setForm}
      stepId={stepId} setStepId={setStepId}
      onDone={() => { setPhase("generating"); window.scrollTo(0, 0); }}
      onHome={() => setPhase("landing")}
      onRestart={handleRestart}
    />
  );
}
