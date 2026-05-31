import Link from "next/link";
import { SIDEBAR_GUIDES as GUIDES } from "./guides-data";

export function GuidePageNav({ activeId }: { activeId: string }) {
  const idx = GUIDES.findIndex((g) => g.id === activeId);
  const prev = GUIDES[idx - 1];
  const next = GUIDES[idx + 1];

  return (
    <div className="pagenav">
      {prev ? (
        <Link href={prev.href}>
          <div className="lbl">← Previous</div>
          <div className="ttl">{prev.num} · {prev.ttl}</div>
        </Link>
      ) : (
        <div className="empty" />
      )}
      {next ? (
        <Link href={next.href} className="next">
          <div className="lbl">Next →</div>
          <div className="ttl">{next.num} · {next.ttl}</div>
        </Link>
      ) : (
        <div className="empty" />
      )}
    </div>
  );
}
