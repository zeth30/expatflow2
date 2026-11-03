import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PREVIEW_COOKIE, OWNER_FLAG_COOKIE, previewKey } from "./lib/preview";

// Steuer pages are public. Opening them once with ?key=<STEUER_PREVIEW_KEY> marks this
// browser as the owner's (unlocks the paid checkout, see lib/preview.ts).
export function proxy(req: NextRequest) {
  const key = previewKey();
  const given = req.nextUrl.searchParams.get("key");
  if (!given) return NextResponse.next();

  const clean = req.nextUrl.clone();
  clean.searchParams.delete("key");
  const res = NextResponse.redirect(clean);
  if (key && given === key) {
    const opts = { secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 365 };
    res.cookies.set(PREVIEW_COOKIE, key, { ...opts, httpOnly: true });
    res.cookies.set(OWNER_FLAG_COOKIE, "1", opts); // readable by the page to show the pay button
  }
  return res;
}

export const config = {
  matcher: ["/freelance-steuer/:path*", "/elster-account-english/:path*"],
};
