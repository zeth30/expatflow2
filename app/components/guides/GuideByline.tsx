"use client";

type Props = {
  updated: string;
};

export function GuideByline({ updated }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.8rem",
        color: "rgba(255,255,255,0.65)",
        marginTop: "1rem",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(255,255,255,0.12)",
          borderRadius: "99px",
          padding: "0.2rem 0.65rem",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        ReadyExpat Editorial Team
      </span>
      <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
      <span>Last updated: {updated}</span>
    </div>
  );
}
