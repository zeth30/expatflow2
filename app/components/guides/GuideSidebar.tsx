"use client";
import { useState } from "react";
import Link from "next/link";
import { GUIDES } from "./guides-data";
export { GUIDES };

export function GuideSidebar({ activeId }: { activeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="sb-toggle" aria-label="Open menu" onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 89 }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar${open ? " open" : ""}`}>
        <Link className="brand" href="/" onClick={() => setOpen(false)} style={{ letterSpacing: "-0.02em", fontSize: 15 }}>
          <span style={{ fontWeight: 800, color: "#0f172a" }}>SimplyExpat <span style={{ color: "#0075FF" }}>Berlin</span></span>
        </Link>

        <div className="sb-trust">
          <span className="d" />
          Updated May 2026
        </div>

        <div>
          <div className="sb-eyebrow">Anmeldung Guides</div>
          <div className="sb-list">
            {GUIDES.map((g) => (
              <Link
                key={g.id}
                className={`sb-link${g.id === activeId ? " active" : ""}`}
                href={g.href}
                onClick={() => setOpen(false)}
              >
                <span className="num">{g.num}</span>
                <span>
                  <span className="ttl">{g.ttl}</span>
                  <span className="sub">{g.sub}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="sb-eyebrow">Resources</div>
          <div className="sb-list">
            <Link
              className={`sb-link${activeId === "faq" ? " active" : ""}`}
              href="/faq"
              onClick={() => setOpen(false)}
            >
              <span className="num" style={{ fontSize: 15 }}>?</span>
              <span>
                <span className="ttl">FAQ</span>
                <span className="sub">20 common questions</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="sb-spacer" />

        <Link className="sb-cta" href="/#wizard/origin" onClick={() => setOpen(false)}>
          Prepare My Anmeldung
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="sb-foot">
          For general info only · verify at{" "}
          <a href="https://www.berlin.de" target="_blank" rel="noopener">
            berlin.de
          </a>
        </div>
      </aside>
    </>
  );
}
