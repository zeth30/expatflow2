"use client";
import { useState } from "react";
import Link from "next/link";

const GUIDES = [
  { label: "What is the Anmeldung?", href: "/what-is-anmeldung" },
  { label: "Online Registration — Non-EU", href: "/anmeldung-online-non-eu" },
  { label: "Documents Checklist", href: "/anmeldung-documents" },
  { label: "Wohnungsgeberbestätigung", href: "/wohnungsgeberbestaetigung" },
  { label: "Bürgeramt Appointment Guide", href: "/burgeramt-berlin-appointment" },
  { label: "FAQ — All Questions", href: "/faq" },
];

export function GuideNav({ currentPage }: { currentPage?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
      <style>{`
        .gnav-wrap{max-width:1100px;margin:0 auto;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 40px}
        .gnav-hide{display:flex}
        .gnav-cta{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:10px;background:#0f172a;color:white;font-weight:700;font-size:13px;text-decoration:none;letter-spacing:-0.01em;white-space:nowrap;font-family:inherit}
        @media(max-width:640px){
          .gnav-wrap{padding:0 16px}
          .gnav-hide{display:none}
          .gnav-cta{padding:8px 14px;font-size:12px}
        }
      `}</style>
      <div style={{ background: "rgba(255,255,255,0.99)", borderBottom: "1px solid #e8ecf4", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="gnav-wrap">
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "-0.05em" }}>R</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
                ReadyExpat <span style={{ color: "#0075FF" }}>Berlin</span>
              </span>
            </Link>
            <div className="gnav-hide" style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: open ? "1.5px solid #bfdbfe" : "1.5px solid transparent", background: open ? "#eff6ff" : "transparent", color: open ? "#0075FF" : "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
              >
                Guides
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open && (
                <>
                  <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, minWidth: 260, background: "white", borderRadius: 14, border: "1.5px solid #e8ecf4", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden", animation: "gnav-slide 0.15s ease" }}>
                    <style>{`@keyframes gnav-slide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    <div style={{ padding: "6px" }}>
                      {GUIDES.map(g => (
                        <a
                          key={g.href}
                          href={g.href}
                          style={{ display: "block", padding: "9px 12px", borderRadius: 9, textDecoration: "none", color: currentPage === g.href.slice(1) ? "#0075FF" : "#0f172a", fontWeight: currentPage === g.href.slice(1) ? 700 : 500, fontSize: 13.5, background: currentPage === g.href.slice(1) ? "#eff6ff" : "transparent", transition: "background 0.12s" }}
                          onMouseEnter={e => { if (currentPage !== g.href.slice(1)) (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc"; }}
                          onMouseLeave={e => { if (currentPage !== g.href.slice(1)) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                        >
                          {g.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <a href="/#wizard/origin" className="gnav-cta">
            Prepare My Anmeldung
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
