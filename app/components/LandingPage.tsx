"use client";
import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SharedNav } from "./SharedNav";

export function LandingPage({ onStart, onDownloadWG }: { onStart: () => void; onDownloadWG: () => void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div className="fu" style={{ background: "white" }}>
      <style>{`
        .stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:640px){
          .lp-h1{font-size:32px!important;line-height:1.1!important}
          .lp-sub{font-size:14px!important}
          .lp-guides-sect{padding:32px 20px!important}
          .lp-guide-gap{margin-bottom:32px!important}
          .lp-cta-btn{width:100%!important;justify-content:center!important}
          .stats-strip{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
      <SharedNav onStart={onStart} />

      {/* ══ HERO ══ */}
      <div style={{ background: "white", borderBottom: "1px solid #e8ecf4" }}>
        <div className="hero-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Trust badge */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "5px 14px" }}>
              <CheckCircle2 size={11} color="#16a34a" />
              <span style={{ color: "#15803d", fontSize: 12, fontWeight: 700 }}>Trusted by 100+ expats in Berlin</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="lp-h1" style={{ fontSize: 54, fontWeight: 900, color: "#0f172a", lineHeight: 1.06, marginBottom: 12, letterSpacing: "-0.035em", maxWidth: 700 }}>
            Your Anmeldung form,<br />
            <span style={{ color: "#0075FF" }}>filled in 5 minutes.</span>
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", fontWeight: 600, marginBottom: 32, letterSpacing: "-0.005em" }}>
            In English. No German required.
          </p>

          {/* Two columns */}
          <div className="hero-grid" style={{ alignItems: "start" }}>

            {/* Left: copy + CTA */}
            <div>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
                Moving to Berlin is exciting. German paperwork isn't.<br />
                Answer a few simple questions in English — we handle the rest. Your completed, print-ready Anmeldung PDF in 5 minutes. For anyone moving to Berlin, wherever you're from.
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
              <button onClick={onStart} className="lp-cta-btn"
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "17px 34px", borderRadius: 13, background: hov ? "#0066ee" : "#0075FF", color: "white", fontWeight: 900, fontSize: 17, border: "none", boxShadow: hov ? "0 16px 48px rgba(0,117,255,0.45)" : "0 6px 24px rgba(0,117,255,0.3)", transform: hov ? "translateY(-2px)" : "none", transition: "all 0.18s", letterSpacing: "-0.01em", cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
                Prepare My Anmeldung <ArrowRight size={18} />
              </button>
              <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: "0 0 14px", letterSpacing: "0.01em" }}>
                €15 · One-time · No account needed
              </p>
            </div>

            {/* Right: form preview */}
            <div className="hero-berlin-img" style={{ borderRadius: 20, background: "linear-gradient(145deg,#eef3fb,#f0f4fa)", border: "1px solid #e8ecf4", boxShadow: "0 12px 48px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", minHeight: 460 }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
                <div style={{ position: "absolute", inset: 0, transform: "rotate(2deg) translateY(6px)", borderRadius: 4, background: "white", boxShadow: "0 4px 18px rgba(0,0,0,0.10)" }} />
                <div style={{ position: "absolute", inset: 0, transform: "rotate(-1deg) translateY(3px)", borderRadius: 4, background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }} />
                <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.16)", background: "white" }}>
                  <img
                    src="/anmeldung-form.png"
                    alt="Official Berlin Anmeldung form filled in German"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
                <div style={{ position: "absolute", bottom: -14, right: -14, background: "#0075FF", color: "white", borderRadius: 10, padding: "8px 13px", boxShadow: "0 6px 20px rgba(0,117,255,0.4)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <CheckCircle2 size={13} color="white" />
                  <span style={{ fontSize: 12, fontWeight: 800 }}>54 fields · Perfect German</span>
                </div>
              </div>
            </div>

          </div>

          {/* Stats strip */}
          <div className="stats-strip" style={{ marginTop: 36, paddingTop: 32, borderTop: "1px solid #e8ecf4" }}>
            {[
              { v: "54", l: "Fields filled in German" },
              { v: "5 min", l: "Average completion" },
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

      {/* ══ BERLIN PHOTO BAND ══ */}
      <div style={{ position: "relative", height: 380, backgroundImage: "url('/berlin-skyline.jpg')", backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            52°31′N · 13°24′E · BERLIN
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", justifyContent: "center", maxWidth: 680 }}>
            {["Mitte","Prenzlauer Berg","Kreuzberg","Charlottenburg","Neukölln","Friedrichshain","Tempelhof","Spandau","Steglitz","Treptow","Lichtenberg","Reinickendorf"].map(d => (
              <span key={d} style={{ fontSize: 11, color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 20, padding: "3px 10px", fontWeight: 600, background: "white" }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ GUIDES + FAQ ══ */}
      <div className="lp-guides-sect" style={{ background: "linear-gradient(to bottom, white 0px, #f8fafc 72px, #f8fafc calc(100% - 72px), white 100%)", borderBottom: "1px solid #e8ecf4", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Guide cards */}
          <div className="lp-guide-gap" style={{ marginBottom: 64 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#0075FF", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Free Guides</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 8 }}>
                Everything you need to know before your appointment
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Step-by-step guides covering every part of the Anmeldung process.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {[
                { href: "/what-is-anmeldung", label: "What is the Anmeldung?", desc: "Legal basis, deadlines, what you get, and what happens after.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
                { href: "/anmeldung-online-non-eu", label: "Online Registration — Non-EU", desc: "Why non-EU citizens cannot register online and what to do instead.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
                { href: "/anmeldung-documents", label: "Documents Checklist", desc: "Every document required at your appointment, by situation.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2" ry="2"/><path d="M9 14l2 2 4-4"/></svg> },
                { href: "/wohnungsgeberbestaetigung", label: "Landlord Confirmation", desc: "How to get your landlord to sign — and what if they refuse.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                { href: "/burgeramt-berlin-appointment", label: "Bürgeramt Appointment", desc: "Finding a slot, outer-district strategy, and what to do at the counter.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              ].map(g => (
                <a key={g.href} href={g.href}
                  style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 16, border: "1.5px solid #bfdbfe", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", textDecoration: "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                    {g.icon}
                  </div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, lineHeight: 1.3 }}>{g.label}</div>
                  <div style={{ fontSize: 13, color: "#1d4ed8", lineHeight: 1.55, flexGrow: 1 }}>{g.desc}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#0075FF" }}>
                    Read guide <ArrowRight size={11} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ preview */}
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Common Questions</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 8 }}>
                The questions expats ask most
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Quick answers — no German required.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { q: "When do you have to do Anmeldung?", a: "You have 14 days from your move-in date under §17 BMG. The law allows fines up to €1,000 for late registration — but in practice this is extremely rare. In Berlin, most offices are booked 3–4 weeks out, so book the earliest slot you can find and keep a screenshot as evidence." },
                { q: "What documents do I need for Anmeldung?", a: "Your passport or national ID, the Wohnungsgeberbestätigung (landlord confirmation), and your completed Anmeldung form. Non-EU nationals should also bring their visa or residence permit." },
                { q: "Can I do the Anmeldung online?", a: "Only if you are an EU/EEA citizen with a German eID chip, already registered in Germany, and moving within Germany. The vast majority of expats — including all non-EU nationals — must register in person." },
              ].map(({ q, a }) => (
                <div key={q} style={{ padding: "18px 22px", borderRadius: 12, border: "1.5px solid #e8ecf4", background: "white" }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14.5, marginBottom: 7 }}>{q}</div>
                  <div style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.7 }}>{a}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <a href="/faq" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 26px", borderRadius: 10, border: "2px solid #e8ecf4", background: "white", color: "#0f172a", fontWeight: 700, fontSize: 13.5, textDecoration: "none", letterSpacing: "-0.01em" }}>
                See all 20 questions <ArrowRight size={13} />
              </a>
            </div>
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
            Perfect German form. Personalised checklist. Zero data stored. Ready in 5 minutes.
          </p>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "#0075FF", color: "white", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em", boxShadow: "0 8px 28px rgba(0,117,255,0.4)" }}>
            Get started <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
