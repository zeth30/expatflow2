"use client";
import { useState } from "react";

const EMAIL_EN = `Subject: Wohnungsgeberbestätigung for Anmeldung

Hello [Landlord name],

I am moving into [full address] on [DD.MM.YYYY]. To complete my Anmeldung at the Bürgeramt, I need the Wohnungsgeberbestätigung as required by §19 Bundesmeldegesetz.

Could you please send me a signed copy of the form? Thank you — please let me know if you need anything from me.

Best regards,
[Your name]`;

const EMAIL_DE = `Betreff: Wohnungsgeberbestätigung für Anmeldung

Sehr geehrte/r [Name],

ich ziehe am [DD.MM.YYYY] in die Wohnung in [vollständige Adresse] ein. Für meine Anmeldung beim Bürgeramt benötige ich gemäß §19 Bundesmeldegesetz die Wohnungsgeberbestätigung.

Könnten Sie mir bitte ein unterschriebenes Exemplar zukommen lassen? Vielen Dank — bitte lassen Sie mich wissen, falls Sie noch etwas von mir benötigen.

Mit freundlichen Grüßen,
[Ihr Name]`;

export function EmailTemplateClient() {
  const [lang, setLang]       = useState<"en" | "de">("en");
  const [copied, setCopied]   = useState(false);

  const text = lang === "en" ? EMAIL_EN : EMAIL_DE;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 22, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase" }}>Email template</div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.015em", marginTop: 2 }}>Send this when requesting the form</div>
        </div>
        {/* Language tabs */}
        <div style={{ display: "inline-flex", padding: 4, background: "#f1f3f9", borderRadius: 999 }}>
          {(["en", "de"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{ all: "unset", cursor: "pointer", padding: "8px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13.5, background: lang === l ? "var(--ink)" : "transparent", color: lang === l ? "white" : "var(--muted)", transition: "all .15s", fontFamily: "inherit" }}
            >
              {l === "en" ? "English" : "Deutsch"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 26px", fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono',monospace" }}>
        {text}
      </div>

      <button
        onClick={handleCopy}
        style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: copied ? "var(--green)" : "var(--ink)", color: "white", borderRadius: 999, fontWeight: 700, fontSize: 13.5, marginTop: 14, transition: "background .2s", fontFamily: "inherit" }}
      >
        {copied
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy email to clipboard</>}
      </button>
    </div>
  );
}
