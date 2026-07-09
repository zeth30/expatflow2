"use client";
// ═══════════════════════════════════════════════════════════════════
//  EASY FRAGEBOGEN ZUR STEUERLICHEN ERFASSUNG · page.tsx
//  English copilot for the ELSTER tax registration questionnaire
//  (FsE EUn, solo freelancers). Staging route — not linked from nav.
//
//  Phases: landing → wizard → payment → generating → done
//  Data:   localStorage only (simplyexpat-steuer-v1) — never sent to server
//  Legal:  explains, never recommends (§ 6 Nr. 3 StBerG pattern) —
//          see docs/superpowers/specs/2026-07-06-…-design.md §2
// ═══════════════════════════════════════════════════════════════════

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
  STEUER_STEPS, stepError, buildAnswerRows,
} from "./steuer-data";
import { buildSteuerPDF } from "./steuer-pdf";
import { SteuerSimulator } from "./SteuerSimulator";
import { FieldInput as EngineFieldInput } from "../components/form-engine/FieldInput";

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
      {ok ? <Check size={12} /> : <CopyIcon size={12} />} {ok ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Field renderer (shared form engine) ──────────────────────────
function FieldInput({ fd, form, setForm }: { fd: FieldDef; form: SteuerForm; setForm: (f: SteuerForm) => void }) {
  return <EngineFieldInput fd={fd} form={form} setForm={setForm} decisionHelp="Check ELSTER's official help for this field or ask a Steuerberater." />;
}

// ─── Landing page ─────────────────────────────────────────────────
function SteuerLanding({ onStart }: { onStart: () => void }) {
  const [showSim, setShowSim] = useState(false);
  const FAQ = [
    { q: "Can I fill in the Fragebogen zur steuerlichen Erfassung in English?", a: "The official ELSTER form exists only in German — there is no English version. That's exactly what this tool solves: you answer every question in plain English, and you get each German entry ready to copy into ELSTER, matched to ELSTER's own field numbers." },
    { q: "What's the difference between Steuer-ID and Steuernummer?", a: "The Steuer-ID (steuerliche Identifikationsnummer) is the 11-digit number every resident gets by post after their Anmeldung — it never changes. The Steuernummer is a separate number the Finanzamt assigns for your tax file; as a new freelancer you receive it AFTER submitting this Fragebogen. You need the Steuer-ID to fill the form, and you get the Steuernummer as the result." },
    { q: "Am I a Freiberufler or do I have a Gewerbe?", a: "That classification is made by the Finanzamt based on what your activity actually is — liberal professions like software development, design, writing, teaching or consulting are typically freiberuflich, while trading and most commercial activities are gewerblich. The form asks you to describe your activity precisely; the Finanzamt decides the category. If your case is unclear, ask your Finanzamt or a Steuerberater." },
    { q: "Is this tax advice?", a: "No. We translate and explain what each field of the official form means, in plain English. Every entry and every choice is yours — this is mechanical assistance based on your own instructions (§ 6 Nr. 3 StBerG). For advice on what is right for your personal situation, consult a licensed Steuerberater." },
    { q: "Do I need an ELSTER account first?", a: "Yes. The form can only be submitted through your personal ELSTER account. Our free step-by-step guide on this page shows exactly how to get one as a new arrival — plan for the activation letter, which arrives by post and typically takes a few days up to two weeks." },
    { q: "What if my income estimates turn out wrong?", a: "Estimates are expected to be estimates. You can correct them later by writing to your Finanzamt, and your actual tax is always settled with your annual tax return — the estimates only affect advance payments." },
    { q: "I'm employed AND starting freelance work on the side. Does this work for me?", a: "Yes. The form has fields for both freelance profit and employment income — the wizard asks for both." },
    { q: "Can I get a refund?", a: "The answer sheet is a digital service delivered immediately after payment. As with our Anmeldung product, you consent at checkout to immediate delivery and waive the 14-day right of withdrawal (§ 356 BGB). If something is wrong with your sheet, email info@readyexpat.de and we will make it right." },
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SharedNav />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: "72px 20px 88px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(0,117,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,117,255,0.18)", border: "1px solid rgba(96,165,250,0.4)", borderRadius: 999, padding: "5px 14px", marginBottom: 22 }}>
            <span style={{ color: "#93c5fd", fontSize: 11.5, fontWeight: 700 }}>New · Freelancer tax registration · Beta</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px,5vw,44px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.12, marginBottom: 16 }}>
            The German freelancer tax form,<br /><span style={{ color: "#60a5fa" }}>in English.</span>
          </h1>
          <p style={{ color: "rgba(191,219,254,0.85)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 28px" }}>
            Starting freelance work in Germany shouldn&apos;t require a law degree in German. But every new freelancer must submit the <strong style={{ color: "white" }}>Fragebogen zur steuerlichen Erfassung</strong> — online, via ELSTER, in German, within one month of starting. That&apos;s where we come in: you answer in plain English, and we hand you every German entry, ready to copy.
          </p>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 14, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 900, fontSize: 16, border: "none", boxShadow: "0 8px 32px rgba(0,117,255,0.45)", cursor: "pointer", fontFamily: "inherit" }}>
            Start in English <ArrowRight size={18} />
          </button>
          <p style={{ color: "rgba(147,197,253,0.7)", fontSize: 12.5, marginTop: 12 }}>€15 · One-time · No account needed</p>
          <p style={{ color: "rgba(147,197,253,0.55)", fontSize: 12, marginTop: 4 }}>From the team behind the ReadyExpat Anmeldung form filler</p>

          {/* Privacy trust block */}
          <div style={{ maxWidth: 560, margin: "28px auto 0", padding: "14px 18px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", gap: 12, textAlign: "left" }}>
            <Lock size={17} color="#86efac" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#bbf7d0", fontSize: 13, lineHeight: 1.65 }}>
              <strong style={{ color: "#dcfce7" }}>Your data never touches our servers.</strong> Everything you type — your tax ID, IBAN, income estimates — stays in your browser and is processed there. We receive only your Stripe payment confirmation. Clear it anytime with one click.
            </p>
          </div>

          {/* Answer-sheet preview — stacked-paper mock of the actual product UI */}
          <div style={{ maxWidth: 440, margin: "40px auto 0", position: "relative", textAlign: "left" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: 14, transform: "rotate(-2.2deg)" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)", borderRadius: 14, transform: "rotate(1.4deg)" }} />
            <div style={{ position: "relative", background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
              <div style={{ background: NAVY, padding: "12px 16px" }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: 13 }}>Anmeldung und Abführung der Umsatzsteuer</div>
                <div style={{ color: "#93c5fd", fontSize: 10.5, marginTop: 1 }}>VAT registration · Section 8 of 8</div>
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: BLUE, fontWeight: 700, fontSize: 10.5, border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}><CopyIcon size={10} /> Copy</span>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: -14, right: -8, background: "#16a34a", color: "white", fontWeight: 800, fontSize: 11, borderRadius: 999, padding: "6px 13px", boxShadow: "0 6px 20px rgba(22,163,74,0.5)" }}>
              ✓ Field numbers match ELSTER
            </div>
          </div>

          {/* Simulator teaser */}
          <button onClick={() => setShowSim(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "11px 22px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.28)", color: "white", fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>
            ▶ Try the practice simulator with sample data
          </button>
          <p style={{ color: "rgba(147,197,253,0.55)", fontSize: 11.5, marginTop: 6 }}>Rehearse every screen of the form — free, nothing transmitted</p>
        </div>
      </div>
      {showSim && <SteuerSimulator form={DEMO_STEUER} onClose={() => setShowSim(false)} />}

      {/* ── What is this form ── */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 8, textAlign: "center" }}>What is the Fragebogen zur steuerlichen Erfassung?</h2>
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: 640, margin: "0 auto 28px", textAlign: "center" }}>
          It&apos;s how the Finanzamt learns that you exist as a freelancer: who you are, what you do, what you expect to earn, and how you&apos;ll handle VAT. After processing it, you receive your <strong>Steuernummer</strong> — the number you need to invoice clients properly.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card icon={<FileText size={17} color={BLUE} />} title="Who must file it">
            Anyone starting self-employed or freelance work in Germany — full-time or on the side. It&apos;s the first official step of your freelance life.
          </Card>
          <Card icon={<Clock size={17} color={BLUE} />} title="The deadline">
            Within <strong>one month</strong> of starting your activity (§ 138 AO) — and &quot;starting&quot; includes preparation like buying equipment or signing contracts.
          </Card>
          <Card icon={<Mail size={17} color={BLUE} />} title="What happens after">
            The Finanzamt processes your answers and sends your Steuernummer by post — processing times vary by Finanzamt. With it, you can invoice correctly.
          </Card>
        </div>
      </div>

      {/* ── Free ELSTER guide ── */}
      <div id="elster-guide" style={{ maxWidth: 780, margin: "0 auto", padding: "56px 20px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "5px 14px", marginBottom: 12 }}>
            <span style={{ color: "#16a34a", fontSize: 11.5, fontWeight: 700 }}>Free guide — no payment needed</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 8 }}>First: get your ELSTER account</h2>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            The form can only be submitted through <strong>Mein ELSTER</strong>, Germany&apos;s official tax portal. Registration is free but takes several days because of a letter sent by post — start this now, even if you fill the form later.
          </p>
        </div>
        {[
          { n: 1, t: "Have your Steuer-ID ready", d: <>Your 11-digit tax ID (Steuerliche Identifikationsnummer) arrives by post 2–4 weeks after your Anmeldung (up to 6–8 weeks in peak season). You need it to register. Lost it? Request it again at bzst.de.</> },
          { n: 2, t: "Register at elster.de", d: <>Go to elster.de → &quot;Benutzerkonto erstellen&quot; (create account). Choose the standard login method <strong>&quot;Zertifikatsdatei&quot;</strong> (certificate file), select &quot;Für mich (und gemeinsam veranlagte Partner)&quot; — for yourself — and identify with your Steuer-ID (&quot;Mit steuerlicher Identifikationsnummer&quot;).</> },
          { n: 3, t: "Wait for two codes", d: <>ELSTER sends an <strong>activation ID by email</strong> immediately and an <strong>activation code by post</strong> — the letter typically takes a few days up to two weeks. This letter is why registering early matters.</> },
          { n: 4, t: "Activate and download your certificate file", d: <>Enter both codes on the link from the email. ELSTER then generates your <strong>.pfx certificate file</strong> — this file plus your password IS your login. Save it somewhere safe (and back it up).</> },
          { n: 5, t: "Open the questionnaire", d: <>Log in to Mein ELSTER → &quot;Alle Formulare&quot; → search &quot;Fragebogen zur steuerlichen Erfassung&quot; → choose <strong>&quot;Aufnahme einer gewerblichen, selbständigen (freiberuflichen) oder land- und forstwirtschaftlichen Tätigkeit&quot;</strong> (Einzelunternehmen). That&apos;s the form our answer sheet mirrors, field by field.</> },
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
            Want more detail on each screen? Read the full ELSTER account guide →
          </a>
        </p>
      </div>

      {/* ── How the product works ── */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 26, textAlign: "center" }}>Then: fill it with confidence</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card icon={<FileText size={17} color={BLUE} />} title="1 · Answer in English">
            10–15 minutes. Every question of the real form, in plain English, with an explanation of what it means and why the Finanzamt asks.
          </Card>
          <Card icon={<CreditCard size={17} color={BLUE} />} title="2 · Pay €15 once">
            Secure Stripe checkout. No account, no subscription — same as our Anmeldung service.
          </Card>
          <Card icon={<CheckCircle2 size={17} color={BLUE} />} title="3 · Copy field by field">
            Your answer sheet opens on screen with a copy button per field — and downloads as a PDF so you can keep it. Open ELSTER next to it: the field numbers match, top to bottom.
          </Card>
        </div>

        {/* Transparency box */}
        <div style={{ marginTop: 20, padding: "18px 20px", borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", gap: 12 }}>
          <AlertCircle size={17} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "#1e3a8a", fontSize: 13.5, lineHeight: 1.7 }}>
            <strong>Why don&apos;t we just give you a filled-out form?</strong> Because Germany abolished the paper version — since 2021 this form can only be submitted through your personal ELSTER account (paper is reserved for rare hardship cases). A &quot;filled PDF&quot; of this form would be paper you can&apos;t submit. What actually helps is having every answer ready in German, in ELSTER&apos;s exact order — on screen to copy from, and as a PDF to keep. That&apos;s what you get.
          </p>
        </div>

        {/* Legal clarity box */}
        <div style={{ marginTop: 12, padding: "18px 20px", borderRadius: 14, background: "white", border: "1px solid #e8ecf4", display: "flex", gap: 12 }}>
          <Shield size={17} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>We are not a Steuerberatung and give no individual tax advice.</strong> We explain what each field means in plain English; every entry and every choice is yours (mechanical assistance per § 6 Nr. 3 StBerG). Where the form asks for a genuine decision — like the Kleinunternehmer-Regelung — we explain the mechanics neutrally and point you to ELSTER&apos;s official help or a Steuerberater.
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 20px 16px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: 22, textAlign: "center" }}>Frequently asked questions</h2>
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
          Start in English <ArrowRight size={18} />
        </button>
        <p style={{ color: "#94a3b8", fontSize: 12.5, marginTop: 12 }}>€15 · One-time · Your data stays in your browser</p>
      </div>

      <AppFooter />
      <CookieBanner />
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────
const WIZ_LABELS: Record<string, string> = {
  elster: "ELSTER account", personal: "About you", identity: "Tax identity", address: "Address", activity: "Activity",
  bank: "Bank", estimates: "Estimates", vat: "VAT", review: "Review",
};

