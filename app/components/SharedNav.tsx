"use client";
import { useState } from "react";
import Link from "next/link";

const GUIDE_ITEMS = [
  {
    href: "/what-is-anmeldung",
    label: "What is the Anmeldung?",
    desc: "Legal basis, deadlines, what you get, and what happens after registration.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    href: "/anmeldung-online-non-eu",
    label: "Online Registration — Non-EU",
    desc: "Why non-EU citizens cannot register online and exactly what to do instead.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    href: "/anmeldung-documents",
    label: "Documents Checklist",
    desc: "Every document required at your Bürgeramt appointment, by situation.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2" ry="2"/><path d="M9 14l2 2 4-4"/></svg>,
  },
  {
    href: "/wohnungsgeberbestaetigung",
    label: "Landlord Confirmation",
    desc: "How to get your landlord to sign — and what to do if they refuse.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    href: "/burgeramt-berlin-appointment",
    label: "Bürgeramt Appointment Guide",
    desc: "Finding a slot, outer-district strategy, and what to do at the counter.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
];

export function SharedNav({ onStart, currentPage }: { onStart?: () => void; currentPage?: string }) {
  const [menuOpen, setMenuOpen] = useState<"guides" | "services" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const chevron = (open: boolean) => (
    <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
      <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ctaHref = "/#wizard/origin";

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
      <style>{`
        .snav-pad{padding:0 40px}
        .snav-hide{display:flex}
        .snav-cta{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:10px;background:#0f172a;color:white;font-weight:700;font-size:13px;text-decoration:none;letter-spacing:-0.01em;white-space:nowrap;font-family:inherit;border:none;cursor:pointer}
        .snav-ham{display:none;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1.5px solid #e8ecf4;background:white;cursor:pointer;padding:0;color:#374151;flex-shrink:0}
        .snav-mob-drawer{display:none;border-top:1px solid #e8ecf4;background:white;padding:8px 16px 20px;max-height:80vh;overflow-y:auto}
        .snav-dropdown{display:block}
        .snav-megagrid{display:grid}
        @keyframes menuSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){.snav-megagrid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:640px){
          .snav-pad{padding:0 16px}
          .snav-hide{display:none!important}
          .snav-cta{display:none}
          .snav-ham{display:flex}
          .snav-mob-drawer{display:block}
          .snav-dropdown{display:none!important}
        }
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.99)", borderBottom: "1px solid #e8ecf4", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <nav className="snav-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Left: logo + dropdowns */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", letterSpacing: "-0.02em" }}>ReadyExpat <span style={{ color: "#0075FF" }}>Berlin</span></span>
              </Link>

              {/* Guides — blue */}
              <button
                className="snav-hide"
                onClick={() => setMenuOpen(o => o === "guides" ? null : "guides")}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: menuOpen === "guides" ? "1.5px solid #0075FF" : "1.5px solid transparent", background: menuOpen === "guides" ? "#eff6ff" : "transparent", color: "#0075FF", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
              >
                Guides {chevron(menuOpen === "guides")}
              </button>

              {/* Services */}
              <button
                className="snav-hide"
                onClick={() => setMenuOpen(o => o === "services" ? null : "services")}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: menuOpen === "services" ? "1.5px solid #bfdbfe" : "1.5px solid transparent", background: menuOpen === "services" ? "#eff6ff" : "transparent", color: menuOpen === "services" ? "#0075FF" : "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
              >
                Services {chevron(menuOpen === "services")}
              </button>
            </div>

            {/* Right: FAQ + CTA + hamburger */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <a href="/faq" className="snav-hide" style={{ color: "#374151", fontWeight: 600, fontSize: 13, textDecoration: "none", padding: "6px 10px", borderRadius: 8 }}>FAQ</a>
              {onStart ? (
                <button onClick={onStart} className="snav-cta">
                  Prepare My Anmeldung
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <a href={ctaHref} className="snav-cta">
                  Prepare My Anmeldung
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              <button className="snav-ham" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
                {mobileOpen
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2 2 14" stroke="#374151" strokeWidth="2" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"/></svg>
                }
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="snav-mob-drawer" style={{ position: "relative", zIndex: 50 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 0 6px" }}>Guides</div>
          {GUIDE_ITEMS.map(g => (
            <a key={g.href} href={g.href} onClick={() => setMobileOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9", textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{g.icon}</div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{g.label}</span>
            </a>
          ))}
          <a href="/faq" onClick={() => setMobileOpen(false)}
            style={{ display: "block", padding: "12px 0", fontSize: 13.5, fontWeight: 600, color: "#0f172a", textDecoration: "none", borderBottom: "1px solid #f1f5f9" }}>
            FAQ
          </a>
          <div style={{ paddingTop: 14 }}>
            {onStart ? (
              <button onClick={() => { setMobileOpen(false); onStart(); }}
                style={{ width: "100%", padding: "13px", borderRadius: 10, background: "#0f172a", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Prepare My Anmeldung →
              </button>
            ) : (
              <a href={ctaHref} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "13px", borderRadius: 10, background: "#0f172a", color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
                Prepare My Anmeldung →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(menuOpen || mobileOpen) && <div onClick={() => { setMenuOpen(null); setMobileOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 39 }} />}

      {/* Guides mega-menu */}
      {menuOpen === "guides" && (
        <div className="snav-dropdown" style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "white", borderBottom: "1px solid #e8ecf4", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", padding: "28px 40px 32px", animation: "menuSlide 0.18s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Anmeldung Guides</div>
            <div className="snav-megagrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {GUIDE_ITEMS.map(g => {
                const isCurrent = currentPage === g.href.slice(1);
                return (
                  <a key={g.href} href={g.href} onClick={() => setMenuOpen(null)}
                    style={{ display: "block", padding: "18px 20px", borderRadius: 16, border: `1.5px solid ${isCurrent ? "#0075FF" : "#bfdbfe"}`, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", textDecoration: "none", transition: "box-shadow 0.15s" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: isCurrent ? "#0075FF" : "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      {g.icon}
                    </div>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 13.5, marginBottom: 5 }}>{g.label}</div>
                    <div style={{ fontSize: 12, color: "#1d4ed8", lineHeight: 1.55, marginBottom: 12 }}>{g.desc}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#0075FF" }}>
                      {isCurrent ? "You are here" : "Read guide"}
                      {!isCurrent && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5h6M5 2l3 3-3 3" stroke="#0075FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Services mega-menu */}
      {menuOpen === "services" && (
        <div className="snav-dropdown" style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "white", borderBottom: "1px solid #e8ecf4", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", padding: "28px 40px 32px", animation: "menuSlide 0.18s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Services</div>
            <div className="snav-megagrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>

              {/* Anmeldung — active service */}
              {onStart ? (
                <button onClick={() => { setMenuOpen(null); onStart(); }}
                  style={{ textAlign: "left", display: "block", padding: "20px", borderRadius: 16, border: "2px solid #0075FF", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", width: "100%" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>Bürgeramt Anmeldung <span style={{ fontWeight: 500, color: "#64748b", fontSize: 12 }}>(Registration)</span></div>
                  <div style={{ fontSize: 12.5, color: "#1d4ed8", lineHeight: 1.5 }}>Auto-generated official form — 54 fields in perfect German — plus your personalised document checklist.</div>
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#0075FF" }}>
                    Start now
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="#0075FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </button>
              ) : (
                <a href={ctaHref} onClick={() => setMenuOpen(null)}
                  style={{ display: "block", padding: "20px", borderRadius: 16, border: "2px solid #0075FF", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", textDecoration: "none", transition: "all 0.15s" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>Bürgeramt Anmeldung <span style={{ fontWeight: 500, color: "#64748b", fontSize: 12 }}>(Registration)</span></div>
                  <div style={{ fontSize: 12.5, color: "#1d4ed8", lineHeight: 1.5 }}>Auto-generated official form — 54 fields in perfect German — plus your personalised document checklist.</div>
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#0075FF" }}>
                    Start now
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="#0075FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </a>
              )}

              {/* Steuerliche Erfassung — coming soon */}
              <div style={{ padding: "20px", borderRadius: 16, border: "1.5px solid #e8ecf4", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>COMING SOON</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div style={{ fontWeight: 800, color: "#94a3b8", fontSize: 15, marginBottom: 4 }}>Steuerliche Erfassung</div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>Freelancer tax registration (Fragebogen zur steuerlichen Erfassung) — simplified, in English.</div>
              </div>

              {/* Elterngeld — coming soon */}
              <div style={{ padding: "20px", borderRadius: 16, border: "1.5px solid #e8ecf4", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>COMING SOON</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div style={{ fontWeight: 800, color: "#94a3b8", fontSize: 15, marginBottom: 4 }}>Elterngeld</div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>Parental allowance application — guided in English, submitted correctly the first time.</div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