// Condensed ELSTER registration steps (full guide: /elster-account-english)
const ELSTER_MINI = [
  { n: "1", t: "Have your Steuer-ID ready", d: "The 11-digit number that arrived by post after your Anmeldung. Lost? Request at bzst.de." },
  { n: "2", t: "Register at elster.de", d: "“Benutzerkonto erstellen” → login method “Zertifikatsdatei” → “Für mich” → identify with your Steuer-ID." },
  { n: "3", t: "Wait for two codes", d: "Activation ID by email (instant) + activation code by post — typically a few days up to two weeks." },
  { n: "4", t: "Activate & save your certificate file", d: "Enter both codes, download the .pfx file, set a password. File + password = your login. Back it up." },
  { n: "5", t: "Open the form", d: "Log in → “Alle Formulare” → “Fragebogen zur steuerlichen Erfassung” → Einzelunternehmen." },
];
const WIZ_IDS = [...STEUER_STEPS.map(s => s.id), "review"];

function SteuerWizard({
  form, setForm, stepId, setStepId, onDone, onHome, onRestart,
}: {
  form: SteuerForm; setForm: (f: SteuerForm) => void;
  stepId: string; setStepId: (s: string) => void;
  onDone: () => void; onHome: () => void; onRestart: () => void;
}) {
  const [err, setErr] = useState("");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const idx = WIZ_IDS.indexOf(stepId);
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
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 24 }}>zur steuerlichen Erfassung</div>
          {WIZ_IDS.map((id, i) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, marginBottom: 2, background: id === stepId ? "#eff6ff" : "transparent" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: i < idx ? "#16a34a" : id === stepId ? BLUE : "#f1f5f9", color: i < idx || id === stepId ? "white" : "#94a3b8" }}>
                {i < idx ? <Check size={11} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: id === stepId ? 800 : 500, color: id === stepId ? NAVY : MUTED }}>{WIZ_LABELS[id]}</span>
            </div>
          ))}
          <div style={{ marginTop: 26, padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", gap: 8 }}>
            <Lock size={12} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: "#166534", lineHeight: 1.5 }}>Stays in your browser. Nothing is sent to our servers.</p>
          </div>
          <button onClick={() => setConfirmRestart(true)} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#94a3b8", fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", padding: "6px 10px" }}>
            <RotateCcw size={12} /> Clear &amp; restart
          </button>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "40px 32px 80px", maxWidth: 640 }}>
          <div className="steuer-mobile-progress" style={{ marginBottom: 16 }}>
            <div style={{ color: MUTED, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Step {idx + 1} of {WIZ_IDS.length} · {WIZ_LABELS[stepId]}</div>
            <div style={{ height: 4, borderRadius: 2, background: "#e8ecf4" }}>
              <div style={{ height: 4, borderRadius: 2, background: BLUE, width: `${Math.round(((idx + 1) / WIZ_IDS.length) * 100)}%`, transition: "width 0.3s" }} />
            </div>
          </div>
          {stepDef ? (
            <>
              <h2 style={{ fontSize: 23, fontWeight: 800, color: NAVY, marginBottom: 4 }}>{stepDef.title}</h2>
              <p style={{ color: MUTED, marginBottom: 26, fontSize: 14 }}>{stepDef.sub}</p>
              {stepId === "elster" && (
                <div style={{ marginBottom: 26 }}>
                  {ELSTER_MINI.map(s => (
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
                      Full screen-by-screen guide (opens in new tab) →
                    </a>
                  </p>
                </div>
              )}
              {stepDef.fields.map(fd => <FieldInput key={String(fd.key)} fd={fd} form={form} setForm={setForm} />)}
              {stepId === "elster" && form.hasElsterAccount === false && (
                <div style={{ padding: "12px 15px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16, display: "flex", gap: 9 }}>
                  <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: "#166534", fontSize: 12.5, lineHeight: 1.6 }}>
                    <strong>You can still do everything today.</strong> Start the ELSTER registration in a new tab (step 2 above), then keep going here — your answers are saved in this browser, and the sheet plus PDF will be waiting when your activation letter arrives.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 23, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Almost done — here&apos;s your sheet</h2>
              <p style={{ color: MUTED, marginBottom: 26, fontSize: 14 }}>This is the structure of your answer sheet — every ELSTER section and field number, matched to your answers. The finished German entries unlock right after checkout. Use Back anytime to change an answer.</p>
              {buildAnswerRows(form).map(sec => (
                <div key={sec.title} style={{ marginBottom: 22 }}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, padding: "8px 12px", background: "#f1f5f9", borderRadius: 8, marginBottom: 8 }}>{sec.title}</div>
                  {sec.rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "7px 12px", borderBottom: "1px solid #f1f5f9", alignItems: "baseline" }}>
                      <span style={{ color: BLUE, fontWeight: 800, fontSize: 11, width: 26, flexShrink: 0 }}>{r.nr}</span>
                      <span style={{ color: MUTED, fontSize: 12, flex: 1 }}>{r.label}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#94a3b8", fontWeight: 700, fontSize: 11, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 6, padding: "3px 9px", flexShrink: 0 }}>
                        <Lock size={10} /> After checkout
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
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={next} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,117,255,0.3)" }}>
              {stepId === "review" ? "Continue to payment" : "Next"} <ArrowRight size={15} />
            </button>
          </div>
        </main>
      </div>

      {/* Restart modal — top level, outside <aside> (Safari fixed/sticky bug) */}
      {confirmRestart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: NAVY }}>Clear &amp; restart?</h3>
            <p style={{ color: MUTED, marginBottom: 20 }}>All entered data will be removed from your browser.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setConfirmRestart(false); onRestart(); }} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Clear &amp; restart</button>
              <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, background: "#f1f5f9", color: NAVY, border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Keep my data</button>
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
            <div style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Easy Fragebogen — solo freelancer</div>
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
        <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.6 }}>Sent. Check your inbox for your ELSTER next steps.</p>
      </div>
    );
  }
  return (
    <div style={{ padding: "16px 18px", borderRadius: 12, background: "white", border: "1px solid #e8ecf4", marginBottom: 26 }}>
      <div style={{ fontWeight: 800, color: NAVY, fontSize: 13.5, marginBottom: 4 }}>Email yourself the next steps</div>
      <p style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.6, marginBottom: 10 }}>
        The ELSTER activation letter can take up to two weeks — get the 3 next steps in your inbox so nothing slips. Only your first name and email are transmitted; never your form data.
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
          {state === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
      {state === "error" && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 8 }}>Could not send — please try again or email info@readyexpat.de.</p>}
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
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 10 }}>Your answer sheet is ready.</h1>
        <p style={{ color: "rgba(191,219,254,0.8)", fontSize: 15, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.65 }}>
          Open Mein ELSTER in a second tab and work top to bottom — the field numbers match. Download the PDF to keep your answers.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={download} disabled={!pdfBytes} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: pdfBytes ? "linear-gradient(135deg,#16a34a,#15803d)" : "#334155", color: "white", fontWeight: 800, fontSize: 14.5, border: "none", cursor: pdfBytes ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: pdfBytes ? "0 6px 24px rgba(22,163,74,0.4)" : "none" }}>
            <Download size={16} /> Download PDF
          </button>
          <button onClick={() => setShowSim(true)} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 800, fontSize: 14.5, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(0,117,255,0.4)" }}>
            ▶ Practice in the simulator
          </button>
          <a href="https://www.elster.de/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontWeight: 800, fontSize: 14.5, textDecoration: "none", fontFamily: "inherit" }}>
            Open Mein ELSTER <ExternalLink size={15} />
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
                This sheet was generated locally in your browser. Your data was never sent to our servers — it stays here until you clear it.
              </p>
            </div>

            <SteuerEmailOptIn firstName={form.firstName} />

            {sections.map((sec, si) => (
              <div key={sec.title} style={{ marginBottom: 26 }}>
                <div style={{ background: NAVY, borderRadius: "10px 10px 0 0", padding: "12px 16px" }}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{sec.title}</div>
                  <div style={{ color: "#93c5fd", fontSize: 11.5, marginTop: 2 }}>{sec.titleEn} · Section {si + 1} of {sections.length}</div>
                </div>
                <div style={{ background: "white", border: "1px solid #e8ecf4", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
                  {sec.rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < sec.rows.length - 1 ? "1px solid #f1f5f9" : "none", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 22, borderRadius: 6, background: "#eff6ff", color: BLUE, fontWeight: 800, fontSize: 11, flexShrink: 0, padding: "0 6px" }}>{r.nr}</span>
                      <div style={{ flex: "1 1 200px", minWidth: 160 }}>
                        <div style={{ color: MUTED, fontSize: 12, lineHeight: 1.4 }}>{r.label}</div>
                        {r.enHint && <div style={{ color: "#b6c2d1", fontSize: 11, marginTop: 1 }}>{r.enHint}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 220px", justifyContent: "flex-end", minWidth: 200 }}>
                        <span style={{
                          color: r.instruction ? "#92400e" : NAVY, fontWeight: r.instruction ? 700 : 800, fontSize: 13.5,
                          fontStyle: r.instruction ? "italic" : "normal",
                          background: r.instruction ? "#fffbeb" : "#f8fafc",
                          border: r.instruction ? "1px solid #fde68a" : "1px solid #eef2f7",
                          borderRadius: 8, padding: "7px 12px", overflowWrap: "anywhere", textAlign: "right",
                        }}>{r.de || "—"}</span>
                        {r.de && !r.instruction && <CopyValue value={r.de} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ padding: "16px 18px", borderRadius: 12, background: "white", border: "1px solid #e8ecf4", display: "flex", gap: 10 }}>
              <Landmark size={15} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.7 }}>
                <strong style={{ color: NAVY }}>Before you submit in ELSTER:</strong> review every value on ELSTER&apos;s summary screen — you are responsible for your entries. After submitting, ELSTER stores a transmission protocol under &quot;Meine Formulare&quot;; save it. The Finanzamt sends your Steuernummer by post after processing.<br />
                <span style={{ fontSize: 11.5 }}>Field numbers verified against the 2026 form version (fseeun-202401). If ELSTER ever shows a different number, match by the German label next to it — the labels don&apos;t change.</span><br />
                <span style={{ fontSize: 11.5 }}>Not tax advice — you entered every value yourself; ReadyExpat translated and formatted your own answers (§ 6 Nr. 3 StBerG).</span>
              </p>
            </div>
          </>
        )}

        <button onClick={onRestart} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          <RotateCcw size={13} /> Clear my data &amp; start over
        </button>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function FreelanceSteuerPage() {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [stepId, setStepId] = useState<string>("elster");
  const [form, setForm] = useState<SteuerForm>(EMPTY_STEUER);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfName, setPdfName] = useState("readyexpat-steuer-answer-sheet.pdf");
  const [sessionError, setSessionError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

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

  const handleRestart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DONE_KEY);
    setForm(EMPTY_STEUER);
    setPdfBytes(null);
    setSessionError(false);
    setConfirmRestart(false);
    setPhase("landing");
    setStepId("elster");
  }, []);

  if (phase === "landing") {
    return <SteuerLanding onStart={() => { setPhase("wizard"); setStepId("elster"); window.scrollTo(0, 0); }} />;
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
          <p style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>Preparing your answer sheet…</p>
          <p style={{ color: MUTED, fontSize: 14 }}>Generated locally in your browser</p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <>
        <SteuerDone form={form} pdfBytes={pdfBytes} pdfName={pdfName} sessionError={sessionError} pdfError={pdfError} onRestart={() => setConfirmRestart(true)} />
        {confirmRestart && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8, color: NAVY }}>Clear &amp; restart?</h3>
              <p style={{ color: MUTED, marginBottom: 20 }}>Your answers will be removed from this browser. Keep the PDF first if you still need it.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleRestart} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Clear &amp; restart</button>
                <button onClick={() => setConfirmRestart(false)} style={{ flex: 1, background: "#f1f5f9", color: NAVY, border: "none", padding: 10, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Keep my data</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <SteuerWizard
      form={form} setForm={setForm}
      stepId={stepId} setStepId={setStepId}
      onDone={() => { setPhase("payment"); window.scrollTo(0, 0); }}
      onHome={() => setPhase("landing")}
      onRestart={handleRestart}
    />
  );
}
